const axios = require('axios');
const url = require('url');
const res = require('express/lib/response');
const util = require('util');
const connectDB = require('../database/connection');
const { clearScreenDown } = require('readline');
const { copyFileSync } = require('fs');
const { param } = require('express/lib/request');
const query = util.promisify(connectDB.query).bind(connectDB);
exports.homeroutes = (req, res) => {
    return res.render('index');
}

connectDB.query('SHOW TABLES LIKE "users"', (error, results) => {
    if (error) {
        console.error('Error checking if table exists:', error);
        return;
    }
    if (results.length === 0) {
        console.log('Users table does not exist, creating...');
        connectDB.query('CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), email_id VARCHAR(255), password VARCHAR(255), age INT, gender VARCHAR(10), profile_pic VARCHAR(255), interest VARCHAR(255))', (error, results) => {
            if (error) {
                console.error('Error creating users table:', error);
                return;
            }
            console.log('Users table created successfully');
        });
    }
});

connectDB.query('SHOW TABLES LIKE "images"', (error, results) => {
    if (error) {
        console.error('Error checking if images table exists:', error);
        return;
    }
    if (results.length === 0) {
        console.log('Images table does not exist, creating...');
        connectDB.query('CREATE TABLE images (id INT AUTO_INCREMENT PRIMARY KEY, photo_src VARCHAR(255), user_id VARCHAR(255))', (error, results) => {
            if (error) {
                console.error('Error creating images table:', error);
                return;
            }
            console.log('Images table created successfully');
        });
    }
});
connectDB.query('SHOW TABLES LIKE "like_table"', (error, results) => {
    if (error) {
        console.error('Error checking if like_table exists:', error);
        return;
    }
    if (results.length === 0) {
        console.log('like_table table does not exist, creating...');
        connectDB.query('CREATE TABLE like_table (id INT AUTO_INCREMENT PRIMARY KEY, like_by_user VARCHAR(255), like_or_not INT, liked_to VARCHAR(255))', (error, results) => {
            if (error) {
                console.error('Error creating like_table table:', error);
                return;
            }
            console.log('like_table table created successfully');
        });
    }
});

// Check if match_table table exists, if not, create it
connectDB.query('SHOW TABLES LIKE "match_table"', (error, results) => {
    if (error) {
        console.error('Error checking if match_table exists:', error);
        return;
    }
    if (results.length === 0) {
        console.log('match_table table does not exist, creating...');
        connectDB.query('CREATE TABLE match_table (id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(255), target_id VARCHAR(255))', (error, results) => {
            if (error) {
                console.error('Error creating match_table table:', error);
                return;
            }
            console.log('match_table table created successfully');
        });
    }
});

connectDB.query('SHOW TABLES LIKE "messages"', (error, results) => {
    if (error) {
        console.error('Error checking if messages table exists:', error);
        return;
    }
    if (results.length === 0) {
        console.log('Messages table does not exist, creating...');
        connectDB.query('CREATE TABLE messages (id INT AUTO_INCREMENT PRIMARY KEY, from_user_id VARCHAR(255), to_user_id VARCHAR(255), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)', (error, results) => {
            if (error) {
                console.error('Error creating messages table:', error);
                return;
            }
            console.log('Messages table created successfully');
        });
    }
});
// for sign up new user=>
exports.add_user = (req, res) => {
    var bool_user='';
    if (req.body.username!==bool_user) {
        user_data = req.body;
        console.log(user_data);
        username = user_data.username;
        firstname = user_data.firstname;
        lastname = user_data.lastname;
        email = user_data.email;
        password = user_data.password;
        confirmPassword = user_data.confirmpassword;
        age = user_data.age;
        gender = user_data.gender;
        console.log(password, confirmPassword)
        if (password === confirmPassword&password!==bool_user) {
            connectDB.query('INSERT INTO users (username,firstname,lastname,email_id,password,age,gender) VALUES (?,?,?,?,?,?,?)', [username, firstname, lastname, email, password, age, gender], (error,
                results) => {
                if (error){ 
                    return res.status(409).render('error', { 'message': 'user already exists','error_code':'409','messageDetails':'please try another username' });}
                else {
                    return res.status(200).render('error', { 'message': 'account created successfully','error_code':'200','messageDetails':'please login ' });
                }
            });
        }
        else {
            return res.status(400).render('error', { 'message': 'you have entered wrong password','error_code':'400','messageDetails':'please provide right password' });
        }
    }
    else {
        return res.status(406).render('error', { 'message': 'fields cannot be empty','error_code':'406','messageDetails':'please fill all the details carefully' })
    }

}

// for login a user=>
exports.Login_user = (req, res) => {
    if (req.body.email !== undefined) {
        loginData = req.body;
        email_id = loginData.email;
        password = loginData.password;
        var query = 'SELECT * from users where email_id=?';
        connectDB.query(query, [email_id], (err, result) => {

            if (err || (result.length === 0)) res.status(500).render('error', {'error_code':'500','messageDetails':'oops invaild details please provide right details',  'message': 'invaild credentials' });
            else if (result.length !== 0) {
                if (password === result[0].password) {
                    data = result[0];
                    var link = 'http://localhost:3000/user?id=' + data.username + '&password=' + data.password;
                    res.redirect(link);

                }
                else {
                    res.status(400).render('error', {'error_code':'400','messageDetails':'oops invaild details please provide right details',  'message': 'invaild password' });
                }
            }
        });
    }
    else {
        return res.status(406).render('error', { 'message': 'fields cannot be empty','error_code':'406','messageDetails':'please fill all the details carefully' })
    }
}


