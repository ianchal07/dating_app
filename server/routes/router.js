const express = require('express');
const route = express.Router();
const controller = require('../controller/controller');
const upload = require('../controller/upLoadmiddleware');
const services = require('../services/render');
// const controller = require('../controller/controller');

route.get('/',services.homeroutes);

route.post('/sign-up',services.add_user);

route.post('/login',services.Login_user);
route.get('/like',services.liked);
route.get('/user',controller.user_id);
route.get('/feed',controller.users);
route.post('/user/change_profile_pic',upload.single('profile_pic'),controller.change_profile_pic);
route.post('/user/add_post',upload.single('post_pic'),controller.add_picture)
route.post('/user/edit_interest',controller.update_interest);
module.exports=route