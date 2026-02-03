'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ChevronLeft, 
  Upload, 
  Plus, 
  X, 
  Check, 
  FileText, 
  Building2, 
  Users, 
  MapPin, 
  Briefcase,
  Settings,
  Trash2,
  UserPlus
} from 'lucide-react';

const originatorOptions = ['Marc Willis', 'Sarah Johnson', 'Mike Chen', 'Main Wills'];
const closerOptions = ['Tom Brown', 'Lisa Wong', 'David Miller'];
const industryOptions = ['Restaurant', 'Retail', 'Construction', 'Healthcare', 'Transportation', 'Technology', 'Manufacturing', 'Other'];
const legalStructureOptions = ['LLC', 'Corporation', 'Sole Proprietorship', 'Partnership', 'S-Corp', 'C-Corp'];
const stateOptions = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const countryOptions = ['United States', 'Canada', 'Mexico'];
const channelOptions = ['Direct', 'Referral', 'Partner', 'Online', 'Phone'];
const batchOptions = ['Batch 1', 'Batch 2', 'Batch 3'];
const merchantOptions = ['Merchant A', 'Merchant B', 'Merchant C'];
const templateOptions = ['Standard', 'Premium', 'Custom'];

interface Owner {
  id: string;
  name: string;
  phone: string;
  ssn: string;
  dateOfBirth: string;
  homeAddress: string;
  percentOwned: number;
}