exports.liked = (req, res) => {
    console.log(req.url);
    if (req.query.id && req.query.password && req.query.f_id) {
        const id = req.query.id;
        const password = req.query.password;
        const liked_to_id = req.query.f_id;
        const like = parseInt(req.query.like);
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('error', {'error_code':'500','messageDetails':'oops invaild details please provide right details',  'message': 'invaild credentials' });
            else {
                connectDB.query('INSERT INTO like_table  (like_by_user,like_or_not,liked_to) VALUES (?,?,?)', [id, like, liked_to_id], (err, results) => {
                    if (err) { console.log(err); res.status(500).render('error', {'error_code':'500','messageDetails':'oops invaild details please provide right details',  'message': 'invaild credentials' }); }
                    else {
                        console.log(liked_to_id, id);
                        connectDB.query('select * from like_table where like_by_user=? and like_or_not=1 and liked_to=?', [liked_to_id, id], (err, result_l) => {
                            console.log(result_l);
                            if (err || result_l.length === 0) {
                                console.log(err, 'errors hai'); var link = "http://localhost:3000/feed?id=" + id + "&password=" + password;
                                res.redirect(link);
                            }
                            else {

                                connectDB.query('insert into match_table (user_id, target_id) values(?,?)', [id, liked_to_id], (err, result) => {
                                    if (err) {
                                        console.log(err); var link = "http://localhost:3000/feed?id=" + id + "&password=" + password;
                                        res.redirect(link);
                                    }
                                    else {
                                        var link = "http://localhost:3000/feed?id=" + id + "&password=" + password;
                                        res.redirect(link);
                                    }
                                })
                            }
                        })

                        //   var link= "http://localhost:3000/feed?id="+id+"&password="+password;
                        //        res.redirect(link);
                    }
                })
            }
        })
    }
    else{
        return res.status(404).render('error', {'error_code':'404','messageDetails':'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE',  'message': 'Oops! This Page Could Not Be Found' })

    }
}
//for getting friends from like table
exports.friends = (req, res) => {

    if (req.query.id && req.query.password) {
        const id = req.query.id;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, resultUs) => {
            if (err || (resultUs.length === 0)) res.status(500).render('error', {'error_code':'500','messageDetails':'oops invaild details please provide right details',  'message': 'invaild credentials' });
            else {
                connectDB.promise().query("select * from match_table where user_id=? or target_id=?", [id, id]).then(([result]) => {
                    var data = []
                    for (x in result) {
                        if (result[x].user_id === id) {
                            data.push(result[x].target_id);
                        }
                        else {
                            data.push(result[x].user_id);
                        }
                    }
                    connectDB.promise().query("select username,firstname,lastname,profile_pic,interest,age from users where username IN (?)", [data]).then(([resu]) => {
                        var friend = [];
                        for (x in resu) friend.push(resu[x]);
                        // console.log(resultUs)
                        res.render('friends', { 'friendsData': friend, 'user': resultUs[0] });
                    }).catch(console.log)

                }).catch(console.log);
            }
        });


    }
    else{
        return res.status(404).render('error', {'error_code':'404','messageDetails':'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE',  'message': 'Oops! This Page Could Not Be Found' })

    }

}

exports.chats = (req, res) => {
    if (req.query.id && req.query.password && req.query.fid) {
        const id = req.query.id;
        const fid = req.query.fid;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('error', {'error_code':'500','messageDetails':'oops invaild details please provide right details',  'message': 'invaild credentials' });
            else {
                var arr = [id, fid];
                connectDB.promise().query('select username,firstname,lastname,profile_pic from users where username IN (?)', [arr]).then(([resultUser]) => {
                    var user = [];
                    var friend = [];
                    if (resultUser[0].username === id) {
                        user.push(resultUser[0]);
                        friend.push(resultUser[1]);
                    }
                    else {
                        user.push(resultUser[1]);
                        friend.push(resultUser[0]);
                    }
                    user[0].password=password;
                    connectDB.promise().query('select * from messages where  (from_user_id=? and to_user_id=?) or(from_user_id=? and to_user_id=?)', [id, fid, fid, id]).then(([resultMessage]) => {


                        res.render('chatBox', { 'messageData': resultMessage, 'user': user[0], 'friend': friend[0]});
                    }).catch(console.log);



                }).catch(console.log)



            }
        });
    }
    else{
        return res.status(404).render('error', {'error_code':'404','messageDetails':'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE',  'message': 'Oops! This Page Could Not Be Found' })

    }

}

exports.notFound=(req,res)=>{
    return res.status(404).render('error', {'error_code':'404','messageDetails':'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE',  'message': 'Oops! This Page Could Not Be Found' })
}