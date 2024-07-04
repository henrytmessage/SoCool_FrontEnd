export const checkLocationInVietnam = (lat: number, lng: number) => {
  if (lat >= 8.3 && lat <= 23.4 && lng >= 102.1 && lng <= 109.5) {
    return true
  } else {
    return false
  }
}

export const formatVND = (str: string) => {
  return str
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index && index % 3 === 0 ? next + ' ' : next) + prev
    }, '')
}

export const removeSpaces = (str: string) => {
  return str.replace(/\s/g, '')
}
