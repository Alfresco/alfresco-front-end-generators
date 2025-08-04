export interface CommonFilesSchema {
  projectName: string;
  projectRoot: string;
  template: 'empty' | 'acs' | 'aps' | 'acs-aps';
  authType: 'BASIC' | 'OAUTH';
  provider: 'ECM' | 'BPM' | 'ALL';
}
