import { ConfigFields, ModifiedField } from '@/redux-store/models/chatbot-default-config';
import api from '@/util/authenticated-api-client';

export type RawChanges = {
  changes: Record<string, Record<string, ModifiedField>>
}

export type ConfigUpdateRequest = {
  changes: Record<string, Record<string, ConfigFields>>
}

type FlattenedChanges = Record<string, Record<string, ConfigFields>>;

export default class ConfigUpdateHelper {

  changes: Record<string, Record<string, ModifiedField>>;

  constructor(changes: Record<string, Record<string, ModifiedField>>) {
    this.changes = changes;
  }

  private flatten(): FlattenedChanges {
    const flattened: FlattenedChanges = {};
    Object.entries(this.changes).map(([k, v]) => {
      flattened[k] = {};
      Object.entries(v).map(([key, val]) => {
        flattened[k][key] = val.new;
      });
    });
    return flattened;
  }

  async sendRequest(): Promise<void> {
    const req: ConfigUpdateRequest = { changes: this.flatten() };
    await api.patch('/api/default-commands/update/v2', req);
  }

}
