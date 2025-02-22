#!/usr/bin/env node

/**
 * this package is used to print routing files, specific routes ,middleware, method of 
 * route files ,it is very hard to find and understand the hierarchy of routes in big codebases
 * so this package helps to users 
 *
 * is a CLI bases package where we can give some flags of different operations
 * 
 *  yargs is used to setup a CLI interaction where we can set pre defined options for different operations
 * 
 * 
 */

const yargs = require('yargs');
const { showEndPoints, showRoutingFiles } = require('./utils.js');
const { sortedUniq } = require('lodash');


const { argv } = yargs
    .options('p', { alias: 'path', describe: 'Filter end point by path', type: 'string', demandOption: null })
    .options('m', { alias: 'method', describe: 'Filter end point by method', type: 'string', demandOption: null })
    .options('w', { alias: 'middleware', describe: 'Filter end point by middleware', type: 'string', demandOption: null })
    .options('r', { alias: 'routingFiles', describe: 'show routing files', type: 'boolean', demandOption: false })
    .help(true)



const relativeAppFilePath = argv._.length ? argv._[0] :  null;





(async (relativeAppFilePath, { path, method, middleware, routingFiles }) => {
    if (routingFiles) {
        await showRoutingFiles(routingFiles);
        return;
    }
    if(relativeAppFilePath || path || method || middleware){
        if(relativeAppFilePath){
            await showEndPoints(relativeAppFilePath, { path, method, middleware, routingFiles });
        }else{
            throw "Relative path is missing";
        }
    }else if(!routingFiles){
        throw "Atleast one of the following parameters required :- <relative app file path> , -r"
    }

})(relativeAppFilePath, argv).catch(error => console.log(
    'Help: npx list-route --help \n\n'
    + error
))



