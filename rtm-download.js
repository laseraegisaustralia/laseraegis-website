/* Email capture for the free radar example. Existing form service handles notifications. */
(() => {
'use strict';
const script = document.currentScript;
const base = new URL('.', script.src);
const pdf = new URL('assets/rtm/resources/rtm-radar-example-walkthrough.pdf', base).href;
const pack = new URL('assets/rtm/resources/rtm-radar-example-pack.zip', base).href;
let dialog, opener, busy = false, unlocked = false;
const track = (name, extra = {}) => {
 if (typeof window.gtag === 'function') window.gtag('event', name, {product_id:'RTM', request_type:'resource', resource_id:'radar_engineering_case_final_20261021', source_page:location.pathname, ...window.LaserAegisAttribution?.eventFields(), ...extra});
};
function build() {
 dialog = document.createElement('dialog');
 dialog.className = 'rtm-download-modal';
 dialog.setAttribute('aria-labelledby','rtmDownloadTitle');
 dialog.innerHTML = `<button type="button" class="rtm-download-close" aria-label="Close download window">×</button>
 <p class="rtm-download-eyebrow">FREE ENGINEERING CASE</p><h2 id="rtmDownloadTitle">Less Chasing. Clearer Project Decisions.</h2>
 <p>See how RTM connects supplier replies, controlled changes and verification evidence, helping your team reduce cross-file checking and prepare for review. Includes a 10-page radar case study, a practical review checklist and Excel / CSV requirements references.</p>
 <form id="rtmQuickDownloadForm"><label for="rtmDownloadEmail">Email address</label><input id="rtmDownloadEmail" type="email" name="email" autocomplete="email" required placeholder="you@company.com">
 <label class="rtm-download-consent"><input type="checkbox" name="rtm_follow_up_consent" value="yes"><span>Optional: send me occasional RTM updates and relevant engineering resources. I can unsubscribe at any time.</span></label>
 <input type="checkbox" name="botcheck" class="rtm-download-honey" tabindex="-1" aria-hidden="true">
 <p class="rtm-download-status" role="status" aria-live="polite"></p><button class="rtm-download-submit" type="submit">Get My Free Case Pack ↓</button>
 <p class="rtm-download-small">We use your email to process this resource request. Fictional example; no installation needed. Updates are optional. To withdraw your subscription, email <a href="mailto:xander@laseraegis.dev">xander@laseraegis.dev</a>.</p></form>
 <div class="rtm-download-success" hidden><p>Your case pack is ready. Read the PDF, or download the complete pack with Excel and CSV references.</p><a class="rtm-download-submit rtm-download-pdf" href="${pdf}" target="_blank" rel="noopener">Read the Engineering Case (PDF) ↗</a><a class="rtm-download-demo" download href="${pack}">Download the Complete Pack (ZIP) ↓</a><p>Want to see the decision trail with your team?</p><a class="rtm-download-demo" data-product="RTM" data-request-type="demo" data-cta-id="download_success_demo" href="${new URL('request.html?product=RTM&request_type=demo&source_page=radar_download',base).href}">Book a Guided Demo ↗</a><p class="rtm-download-small">RTM updates are sent only if you opted in.</p></div>`;
 document.body.append(dialog);
 const close = () => dialog.close();
 dialog.querySelector('.rtm-download-close').addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});
 const form=dialog.querySelector('form'), button=form.querySelector('button[type=submit]'), status=form.querySelector('[role=status]');
 const fallback=dialog.querySelector('a[download]');
 dialog.querySelector('.rtm-download-pdf').addEventListener('click',()=>track('resource_open',{file_format:'pdf'}));
 fallback.addEventListener('click',()=>track('resource_download',{file_format:'zip'}));
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(busy||unlocked||!form.reportValidity())return;
  busy=true;button.disabled=true;button.textContent='Preparing your download…';status.textContent='';
  const data=new FormData(form);
  data.set('rtm_follow_up_consent',form.elements.rtm_follow_up_consent.checked ? 'yes' : 'no');
  data.set('consent_text_version','rtm_optional_updates_20261021');
  const fields={access_key:"10a9131d-dea9-4f06-bd17-fefb5ba3597a",subject:'RTM Radar Example — Download Request',from_name:'LaserAegis Website',product:'RTM',request_type:'resource',requested_resource:'radar_engineering_case_final_20261021',resource_name:'RTM Radar Engineering Case (PDF + Excel + CSV)',source_page:location.pathname,requested_at:new Date().toISOString()};
  Object.entries({...fields,...window.LaserAegisAttribution?.fields()}).forEach(([k,v])=>data.set(k,v));
  try{
   const response=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data,signal:AbortSignal.timeout(20000)});const result=await response.json();
   if(!response.ok||!result.success)throw Error('Submission failed');
   unlocked=true;form.hidden=true;dialog.querySelector('.rtm-download-success').hidden=false;
   track('generate_lead',{lead_type:'resource'});track('enquiry_submit');
   dialog.querySelector('.rtm-download-pdf').focus();
  }catch(error){status.textContent='We could not prepare your download. Please try again or email xander@laseraegis.dev.';button.disabled=false;button.textContent='Get My Free Case Pack ↓'}
  finally{busy=false}
 });
}
function open(link) {
 opener=link;if(!dialog)build();dialog.showModal();document.body.style.overflow='hidden';
 if(!unlocked)dialog.querySelector('input[type=email]').focus();else dialog.querySelector('.rtm-download-pdf').focus();
}
document.addEventListener('click',e=>{
 const link=e.target.closest?.('a[data-product="RTM"][data-request-type="resource"]');
 if(!link||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||typeof HTMLDialogElement==='undefined')return;
 e.preventDefault();open(link);
});
})();
