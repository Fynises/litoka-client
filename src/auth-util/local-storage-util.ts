export default class LocalStorageUtil {

  static get(key: string): string {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null) {
        return val;
      } else {
        throw `${key} is null`;
      }
    } else {
      throw 'localstorageutil error';
    }
  }

  static hasKey(key: string): boolean {
    if (typeof window === 'undefined') return false;
    const val = localStorage.getItem(key);
    if (val === null) return false;
    return true;
  }

  static set(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  static clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }

}
