'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X, Upload, FileSpreadsheet, Check, AlertCircle, ChevronRight, 
  ChevronLeft, Loader2, CheckCircle, XCircle, AlertTriangle,
  ArrowRight, RefreshCw, History, Trash2, Download
} from 'lucide-react';
import { DealImport, ImportHistoryEntry } from '@/types/deals';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (deals: DealImport[], history: ImportHistoryEntry) => void;
  existingDeals: { dealId: string; company: string }[];
}

interface ParsedRow {
  [key: string]: string;
}

interface ColumnMapping {
  csvColumn: string;
  targetField: string;
  detectedType: ColumnType;
  isNew: boolean;
}

interface ValidationError {
  row: number;
  column: string;
  value: string;
  message: string;
}

export type { ImportHistoryEntry } from '@/types/deals';

type ColumnType = 'text' | 'number' | 'date' | 'email' | 'phone' | 'currency' | 'unknown';

type ImportStep = 'upload' | 'preview' | 'mapping' | 'validation' | 'importing' | 'complete';

const dealFields = [
  { key: 'dealId', label: 'Deal ID', type: 'text' as ColumnType },
  { key: 'company', label: 'Company', type: 'text' as ColumnType },
  { key: 'dba', label: 'DBA', type: 'text' as ColumnType },
  { key: 'status', label: 'Status', type: 'text' as ColumnType },
  { key: 'flags', label: 'Flags', type: 'text' as ColumnType },
  { key: 'owner', label: 'Owner', type: 'text' as ColumnType },
  { key: 'phone', label: 'Phone', type: 'phone' as ColumnType },
  { key: 'email', label: 'Email', type: 'email' as ColumnType },
  { key: 'products', label: 'Products', type: 'text' as ColumnType },
  { key: 'notes', label: 'Notes', type: 'text' as ColumnType },
  { key: 'originators', label: 'Originators', type: 'text' as ColumnType },
  { key: 'closers', label: 'Closers', type: 'text' as ColumnType },
  { key: 'dateCreated', label: 'Date Created', type: 'date' as ColumnType },
  { key: 'dateUpdated', label: 'Date Updated', type: 'date' as ColumnType },
  { key: 'gurl', label: 'GURL', type: 'number' as ColumnType },
  { key: 'maxOffer', label: 'Max Offer', type: 'currency' as ColumnType },
  { key: 'monthlyRev', label: 'Monthly Revenue', type: 'currency' as ColumnType },
  { key: 'originator', label: 'Originator', type: 'text' as ColumnType },
  { key: 'closer', label: 'Closer', type: 'text' as ColumnType },
];

function detectColumnType(values: string[]): ColumnType {
  const nonEmptyValues = values.filter(v => v && v.trim() !== '');
  if (nonEmptyValues.length === 0) return 'text';

  const sampleSize = Math.min(nonEmptyValues.length, 20);
  const sample = nonEmptyValues.slice(0, sampleSize);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (sample.every(v => emailRegex.test(v))) return 'email';

  const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
  if (sample.every(v => phoneRegex.test(v) && v.replace(/\D/g, '').length >= 7)) return 'phone';

  const dateRegex = /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})$/;
  if (sample.every(v => dateRegex.test(v))) return 'date';

  const currencyRegex = /^\$?[\d,]+\.?\d*$/;
  if (sample.every(v => currencyRegex.test(v.replace(/,/g, '')))) return 'currency';

  const numberRegex = /^-?[\d,]+\.?\d*$/;
  if (sample.every(v => numberRegex.test(v.replace(/,/g, '')))) return 'number';

  return 'text';
}

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseCSVLine(lines[0]);
  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: ParsedRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

