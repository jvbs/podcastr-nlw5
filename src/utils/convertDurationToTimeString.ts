//? If you get a hour in seconds, first you need to divide per 60
//? and then per 60 again
//? which is the same as (60*60) = 3600

export function convertDurationToTimeString(duration: number){
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60

  const timeString = [hours, minutes, seconds]
  .map(unit => 
    String(unit).padStart(2, '0')
  )
  .join(':')

  return timeString
}