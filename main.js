// main.js - UI logic
import { openDB, addExpense, listExpenses, bulkImport } from './pwa-db.js';

const els = {
  job: document.getElementById('job'),
  amount: document.getElementById('amount'),
  desc: document.getElementById('desc'),
  photo: document.getElementById('photo'),
  saveBtn: document.getElementById('saveBtn'),
  clearBtn: document.getElementById('clearBtn'),
  list: document.getElementById('list'),
  summary: document.getElementById('summary'),
  search: document.getElementById('search'),
  exportCsv: document.getElementById('exportCsv'),
  exportJson: document.getElementById('exportJson'),
  importBtn: document.getElementById('importBtn'),
  importJson: document.getElementById('importJson'),
  tabs: Array.from(document.querySelectorAll('.tab[data-range]'))
};

let currentRange = 'day';
let all = [];

function startOfWeek(d){
  const date = new Date(d);
  const day = (date.getDay()+6)%7; // Monday-based
  date.setHours(0,0,0,0);
  date.setDate(date.getDate()-day);
  return date;
}
function endOfWeek(d){
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(s.getDate()+7);
  return e;
}
function startOfMonth(d){
  const date = new Date(d);
  return new Date(date.getFullYear(), date.getMonth(), 1, 0,0,0,0);
}
function endOfMonth(d){
  const date = new Date(d);
  return new Date(date.getFullYear(), date.getMonth()+1, 1, 0,0,0,0);
}

function formatMoney(n){
  return Number(n||0).toLocaleString('en-US', {style:'currency', currency:'USD'});
}
function fmtDate(ts){
  const d = new Date(ts);
  return d.toLocaleString();
}

async function refresh(){
  all = await listExpenses();
  render();
}

function filterRange(items){
  const now = new Date();
  let from = new Date(0), to = new Date(8640000000000000);
  if(currentRange==='day'){
    from = new Date(now); from.setHours(0,0,0,0);
    to = new Date(now); to.setHours(24,0,0,0);
  }else if(currentRange==='week'){
    from = startOfWeek(now);
    to = endOfWeek(now);
  }else if(currentRange==='month'){
    from = startOfMonth(now);
    to = endOfMonth(now);
  }
  return items.filter(x=> currentRange==='all' ? true : (x.date>=from.getTime() && x.date<to.getTime()));
}

function render(){
  const q = (els.search.value||'').trim().toLowerCase();
  const filtered = filterRange(all).filter(x=> 
    !q || (x.job||'').toLowerCase().includes(q) || (x.desc||'').toLowerCase().includes(q)
  );

  // summary
  const total = filtered.reduce((s,x)=> s + (Number(x.amount)||0), 0);
  const count = filtered.length;
  els.summary.innerHTML = `
    <span class="pill"><b>Total:</b> ${formatMoney(total)}</span>
    <span class="pill"><b>Registros:</b> ${count}</span>
  `;

  // list
  els.list.innerHTML = '';
  for(const it of filtered){
    const div = document.createElement('div');
    div.className = 'item';
    const title = document.createElement('h4');
    title.textContent = `${it.job||'(sin trabajo)'} — ${formatMoney(it.amount)}`;
    const meta = document.createElement('small');
    meta.textContent = `${fmtDate(it.date)}`;
    const desc = document.createElement('div');
    desc.textContent = it.desc||'';
    div.appendChild(title);
    div.appendChild(meta);
    div.appendChild(desc);
    if(it.photoDataUrl){
      const img = document.createElement('img');
      img.className = 'thumb';
      img.src = it.photoDataUrl;
      div.appendChild(img);
    }
    els.list.appendChild(div);
  }
}

async function handleSave(){
  const job = els.job.value.trim();
  const amount = parseFloat(els.amount.value||'0');
  const desc = els.desc.value.trim();
  let photoDataUrl = null;

  if(els.photo.files && els.photo.files[0]){
    const file = els.photo.files[0];
    const reader = new FileReader();
    photoDataUrl = await new Promise(res=>{
      reader.onload = ()=> res(reader.result);
      reader.readAsDataURL(file);
    });
  }
  await addExpense({job, amount, desc, photoDataUrl, date: Date.now()});
  els.job.value = ''; els.amount.value=''; els.desc.value=''; els.photo.value=null;
  refresh();
}

function toCSV(items){
  const headers = ['fecha','trabajo','descripcion','monto'];
  const rows = [headers.join(',')];
  for(const it of items){
    const r = [
      new Date(it.date).toISOString(),
      JSON.stringify(it.job||''),
      JSON.stringify(it.desc||''),
      (Number(it.amount)||0).toFixed(2)
    ];
    rows.push(r.join(','));
  }
  return rows.join('\n');
}
function download(name, text, type='text/plain'){
  const blob = new Blob([text], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(()=> URL.revokeObjectURL(url), 2000);
}

els.saveBtn.addEventListener('click', handleSave);
els.clearBtn.addEventListener('click', ()=>{ els.job.value=''; els.amount.value=''; els.desc.value=''; els.photo.value=null; });
els.search.addEventListener('input', render);
els.exportCsv.addEventListener('click', ()=>{
  const filtered = filterRange(all);
  download(`gastos_${currentRange}.csv`, toCSV(filtered), 'text/csv');
});
els.exportJson.addEventListener('click', ()=>{
  const filtered = filterRange(all);
  download(`gastos_backup_${currentRange}.json`, JSON.stringify(filtered,null,2), 'application/json');
});
els.importBtn.addEventListener('click', ()=> els.importJson.click());
els.importJson.addEventListener('change', async (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const text = await file.text();
  try{
    const arr = JSON.parse(text);
    if(Array.isArray(arr)){
      await bulkImport(arr);
      refresh();
    }else{
      alert('Archivo inválido');
    }
  }catch(err){ alert('No se pudo leer el archivo'); }
});

els.tabs.forEach(t=> t.addEventListener('click', ()=>{
  els.tabs.forEach(x=> x.classList.remove('active'));
  t.classList.add('active');
  currentRange = t.dataset.range;
  render();
}));

openDB().then(refresh);
