import {AuthenticationDeclaration} from '@/types/authentication';
import {StateCreator} from 'zustand';
import {produce} from 'immer';

const initialState: AuthenticationDeclaration.AuthState = {
  loading: false,
};


const authSliceCreator: StateCreator<AuthenticationDeclaration.AuthSlice> = (set) => ({
  ...initialState,
  setLoading: async (value: boolean) => {
    set(produce((state: AuthenticationDeclaration.AuthState) => {
      state.loading = value;
    }));
  }
});

export default authSliceCreator;