function suggestMapping(csvHeader: string): string {
  const normalized = csvHeader.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const mappings: Record<string, string[]> = {
    dealId: ['dealid', 'deal', 'id', 'dealnum', 'dealnumber'],
    company: ['company', 'companyname', 'business', 'businessname', 'name'],
    dba: ['dba', 'doingbusinessas', 'tradename'],
    status: ['status', 'dealstatus', 'state'],
    flags: ['flags', 'tags', 'labels'],
    owner: ['owner', 'ownername', 'contact', 'contactname'],
    phone: ['phone', 'phonenumber', 'tel', 'telephone', 'mobile', 'cell'],
    email: ['email', 'emailaddress', 'mail'],
    products: ['products', 'product', 'producttype'],
    notes: ['notes', 'note', 'comments', 'description'],
    originators: ['originators', 'originator', 'source'],
    closers: ['closers', 'closer', 'rep'],
    dateCreated: ['datecreated', 'createdat', 'created', 'createddate', 'date'],
    dateUpdated: ['dateupdated', 'updatedat', 'updated', 'modifieddate', 'lastmodified'],
    gurl: ['gurl', 'score'],
    maxOffer: ['maxoffer', 'offer', 'maxamount', 'offeredamount'],
    monthlyRev: ['monthlyrev', 'monthlyrevenue', 'revenue', 'monthlyincome', 'income'],
    originator: ['originator', 'originatorname'],
    closer: ['closer', 'closername', 'salesrep'],
  };

  for (const [field, aliases] of Object.entries(mappings)) {
    if (aliases.includes(normalized)) {
      return field;
    }
  }

  return '';
}

function validateValue(value: string, type: ColumnType, field: string): string | null {
  if (!value || value.trim() === '') return null;

  switch (type) {
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format';
      }
      break;
    case 'phone':
      if (value.replace(/\D/g, '').length < 7) {
        return 'Phone number too short';
      }
      break;
    case 'date':
      if (!/^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})$/.test(value)) {
        return 'Invalid date format (use MM/DD/YYYY)';
      }
      break;
    case 'number':
    case 'currency':
      if (isNaN(parseFloat(value.replace(/[$,]/g, '')))) {
        return 'Invalid number format';
      }
      break;
  }
  return null;
}

function formatDate(value: string): string {
  if (!value) return '';
  const parts = value.split(/[\/\-]/);
  if (parts.length !== 3) return value;
  
  let month, day, year;
  if (parts[0].length === 4) {
    [year, month, day] = parts;
  } else {
    [month, day, year] = parts;
  }
  
  if (year.length === 2) {
    year = parseInt(year) > 50 ? '19' + year : '20' + year;
  }
  
  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
}

