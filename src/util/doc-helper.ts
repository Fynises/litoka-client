class DocHelper {
  // change this when testing locally
  readonly baseUrl = 'https://docs.litoka.net';

  make(path: string): string {
    return `${this.baseUrl}${path}`;
  }

}

const docHelper = new DocHelper();

export default docHelper;
