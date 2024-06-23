export type SettingsPubSub_Event<T extends SettingsApiGql_EventsList> = {
  topic: T;
  payload: SettingsApiGql_EventPayload[T];
};

const prefix = 'settings_';

export enum SettingsApiGql_EventNames {
  STATE_UPDATE = prefix + 'config_update',
}

export interface SettingsApiGql_EventPayload {
  [SettingsApiGql_EventNames.STATE_UPDATE]: any;
}

export type SettingsApiGql_EventsList = keyof SettingsApiGql_EventPayload;
