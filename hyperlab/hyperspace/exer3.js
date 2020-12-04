const { Client  } = require('hyperspace');
const  Process  = require('./process');

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
    console.log(core);

    // inserir Dados de processo do sistema a cada 5 segundos.
    setInterval(insertProcess, intervalo, core) 





}


// adicionar dados ao hypercore
async function append (core, data) {
  var str = JSON.stringify(data);
    await core.append(str);
 
    return core.length;
}

  // obter dados do hypercore indicando o valor de indice
async function get( core, index ) {
    return await core.get(index, { valueEncoding: 'utf-8' });
}


// imprimir dados genericos
function print(data) {
    console.log(data);
}

// inserir dados do processo ao core passado pelo argumento
async function insertProcess(core) {
        var json = Process.get();

        await append(core, json);
        // show( await get(core, core.length - 1));
        
        core.on('append', async function() {
          if( core.length >= 2 ) {
          var data1 = await get(core, core.length - 2 );
          var data2 = await get(core, core.length - 1 );
          var diff = Process.time(JSON.parse(data1).timestamp, JSON.parse(data2).timestamp);
          print("Diferenca em #" + diff.seconds + "segundos");
        }

          

        });
}

//  parse e visualizar dados em json
async function show(data) {

    print(JSON.parse(data));
}
