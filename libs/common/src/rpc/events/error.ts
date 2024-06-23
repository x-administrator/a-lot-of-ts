import { Version_V1 } from '../base/types';

export type ErrorEvents = {
  player: {
    'daily-bonus': {
      [Version_V1]: { message: string };
    };
  };
};
