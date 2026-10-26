// Local-calendar dates avoid UTC changing the user's selected booking day.
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function lastBookingDate(now = new Date()) {
  const date = new Date(now); date.setDate(date.getDate()+90); return localDate(date);
}
export function validDate(date, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && localDate(parsed)===date && date >= localDate(now) && date <= lastBookingDate(now);
}
export function validateBooking(values, times, now = new Date()) {
  const errors = {};
  if (!validDate(values.date, now)) errors.date = 'Choose a date between today and 90 days from now.';
  if (!values.time || !times.includes(values.time)) errors.time = 'Choose an available time for this date.';
  if (!Number.isInteger(Number(values.guests)) || Number(values.guests)<1 || Number(values.guests)>10) errors.guests='Choose a party size between 1 and 10.';
  if (!['None','Birthday','Anniversary','Other'].includes(values.occasion)) errors.occasion='Choose an occasion from the list.';
  if (!values.name.trim() || values.name.trim().length<2 || values.name.trim().length>80) errors.name='Enter your name (2–80 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.length>254) errors.email='Enter a valid email address.';
  if ((values.requests || '').length>500) errors.requests='Keep special requests to 500 characters.';
  return errors;
}
