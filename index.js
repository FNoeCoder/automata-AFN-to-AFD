
//importar la clase AFN del otro archivo
import { AFN } from './AFN.js';

//Importar la clase grafo
import { opciones, devolverBordes, devolverNodos } from './Grafo.js';



const estados = document.getElementById("estados");
const alfabeto = document.getElementById("alfabeto");
const estadoInicial = document.getElementById("estado_inicial");
const estadosFinales = document.getElementById("estados_finales");

const funcionTransicion = document.getElementById("llenar_funciones_transicion");
const tablaInputs = document.getElementById("tabla_funciones_transicion");
const botonCalcular = document.getElementById("boton_calcular");
const error = document.getElementById("error");

const tablaResultado = document.getElementById("tabla_resultado");
const contenedorGrafos = document.getElementById("miRed");

[estados,alfabeto,estadoInicial, estadosFinales].forEach(element => {
    element.addEventListener("input", () => {
        camposValidos();
    });
});

botonCalcular.addEventListener("click", () => {

    if (datosInputtransicionCorrectos(obtenerDatosInputsTransicones())){
        // irmpiendo el objeto AFN
        let afn = new AFN(estados.value.split(","), alfabeto.value.split(","), obtenerDatosInputsTransicones(), estadoInicial.value, estadosFinales.value.split(","));
        let funciones = afn.obtenerFuncionesTransicionAFD();
        tablaResultado.classList = "activado"
        console.log(funciones);
        tablaResultado.innerHTML = obtenerTablaResultado(funciones);

        // Crear los grafos
        let nodos = new vis.DataSet( devolverNodos(funciones) );
        let bordes = new vis.DataSet( devolverBordes(funciones, afn.alfabeto, afn.estadoInicial) );

        let datos = { nodes: nodos, edges: bordes };
        var red = new vis.Network(contenedorGrafos, datos, opciones);

        red.on('click', function(event) {
            console.log(event.nodes);
        });
    }
})

function datosInputtransicionCorrectos(datos){
    let listaEstados = estados.value.split(",");
    if (!listaEstados.includes("∅")){
        listaEstados.push("∅");
    }
    
    for (let estado in datos){
        for (let caracter in datos[estado]){
            for (let estadoResultante of datos[estado][caracter]){
                if (!listaEstados.includes(estadoResultante)){ 
                    error.innerText = `Función de transición δ(${estado}, ${caracter}) no es valida`;
                    console.log(estadoResultante);
                    return false;
                }
                
            }
        }
    }
    error.innerText = ``;
    return true
}

function obtenerDatosInputsTransicones(){
    let listaEstados = estados.value.split(",");
    let listaAlfabeto = alfabeto.value.split(",");

    let funcionesTransicion = {};


    for (let estado of listaEstados){
        funcionesTransicion[estado] = {};
        for (let caracter of listaAlfabeto){
            let elementoInput = document.getElementById(estado+":"+caracter);
            if (elementoInput.value == ""){
                funcionesTransicion[estado][caracter] = "∅";
            }
            else{
                funcionesTransicion[estado][caracter] = elementoInput.value.split(",");
            }
            
        }
    }

    return funcionesTransicion;
}

// Verificar que los campos sean validos de los input de la tabla ingresada
// function camposTablasTrasicionValidos(){
//     let contanidoTabla = tablaInputs.innerHTML;
//     let listaEstados = estados.value.split(",");
//     let listaAlfabeto = alfabeto.value.split(",");

//     let elemetosIput = [];

//     for (let estado of listaEstados){
//         for (let caracter of listaAlfabeto){
//             let elementoInput = document.getElementById(estado+":"+caracter);
//             if (elementoInput.value.split(",").length > 1 && elementoInput.value.split(",").includes("")){ // Si hay mas de un estado y uno de ellos es vacio
//                 error.innerText = "La tabla de transición no es valida";
//                 return false;
//             }
//             else if (elementoInput.value != "∅"){
//                 error.innerText = "La tabla de transición no es valida";
//                 return false;
//             }
//             else {
//                 error.innerText = "";
//                 return true;
//             }
//         }
//     }

// }

function camposValidos(){
    let listaEstados = estados.value.split(",");
    let listaAlfabeto = alfabeto.value.split(",");
    let estadoInicialValor = estadoInicial.value;
    let listaEstadosFinales = estadosFinales.value.split(",");

    console.log(listaEstados, listaAlfabeto, estadoInicialValor, listaEstadosFinales);

    if (listaEstados.includes("")){
        error.innerText = "Los estados no son validos";
        botonCalcular.disabled = true
    }else if (listaAlfabeto.includes("")){
        error.innerText = "El alfabeto no es valido";
        botonCalcular.disabled = true
    }else if (estadoInicialValor == "" || !listaEstados.includes(estadoInicialValor)){
        error.innerText = "El estado inicial no es valido";
        botonCalcular.disabled = true
    }else if (listaEstadosFinales.includes("") || !listaEstadosFinales.every(estado => listaEstados.includes(estado))){
        error.innerText = "Los estados finales no son validos";
        botonCalcular.disabled = true
    }else{
        error.innerText = "";
        funcionTransicion.classList = "activado";
        tablaInputs.innerHTML = obteerTabla();     
        botonCalcular.disabled = false   
    }
    // console.log(listaEstados, listaAlfabeto, estadoInicialValor, listaEstadosFinales);

}
function obtenerTablaResultado(objetoTransiciones){
    let estado1 = estadoInicial.value;
    let alfabeto1 = alfabeto.value.split(",");
    let primeraFilaInicio = `<tr><th>Estado</th>`;
    let primeraFilaFin = `</tr>`;

    let primeraFila = "";
    console.log(objetoTransiciones);
    for (let caracter in alfabeto1){
        primeraFila += `<th>${caracter}</th>`;
    }
    let filaPrincipal = primeraFilaInicio + primeraFila + "<th>Tipo</th>" + primeraFilaFin;

    // Filas restantes
    let filas = "";
    for (let estado in objetoTransiciones){
        let fila = `<td>${estado}</td>`;
        for (let caracter in alfabeto1){
            fila += `<td>${objetoTransiciones[estado][caracter]}</td>`;
        }
        fila += `<td>${objetoTransiciones[estado].tipoEstado}</td>`;
        fila += `</tr>`;
        filas += fila;
    }
    return filaPrincipal + filas;
}

//Funcion poner primera letra de la string en mayuscula 
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function obteerTabla(){
    let primeraFilaInicio = `<tr><th>Estado</th>`;
    let primeraFilaFin = `</tr>`;

    let primeraFila = "";

    for (let caracter of alfabeto.value.split(",")){
        primeraFila += `<th>${caracter}</th>`;
    }
    let filaPrincipal = primeraFilaInicio + primeraFila + primeraFilaFin;

    // Filas restantes
    let filas = "";
    for (let estado of estados.value.split(",")){
        let fila = `<tr><td>${estado}</td>`;
        for (let caracter of alfabeto.value.split(",")){
            fila += `<td><input class="estado_input" type="text" id="${estado+":"+caracter}"></td>`;
        }
        fila += `</tr>`;
        filas += fila;
    }

    return filaPrincipal + filas;
}











