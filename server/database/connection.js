const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // host for connection
    port: 3306, // default port for mysql is 3306
    database: 'app_database', // database from which we want to connect out node application
    user: 'root', // username of the mysql connection
    password: 'your_password',// password of the mysql connection
    insecureAuth: true
});
connection.connect(function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    else {
        console.log('we are connected with database');
    }
});

module.exports=connection; 
