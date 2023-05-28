import axios from 'axios';
import { authHelper } from '@/auth-util/auth-provider';
import { immerable } from 'immer';
import _ from 'lodash';

interface Cooldown {
  enabled: boolean,
  duration: number,
}

interface DefaultCommandAccess {
  moderator: Cooldown,
  vip: Cooldown,
  subscriber: Cooldown,
  everyone: Cooldown,
}

interface ToggleCommandRequest {
  prefix: string,
  toggle: boolean,
}

const apiBase = '/api/default-commands';

export class DefaultCommand {

  [immerable] = true;
  prefix: string;
  enabled: boolean;
  access: DefaultCommandAccess;
  custom_access: string[];
  aliases?: string[]; // to be implemented later

  constructor(data: DefaultCommand) {
    this.prefix = data.prefix;
    this.enabled = data.enabled;
    this.access = data.access;
    this.custom_access = data.custom_access;
    this.aliases = data.aliases;
  }

  async updateCommand(): Promise<void> {
    if (!authHelper.isAuthorized) throw 'err';
    return axios.put(`${apiBase}/edit`, this, {
      headers: authHelper.getAuthHeader(),
    }).then(() => {
      return;
    }).catch(err => {
      throw err;
    });
  }

  async updateToggle(toggle: boolean): Promise<void> {
    if (!authHelper.isAuthorized) throw 'err';
    console.log(`object enabled: ${this.enabled}`);
    const toggleRequest: ToggleCommandRequest = {
      prefix: this.prefix,
      toggle: toggle,
    };
    return axios.patch(`${apiBase}/toggle`, toggleRequest, {
      headers: authHelper.getAuthHeader(),
    }).then(() => {
      return;
    }).catch(err => {
      throw err;
    });
  }

  getDescription(): string {
    switch (this.prefix) {
      case '!litoka': return 'Prints a summary of the litoka project with links to GitHub repository';
      case '!so': return 'Shout out your fellow streamers with or without a clip';
      case '!game': return 'Changes the current game of your stream';
      case '!title': return 'Changes the current title of your stream';
      case '!timezone': return 'Prints the current time of the specified timezone';
      case '!uptime': return 'Prints the stream uptime';
      case '!roll': return 'Roll a dice';
      case '!8ball': return 'Ask the magic 8-ball a question';
      default: return 'error';
    }
  }

}

export class ApiDefaultCommands {

  default_commands: DefaultCommand[];

  constructor(data: ApiDefaultCommands) {
    this.default_commands = data.default_commands;
  }

  static async getDefaultCommands(): Promise<ApiDefaultCommands> {
    if (!authHelper.isAuthorized) throw 'not authorized';
    return axios.get<ApiDefaultCommands>(`${apiBase}/get`, {
      headers: authHelper.getAuthHeader(),
    }).then(res => {
      const resData = res.data;
      const dataList = _.orderBy(resData.default_commands, ['prefix'], ['asc']);
      resData.default_commands = dataList;
      return resData;
    }).catch(err => {
      throw err;
    });
  }

}
