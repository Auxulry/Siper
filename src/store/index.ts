import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {lens, withLenses} from '@dhmk/zustand-lens';
import {AuthenticationDeclaration} from '@/types/authentication';
import authSliceCreator from '@/store/slices/auth.slice';


export type StoreState = {
  auth: AuthenticationDeclaration.AuthSlice
}

const useStore = create<StoreState>()(
  devtools(
    immer(
      withLenses<StoreState>({
        auth: lens(authSliceCreator)
      })
    )
  )
);

export default useStore;
