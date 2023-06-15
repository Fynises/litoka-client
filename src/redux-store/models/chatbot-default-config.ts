import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export type ConfigFields = string | boolean | number;

type Cooldown = {
  enabled: boolean;
  duration: number;
}

type DefaultCommandAccess = {
  moderator: Cooldown;
  vip: Cooldown;
  subscriber: Cooldown;
  everyone: Cooldown;
}

export type JsonDefaultCommand = {
  prefix: string;
  enabled: boolean;
  access: DefaultCommandAccess;
  custom_access: string[];
  aliases?: string[];
};

export type ModifiedField = {
  initial: ConfigFields;
  new: ConfigFields;
};

type DefaultCommandStore = {
  commands: Record<string, JsonDefaultCommand>;
  changes: Record<string, Record<string, ModifiedField>>;
}

const initialState: DefaultCommandStore = {
  commands: {},
  changes: {}
};

export const defaultCommandsSlice = createSlice({
  name: 'defaultCommands',
  initialState,
  reducers: {
    loadConfig(state, action: PayloadAction<JsonDefaultCommand[]>) {
      const sorted = _.orderBy(action.payload, (a) => a.prefix, ['asc']);
      sorted.forEach(e => state.commands[e.prefix] = e);
    },
    updateConfigField(state, action: PayloadAction<{ prefix: string, key: string, value: ConfigFields }>) {
      const pPrefix = action.payload.prefix;
      const pKey = action.payload.key;
      const pVal = action.payload.value;

      if (!_.has(state.commands[pPrefix], pKey)) throw `key not found ${pKey}`;

      const initialState: ConfigFields = _.get(state.commands[pPrefix], pKey);

      _.set(state.commands[pPrefix], pKey, pVal);

      if (!_.has(state.changes, pPrefix)) {
        state.changes[pPrefix] = {};
      }

      if (_.has(state.changes[pPrefix], pKey) && state.changes[pPrefix][pKey].initial === pVal) {
        delete state.changes[pPrefix][pKey];
        if (_.isEmpty(state.changes[pPrefix])) delete state.changes[pPrefix];
      } else {
        state.changes[pPrefix][pKey] = {
          initial: initialState,
          new: pVal
        };
      }

      console.log(`change map: ${JSON.stringify(state.changes)}`);

    },
    update(state) {
      state.changes = {};
    }
  },
});

export const {
  loadConfig,
  updateConfigField,
  update
} = defaultCommandsSlice.actions;

export default defaultCommandsSlice.reducer;
