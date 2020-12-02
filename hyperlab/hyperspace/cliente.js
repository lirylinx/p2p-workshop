const { Client  } = require('hyperspace')

start();

async function start () {
    const c = new Client()

    // Pedir o estado do servidor RPC para verificar se tudo esta correcto
    console.log( await c.status() );
}