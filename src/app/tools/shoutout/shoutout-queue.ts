import { ShoutoutObject } from './shoutout-object';

export interface ShoutoutWrapper {
  id: string,
  shoutout: ShoutoutObject,
}

export class ShoutoutQueue {
  wrappers: ShoutoutWrapper[];

  constructor() {
    this.wrappers = [];
  }

  add(shoutout: ShoutoutWrapper): void {
    this.wrappers.push(shoutout);
  }

  popFront(): ShoutoutWrapper | undefined {
    console.log('pop front');
    return this.wrappers.shift();
  }

  getFront(): ShoutoutWrapper | undefined {
    if (this.wrappers.length > 0) {
      return this.wrappers[0];
    } else {
      return undefined;
    }
  }

  isEmpty(): boolean {
    return this.wrappers.length === 0;
  }

}
