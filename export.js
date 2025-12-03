// export.js — Generador de PDF simple con jsPDF
// Requiere que el HTML tenga cargado:
// <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>

(function () {
  function getVisibleText() {
    const $summary = document.getElementById('summary');
    const $card = document.querySelector('.card');
    let txt = '';

    if ($summary && $summary.innerText.trim()) {
      txt = $summary.innerText;
    } else if ($card && $card.innerText.trim()) {
      txt = $card.innerText;
    } else {
      txt = document.body.innerText;
    }

    txt = txt.replace(/\n{3,}/g, '\n\n').trim();
    return txt || 'Sin registros para exportar.';
  }

  function exportPDF() {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        alert('No se encontró jsPDF. Verifica carga de librería.');
        return;
      }

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const ahora = new Date();
      const titulo = `Gastos Reyes — ${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`;

      doc.setFontSize(14);
      doc.text(titulo, 40, 40);

      const contenido = getVisibleText();
      const anchoTexto = 515;
      const lineas = doc.splitTextToSize(contenido, anchoTexto);

      doc.setFontSize(11);
      doc.text(lineas, 40, 70);

      doc.save('gastos-reyes.pdf');
    } catch (e) {
      console.error(e);
      alert('Error al exportar PDF: ' + (e?.message || e));
    }
  }

  function bind() {
    const btn = document.getElementById('exportPdfBtn');
    if (btn) {
      btn.addEventListener('click', exportPDF);
    } else {
      setTimeout(bind, 400);
    }
  }

  document.addEventListener('DOMContentLoaded', bind);
})();
