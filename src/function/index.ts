export const checkLocationInVietnam = (lat: number, lng: number) => {
  if (lat >= 8.3 && lat <= 23.4 && lng >= 102.1 && lng <= 109.5) {
    return true
  } else {
    return false
  }
};