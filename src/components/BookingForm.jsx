import { useEffect, useRef, useState } from 'react';
import { fetchAPI, submitAPI } from '../api.js';
import { localDate, lastBookingDate, validateBooking } from '../booking.js';

export default function BookingForm({onSuccess}) {
  const [values,setValues]=useState({date:localDate(),time:'',guests:'2',occasion:'None',name:'',email:'',requests:''});
  const [times,setTimes]=useState([]);
  const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(true);
  const [submitting,setSubmitting]=useState(false);
  const [failure,setFailure]=useState('');
  const [retry,setRetry]=useState(0);
  const form=useRef(null);
  const lock=useRef(false);
  useEffect(()=>{
    let active=true;
    setLoading(true);
    fetchAPI(values.date).then(slots=>{if(active) setTimes(slots);}).catch(()=>{if(active){setTimes([]);setFailure('We couldn’t load available times. Check browser storage permissions, then try again.');}}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[values.date,retry]);
  function change(event) {
    const {name,value}=event.target;
    if(name==='date')setFailure('');
    setValues(v=>({...v,[name]:value,...(name==='date'?{time:''}:{})}));
    setErrors(e=>({...e,[name]:undefined,...(name==='date'?{time:undefined}:{})}));
  }
  async function submit(event) {
    event.preventDefault();
    if(lock.current)return;
    const next=validateBooking(values,times);setErrors(next);setFailure('');
    if(Object.keys(next).length) {form.current.elements.namedItem(Object.keys(next)[0])?.focus(); return;}
    lock.current=true;setSubmitting(true);
    try { const receipt=await submitAPI(values);onSuccess(receipt); }
    catch(error){setFailure(error instanceof Error?error.message:'Your reservation could not be saved. Please try again.');setRetry(v=>v+1);}
    finally {lock.current=false;setSubmitting(false);}
  }
  const invalid=(name)=>({'aria-invalid':!!errors[name],'aria-describedby':errors[name]?`${name}-error`:undefined});
  const error=(name)=>errors[name] && <p className="field-error" id={`${name}-error`} role="alert">{errors[name]}</p>;
  return <form ref={form} onSubmit={submit} noValidate aria-label="Table reservation" aria-busy={submitting}>
    <fieldset disabled={submitting}><legend><span className="step-number">01</span> Your table</legend>
      <div className="form-grid"><div className="field"><label htmlFor="date">Choose a date <span aria-hidden="true">*</span></label><input id="date" name="date" type="date" min={localDate()} max={lastBookingDate()} required value={values.date} onChange={change} {...invalid('date')}/>{error('date')}</div>
      <div className="field"><label htmlFor="guests">Number of guests <span aria-hidden="true">*</span></label><input id="guests" name="guests" type="number" min="1" max="10" step="1" required value={values.guests} onChange={change} {...invalid('guests')}/>{error('guests')}</div></div>
      <div className="field"><label htmlFor="time">Available time <span aria-hidden="true">*</span></label><select id="time" name="time" required disabled={loading || times.length===0} value={values.time} onChange={change} {...invalid('time')}><option value="">{loading?'Loading available times…':times.length?'Select your preferred time':'No times available — choose another date'}</option>{times.map(t=><option key={t} value={t}>{t}</option>)}</select>{error('time')}<p className="field-hint" role="status">{loading?'Checking tables…':`${times.length} available times. Times shown in your device’s local time.`}</p></div>
      <div className="field"><label htmlFor="occasion">Occasion</label><select id="occasion" name="occasion" value={values.occasion} onChange={change} {...invalid('occasion')}><option value="None">Just a lovely meal</option><option>Birthday</option><option>Anniversary</option><option>Other</option></select>{error('occasion')}</div>
    </fieldset>
    <fieldset disabled={submitting}><legend><span className="step-number">02</span> A few details</legend><div className="form-grid"><div className="field"><label htmlFor="name">Full name <span aria-hidden="true">*</span></label><input id="name" name="name" autoComplete="name" required minLength="2" maxLength="80" placeholder="Your name" value={values.name} onChange={change} {...invalid('name')}/>{error('name')}</div><div className="field"><label htmlFor="email">Email address <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength="254" required placeholder="you@example.com" value={values.email} onChange={change} {...invalid('email')}/>{error('email')}</div></div><div className="field"><label htmlFor="requests">Anything we should know? <span className="optional">Optional</span></label><textarea id="requests" name="requests" rows="3" maxLength="500" placeholder="Dietary needs, accessibility requests, or a special occasion…" value={values.requests} onChange={change} {...invalid('requests')}/>{error('requests')}</div></fieldset>
    {failure&&<div className="notice error-notice" role="alert">{failure} <button type="button" className="text-button" onClick={()=>{setFailure('');setRetry(v=>v+1);}}>Retry availability</button></div>}
    <p className="field-hint">Fields marked * are required. For parties larger than 10, please contact the restaurant.</p>
    <button className="button button-wide" type="submit" disabled={loading || submitting || times.length===0}>{submitting?'Reserving your table…':'Confirm reservation'} <span aria-hidden="true">↗</span></button>
    <p className="privacy-note">Demo experience: no real table is booked and no email is sent. Your name, email, and requests are not saved.</p>
  </form>;
}
