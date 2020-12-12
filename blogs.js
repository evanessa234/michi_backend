
// var express = require('express');
// var router = express.Router();
// var multer = require('multer');

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname)
//   }
// })

// var upload = multer({ storage: storage })


// /*single file upload*/
// router.post('/upload', upload.single('blogimage'), function(req, res, next) {
//     console.log("hey")
//   var fileinfo = req.file;
//   var title = req.body.title;
//   console.log(title);
//   res.send(fileinfo);
// })

// module.exports = router;
