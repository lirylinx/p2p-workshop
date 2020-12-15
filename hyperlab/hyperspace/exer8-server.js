const { Client  } = require('hyperspace');
const  Process  = require('./process');
const { kvPairs } = require( 'websters-english-dictionary')


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
    const core = store.get({ name: 'english-word-2', valueEncoding: 'json'});
    await core.ready();
    const kvPairs = sortedDictionaryPairs()
    console.log('inserindo dados')
    console.log(kvPairs)
    await createDataset(core, kvPairs.slice(0, 10000))
    console.log('dados inseridos')
    console.log('key ' + core.key.toString('hex'));

    // await replicate(core);
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
            key: block.value.key,
            blockIndex
        })

        distance *= JUMP_START
    }
     
    return index;
} 


function sortedDictionaryPairs () {
    const pairs = kvPairs();
    pairs.sort((a, b)=> {
        if ( a.key < b.key ) return -1;
        if ( a.key > b.key ) return 1;
        return 0;
    })

    return pairs;
}

async function createDataset(core, pairs ) {
    let idx = 0;
    for ( const pair in pairs ) {
      const index = await buildNextIndex( core );
      await core.append({
          index,
          value: pair
      })
    }
  }