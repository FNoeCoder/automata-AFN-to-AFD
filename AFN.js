
export class AFN{
    constructor(estados, alfabeto, funcionesTransicion, estadoInicial, estadosFinales){
        this.estados = estados;
        this.cantidadEstados = estados.length;
        this.alfabeto = alfabeto;
        this.funcionesTransicion = funcionesTransicion;
        this.estadoInicial = estadoInicial;
        this.estadosFinales = estadosFinales;

        this.comprobarExistenciasEstadoInicialFinal();

        this.combinaciones = this.obtenerCombinaciones();
        this.cantidadCombinaciones = this.combinaciones.length;

        this.funcionesTransicion = this.obtenerTipoEstado(this.funcionesTransicion);
        // console.log(this);

    }
    comprobarExistenciasEstadoInicialFinal() {
        //Verificar si existe el estado inicial en el conjunto de estados
        if (this.estados.indexOf(this.estadoInicial) == -1) throw new Error("El estado inicial no existe en el conjunto de estados");

        //Verificar si existen los estados finales en el conjunto de estados
        for(let i = 0; i < this.estadosFinales.length; i++){
            if(this.estados.indexOf(this.estadosFinales[i]) == -1) throw new Error("El estado final " + this.estadosFinales[i] + " no existe en el conjunto de estados");
        }

        //Verificar que estén correctas las funciones de transicion
        for(let estado in this.funcionesTransicion){
            // Si estado no está en el conjunto de estados
            if (this.estados.indexOf(estado) == -1 && estadosResultantes != "∅") throw new Error(`El estado ${estado} no existe en el conjunto de estado`);
            for (let caracter in this.funcionesTransicion[estado]){      
                if (this.alfabeto.indexOf(caracter) == -1) throw new Error(`El caracter ${caracter} no existe en el alfabeto`);
                for (let estadosResultantes of this.funcionesTransicion[estado][caracter]){
                    if (this.estados.indexOf(estadosResultantes) == -1 && estadosResultantes != "∅") throw new Error(`El estado ${estadosResultantes} de la función de transición ${estado} ingresando un ${caracter} no existe en el conjunto de estados`);
                }
            }
        }
    }
    //Obteener combinaciones
    obtenerCombinaciones() {
        let combinaciones = [];
        combinaciones.push();
        for (let i = 1; i <= this.cantidadEstados; i++) {
            let combinacion = this.obtenerCombinacionesAux(this.estados, i);
            combinaciones = combinaciones.concat(combinacion);
        }
        return combinaciones;
    }
    
    obtenerCombinacionesAux(lista, objetivo) {
        let combinaciones = [];
        if (objetivo === 1) {
            for (let i = 0; i < lista.length; i++) {
                combinaciones.push([lista[i]]);
            }
        } else {
            for (let i = 0; i < lista.length; i++) {
                let subCombinaciones = this.obtenerCombinacionesAux(lista.slice(i + 1), objetivo - 1);
                for (let j = 0; j < subCombinaciones.length; j++) {
                    combinaciones.push([lista[i]].concat(subCombinaciones[j]));
                }
            }
        }
        return combinaciones;
    }

    //Obtener tipos de estados
    obtenerTipoEstado(funcionesTransicion){
        for (let funcionTransicion in this.funcionesTransicion){
            if (this.estadosFinales.includes(funcionTransicion)){
                funcionesTransicion[funcionTransicion]["tipo_estado"] = "final";
            }
            else if (funcionTransicion === this.estadoInicial){
                funcionesTransicion[funcionTransicion]["tipo_estado"] = "inicial";
            }
            else{
                funcionesTransicion[funcionTransicion]["tipo_estado"] = "normal";
            }
        }
        return funcionesTransicion;
    }

