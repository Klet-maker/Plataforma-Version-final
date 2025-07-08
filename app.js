// Lista fija de usuarios
const usuarios = [
  { usuario: "aprendiz1", contrasena: "1234", rol: "aprendiz", nombre: "Juan Pérez" },
  { usuario: "instructor1", contrasena: "abcd", rol: "instructor", nombre: "Ana Gómez" }
];

const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();
  const rol = document.getElementById('rol').value;

  const user = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena && u.rol === rol);

  if (user) {
    mostrarDashboard(user);
    loginContainer.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    alert('Usuario, contraseña o rol incorrectos.');
  }
});

function mostrarDashboard(user) {
  if (user.rol === 'aprendiz') {
    dashboard.innerHTML = `
      <div class="main-rect">
        <div class="aprendiz-dashboard">
          <h2 style="text-align:center;">Bienvenido, ${user.nombre}</h2>
          <div class="graficos-section">
            <div><canvas id="graficoEvidencias"></canvas></div>
          </div>
          <h3 style="margin-left:10px;">Carpetas por Trimestre</h3>
          <div id="carpetas-trimestres"></div>
          <button id="logout-aprendiz-bottom" class="logout-btn" style="margin: 32px auto 0 auto; display:block; position: static; width: fit-content;">Cerrar sesión</button>
        </div>
      </div>
    `;
    renderGraficosAprendiz();
    renderCarpetasTrimestresModal();
    document.getElementById('dashboard-instructor').style.display = 'none';
    document.getElementById('bienvenida-instructor').style.display = 'none';
    document.getElementById('contenedor-instructor').style.display = 'none';
    dashboard.style.display = 'block';
    // Mostrar botón logout para aprendiz
    const logoutAprendiz = document.getElementById('logout-aprendiz');
    if (logoutAprendiz) {
      logoutAprendiz.style.display = '';
      logoutAprendiz.onclick = () => { location.reload(); };
    }
    // Mostrar botón logout inferior para aprendiz (ahora generado dinámicamente)
    const logoutAprendizBottom = document.getElementById('logout-aprendiz-bottom');
    if (logoutAprendizBottom) {
      logoutAprendizBottom.style.display = 'block';
      logoutAprendizBottom.onclick = () => { location.reload(); };
    }
    // Ocultar botón logout de instructor
    const logoutInstructor = document.getElementById('logout-instructor');
    if (logoutInstructor) logoutInstructor.style.display = 'none';
  } else if (user.rol === 'instructor') {
    dashboard.innerHTML = '';
    dashboard.style.display = 'none';
    document.getElementById('contenedor-instructor').style.display = 'flex';
    document.getElementById('dashboard-instructor').style.display = '';
    document.getElementById('bienvenida-instructor').style.display = '';
    document.getElementById('bienvenida-instructor').textContent = `Bienvenido, ${user.nombre}`;
    mostrarDashboardInstructor();
    // Mostrar botón logout para instructor
    const logoutInstructor = document.getElementById('logout-instructor');
    if (logoutInstructor) {
      logoutInstructor.style.display = '';
      logoutInstructor.onclick = () => { location.reload(); };
    }
    // Ocultar botón logout de aprendiz
    const logoutAprendiz = document.getElementById('logout-aprendiz');
    if (logoutAprendiz) logoutAprendiz.style.display = 'none';
  }
}

