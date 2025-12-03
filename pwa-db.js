// pwa-db.js - IndexedDB wrapper
const DB_NAME = 'gastos-reyes-db';
const DB_VERSION = 1;
const STORE = 'expenses';

export function openDB(){
  return new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e)=>{
      const db = e.target.result;
      if(!db.objectStoreNames.contains(STORE)){
        const store = db.createObjectStore(STORE, {keyPath:'id', autoIncrement:true});
        store.createIndex('by_date','date');
        store.createIndex('by_job','job');
      }
    };
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
}

export async function addExpense(exp){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add(exp);
    tx.oncomplete = ()=> resolve(true);
    tx.onerror = ()=> reject(tx.error);
  });
}

export async function listExpenses(){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const items = [];
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).openCursor();
    req.onsuccess = (e)=>{
      const cursor = e.target.result;
      if(cursor){ items.push(cursor.value); cursor.continue(); }
      else resolve(items.sort((a,b)=> b.date - a.date));
    };
    req.onerror = ()=> reject(req.error);
  });
}

export async function bulkImport(items){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(STORE, 'readwrite');
    for(const it of items){ tx.objectStore(STORE).add(it); }
    tx.oncomplete = ()=> resolve(true);
    tx.onerror = ()=> reject(tx.error);
  });
}
