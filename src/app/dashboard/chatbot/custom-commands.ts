import axios from 'axios';
import { authHelper } from '@/auth-util/auth-provider';
import { immerable } from 'immer';

const apiBase = '/api/custom-commands';

export class CustomCommand {

  [immerable] = true;
  prefix: string;
  enabled: boolean;
  is_alias: boolean;
  alias_of: string;
  body: string;

  constructor(data: CustomCommand) {
    this.prefix = data.prefix;
    this.enabled = data.enabled;
    this.is_alias = data.is_alias;
    this.alias_of = data.alias_of;
    this.body = data.body;
  }

  // TODO: placeholder
  async updateCustomCommand(): Promise<void> {
    return axios.post(`${apiBase}/update-custom-command`, this, {
      headers: authHelper.getAuthHeader(),
    }).then(() => {
      return;
    }).catch(err => {
      throw err;
    });
  }

}

export class ApiCustomCommands {

  custom_commands: CustomCommand[];

  constructor(data: ApiCustomCommands) {
    this.custom_commands = data.custom_commands;
  }

  // TODO: placeholder
  static async getCustomCommands(): Promise<ApiCustomCommands> {
    return axios.get<ApiCustomCommands>(`${apiBase}/get-custom-commands`, {
      headers: authHelper.getAuthHeader(),
    }).then(res => {
      return res.data;
    }).catch(err => {
      throw err;
    });
  }

}