const createEmptyOwner = (): Owner => ({
  id: Math.random().toString(36).substring(2, 9),
  name: '',
  phone: '',
  ssn: '',
  dateOfBirth: '',
  homeAddress: '',
  percentOwned: 0,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function NewDealPage() {
  const router = useRouter();
  const [setupMethod, setSetupMethod] = useState<'manual' | 'upload'>('manual');
  
  const [originators, setOriginators] = useState('Marc Willis');
  const [primaryOriginator, setPrimaryOriginator] = useState('Marc Willis');
  const [company, setCompany] = useState('');
  const [dba, setDba] = useState('');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [closers, setClosers] = useState('');
  const [ein, setEin] = useState('');
  const [startDate, setStartDate] = useState('');
  
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [stateIncorporated, setStateIncorporated] = useState('');
  const [industry, setIndustry] = useState('');
  const [legalStructure, setLegalStructure] = useState('');
  const [batch, setBatch] = useState('');
  const [merchant, setMerchant] = useState('');
  const [channel, setChannel] = useState('');
  const [template, setTemplate] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [purposeOfFunds, setPurposeOfFunds] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const addOwner = () => {
    setOwners([...owners, createEmptyOwner()]);
  };

  const removeOwner = (ownerId: string) => {
    setOwners(owners.filter(o => o.id !== ownerId));
  };

  const updateOwner = (ownerId: string, field: keyof Owner, value: string | number) => {
    setOwners(owners.map(owner => 
      owner.id === ownerId ? { ...owner, [field]: value } : owner
    ));
  };

  const handleSave = () => {
    router.push('/dashboard/deals');
  };

  const selectClassName = "w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const inputClassName = "h-10 border-gray-200 focus:ring-2 focus:ring-blue-500";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard/deals" className="hover:text-blue-600">Deals</Link>
              <span>/</span>
              <span>New Deal</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">New Deal</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/deals">
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
            <Check className="w-4 h-4 mr-2" />
            Save Deal
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Setup Method</CardTitle>
                <CardDescription>Choose how you want to create this deal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  setupMethod === 'manual' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="setupMethod"
                  checked={setupMethod === 'manual'}
                  onChange={() => setSetupMethod('manual')}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900">Manual Entry</span>
                  <p className="text-sm text-gray-500 mt-0.5">Enter deal details yourself.</p>
                </div>
              </label>
              <label 
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  setupMethod === 'upload' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="setupMethod"
                  checked={setupMethod === 'upload'}
                  onChange={() => setSetupMethod('upload')}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900">Upload & Scan</span>
                  <p className="text-sm text-gray-500 mt-0.5">Our AI will scan the application.</p>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Originators</Label>
                <p className="text-xs text-gray-500">Users who have access to this deal</p>
                <select
                  value={originators}
                  onChange={(e) => setOriginators(e.target.value)}
                  className={selectClassName}
                >
                  {originatorOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Primary Originator</Label>
                <p className="text-xs text-gray-500">User who gets credit on the leaderboard</p>
                <select
                  value={primaryOriginator}
                  onChange={(e) => setPrimaryOriginator(e.target.value)}
                  className={selectClassName}
                >
                  {originatorOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Business Information</CardTitle>
                <CardDescription>Enter the company details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Company Name</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClassName}
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">DBA (Doing Business As)</Label>
                <Input
                  value={dba}
                  onChange={(e) => setDba(e.target.value)}
                  className={inputClassName}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">EIN</Label>
                <Input
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  className={inputClassName}
                  placeholder="XX-XXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Application</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Bank Statements</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Industry</Label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select industry...</option>
                  {industryOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Legal Structure</Label>
                <select
                  value={legalStructure}
                  onChange={(e) => setLegalStructure(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select structure...</option>
                  {legalStructureOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Website</Label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className={inputClassName}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Business Email</Label>
                <Input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className={inputClassName}
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Business Phone</Label>
                <div className="flex gap-2">
                  <select className="h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white w-20 cursor-pointer">
                    <option>+1</option>
                    <option>+44</option>
                    <option>+52</option>
                  </select>
                  <Input
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className={`flex-1 ${inputClassName}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Purpose of Funds</Label>
                <Input
                  value={purposeOfFunds}
                  onChange={(e) => setPurposeOfFunds(e.target.value)}
                  className={inputClassName}
                  placeholder="Working capital, equipment, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Owner Information</CardTitle>
                  <CardDescription>Add business owners and their details</CardDescription>
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addOwner}
                className="cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Owner
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {owners.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <UserPlus className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No owners added yet</p>
                <p className="text-xs text-gray-400 mt-1">Click "Add Owner" to add business owner information</p>
              </div>
            ) : (
              <div className="space-y-4">
                {owners.map((owner, index) => (
                  <div key={owner.id} className="border rounded-lg p-4 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Owner {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOwner(owner.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Owner Name</Label>
                        <Input
                          value={owner.name}
                          onChange={(e) => updateOwner(owner.id, 'name', e.target.value)}
                          placeholder="Full legal name"
                          className={inputClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input
                          value={owner.phone}
                          onChange={(e) => updateOwner(owner.id, 'phone', e.target.value)}
                          placeholder="(XXX) XXX-XXXX"
                          className={inputClassName}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">SSN</Label>
                        <Input
                          value={owner.ssn}
                          onChange={(e) => updateOwner(owner.id, 'ssn', e.target.value)}
                          placeholder="XXX-XX-XXXX"
                          className={inputClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">% Owned</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={owner.percentOwned}
                          onChange={(e) => updateOwner(owner.id, 'percentOwned', parseFloat(e.target.value) || 0)}
                          placeholder="0-100"
                          className={inputClassName}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                        <Input
                          type="date"
                          value={owner.dateOfBirth}
                          onChange={(e) => updateOwner(owner.id, 'dateOfBirth', e.target.value)}
                          className={inputClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Home Address</Label>
                        <Input
                          value={owner.homeAddress}
                          onChange={(e) => updateOwner(owner.id, 'homeAddress', e.target.value)}
                          placeholder="Full home address"
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Team Assignment</CardTitle>
                <CardDescription>Assign team members to this deal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Closers</Label>
              <p className="text-xs text-gray-500">Additional users who can access this deal</p>
              <select
                value={closers}
                onChange={(e) => setClosers(e.target.value)}
                className={selectClassName}
              >
                <option value="">Select closer...</option>
                {closerOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Location & Dates</CardTitle>
                <CardDescription>Business address and important dates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Created At</Label>
                <Input
                  type="date"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Business Address</Label>
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Street address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={inputClassName}
                />
                <Input
                  placeholder="Suite / Apt. / Building (optional)"
                  value={suite}
                  onChange={(e) => setSuite(e.target.value)}
                  className={inputClassName}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClassName}
                  />
                  <Input
                    placeholder="State / Region"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className={inputClassName}
                  />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={selectClassName}
                  >
                    {countryOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">State Incorporated</Label>
              <select
                value={stateIncorporated}
                onChange={(e) => setStateIncorporated(e.target.value)}
                className={selectClassName}
              >
                <option value="">Select state...</option>
                {stateOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Additional Settings</CardTitle>
                <CardDescription>Optional configuration options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Batch</Label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select...</option>
                  {batchOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Merchant</Label>
                <select
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select...</option>
                  {merchantOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Channel</Label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select...</option>
                  {channelOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Template</Label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Select...</option>
                  {templateOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 pb-8">
        <Link href="/dashboard/deals">
          <Button variant="outline" size="lg" className="cursor-pointer">
            Cancel
          </Button>
        </Link>
        <Button size="lg" onClick={handleSave} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
          <Check className="w-4 h-4 mr-2" />
          Save Deal
        </Button>
      </motion.div>
    </motion.div>
  );
}
