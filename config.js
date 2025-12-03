try {
  const firebaseConfig = {
    apiKey: "AIzaSyBmTlYqdWHnCAkwQFEKmzMElDB0HEU1l14",
    authDomain: "gastos-reyes.firebaseapp.com",
    projectId: "gastos-reyes",
    storageBucket: "gastos-reyes.firebasestorage.app",
    messagingSenderId: "752119688558",
    appId: "1:752119688558:web:225619eaad4e156bb9e0cc"
  };

  // Inicializa con SDK "compat" (ya lo cargamos en index.html)
  firebase.initializeApp(firebaseConfig);

  // Modo offline (si falla, seguimos igual)
  firebase.firestore().enablePersistence().catch(() => {});

  // Exponemos db y storage para sync.js
  window.db = firebase.firestore();
  window.storage = firebase.storage();
} catch (e) {
  document.getElementById('cfgNotice')?.style?.setProperty('display','block');
  console.warn('Falta config Firebase o SDK no cargó', e);
}
