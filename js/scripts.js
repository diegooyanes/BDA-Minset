const productos = [
    { id: 1, nombre: 'DROP 1', precio: 50, descripcion: 'Cómoda y moderna.', imagen: 'images/Drop1 delante.png', hover: 'images/Drop1 detras.png' },
    { id: 2, nombre: 'DROP 2', precio: 50, descripcion: 'La nueva era.', imagen: 'images/Drop1 delante.png', hover: 'images/Drop1 detras.png' },
    { id: 3, nombre: 'DROP 3', precio: 50, descripcion: 'La nueva era.', imagen: 'images/Drop1 delante.png', hover: 'images/Drop1 detras.png' },
    { id: 4, nombre: 'DROP 4', precio: 50, descripcion: 'La nueva era.', imagen: 'images/Drop1 delante.png', hover: 'images/Drop1 detras.png' },
];

// Referencias al DOM
const contenedorProductos = document.getElementById('productos');
const cartButton = document.getElementById('cart-button');
const carritoSlide = document.getElementById('carrito-slide');
const closeCarritoIcon = document.getElementById('close-carrito-icon');
const overlay = document.getElementById('overlay');
const cartContent = document.getElementById('carrito-contenido');
const totalCarrito = document.getElementById('total-carrito');
const checkoutButton = document.getElementById("checkout-button");
const addToCartButton = document.getElementById('add-to-cart');

// Carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Renderizar productos en index.html
function renderizarProductos() {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = '';
    productos.forEach(producto => {
        contenedorProductos.innerHTML += `
            <div class="producto">
                <a href="productos.html?id=${producto.id}">
                    <img 
                        src="${producto.imagen}" 
                        alt="${producto.nombre}" 
                        class="producto-img" 
                        data-hover="${producto.hover}">
                </a>
                <div>
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio}</p>
                </div>
            </div>`;
    });

    // Cambiar la imagen al pasar el ratón
    document.querySelectorAll('.producto-img').forEach(img => {
        const originalSrc = img.src;
        const hoverSrc = img.getAttribute('data-hover');
        
        img.addEventListener('mouseenter', () => {
            img.src = hoverSrc;
        });
        img.addEventListener('mouseleave', () => {
            img.src = originalSrc;
        });
    });
}

// Navegar a detalles del producto
function irADetalles(id) {
    window.location.href = `productos.html?id=${id}`;
}

// Resto del código para carrito, detalles, y demás funcionalidad
function cargarDetallesProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const producto = productos.find(p => p.id == id);

    if (producto) {
        document.getElementById('product-image-front').src = producto.imagen;
        document.getElementById('product-image-back').src = producto.hover;
        document.getElementById('product-title').textContent = producto.nombre;
        document.getElementById('product-price').textContent = `$${producto.precio}`;
        document.getElementById('product-description').textContent = producto.descripcion;

        // Configurar selección de tallas
        document.querySelectorAll('.size').forEach(size => {
            size.addEventListener('click', () => {
                document.querySelectorAll('.size').forEach(s => s.classList.remove('selected'));
                size.classList.add('selected');
            });
        });
    }
}

// Añadir producto al carrito
function addToCart() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const producto = productos.find(p => p.id == id);

    if (producto) {
        const tallaSeleccionada = document.querySelector('.size.selected');
        if (!tallaSeleccionada) {
            alert('Por favor, selecciona una talla antes de añadir al carrito.');
            return;
        }

        carrito.push({ ...producto, talla: tallaSeleccionada.textContent });
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        alert(`Producto ${producto.nombre} añadido al carrito.`);
    }
}

// Actualizar contador del carrito
function actualizarCarrito() {
    cartButton.textContent = `CARRITO (${carrito.length})`;
}

// Renderizar contenido del carrito
function renderizarCarrito() {
    cartContent.innerHTML = '';
    if (carrito.length === 0) {
        cartContent.innerHTML = '<p>No hay productos en el carrito.</p>';
        totalCarrito.textContent = '';
    } else {
        carrito.forEach(producto => {
            cartContent.innerHTML += `
                <div class="producto-carrito">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.nombre} (Talla: ${producto.talla})</p>
                    <p>$${producto.precio}</p>
                    <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
                </div>`;
        });
        const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
        totalCarrito.textContent = `Total: $${total}`;
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    renderizarCarrito();
}

// Mostrar el carrito deslizable
cartButton?.addEventListener('click', () => {
    carritoSlide.classList.add('active');
    overlay.style.display = 'block';
    renderizarCarrito();
});

// Cerrar el carrito deslizable
closeCarritoIcon?.addEventListener('click', () => {
    carritoSlide.classList.remove('active');
    overlay.style.display = 'none';
});

// Cerrar al hacer clic en el overlay
overlay?.addEventListener('click', () => {
    carritoSlide.classList.remove('active');
    overlay.style.display = 'none';
});

// Manejar pago
checkoutButton?.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Añade productos para comprar.");
    } else {
        alert("¡Compra realizada con éxito!");
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }
});

// Inicializar eventos y contenido
renderizarProductos();
if (window.location.pathname.includes('productos.html')) cargarDetallesProducto();
addToCartButton?.addEventListener('click', addToCart);
actualizarCarrito();

