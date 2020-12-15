
const { Client } = require('hyperspace');
const  Hyperbee = require('hyperbee')
const definition = require( 'websters-english-dictionary').kvPairs()

if ( process.argv.length <= 2) return 0;
const MYSPACE = process.argv[2];


start()
async function start () {
  



  const { corestore, network, replicate } = new Client()
  const store = corestore()
  const core = store.get({ name: MYSPACE })

  const db = new Hyperbee( core, { keyEncondig: 'utf-8', valueEncondig: 'utf-8'})
  const batch = db.batch();

//   for await ( const data  of definition ) {
//     //   console.log(data)
//       await batch.put(data.key, data.value)
//     //   console.log(data.key, data.value)
//   }

  await batch.flush();
  console.log('dados inseridos');

  await readStream(db, {gte: 'hello', lte: 'j'})
  
  
  

}


async function readStream(db, options) {
    for await ( const data of db.createReadStream(options) ) {
        // console.log(data.seq);
        console.log(data.key.toString('utf-8'));
        // console.log(data.value.toString('utf-8'));

    }
}

 