import { Version_V1 } from '../base/types';
import { ErrorType } from '../base/types/errors.types';

export type BaseErrors = {
  [ErrorType.TRANSACTION]: {
    [Version_V1]: boolean;
  };
};
