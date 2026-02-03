'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Upload, Plus, X, Check } from 'lucide-react';

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
  email: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
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

  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [showOwnerForm, setShowOwnerForm] = useState(false);

  const handleAddOwner = () => {
    if (newOwnerName.trim()) {
      setOwners([...owners, { 
        id: Date.now().toString(), 
        name: newOwnerName.trim(), 
        email: newOwnerEmail.trim() 
      }]);
      setNewOwnerName('');
      setNewOwnerEmail('');
      setShowOwnerForm(false);
    }
  };

  const handleRemoveOwner = (id: string) => {
    setOwners(owners.filter(o => o.id !== id));
  };

  const handleSave = () => {
    router.push('/dashboard/deals');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/deals" className="flex items-center gap-1 hover:text-gray-700">
          <ChevronLeft className="w-4 h-4" />
          Deals
        </Link>
        <span>/</span>
        <span className="text-gray-900">New Deal</span>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900">
        New Deal
      </motion.h1>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium">Setup Method*</Label>
              <div className="mt-2 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="setupMethod"
                    checked={setupMethod === 'manual'}
                    onChange={() => setSetupMethod('manual')}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-medium text-sm bg-gray-100 px-2 py-0.5 rounded">Manual Entry</span>
                    <p className="text-sm text-gray-500 mt-0.5">Enter deal details yourself.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="setupMethod"
                    checked={setupMethod === 'upload'}
                    onChange={() => setSetupMethod('upload')}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-medium text-sm bg-gray-100 px-2 py-0.5 rounded">Upload & Scan</span>
                    <p className="text-sm text-gray-500 mt-0.5">Our AI will scan the application.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Originators</Label>
                <p className="text-xs text-gray-500 mb-2">The users who have access to this deal and can reassign it (select one or more)</p>
                <select
                  value={originators}
                  onChange={(e) => setOriginators(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white cursor-pointer"
                >
                  {originatorOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Primary Originator</Label>
                <p className="text-xs text-gray-500 mb-2">The user who gets credit for this deal on the leaderboard (select one)</p>
                <select
                  value={primaryOriginator}
                  onChange={(e) => setPrimaryOriginator(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white cursor-pointer"
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
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium">Company</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-2"
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">DBA</Label>
                <Input
                  value={dba}
                  onChange={(e) => setDba(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Application</Label>
                <div className="mt-2 w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Bank Statements</Label>
              <div className="mt-2 w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Owners</Label>
              <div className="mt-2 border rounded-lg">
                {owners.length === 0 && !showOwnerForm ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    There are no options
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {owners.map((owner) => (
                      <div key={owner.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{owner.name}</p>
                          {owner.email && <p className="text-xs text-gray-500">{owner.email}</p>}
                        </div>
                        <button onClick={() => handleRemoveOwner(owner.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {showOwnerForm ? (
                  <div className="p-3 border-t space-y-2">
                    <Input
                      placeholder="Owner name"
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                    />
                    <Input
                      placeholder="Owner email"
                      value={newOwnerEmail}
                      onChange={(e) => setNewOwnerEmail(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddOwner} className="cursor-pointer">
                        <Check className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowOwnerForm(false)} className="cursor-pointer">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowOwnerForm(true)}
                    className="w-full p-3 border-t text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Closers</Label>
                <p className="text-xs text-gray-500 mb-2">Additional users who can access this deal</p>
                <select
                  value={closers}
                  onChange={(e) => setClosers(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white cursor-pointer"
                >
                  <option value="">Select...</option>
                  {closerOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">EIN</Label>
                <Input
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Start date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Business address</Label>
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <Input
                    placeholder="Suite / Apt. / Building"
                    value={suite}
                    onChange={(e) => setSuite(e.target.value)}
                  />
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    placeholder="State / Region"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-10 px-3 border rounded-md text-sm bg-white cursor-pointer"
                    >
                      {countryOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">State incorporated</Label>
                <select
                  value={stateIncorporated}
                  onChange={(e) => setStateIncorporated(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-2 cursor-pointer"
                >
                  <option value="">Select...</option>
                  {stateOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Industry</Label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-2 cursor-pointer"
                >
                  <option value="">Select...</option>
                  {industryOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Legal structure</Label>
                <select
                  value={legalStructure}
                  onChange={(e) => setLegalStructure(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-2 cursor-pointer"
                >
                  <option value="">Select...</option>
                  {legalStructureOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Batch</Label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-2 cursor-pointer"
                >
                  <option value="">Select...</option>
                  {batchOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Merchant</Label>
                <select
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-2 cursor-pointer"
                >
                  <option value="">Select...</option>
                  {merchantOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Channel</Label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-2 cursor-pointer"
                >
                  <option value="">Select...</option>
                  {channelOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Template</Label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white mt-2 cursor-pointer"
                >
                  <option value="">Select...</option>
                  {templateOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Business phone</Label>
                <div className="flex gap-2 mt-2">
                  <select className="h-10 px-2 border rounded-md text-sm bg-white w-16 cursor-pointer">
                    <option>us</option>
                    <option>ca</option>
                    <option>mx</option>
                  </select>
                  <Input
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Website</Label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-2"
                  placeholder="https://"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Business email</Label>
                <Input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Purpose of funds</Label>
                <Input
                  value={purposeOfFunds}
                  onChange={(e) => setPurposeOfFunds(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Created at</Label>
                <Input
                  type="date"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-3 pb-6">
        <Link href="/dashboard/deals">
          <Button variant="outline" className="cursor-pointer">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSave} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
          <Check className="w-4 h-4 mr-1" />
          Save
        </Button>
      </motion.div>
    </motion.div>
  );
}
