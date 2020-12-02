const stats = require( 'process-top' )()// instanciar o colector de estado do sistema
const timediff = require( 'timediff' );

intervalo = 5000;
lista = [];
function print() {
    data = stats.toJSON();
    lista.push(data);
    console.log(data); // obter os dados
    console.log(lista.length);
    if (lista.length > 1) {

    time1 = lista[lista.length - 1]
    time2 = lista[lista.length - 2]
    const diff = timediff(time2, time1);
    print(diff);
}

}

// while(true) {
    setInterval(print, intervalo) 

// }