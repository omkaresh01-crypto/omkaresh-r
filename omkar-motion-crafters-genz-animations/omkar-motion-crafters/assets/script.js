const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
if (menuButton && nav) { menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); const b = menuButton.querySelector('b'); if (b) b.textContent = open ? '−' : '＋'; }); nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); const b = menuButton.querySelector('b'); if (b) b.textContent='＋'; })); }
const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; document.documentElement.style.setProperty('--progress', (max > 0 ? scrollY / max * 100 : 0) + '%'); }, {passive:true});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { const kind = button.dataset.filter; document.querySelectorAll('.filter').forEach(b => { const active = b === button; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); }); document.querySelectorAll('.work-card').forEach(card => { card.hidden = kind !== 'all' && card.dataset.kind !== kind; }); }));

// Gentle scroll reveals; respects reduced-motion preferences.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('.intro-grid, .skills-grid, .tool-item, .service-rows article, .work-card, .contact, .section-label, .work-heading, .services-heading');
  revealTargets.forEach((el, i) => { el.classList.add('reveal'); if (el.classList.contains('tool-item')) el.style.setProperty('--i', i % 8); });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), {threshold: 0.12, rootMargin: '0px 0px -30px 0px'});
  revealTargets.forEach(el => revealObserver.observe(el));
}


// Project carousel: autoplay, touch/trackpad scrolling, filters and progress indicator.
const projectTrack = document.querySelector('#projectTrack');
const projectCards = [...document.querySelectorAll('#projectTrack .work-card')];
const projectPrev = document.querySelector('#projectPrev');
const projectNext = document.querySelector('#projectNext');
const projectCounter = document.querySelector('#projectCounter');
const carouselProgress = document.querySelector('#carouselProgress');
let activeFilter = 'all';
let projectAutoTimer;
function visibleProjects(){ return projectCards.filter(card => !card.hidden); }
function projectStep(){ const card = visibleProjects()[0]; return card ? card.getBoundingClientRect().width + 22 : 300; }
function updateProjectCarousel(){
 if(!projectTrack) return;
 const visible=visibleProjects(); const max=Math.max(0,projectTrack.scrollWidth-projectTrack.clientWidth);
 const fraction=max ? projectTrack.scrollLeft/max : 0;
 if(carouselProgress) carouselProgress.style.width=(fraction*100)+'%';
 if(projectCounter){let index=visible.length?Math.min(visible.length,Math.floor((projectTrack.scrollLeft+projectTrack.clientWidth*.25)/projectStep())+1):0;projectCounter.textContent=String(index).padStart(2,'0')+' / '+String(visible.length).padStart(2,'0');}
}
function moveProjects(direction){ if(projectTrack) projectTrack.scrollBy({left:projectStep()*direction,behavior:'smooth'}); }
projectPrev?.addEventListener('click',()=>moveProjects(-1)); projectNext?.addEventListener('click',()=>moveProjects(1));
projectTrack?.addEventListener('scroll',updateProjectCarousel,{passive:true});
projectTrack?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();moveProjects(1)}if(e.key==='ArrowLeft'){e.preventDefault();moveProjects(-1)}});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter; if(projectTrack)projectTrack.scrollTo({left:0,behavior:'smooth'});setTimeout(updateProjectCarousel,120);}));
function startProjectAutoplay(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;clearInterval(projectAutoTimer);projectAutoTimer=setInterval(()=>{if(!projectTrack||document.hidden||projectTrack.matches(':hover')||projectTrack.contains(document.activeElement))return;const max=projectTrack.scrollWidth-projectTrack.clientWidth;if(max<10)return;if(projectTrack.scrollLeft>=max-8)projectTrack.scrollTo({left:0,behavior:'smooth'});else moveProjects(1)},5200)}
projectTrack?.addEventListener('pointerdown',()=>clearInterval(projectAutoTimer));projectTrack?.addEventListener('pointerup',startProjectAutoplay);projectTrack?.addEventListener('pointerleave',startProjectAutoplay);projectTrack?.addEventListener('focusin',()=>clearInterval(projectAutoTimer));projectTrack?.addEventListener('focusout',startProjectAutoplay);startProjectAutoplay();updateProjectCarousel();window.addEventListener('resize',updateProjectCarousel);
// App orbit controls rotate the carousel manually or pause the continuous orbit.
const orbitStage=document.querySelector('.orbit-stage');const toolOrbit=document.querySelector('#toolOrbit');let orbitRotation=0;
function rotateOrbit(direction){orbitRotation+=direction*36;if(toolOrbit)toolOrbit.style.transform='rotate('+orbitRotation+'deg)';document.querySelectorAll('.orbit-tool').forEach((item,i)=>{item.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)';item.style.transform='rotate(calc(var(--angle) + '+orbitRotation+'deg)) translateY(calc(-1 * min(31vw,235px))) rotate(calc(-1 * (var(--angle) + '+orbitRotation+'deg)))';});}
document.querySelector('#orbitPrev')?.addEventListener('click',()=>rotateOrbit(-1));document.querySelector('#orbitNext')?.addEventListener('click',()=>rotateOrbit(1));document.querySelector('#orbitPause')?.addEventListener('click',e=>{orbitStage?.classList.toggle('paused');const paused=orbitStage?.classList.contains('paused');e.currentTarget.textContent=paused?'▶':'Ⅱ';e.currentTarget.setAttribute('aria-label',paused?'Resume carousel':'Pause carousel');});

// Gen-Z micro-interactions: ambient pointer glow, glass-card highlight, subtle tilt and button ripples.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('pointermove', event => {
    document.documentElement.style.setProperty('--spot-x', event.clientX + 'px');
    document.documentElement.style.setProperty('--spot-y', event.clientY + 'px');
  }, {passive:true});
  document.querySelectorAll('.ai-card').forEach(card => card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--card-x', (event.clientX - rect.left) + 'px');
    card.style.setProperty('--card-y', (event.clientY - rect.top) + 'px');
  }, {passive:true}));
  document.querySelectorAll('#projectTrack .work-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || card.matches(':hover') === false) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-2px)`;
    }, {passive:true});
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}
document.querySelectorAll('.pill-link,.hero-contact-cta,.contact-button,.floating-contact,.carousel-arrow,.orbit-control').forEach(control => {
  control.addEventListener('click', event => {
    if (reduceMotion) return;
    const rect = control.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.35;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    control.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  });
});
