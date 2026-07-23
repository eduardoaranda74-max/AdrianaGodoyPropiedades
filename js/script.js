let todasLasPropiedades = [];
const galeriasImagenes = {}; // almacena las imágenes de cada tarjeta para el lightbox
let imagenActual = { imagenes: [], idx: 0 };

function resolverImagen(url) {
  if (!url) return '';
  let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  return url;
}

function crearGaleria(imagenStr, titulo, galeriaIdx) {
  const imagenes = String(imagenStr || '').split(',').map(u => u.trim()).filter(Boolean);
  if (!imagenes.length) return `<div style="height:210px;background:#e9ecef;"></div>`;

  const resueltas = imagenes.map(resolverImagen);
  galeriasImagenes[galeriaIdx] = resueltas;

  if (resueltas.length === 1) {
    return `<img src="${resueltas[0]}" class="card-img-top" alt="${titulo}"
                 style="height:210px;object-fit:cover;cursor:zoom-in;"
                 onclick="abrirImagen(${galeriaIdx}, 0)"
                 onerror="this.style.background='#e9ecef'">`;
  }

  const items = resueltas.map((src, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}">
      <img src="${src}" class="d-block w-100" alt="${titulo}"
           style="height:210px;object-fit:cover;cursor:zoom-in;"
           onclick="abrirImagen(${galeriaIdx}, ${i})"
           onerror="this.style.background='#e9ecef'">
    </div>`).join('');

  return `
    <div id="carousel-${galeriaIdx}" class="carousel slide" data-bs-ride="false">
      <div class="carousel-inner">${items}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${galeriaIdx}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carousel-${galeriaIdx}" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>`;
}

function normalizarClaves(prop) {
  const resultado = {};
  for (const [clave, valor] of Object.entries(prop)) {
    const claveNorm = clave.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    resultado[claveNorm] = valor;
  }
  return resultado;
}

async function cargarPropiedades() {
  try {
    let propiedades;
    if (CONFIG.GOOGLE_SCRIPT_URL) {
      const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL, { redirect: 'follow' });
      propiedades = await res.json();
    } else {
      const res = await fetch('propiedades.json');
      propiedades = await res.json();
    }
    todasLasPropiedades = propiedades.map(normalizarClaves);
    mostrarPropiedades(todasLasPropiedades);
  } catch (err) {
    document.getElementById('contenedor-propiedades').innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-danger">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>Error al cargar las propiedades.
        </p>
      </div>`;
    console.error('Error al cargar propiedades:', err);
  }
}

function mostrarPropiedades(lista) {
  const contenedor = document.getElementById('contenedor-propiedades');
  const contador = document.getElementById('contador');

  const n = lista.length;
  contador.textContent = `${n} propiedad${n !== 1 ? 'es' : ''} encontrada${n !== 1 ? 's' : ''}`;

  if (!n) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No hay propiedades en esta categoría.</p>
      </div>`;
    return;
  }

  contenedor.innerHTML = lista.map((prop, idx) => {
    const operacion = String(prop.operacion || '').trim();
    const badgeClass = operacion.toLowerCase() === 'venta' ? 'bg-success' : 'bg-primary';
    const dormitorios = parseInt(prop.dormitorios);
    const dormText = dormitorios > 0
      ? `<i class="bi bi-door-open me-1"></i>${dormitorios} dorm. &nbsp;` : '';
    const msgWA = encodeURIComponent(
      `Hola Adriana! Me interesa la propiedad: ${prop.titulo} en ${prop.ubicacion}`
    );

    return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          ${crearGaleria(prop.imagen, prop.titulo, idx)}
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <h5 class="card-title mb-0">${prop.titulo}</h5>
              <span class="badge ${badgeClass} ms-2 flex-shrink-0">${operacion}</span>
            </div>
            <p class="text-muted small mb-2">
              <i class="bi bi-geo-alt-fill me-1"></i>${prop.ubicacion}
            </p>
            <p class="fw-bold fs-5 text-danger mb-1">${prop.precio}</p>
            <p class="text-muted small mb-2">
              ${dormText}<i class="bi bi-droplet me-1"></i>${prop.banos} baño${prop.banos != 1 ? 's' : ''}
            </p>
            <p class="card-text small text-secondary flex-grow-1">${prop.descripcion}</p>
            <a href="https://wa.me/${CONFIG.WHATSAPP}?text=${msgWA}"
               class="btn btn-outline-primary w-100 mt-auto" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-whatsapp me-2"></i>Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>`;
  }).join('');
}

// Filtros — comparación sin importar mayúsculas ni espacios
document.querySelectorAll('[data-filtro]').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('[data-filtro]').forEach(b => b.classList.remove('filtro-activo'));
    this.classList.add('filtro-activo');

    const filtro = this.dataset.filtro;
    const filtradas = filtro === 'Todas'
      ? todasLasPropiedades
      : todasLasPropiedades.filter(p =>
          String(p.operacion || '').trim().toLowerCase() === filtro.toLowerCase()
        );
    mostrarPropiedades(filtradas);
  });
});

// Lightbox con navegación
function abrirImagen(galeriaIdx, imagenIdx) {
  imagenActual = { imagenes: galeriasImagenes[galeriaIdx] || [], idx: imagenIdx };
  actualizarModal();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalImagen')).show();
}

function actualizarModal() {
  document.getElementById('imagenAmpliada').src = imagenActual.imagenes[imagenActual.idx] || '';
  const hayVarias = imagenActual.imagenes.length > 1;
  document.getElementById('btnAnteriorModal').style.display = hayVarias ? 'flex' : 'none';
  document.getElementById('btnSiguienteModal').style.display = hayVarias ? 'flex' : 'none';
  document.getElementById('contadorModal').textContent =
    hayVarias ? `${imagenActual.idx + 1} / ${imagenActual.imagenes.length}` : '';
}

function imagenAnterior() {
  imagenActual.idx = (imagenActual.idx - 1 + imagenActual.imagenes.length) % imagenActual.imagenes.length;
  actualizarModal();
}

function imagenSiguiente() {
  imagenActual.idx = (imagenActual.idx + 1) % imagenActual.imagenes.length;
  actualizarModal();
}

cargarPropiedades();
