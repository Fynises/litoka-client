import { JsonDefaultCommand } from '@/redux-store/models/chatbot-default-config';
import api from '@/util/authenticated-api-client';

type ApiDefaultCommands = {
  defaultCommands: JsonDefaultCommand[];
};

export async function loadDefaultCommands(): Promise<JsonDefaultCommand[]> {
  const res = await api.get<ApiDefaultCommands>('/api/default-commands/get');
  return res.data.defaultCommands;
}