// Gráfico de evidencias (simulado)
function renderGraficosAprendiz() {
  const ctx = document.getElementById('graficoEvidencias').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Evidencias listas', 'Evidencias faltantes'],
      datasets: [{
        data: [8, 5], // Simulado
        backgroundColor: ['#39A900', '#e0ffe0'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Datos simulados para carpetas
const instructores = ['Ana Gómez', 'Carlos Ruiz'];
const competencias = ['Competencia 1', 'Competencia 2', 'Competencia 3', 'Competencia 4'];
const actividades = [
  { nombre: 'Actividad 1', archivo: 'actividad1.pdf' },
  { nombre: 'Actividad 2', archivo: 'actividad2.pdf' },
  { nombre: 'Actividad 3', archivo: 'actividad3.pdf' },
  { nombre: 'Actividad 4', archivo: 'actividad4.pdf' }
];

function renderCarpetasTrimestresModal() {
  const carpetasDiv = document.getElementById('carpetas-trimestres');
  let html = '<div class="cards-grid">';
  for (let t = 1; t <= 7; t++) {
    html += `<div class="card-carpeta" data-trimestre="${t}">
      <i class="fa-solid fa-folder"></i> Trimestre ${t}
    </div>`;
  }
  html += '</div>';
  carpetasDiv.innerHTML = html;
  document.querySelectorAll('.card-carpeta[data-trimestre]').forEach(card => {
    card.addEventListener('click', function() {
      const t = this.getAttribute('data-trimestre');
      abrirModalInstructoresNuevo(t);
    });
  });
}

function abrirModalInstructoresNuevo(numTrimestre) {
  cerrarModal();
  let html = `<div class='modal-overlay' id='modal-instructores'>
    <div class='modal'>
      <button class='modal-close' onclick='cerrarModal()'><i class="fa-solid fa-xmark"></i></button>
      <h3>Trimestre ${numTrimestre}</h3>
      <div class='cards-grid'>`;
  instructores.forEach((instr, idx) => {
    html += `<div class='card-carpeta' data-instructor='${idx}' data-nombre='${instr}'>
      <i class="fa-solid fa-user"></i> ${instr}
    </div>`;
  });
  html += `</div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.querySelectorAll('.card-carpeta[data-instructor]').forEach(card => {
    card.addEventListener('click', function() {
      const idx = this.getAttribute('data-instructor');
      const nombre = this.getAttribute('data-nombre');
      abrirModalCompetenciasNuevo(idx, nombre, numTrimestre);
    });
  });
}

function abrirModalCompetenciasNuevo(idxInstructor, nombreInstructor, numTrimestre) {
  cerrarModal();
  let html = `<div class='modal-overlay' id='modal-competencias'>
    <div class='modal'>
      <button class='modal-close' onclick='cerrarModal()'><i class="fa-solid fa-xmark"></i></button>
      <h3>${nombreInstructor} <br><span style='font-size:0.9em;font-weight:400;color:#277300;'>Trimestre ${numTrimestre}</span></h3>
      <div class='cards-grid'>`;
  competencias.forEach((comp, cidx) => {
    html += `<div class='card-carpeta' data-competencia='${cidx}' data-instructor='${idxInstructor}' data-nombre='${comp}'>
      <i class="fa-solid fa-folder"></i> ${comp}
    </div>`;
  });
  html += `</div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.querySelectorAll('.card-carpeta[data-competencia]').forEach(card => {
    card.addEventListener('click', function() {
      const cidx = this.getAttribute('data-competencia');
      const iidx = this.getAttribute('data-instructor');
      const nombreComp = this.getAttribute('data-nombre');
      abrirModalActividadesNuevo(iidx, nombreInstructor, numTrimestre, nombreComp);
    });
  });
}

function abrirModalActividadesNuevo(idxInstructor, nombreInstructor, numTrimestre, nombreCompetencia) {
  cerrarModal();
  let html = `<div class='modal-overlay' id='modal-actividades'>
    <div class='modal'>
      <button class='modal-close' onclick='cerrarModal()'><i class="fa-solid fa-xmark"></i></button>
      <h3>${nombreInstructor} <br><span style='font-size:0.9em;font-weight:400;color:#277300;'>Trimestre ${numTrimestre} - ${nombreCompetencia}</span></h3>
      <ul class='actividades-list'>`;
  actividades.forEach((act, idx) => {
    const archivoDemo = act.archivo || `actividad${idx+1}.pdf`;
    html += `<li class="actividad-carpeta" data-actividad="${idx}">
      <i class='fa-solid fa-file'></i> 
      <a href="descargas/${archivoDemo}" download style="color:#277300;font-weight:500;text-decoration:underline;">${act.nombre}</a>
      <button class="entregar-btn">Entregar</button>
      <input type="file" class="input-evidencia" style="display:none;" accept=".pdf,.doc,.docx,.jpg,.png">
      <span class="estado-entrega" style="display:none;color:#39A900;font-weight:bold;margin-left:10px;"></span>
    </li>`;
  });
  html += `</ul></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.querySelectorAll('.entregar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.style.display = 'none';
      const input = this.parentElement.querySelector('.input-evidencia');
      input.style.display = 'inline';
      input.click();
      input.addEventListener('change', function() {
        if (input.files.length > 0) {
          input.style.display = 'none';
          const estado = btn.parentElement.querySelector('.estado-entrega');
          estado.textContent = 'Entregado: ' + input.files[0].name;
          estado.style.display = 'inline';
        }
      }, { once: true });
    });
  });
}

function cerrarModal() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(m => m.remove());
}

// Datos simulados de fichas para el instructor con jornada
const fichasInstructor = [
  { id: 'ficha1', nombre: 'Ficha 101', programa: 'ADSO', trimestre: 'III', jornada: 'Mañana', aprendices: [
    { id: 'apr1', nombre: 'Juan Pérez' },
    { id: 'apr2', nombre: 'María Gómez' },
    { id: 'apr3', nombre: 'Carlos Ruiz' },
  ]},
  { id: 'ficha2', nombre: 'Ficha 202', programa: 'Contabilidad', trimestre: 'II', jornada: 'Tarde', aprendices: [
    { id: 'apr4', nombre: 'Ana Torres' },
    { id: 'apr5', nombre: 'Luis Martínez' },
  ]},
  { id: 'ficha5', nombre: 'Ficha 505', programa: 'Logística', trimestre: 'III', jornada: 'Tarde', aprendices: [
    { id: 'apr10', nombre: 'Camila Ríos' },
    { id: 'apr11', nombre: 'Esteban Gil' },
  ]},
  { id: 'ficha3', nombre: 'Ficha 303', programa: 'Sistemas', trimestre: 'I', jornada: 'Noche', aprendices: [
    { id: 'apr6', nombre: 'Pedro López' },
    { id: 'apr7', nombre: 'Laura Díaz' },
  ]},
  { id: 'ficha6', nombre: 'Ficha 606', programa: 'Electricidad', trimestre: 'II', jornada: 'Noche', aprendices: [
    { id: 'apr12', nombre: 'Valentina Mora' },
    { id: 'apr13', nombre: 'Samuel Torres' },
  ]},
  { id: 'ficha4', nombre: 'Ficha 404', programa: 'Salud', trimestre: 'IV', jornada: 'Mañana', aprendices: [
    { id: 'apr8', nombre: 'Sofía Torres' },
    { id: 'apr9', nombre: 'Miguel Ángel' },
  ]},
];

// --- Dashboard del instructor (solo botones) ---
function mostrarDashboardInstructor() {
  const cont = document.getElementById('fichas-instructor-list');
  cont.innerHTML = '';
  const jornadas = ['Mañana', 'Tarde', 'Noche'];
  jornadas.forEach(jornada => {
    const grupo = fichasInstructor.filter(f => f.jornada === jornada);
    if (grupo.length > 0) {
      const seccion = document.createElement('div');
      seccion.className = 'grupo-jornada';
      seccion.innerHTML = `<h3 class="titulo-jornada"><i class='fa-solid fa-sun'></i> Jornada ${jornada}</h3><div class="fichas-horizontal"></div>`;
      const fichasDiv = seccion.querySelector('.fichas-horizontal');
      grupo.forEach(ficha => {
        const btn = document.createElement('button');
        btn.className = 'ficha-btn';
        btn.innerHTML = `<i class='fa-solid fa-folder'></i> ${ficha.nombre}`;
        btn.onclick = () => {
          sessionStorage.setItem('fichaInstructorActual', JSON.stringify(ficha));
          window.open('ficha_instructor.html?fichaId=' + ficha.id, '_blank');
        };
        fichasDiv.appendChild(btn);
      });
      cont.appendChild(seccion);
    }
  });
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  // No mostrar dashboard instructor por defecto
  document.getElementById('dashboard-instructor').style.display = 'none';
}); 