const { Client  } = require('hyperspace');
const  Process  = require('./process');



// Exercicio #4a Servidor - Replicação basica parte 1
// 1 - Ler estado de outro processo. Usando a chave publica conhecida do hypercore - servidor
// 2 - Com a chave obtida, ler e imprimir o estado do ultimo processo. - cliente

const intervalo = 5000;
var lista = [];

start();

async function start () {

    // criar novo cliente
    const c = new Client();

    // obter o corestore
    const store = c.corestore();

    // obter hypercore armazenado pelo nome
    const core = store.get({ name: 'coletor-estado-3'});
    await core.ready();
    console.log('colector-estado key ' + core.key.toString('hex'));

    // inserir Dados de processo do sistema a cada 5 segundos.
    setInterval(insertProcess, intervalo, core) 
}


// inserir dados do processo ao core passado pelo argumento
async function insertProcess(core) {
        var json = Process.get();
        await core.append(JSON.stringify(json));

}
