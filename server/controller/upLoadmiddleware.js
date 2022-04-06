// const { path } = require("express/lib/application");
const path=require('path');
const multer = require("multer");
var Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./assets/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
        // if(err) console.log(err);
    }
})
// console.log(Storage.destination); 
var upload=multer({ storage: Storage })
module.exports=upload;