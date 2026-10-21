'use strict';
const GA_ID = 'G-K84HNTXJLX';
const PHONE = '923028508850';
const $ = id => document.getElementById(id);
let analyticsAllowed = false;
let analyticsStarted = false;
const safeRead = key => { try { return localStorage.getItem(key); } catch { return null; } };
const safeWrite = (key,value) => { try { localStorage.setItem(key,value); } catch {} };
function startAnalytics() {
  analyticsAllowed = true;
  window['ga-disable-' + GA_ID] = false;
  if (analyticsStarted) return;
  analyticsStarted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  const cleanURL = new URL(location.origin + location.pathname);
  const params = new URLSearchParams(location.search);
  // Only deliberately named campaign parameters; never send form content.
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
    const value = params.get(key);
    if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) cleanURL.searchParams.set(key,value);
  }
  window.gtag('config', GA_ID, { page_location: cleanURL.href, page_referrer: document.referrer ? new URL(document.referrer).origin : '', allow_google_signals:false, allow_ad_personalization_signals:false });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);
}
function track(name, placement) {
  if (analyticsAllowed && typeof window.gtag === 'function') window.gtag('event', name, { placement, transport_type:'beacon' });
}
function chooseAnalytics(allow) {
  safeWrite('embassy-analytics', allow ? 'yes' : 'no');
  analyticsAllowed = allow;
  window['ga-disable-' + GA_ID] = !allow;
  $('cookie-banner').hidden = true;
  if (allow) startAnalytics();
}
$('accept-analytics').addEventListener('click',()=>chooseAnalytics(true));
$('decline-analytics').addEventListener('click',()=>chooseAnalytics(false));
$('cookie-settings').addEventListener('click',()=>{ $('cookie-banner').hidden=false; $('accept-analytics').focus(); });
const priorChoice = safeRead('embassy-analytics');
if (priorChoice === 'yes') startAnalytics();
else if (priorChoice !== 'no') $('cookie-banner').hidden=false;
document.addEventListener('click',event=>{
 const link=event.target.closest('[data-event]');
 if(link) track(link.dataset.event,link.dataset.placement);
});
$('year').textContent=new Date().getFullYear();
const photos = [
 [36,'House and lawn','The house across the garden'],[30,'Double room','Double room with a garden-facing window'],[23,'Twin room','Twin beds with a window overlooking greenery'],[12,'Bathroom','Bathroom with shower enclosure'],
 [43,'Shared lounge','Shared lounge and seating'],[22,'Dining room','Dining room at the lodge'],[16,'Spacious room','Spacious bedroom with sofas'],[37,'Entrance','Gated entrance to the property'],[46,'Driveway','Shaded driveway'],[50,'Garden view','A view across the lawn'],[24,'Window seating','Seating beside a garden-facing window'],[28,'Double room','Double room and seating area'],[29,'Room interior','Another double-room arrangement'],[13,'Double bed','A representative double room'],[17,'Room and seating','Bedroom with seating'],[20,'Room layout','Another view of a double room'],[42,'Twin beds','Twin-room bed arrangement'],[38,'Room with sofas','Bedroom with lounge seating'],[5,'Bathroom','Another bathroom and shower'],[14,'Sitting area','Shared sitting area']
];
let expanded=false,currentPhoto=0;
function renderGallery(){
 $('photo-grid').replaceChildren();
 photos.slice(0,expanded?photos.length:8).forEach((photo,index)=>{
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Open photo: '+photo[1]);
  const img=document.createElement('img');img.src=`assets/photo-${photo[0]}.webp`;img.alt=photo[2];img.loading='lazy';img.width=400;img.height=333;
  const plus=document.createElement('span');plus.textContent='↗';plus.setAttribute('aria-hidden','true');button.append(img,plus);
  button.addEventListener('click',()=>{currentPhoto=index;showPhoto();$('lightbox').showModal();track('gallery_open','gallery');});
  $('photo-grid').append(button);
 });
 $('more-photos').textContent=expanded?'Show fewer photos −':'View all 20 photos +';
 $('more-photos').setAttribute('aria-expanded',String(expanded));
}
function showPhoto(){const p=photos[currentPhoto];$('lightbox-image').src=`assets/photo-${p[0]}.webp`;$('lightbox-image').alt=p[2];$('photo-caption').textContent=p[2];$('photo-count').textContent=`${currentPhoto+1} / ${photos.length}`;}
renderGallery();
$('more-photos').addEventListener('click',()=>{expanded=!expanded;renderGallery();});
$('close-lightbox').addEventListener('click',()=>$('lightbox').close());
function advancePhoto(delta){currentPhoto=(currentPhoto+delta+photos.length)%photos.length;showPhoto();}
$('prev-photo').addEventListener('click',()=>advancePhoto(-1));$('next-photo').addEventListener('click',()=>advancePhoto(1));
$('lightbox').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')advancePhoto(-1);if(e.key==='ArrowRight')advancePhoto(1);});
function updateRoute(){const url=new URL('https://www.google.com/maps/dir/');url.search=new URLSearchParams({api:'1',origin:'Embassy Lodge, House 22, Street 4, F-6/3, Islamabad, Pakistan',destination:$('destination').value,travelmode:$('travel').value});$('route-link').href=url.href;}
$('destination').addEventListener('change',updateRoute);$('travel').addEventListener('change',updateRoute);updateRoute();
// Date-only arithmetic avoids daylight-saving and browser locale differences.
function nextDay(date){return new Date(Date.parse(date+'T00:00:00Z')+86400000).toISOString().slice(0,10);}
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
$('checkin').min=today;$('checkout').min=nextDay(today);
function quote(adults,mattresses,nights){return Math.round((9000+1500*(adults-1+mattresses))*1.15)*nights;}
function stayNights(){return Math.round((Date.parse($('checkout').value+'T00:00:00Z')-Date.parse($('checkin').value+'T00:00:00Z'))/86400000);}
function updateEstimate(){
 const nights=stayNights();const valid=Number.isFinite(nights)&&nights>0;
 const family=$('room-type').value==='Interconnected / family rooms';
 $('estimate-label').textContent=family?'Multiple rooms':'Estimated '+(valid?`${nights}-night room total`:'room rate / night');
 $('estimate').textContent=family?'Ask for a quote':'PKR '+quote(Number($('adults').value),Number($('mattresses').value),valid?nights:1).toLocaleString('en-PK');
}
$('checkin').addEventListener('change',()=>{if($('checkin').value){$('checkout').min=nextDay($('checkin').value);if($('checkout').value&&$('checkout').value<=$('checkin').value)$('checkout').value=nextDay($('checkin').value);}updateEstimate();});
['checkout','adults','mattresses','sharing','room-type'].forEach(id=>$(id).addEventListener('change',updateEstimate));
document.querySelectorAll('[data-room]').forEach(link=>link.addEventListener('click',()=>{$('room-type').value=link.dataset.room;updateEstimate();}));
$('booking-form').addEventListener('submit',event=>{
 event.preventDefault();$('form-error').textContent='';
 const nights=stayNights();
 if($('checkin').value<today || !Number.isFinite(nights) || nights<1){$('form-error').textContent='Please choose valid dates, with check-out after check-in.';return;}
 const family=$('room-type').value==='Interconnected / family rooms';
 const message=`Hello Embassy Lodge, I found you through your website.\n\nPlease check availability:\nCheck-in: ${$('checkin').value}\nCheck-out: ${$('checkout').value} (${nights} nights)\nAdults: ${$('adults').value}\nChildren needing mattresses: ${$('mattresses').value}\nChildren sharing existing bedding: ${$('sharing').value}\nPreference: ${$('room-type').value}\n${family?'Please quote for the rooms we need.':'Website estimate for one room: '+$('estimate').textContent+' including 15% GST.'}\n\nPlease confirm the room setup, total price, deposit and cancellation terms.\nWebsite reference: EL-WEB`;
 track('whatsapp_click','enquiry_form');
 window.location.href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(message);
});
