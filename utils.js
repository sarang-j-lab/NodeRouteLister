const fs = require('fs');
const _ = require('lodash');
const { analyzeDependency } = require('express-router-dependency-graph')
const expressListEndpoints = require('express-list-endpoints');
const appRootFilePath = require('app-root-path');
const pathPackage = require('path');


const showRoutingFiles = async (detailedRoutingFiles = false) => {
    // it's return us a array of object where each object contain route file of root directory and their routes. {filePath , routers:[]}
    let result = await analyzeDependency({
        outputFormat: 'json',
        rootDir: appRootFilePath.path,
        rootBaseUrl: '',
        includeOnly: '',
        doNotFollow: ['^node_modules']
    })
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


    const pathPerRouteFile = detailedRoutingFiles ? result :
        result.filter(
            e => e.routers.find(f => f.method === 'use')
        ).map(e => {
            return { ...e, routers: e.routers.filter(f => f.method === 'use') }
        });

    // console.log(pathPerRouteFile)

    pathPerRouteFile.forEach(e => {
        console.log(e.filePath.replace(appRootFilePath, ''))

        const fileRoutes = _.orderBy(e.routers, 'path');
        const maxPathLengthFile = Math.max(...(fileRoutes.map(e => e.path.length)))
        console.table(fileRoutes.map(e => { return { ...e, path: e.path.padEnd(maxPathLengthFile) } })
            , ['path', 'method', 'middlewares'])
    })


}





const showEndPoints = (relativePath, { path, method, middleware }) => {

    const appPath = pathPackage.join(appRootFilePath.path, relativePath);


    if (!fs.existsSync(appPath)) throw `${appPath} is not exists in this directory`;

    const RouteFile = require(appPath);
    let endPoints = expressListEndpoints(RouteFile);
    if (path) endPoints = endPoints.filter(e => e.path.includes(path));
    if (method) endPoints = endPoints.filter(e => e.methods.includes(method));
    if (middleware) endPoints = endPoints.filter(e => e.middlewares.includes(middleware));


    console.table(_.orderBy(endPoints, 'path'));
}


module.exports = { showRoutingFiles, showEndPoints }