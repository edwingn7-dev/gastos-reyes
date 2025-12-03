try {
  const firebaseConfig = {
    apiKey: "AIzaSyBmTiYqdWHnCAkwQFEKmzME1DB0HEU1114",
    authDomain: "gastos-reyes.firebaseapp.com",
    projectId: "gastos-reyes",
    storageBucket: "gastos-reyes.appspot.com",
    messagingSenderId: "752119688558",
    appId: "1:752119688558:web:225619eaad4e156bb9e0cc"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.firestore().enablePersistence().catch(() => {});
  window.db = firebase.firestore();
  window.storage = firebase.storage();
} catch (e) {
  document.getElementById('cfgNotice')?.style?.setProperty('display','block');
  console.warn('Falta config Firebase o SDK no cargó', e);
}