export default function CSVImportModal({ isOpen, onClose, onImportComplete, existingDeals }: CSVImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<{ headers: string[]; rows: ParsedRow[] }>({ headers: [], rows: [] });
  const [columnTypes, setColumnTypes] = useState<Record<string, ColumnType>>({});
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [preventDuplicates, setPreventDuplicates] = useState(true);
  const [duplicateField, setDuplicateField] = useState<'dealId' | 'company'>('dealId');
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{ success: number; errors: number; duplicates: number }>({ success: 0, errors: 0, duplicates: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('upload');
    setFile(null);
    setParsedData({ headers: [], rows: [] });
    setColumnTypes({});
    setMappings([]);
    setValidationErrors([]);
    setImportProgress(0);
    setImportResults({ success: 0, errors: 0, duplicates: 0 });
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);
      setParsedData({ headers, rows });

      const types: Record<string, ColumnType> = {};
      headers.forEach(header => {
        const values = rows.map(row => row[header]);
        types[header] = detectColumnType(values);
      });
      setColumnTypes(types);

      const initialMappings: ColumnMapping[] = headers.map(header => ({
        csvColumn: header,
        targetField: suggestMapping(header),
        detectedType: types[header],
        isNew: false,
      }));
      setMappings(initialMappings);

      setStep('preview');
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const updateMapping = (csvColumn: string, targetField: string) => {
    setMappings(prev => prev.map(m => 
      m.csvColumn === csvColumn ? { ...m, targetField } : m
    ));
  };

  const validateData = () => {
    const errors: ValidationError[] = [];
    
    parsedData.rows.forEach((row, rowIndex) => {
      mappings.forEach(mapping => {
        if (mapping.targetField) {
          const field = dealFields.find(f => f.key === mapping.targetField);
          if (field) {
            const value = row[mapping.csvColumn];
            const error = validateValue(value, field.type, field.key);
            if (error) {
              errors.push({
                row: rowIndex + 1,
                column: mapping.csvColumn,
                value,
                message: error,
              });
            }
          }
        }
      });
    });

    setValidationErrors(errors);
    setStep('validation');
  };

  const startImport = async () => {
    setStep('importing');
    setImportProgress(0);

    const importedDeals: DealImport[] = [];
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    const totalRows = parsedData.rows.length;

    for (let i = 0; i < parsedData.rows.length; i++) {
      const row = parsedData.rows[i];
      
      await new Promise(resolve => setTimeout(resolve, 50));

      try {
        const deal: DealImport = {
          dealId: '',
          company: '',
          dba: '',
          status: 'New Application',
          flags: [],
          owner: '',
          phone: '',
          email: '',
          products: '',
          notes: '',
          originators: '',
          closers: '',
          dateCreated: new Date().toLocaleDateString('en-US'),
          dateUpdated: '',
          gurl: 0,
          maxOffer: null,
          monthlyRev: null,
          originator: '',
          closer: '',
        };

        mappings.forEach(mapping => {
          if (mapping.targetField && row[mapping.csvColumn]) {
            const value = row[mapping.csvColumn];
            const field = dealFields.find(f => f.key === mapping.targetField);

            if (field) {
              switch (field.type) {
                case 'number':
                  (deal as Record<string, unknown>)[mapping.targetField] = parseInt(value.replace(/,/g, '')) || 0;
                  break;
                case 'currency':
                  (deal as Record<string, unknown>)[mapping.targetField] = parseFloat(value.replace(/[$,]/g, '')) || null;
                  break;
                case 'date':
                  (deal as Record<string, unknown>)[mapping.targetField] = formatDate(value);
                  break;
                default:
                  (deal as Record<string, unknown>)[mapping.targetField] = value;
              }
            }
          }
        });

        if (!deal.dealId) {
          deal.dealId = `IMP-${Date.now()}-${i}`;
        }

        if (preventDuplicates) {
          const isDuplicate = existingDeals.some(existing => {
            if (duplicateField === 'dealId') {
              return existing.dealId === deal.dealId;
            }
            return existing.company.toLowerCase() === deal.company?.toLowerCase();
          });

          if (isDuplicate) {
            duplicateCount++;
            setImportProgress(Math.round(((i + 1) / totalRows) * 100));
            continue;
          }
        }

        importedDeals.push(deal);
        successCount++;
      } catch {
        errorCount++;
      }

      setImportProgress(Math.round(((i + 1) / totalRows) * 100));
    }

    setImportResults({ success: successCount, errors: errorCount, duplicates: duplicateCount });
    setStep('complete');

    const historyEntry: ImportHistoryEntry = {
      id: Date.now().toString(),
      filename: file?.name || 'unknown.csv',
      importedAt: new Date().toISOString(),
      totalRows: totalRows,
      successRows: successCount,
      errorRows: errorCount,
      duplicatesSkipped: duplicateCount,
    };

    onImportComplete(importedDeals, historyEntry);
  };

  const getTypeColor = (type: ColumnType) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-700';
      case 'phone': return 'bg-green-100 text-green-700';
      case 'date': return 'bg-purple-100 text-purple-700';
      case 'number': return 'bg-orange-100 text-orange-700';
      case 'currency': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Import Deals from CSV</h2>
                <p className="text-sm text-gray-500">
                  {step === 'upload' && 'Upload your CSV file to get started'}
                  {step === 'preview' && `Preview: ${parsedData.rows.length} rows, ${parsedData.headers.length} columns`}
                  {step === 'mapping' && 'Map CSV columns to deal fields'}
                  {step === 'validation' && `${validationErrors.length} validation issues found`}
                  {step === 'importing' && `Importing... ${importProgress}%`}
                  {step === 'complete' && 'Import complete!'}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b">
            {['upload', 'preview', 'mapping', 'validation', 'importing', 'complete'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-blue-600 text-white' :
                  ['upload', 'preview', 'mapping', 'validation', 'importing', 'complete'].indexOf(step) > i 
                    ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {['upload', 'preview', 'mapping', 'validation', 'importing', 'complete'].indexOf(step) > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-sm hidden sm:block ${step === s ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
                {i < 5 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {step === 'upload' && (
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop your CSV file here
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                  Select CSV File
                </Button>
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">{file?.name}</span>
                  </div>
                  <Badge variant="outline">{parsedData.rows.length} rows</Badge>
                  <Badge variant="outline">{parsedData.headers.length} columns</Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 border-b">#</th>
                          {parsedData.headers.map((header, i) => (
                            <th key={i} className="px-3 py-2 text-left border-b">
                              <div className="font-medium text-gray-900">{header}</div>
                              <Badge className={`mt-1 text-xs ${getTypeColor(columnTypes[header])}`}>
                                {columnTypes[header]}
                              </Badge>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.rows.slice(0, 10).map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-500">{rowIndex + 1}</td>
                            {parsedData.headers.map((header, colIndex) => (
                              <td key={colIndex} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                                {row[header] || <span className="text-gray-300">--</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedData.rows.length > 10 && (
                    <div className="px-3 py-2 bg-gray-50 text-sm text-gray-500 text-center">
                      Showing first 10 of {parsedData.rows.length} rows
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 'mapping' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Map each CSV column to a deal field. Unmapped columns will be skipped.
                  </p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">CSV Column</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Detected Type</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700"></th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Map To Field</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Sample Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappings.map((mapping, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{mapping.csvColumn}</td>
                          <td className="px-4 py-3">
                            <Badge className={getTypeColor(mapping.detectedType)}>
                              {mapping.detectedType}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <ArrowRight className="w-4 h-4 text-gray-400 inline" />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={mapping.targetField}
                              onChange={(e) => updateMapping(mapping.csvColumn, e.target.value)}
                              className="w-full h-9 px-3 border rounded-lg text-sm cursor-pointer"
                            >
                              <option value="">-- Skip this column --</option>
                              {dealFields.map(field => (
                                <option key={field.key} value={field.key}>
                                  {field.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                            {parsedData.rows[0]?.[mapping.csvColumn] || '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="preventDuplicates"
                      checked={preventDuplicates}
                      onChange={(e) => setPreventDuplicates(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                    <label htmlFor="preventDuplicates" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Prevent duplicate imports
                    </label>
                  </div>
                  {preventDuplicates && (
                    <div className="flex items-center gap-3 pl-7">
                      <span className="text-sm text-gray-600">Check duplicates by:</span>
                      <select
                        value={duplicateField}
                        onChange={(e) => setDuplicateField(e.target.value as 'dealId' | 'company')}
                        className="h-8 px-3 border rounded text-sm cursor-pointer"
                      >
                        <option value="dealId">Deal ID</option>
                        <option value="company">Company Name</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 'validation' && (
              <div className="space-y-4">
                {validationErrors.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All data is valid!</h3>
                    <p className="text-gray-500">Your data passed all validation checks.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          {validationErrors.length} validation {validationErrors.length === 1 ? 'issue' : 'issues'} found. 
                          These rows will still be imported, but values may be incorrect.
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                          const csv = ['Row,Column,Value,Issue', ...validationErrors.map(e => 
                            `${e.row},"${e.column}","${e.value.replace(/"/g, '""')}","${e.message}"`
                          )].join('\n');
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'validation_errors.csv';
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export Errors
                      </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Row</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Column</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Value</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Issue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validationErrors.slice(0, 50).map((error, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-4 py-2 text-gray-600">{error.row}</td>
                              <td className="px-4 py-2 font-medium">{error.column}</td>
                              <td className="px-4 py-2 text-gray-600 max-w-[200px] truncate">{error.value}</td>
                              <td className="px-4 py-2 text-red-600">{error.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 'importing' && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Importing deals...</h3>
                <div className="w-full max-w-md mx-auto">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${importProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{importProgress}% complete</p>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-4">Import Complete!</h3>
                
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{importResults.success}</div>
                    <div className="text-sm text-gray-500">Imported</div>
                  </div>
                  {importResults.duplicates > 0 && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">{importResults.duplicates}</div>
                      <div className="text-sm text-gray-500">Duplicates Skipped</div>
                    </div>
                  )}
                  {importResults.errors > 0 && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{importResults.errors}</div>
                      <div className="text-sm text-gray-500">Errors</div>
                    </div>
                  )}
                </div>

                <Button onClick={handleClose} className="cursor-pointer">
                  Done
                </Button>
              </div>
            )}
          </div>

          {step !== 'upload' && step !== 'importing' && step !== 'complete' && (
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === 'preview') setStep('upload');
                  else if (step === 'mapping') setStep('preview');
                  else if (step === 'validation') setStep('mapping');
                }}
                className="cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              
              <Button
                onClick={() => {
                  if (step === 'preview') setStep('mapping');
                  else if (step === 'mapping') validateData();
                  else if (step === 'validation') startImport();
                }}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
              >
                {step === 'validation' ? 'Start Import' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