    obtenerFuncionesTransicionAFD(){
        let funcionesTransicionAFN = {};
        for (let combinacion of this.combinaciones){
            funcionesTransicionAFN[combinacion.join(",")] = {};
            for (let caracter of this.alfabeto){
                funcionesTransicionAFN[combinacion.join(",")][caracter] = [];
            }
            funcionesTransicionAFN[combinacion.join(",")]["tipoEstado"] = "normal";
            funcionesTransicionAFN[combinacion.join(",")]["perteneceAFD"] = false;

        }
        // como el estado inicial es el primer setado, por lo tanto es tipoEstado inicial y si pertenece al AFD
        funcionesTransicionAFN[this.estadoInicial]["tipoEstado"] = "inicial";
        funcionesTransicionAFN[this.estadoInicial]["perteneceAFD"] = true;

        // Poner las transiciones de 0 y 1 en las combinaciones
        for (let i = 0; i< this.combinaciones.length; i++){
            let combinacion = this.combinaciones[i];

            //Obtener el tipo de estado
            if (this.existenEstadosFinales(combinacion)){
                funcionesTransicionAFN[this.combinaciones[i].join(",")]["tipoEstado"] = "final";
            }


            //Obtener la union de los estados de la combinacion
            for (let letra of this.alfabeto){
                let unionesPorLetra = this.obtenerUniones(combinacion, letra);
                funcionesTransicionAFN[this.combinaciones[i].join(",")][letra] = this.eliminarVacio(this.eliminarRepetidos(unionesPorLetra))
            }
        }

        // poner si pertenece al AFD
        funcionesTransicionAFN = this.ponerPertenecenAFD(this.estadoInicial, funcionesTransicionAFN);
        let listaEstadosAFD = {};

        for (let estado in funcionesTransicionAFN){
            if (funcionesTransicionAFN[estado].perteneceAFD == true){
                listaEstadosAFD[estado] = funcionesTransicionAFN[estado];
            }
        }

        return listaEstadosAFD;
    }
    ponerPertenecenAFD(estadoInicial, funcionesTransicionAFN){
        console.log(estadoInicial);
        for (let letra of this.alfabeto){
            let estados =this.ordenarEstadosFormatoEstados( funcionesTransicionAFN[estadoInicial][letra]).join(",");
            console.log(`    --> ${estados}`);
            if (estados != "∅" &&   funcionesTransicionAFN[estados].perteneceAFD == false ){
                funcionesTransicionAFN[estados].perteneceAFD = true;
                // console.log(`${estadoInicial}`)
                this.ponerPertenecenAFD(estados, funcionesTransicionAFN);
            }

        } 
        return funcionesTransicionAFN;
    }

    obtenerUniones(combinacion, letra){
        let union = [];
        for (let estado of combinacion){
            let transiciones = this.funcionesTransicion[estado][letra];
            union = union.concat(transiciones);
        }
        return this.ordenarEstadosFormatoEstados(union);    
    }
    ordenarEstadosFormatoEstados(estados){
        estados.sort((a,b) => this.estados.indexOf(a) - this.estados.indexOf(b));
        return estados;
    }
    //Funcion para eliminar strings repetidas en un array
    eliminarRepetidos(array) {
        let nuevoArray = [];
        for (let i = 0; i < array.length; i++) {
            if (nuevoArray.indexOf(array[i]) === -1) {
                nuevoArray.push(array[i]);
            }
        }
        return nuevoArray;
    }
    //Funcion para eliminar el Vacio ∅ si hay mas de un elemnto en el array
    eliminarVacio(array){
        if(array.length > 1){
            let index = array.indexOf("∅");
            if (index > -1) {
                array.splice(index, 1);
            }
        }
        return array;
    }
    // existenTodosLosEstados(estados){
    //     for(let i = 0; i < estados.length; i++){
    //         if(this.estados.indexOf(estados[i]) == -1) return false;
    //     }
    //     return true;
    // }

    existenEstadosFinales(estados){
        for(let i = 0; i < estados.length; i++){
            if(this.estadosFinales.indexOf(estados[i]) != -1) return true;
        }
        return false;
    }

}



// let resul = new AFN(
//     ["q0","q1","q2","q3","q4","q5"],
//     ["0","1"],
//     {
//         "q0" : {
//             "0" : ["q0","q1"],
//             "1" : ["q0"]
//         },
//         "q1" : {
//             "0" : ["q2"],
//             "1" : ["∅"]
//         },
//         "q2" : {
//             "0" : ["q3"],
//             "1" : ["q5"]
//         },
//         "q3" : {
//             "0" : ["∅"],
//             "1" : ["q4"]
//         },
//         "q4" : {
//             "0" : ["∅"],
//             "1" : ["∅"]
//         },
//         "q5" : {
//             "0" : ["∅"],
//             "1" : ["∅"]
//         }
//     },
//     "q0",
//     ["q3","q4","q5"]
// );
// console.log(resul.obtenerFuncionesTransicionAFD());