export type ResponceAPI = {
  type: 'json' | 'text';
  fileNameInDir: string;
  fileContent: string;
};

export type Library = {
  type: 'file' | 'dir';
  path: string; // URL
  fileNamePattern?: string; // Regexp
  filesSelected?: string[];
  filesExcluded?: string[];
  resp: ResponceAPI;
};

const githubResp: ResponceAPI = {
  type: 'json',
  fileNameInDir: 'name',
  fileContent: 'content',
};

const singleFileResp: ResponceAPI = {
  type: 'text',
  fileNameInDir: '',
  fileContent: '',
};
