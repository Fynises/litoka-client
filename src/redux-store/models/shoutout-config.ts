import { JsonShoutoutConfig } from '@/app/dashboard/shoutout/api-shoutout-config';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

type BasicMap = {
  [key: string]: ShoutoutValueType;
}

type ShoutoutConfigStore = {
  data: JsonShoutoutConfig | null;
  changes: BasicMap;
};

const initialState: ShoutoutConfigStore = {
  data: null,
  changes: {},
};

export type ShoutoutValueType = boolean | number | string;

export const shoutoutConfigSlice = createSlice({
  name: 'shoutoutConfig',
  initialState,
  reducers: {
    loadConfig(state, action: PayloadAction<JsonShoutoutConfig>) {
      state.data = action.payload;
    },
    setConfigField(state, action: PayloadAction<{ key: string, value: ShoutoutValueType }>) {
      const pKey = action.payload.key;
      const pVal = action.payload.value;
      if (!_.has(state.data, pKey)) throw `key not found: ${pKey}`;
      _.set(state, `data.${pKey}`, pVal);

      if (pKey in state.changes && _.get(state.data, pKey) === pVal) {
        delete state.changes[pKey];
      } else {
        state.changes[action.payload.key] = action.payload.value;
      }

      console.log(`current map: ${JSON.stringify(state.changes)}`);
    },
    update(state) {
      state.changes = {};
    }
  },
});

export const {
  loadConfig,
  setConfigField,
  update,
} = shoutoutConfigSlice.actions;

export default shoutoutConfigSlice.reducer;
