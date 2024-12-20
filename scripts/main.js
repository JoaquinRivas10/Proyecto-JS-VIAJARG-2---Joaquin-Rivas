// Objeto con los valores de los viajes por dia
const valores = {
    salta: 55000,
    neuquen: 45000,
    mendoza: 40000,
    jujuy: 50000,
}

// Clase Usuario
class Usuario {
    constructor(nombre, apellido, email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.reservas = []; // Aca registraremos todas las reservas que haga este usuario
    }

    // Metodo estatico para crear un usuario
    static crearUsuario(nombre, apellido, email) {
        return new Usuario(nombre, apellido, email);
    }

    // Metodo para agregar una reserva
    agregarReserva(unaReserva) {
        this.reservas.push(unaReserva);
    }

    // Metodo estatico para buscar usuario dentro del arreglo usuarios
    static buscarUsuario(email, usuarios) {
        return usuarios.find(unUsuario => unUsuario.email === email);
    }

    // Metodo para filtrar por usuario usando el email
    static filtrarUsuario (email, usuarios) {
        return usuarios.filter(unUsuario => unUsuario.email === email);
    }
}

// Clase Reserva
class Reserva {
    constructor(usuario, cantidadViajeros, fechaIda, fechaVuelta, destino) {
        this.nombre = usuario.nombre;
        this.apellido = usuario.apellido;
        this.email = usuario.email;
        this.cantidadViajeros = cantidadViajeros;
        this.fecha = new Date(); // Como ya le dimos valor, no lo colocamos en los parametros del constructor
        this.fechaIda = this.transformarFecha(fechaIda);
        this.fechaVuelta = this.transformarFecha(fechaVuelta);
        this.destino = destino;
        this.costo = this.calcularCosto(); // El costo tomara el valor retornado por el metodo que calcula el costo
    }

    // Metodo estatico para crear una reserva
    static crearReserva(usuario) {
        alert("Éstos son los valores POR DIA y POR PERSONA de nuestro paquete de cada destino:");
        alert("Salta: $" + valores.salta + " / " + "Neuquen: $" + valores.neuquen + " / " + "Mendoza: $" + valores.mendoza + " / " + "Jujuy: $" + valores.jujuy);

        let cantidadViajeros = parseInt(prompt("¿Cuántas personas viajarán?"));
        while (isNaN(cantidadViajeros) || cantidadViajeros <= 0) {
            alert("La cantidad de viajeros debe ser un número mayor a 0");
            cantidadViajeros = parseInt(prompt("¿Cuántas personas viajarán?"))
        }

        let fechaIda = prompt("Ingresá fecha de IDA (dd-mm-aaaa)").trim();
        let fechaVuelta = prompt("Ingresá fecha de VUELTA (dd-mm-aaaa)").trim();

        while (new Date(fechaIda.split("-").reverse().join("-")) >= new Date(fechaVuelta.split("-").reverse().join("-"))) {
            alert("La fecha de ida no puede ser posterior a la fecha de vuelta");
            fechaIda = prompt("Ingresá fecha de IDA (dd-mm-aaaa)").trim();
            fechaVuelta = prompt("Ingresá fecha de VUELTA (dd-mm-aaaa)").trim();
        }
        
        let destino = prompt("Ingresá el destino: Salta, Neuquen, Mendoza o Jujuy").toLowerCase().trim();
        while (destino !== "salta" && destino !== "neuquen" && destino !== "mendoza" && destino !== "jujuy") {
            alert("El destino ingresado es inválido, intentá nuevamente");
            destino = prompt("Ingresá el destino: Salta, Neuquen, Mendoza o Jujuy").toLowerCase();
        }
    
        return new Reserva(usuario, cantidadViajeros, fechaIda, fechaVuelta, destino);    
    }

    // Metodo para calcular el valor de la reserva
    calcularCosto() {
        const duracion = Math.ceil((this.fechaVuelta - this.fechaIda) / (1000 * 60 * 60 * 24));
        return valores[this.destino] * duracion * this.cantidadViajeros;
    }

    // Transformar fecha ingresada al formato que usa JavaScript (aaaa-mm-dd)
    transformarFecha(fecha) {
        const [dia, mes, anio] = (fecha.split("-")).map(numero => parseInt(numero));
        return new Date(anio, mes - 1, dia);
    }
}

// Arreglo general que contiene a los usuarios
const usuarios = [];

