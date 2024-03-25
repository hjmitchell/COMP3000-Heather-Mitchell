//Imports
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoDBUrl } from './config.js'
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/userRoute.js';

//Create instance of Express application
const app = express();

//CORS middleware
app.use(cors());
//Express middleware - parse JSON requests
app.use(express.json());

//Client side server:
//Get resolved path to file
const __filename = fileURLToPath(import.meta.url);
//Get directory name
const __dirname = path.dirname(__filename);
//Serve static files from 'client/public' directory
app.use(express.static(path.join(__dirname, '../client/public')));
//Serve static files from 'client/src' directory
app.use('/src', express.static(path.join(__dirname, '../client/src')));

//Default page route
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('PianoStudio');
});

//User route for registration/login
app.use('/user', router);

//Mongoose MongoDB connection
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