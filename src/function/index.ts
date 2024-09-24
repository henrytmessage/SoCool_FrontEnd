import dayjs from "dayjs"

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

export const toCustomDate = (date:string) => {
  if (isNotEmpty(date)){
    console.log(date)
    const formattedDate = dayjs(date, 'M/D/YYYY, h:mm:ss A').format('DD MMM YYYY, h:mm:ss A');
    return formattedDate;
  }else{
    return ''
  }
}

export const formatDate = (date:string) => {
  try{
    if (isNotEmpty(date)){
      const formattedDate = dayjs(date).format('DD MMM YYYY');
      return formattedDate;
    }
    return ''
  }catch(error){
    console.log(error)
    return ''
  }  
}

export const isExpired = (date:string):boolean =>{
  try{
    const now = dayjs();
    
    const parsedDate = dayjs(date);
    
    return parsedDate.isBefore(now);
    
  }catch(error){
    return true
  }
}

export const isNotEmpty = (text:string): boolean => {
  if (text == undefined || text == null || text == ''){
    return false
  }
  return true
}
