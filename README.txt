# Gastos Reyes (PWA)
App offline para iPhone/iPad que guarda gastos por día/semana/mes con fotos. No requiere servidor.

## Cómo publicarla fácil (sin cuentas)
1. Ve a **https://app.netlify.com/drop** (Netlify Drop).
2. Arrastra la carpeta `gastos_reyes_pwa.zip` o el contenido de la carpeta del proyecto.
3. Netlify te dará un **enlace HTTPS**. Ábrelo en tu iPhone/iPad.
4. En Safari: **Compartir → Añadir a pantalla de inicio**. Se verá como una app.

> Los datos se guardan localmente en cada dispositivo (IndexedDB). Si quieres migrar o hacer copia: usa **Respaldar (.json)** y luego en otro dispositivo **Restaurar (.json)**.

## Funciones
- Registro: trabajo, descripción, monto, foto, fecha automática.
- Filtros: Día / Semana / Mes / Todos.
- Totales por vista y buscador.
- Exportar CSV y respaldo JSON.
- Installable (PWA) y offline.

## Notas
- iOS exige HTTPS para instalar la PWA (por eso usamos Netlify Drop).
- Las fotos se guardan en el navegador del dispositivo; para moverlas, usa el respaldo JSON.
