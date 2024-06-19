import { atom } from 'recoil';

export const textState = atom<string>({
  key: 'textState', // cần 1 key để phân biệt atom
  default: '', // giá trị mặc định
});