import { ClipDetails, JsonClipDetails } from './clip-details';
import { ShoutoutWrapper } from './shoutout-queue';
import { v4 as uuidv4 } from 'uuid';

export interface JsonShoutoutObject {
  channelName: string,
  channelProfile: string,
  duration: number,
  clipDetails: JsonClipDetails | null,
}

export class ShoutoutObject implements JsonShoutoutObject {
  channelName: string;
  channelProfile: string;
  duration: number;
  clipDetails: ClipDetails | null;

  constructor(shoutoutDetails: JsonShoutoutObject) {
    this.channelName = shoutoutDetails.channelName;
    this.channelProfile = shoutoutDetails.channelProfile;
    this.duration = shoutoutDetails.duration;
    if (shoutoutDetails.clipDetails !== null) {
      this.clipDetails = new ClipDetails(shoutoutDetails.clipDetails);
    } else {
      this.clipDetails = null;
    }
  }

  static makeObjectWithId(jsonString: string): ShoutoutWrapper {
    const data: JsonShoutoutObject = JSON.parse(jsonString);
    const shoutout = new ShoutoutObject(data);
    const wrapper: ShoutoutWrapper = {
      id: uuidv4(),
      shoutout: shoutout
    };
    return wrapper;
  }

  // should only be called from the context of a clip shoutout
  getClipDuration(): number {
    if (this.clipDetails !== null) {
      console.log(`shoutout-types.ts: ${this.clipDetails.getTotalDuration()}`);
      return this.clipDetails.getTotalDuration() + this.duration;
    } else {
      throw 'not a clip shoutout';
    }
  }

}