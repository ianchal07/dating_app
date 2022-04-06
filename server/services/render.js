const axios = require('axios');
const url=require('url');
const res = require('express/lib/response');
const connectDB = require('../database/connection');
exports.homeroutes = (req, res) => {
    return res.render('Landingpage',{'message':'welcome'});
}


// for sign up new user=>
exports.add_user = (req, res) => {
    if (req.body) {
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
      console.log(password , confirmPassword)
        if (password === confirmPassword) {
            connectDB.query('INSERT INTO users (username,firstname,lastname,email_id,password,age,gender) VALUES (?,?,?,?,?,?,?)', [username, firstname, lastname, email, password, age, gender], (error,
                results) => {
                if (error) return res.status(409).render('Landingpage',{ 'message': 'user already exists'});
                else {
                    return res.status(200).render('Landingpage',{'message': 'account created successfully please login '});
                }
            });
        }
        else {
            return res.status(400).render('Landingpage',{ 'message': 'password not matched' });
        }
    }
    else {
        return res.status(406).render('Landingpage', {'message': 'fields cannot be empty' })
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

            if (err || (result.length === 0)) res.status(500).render('Landingpage',{'message': 'invaild credentials' });
            else if (result.length !== 0) {
                if (password === result[0].password) {
                    data=result[0];
                    console.log(data);
                 var link='http://localhost:3000/user?id='+data.username+'&password='+data.password;
                  res.redirect(link);
                 
                }
                else {
                    res.status(400).render('Landingpage',{ 'message': 'invaild password' });
                }
            }
        });
    }
    else {
        return res.status(406).json({ 'message': 'fields cannot be empty' })
    }
}


exports.liked=(req,res)=>{
    console.log(req.url);
    if (req.query.id &&req.query.password&&req.query.f_id){
        const id = req.query.id;
        const password = req.query.password;
        const liked_to_id=req.query.f_id;
        const like=parseInt(req.query.like);
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                connectDB.query('INSERT INTO like_table  (like_by_user,like_or_not,liked_to) VALUES (?,?,?)',[id,like,liked_to_id],(err,results)=>{
                   if(err){ console.log(err); res.status(500).render('Landingpage',{'message': 'invaild credentials' });}
                   else{

                  var link= "http://localhost:3000/feed?id="+id+"&password="+password;
                       res.redirect(link);
                   }
                })
            }
        })
    } 
}
