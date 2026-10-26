import { localDate, validDate, validateBooking } from './booking.js';
const STORAGE_KEY='little-lemon-reservations-v1';
const TIMES=['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'];
function readReservations() {
  // Invalid or unavailable storage must not silently produce a false confirmation.
  const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(parsed) || parsed.some(r=>!r || typeof r.date!=='string' || typeof r.time!=='string')) throw new Error('Saved reservations could not be read. Clear this demo’s site data and try again.');
  return parsed.filter(r=>r.date>=localDate());
}
export async function fetchAPI(date, now=new Date()) {
  if (!validDate(date,now)) return [];
  const reservations=readReservations();
  return TIMES.filter(time => (date!==localDate(now) || time > `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`) && !reservations.some(r=>r.date===date && r.time===time));
}
export async function submitAPI(values) {
  const times=await fetchAPI(values.date);
  if (Object.keys(validateBooking(values,times)).length) throw new Error('This time is no longer available or your details need updating. Please review the form.');
  const reservation={id:crypto.randomUUID(),date:values.date,time:values.time,guests:Number(values.guests),occasion:values.occasion};
  // Contact details and free-text requests are intentionally not persisted.
  const reservations=readReservations();
  if (reservations.some(r=>r.date===values.date && r.time===values.time)) throw new Error('That table was just reserved. Please choose another time.');
  localStorage.setItem(STORAGE_KEY,JSON.stringify([...reservations,reservation]));
  return reservation;
}
