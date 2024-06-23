export type GoogleTable = {
  googlFilesId: number;
  externalId: string;
  mimeType: string;
  name: string;
  modifiedTime: Date;
  needUpdate: boolean;
  createdAt: Date;
  parentId: number | null;
  markToRemove: boolean;
};

export type GoogleTableDataPreSave = {
  googleTableDataPreSaveId: number;
  googleTableId: number;
  externalId: string;
  data: unknown;
  title: string;
  updatedAt: Date;
  createdAt: Date;
};
