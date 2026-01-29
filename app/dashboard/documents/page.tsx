'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, FileText, FileImage, FileSpreadsheet, Download, Eye, Trash2, MoreVertical, FolderOpen } from 'lucide-react';

const sampleDocuments = [
  {
    id: 1,
    name: 'Bank_Statements_Jan2025.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-01-28',
    deal: 'Acme Restaurant LLC',
    status: 'Approved',
  },
  {
    id: 2,
    name: 'Business_License.jpg',
    type: 'image',
    size: '1.2 MB',
    uploadedBy: 'Mike Wilson',
    uploadedAt: '2025-01-27',
    deal: 'Quick Mart Inc',
    status: 'Pending Review',
  },
  {
    id: 3,
    name: 'Tax_Returns_2024.pdf',
    type: 'pdf',
    size: '5.8 MB',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-01-26',
    deal: 'City Auto Repair',
    status: 'Approved',
  },
  {
    id: 4,
    name: 'Financial_Projections.xlsx',
    type: 'spreadsheet',
    size: '890 KB',
    uploadedBy: 'Tom Brown',
    uploadedAt: '2025-01-25',
    deal: 'Downtown Fitness',
    status: 'Needs Revision',
  },
  {
    id: 5,
    name: 'ID_Verification.jpg',
    type: 'image',
    size: '650 KB',
    uploadedBy: 'Mike Wilson',
    uploadedAt: '2025-01-24',
    deal: 'Tech Solutions Pro',
    status: 'Approved',
  },
  {
    id: 6,
    name: 'Voided_Check.pdf',
    type: 'pdf',
    size: '320 KB',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-01-23',
    deal: 'Green Landscaping',
    status: 'Pending Review',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = sampleDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.deal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return FileImage;
      case 'spreadsheet': return FileSpreadsheet;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700';
      case 'Needs Revision': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Manage uploaded documents</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sampleDocuments.length}</p>
              <p className="text-sm text-gray-500">Total Documents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sampleDocuments.filter(d => d.status === 'Approved').length}</p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sampleDocuments.filter(d => d.status === 'Pending Review').length}</p>
              <p className="text-sm text-gray-500">Pending Review</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <motion.div variants={containerVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-600 text-sm">Document</th>
                    <th className="text-left p-4 font-medium text-gray-600 text-sm hidden md:table-cell">Deal</th>
                    <th className="text-left p-4 font-medium text-gray-600 text-sm hidden sm:table-cell">Size</th>
                    <th className="text-left p-4 font-medium text-gray-600 text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-gray-600 text-sm hidden lg:table-cell">Uploaded</th>
                    <th className="text-right p-4 font-medium text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => {
                    const FileIcon = getFileIcon(doc.type);
                    return (
                      <motion.tr
                        key={doc.id}
                        variants={itemVariants}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        className="border-b last:border-0"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                              <p className="text-sm text-gray-500 md:hidden truncate">{doc.deal}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{doc.deal}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 hidden sm:table-cell">{doc.size}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 hidden lg:table-cell">
                          <div>
                            <p className="text-sm">{doc.uploadedAt}</p>
                            <p className="text-xs text-gray-400">{doc.uploadedBy}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hidden sm:flex">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
