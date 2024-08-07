const yargs = require('yargs');
const {showEndPoints, showRoutingFiles} = require('./utils.js')


const argv = yargs
    .options('p', { alias: 'path', describe: 'Filter end point by path', type: 'string', demandOption: null })
    .options('m', { alias: 'method', describe: 'Filter end point by method', type: 'string', demandOption: null })
    .options('w', { alias: 'middleware', describe: 'Filter end point by middleware', type: 'string', demandOption: null })
    .options('r', { alias: 'routingFiles', describe: 'show routing files', type: 'boolean', demandOption: false })
    .options('d', { alias: 'detailedRoutingFiles', describe: 'show detailed routing file', type: 'boolean', demandOption: false })
    .help(true)
    .argv;


    

if (argv._.length) {
    const relativeAppFilePath = yargs.argv._[0];

    (async () => {
        if (yargs.argv.routingFiles || yargs.argv.detailedRoutingFiles) await showRoutingFiles(yargs.argv.detailedRoutingFiles);

        showEndPoints(relativeAppFilePath, yargs.argv);
    })()
    
} else {
    throw 'missing app file path';
}

