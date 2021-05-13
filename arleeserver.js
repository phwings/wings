"use strict";
//const server = "localhost";
const server = "10.54.108.37";
const HTTP_PORT = 50080;
const  express  =  require('express');
const  bodyParser  =  require('body-parser');
const  app  =  express();
const httpmetric = require('http');
var path = require("path");
const  multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})


//const tokenList = {}

var db = require("./database.js")

const http = require('http').createServer(app);

http.listen(HTTP_PORT, function(){
    console.log('upload server listening on port '+HTTP_PORT);
});

//router.use(bodyParser.urlencoded({ extended:  false }));
//router.use(bodyParser.json());

app.use(bodyParser.json());

app.get('/arlee',function(req,res){
    res.sendFile(__dirname + '/arlee.html');
});
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/favicon.ico',express.static(__dirname + '/favicon.ico'));

app.get("/api/trivia/get/:difficulty", (req, res, next) => {
    var params = [req.params.difficulty]
    var sql = "select * from trivia where `questions_difficulty` = ?"
    
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
		//console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        })
    });
});
  
app.get("/api/users/:column/:id/:exclude", (req, res, next) => {
    var excludewildcard=req.params.exclude?'%'+req.params.exclude+'%':'';
	var params = [req.params.id+'%',excludewildcard]
    //console.log(params);
    var sql = "select * from users where `users_" + req.params.column + "` LIKE ? AND  `users_" + req.params.column + "` NOT LIKE ? ORDER by `users_" + req.params.column + "` ASC"
    
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
		//console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/arlee/savescore", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        ces: req.body.arlee_CES,
        name: req.body.arlee_CN,
        score: req.body.arlee_score,
    }
    if(req.body.update){
        var sql ='UPDATE arleewings set arlee_score=? WHERE arlee_CES=? AND arlee_CN=?'
    }else{
        var sql ='INSERT INTO arleewings (arlee_score,arlee_CES,arlee_CN) VALUES (?,?,?)'
    }
    var params =[data.score, data.ces, data.name]
	//console.log(sql);
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        
    });
    //console.log(res);
})


app.get("/api/arlee/scores", (req, res, next) => {
	var params = [];
    //console.log(params);
    var sql = "select * from `arleewings` ORDER BY `arlee_score` DESC"
    
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          console.log(err)
          return;
        }
		//console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        })
    });
});
