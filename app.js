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
 ['exterior-front-gate','Front of the lodge','The front of the lodge at House 90-A'],['double-room-terrazzo-bed','Double room','Double room with seating'],['twin-room-window','Twin room','Two beds beside a large window'],['lobby-staircase','Lobby','Lobby and spiral staircase'],
 ['family-room-twin-beds','Larger room','Larger room with two double beds'],['dining-hall','Dining hall','Dining hall'],['meeting-table','Meeting hall','Meeting table set for a session'],['entrance-guard','Entrance','Staffed entrance to the property'],
 ['double-room-blue-wall','Double room','Double room with desk and seating'],['suite-interconnected','Interconnected rooms','Interconnected rooms'],['atrium-skylight','Skylight','Looking up through the atrium skylight'],['double-room-wardrobe','Double room','Double room with wardrobe and seating'],
 ['upper-landing','Upper landing','Upper-floor landing and staircase'],['twin-room-towel-swans','Twin room','Twin room made up for arrival'],['breakfast-parathas','Breakfast','Fresh parathas at breakfast'],['double-room-balcony-door','Double room','Double room with a balcony door'],
 ['corridor','Corridor','Ground-floor corridor'],['double-room-wood-doors','Double room','Double room with wooden doors'],['family-room-wide','Larger room','Larger room with two beds, desk and seating'],['meeting-table-white-setup','Meeting hall','Meeting table with refreshments counter'],
 ['double-room-terrazzo','Double room','Double room with en-suite bathroom door'],['twin-room-mirror','Twin room','Twin room reflected in a mirror'],['exterior-dusk','Evening','The lodge from across the road at dusk'],['exterior-balcony','Balcony side','The balcony side of the house'],
 ['double-room-terrazzo-desk','Desk and wardrobe','Desk, TV and wardrobe in a double room'],['meeting-table-detail','Meeting detail','Place setting at the meeting table']
];
let expanded=false,currentPhoto=0;
function renderGallery(){
 $('photo-grid').replaceChildren();
 photos.slice(0,expanded?photos.length:8).forEach((photo,index)=>{
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Open photo: '+photo[1]);
  const img=document.createElement('img');img.src=`assets/g6/${photo[0]}.webp`;img.alt=photo[2];img.loading='lazy';img.width=400;img.height=333;
  const plus=document.createElement('span');plus.textContent='↗';plus.setAttribute('aria-hidden','true');button.append(img,plus);
  button.addEventListener('click',()=>{currentPhoto=index;showPhoto();$('lightbox').showModal();track('gallery_open','gallery');});
  $('photo-grid').append(button);
 });
 $('more-photos').textContent=expanded?'Show fewer photos −':`View all ${photos.length} photos +`;
 $('more-photos').setAttribute('aria-expanded',String(expanded));
}
function showPhoto(){const p=photos[currentPhoto];$('lightbox-image').src=`assets/g6/${p[0]}.webp`;$('lightbox-image').alt=p[2];$('photo-caption').textContent=p[2];$('photo-count').textContent=`${currentPhoto+1} / ${photos.length}`;}
renderGallery();
$('more-photos').addEventListener('click',()=>{expanded=!expanded;renderGallery();});
$('close-lightbox').addEventListener('click',()=>$('lightbox').close());
function advancePhoto(delta){currentPhoto=(currentPhoto+delta+photos.length)%photos.length;showPhoto();}
$('prev-photo').addEventListener('click',()=>advancePhoto(-1));$('next-photo').addEventListener('click',()=>advancePhoto(1));
$('lightbox').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')advancePhoto(-1);if(e.key==='ArrowRight')advancePhoto(1);});
function updateRoute(){const url=new URL('https://www.google.com/maps/dir/');url.search=new URLSearchParams({api:'1',origin:'Embassy Lodge, House 90-A, Luqman Hakeem Road, G-6/3, Islamabad, Pakistan',destination:$('destination').value==='custom'?$('custom-destination').value.trim():$('destination').value,travelmode:$('travel').value});$('route-link').href=url.href;}
$('destination').addEventListener('change',()=>{$('custom-destination-field').hidden=$('destination').value!=='custom';updateRoute();});
$('custom-destination').addEventListener('input',updateRoute);
$('route-link').addEventListener('click',event=>{if($('destination').value==='custom'&&!$('custom-destination').value.trim()){event.preventDefault();$('custom-destination').focus();}});$('travel').addEventListener('change',updateRoute);updateRoute();
// PRICES: change these values to update every price shown on the site.
const BASE_RATE=10500;      // one guest, per night, before tax
const EXTRA_GUEST=1500;     // each additional paying guest, before tax
const TAX=1.15*1.05;        // 15% GST, then 5% bed tax = 20.75%
const ROUND_TO=100;         // shown prices are rounded to the nearest 100
const withTax=amount=>Math.round(amount*TAX/ROUND_TO)*ROUND_TO;
const pkr=amount=>'PKR '+amount.toLocaleString('en-PK');
const perNight=guests=>withTax(BASE_RATE)+withTax(EXTRA_GUEST)*(guests-1);
document.querySelectorAll('[data-price]').forEach(el=>{el.textContent=pkr(perNight(Number(el.dataset.price)));});
// Rough price guide: nothing is required; it only prepares a WhatsApp message.
function estimate(){
 const guests=$('guests').value,nights=$('nights').value,room=$('room-type').value;
 if(guests==='more'||nights==='more'||room==='Interconnected rooms')return null;
 return perNight(Number(guests))*Number(nights);
}
function updateEstimate(){
 const total=estimate(),nights=Number($('nights').value);
 $('estimate-label').textContent=total===null?'Larger group or longer stay':(nights>1?`Estimated ${nights}-night total`:'Estimated rate for one night');
 $('estimate').textContent=total===null?'Ask for a quote':pkr(total);
}
['guests','nights','room-type'].forEach(id=>$(id).addEventListener('change',updateEstimate));updateEstimate();
$('booking-form').addEventListener('submit',event=>{
 event.preventDefault();
 const total=estimate();
 const pick=id=>$(id).options[$(id).selectedIndex].text;
 const message=`Hello Embassy Lodge, I would like to ask about a stay.\nGuests: ${pick('guests')} · Nights: ${pick('nights')}\nRoom: ${pick('room-type')}`+(total===null?'':`\nWebsite estimate: ${pkr(total)}`)+`\nPlease confirm availability and your best price. [Website]`;
 track('whatsapp_click','price_guide');
 window.location.href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(message);
});
// Directions experiment: count how often the folded directions tool is opened.
$('route-tool').addEventListener('toggle',()=>{if($('route-tool').open)track('directions_open','location');});
// Things to do: count how often each folded list is opened.
[['fold-places','places_open'],['fold-events','events_open']].forEach(([id,name])=>$(id).addEventListener('toggle',()=>{if($(id).open)track(name,'things');}));
// Temporary closure notice: keep keyboard and screen-reader focus inside it while it is present.
if($('closure')){document.querySelectorAll('body > header, body > main, body > footer, .mobile-contact').forEach(el=>{el.inert=true;});}
