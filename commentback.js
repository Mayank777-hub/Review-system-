const multer = require("multer");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = 3290;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const storeupload = multer.diskStorage({ 
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        const filename = Date.now() + "-" + file.originalname;
        cb(null,filename);
    }
});
const uploads = multer({
    storeupload,
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
    url:``,
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