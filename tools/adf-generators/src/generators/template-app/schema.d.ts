export interface TemplateAppGeneratorSchema {
  name: string;
  template: 'empty' | 'acs' | 'aps' | 'acs-aps' | 'apa' | 'acs-apa';
  authType?: 'BASIC' | 'OAUTH';
  provider?: 'ECM' | 'BPM' | 'ALL';
}
