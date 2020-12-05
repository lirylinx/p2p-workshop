const { Client  } = require('hyperspace');
const  Process  = require('./process');



// Exercicio #4a Cliente - Replicação basica parte 1
// 1 - Ler estado de outro processo. Usando a chave publica conhecida do hypercore - servidor
// 2 - Com a chave obtida, ler e imprimir o estado do ultimo processo. - cliente

const intervalo = 1000;
var lista = [];

 start();

async function start () {


    // obter chave do servidor passado como argumento
    // na linha de comando
    if ( process.argv.length <= 2) return 0;

    const key = process.argv[2];
    // criar novo cliente
    const c = new Client();

    // obter o corestore
    const store = c.corestore();

    // obter hypercore armazenado pelo nome
    const core = store.get(key, { valueEncoding: 'json'});
    await core.ready();

    getProcess(core)

}


// inserir dados do processo ao core passado pelo argumento
async function getProcess(core) {
   
  core.on('append', async function() {
    console.log( await core.get(core.length - 1 ));
    console.log('total ' + core.length.toString());

  });
}
