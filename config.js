try{
const firebaseConfig={apiKey:"REEMPLAZA",authDomain:"REEMPLAZA.firebaseapp.com",projectId:"REEMPLAZA",storageBucket:"REEMPLAZA.appspot.com",messagingSenderId:"REEMPLAZA",appId:"REEMPLAZA"};
firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence().catch(()=>{});
window.db=firebase.firestore(); window.storage=firebase.storage();
}catch(e){document.getElementById('cfgNotice')?.style?.setProperty('display','block'); console.warn('Falta config Firebase',e);}