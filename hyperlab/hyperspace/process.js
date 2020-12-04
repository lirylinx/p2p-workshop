const stats = require( 'process-top' )()// instanciar o colector de estado do sistema
const timediff = require( 'timediff' );

exports.get = function () {
    var data = null;
    try {
        data = stats.toJSON();

    }catch( err ) {
        console.error("[getProcess] Ocorreu um erro:", err);
        data = null;
    }

    return data;
}


exports.time = function(time1, time2) {
    const diff = timediff(time2, time1);

    return diff;
}

