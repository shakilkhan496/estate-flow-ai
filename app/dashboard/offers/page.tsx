'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Download, ChevronDown, ChevronUp, Check, 
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { 
  selectStatuses, 
  selectProducts, 
  selectOriginators, 
  selectClosers 
} from '@/store/selectors/adminConfigSelectors';

interface Offer {
  id: number;
  deal: string;
  funder: string;
  status: string;
  amount: number;
  rate: number;
  payback: number;
  term: number;
  payment: number;
  commission: number;
  phone: string;
  notes: string;
  tags: string[];
  ai: boolean;
  originator: string;
  created: string;
}

const sampleOffers: Offer[] = [
  { id: 1, deal: 'Concord-Carlisle Dental Associates', funder: 'Forward', status: 'New', amount: 58000, rate: 1.540, payback: 89320, term: 36, payment: 2481.11, commission: 8700, phone: '', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/15/2026' },
  { id: 2, deal: 'AVANTI ADVISORS LLC', funder: 'Biz2Credit', status: 'New', amount: 85000, rate: 1.280, payback: 108800, term: 52, payment: 2092.31, commission: 5100, phone: '(901) 672-4193', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/14/2026' },
  { id: 3, deal: 'Above The Wake Inc.', funder: 'Fundworks', status: 'New', amount: 90000, rate: 1.470, payback: 132300, term: 44, payment: 3006.82, commission: 13500, phone: '', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/12/2026' },
  { id: 4, deal: 'Above The Wake Inc.', funder: 'IOU', status: 'New', amount: 95000, rate: 1.350, payback: 128250, term: 79, payment: 1623.42, commission: 9500, phone: '(740) 270-8044', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/10/2026' },
  { id: 5, deal: 'Above The Wake Inc.', funder: 'Fundworks', status: 'New', amount: 100000, rate: 1.450, payback: 145000, term: 200, payment: 725, commission: 15000, phone: '(740) 270-8044', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/09/2026' },
  { id: 6, deal: 'Above The Wake Inc.', funder: 'Fundworks', status: 'New', amount: 90000, rate: 1.470, payback: 132300, term: 44, payment: 3006.82, commission: 13500, phone: '(740) 270-8044', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/09/2026' },
  { id: 7, deal: 'Jim Fine Custom Homes LLC', funder: 'Mulligan Funding', status: 'New', amount: 70000, rate: 1.190, payback: 83300, term: 12, payment: 6941.67, commission: 8400, phone: '(318) 573-9794', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/07/2026' },
  { id: 8, deal: 'Jim Fine Custom Homes LLC', funder: 'Can capital', status: 'New', amount: 150000, rate: 1.349, payback: 202350, term: 52, payment: 3891.35, commission: 15000, phone: '(318) 573-9794', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '01/03/2026' },
  { id: 9, deal: 'Centurion Fitness LLC', funder: 'Fintap', status: 'New', amount: 220000, rate: 1.340, payback: 294800, term: 52, payment: 5669.23, commission: 11000, phone: '(610) 780-3500', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '12/25/2025' },
  { id: 10, deal: 'Centurion Fitness LLC', funder: 'Fintap', status: 'New', amount: 220000, rate: 1.340, payback: 294800, term: 52, payment: 5669.23, commission: 11000, phone: '(610) 780-3500', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '12/25/2025' },
  { id: 11, deal: 'Olmecs Communications LLC', funder: 'Spartan', status: 'New', amount: 75000, rate: 1.470, payback: 110250, term: 28, payment: 3937.50, commission: 9000, phone: '(229) 254-4265', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '12/25/2025' },
  { id: 12, deal: 'Centurion Fitness LLC', funder: 'Fundworks', status: 'New', amount: 175000, rate: 1.460, payback: 255500, term: 280, payment: 912.50, commission: 28000, phone: '(610) 780-3500', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '12/25/2025' },
  { id: 13, deal: 'GRAPEVINE BLINDS LLC', funder: 'Kalamata', status: 'New', amount: 115000, rate: 1.400, payback: 161000, term: 53, payment: 3037.74, commission: 16100, phone: '(443) 917-8026', notes: '', tags: [], ai: true, originator: 'Marc Willis', created: '12/23/2025' },
  { id: 14, deal: 'Metro Dental Care', funder: 'Forward', status: 'Approved', amount: 125000, rate: 1.380, payback: 172500, term: 48, payment: 3593.75, commission: 12500, phone: '(555) 123-4567', notes: 'Priority client', tags: ['VIP'], ai: true, originator: 'Sarah Johnson', created: '12/20/2025' },
  { id: 15, deal: 'Tech Solutions Inc', funder: 'Biz2Credit', status: 'Declined', amount: 200000, rate: 1.250, payback: 250000, term: 60, payment: 4166.67, commission: 20000, phone: '(555) 987-6543', notes: '', tags: [], ai: false, originator: 'John Smith', created: '12/18/2025' },
];

const funders = ['Forward', 'Biz2Credit', 'Fundworks', 'IOU', 'Mulligan Funding', 'Can capital', 'Fintap', 'Spartan', 'Kalamata'];

type SortField = 'deal' | 'funder' | 'status' | 'amount' | 'rate' | 'payback' | 'term' | 'payment' | 'commission' | 'phone' | 'originator' | 'created';
type SortDirection = 'asc' | 'desc';

export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [offers] = useState<Offer[]>(sampleOffers);
  const itemsPerPage = 30;
  
  const [filters, setFilters] = useState({
    deal: '',
    funder: '',
    status: '',
    product: '',
    tags: '',
    originators: '',
    closers: '',
    dateCreated: '',
  });
  
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const statuses = useAppSelector(selectStatuses);
  const products = useAppSelector(selectProducts);
  const originators = useAppSelector(selectOriginators);
  const closers = useAppSelector(selectClosers);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-700',
      'Approved': 'bg-green-100 text-green-700',
      'Declined': 'bg-red-100 text-red-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Sent': 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = searchTerm === '' || 
        offer.deal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.funder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.originator.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDeal = !filters.deal || offer.deal.includes(filters.deal);
      const matchesFunder = !filters.funder || offer.funder === filters.funder;
      const matchesStatus = !filters.status || offer.status === filters.status;
      const matchesOriginator = !filters.originators || offer.originator === filters.originators;
      
      return matchesSearch && matchesDeal && matchesFunder && matchesStatus && matchesOriginator;
    });
  }, [offers, searchTerm, filters]);

  const sortedOffers = useMemo(() => {
    return [...filteredOffers].sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredOffers, sortField, sortDirection]);

  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedOffers.slice(start, start + itemsPerPage);
  }, [sortedOffers, currentPage]);

  const totalPages = Math.ceil(sortedOffers.length / itemsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2 
    }).format(value);
  };

  const exportToCSV = () => {
    const headers = ['Deal', 'Funder', 'Status', 'Amount', 'Rate', 'Payback', 'Term', 'Payment', 'Commission', 'Phone', 'Notes', 'Tags', 'AI', 'Originator', 'Created'];
    const rows = sortedOffers.map(offer => [
      `"${offer.deal.replace(/"/g, '""')}"`,
      offer.funder,
      offer.status,
      offer.amount,
      offer.rate,
      offer.payback,
      offer.term,
      offer.payment,
      offer.commission,
      offer.phone,
      `"${offer.notes.replace(/"/g, '""')}"`,
      `"${offer.tags.join(', ')}"`,
      offer.ai ? 'Yes' : 'No',
      offer.originator,
      offer.created,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `offers_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === field && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
      <ChevronDown className={`w-3 h-3 ${sortField === field && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
    </span>
  );

  const FilterDropdown = ({ 
    label, 
    value, 
    options, 
    filterKey 
  }: { 
    label: string; 
    value: string; 
    options: string[]; 
    filterKey: keyof typeof filters 
  }) => (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="h-9 px-3 text-sm font-normal cursor-pointer"
        onClick={() => setOpenFilter(openFilter === filterKey ? null : filterKey)}
      >
        {label}
        {value && <span className="ml-1 text-blue-600">({value})</span>}
        <ChevronDown className="w-4 h-4 ml-1" />
      </Button>
      {openFilter === filterKey && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          <div
            className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-500"
            onClick={() => {
              setFilters({ ...filters, [filterKey]: '' });
              setOpenFilter(null);
            }}
          >
            All
          </div>
          {options.map(option => (
            <div
              key={option}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-between"
              onClick={() => {
                setFilters({ ...filters, [filterKey]: option });
                setOpenFilter(null);
              }}
            >
              {option}
              {value === option && <Check className="w-4 h-4 text-blue-600" />}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        <Button onClick={exportToCSV} variant="outline" className="cursor-pointer">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-48 h-9"
          />
        </div>
        
        <FilterDropdown label="Deal" value={filters.deal} options={[...new Set(offers.map(o => o.deal))]} filterKey="deal" />
        <FilterDropdown label="Funder" value={filters.funder} options={funders} filterKey="funder" />
        <FilterDropdown label="Status" value={filters.status} options={statuses.length > 0 ? statuses : ['New', 'Approved', 'Declined', 'Pending', 'Sent']} filterKey="status" />
        <FilterDropdown label="Product" value={filters.product} options={products.length > 0 ? products : ['Term Loan', 'Line of Credit', 'MCA']} filterKey="product" />
        <FilterDropdown label="Tags" value={filters.tags} options={['VIP', 'Priority', 'Follow-up']} filterKey="tags" />
        <FilterDropdown label="Originators" value={filters.originators} options={originators.length > 0 ? originators : ['Marc Willis', 'Sarah Johnson', 'John Smith']} filterKey="originators" />
        <FilterDropdown label="Closers" value={filters.closers} options={closers.length > 0 ? closers : ['Alex Brown', 'Emily Davis']} filterKey="closers" />
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-sm font-normal cursor-pointer"
        >
          Date Created
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>

        {Object.values(filters).some(v => v) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 text-gray-500 cursor-pointer"
            onClick={() => setFilters({ deal: '', funder: '', status: '', product: '', tags: '', originators: '', closers: '', dateCreated: '' })}
          >
            <X className="w-4 h-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('deal')}>
                  DEAL <SortIcon field="deal" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('funder')}>
                  FUNDER <SortIcon field="funder" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                  STATUS <SortIcon field="status" />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('amount')}>
                  AMOUNT <SortIcon field="amount" />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('rate')}>
                  RATE <SortIcon field="rate" />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('payback')}>
                  PAYBACK <SortIcon field="payback" />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('term')}>
                  TERM <SortIcon field="term" />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('payment')}>
                  PAYMENT <SortIcon field="payment" />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('commission')}>
                  COMMISSION <SortIcon field="commission" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('phone')}>
                  PHONE <SortIcon field="phone" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  NOTES
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  TAGS
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">
                  AI
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('originator')}>
                  ORIGINATOR <SortIcon field="originator" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created')}>
                  CREATED <SortIcon field="created" />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOffers.map((offer) => (
                <tr key={offer.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                    {offer.deal}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {offer.funder}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getStatusColor(offer.status)}>
                      {offer.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">
                    {formatCurrency(offer.amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {offer.rate.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(offer.payback)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {offer.term}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatCurrency(offer.payment)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatCurrency(offer.commission)}
                  </td>
                  <td className="px-4 py-3 text-blue-600">
                    {offer.phone || <span className="text-gray-300">--</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {offer.notes || <span className="text-gray-300">--</span>}
                  </td>
                  <td className="px-4 py-3">
                    {offer.tags.length > 0 ? (
                      <div className="flex gap-1">
                        {offer.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {offer.ai ? (
                      <Check className="w-4 h-4 text-gray-600 mx-auto" />
                    ) : (
                      <span className="text-gray-300">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {offer.originator}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {offer.created}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} of {sortedOffers.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {openFilter && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenFilter(null)}
        />
      )}
    </motion.div>
  );
}
