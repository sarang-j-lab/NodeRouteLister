const yargs = require('yargs');
const fs = require('fs');
const _ = require('lodash');
const expressListEndpoints = require('express-list-endpoints');
const appRootFilePath = require('app-root-path');
const path = require('path');
const { analyzeDependency } = require('express-router-dependency-graph');


const argv = yargs
    .options('p', { alias: 'path', describe: 'Filter end point by path', type: 'string', demandOption: null })
    .options('m', { alias: 'method', describe: 'Filter end point by method', type: 'string', demandOption: null })
    .options('w', { alias: 'middleware', describe: 'Filter end point by middleware', type: 'string', demandOption: null })
    .options('r', { alias: 'routingFiles', describe: 'show routing files', type: 'boolean', demandOption: false })
    .options('d', { alias: 'detailedRoutingFiles', describe: 'show detailed routing file', type: 'boolean', demandOption: false })
    .help(true)
    .argv;


if (argv._.length == 0) throw "Missing app file path";

const absoluteFilePath = path.join(appRootFilePath.path, argv._[0]);


// it's return us a array of object where each object contain route file of root directory and their routes. {filePath , routers:[]}
analyzeDependency({
    outputFormat: 'json',
    rootDir: appRootFilePath.path,
    rootBaseUrl: '',
    includeOnly: '',
    doNotFollow: ['^node_modules']
}).then(result => {
    if (argv.routingFiles || argv.detailedRoutingFiles) {
        //here we finding the max file length where route exists, for add that length when we display them into table.
        const maxRouteFileLength = Math.max(...(result.map(e => e.filePath.length))) - appRootFilePath.path.length
        console.table(
            //converting the absolute path into relative path for printing. absoulte path given by analyzeDependency.
            result.map(e => {
                return {
                    routing_files: e.filePath.replace(appRootFilePath.path, '').padEnd(maxRouteFileLength)
                };
            })
        );

        
        const pathPerRouteFile = argv.detailedRoutingFiles ? result :
                result.filter( 
                    e => e.routers.find(f => f.method === 'use')
                ).map(e => {
                    return { ...e, routers: e.routers.filter(f => f.method === 'use') }
                });

                console.log(pathPerRouteFile)

                pathPerRouteFile.forEach(e =>{
                    console.log(e.filePath.replace(appRootFilePath, ''))
                    
                    const fileRoutes = _.orderBy(e.routers, 'path');
                    const maxPathLengthFile = Math.max(...(fileRoutes.map(e => e.path.length)))
                    console.table(fileRoutes.map(e =>{return {...e, path: e.path.padEnd(maxPathLengthFile)}})
                        ,['path','method','middlewares'])
                })



        if (!fs.existsSync(absoluteFilePath)) throw `${absoluteFilePath} is not exists in this directory`;
        const serverRouteFile = require(absoluteFilePath);
        let endPoints = expressListEndpoints(serverRouteFile);
        if (argv.p) endPoints = endPoints.filter(e => e.path.includes(argv.p));
        if (argv.m) endPoints = endPoints.filter(e => e.methods.includes(argv.m));
        if (argv.w) endPoints = endPoints.filter(e => e.middlewares.includes(argv.w));


        console.table(_.orderBy(endPoints, 'path'));




    }
});






