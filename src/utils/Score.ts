export class Score {
  private lib: Library;
  private pattern: RegExp;
  constructor(public spec: ScoreSpec) {
    // if (!window.josephus) {
    //   console.error('Cannot load score – josephus is not initialized.');
    //   this.lib = {};
    //   this.pattern = new RegExp('');
    //   return;
    // }
    this.lib = window.josephus.library[spec.source];
    this.pattern = new RegExp(this.lib.fileNamePattern);
  }

  private async fetch(url: string) {
    return await fetch(url, {
      // headers: {
      //   'User-Agent': 'Josephus KC',
      // },
      // method: 'POST',
      // headers: {
      //   'User-Agent': 'Josephus KC',
      // },
    });
  }

  private randElement(elements) {
    return elements[(elements.length * Math.random()) | 0];
  }

  private async randFileNameFromDir() {
    const resp = this.lib.resp;
    const fileInDir = await this.fetch(this.lib.path).then(r => r[resp.type]());
    const files = fileInDir.filter(f => this.pattern.test(f[resp.fileNameInDir]));
    const file = this.randElement(files);
    return file.name;
  }

  private async randFileName() {
    switch (this.lib.type) {
      case 'dir':
        return await this.randFileNameFromDir();
      case 'file':
        return this.randElement(this.lib.filesSelected);
      default:
        this.lib.type satisfies never;
    }
  }

  async retrieve(): Promise<string> {
    const resp = this.lib.resp;
    const fileName = this.spec.fileName ?? (await this.randFileName());
    const href = this.lib.path + '/' + fileName;
    const result = await this.fetch(href).then(r => r[resp.type]());
    switch (resp.type) {
      case 'json':
        return atob(result[resp.fileContent]);
      case 'text':
        return result;
      default:
        resp.type satisfies never;
    }
    console.warn('Unknown responce result:', result)
    return ''
  }
}
