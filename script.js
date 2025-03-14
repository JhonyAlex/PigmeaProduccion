// Cargar operarios desde localStorage al iniciar
document.addEventListener("DOMContentLoaded", function () {
    cargarOperarios();
    cargarOperariosEnFormulario();
});

document.getElementById("registroForm").addEventListener("submit", function(event) {
    event.preventDefault();
    registrarInformacion();
});

function registrarInformacion() {
    const fecha = document.getElementById("fecha").value;
    const turno = document.getElementById("turno").value;
    const operario = document.getElementById("operario").value;
    const numeroPedido = document.getElementById("numeroPedido").value;
    const maquina = document.getElementById("maquina").value;
    const metros = document.getElementById("metros").value;
    const bandas = document.getElementById("bandas").value;
    const refilado = document.getElementById("refilado").checked ? "Con Refilado" : "Sin Refilado";
    const tipo = document.getElementById("tipo").value;
    const barras = document.getElementById("barras").value;
    const micro = document.getElementById("micro").checked ? "Con Micro" : "Sin Micro";

    const registro = {
        fecha,
        turno,
        operario,
        numeroPedido,
        maquina,
        metros,
        bandas,
        refilado,
        tipo,
        barras,
        micro
    };

    // Validar que todos los campos obligatorios estén llenos
    if (!fecha || !turno || !operario || !numeroPedido || !maquina || !metros || !bandas || !tipo || !barras) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

    // Guardar en localstorage
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.push(registro);
    localStorage.setItem("registros", JSON.stringify(registros));

    alert("Información registrada correctamente.");
    document.getElementById("registroForm").reset();
}

function limpiarFormulario() {
    document.getElementById("registroForm").reset();
}

function agregarOperario() {
    const nuevoOperario = document.getElementById("nuevoOperario").value.trim();
    if (!nuevoOperario) {
        alert("Por favor, ingrese un nombre de operario.");
        return;
    }

    let operarios = JSON.parse(localStorage.getItem("operarios")) || [];
    if (operarios.includes(nuevoOperario)) {
        alert("El operario ya existe.");
        return;
    }

    operarios.push(nuevoOperario);
    localStorage.setItem("operarios", JSON.stringify(operarios));
    cargarOperarios();
    cargarOperariosEnFormulario();
    document.getElementById("nuevoOperario").value = "";
}

function cargarOperarios() {
    let operarios = JSON.parse(localStorage.getItem("operarios")) || [];
    const listaOperarios = document.getElementById("listaOperarios");
    listaOperarios.innerHTML = "";
    operarios.forEach(operario => {
        const div = document.createElement("div");
        div.textContent = operario;
        listaOperarios.appendChild(div);
    });
}

function cargarOperariosEnFormulario() {
    let operarios = JSON.parse(localStorage.getItem("operarios")) || [];
    const selectOperario = document.getElementById("operario");
    selectOperario.innerHTML = "";
    operarios.forEach(operario => {
        const option = document.createElement("option");
        option.value = operario;
        option.textContent = operario;
        selectOperario.appendChild(option);
    });
}