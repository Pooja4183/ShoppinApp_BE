const { error } = require('console');
const multer = require('multer');
const path = require("path");

// define storage for upload files

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads/"); // folder to save imaages
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+ path.extname(file.originalname));
    }
});

// file filter 

const fileFilter = (req,file,cb)=>{
    const allowed = /jpeg|jpg|png/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if(extname && mimetype){
        cb(null,true);
    }else{
        cb(new Error("Only images are allowed!"));
    }
}



// initialize Multer with storage confguration

const upload = multer({storage:storage, fileFilter:fileFilter});

module.exports = upload;

