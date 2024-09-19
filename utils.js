const fs = require('fs');
const _ = require('lodash');
const { analyzeDependency } = require('express-router-dependency-graph')
const expressListEndpoints = require('express-list-endpoints');
const pathPackage = require('path');



const showRoutingFiles = async (routingFile) => {
    if (routingFile) {
        const result = await analyzeDependency({
            outputFormat: 'json',
            rootDir: process.cwd(),
            rootBaseUrl: '',
            includeOnly: '',
            doNotFollow: ['^node_modules']
        })

        const routingFiles = result.map(e => {
            return { routingFile: e.filePath.replace(process.cwd(), '') }
        })

        console.table(routingFiles)
        
        const onlyRoutingFiles = result.map(e=>{
            return {filePath: e.filePath, routers: e.routers.filter(f=> f.method == 'use')}
        })
        
        onlyRoutingFiles.filter(e=>{
            if(e.routers.length){
                console.log(e.filePath.replace(process.cwd(),''))
                console.table(e.routers,['path','method','middlewares'])
            }
        })
        

    }
}





const showEndPoints = (relativeFilePath,  argv) => {
    const { path, method, middleware } = argv;
 

    const appPath = pathPackage.join(process.cwd(), relativeFilePath);


    if (!fs.existsSync(appPath)) throw `${appPath} is not exists in this directory`;

    const RouteFile = require(appPath);

    let endPoints = expressListEndpoints(RouteFile);

    // if any filter condition given that will filtered here.
    if (path) endPoints = endPoints.filter(e => e.path.includes(path));
    if (method) endPoints = endPoints.filter(e => e.methods.includes(method));
    if (middleware) endPoints = endPoints.filter(e => e.middlewares.includes(middleware));


    console.table(_.orderBy(endPoints, 'path'));
}


module.exports = { showRoutingFiles, showEndPoints }