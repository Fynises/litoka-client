import { v4 as uuidv4 } from 'uuid';

interface JsonClipDetails {
  embedUrl: string,
  clipDuration: number, // float
  maxClipDuration: number | null, // integer
  muted: boolean,
  clipGame: string,
}

export class ClipDetails implements JsonClipDetails {
  embedUrl: string;
  clipDuration: number;
  maxClipDuration: number | null;
  muted: boolean;
  clipGame: string;

  constructor(clipDetails: JsonClipDetails) {
    this.embedUrl = clipDetails.embedUrl;
    this.clipDuration = clipDetails.clipDuration;
    this.maxClipDuration = clipDetails.maxClipDuration;
    this.muted = clipDetails.muted;
    this.clipGame = clipDetails.clipGame;
  }

  private durationToMillis(): number {
    return Math.floor(this.clipDuration * 1000);
  }

  getTotalDuration(): number {
    const clipDurationMs = this.durationToMillis();
    if (this.maxClipDuration === null) {
      return clipDurationMs;
    }
    if (clipDurationMs > this.maxClipDuration) {
      return this.maxClipDuration;
    } else {
      return clipDurationMs;
    }
  }

}

export interface ShoutoutWrapper {
  id: string,
  shoutout: ShoutoutObject,
}

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
