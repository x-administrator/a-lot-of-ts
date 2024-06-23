import { GoogleSyncState } from 'apps/settings/src/google_api/types';
import { Version_V1 } from '../base/types';

export type SettingsEvents = {
  common: {
    started: {
      [Version_V1]: null;
    };
  };
  weapone: {
    updated: {
      [Version_V1]: null;
    };
  };
  'items-for-sell': {
    updated: {
      [Version_V1]: null;
    };
  };
  'google-api': {
    syncProcessed: {
      [Version_V1]: GoogleSyncState;
    };
  };
};
