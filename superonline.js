const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Bienvenido a Supermercado en Línea!\nProductos disponibles:\n');

let carrito = {
    precioTotal: 0,
    productos: [],
};

const productosDelSuper = [
    { nombre: "Qeso", precio: 10, categoria: 'lácteos' },
    { nombre: "Gaseosa", precio: 5, categoria: 'bebidas' },
    { nombre: "Cerveza", precio: 20, categoria: 'bebidas' },
    { nombre: "Arroz", precio: 7, categoria: 'alimentos' },
    { nombre: "Fideos", precio: 5, categoria: 'alimentos' },
    { nombre: "Lavandina", precio: 9, categoria: 'limpieza' },
    { nombre: "Shampoo", precio: 3, categoria: 'higiene' },
    { nombre: "Jabón", precio: 4, categoria: 'higiene' },
];

function listado() {
    productosDelSuper.forEach((producto, index) => {
        console.log(` ${index + 1}. ${producto.nombre} $${producto.precio}`);
    });
}

async function agregarProducto() {
    return new Promise((resolve) => {
        rl.question('\nIntroduzca un número del producto que desea comprar para seleccionarlo: ', (input) => {
            let x = parseInt(input.trim());
            if (x >= 1 && x <= 8) {
                let producto = productosDelSuper[x - 1];
                resolve(producto);
            } else {
                console.log('Opción inválida');
                resolve(null);
            }
        });
    });
}

async function agregarCantidad(producto) {
    return new Promise((resolve) => {
        rl.question(`Introduzca la cantidad del producto ${producto.nombre} que desea comprar: `, (input) => {
            let cantidad = parseInt(input.trim());
            if (!isNaN(cantidad) && cantidad > 0) {
                resolve(cantidad);
            } else {
                console.log('Cantidad inválida');
                resolve(null);
            }
        });
    });
}

async function sumaCompra() {
    listado();
    let producto = await agregarProducto();
    if (producto) {
        let cantidad = await agregarCantidad(producto);
        if (cantidad) {
            let productoEnCarrito = carrito.productos.find(item => item.nombre === producto.nombre);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad += cantidad;
            } else {
                carrito.productos.push({ nombre: producto.nombre, cantidad });
            }
            carrito.precioTotal += producto.precio * cantidad; // Solo suma el precio al total
        } else {
            console.log('No se ha agregado cantidad válida.');
        }
    } else {
        console.log('No se ha seleccionado un producto válido.');
    }

    mostrarCarrito();
}

function mostrarCarrito() {
    console.log('\nCarrito de compras:');
    if (carrito.productos.length > 0) {
        carrito.productos.forEach((item, index) => {
            const precioTotal = item.cantidad * productosDelSuper.find(p => p.nombre === item.nombre).precio;
            console.log(`${index + 1}. ${item.nombre} x ${item.cantidad} = $${precioTotal}`);
        });
    } else {
        console.log('El carrito está vacío.');
    }

    console.log(`\nTotal: $${carrito.precioTotal}`);
}

async function eliminarProducto() {
    return new Promise((resolve) => {
        mostrarCarrito();
        rl.question('\nIntroduzca el número del producto que desea eliminar: ', (input) => {
            let x = parseInt(input.trim());
            if (x >= 1 && x <= carrito.productos.length) {
                let producto = carrito.productos[x - 1];
                resolve(producto);
            } else {
                console.log('Opción inválida');
                resolve(null);
            }
        });
    });
}

async function eliminarCantidad(producto) {
    return new Promise((resolve) => {
        rl.question(`Introduzca la cantidad del producto ${producto.nombre} que desea eliminar: `, (input) => {
            let cantidad = parseInt(input.trim());
            if (!isNaN(cantidad) && cantidad > 0) {
                resolve(cantidad);
            } else {
                console.log('Cantidad inválida');
                resolve(null);
            }
        });
    });
}

async function restarCompra() {
    let producto = await eliminarProducto();
    if (producto) {
        let cantidad = await eliminarCantidad(producto);
        if (cantidad && cantidad > 0) {
            let productoEnCarrito = carrito.productos.find(item => item.nombre === producto.nombre);
            if (productoEnCarrito && cantidad <= productoEnCarrito.cantidad) {
                carrito.precioTotal -= productosDelSuper.find(p => p.nombre === producto.nombre).precio * cantidad; // Ajusta el total del carrito
                productoEnCarrito.cantidad -= cantidad;

                if (productoEnCarrito.cantidad === 0) {
                    carrito.productos = carrito.productos.filter(item => item.nombre !== producto.nombre);
                }
            } else {
                console.log('No se puede eliminar más cantidad de la que hay en el carrito.');
            }
        } else {
            console.log('No se ha agregado cantidad válida.');
        }
    } else {
        console.log('No se ha seleccionado un producto válido.');
    }

    mostrarCarrito();
}

async function tienda() {
    await sumaCompra();
    let continuar = await new Promise((resolve) => {
        rl.question('\nSi desea continuar escriba "si": ', (input) => {
            resolve(input.trim().toLowerCase() === 'si');
        });
    });

    while (continuar) {
        let eleccion = await new Promise((resolve) => {
            rl.question('\nEscriba "agregar" para añadir o "eliminar" para quitar un producto: ', (input) => {
                resolve(input.trim().toLowerCase());
            });
        });

        if (eleccion === 'agregar') {
            await sumaCompra();
        } else if (eleccion === 'eliminar') {
            await restarCompra();
        } else {
            console.log('Opción no válida, por favor elija "agregar" o "eliminar".');
        }

        continuar = await new Promise((resolve) => {
            rl.question('\nSi desea continuar escriba "si": ', (input) => {
                resolve(input.trim().toLowerCase() === 'si');
            });
        });
    }

    rl.close();
    console.log('Gracias por su compra! Que lo disfrute');
    mostrarCarrito();
}

tienda();

