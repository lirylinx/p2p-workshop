const { Client  } = require('hyperspace');
const  Process  = require('./process');



// Exercicio #4a Cliente - Replicação basica parte 1
// 1 - Ler estado de outro processo. Usando a chave publica conhecida do hypercore - servidor
// 2 - Com a chave obtida, ler e imprimir o estado do ultimo processo. - cliente

const intervalo = 1000;
var lista = [];

 start();

async function start () {

    // criar novo cliente
    const c = new Client();

    // obter o corestore
    const store = c.corestore();

    // obter hypercore armazenado pelo nome
    const core = store.get('ee3280e9794038f3e570e5571f52e17e5a04c17e97464b090211c7f9b8191eab', { valueEncoding: 'json'});
    await core.ready();

    getProcess(core)
}


// inserir dados do processo ao core passado pelo argumento
async function getProcess(core) {
   
  core.on('append', async function() {
    console.log( await core.get(core.length - 1 ));
    console.log('total ' + core.length.toString());

  });

