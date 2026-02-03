const multer = require("multer");
const express = require("express");
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const app = express();
const cors = require("cors");
const path = require("path");
//const { resourceLimits } = require("worker_threads");
const PORT = 3290;
require("dotenv").config();

app.use(cors());
app.use(express.json());
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

cloudinary.config({
    cloud_name : process.env.cloud_folder,
    api_key : process.env.cloud_key,
    api_secret:process.env.cloud_secret
})

// diskstorage is used for where to upload,name,time stamp add of file
//const storeupload = multer.diskStorage({ 
//    destination:(req,file,cb)=>{
//        cb(null,"uploads/");
//    },
//    filename:(req,file,cb)=>{
//        const filename = Date.now() + "-" + file.originalname;
//        cb(null,filename);
//    }
//});  // aws S3,clousflare or cloundiary is better so i use it that here rather then diskstorage

const storage = new Cloudinarystorage({
     cloudinary: cloudinary,
    params:{
        folder:"media_uploads",
        resource_type:"auto",
    }
})
const uploads = multer({
     storage,
    limits : {
        fileSize: 150 * 1024 * 1024
    },
    fileFilter(req,file,cb){
        if  (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/"))
        {
            cb(null,true);
        }else {
            cb(new Error("Only jpg,jpgs,pngs,gif,mp4 can  be upload"));
        }
    }
});

app.get("/",(req,res)=>{
    res.status(200).json("Working perfectly");
})
app.post("/upload",uploads.single("media"),(req,res)=>{
   res.status(200).json({
    url:req.file.path,    
    public_id:req.file.filename,                                         //`http://localhost:3290/uploads/${req.file.filename}`,
    msg:"File uploaded Successfully"
});
})

app.use((err, req, res, next)=>{
    if(err.code === "LIMIT_FILE_SIZE"){
        res.status(413).send({msg:"File too large to be upload"})
    }
     res.status(500).json({error:err.message});    

})
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})