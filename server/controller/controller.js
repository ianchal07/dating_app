const connectDB = require('../database/connection');
const upload = require('./upLoadmiddleware');

exports.user_id = (req, res) => {
    if (req.query.id && req.query.password) {
        const id = req.query.id;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                data = result[0];

                connectDB.query('select * from images where user_id=?', [id], (err, result) => {
                    if (err) console.log(err);
                    else {


                        return res.status(200).render('userProfile', { 'user': data, 'postData': result });
                    }
                })

            }
        })
    }
    else {
        const id = req.query.id;
        console.log(id);
        connectDB.query('select * from users where username=?', [id], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                data = result[0];
                var postData = []
                connectDB.query('select * from images where user_id=?', [id], (err, result) => {
                    if (err) console.log(err);
                    else {

                        return res.status(200).render('showUser', { 'data': data, 'postData': result });
                    }
                })

            }

        });
    }
}
exports.users = (req, res) => {
    if (req.query.id && req.query.password) {
        const id = req.query.id;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                connectDB.query('select * from users where username!=?', [id], (err, results) => {
                    if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
                    else {
                        users_data = results;
                        res.render('feedPage', { 'users_data': users_data, 'user': result[0] });
                    }
                })
            }
        })
    }
    else {
        return res.status(404).render('error', { 'error_code': '404', 'messageDetails': 'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE', 'message': 'Oops! This Page Could Not Be Found' })

    }
}
exports.change_profile_pic = (req, res) => {
    console.log(req.file.filename);
    if (req.query.id && req.query.password) {
        const id = req.query.id;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                const profile_pic = req.file.filename;
                connectDB.query('update  users SET profile_pic=? where username=?', [profile_pic, id], (err, result) => {
                    if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
                    else {
                        var link = "http://localhost:3000/user?id=" + id + "&password=" + password;
                        res.redirect(link);
                    }
                })
            }

        })
    }
    else {
        return res.status(404).render('error', { 'error_code': '404', 'messageDetails': 'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE', 'message': 'Oops! This Page Could Not Be Found' })

    }
}
exports.add_picture = (req, res) => {
    // console.log(req.file.filename);
    if (req.query.id && req.query.password) {
        const id = req.query.id;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                const profile_pic = req.file.filename;
                connectDB.query('INSERT INTO images  ( photo_src, user_id) VALUES (?,?)', [profile_pic, id], (err, result) => {
                    if (err || (result.length === 0)) { console.log(err); res.status(500).render('Landingpage', { 'message': 'invaild credentials' }); }
                    else {
                        var link = "http://localhost:3000/user?id=" + id + "&password=" + password;
                        res.redirect(link);
                    }
                })
            }

        })
    }
    else {
        return res.status(404).render('error', { 'error_code': '404', 'messageDetails': 'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE', 'message': 'Oops! This Page Could Not Be Found' })

    }
}
exports.update_interest = (req, res) => {
    if (req.query.id && req.query.password) {
        const id = req.query.id;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                const interest = req.body.interest;
                connectDB.query('update  users SET interest=? where username=?', [interest, id], (err, result) => {
                    if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
                    else {
                        var link = "http://localhost:3000/user?id=" + id + "&password=" + password;
                        res.redirect(link);
                    }
                })
            }
        })
    }
    else {
        return res.status(404).render('error', { 'error_code': '404', 'messageDetails': 'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE', 'message': 'Oops! This Page Could Not Be Found' })

    }

}

exports.sendMessage = (req, res) => {
    if (req.query.id && req.query.password && req.query.fid) {
        const id = req.query.id;
        const fid = req.query.fid;
        const password = req.query.password;
        connectDB.query('select * from users where username=? and password=?', [id, password], (err, result) => {
            if (err || (result.length === 0)) res.status(500).render('Landingpage', { 'message': 'invaild credentials' });
            else {
                connectDB.promise().query('insert into messages ( from_user_id, to_user_id, message) values(?,?,?)', [id, fid, req.body.message]).then(([result]) => {
                    var link = "http://localhost:3000/chats?id=" + id + "&password=" + password + "&fid=" + fid;
                    res.redirect(link);
                })



            }
        });
    }
    else {
        return res.status(404).render('error', { 'error_code': '404', 'messageDetails': 'SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE', 'message': 'Oops! This Page Could Not Be Found' })

    }

}