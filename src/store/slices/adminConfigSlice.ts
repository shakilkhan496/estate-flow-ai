import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigItem {
  id: string;
  value: string;
  color: string;
}

interface AdminConfigState {
  companyName: string;
  statuses: ConfigItem[];
  flags: ConfigItem[];
  products: ConfigItem[];
  originators: ConfigItem[];
  closers: ConfigItem[];
  submissionStatuses: ConfigItem[];
  tags: ConfigItem[];
}

const initialState: AdminConfigState = {
  companyName: 'MCA Pilot',
  statuses: [
    { id: '1', value: 'Ready to Submit', color: 'bg-blue-100 text-blue-700' },
    { id: '2', value: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { id: '3', value: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
    { id: '4', value: 'Approved', color: 'bg-green-100 text-green-700' },
    { id: '5', value: 'Funded', color: 'bg-green-100 text-green-700' },
    { id: '6', value: 'Declined', color: 'bg-red-100 text-red-700' },
    { id: '7', value: 'Withdrawn', color: 'bg-orange-100 text-orange-700' },
  ],
  flags: [
    { id: '1', value: 'Awaiting Additional Documents', color: 'bg-yellow-100 text-yellow-700' },
    { id: '2', value: 'Stiplisted', color: 'bg-purple-100 text-purple-700' },
    { id: '3', value: 'Priority', color: 'bg-red-100 text-red-700' },
    { id: '4', value: 'VIP Client', color: 'bg-blue-100 text-blue-700' },
    { id: '5', value: 'Needs Review', color: 'bg-orange-100 text-orange-700' },
  ],
  products: [
    { id: '1', value: 'MCA', color: 'bg-blue-100 text-blue-700' },
    { id: '2', value: 'Term Loan', color: 'bg-green-100 text-green-700' },
    { id: '3', value: 'Line of Credit', color: 'bg-purple-100 text-purple-700' },
    { id: '4', value: 'Equipment Financing', color: 'bg-orange-100 text-orange-700' },
    { id: '5', value: 'SBA Loan', color: 'bg-gray-100 text-gray-700' },
  ],
  originators: [
    { id: '1', value: 'Main Wills', color: 'bg-gray-100 text-gray-700' },
    { id: '2', value: 'Sarah Johnson', color: 'bg-gray-100 text-gray-700' },
    { id: '3', value: 'Mike Chen', color: 'bg-gray-100 text-gray-700' },
    { id: '4', value: 'Marc Willis', color: 'bg-gray-100 text-gray-700' },
  ],
  closers: [
    { id: '1', value: 'Tom Brown', color: 'bg-gray-100 text-gray-700' },
    { id: '2', value: 'Lisa Wong', color: 'bg-gray-100 text-gray-700' },
    { id: '3', value: 'David Miller', color: 'bg-gray-100 text-gray-700' },
  ],
  submissionStatuses: [
    { id: '1', value: 'declined', color: 'bg-red-100 text-red-700' },
    { id: '2', value: 'approved', color: 'bg-green-100 text-green-700' },
    { id: '3', value: 'sent', color: 'bg-blue-100 text-blue-700' },
    { id: '4', value: 'errored', color: 'bg-orange-100 text-orange-700' },
    { id: '5', value: 'pending', color: 'bg-gray-100 text-gray-700' },
  ],
  tags: [
    { id: '1', value: 'Hot Lead', color: 'bg-red-100 text-red-700' },
    { id: '2', value: 'Returning Client', color: 'bg-blue-100 text-blue-700' },
    { id: '3', value: 'Referral', color: 'bg-green-100 text-green-700' },
    { id: '4', value: 'High Value', color: 'bg-purple-100 text-purple-700' },
    { id: '5', value: 'Follow Up', color: 'bg-yellow-100 text-yellow-700' },
    { id: '6', value: 'New Business', color: 'bg-orange-100 text-orange-700' },
  ],
};

type ConfigKey = 'statuses' | 'flags' | 'products' | 'originators' | 'closers' | 'submissionStatuses' | 'tags';

const adminConfigSlice = createSlice({
  name: 'adminConfig',
  initialState,
  reducers: {
    setCompanyName: (state, action: PayloadAction<string>) => {
      state.companyName = action.payload;
    },
    addConfigItem: (state, action: PayloadAction<{ key: ConfigKey; item: ConfigItem }>) => {
      state[action.payload.key].push(action.payload.item);
    },
    removeConfigItem: (state, action: PayloadAction<{ key: ConfigKey; id: string }>) => {
      state[action.payload.key] = state[action.payload.key].filter(
        (item) => item.id !== action.payload.id
      );
    },
    updateConfigItem: (state, action: PayloadAction<{ key: ConfigKey; id: string; value: string; color: string }>) => {
      const { key, id, value, color } = action.payload;
      const item = state[key].find((i) => i.id === id);
      if (item) {
        item.value = value;
        item.color = color;
      }
    },
    setConfigItems: (state, action: PayloadAction<{ key: ConfigKey; items: ConfigItem[] }>) => {
      state[action.payload.key] = action.payload.items;
    },
  },
});

export const { setCompanyName, addConfigItem, removeConfigItem, updateConfigItem, setConfigItems } = adminConfigSlice.actions;
export default adminConfigSlice.reducer;
