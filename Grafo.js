// importar la clase vis desde el link "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"

export const opciones = {
    height: '100%',
    width: '100%',
    nodes: {
        shape: 'circle',
        borderWidth: 2,
        size: 60,
        color: {
            border: 'blue',
            background: 'blue',
            highlight: {
                border: 'blue',
                background: 'blue'
            },
            hover: {
                border: 'blue',
                background: 'blue'
            }
        }
    },
    edges: {
        color: 'orange'
    },
    groups: {
        inicio: {
            color: {
                background: 'white',
                border: 'grey',    
                highlight: {
                    border: 'grey',
                    background: 'white'
                },
                hover: {
                    border: 'grey',
                    background: 'white'
                }
            }
        },
        final: {
            color: {
                background: 'grey',
                border: 'grey',
                highlight: {
                    border: 'grey',
                    background: 'grey'
                },
                hover: {
                    border: 'grey',
                    background: 'grey'
                }
            }
        },
        nada:{
            color: {
                background: 'white',
                border: 'white',
                highlight: {
                    border: 'white',
                    background: 'white'
                },
                hover: {
                    border: 'white',
                    background: 'white'
                }
            }           
        }
    }
};

export function devolverNodos(funcionesTransicionAFD){
    let lista = [];
    lista.push({id: "nada", label: "", shape: 'box', group: "nada"});
    for (let estado in funcionesTransicionAFD){
        if (funcionesTransicionAFD[estado]["tipoEstado"] == "inicial"){
            lista.push({id: estado, label: estado, group: "inicio"});
        }
        else if (funcionesTransicionAFD[estado]["tipoEstado"] == "final"){
            lista.push({id: estado, label: estado, group: "final"});
        }
        else{
            lista.push({id: estado, label: estado, group: "normal"});
        }
    }
        
    return lista;
}

export function devolverBordes(funcionesTransicionAFD, alfabeto, estadoInicial){
    let lista = [];
    lista.push({ from: 'nada', to: estadoInicial, label: '', arrows: 'to' })

    for (let estado in funcionesTransicionAFD){
        for (let caracter of alfabeto){
            // console.log(funcionesTransicionAFD[estado][caracter]);
            let estadosDestino = funcionesTransicionAFD[estado][caracter].join(",");
            lista.push({ from: estado, to: estadosDestino, label: caracter, arrows: 'to' });
            
        }
    }

    return unirLabels(lista);
}

// Funcion para que si hay suplicados de from y to, el string del label se una
function unirLabels(listaBordes){
    let listaBordesUnidos = [];
    for (let borde of listaBordes){
        let bordeUnido = listaBordesUnidos.find(bordeUnido => bordeUnido.from == borde.from && bordeUnido.to == borde.to);
        if (bordeUnido){
            bordeUnido.label += ","+borde.label;
        }
        else{
            listaBordesUnidos.push(borde);
        }
    }
    return listaBordesUnidos;
}