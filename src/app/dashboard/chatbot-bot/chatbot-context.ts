import { createContext, Dispatch } from 'react';
import { ApiDefaultCommands } from './default-commands';
import { ApiCustomCommands } from './custom-commands';

export interface ChatBotState {
  defaultCommands?: ApiDefaultCommands,
  setDefaultCommands: Dispatch<ApiDefaultCommands>,
  customCommands?: ApiCustomCommands,
  setCustomCommands: Dispatch<ApiCustomCommands>,
}

export const ChatBotContext = createContext<ChatBotState | null>(null);
