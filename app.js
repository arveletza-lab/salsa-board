/* ===== Salsa Musicality Board ===== */

const STEPS = 16;
const ROWS = [
  { id:'conteo',  label:'Conteo On1', color:'coral',
    steps:()=>[0,2,4,8,10,12], accent:[0,8], pause:[6,14] },
  { id:'click',   label:'Click', color:'coral',
    steps:()=>[0,2,4,8,10,12], accent:[0,8], pause:[6,14] },
  { id:'clave',   label:'Clave', color:'amber',
    steps:()=> claveDir==='3-2' ? [0,3,6,10,12] : [2,4,8,11,14] },
  { id:'campana', label:'Campana', color:'amber',
    steps:()=>[0,4,8,12] },
  { id:'conga',   label:'Conga', color:'amber',
    steps:()=>[2,10,6,7,14,15], accentSet:new Set([2,10]),
    syllables:{ 2:'PA', 6:'KU', 7:'KU', 10:'PA', 14:'KU', 15:'KU' } }, // PA=slap, KU=open
  { id:'bajo',    label:'Bajo', color:'teal',
    steps:()=>[3,6,11,14] },
  { id:'piano',   label:'Piano', color:'teal',
    steps:()=>[0,3,6,8,11,14] },
  { id:'guiro',   label:'Güiro', color:'teal',
    steps:()=>Array.from({length:16},(_,i)=>i),
    longSet:new Set([0,2,4,6,8,10,12,14]), tick:true },
];

let claveDir = '3-2';
let on = { conteo:true, click:false, clave:true, campana:false, conga:false, bajo:false, piano:false, guiro:false };
const gridRoot = document.getElementById('gridRoot');
const pulseBar = document.getElementById('pulseBar');

const ICONS = {
  conteo: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 15V9a5 5 0 0 1 10 0v6"/><path d="M10 4v2"/></svg>',
  click: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M6.5 3.5h7l2 13h-11z"/><path d="M10 16l2.5-8"/></svg>',
  clave: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="8.5" width="12" height="3" rx="1.4" transform="rotate(-18 8 10)"/><rect x="6" y="8.5" width="12" height="3" rx="1.4" transform="rotate(18 12 10)"/></svg>',
  campana: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 3h6l2 12H5z"/><path d="M6 15h8"/></svg>',
  conga: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h8l-1 5-1 9H8L7 8z"/><path d="M6 3h8M6.6 8h6.8"/></svg>',
  bajo: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 2v9"/><ellipse cx="9" cy="14" rx="4.5" ry="4"/><path d="M6.5 12.5c1 1 3.5 1 5 0"/></svg>',
  piano: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="14" height="12" rx="1"/><path d="M6.5 4v8M10 4v8M13.5 4v8"/></svg>',
  guiro: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="7.5" ry="4.2" transform="rotate(-14 10 10)"/><path d="M5 8.5l9 3M4.7 10.8l9 3M5.5 6.3l9 3"/></svg>'
};

/* ---- UI build ---- */
function buildPulseBar(){
  pulseBar.innerHTML='';
  pulseBar.appendChild(document.createElement('div'));
  for(let i=0;i<16;i++){
    const cell = document.createElement('div');
    cell.className='pulse-cell';
    if(i%2===0){
      const b = i/2;
      const dot = document.createElement('div');
      dot.className='pulse-dot'+((b===0||b===4)?' big':'');
      dot.id='pulse-'+b;
      cell.appendChild(dot);
    }
    pulseBar.appendChild(cell);
  }
}
buildPulseBar();

