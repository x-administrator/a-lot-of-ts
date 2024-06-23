import { Version_V1 } from '../base/types';

export type RoomCreateType = {
  gameModeId: number;
  mapId: number;
  teamId: string;
  serverId: string;
};

export type GameServerApiCommands = {
  room: {
    create: {
      [Version_V1]: RoomCreateType;
    };
  };
};
