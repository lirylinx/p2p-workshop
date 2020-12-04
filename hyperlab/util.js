const { Client  } = require('hyperspace')


async function start () {
    const c = new Client();
    const store = c.corestore();

    const core = store.get({ name: 'test-2'});

    await core.ready();
    
    await insert(core);
    await show(core);

    console.log(core);



}

async function append (core, data) {
    await core.append(data);
 
    return core.length;
}

async function get( core, index ) {
    return await core.get(index);
}

function print(data) {
    console.log(data.toString());
}


async function insert(core) {
    for (  i = 0; i < 30; i++) {
        data = 'block #' + core.length;

        await append(core, data);
    }
}

async function show(core) {
    for (  i = 0; i < core.length; i++) {
        print(await get(core, i));
    }


}

async function remove(core) {
    // core.remove();
    // return core.
}