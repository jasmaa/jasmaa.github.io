/**
 * Display date as string
 * 
 * @param {*} d 
 * @returns 
 */
export function displayDate(d) {
  return d.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: "numeric", timeZone: 'GMT' })
}