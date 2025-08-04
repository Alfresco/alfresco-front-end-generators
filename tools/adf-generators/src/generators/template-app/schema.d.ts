export interface TemplateAppGeneratorSchema {
  name: string;
  template: 'empty' | 'acs' | 'aps' | 'acs-aps';
  authType?: 'BASIC' | 'OAUTH';
  provider?: 'ECM' | 'BPM' | 'ALL';
}
