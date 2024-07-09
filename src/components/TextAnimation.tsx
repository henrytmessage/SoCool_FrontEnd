import React, { useState, useEffect } from 'react'
interface ITextAnimation {
  text: string
  setIsAnimating?: React.Dispatch<React.SetStateAction<boolean>>
}

const TextAnimation = ({ text, setIsAnimating }: ITextAnimation) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    const animateText = async () => {
      const lines = text.split('\n') // Tách chuỗi thành các dòng bằng ký tự xuống dòng
      for (let line of lines) {
        for (let i = 0; i < line.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 10)) // Đợi 10ms trước khi hiển thị ký tự tiếp theo
          setDisplayText(prev => prev + line[i]) // Thêm ký tự tiếp theo vào displayText
        }
        await new Promise(resolve => setTimeout(resolve, 10)) // Đợi 10ms trước khi hiển thị dòng mới
        setDisplayText(prev => prev + '<br />') // Thêm thẻ <br /> để xuống dòng
      }
      setIsAnimating && setIsAnimating(false)
    }
    animateText()
  }, [text])

  return <span dangerouslySetInnerHTML={{ __html: displayText }} />
}

export default TextAnimation
