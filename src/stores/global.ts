import { create } from 'zustand';

export interface GlobalState {
  enums: Record<string, Record<string, string>>;
  setEnums: (enums: Record<string, Record<string, string>>) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
  enums: {},
  setEnums: (enums) => set({ enums }),
}));

export default useGlobalStore;
