var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
var mongoDB = 'mongodb://127.0.0.1/uploader';
mongoose.connect(mongoDB);

var imageSchema = new mongoose.Schema({
  email: {
    type: String
    }
});

var Image = module.exports = mongoose.model('files', imageSchema);
var loc = "";
var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, 'uploads/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});
 
var upload = multer({
 storage: storage
});
 
router.get('/', function(req, res, next) {
 res.render('index.ejs');
});

router.post('/', upload.any(), function(req, res, next) {
var myData = new Image(req.body);
var email=req.body.email;
 myData.save()
   .then(item => {
     res.send("Email saved to database");

     let transporter = nodemailer.createTransport({
      "type": "SMTP",
      host: 'smtp.gmail.com',
        port: 465,
        secure: true,
      auth: {
        user: 'XXXXXX@XXXXX.com',              //Your Email ID
        pass: 'XXXXXXXXXX'                     //Your Passward
      },
      tls:{
        rejectUnauthorized:false
      }
      
    });
    
     var mailOptions = {
      from: 'XXXXXX@XXXXX.com',              //Your Email ID
      to: email,                             //Recently Uploaded Email ID
      subject: 'Sending Email using Node.js',
      text: 'That was easy!',
      attachments: [{
        filename: req.files[0].originalname,
        streamSource: fs.createReadStream(req.files[0].path)
    }]
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email has been sent successfully');
      }
    });
   })
   .catch(err => {
     res.status(400).send("Unable to save email to database");
   });

 var path = req.files[0].path;
 var imageName = req.files[0].originalname;
 loc = imageName;
});

router.get('/pre', function(req, res, next) {
  str1= "uploads/";
  var location= path.join(str1,loc);
  Image.findOne({}, {email:1},function(err,data){
    if(err) res.jason(err);
    else res.render("previous.ejs",{user:data.email , url:location})
  });
 });

module.exports = router;

