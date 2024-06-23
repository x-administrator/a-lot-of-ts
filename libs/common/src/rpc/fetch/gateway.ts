import { NodeState } from '@app/common/health-check/health-check.type';
import { Version_V1 } from '../base/types';

export type GatewayFetch = {
  common: {
    ping: {
      [Version_V1]: {
        args: string;
        return: NodeState;
      };
    };
  };
};