function buildGrid(){
  gridRoot.innerHTML='';

  const headers = document.createElement('div');
  headers.className='col-headers';
  headers.appendChild(document.createElement('div'));
  const bar1 = document.createElement('div'); bar1.className='bar-label'; bar1.textContent='Compás 1';
  const bar2 = document.createElement('div'); bar2.className='bar-label'; bar2.textContent='Compás 2';
  headers.appendChild(bar1); headers.appendChild(bar2);
  gridRoot.appendChild(headers);

  const nums = document.createElement('div');
  nums.className='col-headers';
  nums.appendChild(document.createElement('div'));
  const labels = ['1','+','2','+','3','+','4','+','5','+','6','+','7','+','8','+'];
  labels.forEach(l=>{
    const d = document.createElement('div');
    d.className = l==='+' ? 'count-plus' : 'count-num';
    d.textContent = l;
    nums.appendChild(d);
  });
  gridRoot.appendChild(nums);

  ROWS.forEach(row=>{
    const el = document.createElement('div');
    el.className='row'+(on[row.id]?' on':'');
    el.id='row-'+row.id;

    const label = document.createElement('div');
    label.className='row-label';
    const icon = document.createElement('span');
    icon.className='row-icon';
    icon.innerHTML = ICONS[row.id];
    const name = document.createElement('span');
    name.className='row-name';
    name.textContent = row.label;
    const sw = document.createElement('span');
    sw.className='switch';
    sw.onclick = ()=>{ on[row.id]=!on[row.id]; el.classList.toggle('on', on[row.id]); };
    label.appendChild(sw);
    label.appendChild(icon);
    label.appendChild(name);
    el.appendChild(label);

    const stepSet = new Set(row.steps());
    for(let i=0;i<STEPS;i++){
      const cell = document.createElement('div');
      cell.className='cell';
      cell.dataset.step=i;
      if(i===0||i===8) cell.classList.add('bar-start');

      if(row.syllables){
        // Fila con sílabas onomatopéyicas: texto que aparece al sonar (sin dot)
        if(row.syllables[i]){
          const s = document.createElement('div');
          s.className='syl';
          s.dataset.row=row.id;
          s.dataset.step=i;
          s.textContent=row.syllables[i];
          cell.appendChild(s);
        }
      } else if(stepSet.has(i)){
        const d = document.createElement('div');
        d.className='dot';
        if(row.longSet && !row.longSet.has(i)) d.classList.add('short');
        d.dataset.row=row.id;
        d.style.setProperty('--dot-color', `var(--${row.color})`);
        cell.appendChild(d);
      } else if(row.pause && row.pause.includes(i)){
        const d = document.createElement('div');
        d.className='dot hollow';
        cell.appendChild(d);
      } else if(row.tick){
        const d = document.createElement('div');
        d.className='dot tick';
        cell.appendChild(d);
      }
      el.appendChild(cell);
    }
    gridRoot.appendChild(el);

    // Numeración por fila (1 & 2 & ...) para filas con sílabas
    if(row.syllables){
      const rc = document.createElement('div');
      rc.className='row-count';
      rc.appendChild(document.createElement('div'));  // columna del label (vacía)
      for(let i=0;i<STEPS;i++){
        const c = document.createElement('div');
        c.textContent = (i%2===0) ? String(i/2+1) : '&';
        rc.appendChild(c);
      }
      gridRoot.appendChild(rc);
    }
  });
}
buildGrid();

document.getElementById('claveToggle').addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  claveDir = btn.dataset.val;
  [...btn.parentElement.children].forEach(b=>b.classList.toggle('active', b===btn));
  buildGrid();
});

const bpmSlider = document.getElementById('bpmSlider');
const bpmVal = document.getElementById('bpmVal');
let bpm = parseInt(bpmSlider.value,10);
bpmSlider.oninput = ()=>{ bpm = parseInt(bpmSlider.value,10); bpmVal.textContent = bpm; };

const volSlider = document.getElementById('volSlider');

/* ---- Audio ---- */
let ctx, master, noiseBuf;
let playing=false, current=0, nextTime=0, timerID=null;
const lookahead=25, scheduleAhead=0.1;
let queue=[];

