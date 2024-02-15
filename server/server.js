//Imports
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoDBUrl } from './config.js'
import http from 'http';

//Create instance of Express application
const app = express();

//CORS middleware
app.use(cors());
//Express middleware - parse JSON requests
app.use(express.json());

//Default page route
app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('PianoStudio');
});

//Routes for paths
//app.use('/*url', *routeimport);

mongoose
    .connect(mongoDBUrl)
    .then(() => {
        console.log("Connected to database");
        //HTTP server using Express
        const server = http.createServer(app);
        
    //Start server on config port
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}) //Error handling...
.catch((error) => {
    console.log(error);
});

export default app;