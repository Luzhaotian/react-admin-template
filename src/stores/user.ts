import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface UserState {
  isLogin: boolean;
  token: string;
  userInfo: UserInfo | null;
  setToken: (token: string) => void;
  setUserInfo: (info: UserInfo) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLogin: false,
      token: '',
      userInfo: null,
      setToken: (token) => set({ token, isLogin: !!token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      logout: () => set({ isLogin: false, token: '', userInfo: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ token: state.token, isLogin: state.isLogin, userInfo: state.userInfo }),
    }
  )
);

export default useUserStore;
