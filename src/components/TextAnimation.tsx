import React, { useState, useEffect } from 'react';
interface ITextAnimation {
  text: string;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>
}

const TextAnimation = ({text, setIsAnimating}: ITextAnimation) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const animateText = async () => {
      for (let i = 0; i < text.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Đợi 50ms trước khi hiển thị ký tự tiếp theo
        setDisplayText(prev => prev + text[i]); // Thêm ký tự tiếp theo vào displayText
      }
      setIsAnimating(false)
    };
    animateText();
  }, [text]);

  return <span>{displayText}</span>;
};

export default TextAnimation;
