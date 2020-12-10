const { Client } = require('hyperspace')



// Toggle these ones on-and-off to see different behaviors.
const PREFETCH = false
const NAIVE_MODE = true
if ( process.argv.length <= 2) return 0;
const STATS_CORE_KEY = process.argv[2];
let TARGET = 0
if ( process.argv[3] == null ) {
 TARGET = new Date(Date.now() - (60 * 5e3))


}else {
const STATS_MINUTE_AGO = process.argv[3]; 
 TARGET = new Date(Date.now() - (60 * (STATS_MINUTE_AGO * 1e3)))

}
start()

async function start () {
  



  const { corestore, network, replicate } = new Client()
  const store = corestore()

  // Get the stats core.
  const statsCore = store.get({ key: STATS_CORE_KEY, valueEncoding: 'json' })
  await statsCore.ready();
  // Connect the stats core to the network.
  await replicate(statsCore)

  let blocksDownloaded = 0
  statsCore.on('download', () => {
    blocksDownloaded++
  })
  setInterval(() => {
    console.log('Blocks Downloaded:', blocksDownloaded)
  }, 2000)

  const algorithm = NAIVE_MODE ? naiveClosestStats : bisectClosestStats

  // If PREFETCH is true, we'll mark the entire core for parallel downloading.
  if (PREFETCH) statsCore.download()

  const closestStats = await algorithm(statsCore, TARGET)
  console.log("closest", closestStats)
  if (!closestStats) {
    console.log('No stats found for that time.')
  } else {
    console.log('Found stats:', closestStats)
  }
}

async function naiveClosestStats (core, target) {
  for (let i = 0; i < core.length - 1; i++) {
    const block = await core.get(i)
    if (new Date(block.timestamp) >= target) return block
  }
  return null
}

async function getClosestStatsBisect(core, target) {
  return bisect(core, target, {
    get: idx => core.get(idx),
    map: block => block.timestamp
  })
}

async function bisectClosestStats (core, target) {
  let lower = 0
  let upper = core.length

  while (lower < upper) {
    const mid = Math.floor((upper + lower) / 2)  

    // These tertiary operaters lets us easily test with Arrays first.
    const block = await core.get(mid)
    const date = new Date(block.timestamp)

    if (date < target) lower = mid + 1
    else upper = mid
  }

  return core.get(lower)
}
 