// Sample buffers. If a file fails to load, that instrument falls back to synth.
const SAMPLE_FILES = {
  clave:       'audio/clave.wav',
  campana:     'audio/campana.wav',
  conga_open:  'audio/conga_open.wav',
  conga_slap:  'audio/conga_slap.wav',
  guiro_long:  'audio/guiro_long.wav',
  guiro_short: 'audio/guiro_short.wav',
  conteo_1:    'audio/conteo_1.wav',
  conteo_2:    'audio/conteo_2.wav',
  conteo_3:    'audio/conteo_3.wav',
  conteo_4:    'audio/conteo_4.wav',
  conteo_5:    'audio/conteo_5.wav',
  conteo_6:    'audio/conteo_6.wav',
  conteo_7:    'audio/conteo_7.wav',
  conteo_8:    'audio/conteo_8.wav',
};
const buffers = {};   // id -> AudioBuffer

async function loadSamples(){
  const jobs = Object.entries(SAMPLE_FILES).map(async ([id,url])=>{
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error(res.status);
      const arr = await res.arrayBuffer();
      buffers[id] = await ctx.decodeAudioData(arr);
    }catch(err){
      console.warn(`No se pudo cargar ${url} — usando sonido sintetizado.`, err);
    }
  });
  await Promise.all(jobs);
}

function initAudio(){
  if(ctx) return Promise.resolve();
  ctx = new (window.AudioContext||window.webkitAudioContext)();
  master = ctx.createGain();
  master.gain.value = parseFloat(volSlider.value);
  master.connect(ctx.destination);
  volSlider.oninput = ()=>{ master.gain.value = parseFloat(volSlider.value); };
  const len = ctx.sampleRate*0.3;
  noiseBuf = ctx.createBuffer(1,len,ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
  return loadSamples();
}

function playSample(id, t, gainVal=1){
  const buf = buffers[id];
  if(!buf) return false;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const g = ctx.createGain(); g.gain.value = gainVal;
  src.connect(g).connect(master); src.start(t);
  return true;
}

function envGain(time, peak, attack, decay){
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, time);
  g.gain.linearRampToValueAtTime(peak, time+attack);
  g.gain.exponentialRampToValueAtTime(0.001, time+attack+decay);
  return g;
}

/* Percussion: try sample first, fall back to synth */
function playClave(t){
  if(playSample('clave',t)) return;
  const o = ctx.createOscillator(); o.type='square'; o.frequency.value=2400;
  const g = envGain(t,0.5,0.001,0.045);
  o.connect(g).connect(master); o.start(t); o.stop(t+0.06);
}
function playCampana(t){
  if(playSample('campana',t)) return;
  [820,560].forEach((f,i)=>{
    const o = ctx.createOscillator(); o.type='square'; o.frequency.value=f;
    const g = envGain(t,0.35-i*0.08,0.001,0.14);
    o.connect(g).connect(master); o.start(t); o.stop(t+0.2);
  });
}
function playConga(t, open){
  if(playSample(open?'conga_open':'conga_slap', t)) return;
  if(open){
    const o = ctx.createOscillator(); o.type='triangle';
    o.frequency.setValueAtTime(210,t);
    o.frequency.exponentialRampToValueAtTime(150,t+0.28);
    const g = envGain(t,0.55,0.002,0.3);
    o.connect(g).connect(master); o.start(t); o.stop(t+0.32);
  } else {
    const src = ctx.createBufferSource(); src.buffer=noiseBuf;
    const bp = ctx.createBiquadFilter(); bp.type='highpass'; bp.frequency.value=1200;
    const g = envGain(t,0.5,0.001,0.07);
    src.connect(bp).connect(g).connect(master); src.start(t); src.stop(t+0.09);
  }
}
function playGuiro(t, long){
  // short scrape a bit quieter than the long, for the call-and-response feel
  if(playSample(long?'guiro_long':'guiro_short', t, long?1.0:0.7)) return;
  const src = ctx.createBufferSource(); src.buffer=noiseBuf;
  const bp = ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=3800; bp.Q.value=1.2;
  const g = envGain(t, long?0.18:0.12, 0.001, long?0.05:0.03);
  src.connect(bp).connect(g).connect(master); src.start(t); src.stop(t+0.06);
}

