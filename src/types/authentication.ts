export declare namespace AuthenticationDeclaration {
  type AuthState = {
    loading: boolean;
  }

  type AuthAction = {
    setLoading: (value: boolean) => Promise<void>;
  }

  type AuthSlice = AuthState & AuthAction;
}
