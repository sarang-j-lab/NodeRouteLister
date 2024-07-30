const yargs = require('yargs');
const fs = require('fs');
const _ = require('lodash');
const expressListEndpoints  = require('express-list-endpoints');
const appFilePath = require('app-root-path');
const path = require('path');

const argv = yargs
    .options('p', { alias: 'path', describe: 'Filter end point by path', type: 'string', demandOption: null })
    .options('m', { alias: 'method', describe: 'Filter end point by method', type: 'string', demandOption: null })
    .options('w', { path: 'middleware', describe: 'Filter end point by middleware', type: 'string', demandOption: null })
    .help(true)
    .argv;


    
if (argv._.length == 0)  throw "Missing app file path";

const appFile = path.join(appFilePath.path, argv._[0]);



if (!fs.existsSync(appFile)) throw `${appFile} is not exists in this directory`;

const serverRouteFile = require(appFile);



let endPoints = expressListEndpoints(serverRouteFile);


let newEndpoint = []
if(argv.p) endPoints = endPoints.filter(e => e.path.includes(argv.p));
if(argv.m) endPoints = endPoints.filter(e => e.methods.includes(argv.m));
if(argv.w) endPoints = endPoints.filter(e => e.middlewares.includes(argv.w));

console.table(_.orderBy(endPoints, 'path'));

return;

