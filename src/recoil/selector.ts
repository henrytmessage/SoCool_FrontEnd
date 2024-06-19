import { selector } from 'recoil';
import { textState } from './atom';

// dùng để xử lý state từ atom để tạo ra 1 state biến đổi khác 
export const charCountState = selector<number>({
  key: 'charCountState',
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  },
});