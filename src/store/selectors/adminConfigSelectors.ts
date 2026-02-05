import { RootState } from '@/store';

export const selectCompanyName = (state: RootState) => 
  state.adminConfig.companyName;

export const selectStatuses = (state: RootState) => 
  state.adminConfig.statuses.map(s => s.value);

export const selectFlags = (state: RootState) => 
  state.adminConfig.flags.map(f => f.value);

export const selectProducts = (state: RootState) => 
  state.adminConfig.products.map(p => p.value);

export const selectOriginators = (state: RootState) => 
  state.adminConfig.originators.map(o => o.value);

export const selectClosers = (state: RootState) => 
  state.adminConfig.closers.map(c => c.value);

export const selectTags = (state: RootState) => 
  state.adminConfig.tags.map(t => t.value);

export const selectSubmissionStatuses = (state: RootState) => 
  state.adminConfig.submissionStatuses;

export const selectStatusesWithColors = (state: RootState) => 
  state.adminConfig.statuses;

export const selectFlagsWithColors = (state: RootState) => 
  state.adminConfig.flags;

export const selectProductsWithColors = (state: RootState) => 
  state.adminConfig.products;

export const selectTagsWithColors = (state: RootState) => 
  state.adminConfig.tags;
