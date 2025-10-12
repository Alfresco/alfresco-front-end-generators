export interface TemplateAppGeneratorSchema {
  name: string;
  template: 'empty' | 'acs' | 'aps' | 'acs-aps' | 'apa' | 'acs-apa' | 'automate';
  authType: 'BASIC' | 'OAUTH';
  provider: 'ECM' | 'BPM' | 'ALL';
}
