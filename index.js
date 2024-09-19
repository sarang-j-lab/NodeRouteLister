const yargs = require('yargs');
const { showEndPoints, showRoutingFiles } = require('./utils.js')


const argv = yargs
    .options('p', { alias: 'path', describe: 'Filter end point by path', type: 'string', demandOption: null })
    .options('m', { alias: 'method', describe: 'Filter end point by method', type: 'string', demandOption: null })
    .options('w', { alias: 'middleware', describe: 'Filter end point by middleware', type: 'string', demandOption: null })
    .options('r', { alias: 'routingFiles', describe: 'show routing files', type: 'boolean', demandOption: false })
    .help(true)
    .argv;



if(argv.routingFiles){
    showRoutingFiles(argv.routingFiles);
}else{
    if (!argv._.length) throw 'Missing app file path';

    const relativeAppFilePath = argv._[0]; 

    showEndPoints(relativeAppFilePath, argv);

}
    



