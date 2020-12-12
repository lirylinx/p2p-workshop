const { Client  } = require('hyperspace');
const  Process  = require('./process');



// Exercicio #5 anunciar na rede que possuimos dados
// 1 - Ler estado de outro processo. Usando a chave publica conhecida do hypercore - servidor
// 2 - Com a chave obtida, ler e imprimir o estado do ultimo processo. - cliente

const intervalo = 500;
var lista = [];

start();

async function start () {

    // criar novo cliente
    const { corestore, replicate } = new Client()

    // obter o corestore
    const store = corestore();

    // obter hypercore armazenado pelo nome
    const core = store.get({ name: 'coletor-estado-exer6', valueEncoding: 'json'});
    await core.ready();
    console.log('colector-estado key ' + core.key.toString('hex'));
    // await replicate(core);
    // inserir Dados de processo do sistema a cada 5 segundos.
    setInterval(async () => {
        const stats = Process.get()
        const index = await buildNextIndex(core)

        core.append({stats, index}).catch(err => console.error( 'A estatistica nao pode ser anexado') )
    }, intervalo) 
}


// inserir dados do processo ao core passado pelo argumento
async function insertProcess(core) {
        var json = Process.get();
        await core.append(JSON.stringify(json));

}


async function buildNextIndex( core ) {
    const JUMP_START = 2;

    const index= []
    let distance = 1
    let nextBlockIndex = core.length

    while ( nextBlockIndex - distance >= 0 ) {
        const blockIndex = nextBlockIndex - distance
        const block = await core.get( blockIndex )

        index.push({
            timestamp: block.stats.timestamp,
            blockIndex
        })

        distance *= JUMP_START
    }
     
    return index;
} 