import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  dialog: null,
  dialogId: null,
};

const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
  openConfirmation: (state, action) => {
      state.isOpen = true;
      state.dialog = action.payload.dialog;
      state.dialogId = action.payload.dialogId;
    },
    closeConfirmation: (state) => {
      state.isOpen = false;
      state.dialog = null;
      state.dialogId = null;
    },
    confirmAction: (state) => {
      state.isOpen = false;
      state.dialog = null;
      state.dialogId = null;
    },
    cancelAction: (state) => {
      state.isOpen = false;
      state.dialog = null;
      state.dialogId = null;
    },
  },
});

export const { openConfirmation, closeConfirmation, confirmAction, cancelAction } = confirmationSlice.actions;
export default confirmationSlice.reducer;