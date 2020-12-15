
const { Client } = require('hyperspace');
const  Hyperbee = require('hyperbee')

if ( process.argv.length <= 2) return 0;
const MYSPACE = process.argv[2];


start()
async function start () {
  



  const { corestore, network, replicate } = new Client()
  const store = corestore()
  const core = store.get({ name: MYSPACE })

  const db = new Hyperbee( core, { keyEncondig: 'utf-8', valueEncondig: 'utf-8'})
  await db.ready();
  await db.put('id', core.key.toString('hex') + ' TESTE #' + db.version.toString() )
  otherDB = db.checkout(2);

  console.log("actual")
  let { seq, key, value } = await db.get('id');
  console.log('id: #', key.toString('utf-8'));
  console.log('seq: #', seq);
  console.log('value: #', value.toString('utf-8'));

  console.log("anterior")
  await otherDB.ready()
     value  = await otherDB.get('id');
  console.log('id: #', value.key.toString('utf-8'));
  console.log('seq: #', value.seq);
  console.log('value: #', value.value.toString());
  stream = db.createDiffStream(otherDB, { keyEncondig: 'utf-8', valueEncondig: 'utf-8'})
  console.log(await stream)
  // Get the stats core.
  

}

 