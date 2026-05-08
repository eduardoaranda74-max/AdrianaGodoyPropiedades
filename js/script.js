// El fetch busca el JSON en la raíz de la carpeta Adriana-Godoy
fetch('propiedades.json')
    .then(response => response.json())
    .then(data => {
        const contenedor = document.getElementById('contenedor-propiedades');
        
        data.forEach(prop => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4'; // Responsivo: 1 col en movil, 3 en desktop
            
            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${prop.imagen}" class="card-img-top" alt="${prop.titulo}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${prop.titulo}</h5>
                        <p class="card-text text-muted small">${prop.ubicacion} | <span class="badge bg-secondary">${prop.operacion}</span></p>
                        <p class="h5 text-danger">${prop.precio}</p>
                        <hr>
                        <p class="card-text">
                            <strong>${prop.dormitorios}</strong> dormitorios<br>
                            ${prop.baño}
                        </p>
                        <button class="btn btn-outline-primary w-100">Contactar</button>
                    </div>
                </div>
            `;
            contenedor.appendChild(col);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));