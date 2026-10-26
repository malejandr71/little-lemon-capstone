import { describe,it,expect,vi } from 'vitest';
import {localDate,lastBookingDate,validDate,validateBooking} from './booking.js';
import { fetchAPI,submitAPI } from './api.js';
const now=new Date(2026,9,26,12,0);
const values={date:'2026-10-27',time:'18:00',guests:'2',occasion:'None',name:'Test Guest',email:'guest@example.com',requests:''};
describe('booking rules',()=>{
 it('formats dates in the local calendar and supports year boundaries',()=>{expect(localDate(new Date(2026,11,31))).toBe('2026-12-31');expect(lastBookingDate(new Date(2026,11,31))).toBe('2027-03-31');});
 it('rejects impossible dates, past days, and dates beyond the booking window',()=>{for(const date of ['2026-02-30','2026-10-25','2027-02-01','nonsense'])expect(validDate(date,now)).toBe(false);expect(validDate('2026-10-26',now)).toBe(true);expect(validDate(lastBookingDate(now),now)).toBe(true);});
 it('accepts valid input',()=>expect(validateBooking(values,['18:00'],now)).toEqual({}));
 it('rejects missing fields, invalid email, unavailable time, invalid occasion and fractional guests',()=>{expect(validateBooking({...values,date:'',time:'19:00',guests:'1.5',occasion:'Unknown',name:' ',email:'wrong',requests:'a'.repeat(501)},['18:00'],now)).toHaveProperty('requests');expect(Object.keys(validateBooking({...values,date:'',time:'19:00',guests:'1.5',occasion:'Unknown',name:' ',email:'wrong'},['18:00'],now))).toHaveLength(6);});
 it.each(['0','11','-1','', 'Infinity'])('rejects invalid party size %s',guests=>expect(validateBooking({...values,guests},['18:00'],now)).toHaveProperty('guests'));
});
describe('demo API',()=>{
 it('filters past time slots for today and exposes slots for future dates',async()=>{expect(await fetchAPI('2026-10-26',new Date(2026,9,26,20,0))).toEqual(['20:30','21:00','21:30']);expect(await fetchAPI('2026-10-27',now)).toContain('17:00');expect(await fetchAPI('2026-10-25',now)).toEqual([]);});
 it('saves a reservation, removes the slot and rejects duplicate booking without storing contact data',async()=>{vi.useFakeTimers();vi.setSystemTime(now);try {const result=await submitAPI(values);expect(result.id).toBeTruthy();expect(await fetchAPI(values.date)).not.toContain(values.time);await expect(submitAPI(values)).rejects.toThrow();const stored=localStorage.getItem('little-lemon-reservations-v1');expect(stored).not.toContain(values.email);expect(stored).not.toContain(values.name);}finally{vi.useRealTimers();}});
 it('surfaces storage write failures instead of returning a false confirmation',async()=>{vi.useFakeTimers();vi.setSystemTime(now);vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Storage unavailable');});try{await expect(submitAPI(values)).rejects.toThrow('Storage unavailable');}finally{vi.useRealTimers();}});
 it('handles malformed stored reservations explicitly',async()=>{localStorage.setItem('little-lemon-reservations-v1','{}');await expect(fetchAPI('2026-10-27',now)).rejects.toThrow('could not be read');});
});