// Funcion para validacion de texto vacio o cadena de espacios
function validacionTexto (texto, dato) {
    while (texto.trim() === "" || !texto) {
        texto = prompt("No puede ingresar un texto vacio, vuelva a ingresar el " + dato);
    } return texto;
}

// Funcion para validar el email
function validacionEmail (email, dato) {
    while (email.trim() === "" || !email || !email.includes("@")) {
        email = prompt("El " + dato + " ingresado es invalido, intente de nuevo");
    } return email;
}


// Funcion para verificar existencia de un usuario, generar una reserva nueva y asignarla a este usuario
function reservaNueva() {
    alert("¡Estás más cerca de tu próxima aventura! Completá los siguientes datos para registrarte en nuestro sitio.");
    let nombre = prompt("Ingresá tu nombre").trim().toLowerCase();
    nombre = validacionTexto(nombre, "nombre");

    let apellido = prompt("Ingresá tu apellido").trim().toLowerCase();
    apellido = validacionTexto(apellido, "apellido");

    let email = prompt("Ingresá tu email").trim().toLowerCase();
    email = validacionEmail(email, "email");

    // Comprobamos si el usuario ya esta registrado, y sino lo esta, lo creamos
    let usuario = Usuario.buscarUsuario(email, usuarios);
    if (!usuario) {
        usuario = Usuario.crearUsuario(nombre, apellido, email);
        usuarios.push(usuario);
        alert("El registro ha sido un exito. Completá el siguiente formulario de reserva y preparate para vivir una experiencia inolvidable.")
    } else {
        alert("Vemos que ya estabas registrado. Completá el siguiente formulario de reserva y preparate para vivir una experiencia inolvidable.")
    }

    // Creamos una nueva reserva y asociamos a ese usuario
    const nuevaReserva = Reserva.crearReserva(usuario);
    if (nuevaReserva) {
        usuario.agregarReserva(nuevaReserva);
        alert("La reserva se realizó con exito, el costo total del viaje es de $ " + nuevaReserva.costo);
    }
}

// Funcion para obtener las reservas realizadas por un usuario en particular
function reservaPorUsuario(email) {
    const usuario = Usuario.buscarUsuario(email, usuarios);
    if (!usuario) {
        console.log("El usuario no existe");
        return;
    }
    console.log("Reservas realizadas por " + usuario.nombre + " " + usuario.apellido + ":");
    usuario.reservas.forEach((reserva, indice) => {
        console.log((indice + 1) + " - " + reserva.destino + ", Costo: " + reserva.costo + "$");        
    })
}

// Funcion para obtener usuarios con un numero minimo de reservas
function reservaMinima (usuarios, reservaMinima) {
    return usuarios.filter(user => user.reservas.length >= reservaMinima);
}

// Inicio del algoritmo
let continuar = true;
while (continuar) {
    reservaNueva();
    continuar = confirm("¿Desea cargar otra reserva?");
}

console.log(usuarios);

// Filtrar por usuario (pidiendo el email)
let filtroUsuario = prompt("Ingrese el email del usuario que quiere filtrar").trim().toLocaleLowerCase();
filtroUsuario = validacionEmail(filtroUsuario, "email");
const usuarioFiltrado = Usuario.filtrarUsuario(filtroUsuario, usuarios);
if (usuarioFiltrado.length === 0) {
    console.log("El usuario no existe");
} else {
    console.log("Aqui tiene el usuario filtrado:");
    usuarioFiltrado.forEach(user => {
        console.log(user.nombre + " " + user.apellido + " - " + user.email);        
    })
    
}

// Filtrar reservas por usuario (pidiendo el email)
let filtroVerReservas = prompt("Ingrese el email del usuario para ver sus reservas").trim().toLocaleLowerCase();
filtroVerReservas = validacionEmail(filtroVerReservas, "email");
reservaPorUsuario(filtroVerReservas);


// Filtrar a los usuarios con una reserva minima a cierto valor
let resMin = parseInt(prompt("Ingrese la cantidad de reservas minima para filtrar usuarios"));
while (resMin <= 0 || !resMin) {
    resMin = parseInt(prompt("Ingrese una cantidad superior a 0"));
}
const usResMin = reservaMinima(usuarios, resMin);
if (usResMin.length === 0) {
    console.log("No hay usuarios con " + resMin + " reservas o mas");    
} else {
    console.log("Los usuarios con una cantidad minima de " + resMin + " días son:");
usResMin.forEach(user => {
    console.log(user.nombre + " " + user.apellido + " - " + "Reservas: " + user.reservas.length);
})
}