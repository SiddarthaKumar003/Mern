import { createSlice } from '@reduxjs/toolkit';

// This is the iniatial state
const initialState = {
    user:null
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUserDetails: (state, action) => {
            state.user = action.payload;
          },
          clearUserDetails: (state) => {
            state.user = null;
          }
    }
})

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;