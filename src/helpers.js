export function dateTimeLocal(date) {
  if (!date) {
    return
  }
  return date.toISOString().replace('Z', '')
}