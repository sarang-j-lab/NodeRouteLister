
/*
this util files stores some important function to excutes the operation like printing all routes, route file path
fs -> is use to check the input file that given by user is exists or not. 

lodash ->

analyzeDependency -> is a method in express-router-dependency-graph it can reveal how different 
routes and middleware relate to one another within the app.

expressListEndpoints -> The express-list-endpoints package is a handy utility for listing all endpoints in an 
Express application. It provides a quick and easy way to see all the routes defined in your app, making it 
helpful for both documentation and debugging purposes.


    showRoutingFiles --> this function is use to show all routing files in app. files which have express routes.
    its use analyzeDependency to get a object of all routePath like this:- 
        [
        {
            filePath: 'C:\\Users\\sarang\\Desktop\\NodeRouteLister\\routes\\index.js',
            routers: [ [Object] ]
        },
        {
            filePath: 'C:\\Users\\sarang\\Desktop\\NodeRouteLister\\routes.js',
            routers: [
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object],
            [Object], [Object]
            ]
        }
        ]
        and we convert to this
        [
            { routingFile: '\\routes\\index.js' },
            { routingFile: '\\routes.js' }
        ]

*/


const fs = require('fs');
const _ = require('lodash');
const { analyzeDependency } = require('express-router-dependency-graph')
const expressListEndpoints = require('express-list-endpoints');
const pathPackage = require('path');
const res = require('express/lib/response');




const showRoutingFiles = async (routingFile) => {
    if (routingFile) {
        const result = await analyzeDependency({
            outputFormat: 'json',
            rootDir: process.cwd(),
            rootBaseUrl: '',
            includeOnly: '',
            doNotFollow: ['^node_modules']
        })

        // here we only get the routing files of app
        const routingFiles = result.map((e)=>{
            return {routingFiles: e.filePath.replace(process.cwd(),"")};
        })

        console.table(routingFiles);
     
        
        
        
        // and here we are printing the middlewares that pointing to other route file
        const onlyRoutingPaths = result.map(e=>{
            return {filePath: e.filePath, routers: e.routers.filter(f=> f.method == 'use')}
        })
        
        onlyRoutingPaths.filter(e=>{
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

    console.log("File path is :- "+appPath)
    console.table(_.orderBy(endPoints, 'path'));
}


module.exports =  { showRoutingFiles, showEndPoints };