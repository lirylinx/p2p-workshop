const { Client } = require('hyperspace');
const { time } = require('./process');



// Toggle these ones on-and-off to see different behaviors.
const PREFETCH = false
const NAIVE_MODE = true
if ( process.argv.length <= 2) return 0;
const STATS_CORE_KEY = process.argv[2];
let TARGET = 0
if ( process.argv[3] == null ) {
 TARGET = (new Date(Date.now() - (60 * 2.5e3))).toISOString()


}else {
const STATS_MINUTE_AGO =  process.argv[3]
 TARGET = (new Date(Date.now() - (60 * (parseInt(STATS_MINUTE_AGO) * 1e3)))).toISOString()

}
start()
console.log(process.argv[3])
async function start () {
  



  const { corestore, network, replicate } = new Client()
  const store = corestore()

  // Get the stats core.
  const core = store.get({ key: STATS_CORE_KEY, valueEncoding: 'json' })
  await core.ready();

  // console.log('Waiting 5s for some stats to be appended.')
  // await new Promise(resolve => setTimeout(resolve, 5000))  
  const stats = await findClosest( core, TARGET );
  console.log( 'stats ', stats)

}

 

async function findClosest (core, key) {
  if (!core.length) return null
  let latest = await core.get(core.length - 1)
  return moveCloser()

  async function moveCloser () {
    let closest = closestBlock(key, latest)  
    if (closest === -1) return latest
    latest = await core.get(closest)
    return moveCloser()
  }
}

 function closestBlock (timestamp, block) {
  if (!block.index.length) return -1

  for (let i = 0; i < block.index.length; i++) {
    if (block.index[i].timestamp < timestamp) {
      if (i === 0) return -1
      return block.index[i - 1].blockIndex
    }
  }

  return block.index[block.index.length - 1].blockIndex
}