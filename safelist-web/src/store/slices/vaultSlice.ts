import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface VaultSliceType {
  secretKey: CryptoKey | null;
  updateTrigger: number;
}

const getInitialState = (): VaultSliceType => {
  return {
    secretKey: null,
    updateTrigger: 0
  }
}

const vaultSlice = createSlice({
  name: "vault",
  initialState: getInitialState(),
  reducers: {
    updateSecretKey: (state, action: PayloadAction<CryptoKey>) => {
      if (action.payload) {
        state.secretKey = action.payload;
      }
    },
    triggerUpdate: (state) => {
      state.updateTrigger = state.updateTrigger === 0 ? 1 : 0;
    },
  },
  selectors: {
    getUpdateTrigger: (state) => {
      return state.updateTrigger;
    },
    getSecretKey: (state) => {
      return state.secretKey;
    },
  }
});

export const { updateSecretKey, triggerUpdate } = vaultSlice.actions;
export const { getSecretKey, getUpdateTrigger } = vaultSlice.selectors;
export default vaultSlice;