/* Bajo, piano, conteo: synth for now */
function playBajo(t){
  const o = ctx.createOscillator(); o.type='sine'; o.frequency.value=98;
  const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=400;
  const g = envGain(t,0.7,0.005,0.32);
  o.connect(lp).connect(g).connect(master); o.start(t); o.stop(t+0.35);
}
function playPiano(t){
  [261.6,329.6,392.0].forEach(f=>{
    const o = ctx.createOscillator(); o.type='triangle'; o.frequency.value=f;
    const g = envGain(t,0.22,0.002,0.22);
    o.connect(g).connect(master); o.start(t); o.stop(t+0.24);
  });
}
function playConteo(t, step){
  // Voz real: número = step/2 + 1 (step 0->uno ... step 14->ocho)
  const n = step/2 + 1;
  if(playSample('conteo_'+n, t, 1.0)) return;
  // Fallback: clic sintetizado (acento en el 1 y el 5)
  playClick(t, step);
}
function playClick(t, step){
  // Click sintetizado: oscilador square; el 1 y el 5 un poco más agudos como acento/ancla
  const accent = (step===0 || step===8);
  const o = ctx.createOscillator(); o.type='square'; o.frequency.value = accent?1300:950;
  const g = envGain(t, accent?0.4:0.22, 0.001, 0.03);
  o.connect(g).connect(master); o.start(t); o.stop(t+0.04);
}

/* ---- Sequencer ---- */
function scheduleStep(step, time){
  ROWS.forEach(row=>{
    if(!on[row.id]) return;
    const set = new Set(row.steps());
    if(!set.has(step)) return;
    if(row.id==='conteo') playConteo(time, step);
    else if(row.id==='click') playClick(time, step);
    else if(row.id==='clave') playClave(time);
    else if(row.id==='campana') playCampana(time);
    else if(row.id==='conga') playConga(time, !row.accentSet.has(step));
    else if(row.id==='bajo') playBajo(time);
    else if(row.id==='piano') playPiano(time);
    else if(row.id==='guiro') playGuiro(time, row.longSet.has(step));
  });
  queue.push({step, time});
}

function stepDur(){ return (60/bpm)/2; }

function scheduler(){
  while(nextTime < ctx.currentTime + scheduleAhead){
    scheduleStep(current, nextTime);
    nextTime += stepDur();
    current = (current+1)%STEPS;
  }
}

function animate(){
  if(!playing) return;
  const now = ctx.currentTime;
  while(queue.length && queue[0].time <= now){
    const {step} = queue.shift();
    ROWS.forEach(row=>{
      if(!on[row.id]) return;
      if(!new Set(row.steps()).has(step)) return;
      if(row.syllables){
        const syl = document.querySelector(`.syl[data-row="${row.id}"][data-step="${step}"]`);
        if(syl){ syl.classList.remove('syl-fire'); void syl.offsetWidth; syl.classList.add('syl-fire'); }
      } else {
        const dot = document.querySelector(`.cell[data-step="${step}"] .dot[data-row="${row.id}"]`);
        if(dot){ dot.classList.remove('flash'); void dot.offsetWidth; dot.classList.add('flash'); }
      }
    });
    const beatNow = Math.floor(step/2)%8;
    document.querySelectorAll('.pulse-dot.active').forEach(p=>p.classList.remove('active'));
    document.getElementById('pulse-'+beatNow).classList.add('active');
  }
  requestAnimationFrame(animate);
}

const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
playBtn.onclick = async ()=>{
  await initAudio();
  if(ctx.state==='suspended') ctx.resume();
  playing = !playing;
  if(playing){
    current=0; nextTime=ctx.currentTime+0.05; queue=[];
    timerID = setInterval(scheduler, lookahead);
    requestAnimationFrame(animate);
    playIcon.innerHTML='<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';
  } else {
    clearInterval(timerID);
    document.querySelectorAll('.pulse-dot').forEach(p=>p.classList.remove('active'));
    playIcon.innerHTML='<path d="M8 5v14l11-7z"/>';
  }
};
