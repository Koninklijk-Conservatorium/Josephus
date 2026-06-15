type JosephusLibraryResponce = {
  type: 'json' | 'text';
  fileNameInDir: string;
  fileContent: string;
};

type Library = {
  type: 'file' | 'dir';
  path: string; // URL
  fileNamePattern?: string; // Regexp
  filesSelected?: string[];
  filesExcluded?: string[];
  resp: JosephusLibraryResponce;
};

type JosephusLibrary = { library: Record<string, Library> };

// const githubResp: JosephusLibraryResponce = {
//   type: 'json',
//   fileNameInDir: 'name',
//   fileContent: 'content',
// };

// const singleFileResp: JosephusLibraryResponce = {
//   type: 'text',
//   fileNameInDir: '',
//   fileContent: '',
// };
