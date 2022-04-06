const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const path = require('path');
const PORT=process.env.PORT||3000;

   
const connectDB = require('./server/database/connection');

// for connecting with database->
connectDB.connect();

// for dealing form data->
app.use(bodyParser.urlencoded({ extended: true }));//try with false also
app.use(bodyParser.json());


// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))


// for loading assets->
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/image', express.static(path.resolve(__dirname, "assets/image")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));
app.use('/uploads', express.static(path.resolve(__dirname, "assets/uploads")));



// load routers
app.use('/', require('./server/routes/router'))
 
//for server->
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});


