"use strict";
//const server = 'localhost';
//var net = require('net');

//const server = '10.54.107.206';const hostname = '10.54.107.206';
const server = '127.0.0.1';const hostname = '127.0.0.1';
//const server = '10.54.108.36';const hostname = '10.54.108.36'; 
//const server = 'ph-wings.herokuapp.com';const hostname = 'ph-wings.herokuapp.com';
var port= process.env.PORT || 50080;
const HTTP_PORT = 80;
var fs = require('fs')
var express  =  require('express');
var app  =  express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);


http.listen(port, function(){
    console.log('socket io listening on port '+port);
});

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

const notifier = require('node-notifier');
 
// Object
const { readFileSync } = require('fs');
const {saveAs} = require('file-saver');
const htmlDocx = require('html-docx-js');
const {performance} = require('perf_hooks');
const csvMetrics=require('csvtojson')
const csvHandling=require('csvtojson')
const csvUtilization=require('csvtojson')
const csvDashboard=require('csvtojson')
const csvQA=require('csvtojson')
const csvSchedule=require('csvtojson')
var afterHeader=false;
var startTime;
var endTime;
var metricCounter=0;
var qaCounter=0;
var handlingCounter=0;
var scheduleCounter=0;
var metricObject;
var qaObject;
var dashboardObject;
var handlingObject;
var scheduleObject;
var utilizationCounter=0;
var dashboardCounter=0;
var utilObject;
var chatConsultQueue=[];
var chatCCTConsultQueue=[];
var chatTrainerQueue=[];
var chatConsultL2=[];
var chatCCTConsult=[];
var chatRmaApprovalL2TM=[];
var chatRmaApprovalQueue=[];
var chatTrainees=[];
var chatTrainees2=[];
var roomConsult=[];
var roomRmaApproval=[];
var roomCCTConsult=[];
var roomTrainer=[];
var upload = multer({ storage: storage })

const puppeteer = require("puppeteer");
const  bodyParser  =  require('body-parser');

const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const  router  =  express.Router();

app.set('view engine', 'pug');

const cookieParser = require('cookie-parser')

//const tokenList = {}

var db = require("./database-mysql.js")
const config = require('./config')
const checker = require('http');

var ioClient = require('socket.io-client');
var fs = require('fs')
var users=[];
var userNames=[];
var userNamesL2=[];
var userNamesL2TM=[];
var serveIndex = require('serve-index');
//router.use(bodyParser.urlencoded({ extended:  false }));
//router.use(bodyParser.json());

app.use('/assets',express.static(__dirname + '/assets'));
app.use('/partials',express.static(__dirname + '/partials'));
app.use('/chatconsults',express.static(__dirname + '/chatconsults'));
app.use('/chatcctconsults',express.static(__dirname + '/chatcctconsults'));
app.use('/favicon.ico',express.static(__dirname + '/favicon.ico'));
app.use('/assets/img/ratls',serveIndex(__dirname + '/assets/img/ratls'));
app.use('/assets/img/arlo_form.jpg',express.static(__dirname + '/assets/img/arlo_form.jpg'));
app.use('/appsim.html',express.static(__dirname + '/appsim.html'));
app.use('/parser',express.static(__dirname + '/parser.html'));
app.use('/jsonviewer',express.static(__dirname + '/jsonviewer.html'));
app.use('/emergency',express.static(__dirname + '/splash.html'));
app.use('/splash.html',express.static(__dirname + '/splash.html'));
app.use('/assets/pdf/FB1001-Specifications.pdf',express.static(__dirname + '/assets/pdf/FB1001-Specifications.pdf'));
app.use('/assets/img/commendations',serveIndex(__dirname + '/assets/img/commendations'));
app.use('/assets/img/top/WE0125',serveIndex(__dirname + '/assets/img/top/WE0125'));
app.use('/assets/img/QAfyi',serveIndex(__dirname + '/assets/img/QAfyi'));
app.use('/assets/pdf',serveIndex(__dirname + '/assets/pdf'));
app.use('/survey',express.static(__dirname + '/survey.html'));
app.use('/surveycnx',express.static(__dirname + '/survey2.html'));
app.use('/surveysample',express.static(__dirname + '/surveytest.html'));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/arlee',function(req,res){
    res.sendFile(__dirname + '/arlee.html');
});
app.get("/api/list/users", (req, res, next) => {
    res.json({users:users})
});

app.get("/api/list/chatusers", (req, res, next) => {
    res.json({userNames:userObject})
});

app.get("/api/list/chatusersL2", (req, res, next) => {
    res.json({userNames:userObjectL2})
});

app.post("/api/callback/add", (req, res, next) => {
	//console.log(req);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        cn: req.body.callback_cn,
        device: req.body.callback_device,
        phone: req.body.callback_phone,
        cxtz: req.body.callback_cxtz,
        loctz: req.body.callback_loctz,
        cxdatetime: req.body.callback_cxdatetime,
        concern: req.body.callback_concern,
        supcall: req.body.callback_supcall,
        owner: req.body.callback_owner,
        status: req.body.callback_status
    }

    var sql ='INSERT INTO callback (`callback_cn`, `callback_device`, `callback_phone`, `callback_cxtz`, `callback_loctz`, `callback_cxdatetime`, `callback_concern`, `callback_supcall`, `callback_owner`, `callback_status`) VALUES (?,?,?,?,?,?,?,?,?,?)'

    var params =[data.cn, data.device, data.phone, data.cxtz, data.loctz, data.cxdatetime, data.concern, data.supcall, data.owner, data.status]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err);
            return;
        }else{
            io.emit('callback new', data);
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        
    });
    
    //console.log(res);
})

app.post("/api/callback/update", (req, res, next) => {
	console.log(req);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.callback_id,
        cn: req.body.callback_cn,
        device: req.body.callback_device,
        phone: req.body.callback_phone,
        cxtz: req.body.callback_cxtz,
        loctz: req.body.callback_loctz,
        cxdatetime: req.body.callback_cxdatetime,
        concern: req.body.callback_concern,
        supcall: req.body.callback_supcall,
        owner: req.body.callback_owner,
        status: req.body.callback_status
    }

        var sql ='UPDATE callback SET `callback_cn`=?, `callback_device`=?, `callback_phone`=?, `callback_cxtz`=?, `callback_loctz`=?, `callback_cxdatetime`=?, `callback_concern`=?, `callback_supcall`=?, `callback_owner`=?, `callback_status`=? WHERE `callback_id`=?'

    var params =[data.cn, data.device, data.phone, data.cxtz, data.loctz, data.cxdatetime, data.concern, data.supcall, data.owner, data.status, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/callback/update/owner", (req, res, next) => {
	console.log(req);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.id,
        owner: req.body.owner,
        status: "Assigned"
    }

    var sql ='UPDATE callback SET `callback_owner`=?, `callback_status`=? WHERE `callback_id`=?'

    var params =[data.owner, data.status, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err);
            return;
        }else{
            Object.keys(userNames).forEach( (element) => {
                if(userNames[element].userCES==data.owner)
                    io.to(`${userNames["A"+userNames[element].userCES].userID}`).emit('callback notify');
            });
        }

        io.emit()
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        
    });
    //console.log(res);
})

app.post("/api/callback/update/status", (req, res, next) => {
	console.log(req);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.id,
        status: req.body.status
    }

        var sql ='UPDATE callback SET `callback_status`=? WHERE `callback_id`=?'

    var params =[data.status, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.get("/api/callback/get", (req, res, next) => {
	var params = [];
    //console.log(params);
    var sql = "select * from `callback`"
    
    db.query(sql, params, (err, rows) => {
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

app.post("/api/arlee/savescore", (req, res, next) => {
	console.log(req);
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
    db.query(sql, params, function (err, result) {
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
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/issues", (req, res, next) => {
    var sql = "select * from issue"
    var params = []
    console.log('in issues');
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
	});
});

app.get("/api/comments", (req, res, next) => {
    var sql = "select * from comments ORDER BY comments_id DESC"
    var params = []
    console.log('in comments');
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
	});
});


app.get("/api/schedules/:datetime", (req, res, next) => {
    var sql = "SELECT  (select users.users_alias from `users` where `users`.users_CES=`schedules`.schedules_CES and schedules_datetime=?) as user, schedules_datetime as schedule, (select users.users_phone from `users` where `users`.users_CES=`schedules`.schedules_CES and schedules_datetime=?) as phone FROM `schedules` WHERE schedules_datetime=?"
    var params = [req.params.datetime,req.params.datetime,req.params.datetime];
    console.log('in comments');
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
	});
});

app.get("/api/tracking/get/:type/:CES", (req, res, next) => {
    if(req.params.type=='L1'){
        var fornotify='0001';
        var sql = "select (select count(*) from consults WHERE consults_L1=? AND consults_fornotify="+fornotify+") as consult, (select count(*) from escalations WHERE escalations_L1=? AND escalations_fornotify="+fornotify+") as escalation, (select count(*) from cctosfeedback WHERE cctosfeedback_L1=? AND cctosfeedback_fornotify="+fornotify+") as cctosfeedback";
        var params = [req.params.CES,req.params.CES,req.params.CES];
    }else if(req.params.type=='L2'){
        var fornotify='0100';
        var sql = "select (select count(*) from consults WHERE consults_L2=? AND consults_fornotify="+fornotify+") as consult, (select count(*) from escalations WHERE escalations_L2=? AND escalations_fornotify="+fornotify+") as escalation, (select count(*) from cctosfeedback WHERE cctosfeedback_L2=? AND cctosfeedback_fornotify="+fornotify+") as cctosfeedback";
        var params = [req.params.CES,req.params.CES,req.params.CES];
    }else if(req.params.type=='TM'){
        var fornotify='0010';
        var sql = "select (select count(*) from consults WHERE consults_fornotify="+fornotify+" AND consults.consults_L1 in (select users.users_CES from users where users.users_team in (select users.users_team from users where users.users_CES="+req.params.CES+"))) as consult, (select count(*) from escalations WHERE escalations_fornotify="+fornotify+" AND escalations.escalations_L1 in (select users.users_CES from users where users.users_team in (select users.users_team from users where users.users_CES="+req.params.CES+"))) as escalation, (select count(*) from cctosfeedback WHERE cctosfeedback_fornotify="+fornotify+" AND cctosfeedback.cctosfeedback_L1 in (select users.users_CES from users where users.users_team in (select users.users_team from users where users.users_CES="+req.params.CES+"))) as cctosfeedback";
    }else if(req.params.type=='L2TM'){
        var fornotify='1000';
        var sql = "select (select count(*) from consults WHERE consults_fornotify="+fornotify+") as consult, (select count(*) from escalations WHERE escalations_fornotify="+fornotify+") as escalation, (select count(*) from cctosfeedback WHERE cctosfeedback_fornotify='0010') as cctosfeedback";
        var params = [];
    }else if(req.params.type=='COL1'){
        var fornotify='0001';
        var sql = "select (select count(*) from consults WHERE consults_L1=? AND consults_fornotify="+fornotify+") as consult, (select count(*) from escalations WHERE escalations_L1=? AND escalations_fornotify="+fornotify+") as escalation, (select count(*) from cctosfeedback WHERE cctosfeedback_L1=? AND cctosfeedback_fornotify="+fornotify+") as cctosfeedback";
        var params = [req.params.CES,req.params.CES,req.params.CES];
    }else if(req.params.type=='COTM'){
        var fornotify='0010';
        var sql = "select (select count(*) from consults WHERE consults_fornotify="+fornotify+" AND consults.consults_L1 in (select users.users_CES from users where users.users_team in (select users.users_team from users where users.users_CES="+req.params.CES+"))) as consult, (select count(*) from escalations WHERE escalations_fornotify="+fornotify+" AND escalations.escalations_L1 in (select users.users_CES from users where users.users_team in (select users.users_team from users where users.users_CES="+req.params.CES+"))) as escalation, (select count(*) from cctosfeedback WHERE cctosfeedback_fornotify='1000') as cctosfeedback";
        var params = [];
    }
    

    db.query(sql, params, (err, rows) => {
        if (err) {
          //res.status(400).json({"error":err.message});
          //return;
        }
        console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        })
    });
});


app.get("/api/questions", (req, res, next) => {
    var sql = "select * from questions ORDER BY questions_id DESC"
    var params = []
    console.log('in questions');
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
	});
});

app.get("/api/notice/get/:userCES", (req, res, next) => {
    var sql = "select * from notices WHERE notice_CES = ?"
    var params = [req.params.userCES]
    console.log('in notices');
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        } else
        res.json({
            "message":"success",
            "data":rows
        })
        
    });
});

app.get("/api/survey/get/:userCES", (req, res, next) => {
    var sql = "select * from surveyresults WHERE surveyresults_CES = ?"
    var params = [req.params.userCES]
    console.log('in surveys');
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        } else
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/surveys/getresults/:survey", (req, res, next) => {
    var sql = "select surveyresults.surveyresults_CES, surveyresults.surveyresults_datetime, surveyresults.surveyresults_answers,(SELECT users.users_LOB FROM users WHERE users.users_CES=surveyresults.surveyresults_CES) AS account from surveyresults WHERE surveyresults_survey = ?"
    var params = [req.params.survey]
    console.log('in surveys');
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        } else
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/engage/add", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        id: req.body.id,
        ces: req.body.ces,
        datetime: req.body.datetime,
        answers: req.body.answers
    }
    console.log(data)
    var sql ='INSERT INTO engageresults (surveyresults_CES, surveyresults_survey, surveyresults_datetime, surveyresults_answers) VALUES (?,?,?,?)'
    var params =[data.ces, data.id, data.datetime, data.answers]
    //console.log(data);
    console.log('insurveysadd');
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err.message)
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.get("/api/engage/get/:userCES", (req, res, next) => {
    var sql = "select * from engageresults WHERE surveyresults_CES = ?"
    var params = [req.params.userCES]
    console.log('in surveys');
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        } else
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/engage/getresults/:survey", (req, res, next) => {
    var sql = "select engageresults.surveyresults_CES, engageresults.surveyresults_datetime, engageresults.surveyresults_answers,(SELECT users.users_LOB FROM users WHERE users.users_CES=engageresults.surveyresults_CES) AS account,(SELECT users.users_type FROM users WHERE users.users_CES=engageresults.surveyresults_CES) AS type from engageresults WHERE surveyresults_survey = ?"
    var params = [req.params.survey]
    console.log('in surveys');
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        } else
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/notice/all", (req, res, next) => {
    var sql = "select notices.notice_id, users.users_CN from notices INNER JOIN users on notices.notice_CES = users.users_CES ORDER BY notices.notice_id ASC"
    var params = [req.params.userCES]
    console.log('in noticesall');
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
	});
});

app.post("/api/notice/add", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        id: req.body.id,
        ces: req.body.ces,
        
    }
    var sql ='INSERT INTO notices (notice_id, notice_CES) VALUES (?,?)'
    var params =[data.id, data.ces]
    //console.log(data);
    console.log('innoticesadd');
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/surveys/add", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        id: req.body.id,
        ces: req.body.ces,
        datetime: req.body.datetime,
        answers: req.body.answers
    }
    console.log(data)
    var sql ='INSERT INTO surveyresults (surveyresults_CES, surveyresults_survey, surveyresults_datetime, surveyresults_answers) VALUES (?,?,?,?)'
    var params =[data.ces, data.id, data.datetime, data.answers]
    //console.log(data);
    console.log('insurveysadd');
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err.message)
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/chatcctconsults/add", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data={
		timestamp:req.body.timestamp,
		room:req.body.room,
		L2:req.body.L2,
        expert:req.body.expert,
        casenumber:req.body.casenumber,
        inquiry:req.body.inquiry
	}
    var sql ='INSERT INTO chatcctconsults (chatcctconsults_timestamp,chatcctconsults_room,chatcctconsults_L2,chatcctconsults_expert,chatcctconsults_casenumber,chatcctconsults_inquiry) VALUES (?,?,(SELECT users.users_CES from users WHERE users.users_CN=?),(SELECT users.users_CES from users WHERE users.users_CN=?),?,?)'
    var params =[data.timestamp, data.room, data.L2, data.expert, data.casenumber, data.inquiry]
    //console.log(data);
    db.query(sql, params, function (err, result) {
        if (err){
            console.log(err.message)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/chatcctconsults/update", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data={
		room:req.body.room,
        endtime:req.body.endtime,
        transcript:req.body.transcript,
	}
    var sql ='UPDATE chatcctconsults SET chatcctconsults_endtime=?, chatcctconsults_transcript=? WHERE chatcctconsults_room=?'
    
    var params =[data.endtime, data.transcript, data.room]
    //console.log(data);
    db.query(sql, params, function (err, result) {
        if (err){
            console.log(err.message)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.get("/api/chatcctconsults/get", (req, res, next) => {
    var sql = "SELECT `chatcctconsults_id`,`chatcctconsults_timestamp`,`chatcctconsults_room`,(SELECT users.users_CN from users WHERE chatcctconsults.chatcctconsults_L2=users.users_CES) as chatcctconsults_L2,(SELECT users.users_CN from users WHERE chatcctconsults.chatcctconsults_expert=users.users_CES) as chatcctconsults_expert,`chatcctconsults_casenumber`,`chatcctconsults_inquiry`,`chatcctconsults_endtime`,`chatcctconsults_transcript` FROM `chatcctconsults` ORDER by chatcctconsults.chatcctconsults_id DESC";
    var params = []
    console.log('in issues');
    db.query(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
	});
});

app.post("/api/chatconsults/add", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data={
		timestamp:req.body.timestamp,
		room:req.body.room,
		L2:req.body.L2,
        expert:req.body.expert,
        casenumber:req.body.casenumber,
        inquiry:req.body.inquiry
	}
    var sql ='INSERT INTO chatconsults (chatconsults_timestamp,chatconsults_room,chatconsults_L2,chatconsults_expert,chatconsults_casenumber,chatconsults_inquiry) VALUES (?,?,(SELECT users.users_CES from users WHERE users.users_CN=?),(SELECT users.users_CES from users WHERE users.users_CN=?),?,?)'
    var params =[data.timestamp, data.room, data.L2, data.expert, data.casenumber, data.inquiry]
    //console.log(data);
    db.query(sql, params, function (err, result) {
        if (err){
            console.log(err.message)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/chatconsults/update", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data={
		room:req.body.room,
        endtime:req.body.endtime,
        transcript:req.body.transcript
	}
    var sql ='UPDATE chatconsults SET chatconsults_endtime=?, chatconsults_transcript=? WHERE chatconsults_room=?'
    
    var params =[data.endtime, data.transcript, data.room]
    //console.log(data);
    db.query(sql, params, function (err, result) {
        if (err){
            console.log(err.message)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.get("/api/chatconsults/get", (req, res, next) => {
    var sql = "SELECT `chatconsults_id`,`chatconsults_timestamp`,`chatconsults_room`,(SELECT users.users_CN from users WHERE chatconsults.chatconsults_L2=users.users_CES) as chatconsults_L2,(SELECT users.users_CN from users WHERE chatconsults.chatconsults_expert=users.users_CES) as chatconsults_expert,`chatconsults_casenumber`,`chatconsults_inquiry`,`chatconsults_endtime`,`chatconsults_transcript` FROM `chatconsults` ORDER by chatconsults.chatconsults_id DESC";
    var params = []
    console.log('in issues');
    db.query(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
	});
});

app.get("/api/callhandler/:issue_number", (req, res, next) => {
    var sql = "select * from issue where issue_number = ?"
    var params = [req.params.issue_number]
    console.log('in issues');
    db.query(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
	});
});

app.get("/api/interventions/get", (req, res, next) => {
    var sql = "select * from interventions"
    var params = []
    console.log('in interventions');
    db.query(sql, params, (err, rows) => {
        if (err) {
          //res.status(400).json({"error":err.message});
          //return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.post("/api/interventions/add", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        interventions_coach:req.body.interventions_coach,
        interventions_attendees:req.body.interventions_attendees,
        interventions_topic:req.body.interventions_topic,
        interventions_devices:req.body.interventions_devices
    }
    //console.log(data);
    var sql ='INSERT INTO interventions (interventions_coach,interventions_attendees,interventions_topic,interventions_devices) VALUES (?,?,?,?)'
    var params =[data.interventions_coach, data.interventions_attendees, data.interventions_topic, data.interventions_devices]
    //console.log(sql);
    console.log('in interventions add');
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

app.get("/api/endorser/get/:week", (req, res, next) => {
    var sql = "select * from endorsers where endorsers_week = ?"
    var params = [req.params.week]
    console.log('in endorser');
    db.query(sql, params, (err, rows) => {
        if (err) {
          //res.status(400).json({"error":err.message});
          //return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/endorser/add", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        week:req.body.week,
        endorsers:req.body.endorser,
    }
    //console.log(data);
    var sql ='INSERT INTO endorsers (endorsers_week,endorsers_data) VALUES (?,?)'
    var params =[data.week, JSON.stringify(data.endorsers)]
    //console.log(sql);
    console.log('in endorsersadd');
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

app.post("/api/endorser/update", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        week:req.body.week,
        endorsers:req.body.endorser,
    }
    //console.log(data);
    var sql ='UPDATE endorsers SET endorsers_data=? WHERE endorsers_week=?'
    var params =[JSON.stringify(data.endorsers),data.week]
    //console.log(sql);
    console.log('in endorser update');
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

//

app.post("/api/recorduser", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        name: req.body.name,
        ip: req.connection.remoteAddress
    }
    var sql ='INSERT INTO `usage` (usage_timestamp,usage_name, usage_ip) VALUES (?,?,?)'
    var params =[Date.now(), data.name, data.ip]
    //console.log(sql);
    console.log('in recorduser');
    
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log(err);
            return;
        }else
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        
    });
})

app.post("/logout", (req, res, next) => {
	//console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        ces: req.body.ces,
        time: Date.now(),
        mode: 1
    }
    var sql ='INSERT INTO login (login_user,login_time,login_mode) VALUES (?,?,?)'
    var params =[data.ces, data.time, data.mode]
    //console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            console.log(err);
            return;
        }          
    });
})

// =================== templates

app.post("/api/templates/add", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        CES:req.body.templates_CES,
		title:req.body.templates_title,
		content:req.body.templates_content
    }
    
    //console.log(data);
    var sql ='INSERT INTO templates (templates_CES,templates_title,templates_content) VALUES (?,?,?)'
    var params =[data.CES,data.title,data.content];
    //console.log(sql);
    console.log('in templates add');
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            //console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/templates/edit", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        id:req.body.templates_id,
        CES:req.body.templates_CES,
        title:req.body.templates_title,
        content:req.body.templates_content,
    }
    
    //console.log(data);
    var sql ='UPDATE templates set templates_title=?, templates_content=? WHERE templates_id=? AND templates_CES=?'
    var params =[data.title,data.content,data.id,data.CES];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
}) 

app.post("/api/templates/delete", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        id:req.body.templates_id,
        CES:req.body.templates_CES,
    }
    
    //console.log(data);
    var sql ='DELETE from templates where templates_id=? AND templates_CES=?'
    var params =[data.id,data.CES];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
}) 

app.get("/api/templates/get/:CES", (req, res, next) => {
    if(req.params.CES!='*'){
        var sql = "select * from templates WHERE templates_CES=?";
        var params = [req.params.CES];
    }else{
        var sql = "select * from templates order by templates_CES";
        var params = [];
    }

    db.query(sql, params, (err, rows) => {
        if (err) {
          //res.status(400).json({"error":err.message});
          //return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

// =================== consults

app.post("/api/consults/add", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        consults_L1:req.body.L1_list_consult_source,
		consults_L2:req.body.L2_list_consult,
		consult_casenumber:req.body.consult_casenumber,
		consult_product:req.body.consult_product,
        consult_duration:req.body.consult_duration,
        consult_durationreason:req.body.consult_durationreason,
        consult_callhandler:req.body.consult_callhandler,
		consult_invalidreason:req.body.consult_invalidreason,
		consult_opportunity:req.body.consult_opportunity,
		consult_feedback:req.body.consult_feedback,
		consult_commitment:req.body.consult_commitment,
        consult_timestamp:req.body.consult_timestamp,
        consult_approved:0,
        consult_fornotify:'1000'
    }
    if(req.body.consult_opportunity.split('=-=')[0]=='None'){
        data.consult_fornotify='0000';
        data.consult_approved=3;
    }
    
    //console.log(data);
    var sql ='INSERT INTO consults (consults_L1,consults_L2,consults_casenumber,consults_product,consults_duration,consults_durationreason,consults_followedcallhandler,consults_reason,consults_opportunity,consults_feedback,consults_commitment,consults_timestamp,consults_approved,consults_remarks,consults_fornotify) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    var params =[data.consults_L1,data.consults_L2,data.consult_casenumber,data.consult_product,data.consult_duration,data.consult_durationreason,data.consult_callhandler,data.consult_invalidreason,data.consult_opportunity,data.consult_feedback,data.consult_commitment,data.consult_timestamp,data.consult_approved,"",data.consult_fornotify];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
            
        })
        //console.log(users);
        //console.log(res.statusMessage);
        var L2TM = users.filter(function(element,index,array){
            try{
                return element.user["users_type"] == "Level 2 TM";
            }catch(error){

            }
        });
        console.log("L2TM:");
        //console.log(L2TM);

        L2TM.forEach(function(element){
            //console.log("in foreach");
            //console.log(element);
            io.to(`${element.userID}`).emit('new consult');
        });
        //console.log(L2TM);
        //console.log(users.find(o => o.user["users_type"] == "Level 2 TM"));
    });
    
})

app.post("/api/consults/update", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    console.log(req.body);
    var data = {
        consults_id:req.body.consult_id,
        consults_L1:req.body.L1_list_consult_source,
		consults_L2:req.body.L2_list_consult,
		consult_casenumber:req.body.consult_casenumber,
		consult_product:req.body.consult_product,
        consult_duration:req.body.consult_duration,
        consult_durationreason:req.body.consult_durationreason,
		consult_invalidreason:req.body.consult_invalidreason,
		consult_opportunity:req.body.consult_opportunity,
		consult_feedback:req.body.consult_feedback,
		consult_commitment:req.body.consult_commitment,
        consult_timestamp:req.body.consult_timestamp,
        consult_approved:0,
        consult_fornotify:'1000'
    }
    
    //console.log(data);
    var sql ='UPDATE consults SET consults_L1 = ?, consults_L2 = ?, consults_casenumber = ?, consults_product= ?, consults_duration = ?, consults_reason = ?, consults_opportunity = ?, consults_feedback = ?, consults_commitment = ?, consults_timestamp = ?, consults_approved = ?, consults_fornotify = ? WHERE consults_id = ?'
    var params =[data.consults_L1,data.consults_L2,data.consult_casenumber,data.consult_product,data.consult_duration,data.consult_invalidreason,data.consult_opportunity,data.consult_feedback,data.consult_commitment,data.consult_timestamp, data.consult_approved, data.consult_fornotify, data.consults_id];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

app.post("/api/newconsults/add", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    var data = {
        consults_L1:req.body.L1_list_consult_source,
		consults_L2:req.body.L2_list_consult,
        consults_type:"L2",
		consult_casenumber:req.body.consult_casenumber,
		consult_product:req.body.consult_product,
        consult_duration:req.body.consult_duration,
        consult_durationreason:req.body.consult_durationreason,
        consult_callhandler:req.body.consult_callhandler,
		consult_invalidreason:req.body.consult_invalidreason,
		consult_opportunity:req.body.consult_opportunity,
        consult_timestamp:date,
        consult_summary:req.body.consult_summary,
        consult_source:"VOICE",
        consult_updatedby:"consultant"
    }
    
    console.log(data);
    var sql ='INSERT INTO consult_log (consults_L1,consults_L2,consults_casenumber,consults_product,consults_duration,consults_durationreason,consults_followedcallhandler,consults_reason,consults_opportunity,consults_source,consults_timestamp,consults_summary,consults_updatedby) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
    var params =[data.consults_L1,data.consults_L2,data.consult_casenumber,data.consult_product,data.consult_duration,data.consult_durationreason,data.consult_callhandler,data.consult_invalidreason,data.consult_opportunity,data.consult_source,data.consult_timestamp,data.consult_summary,data.consult_updatedby];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
            
        })
        //console.log(users);
        //console.log(res.statusMessage);
        var L2TM = users.filter(function(element,index,array){
            try{
                return element.user["users_type"] == "Level 2 TM";
            }catch(error){

            }
        });
        console.log("L2TM:");
        //console.log(L2TM);

        L2TM.forEach(function(element){
            //console.log("in foreach");
            //console.log(element);
            io.to(`${element.userID}`).emit('new consult');
        });
        //console.log(L2TM);
        //console.log(users.find(o => o.user["users_type"] == "Level 2 TM"));
    });
    
})


app.get("/api/newconsults/get", (req, res, next) => {
    var sql = "SELECT consults_id,consults_type,consults_L1,consults_L2,consults_timestamp,consults_duration,consults_durationreason,consults_casenumber,consults_source,(SELECT device_name FROM devices WHERE devices.device_model=consult_log.consults_product) AS product, consults_reason, consults_opportunity, (SELECT users_center FROM users WHERE users.users_CES=consult_log.consults_L1) AS center, (SELECT users_CN FROM users WHERE users.users_CES=consult_log.consults_L1) AS L1, (SELECT users_CN FROM users WHERE users.users_CES=consult_log.consults_L2) AS L2, (SELECT users_CN FROM users WHERE users.users_CES=(SELECT team_manager from teams WHERE teams.team_id=(SELECT users_team FROM users WHERE users.users_CES=consult_log.consults_L1))) AS TM, (SELECT team_name FROM teams where team_id=(SELECT users_team FROM users WHERE users.users_CES=consult_log.consults_L1)) AS L1Team FROM consult_log"
    var params = []
    db.query(sql, params, (err, rows) => {
        console.log(rows);
        if (err) {
            console.log(err);
          //res.status(400).json({"error":err.message});
          //return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/consults/get", (req, res, next) => {
    var sql = "SELECT consults_id,consults_L1,consults_L2,consults_timestamp,consults_duration,consults_durationreason,consults_casenumber,(SELECT device_name FROM devices WHERE devices.device_model=consults.consults_product) AS product, consults_reason, consults_opportunity, consults_feedback,consults_commitment, consults_approved, consults_remarks, consults_fornotify, (SELECT users_CN FROM users WHERE users.users_CES=consults.consults_L1) AS L1, (SELECT users_CN FROM users WHERE users.users_CES=consults.consults_L2) AS L2, (SELECT users_CN FROM users WHERE users.users_CES=(SELECT team_manager from teams WHERE teams.team_id=(SELECT users_team FROM users WHERE users.users_CES=consults.consults_L1))) AS TM, (SELECT users_team FROM users WHERE users.users_CES=consults.consults_L1) AS L1Team FROM consults"
    var params = []
    db.query(sql, params, (err, rows) => {
        console.log(rows);
        if (err) {
            console.log(err);
          //res.status(400).json({"error":err.message});
          //return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/consults/delete", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        consults_id:req.body.consult_id,
    }
    
    console.log(data);
    var sql ='DELETE FROM `consults` WHERE `consults_id`=?'
    var params =[data.consults_id];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

app.get("/api/consults/getSingle/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from consults where `consults_id` = ?"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
		//console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        })
    })
});

app.post("/api/consults/approve", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.consult_id,
        fornotify: (req.body.approve<1?'0100':'0010'),
        approve: req.body.approve
    }
    var sql ='UPDATE consults set consults_approved = ?, consults_fornotify = ? WHERE consults_id=?'
    var params =[data.approve, data.fornotify, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/consults/updateRemarks", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.consult_id,
        remarks: req.body.consult_remarks,
        source: req.body.consult_remarks_source
    }
    //console.log(data.source);
    if(data.source=='L2'){
        var sql ='UPDATE consults set consults_remarks=? WHERE consults_id=?'
    } else {
        var sql ='UPDATE consults set consults_remarks=?, consults_approved="0", consults_fornotify="0100" WHERE consults_id=?'
    }
    //console.log(sql);
    var params =[data.remarks, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/consults/updateNotify", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.consult_id,
        fornotify: req.body.consult_fornotify
    }
    var sql ='UPDATE consults set consults_fornotify=? WHERE consults_id=?'
    var params =[data.fornotify, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/consults/updateCommitment", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.consult_id,
        commitment: req.body.consult_commitment
    }
    var sql ='UPDATE consults set consults_commitment=? WHERE consults_id=?'
    var params =[data.commitment, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/consults/updateFeedback", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.consult_id,
        feedback: req.body.consult_feedback
    }
    var sql ='UPDATE consults set consults_feedback=? WHERE consults_id=?'
    var params =[data.feedback, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

// =================== cct os feedback

app.post("/api/cctosfeedback/add", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        cctosfeedback_L1:req.body.L1_list_cctosfeedback_source,
		cctosfeedback_L2:req.body.L2_list_cctosfeedback,
		cctosfeedback_casenumber:req.body.cctosfeedback_casenumber,
		cctosfeedback_product:req.body.cctosfeedback_product,
		cctosfeedback_duration:req.body.cctosfeedback_duration,
		cctosfeedback_invalidreason:req.body.cctosfeedback_invalidreason,
		cctosfeedback_opportunity:req.body.cctosfeedback_opportunity,
		cctosfeedback_feedback:req.body.cctosfeedback_feedback,
		cctosfeedback_commitment:req.body.cctosfeedback_commitment,
        cctosfeedback_timestamp:req.body.cctosfeedback_timestamp,
        cctosfeedback_approved:0,
        cctosfeedback_fornotify:'1000'
    }
    
    //console.log(data);
    var sql ='INSERT INTO cctosfeedback (cctosfeedback_L1,cctosfeedback_L2,cctosfeedback_casenumber,cctosfeedback_product,cctosfeedback_duration,cctosfeedback_reason,cctosfeedback_opportunity,cctosfeedback_feedback,cctosfeedback_commitment,cctosfeedback_timestamp,cctosfeedback_approved,cctosfeedback_remarks,cctosfeedback_fornotify) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
    var params =[data.cctosfeedback_L1,data.cctosfeedback_L2,data.cctosfeedback_casenumber,data.cctosfeedback_product,data.cctosfeedback_duration,data.cctosfeedback_invalidreason,data.cctosfeedback_opportunity,data.cctosfeedback_feedback,data.cctosfeedback_commitment,data.cctosfeedback_timestamp,data.cctosfeedback_approved,"",data.cctosfeedback_fornotify];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
            
        })
        //console.log(users);
        //console.log(res.statusMessage);
        var L2TM = users.filter(function(element,index,array){
            try{
                return element.user["users_type"] == "Level 2 TM";
            }catch(error){

            }
        });
        console.log("L2TM:");
        //console.log(L2TM);

        L2TM.forEach(function(element){
            //console.log("in foreach");
            //console.log(element);
            io.to(`${element.userID}`).emit('new cctosfeedback');
        });
        //console.log(L2TM);
        //console.log(users.find(o => o.user["users_type"] == "Level 2 TM"));
    });
    
})

app.post("/api/cctosfeedback/update", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    console.log(req.body);
    var data = {
        cctosfeedback_id:req.body.cctosfeedback_id,
        cctosfeedback_L1:req.body.L1_list_cctosfeedback_source,
		cctosfeedback_L2:req.body.L2_list_cctosfeedback,
		cctosfeedback_casenumber:req.body.cctosfeedback_casenumber,
		cctosfeedback_product:req.body.cctosfeedback_product,
		cctosfeedback_duration:req.body.cctosfeedback_duration,
		cctosfeedback_invalidreason:req.body.cctosfeedback_invalidreason,
		cctosfeedback_opportunity:req.body.cctosfeedback_opportunity,
		cctosfeedback_feedback:req.body.cctosfeedback_feedback,
		cctosfeedback_commitment:req.body.cctosfeedback_commitment,
        cctosfeedback_timestamp:req.body.cctosfeedback_timestamp,
        cctosfeedback_approved:0,
        cctosfeedback_fornotify:'1000'
    }
    
    //console.log(data);
    var sql ='UPDATE cctosfeedback SET cctosfeedback_L1 = ?, cctosfeedback_L2 = ?, cctosfeedback_casenumber = ?, cctosfeedback_product= ?, cctosfeedback_duration = ?, cctosfeedback_reason = ?, cctosfeedback_opportunity = ?, cctosfeedback_feedback = ?, cctosfeedback_commitment = ?, cctosfeedback_timestamp = ?, cctosfeedback_approved = ?, cctosfeedback_fornotify = ? WHERE cctosfeedback_id = ?'
    var params =[data.cctosfeedback_L1,data.cctosfeedback_L2,data.cctosfeedback_casenumber,data.cctosfeedback_product,data.cctosfeedback_duration,data.cctosfeedback_invalidreason,data.cctosfeedback_opportunity,data.cctosfeedback_feedback,data.cctosfeedback_commitment,data.cctosfeedback_timestamp, data.cctosfeedback_approved, data.cctosfeedback_fornotify, data.cctosfeedback_id];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})


app.get("/api/cctosfeedback/get", (req, res, next) => {
    var sql = "SELECT cctosfeedback_id,cctosfeedback_L1,cctosfeedback_L2,cctosfeedback_timestamp,cctosfeedback_duration,cctosfeedback_casenumber,(SELECT device_name FROM devices WHERE devices.device_model=cctosfeedback.cctosfeedback_product) AS product, cctosfeedback_reason, cctosfeedback_opportunity, cctosfeedback_feedback,cctosfeedback_commitment, cctosfeedback_approved, cctosfeedback_remarks, cctosfeedback_fornotify, (SELECT users_CN FROM users WHERE users.users_CES=cctosfeedback.cctosfeedback_L1) AS L1, (SELECT users_CN FROM users WHERE users.users_CES=cctosfeedback.cctosfeedback_L2) AS L2, (SELECT users_CN FROM users WHERE users.users_CES=(SELECT team_manager from teams WHERE teams.team_id=(SELECT users_team FROM users WHERE users.users_CES=cctosfeedback.cctosfeedback_L1))) AS TM, (SELECT users_team FROM users WHERE users.users_CES=cctosfeedback.cctosfeedback_L1) AS L1Team FROM cctosfeedback"
    var params = []
    db.query(sql, params, (err, rows) => {
        if (err) {
          //res.status(400).json({"error":err.message});
          //return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/cctosfeedback/delete", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        cctosfeedback_id:req.body.cctosfeedback_id,
    }
    
    console.log(data);
    var sql ='DELETE FROM `cctosfeedback` WHERE `cctosfeedback_id`=?'
    var params =[data.cctosfeedback_id];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

app.get("/api/cctosfeedback/getSingle/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from cctosfeedback where `cctosfeedback_id` = ?"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
		//console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        })
    })
});

app.post("/api/cctosfeedback/approve", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.cctosfeedback_id,
        fornotify: (req.body.approve<1?'0100':'0010'),
        approve: req.body.approve
    }
    var sql ='UPDATE cctosfeedback set cctosfeedback_approved = ?, cctosfeedback_fornotify = ? WHERE cctosfeedback_id=?'
    var params =[data.approve, data.fornotify, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/cctosfeedback/updateRemarks", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.cctosfeedback_id,
        remarks: req.body.cctosfeedback_remarks,
        source: req.body.cctosfeedback_remarks_source
    }
    //console.log(data.source);
    if(data.source=='L2'){
        var sql ='UPDATE cctosfeedback set cctosfeedback_remarks=? WHERE cctosfeedback_id=?'
    } else {
        var sql ='UPDATE cctosfeedback set cctosfeedback_remarks=?, cctosfeedback_approved="0", cctosfeedback_fornotify="0100" WHERE cctosfeedback_id=?'
    }
    //console.log(sql);
    var params =[data.remarks, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/cctosfeedback/updateNotify", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.cctosfeedback_id,
        fornotify: req.body.cctosfeedback_fornotify
    }
    var sql ='UPDATE cctosfeedback set cctosfeedback_fornotify=? WHERE cctosfeedback_id=?'
    var params =[data.fornotify, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/cctosfeedback/updateCommitment", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.cctosfeedback_id,
        commitment: req.body.cctosfeedback_commitment
    }
    var sql ='UPDATE cctosfeedback set cctosfeedback_commitment=? WHERE cctosfeedback_id=?'
    var params =[data.commitment, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/cctosfeedback/updateFeedback", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.cctosfeedback_id,
        feedback: req.body.cctosfeedback_feedback
    }
    var sql ='UPDATE cctosfeedback set cctosfeedback_feedback=? WHERE cctosfeedback_id=?'
    var params =[data.feedback, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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



// =================== escalations

app.post("/api/escalations/add", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        escalations_L1:req.body.L1_list_escalation_source,
		escalations_L2:req.body.L2_list_escalation,
		escalation_casenumber:req.body.escalation_casenumber,
		escalation_product:req.body.escalation_product,
		escalation_invalid:req.body.escalation_invalid,
		escalation_invalidreason:req.body.escalation_invalidreason,
		escalation_opportunity:req.body.escalation_opportunity,
		escalation_feedback:req.body.escalation_feedback,
		escalation_commitment:req.body.escalation_commitment,
        escalation_timestamp:req.body.escalation_timestamp,
        escalation_approved:0,
        escalation_fornotify:'1000'
    }
    
    //console.log(data);
    var sql ='INSERT INTO escalations (escalations_L1,escalations_L2,escalations_casenumber,escalations_product,escalations_invalid,escalations_reason,escalations_opportunity,escalations_feedback,escalations_commitment,escalations_timestamp,escalations_approved,escalations_remarks,escalations_fornotify) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
    var params =[data.escalations_L1,data.escalations_L2,data.escalation_casenumber,data.escalation_product,data.escalation_invalid,data.escalation_invalidreason,data.escalation_opportunity,data.escalation_feedback,data.escalation_commitment,data.escalation_timestamp,data.escalation_approved,"",data.escalation_fornotify];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
            
        })
        //console.log(users);
        //console.log(res.statusMessage);
        var L2TM = users.filter(function(element,index,array){
            try{
                return element.user["users_type"] == "Level 2 TM";
            }catch(error){

            }
        });
        console.log("L2TM:");
        //console.log(L2TM);

        L2TM.forEach(function(element){
            //console.log("in foreach");
            //console.log(element);
            io.to(`${element.userID}`).emit('new escalation');
        });
        //console.log(L2TM);
        //console.log(users.find(o => o.user["users_type"] == "Level 2 TM"));
    });
    
}) 

app.post("/api/escalations/update", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    console.log(req.body);
    var data = {
        escalations_id:req.body.escalation_id,
        escalations_L1:req.body.L1_list_escalation_source,
		escalations_L2:req.body.L2_list_escalation,
		escalation_casenumber:req.body.escalation_casenumber,
		escalation_product:req.body.escalation_product,
		escalation_invalid:req.body.escalation_invalid,
		escalation_invalidreason:req.body.escalation_invalidreason,
		escalation_opportunity:req.body.escalation_opportunity,
		escalation_feedback:req.body.escalation_feedback,
		escalation_commitment:req.body.escalation_commitment,
        escalation_timestamp:req.body.escalation_timestamp,
        escalation_approved:0,
        escalation_fornotify:'1000'
    }
    
    //console.log(data);
    var sql ='UPDATE escalations SET escalations_L1 = ?, escalations_L2 = ?, escalations_casenumber = ?, escalations_product= ?, escalations_invalid = ?, escalations_reason = ?, escalations_opportunity = ?, escalations_feedback = ?, escalations_commitment = ?, escalations_timestamp = ?, escalations_approved = ?, escalations_fornotify = ? WHERE escalations_id = ?'
    var params =[data.escalations_L1,data.escalations_L2,data.escalation_casenumber,data.escalation_product,data.escalation_invalid,data.escalation_invalidreason,data.escalation_opportunity,data.escalation_feedback,data.escalation_commitment,data.escalation_timestamp, data.escalation_approved, data.escalation_fornotify, data.escalations_id];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

app.post("/api/escalations/delete", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //console.log(req.body);
    var data = {
        escalations_id:req.body.escalation_id,
    }
    
    //console.log(data);
    var sql ='DELETE FROM `escalations` WHERE `escalations_id`=?'
    var params =[data.escalations_id];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            //res.status(400).json({"error": err.message})
            console.log(err.message);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
        //console.log(res.statusMessage);
    });
})

app.get("/api/escalations/get", (req, res, next) => {
    var sql = "SELECT escalations_id,escalations_L1,escalations_L2,escalations_timestamp,escalations_casenumber, (SELECT device_name FROM devices WHERE devices.device_model=escalations.escalations_product) AS product, escalations_reason, escalations_opportunity, escalations_feedback, escalations_commitment, escalations_approved, escalations_remarks, escalations_fornotify, (SELECT users_CN FROM users WHERE users.users_CES=escalations.escalations_L1) AS L1, (SELECT users_CN FROM users WHERE users.users_CES=escalations.escalations_L2) AS L2, (SELECT users_CN FROM users WHERE users.users_CES=(SELECT team_manager from teams WHERE teams.team_id=(SELECT users_team FROM users WHERE users.users_CES=escalations.escalations_L1))) AS TM, (SELECT users_team FROM users WHERE users.users_CES=escalations.escalations_L1) AS L1Team FROM escalations";
    var params = []
    db.query(sql, params, (err, rows) => {
        if (err) {
          //res.status(400).json({"error":err.message});
          //return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/escalations/getSingle/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from escalations where `escalations_id` = ?"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
		//console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        })
    })
});

app.post("/api/escalations/approve", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.escalation_id,
        fornotify: (req.body.approve<1?'0100':'0010'),
        approve: req.body.approve
    }
    var sql ='UPDATE escalations set escalations_approved = ?, escalations_fornotify = ? WHERE escalations_id=?'
    var params =[data.approve, data.fornotify, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/escalations/updateRemarks", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.escalation_id,
        remarks: req.body.escalation_remarks,
        source: req.body.escalation_remarks_source
    }
    //console.log(data.source);
    if(data.source=='L2'){
        var sql ='UPDATE escalations set escalations_remarks=? WHERE escalations_id=?'
    } else {
        var sql ='UPDATE escalations set escalations_remarks=?, escalations_approved="0", escalations_fornotify="0100" WHERE escalations_id=?'
    }
    //console.log(sql);
    var params =[data.remarks, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/escalations/updateNotify", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.escalation_id,
        fornotify: req.body.escalation_fornotify
    }
    var sql ='UPDATE escalations set escalations_fornotify=? WHERE escalations_id=?'
    var params =[data.fornotify, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/escalations/updateCommitment", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.escalation_id,
        commitment: req.body.escalation_commitment
    }
    var sql ='UPDATE escalations set escalations_commitment=? WHERE escalations_id=?'
    var params =[data.commitment, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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

app.post("/api/escalations/updateFeedback", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
	//console.log(req.connection.remoteAddress);
    var data = {
        id: req.body.escalation_id,
        feedback: req.body.escalation_feedback
    }
    var sql ='UPDATE escalations set escalations_feedback=? WHERE escalations_id=?'
    var params =[data.feedback, data.id]
	//console.log(sql);
    db.query(sql, params, function (err, result) {
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




app.get("/api/devices/:column/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from devices where `device_" + req.params.column + "` = ?"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/devices", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from devices"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/tagging", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from tagging"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/users/birthday/get", (req, res, next) => {
    var params = [];
    var sql = "select `users`.`users_CN`,`users`.`users_bday` from `users`"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/users/CES/:username", (req, res, next) => {
	var params = [req.params.username]
    //console.log(params);
    var sql = "select users_CES from users where `users_qa`=?"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/QA/CES/:CES", (req, res, next) => {
	var params = [req.params.CES]
    //console.log(params);
    var sql = "select * from qa where `qa_CES`=?"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/QA", (req, res, next) => {
	var params = []
    //console.log(params);
    var sql = "select * from qa"
    
    db.query(sql, params, (err, rows) => {
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
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/users/getteam/:id", (req, res, next) => {

	var params = [req.params.id]
    //console.log(params);
    var sql = "select * from users where users_team=?";
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/verify/:CES/:MN", (req, res, next) => {
	var params = [req.params.CES,req.params.MN]
    var sql = "select * from users where users_CES = ? and users_MN = ?"
    
    db.query(sql, params, (err, rows) => {
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

app.post("/api/update/user", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        ces:req.body.ces,
        alias: req.body.alias,
        password: req.body.password,
        hash:''
    }
    
    data.hash=bcrypt.hashSync(data.password, 10);

    var sql ='update users set users_alias=?,users_password=? where users_CES = ?'
    var params =[data.alias, data.hash, data.ces]
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
        })
    });
})

// =================== metrics
app.get("/api/metric/get", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from metrics ORDER BY `metric-Response-Completiondate` ASC"
    
    db.query(sql, params, (err, rows) => {
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


app.get("/api/metric/:column/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from metrics where `metric-" + req.params.column + "` = ? ORDER BY `metric-Response-Completiondate` ASC"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/metric/names", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select DISTINCT `metric-Agent_Name`,`metric-CES` from metrics"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/metric/teams", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select *  from teams"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/metric/metricdate", (req, res, next) => {
	var params = [req.params.id]
    var sql = "SELECT `metric-Response-Completiondate` FROM metrics ORDER BY `metric-Response-Completiondate` DESC LIMIT 1"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows 
        })
    });
});

// =================== updates

app.get("/api/viewupdates", (req, res, next) => {
    var sql = "select * from updates order by updates_id DESC"
    var params = []
    db.query(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/newupdate/", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var timestamp=new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
    var data = {
        name: req.body.name,
        title: req.body.title,
        update: req.body.update,
        timestamp: timestamp
    }
    var sql ='INSERT INTO updates (updates_expert, updates_title, updates_content, updates_timestamp) VALUES (?,?,?,?)'
    var params =[data.name, data.title, data.update, data.timestamp];
	//console.log(sql);
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// =================== comments

app.post("/api/newcomment/", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        comment: req.body.comment,
        
    }
    var sql ='INSERT INTO comments (comments_name, comments_comment) VALUES (?,?)'
    var params =[data.name, data.comment]
	console.log(data);
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// =================== helpdesk

app.post("/api/helpdesk/ticket", (req, res, next) => {
	console.log(req.body);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        ces: req.body.ces,
        station: req.body.station,
        issue: req.body.issue,
        
    }
    var sql ='INSERT INTO tickets (tickets_CES, tickets_station, tickets_issue) VALUES (?,?,?)'
    var params =[data.ces, data.station, data.issue]
	console.log(data);
    db.query(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.get("/api/helpdesk/get", (req, res, next) => {
	var params = [];
    var sql = "select * from tickets ORDER BY `tickets_id` ASC"
    
    db.query(sql, params, (err, rows) => {
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

// =================== ACD

app.get("/api/handling/get/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from handling where `handling_CES` = ? ORDER BY `handling_date` ASC"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/handling", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from handling ORDER BY `handling_date` ASC"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/handling/team/:team", (req, res, next) => {
	var params = [req.params.team]
    var sql = "select `handling`.* from handling INNER JOIN users WHERE (`users`.`users_Team` = ?) AND (`users`.`users_CES` = `handling`.`handling_CES`) ORDER BY `handling`.`handling_date` ASC"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            //console.log(err);
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

// =================== dashboard

app.get("/api/dashboard/team/:team", (req, res, next) => {
	var params = [req.params.team]
    var sql = "select `dboard`.* from dboard INNER JOIN users WHERE (`users`.`users_Team` = ?) AND (`users`.`users_CES` = `dboard`.`dboard_CES`) ORDER BY `dboard`.`dboard_date` ASC"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            //console.log(err);
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

app.get("/api/dashboard/get/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from dboard where `dboard_CES` = ? ORDER BY `dboard_date` ASC"
    
    db.query(sql, params, (err, rows) => {
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

// =================== utilization

app.get("/api/utilization/team/:team", (req, res, next) => {
	var params = [req.params.team]
    var sql = "select `utilization`.* from utilization INNER JOIN users WHERE (`users`.`users_Team` = ?) AND (`users`.`users_CES` = `utilization`.`util_CES`) ORDER BY `utilization`.`util_date` ASC"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            //console.log(err);
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

app.get("/api/utilization/get/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from utilization where `util_CES` = ? ORDER BY `util_date` ASC"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/utilization", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from utilization ORDER BY `util_date` ASC"
    
    db.query(sql, params, (err, rows) => {
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

app.get("/api/userslogged", (req, res, next) => {
    res.json({
        "message":"success",
        "data":users
    })
});

// =================== trivia

app.get("/api/trivia/get/:difficulty", (req, res, next) => {
    var params = [req.params.difficulty]
    var sql = "select * from trivia where `questions_difficulty` = ?"
    
    db.query(sql, params, (err, rows) => {
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

// =================== SMEEOS

app.get("/api/loyalty/codesleft", (req, res, next) => {
    var tempLoyalty;
    var params = ""
    var sql = "select * from loyalty where `loyalty_email` = '' AND `loyalty_expiry` > CURDATE()"
    var loyalty_data={
        OOW:0,
        IW:0
    }
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err)
            res.status(400).json({"error":err.message});
            return;
        }

        if(rows){
            var loyalty_list=JSON.parse(JSON.stringify(rows));
            console.log(loyalty_list);
            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_OOW==0);
            loyalty_data.OOW=tempLoyalty.length;
            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_OOW==1);
            loyalty_data.IW=tempLoyalty.length;
        }
		//console.log(rows);
        res.json({
            "message":"success",
            "data":loyalty_data
        })
    });
});

app.get("/api/loyalty/check/:email/:warranty", (req, res, next) => {
    var params = [req.params.email,req.params.warranty]
    var sql = "select * from loyalty where `loyalty_email` = ? and `loyalty_OOW` = ?"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log("error")
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

app.get("/api/loyalty/getcode/:warranty", (req, res, next) => {
    var params = [req.params.warranty]
    var sql ='SELECT loyalty_code FROM `loyalty` WHERE `loyalty_email`="" AND `loyalty_OOW`=? AND `loyalty_expiry`>=CURDATE() ORDER BY `loyalty_id` ASC LIMIT 1'
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log("error")
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

app.get("/api/loyalty/report/:startdate/:enddate", (req, res, next) => {
    var tempLoyalty;
    var params='';
    var sql='';
    var loyalty_data={
        CNX_OOW:0,
        CNX_IW:0,
        IOPEX_OOW:0,
        IOPEX_IW:0,
        CCT_OOW:0,
        CCT_IW:0,
        TOTAL_OOW:0,
        TOTAL_IW:0
    }
    if(req.params.startdate==0){
        sql='SELECT loyalty.*,(SELECT users_CN FROM users WHERE loyalty_CES=users_CES) AS usersCN FROM `loyalty` WHERE `loyalty_email`<>"" ORDER BY `loyalty_date` DESC';
    }else{
        params = [req.params.startdate,req.params.enddate]
        sql ='SELECT loyalty.*,(SELECT users_CN FROM users WHERE loyalty_CES=users_CES) AS usersCN FROM `loyalty` WHERE `loyalty_date` BETWEEN ? AND ?  ORDER BY `loyalty_date` DESC'
    }
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log("error")
            res.status(400).json({"error":err.message});
            return;
        }
        //console.log(rows);
        if(rows){
            var loyalty_list=JSON.parse(JSON.stringify(rows));
            console.log(loyalty_list);
            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_center=='CNX' && promocode.loyalty_OOW==0);
            loyalty_data.CNX_OOW=tempLoyalty.length;
            loyalty_data.TOTAL_OOW+=loyalty_data.CNX_OOW;
            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_center=='IOPEX' && promocode.loyalty_OOW==0);
            loyalty_data.IOPEX_OOW=tempLoyalty.length;
            loyalty_data.TOTAL_OOW+=loyalty_data.IOPEX_OOW;
            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_center=='CCT' && promocode.loyalty_OOW==0);
            loyalty_data.CCT_OOW=tempLoyalty.length;
            loyalty_data.TOTAL_OOW+=loyalty_data.CCT_OOW;


            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_center=='CNX' && promocode.loyalty_OOW==1);
            loyalty_data.CNX_IW=tempLoyalty.length;
            loyalty_data.TOTAL_IW+=loyalty_data.CNX_IW
            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_center=='IOPEX' && promocode.loyalty_OOW==1);
            loyalty_data.IOPEX_IW=tempLoyalty.length;
            loyalty_data.TOTAL_IW+=loyalty_data.IOPEX_IW
            tempLoyalty=loyalty_list.filter(promocode=>promocode.loyalty_center=='CCT' && promocode.loyalty_OOW==1);
            loyalty_data.CCT_IW=tempLoyalty.length;
            loyalty_data.TOTAL_IW+=loyalty_data.CCT_IW
            //cnxL1=cnxL1.filter(expert=>expert.users_active=="ACTIVE")
        }
        console.log(loyalty_data);

        res.json({
            "message":"success",
            "data":{'rows':rows,'stats':loyalty_data}
        })
    });
});

app.post("/api/loyalty/get", (req, res, next) => {
    var params='';
    var sql='';
    var recordsExists=false;
    var params = [
        req.body.center,
        req.body.email,
        req.body.cn,
        req.body.notes,
        req.body.asset,
        req.body.serial,
        req.body.symptom,
        req.body.CES,
        req.body.warranty
    ]

    var dataCheck = {
        center:req.body.center,
        email:req.body.email,
        cn:req.body.cn,
        notes:req.body.notes,
        asset:req.body.asset,
        serial:req.body.serial,
        symptom:req.body.symptom,
        CES:req.body.CES,
        warranty:req.body.warranty
    }
    console.log(dataCheck);

    //console.log(dataCheck);
	//console.log(datacheck);
  /*  checker.get('http://'+server+':'+port+'/api/loyalty/getcode/'+dataCheck.warranty,resp=>{
        var data='';
        //console.log('cases');
        
        resp.on('data', (chunk) => {
            data += chunk;
        });
        
          // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(JSON.parse(data));
            var loyaltyCode=JSON.parse(data).data;
            console.log(loyaltyCode[0].loyalty_code);
            console.log(dataCheck)*/
            sql = `CALL getPromoCode(?,?,?,?,?,?,?,?,?)`;
            //sql = 'UPDATE loyalty SET loyalty_center="'+dataCheck.center+'",  loyalty_email="'+dataCheck.email+'", loyalty_CN='+dataCheck.cn+', loyalty_note="'+dataCheck.notes+'", loyalty_CES="'+dataCheck.CES+'", loyalty_date=CURDATE() WHERE loyalty_code=(SELECT `loyalty_code` FROM(SELECT loyalty_code FROM `loyalty` WHERE `loyalty_email`="" AND `loyalty_OOW`='+dataCheck.warranty+' AND `loyalty_expiry`>CURDATE() ORDER BY `loyalty_id` ASC LIMIT 1)as x)'
            //console.log(sql);
            db.query(sql, params, function (err, result) {
                //console.log(result);
                if (err){
                    console.log("error2");
                    res.status(400).json({"error": err.message})
                    console.log(err);
                    return;
                }
                console.log(result);
                res.json({
                    "message": "success",
                    "data": result[0][0].loyalty_code,
                    "id" : this.lastID
                })
            });
            
 /*           BEGIN
	UPDATE loyalty SET loyalty_center=ucenter, loyalty_email=uemail, loyalty_CN=ucn, loyalty_note=unote, loyalty_asset=unasset, loyalty_serial=unserial, loyalty_symptom=usymptom, loyalty_CES=uces, loyalty_date=CURDATE() WHERE loyalty_code=(SELECT `loyalty_code` FROM(SELECT loyalty_code FROM `loyalty` WHERE `loyalty_email`="" AND `loyalty_OOW`=uwarranty AND `loyalty_expiry`>CURDATE() ORDER BY `loyalty_id` ASC LIMIT 1)as x);
    SELECT loyalty_code from loyalty where loyalty_center=ucenter AND loyalty_email=uemail AND loyalty_CN=ucn AND loyalty_note=unote AND loyalty_asset=unasset AND loyalty_serial=unserial AND loyalty_symptom=usymptom AND loyalty_CES=uces ORDER BY loyalty_id DESC LIMIT 1;
END*/
  /*      });
    });*/
})

app.get("/api/SMEEOS/get/:CES/:date", (req, res, next) => {
    var params = [req.params.CES,req.params.date]
    var sql = "select * from SMEEOS where `SMEEOS_CES` = ? AND `SMEEOS_date` = ?"
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log("error")
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

app.post("/api/SMEEOS/save", (req, res, next) => {
    var dateNow=new Date();
    
    var recordExists=false;
    var datacheck = {
        ces: req.body.ces,
        date: req.body.date,
        data: req.body.data,
    }
    //console.log(datacheck);

    console.log('data');
	//console.log(datacheck);
    checker.get('https://'+server+':'+port+'/api/SMEEOS/get/'+req.body.ces+'/'+req.body.date,resp=>{
        var data='';
        //console.log('cases');
        
        resp.on('data', (chunk) => {
            data += chunk;
        });
        
          // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(JSON.parse(data));
            recordExists = JSON.parse(data).data.length?true:false;

            //console.log(recordExists);
            if(recordExists){
                //console.log('record exists');
                var sql ='UPDATE SMEEOS SET SMEEOS_data=? WHERE SMEEOS_CES=? and SMEEOS_date=?'
                var params =[JSON.stringify(datacheck.data), datacheck.ces, datacheck.date]
            }else{
                var sql ='INSERT INTO SMEEOS (SMEEOS_CES, SMEEOS_date, SMEEOS_data) VALUES (?,?,?)'
                var params =[datacheck.ces, (dateNow.getMonth()+1)+"-"+dateNow.getDate()+"-"+dateNow.getFullYear(), JSON.stringify(datacheck.data)]
            }
            
            
            db.query(sql, params, function (err, result) {
                //console.log(result);
                if (err){
                    console.log("error2");
                    res.status(400).json({"error": err.message})
                    console.log(err);
                    return;
                }
                res.json({
                    "message": "success",
                    "data": datacheck,
                    "id" : this.lastID
                })
            });
        });
    });
})

// =================== case_save

app.get("/api/cases/get/:CES", (req, res, next) => {
    var params = [req.params.CES]
    var sql = "select * from cases where `cases_CES` = ?"
    
    db.query(sql, params, (err, rows) => {
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

app.post("/api/cases/save", (req, res, next) => {
    var recordExists=false;
    var datacheck = {
        ces: req.body.ces,
        data: req.body.dataStandard,
        aht: req.body.dataAHT,
        eos: req.body.dataEOS,
        
    }
    //console.log(datacheck);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    //console.log('data');
	//console.log(datacheck);
    checker.get('https://'+server+':'+port+'/api/cases/get/'+req.body.ces,resp=>{
        var data='';
        //console.log('cases');
        
        resp.on('data', (chunk) => {
            data += chunk;
        });
        
          // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(JSON.parse(data));
            try{
                recordExists = JSON.parse(data).data.length?true:false;
            }catch(err){
                console.log(err);
            }
        
    

        
            //console.log(recordExists);
            if(recordExists){
                //console.log('record exists');
                var sql ='UPDATE cases SET cases_datesaved=?, cases_data=?, cases_AHT=?, cases_EOS=? WHERE cases_CES=?'
                var params =[new Date(), datacheck.data, datacheck.aht, datacheck.eos, datacheck.ces]
            }else{
                var sql ='INSERT INTO cases (cases_datesaved, cases_CES, cases_data, cases_AHT, cases_EOS) VALUES (?,?,?,?,?)'
                var params =[new Date(), datacheck.ces, datacheck.data, datacheck.aht, datacheck.eos]
            }
            
            
            db.query(sql, params, function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    console.log(err);
                    return;
                }
                res.json({
                    "message": "success",
                    "data": datacheck,
                    "id" : this.lastID
                })
            });
        });
    });
})

app.get('/upload',function(req,res){
    res.sendFile(__dirname + '/upload.html');
  });
  
  
  // Root endpoint
app.post("/uploadupdate", upload.single("myFile"), (req, res, next) => {
    const file = req.file
    console.log(req.file);
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    if (req.file){
  
          var filepath = path.join(req.file.destination, req.file.filename);
          console.log(filepath);
          var unzipper = new Unzipper(filepath);
          console.log(unzipper);
          unzipper.on("extract", function () {
              console.log("Finished extracting");
          });
          try{
              unzipper.extract({ path: ''});
          } catch(err){
              console.log(err)
          }
      }
      res.send(file)  
  })
    
  app.post("/uploadmetrics", upload.single("metrics"), (req, res, next) => {
      var metric_upload_log;
      
      const file = req.file
    
    //console.log(req.file);
      if (!file) {
          const error = new Error('Please upload a file')
          error.httpStatusCode = 400
          return next(error)
      }
      if (req.file){
          var filepath = path.join(req.file.destination, req.file.filename);
          //console.log(req.file);
          getData('http://'+server+':'+port+'/api/metric/teams',parseCSV,filepath,res);
      }	 
          // Async / await usage
          //
          
  /*		fs.readFile(filepath, 'UTF-8', function(err, csv) {
              $.csv.toArrays(csv, {}, function(err, data) {
                  console.log(data); //Will print every csv line as a newline
              });
          });*/
      //res.render('index');
      res.send('<div id="status_message">Please wait. Data validation in progress</div>');  
  })

    app.post("/uploadhandling", upload.single("handling"), (req, res, next) => {
        var metric_upload_log;
        
        const file = req.file
    
        //console.log(req.file);
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        if (req.file){
            var filepath = path.join(req.file.destination, req.file.filename);
            //console.log(req.file);
            parseCSVHandling(filepath);
        }	 
            // Async / await usage
            //
            
    /*		fs.readFile(filepath, 'UTF-8', function(err, csv) {
                $.csv.toArrays(csv, {}, function(err, data) {
                    console.log(data); //Will print every csv line as a newline
                });
            });*/
        //res.render('index');
        res.send('<div id="status_message">Please wait. Data validation in progress</div>');  
    })


  
  app.post("/uploadutilization", upload.single("utilization"), (req, res, next) => {
      var metric_upload_log;
      
      const file = req.file
    
    //console.log(req.file);
      if (!file) {
          const error = new Error('Please upload a file')
          error.httpStatusCode = 400
          return next(error)
      }
      if (req.file){
          var filepath = path.join(req.file.destination, req.file.filename);
          //console.log(req.file);
          getData('https://'+server+':'+port+'/api/metric/teams',parseCSVUtil,filepath,res);
      }	 
          // Async / await usage
          //
          
  /*		fs.readFile(filepath, 'UTF-8', function(err, csv) {
              $.csv.toArrays(csv, {}, function(err, data) {
                  console.log(data); //Will print every csv line as a newline
              });
          });*/
      //res.render('index');
      res.send('<div id="status_message">Please wait. Data validation in progress</div>');  
  })

    app.post("/uploaddashboard", upload.single("dashboard"), (req, res, next) => {
        var metric_upload_log;
        
        const file = req.file
    
    //console.log(req.file);
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        if (req.file){
            var filepath = path.join(req.file.destination, req.file.filename);
            //console.log(req.file);
            parseCSVDashboard(filepath);
        }	 
            // Async / await usage
            //
            
    /*		fs.readFile(filepath, 'UTF-8', function(err, csv) {
                $.csv.toArrays(csv, {}, function(err, data) {
                    console.log(data); //Will print every csv line as a newline
                });
            });*/
        //res.render('index');
        res.send('<div id="status_message">Please wait. Data validation in progress</div>');  
    })

    app.post("/uploadschedule", upload.single("schedule"), (req, res, next) => {
        var metric_upload_log;
        
        const file = req.file
    
    //console.log(req.file);
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        if (req.file){
            var filepath = path.join(req.file.destination, req.file.filename);
            //console.log(req.file);
            parseCSVSchedule(filepath);
        }	 
            // Async / await usage
            //
            
    /*		fs.readFile(filepath, 'UTF-8', function(err, csv) {
                $.csv.toArrays(csv, {}, function(err, data) {
                    console.log(data); //Will print every csv line as a newline
                });
            });*/
        //res.render('index');
        res.send('<div id="status_message">Please wait. Data validation in progress</div>');  
    })
  
  app.post("/uploadqa", upload.single("qa"), (req, res, next) => {
      var qa_upload_log;
      
      const file = req.file
    
    //console.log(req.file);
      if (!file) {
          const error = new Error('Please upload a file')
          error.httpStatusCode = 400
          return next(error)
      }
      if (req.file){
          var filepath = path.join(req.file.destination, req.file.filename);
          //console.log(req.file);
          parseQACSV(filepath);
      }	 
          // Async / await usage
          //
          
  /*		fs.readFile(filepath, 'UTF-8', function(err, csv) {
              $.csv.toArrays(csv, {}, function(err, data) {
                  console.log(data); //Will print every csv line as a newline
              });
          });*/
      //res.render('index');
      res.send('<div id="status_message">Please wait. Data validation in progress</div>');  
  })

app.post("/sah/charger/getpdf", (req, res, next) => {

    (async () =>{
        //console.log(req.body);
        const browser = await puppeteer.launch({ headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(`file:${path.join(__dirname,'partials/process/sah_charger.html')}`);
        const data={
			sah_charger_cn:req.body.sah_charger_cn==""?"None":req.body.sah_charger_cn,
			sah_charger_injured:req.body.sah_charger_injured,
			sah_charger_injuredesc:req.body.sah_charger_injured=="No"?"N/A":req.body.sah_charger_injuredesc,
			sah_charger_shock:req.body.sah_charger_shock==""?"None":req.body.sah_charger_shock,
			sah_charger_shockdesc:req.body.sah_charger_shock=="No"?"N/A":req.body.sah_charger_shockdesc,
			sah_charger_incdate:req.body.sah_charger_incdate,
			sah_charger_inctime:req.body.sah_charger_inctime==""?"Not specified":req.body.sah_charger_inctime,
			sah_charger_usedlength:req.body.sah_charger_usedlength==""?"Not specified":req.body.sah_charger_usedlength,
			sah_charger_usedate:req.body.sah_charger_usedate==""?"Not specified":"Since "+req.body.sah_charger_usedate,
			sah_charger_detected:req.body.sah_charger_detected==""?"Not specified":req.body.sah_charger_detected,
			sah_charger_chargerused:req.body.sah_charger_chargerused,
			sah_charger_numbatteries:req.body.sah_charger_numbatteries,
			sah_charger_CR123:req.body.sah_charger_CR123,
			sah_charger_partnumbatteries:req.body.sah_charger_CR123=="Yes"?"N/A":(req.body.sah_charger_partnumbatteries==null?"Not specified":"308-"+req.body.sah_charger_partnumbatteries),
			sah_charger_fire:req.body.sah_charger_fire,
			sah_charger_firesigns:req.body.sah_charger_fire=="No"?"N/A":req.body.sah_charger_firesigns,
			sah_charger_fireothers:req.body.sah_charger_fireothers,
			sah_charger_fireothersdescription:req.body.sah_charger_fireothers=="No"?"N/A":req.body.sah_charger_fireothersdescription,
			sah_charger_enclosure:req.body.sah_charger_enclosure,
			sah_charger_exposewire:req.body.sah_charger_enclosure=="No"?"N/A":req.body.sah_charger_exposewire,
			sah_charger_melted:req.body.sah_charger_melted,
			sah_charger_cracked:req.body.sah_charger_cracked,
			sah_charger_breached:req.body.sah_charger_breached,
			sah_charger_locationinstalled:req.body.sah_charger_locationinstalled==""?"N/A":req.body.sah_charger_locationinstalled,
			sah_charger_heatnearlocation:req.body.sah_charger_heatnearlocation==""?"No":"Yes",
			sah_charger_heatlocationinstalled:req.body.sah_charger_heatnearlocation=="No"?"N/A":req.body.sah_charger_heatlocationinstalled,
			sah_charger_charger:req.body.sah_charger_charger,
			sah_charger_chargerbrand:req.body.sah_charger_chargerbrand,
			sah_charger_chargermodel:req.body.sah_charger_chargermodel,
			sah_charger_chargerserial:req.body.sah_charger_chargerserial,
        };
        //console.log(data);
        await page.$eval('#sah_charger_cn', (element,value) => element.innerText = value,data.sah_charger_cn);
        await page.$eval('#sah_charger_injured', (element,value) => element.innerText = value,data.sah_charger_injured);
        await page.$eval('#sah_charger_injuredesc', (element,value) => element.innerText = value,data.sah_charger_injuredesc);
        await page.$eval('#sah_charger_shock', (element,value) => element.innerText = value,data.sah_charger_shock);
        await page.$eval('#sah_charger_shockdesc', (element,value) => element.innerText = value,data.sah_charger_shockdesc);
        await page.$eval('#sah_charger_incdate', (element,value) => element.innerText = value,data.sah_charger_incdate);
        await page.$eval('#sah_charger_inctime', (element,value) => element.innerText = value,data.sah_charger_inctime);
        await page.$eval('#sah_charger_usedlength', (element,value) => element.innerText = value,data.sah_charger_usedlength);
        await page.$eval('#sah_charger_usedate', (element,value) => element.innerText = value,data.sah_charger_usedate);
        await page.$eval('#sah_charger_detected', (element,value) => element.innerText = value,data.sah_charger_detected);
        await page.$eval('#sah_charger_chargerused', (element,value) => element.innerText = value,data.sah_charger_chargerused);
        await page.$eval('#sah_charger_numbatteries', (element,value) => element.innerText = value,data.sah_charger_numbatteries);
        await page.$eval('#sah_charger_CR123', (element,value) => element.innerText = value,data.sah_charger_CR123);
        await page.$eval('#sah_charger_partnumbatteries', (element,value) => element.innerText = value,data.sah_charger_partnumbatteries);
        await page.$eval('#sah_charger_fire', (element,value) => element.innerText = value,data.sah_charger_fire);
        await page.$eval('#sah_charger_firesigns', (element,value) => element.innerText = value,data.sah_charger_firesigns);
        await page.$eval('#sah_charger_fireothers', (element,value) => element.innerText = value,data.sah_charger_fireothers);
        await page.$eval('#sah_charger_fireothersdescription', (element,value) => element.innerText = value,data.sah_charger_fireothersdescription);
        await page.$eval('#sah_charger_enclosure', (element,value) => element.innerText = value,data.sah_charger_enclosure);
        await page.$eval('#sah_charger_exposewire', (element,value) => element.innerText = value,data.sah_charger_exposewire);
        await page.$eval('#sah_charger_melted', (element,value) => element.checked = value,data.sah_charger_melted);
        await page.$eval('#sah_charger_cracked', (element,value) => element.checked = value,data.sah_charger_cracked);
        await page.$eval('#sah_charger_breached', (element,value) => element.checked = value,data.sah_charger_breached);
        await page.$eval('#sah_charger_locationinstalled', (element,value) => element.innerText = value,data.sah_charger_locationinstalled);
        await page.$eval('#sah_charger_heatnearlocation', (element,value) => element.innerText = value,data.sah_charger_heatnearlocation);
        await page.$eval('#sah_charger_heatlocationinstalled', (element,value) => element.innerText = value,data.sah_charger_heatlocationinstalled);
        await page.$eval('#sah_charger_charger', (element,value) => element.innerText = value,data.sah_charger_charger);
        await page.$eval('#sah_charger_chargerbrand', (element,value) => element.innerText = value,data.sah_charger_chargerbrand);
        await page.$eval('#sah_charger_chargermodel', (element,value) => element.innerText = value,data.sah_charger_chargermodel);
        await page.$eval('#sah_charger_chargerserial', (element,value) => element.innerText = value,data.sah_charger_chargerserial);


        //console.log(await page.content());
        const docx = htmlDocx.asBlob(await page.content());
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=name.docx`);
        res.setHeader('Content-Length', docx.length);
        res.send(docx);
        /*
        const buffer = await page.pdf({
            format: "A4",
            margin:{
                top:"3cm",
                right:"1.25cm",
                bottom:"2.0cm",
                left:"1.25cm"
            },
            displayHeaderFooter: true,
            headerTemplate:`<table class="header" id="sah_pdf_table" style="border-collapse:collapse;font-size:12pt;margin-left:1.25cm;margin-right:1.25cm;text-align:center;">
                                <tbody>
                                    <tr>
                                        <td rowspan=2 id="logo" style="border-collapse:collapse;border:1px solid black;"><img style="width:2.54cm" src="data:image/jpeg;base64,${
                                            readFileSync('assets/img/arlo_form.jpg').toString('base64')
                                        }" alt="alt text" /></td>
                                        <td colspan=2 id="formname" style="border-collapse:collapse;border:1px solid black;font-weight:bold">FORM, ARLO SAFETY AND HAZARD QUESTIONNAIRE FOR BATTERY CHARGER</td>
                                    </tr>
                                    <tr>
                                        <td id="revision" style="border-collapse:collapse;border:1px solid black;font-size:10pt;">DOC-50131 Rev 1</td>
                                        <td id="pagenum" style="border-collapse:collapse;border:1px solid black;font-size:10pt;">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></td>
                                    </tr>
                                </tbody>
                            </table>`,
            footerTemplate:`<span style="width:100%;font-size:8pt;font-weight:bold;text-align:center">Arlo Technologies Inc. Confidential and Proprietary<br><br>
            IF PRINTED THIS DOCUMENT IS UNCONTROLLED AND FOR REFERENCE ONLY</span>`
        });
        await browser.close();
        res.end(buffer,'binary');
        console.log(buffer);




        /*
        console.log(req.body);
        const browser = await puppeteer.launch({ headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(`file:${path.join(__dirname,'partials/process/sah_charger.html')}`);
        const data={
			sah_charger_cn:req.body.sah_charger_cn==""?"None":req.body.sah_charger_cn,
			sah_charger_injured:req.body.sah_charger_injured,
			sah_charger_injuredesc:req.body.sah_charger_injured=="No"?"N/A":req.body.sah_charger_injuredesc,
			sah_charger_shock:req.body.sah_charger_shock==""?"None":req.body.sah_charger_shock,
			sah_charger_shockdesc:req.body.sah_charger_shock=="No"?"N/A":req.body.sah_charger_shockdesc,
			sah_charger_incdate:req.body.sah_charger_incdate,
			sah_charger_inctime:req.body.sah_charger_inctime==""?"Not specified":req.body.sah_charger_inctime,
			sah_charger_usedlength:req.body.sah_charger_usedlength==""?"Not specified":req.body.sah_charger_usedlength,
			sah_charger_usedate:req.body.sah_charger_usedate==""?"Not specified":"Since "+req.body.sah_charger_usedate,
			sah_charger_detected:req.body.sah_charger_detected==""?"Not specified":req.body.sah_charger_detected,
			sah_charger_chargerused:req.body.sah_charger_chargerused,
			sah_charger_numbatteries:req.body.sah_charger_numbatteries,
			sah_charger_CR123:req.body.sah_charger_CR123,
			sah_charger_partnumbatteries:req.body.sah_charger_CR123=="Yes"?"N/A":(req.body.sah_charger_partnumbatteries==null?"Not specified":"308-"+req.body.sah_charger_partnumbatteries),
			sah_charger_fire:req.body.sah_charger_fire,
			sah_charger_firesigns:req.body.sah_charger_fire=="No"?"N/A":req.body.sah_charger_firesigns,
			sah_charger_fireothers:req.body.sah_charger_fireothers,
			sah_charger_fireothersdescription:req.body.sah_charger_fireothers=="No"?"N/A":req.body.sah_charger_fireothersdescription,
			sah_charger_enclosure:req.body.sah_charger_enclosure,
			sah_charger_exposewire:req.body.sah_charger_enclosure=="No"?"N/A":req.body.sah_charger_exposewire,
			sah_charger_melted:req.body.sah_charger_melted,
			sah_charger_cracked:req.body.sah_charger_cracked,
			sah_charger_breached:req.body.sah_charger_breached,
			sah_charger_locationinstalled:req.body.sah_charger_locationinstalled==""?"N/A":req.body.sah_charger_locationinstalled,
			sah_charger_heatnearlocation:req.body.sah_charger_heatnearlocation==""?"No":"Yes",
			sah_charger_heatlocationinstalled:req.body.sah_charger_heatnearlocation=="No"?"N/A":req.body.sah_charger_heatlocationinstalled,
			sah_charger_charger:req.body.sah_charger_charger,
			sah_charger_chargerbrand:req.body.sah_charger_chargerbrand,
			sah_charger_chargermodel:req.body.sah_charger_chargermodel,
			sah_charger_chargerserial:req.body.sah_charger_chargerserial,
        };
        console.log(data);
        await page.$eval('#sah_charger_cn', (element,value) => element.innerText = value,data.sah_charger_cn);
        await page.$eval('#sah_charger_injured', (element,value) => element.innerText = value,data.sah_charger_injured);
        await page.$eval('#sah_charger_injuredesc', (element,value) => element.innerText = value,data.sah_charger_injuredesc);
        await page.$eval('#sah_charger_shock', (element,value) => element.innerText = value,data.sah_charger_shock);
        await page.$eval('#sah_charger_shockdesc', (element,value) => element.innerText = value,data.sah_charger_shockdesc);
        await page.$eval('#sah_charger_incdate', (element,value) => element.innerText = value,data.sah_charger_incdate);
        await page.$eval('#sah_charger_inctime', (element,value) => element.innerText = value,data.sah_charger_inctime);
        await page.$eval('#sah_charger_usedlength', (element,value) => element.innerText = value,data.sah_charger_usedlength);
        await page.$eval('#sah_charger_usedate', (element,value) => element.innerText = value,data.sah_charger_usedate);
        await page.$eval('#sah_charger_detected', (element,value) => element.innerText = value,data.sah_charger_detected);
        await page.$eval('#sah_charger_chargerused', (element,value) => element.innerText = value,data.sah_charger_chargerused);
        await page.$eval('#sah_charger_numbatteries', (element,value) => element.innerText = value,data.sah_charger_numbatteries);
        await page.$eval('#sah_charger_CR123', (element,value) => element.innerText = value,data.sah_charger_CR123);
        await page.$eval('#sah_charger_partnumbatteries', (element,value) => element.innerText = value,data.sah_charger_partnumbatteries);
        await page.$eval('#sah_charger_fire', (element,value) => element.innerText = value,data.sah_charger_fire);
        await page.$eval('#sah_charger_firesigns', (element,value) => element.innerText = value,data.sah_charger_firesigns);
        await page.$eval('#sah_charger_fireothers', (element,value) => element.innerText = value,data.sah_charger_fireothers);
        await page.$eval('#sah_charger_fireothersdescription', (element,value) => element.innerText = value,data.sah_charger_fireothersdescription);
        await page.$eval('#sah_charger_enclosure', (element,value) => element.innerText = value,data.sah_charger_enclosure);
        await page.$eval('#sah_charger_exposewire', (element,value) => element.innerText = value,data.sah_charger_exposewire);
        await page.$eval('#sah_charger_melted', (element,value) => element.checked = value,data.sah_charger_melted);
        await page.$eval('#sah_charger_cracked', (element,value) => element.checked = value,data.sah_charger_cracked);
        await page.$eval('#sah_charger_breached', (element,value) => element.checked = value,data.sah_charger_breached);
        await page.$eval('#sah_charger_locationinstalled', (element,value) => element.innerText = value,data.sah_charger_locationinstalled);
        await page.$eval('#sah_charger_heatnearlocation', (element,value) => element.innerText = value,data.sah_charger_heatnearlocation);
        await page.$eval('#sah_charger_heatlocationinstalled', (element,value) => element.innerText = value,data.sah_charger_heatlocationinstalled);
        await page.$eval('#sah_charger_charger', (element,value) => element.innerText = value,data.sah_charger_charger);
        await page.$eval('#sah_charger_chargerbrand', (element,value) => element.innerText = value,data.sah_charger_chargerbrand);
        await page.$eval('#sah_charger_chargermodel', (element,value) => element.innerText = value,data.sah_charger_chargermodel);
        await page.$eval('#sah_charger_chargerserial', (element,value) => element.innerText = value,data.sah_charger_chargerserial);

        const buffer = await page.pdf({
            format: "A4",
            margin:{
                top:"3cm",
                right:"1.25cm",
                bottom:"2.0cm",
                left:"1.25cm"
            },
            displayHeaderFooter: true,
            headerTemplate:`<table class="header" id="sah_pdf_table" style="border-collapse:collapse;font-size:12pt;margin-left:1.25cm;margin-right:1.25cm;text-align:center;">
                                <tbody>
                                    <tr>
                                        <td rowspan=2 id="logo" style="border-collapse:collapse;border:1px solid black;"><img style="width:2.54cm" src="data:image/jpeg;base64,${
                                            readFileSync('assets/img/arlo_form.jpg').toString('base64')
                                        }" alt="alt text" /></td>
                                        <td colspan=2 id="formname" style="border-collapse:collapse;border:1px solid black;font-weight:bold">FORM, ARLO SAFETY AND HAZARD QUESTIONNAIRE FOR BATTERY CHARGER</td>
                                    </tr>
                                    <tr>
                                        <td id="revision" style="border-collapse:collapse;border:1px solid black;font-size:10pt;">DOC-50131 Rev 1</td>
                                        <td id="pagenum" style="border-collapse:collapse;border:1px solid black;font-size:10pt;">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></td>
                                    </tr>
                                </tbody>
                            </table>`,
            footerTemplate:`<span style="width:100%;font-size:8pt;font-weight:bold;text-align:center">Arlo Technologies Inc. Confidential and Proprietary<br><br>
            IF PRINTED THIS DOCUMENT IS UNCONTROLLED AND FOR REFERENCE ONLY</span>`
        });
        await browser.close();
        res.end(buffer,'binary');
        console.log(buffer);
        */
    })()
    
})

//api

function saveMetrics(data,file){
	var sql ='INSERT INTO metrics (`metric-Month`,`metric-WE`,`metric-Date`,`metric-Channel`,`metric-CES`,`metric-Phone_ID`,`metric-Agent_Name`,`metric-LOB`,`metric-Team`,`metric-Survey_Call_Center`,`metric-Case_Start_Channel`,`metric-Case_Number`,`metric-Response-Completiondate`,`metric-Survey_Agent`,`metric-General_Comments`,`metric-NPS_Detractor_Comments`,`metric-CES_General_Comments`,`metric-Q1`,`metric-Q2`,`metric-Q3`,`metric-Q4`,`metric-Q5`,`metric-Q6`,`metric-Q7`,`metric-Q8`,`metric-Q9`,`metric-Q10`,`metric-Q11`,`metric-Q12`,`metric-Q13`,`metric-Q14`,`metric-Q15`,`metric-Q16`,`metric-Q17`,`metric-Daily`,`metric-Combi`,`metric-Tenure`,`metric-Count`,`metric-DET`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
	var params =[data.metricMonth,data.metricWE,data.metricDate,data.metricChannel,data.metricCES,data.metricPhone_ID,data.metricAgent_Name,data.metricLOB,data.metricTeam,data.metricSurvey_Call_Center,data.metricCase_Start_Channel,data.metricCase_Number,data.metricResponse_Completiondate,data.metricSurvey_Agent,data.metricGeneral_Comments,data.metricNPS_Detractor_Comments,data.metricCES_General_Comments,data.metricQ1,data.metricQ2,data.metricQ3,data.metricQ4,data.metricQ5,data.metricQ6,data.metricQ7,data.metricQ8,data.metricQ9,data.metricQ10,data.metricQ11,data.metricQ12,data.metricQ13,data.metricQ14,data.metricQ15,data.metricQ16,data.metricQ17,data.metricDaily,data.metricCombi,data.metricTenure,data.metricCount,data.metricDET]

	try{
		db.query(sql, params, function (err, result) {
			if (err){
				data=data.metricCase_Number + "," + data.metricCES + "," + file + "\n";
				//console.log("error:"+ err);
				fs.appendFile('duplicates.txt',data, 'utf8',
					function(err) { 
						if (err) throw err;
						console.log("Duplicate case detected.")
				});
				//return err;
			}else{
				console.log(data.metricCase_Number);
			}
			if(metricCounter==this.lastID){
				endTime=performance.now();
				console.log(endTime-startTime);
				
			}
		}); 
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
};

function checkQA(agentCES,WE,callback){
	//console.log(agentid);
	//console.log(date);
	var sql ='SELECT * FROM qa WHERE qa_CES=? AND qa_WE=?'
	var params =[agentCES,WE]

	try{
		db.query(sql, params, (err, rows) => {
			if (err) {
			  	res.status(400).json({"error":err.message});
			  	if(callback){
					callback(false);
				}
			  	return;
			}else{
				//console.log(rows);
				if(!rows.length){
					if(callback){
						callback(false);
					}else
					res.json({
						"message":"success",
						"data":rows
					})
				}else{
					if(callback){
						callback(true);
					}
					  return;
				}
			}
		});
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
}

function checkHandling(agentid,date,callback){
	//console.log(agentid);
	//console.log(date);
	var sql ='SELECT * FROM handling WHERE handling_agentID=? AND handling_date=?'
	var params =[agentid,date]

	try{
		db.query(sql, params, (err, rows) => {
			if (err) {
			  	res.status(400).json({"error":err.message});
			  	if(callback){
					callback(false);
				}
			  	return;
			}else{
				//console.log(rows);
				if(!rows.length){
					if(callback){
						callback(false);
					}else
					res.json({
						"message":"success",
						"data":rows
					})
				}else{
					if(callback){
						callback(true);
					}
					  return;
				}
			}
		});
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
}

function checkUtilization(ces,date,callback){
	//console.log(agentid);
	//console.log(date);
	var sql ='SELECT * FROM utilization WHERE util_CES=? AND util_date=?'
	var params =[ces,date]

	try{
		db.query(sql, params, (err, rows) => {
			if (err) {
			  	res.status(400).json({"error":err.message});
			  	if(callback){
					callback(false);
				}
			  	return;
			}else{
				//console.log(rows);
				if(!rows.length){
					if(callback){
						callback(false);
					}else
					res.json({
						"message":"success",
						"data":rows
					})
				}else{
					if(callback){
						callback(true);
					}
					  return;
				}
			}
		});
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
}

function checkDashboard(ces,date,callback){
	//console.log(agentid);
	//console.log(date);
	var sql ='SELECT * FROM dboard WHERE dboard_CES=? AND dboard_date=?'
	var params =[ces,date]

	try{
		db.query(sql, params, (err, rows) => {
			if (err) {
			  	res.status(400).json({"error":err.message});
			  	if(callback){
					callback(false);
				}
			  	return;
			}else{
				//console.log(rows);
				if(!rows.length){
					if(callback){
						callback(false);
					}else
					res.json({
						"message":"success",
						"data":rows
					})
				}else{
					if(callback){
						callback(true);
					}
					  return;
				}
			}
		});
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
}

function saveQA(data,callback){
	var sql ='INSERT INTO qa (`qa_CES`,`qa_score`,`qa_WE`) VALUES (?,?,?)'
	var params =[data.qa_CES,data.qa_score,data.qa_WE]

	try{
		db.query(sql, params, function (err, result) {
			if (err){
				console.log("error:"+ err);
				//return err;
				if(callback){
					callback("error");
				}
			}else{
				console.log(this.lastID);
				if(callback){
					callback(this.lastID);
				}
			}
		}); 
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
};

function saveHandling(data,callback){
	var sql ='INSERT INTO handling (`handling_date`,`handling_CES`,`handling_agentID`,`handling_availtime`,`handling_handled`,`handling_handletime`,`handling_holdtime`,`handling_inbound`) VALUES (?,?,?,?,?,?,?,?)'
	var params =[data.handlingDate,data.handlingCES,data.handlingAgentID,data.handlingAvailableTime,data.handlingHandled,data.handlingHandleTime,data.handlingHoldTime,data.handlingInbound]

	try{
		db.query(sql, params, function (err, result) {
			if (err){
				console.log("error:"+ err);
				//return err;
				if(callback){
					callback("error");
				}
			}else{
				console.log(this.lastID);
				if(callback){
					callback(this.lastID);
				}
			}
		}); 
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
};

function saveUtilization(data){
	var sql ='INSERT INTO utilization (`util_date`,`util_CES`,`util_logged`,`util_availtime`,`util_break`,`util_productivityrate`,`util_utilizationrate`,`util_utilizedhours`,`util_productivehours`,`util_inbound`,`util_outbound`,`util_inboundtime`,`util_outboundtime`,`util_labtime`,`util_chattime`,`util_webotstime`,`util_casereviewtime`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
	var params =[data.utilizationDate,data.utilizationCES,data.utilizationlogged,data.utilizationavailtime,data.utilizationbreak,data.utilizationprodrate,data.utilizationutilrate,data.utilizationutilhours,data.utilizationprodhours,data.utilizationinbound,data.utilizationoutbound,data.utilizationinboundtime,data.utilizationoutboundtime,data.utilizationlab,data.utilizationchat,data.utilizationwebots,data.utilizationcasereview]

	try{
		db.query(sql, params, function (err, result) {
			if (err){
				console.log("error:"+ err);
				//return err;
			}else{
				console.log(this.lastID);
			}
			if(metricCounter==this.lastID){
				endTime=performance.now();
				console.log(endTime-startTime);
				
			}
		}); 
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
};

function saveDashboard(data){
	var sql ='INSERT INTO dboard (`dboard_id`,`dboard_date`,`dboard_CES`,`dboard_unavail_T`,`dboard_inbound_pending`,`dboard_15break`,`dboard_casereview`,`dboard_60break`,`dboard_pbreak`,`dboard_unavail`,`dboard_chat`,`dboard_web_ots`,`dboard_logged_in`,`dboard_lab`,`dboard_training`,`dboard_meeting`,`dboard_outbound`,`dboard_technical`,`dboard_coaching`,`dboard_outbound_pending`,`dboard_admin`,`dboard_acw_manual`,`dboard_consult_pending`,`dboard_acw_auto`,`dboard_transfer_pending`,`dboard_login_time`,`dboard_avail`,`dboard_utilized_hours`,`dboard_inbound_handled`,`dboard_inbound_handle_time`,`dboard_inbound_hold_time`,`dboard_outbound_handled`,`dboard_outbound_handle_time`,`dboard_outbound_hold_time`,`dboard_outbound_calls`,`dboard_expected`,`dboard_present`,`dboard_absent`,`dboard_sched_leave`,`dboard_unsched_leave`,`dboard_tardiness`,`dboard_chat_offered`,`dboard_chat_handled`,`dboard_chat_handle_time`,`dboard_case_notes`,`dboard_chat2`,`dboard_customer_comment_reply`,`dboard_inbound_call`,`dboard_outbound_call`,`dboard_presales_case_notes`,`dboard_presales_inbound_call`,`dboard_presales_customer_comment_reply`,`dboard_presales_chat`,`dboard_presales_outbound_call`,`dboard_case_reviews`,`dboard_cases_closed`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
	var params =[data.dboard_id,data.dboard_date,data.dboard_CES,data.dboard_unavail_T,data.dboard_inbound_pending,data.dboard_15break,data.dboard_casereview,data.dboard_60break,data.dboard_pbreak,data.dboard_unavail,data.dboard_chat,data.dboard_web_ots,data.dboard_logged_in,data.dboard_lab,data.dboard_training,data.dboard_meeting,data.dboard_outbound,data.dboard_technical,data.dboard_coaching,data.dboard_outbound_pending,data.dboard_admin,data.dboard_acw_manual,data.dboard_consult_pending,data.dboard_acw_auto,data.dboard_transfer_pending,data.dboard_login_time,data.dboard_avail,data.dboard_utilized_hours,data.dboard_inbound_handled,data.dboard_inbound_handle_time,data.dboard_inbound_hold_time,data.dboard_outbound_handled,data.dboard_outbound_handle_time,data.dboard_outbound_hold_time,data.dboard_outbound_calls,data.dboard_expected,data.dboard_present,data.dboard_absent,data.dboard_sched_leave,data.dboard_unsched_leave,data.dboard_tardiness,data.dboard_chat_offered,data.dboard_chat_handled,data.dboard_chat_handle_time,data.dboard_case_notes,data.dboard_chat2,data.dboard_customer_comment_reply,data.dboard_inbound_call,data.dboard_outbound_call,data.dboard_presales_case_notes,data.dboard_presales_inbound_call,data.dboard_presales_customer_comment_reply,data.dboard_presales_chat,data.dboard_presales_outbound_call,data.dboard_case_reviews,data.dboard_cases_closed]

	try{
		db.query(sql, params, function (err, result) {
			if (err){
				console.log("error:"+ err);
				//return err;
			}else{
				console.log(this.lastID);
			}
			if(dashboardCounter==this.lastID){
				endTime=performance.now();
				console.log(endTime-startTime);
				
			}
		}); 
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
};

function getData(api,callback,data){
    //console.log('in getdata');
    
	httpmetric.get(api,(res)=>{
		let body = "";
		res.on("data", (chunk) => {
			body = JSON.parse(chunk);
		if(body.data){ 
			callback(body.data,data);
		}else{
		}
	});
})

function saveTrainee(data,callback){
	var sql ='INSERT INTO qa (`qa_CES`,`qa_score`,`qa_WE`) VALUES (?,?,?)'
	var params =[data.qa_CES,data.qa_score,data.qa_WE]

	try{
		db.query(sql, params, function (err, result) {
			if (err){
				console.log("error:"+ err);
				//return err;
				if(callback){
					callback("error");
				}
			}else{
				console.log(this.lastID);
				if(callback){
					callback(this.lastID);
				}
			}
		}); 
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'metrics saved';
	}
};
	
	
	
	/*
	var xhr = new XMLHttpRequest();
	console.log('in getdata');
	xhr.open('GET', api)
	xhr.send();
	xhr.onload = function() {
		if (xhr.status != 200) { // analyze HTTP status of the response
			console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
		} else {
			callback(JSON.parse(xhr.response).data,data);
			console.log(data);
		}
	}
	xhr.onerror = function() {
	  console.log("Request failed");
	};
*/
}

function parseQACSV(csvFilePath){
	var qaPromise=[];
	qaCounter=0;
	csvQA({noheader:false,})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		//console.log(jsonObj);
		qaObject= JSON.parse(JSON.stringify(jsonObj));
		//console.log(qaObject);
		var qaArray=Object.entries(qaObject);
		startTime=performance.now();
			qaArray.forEach(function(element,index){
				//console.log(element[1].Expert);
				getData('https://'+server+':'+port+'/api/users/CES/'+element[1].Expert,function(qadata){
					//console.log(qadata);
					if(qadata.length<1){
						console.log("Not found:" +element[1].Expert);
					}else{
						Object.keys(element[1]).forEach(key=>{
							//console.log(qadata[0].users_CES);
							if((key.substr(0,2)=='WE')&&(!isNaN(parseFloat(element[1][key])))){
								checkQA(qadata[0].users_CES,key.substr(2,4),function(found){
									if(!found){
										var data = {
											qa_CES:qadata[0].users_CES,
											qa_score:element[1][key],
											qa_WE:key.substr(2,4)
										}
										qaPromise.push(new Promise(function(resolve,reject){
											saveQA(data,function(id){
												resolve(id);
											});
										}));
									}
								})
								
							}
						})
					}
					qaCounter++;
					/* */
					//check_metrics(data,saveMetrics);
					//
				});
				
			
		});
		//console.log(recordsProcessed);
		Promise.all(qaPromise).then(function(){
			console.log('upload complete');
		});

	});
}

function parseCSV(teams,csvFilePath){
	afterHeader=false;
	metricCounter=0;
	csvMetrics({
		noheader:false,
		headers:['Month','WE','Date','Channel','CES','Phone_ID','Agent_Name','LOB','Team','Blank','Survey_Call_Center','Case_Start_Channel','Case_Number','Response_Completiondate','Survey_Agent','General_Comments','NPS_Detractor_Comments','CES_General_Comments','Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Daily','Combi','Tenure','Count','DET']
	})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		//console.log(jsonObj);
		metricObject= JSON.parse(JSON.stringify(jsonObj));
		//console.log(metricObject);
		var metricArray=Object.entries(metricObject);
		startTime=performance.now();
		
			metricArray.forEach(element=>{
				if((element[1].Month=='Month')&&!afterHeader){
                    afterHeader=true;
                    return true;
                };
                if(!afterHeader){
				}else if(afterHeader)
				{
					metricCounter++;
					var modifyDate=element[1].Response_Completiondate.split("/");
                    //console.log(element[1].Response_Completiondate);
                    console.log(modifyDate);
                    var year = modifyDate[2].split(" ")[0];
                    var month = modifyDate[0].length<2?'0'+modifyDate[0]:modifyDate[0];
                    var day = modifyDate[1].length<2?'0'+modifyDate[1]:modifyDate[1];
                    var hour = modifyDate[2].split(" ")[1].split(":")[0].length<2?0+modifyDate[2].split(" ")[1].split(":")[0]:modifyDate[2].split(" ")[1].split(":")[0];
                    var minute = modifyDate[2].split(" ")[1].split(":")[1].length<2?"0"+modifyDate[2].split(" ")[1].split(":")[1]:modifyDate[2].split(" ")[1].split(":")[1];
                    var divday = modifyDate[2].split(" ")[2];

					var data = {
						metricMonth:element[1].Month,
						metricWE:element[1].WE,
						metricDate:element[1].Date,
						metricChannel:element[1].Channel,
						metricCES:element[1].CES,
						metricPhone_ID:element[1].Phone_ID,
						metricAgent_Name:element[1].Agent_Name,
						metricLOB:element[1].LOB,
						metricTeam:teams.findIndex(team => team.team_name==element[1].Team),
						metricSurvey_Call_Center:element[1].Survey_Call_Center,
						metricCase_Start_Channel:element[1].Case_Start_Channel,
						metricCase_Number:element[1].Case_Number,
						metricResponse_Completiondate:year + "/" + month + "/" + day + " " + hour + ":" + minute + " " + divday,
						metricSurvey_Agent:element[1].Survey_Agent,
                        metricGeneral_Comments:element[1].General_Comments,
                        metricNPS_Detractor_Comments:element[1].NPS_Detractor_Comments,
                        metricCES_General_Comments:element[1].CES_General_Comments,
						metricQ1:element[1].Q1,
						metricQ2:element[1].Q2,
						metricQ3:element[1].Q3,
						metricQ4:element[1].Q4,
						metricQ5:element[1].Q5,
						metricQ6:element[1].Q6,
						metricQ7:element[1].Q7,
						metricQ8:element[1].Q8,
						metricQ9:element[1].Q9,
						metricQ10:element[1].Q10,
						metricQ11:element[1].Q11,
						metricQ12:element[1].Q12,
						metricQ13:element[1].Q13,
						metricQ14:element[1].Q14,
						metricQ15:element[1].Q15,
						metricQ16:element[1].Q16,
						metricQ17:element[1].Q17,
						metricDaily:element[1].Daily,
						metricCombi:element[1].Combi,
						metricTenure:element[1].Tenure,
						metricCount:element[1].Count,
						metricDET:element[1].DET
					} 
					//console.log(data);
				//check_metrics(data,saveMetrics);
					saveMetrics(data,csvFilePath);
				}
			});
		
		//console.log(recordsProcessed);

	});
	
}

function parseCSVHandling(csvFilePath){
	var handlingPromise=[];
	afterHeader=true;
	handlingCounter=0;
	//console.log('in parsing');
	csvHandling({
		noheader:false,
		headers:['Date','Agent_Name','Agent_Email','Agent_ID','Classification','ACD_Time','ACW_Time','ACD_Contacts','ACW_Contacts','Handled','Handle_Time','Avg_Handle_Time','Available_Time','Working_Time','Hold_Time','Avg_Hold_Time','Inbound','Inbound_Handled']
	})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		//console.log(jsonObj);
		handlingObject= JSON.parse(JSON.stringify(jsonObj));
		//console.log(metricObject);
		var handlingArray=Object.entries(handlingObject);
		startTime=performance.now();

			handlingArray.forEach(element=>{
                if(!afterHeader){
				}else if(afterHeader)
				{
					//console.log("after header2");
					if((element[1].Agent_ID!='')&&(element[1].Classification=='')){
						
						handlingPromise.push(new Promise(function(resolve,reject){
							getData('https://'+server+':'+port+'/api/users/agent/'+element[1].Agent_ID+'/z',function(userDetails){
								if(!userDetails.length){
									resolve("error");
									return;
								}
								//console.log(element[1].Agent_Name);
								//console.log('user details');
								//console.log(userDetails);
								//console.log(userDetails[0]["users_CES"]);
								handlingCounter++;
								//get CES = agentCES;
								/*
								var modifyDate=element[1].Response_Completiondate.split("/");
								//console.log(element[1].Response_Completiondate);
								console.log(modifyDate);
								var year = modifyDate[2].split(" ")[0];
								var month = modifyDate[0].length<2?'0'+modifyDate[0]:modifyDate[0];
								var day = modifyDate[1].length<2?'0'+modifyDate[1]:modifyDate[1];
								var hour = modifyDate[2].split(" ")[1].split(":")[0].length<2?0+modifyDate[2].split(" ")[1].split(":")[0]:modifyDate[2].split(" ")[1].split(":")[0];
								var minute = modifyDate[2].split(" ")[1].split(":")[1].length<2?"0"+modifyDate[2].split(" ")[1].split(":")[1]:modifyDate[2].split(" ")[1].split(":")[1];
								var divday = modifyDate[2].split(" ")[2];
								*/
								checkHandling(element[1].Agent_ID,element[1].Date,function (found){
									if(!found){
										var data = {
											handlingDate:element[1].Date,
											handlingCES:userDetails[0]["users_CES"],
											handlingAgentID:element[1].Agent_ID,
											handlingAvailableTime:element[1].Available_Time,
											handlingHandled:element[1].Handled,
											handlingHandleTime:element[1].Handle_Time,
											handlingHoldTime:element[1].Hold_Time,
											handlingInbound:element[1].Inbound
										} 
										//console.log(data);
									//check_metrics(data,saveMetrics);
										saveHandling(data,function(id){
											resolve(id);
										});
									}else{

									}
								})
								
							});
						}))
						
					}
				}
			});
			Promise.all(handlingPromise).then(function(){
				console.log('upload complete');
			});

		//console.log(recordsProcessed);
	});
	
}

function parseCSVUtil(teams,csvFilePath){
	afterHeader=false;
	utilizationCounter=0;
	csvUtilization({
		noheader:false,
		headers:['blank','MONTH','WE','DATE','SKILL','CES','Name','Team','Type / LOB','blank','UTILIZATION','PRODUCTIVITY','blank','UTILIZED HOURS','PRODUCTIVE HOURS','Login Time','Login Time less breaks','INBOUND HANDLED','OUTBOUND HANDLED','Inbound Time','Outbound Time','Available Time','Unavailable Time','blank','actual-15min Break','actual-60min Lunch Break','actual-After Call Work (Manual)','actual-Chat','actual-Coaching','actual-Lab','actual-Outbound','actual-Personal Break','actual-Technical issue','actual-Training','actual-Unavailable','actual-Meeting','actual-Admin Work','actual-Web/OTS','actual-Case Review','actual-TOTAL BREAKS','blank','percent-15min Break','percent-60min Break','percent-After Call Work (Manual)','percent-Chat','percent-Coaching','percent-Lab','percent-Outbound','percent-Personal Break','percent-Technical issue','percent-Training','percent-Unavailable','percent-Meeting','percent-Admin Work','percent-Web/OTS','percent-Case Review','percent-TOTAL BREAKS','blank','GROUP','TEAM','Tenure']
	})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		//console.log(jsonObj);
		utilObject= JSON.parse(JSON.stringify(jsonObj));
		//console.log(metricObject);
		var utilizationArray=Object.entries(utilObject);
        startTime=performance.now();
        //console.log(utilizationArray);
        

			utilizationArray.forEach(element=>{
                //console.log('in elements');
                //console.log(element[1]);
                //console.log('after header: ' + afterHeader);
				if((element[1].MONTH=='MONTH')&&!afterHeader){
                    afterHeader=true;
                    //console.log('in header');
                    return true;
                    
                };
                if(!afterHeader){
				}else if(afterHeader)
				{
                    if(element[1].MONTH==''){
                        return true;
                    }
                    utilizationCounter++;
                    //console.log(element[1].DATE);
                    var modifyDate=element[1].DATE.split("/");
                    
                    
                    //console.log(modifyDate);
                    var year = modifyDate[2].split(" ")[0];
                    var month = modifyDate[0].length<2?'0'+modifyDate[0]:modifyDate[0];
                    var day = modifyDate[1].length<2?'0'+modifyDate[1]:modifyDate[1];
					if(year.length<4){
						year = '20'+year;
					}
					
					//console.log(data);
				//check_metrics(data,saveMetrics);
				checkUtilization(element[1].CES,year + "/" + month + "/" + day,function(found){
					if(!found){
						var data = {
							utilizationDate: year + "/" + month + "/" + day,
							utilizationCES:element[1].CES,
							utilizationlogged:element[1]['Login Time'],
							utilizationbreak:element[1]['actual-TOTAL BREAKS'],
							utilizationinbound:element[1]['INBOUND HANDLED'],
							utilizationinboundtime:element[1]['Inbound Time'],
							utilizationoutbound:element[1]['OUTBOUND HANDLED'],
							utilizationoutboundtime:element[1]['Outbound Time'],
							utilizationavailtime:element[1]['Available Time'],
							utilizationlab:element[1]['actual-Lab'],
							utilizationchat:element[1]['actual-Chat'],
							utilizationwebots:element[1]['actual-Web/OTS'],
							utilizationcasereview:element[1]['actual-Case Review'],
							utilizationutilrate:element[1].UTILIZATION,
							utilizationprodrate:element[1].PRODUCTIVITY,
							utilizationutilhours:element[1]['UTILIZED HOURS'],
							utilizationprodhours:element[1]['PRODUCTIVE HOURS']
						} 
						saveUtilization(data);
					}else{
						console.log("Duplicate Entry");
					}
				})
					
				}
			});

		//console.log(recordsProcessed);
        
	});
}

function parseCSVDashboard(csvFilePath){
	afterHeader=false;
	dashboardCounter=0;
	csvDashboard({
		noheader:false,
		headers:['AHT','Daily Rank','','','Date','WE','Month','Tenure','CES','Name','Team','LOB','Type','GROUP','WAH','Total Unavailable Time','InboundPending','15min Break','Case Review','60min Lunch Break','Personal Break','Unavailable','Chat','Web/OTS','Logged In','Lab','Training','Meeting','Outbound','Technical Issue','Coaching','OutboundPending','Admin Work','Case Management','After Call Work (Manual)','ConsultPending','After Call Work (Auto)','CCT Admin Work','30min Lunch Break','TransferPending','Login Time','Available Time','Utilized Hours','Inbound','Handled','Aban','Inbound Handle Time','Talk Time','ACW Time','Hold Time','Aban Time','Inqueue Time','Speed of Answer','Speed of Answer (seconds)','Outbound Handled','Outbound Handle Time','Outbound Active Talk Time','Outbound ACW Time','Outbound Hold Time','Outbound Calls (Above 180 secs)','EXPECTED','PRESENT','ABSENT','Sched Leaves','Unched Leaves','Tardiness','Chat Offered','Chat Handled','Chat Total Handled Time','Case Notes','Chat2','Customer Comment – Reply','Inbound Call','Outbound Call','Presales Case Notes','Presales Inbound Call','Presales Customer Comment – Reply','Presales Chat','Presales Outbound Call','Case Reviews','Cases Closed']
	})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		//console.log(jsonObj);
		dashboardObject= JSON.parse(JSON.stringify(jsonObj));
		//console.log(metricObject);
		var dashboardArray=Object.entries(dashboardObject);
        startTime=performance.now();
        //console.log(utilizationArray);
        
		
			dashboardArray.forEach(element=>{
                //console.log('in elements');
                //console.log(element[1]);
                //console.log('after header: ' + afterHeader);
				if((element[1].AHT=='AHT')&&!afterHeader){
                    afterHeader=true;
                    //console.log('in header');
                    return true;
                    
                };
                if(!afterHeader){
				}else if(afterHeader)
				{
                    if(element[1].AHT==''){
                        return true;
                    }
                    utilizationCounter++;
                    //console.log(element[1].DATE);
                    var modifyDate=element[1].Date.split("/");
                    
                    
                    //console.log(modifyDate);
                    var year = modifyDate[2].split(" ")[0];
                    var month = modifyDate[0].length<2?'0'+modifyDate[0]:modifyDate[0];
                    var day = modifyDate[1].length<2?'0'+modifyDate[1]:modifyDate[1];
					if(year.length<4){
						year = '20'+year;
					}
					
					//console.log(data);
				//check_metrics(data,saveMetrics);
				checkDashboard(element[1].CES,year + "/" + month + "/" + day,function(found){
					if(!found){
						var data = {
							dboard_date:year + "/" + month + "/" + day,
							dboard_CES:element[1]['CES'],
							dboard_unavail_T:element[1]['Total Unavailable Time'],
							dboard_inbound_pending:element[1]['InboundPending'],
							dboard_15break:element[1]['15min Break'],
							dboard_casereview:element[1]['Case Review'],
							dboard_60break:element[1]['60min Lunch Break'],
							dboard_pbreak:element[1]['Personal Break'],
							dboard_unavail:element[1]['Unavailable'],
							dboard_chat:element[1]['Chat'],
							dboard_web_ots:element[1]['Web/OTS'],
							dboard_logged_in:element[1]['Logged In'],
							dboard_lab:element[1]['Lab'],
							dboard_training:element[1]['Training'],
							dboard_meeting:element[1]['Meeting'],
							dboard_outbound:element[1]['Outbound'],
							dboard_technical:element[1]['Technical Issue'],
							dboard_coaching:element[1]['Coaching'],
							dboard_outbound_pending:element[1]['OutboundPending'],
							dboard_admin:element[1]['Admin Work'],
							dboard_acw_manual:element[1]['After Call Work (Manual)'],
							dboard_consult_pending:element[1]['ConsultPending'],
							dboard_acw_auto:element[1]['After Call Work (Auto)'],
							dboard_transfer_pending:element[1]['TransferPending'],
							dboard_login_time:element[1]['Login Time'],
							dboard_avail:element[1]['Available Time'],
							dboard_utilized_hours:element[1]['Utilized Hours'],
							dboard_inbound_handled:element[1]['Inbound'],
							dboard_inbound_handle_time:element[1]['Inbound Handle Time'],
							dboard_inbound_hold_time:element[1]['Hold Time'],
							dboard_outbound_handled:element[1]['Outbound Handled'],
							dboard_outbound_handle_time:element[1]['Outbound Handle Time'],
							dboard_outbound_hold_time:element[1]['Outbound Hold Time'],
							dboard_outbound_calls:element[1]['Outbound Calls (Above 180 secs)'],
							dboard_expected:element[1]['EXPECTED'],
							dboard_present:element[1]['PRESENT'],
							dboard_absent:element[1]['ABSENT'],
							dboard_sched_leave:element[1]['Sched Leaves'],
							dboard_unsched_leave:element[1]['Unched Leaves'],
							dboard_tardiness:element[1]['Tardiness'],
							dboard_chat_offered:element[1]['Chat Offered'],
							dboard_chat_handled:element[1]['Chat Handled'],
							dboard_chat_handle_time:element[1]['Chat Total Handled Time'],
							dboard_case_notes:element[1]['Case Notes'],
							dboard_chat2:element[1]['Chat2'],
							dboard_customer_comment_reply:element[1]['Customer Comment – Reply'],
							dboard_inbound_call:element[1]['Inbound Call'],
							dboard_outbound_call:element[1]['Outbound Call'],
							dboard_presales_case_notes:element[1]['Presales Case Notes'],
							dboard_presales_inbound_call:element[1]['Presales Inbound Call'],
							dboard_presales_customer_comment_reply:element[1]['Presales Customer Comment – Reply'],
							dboard_presales_chat:element[1]['Presales Chat'],
							dboard_presales_outbound_call:element[1]['Presales Outbound Call'],
							dboard_case_reviews:element[1]['Case Reviews'],
							dboard_cases_closed:element[1]['Cases Closed']
                        } 
                        console.log(data);
						saveDashboard(data);
					}else{
						console.log("Duplicate Entry");
					}
				})
					
				}
			});
		
		//console.log(recordsProcessed);
        
	});
}

function parseCSVSchedule(csvFilePath){
	afterHeader=false;
	scheduleCounter=0;
	csvDashboard({
		noheader:false,
	})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		//console.log(jsonObj);
		scheduleObject= JSON.parse(JSON.stringify(jsonObj));
		//console.log(metricObject);
		var scheduleArray=Object.entries(scheduleObject);
        console.log(scheduleArray);
        scheduleArray.forEach(element=>{
            scheduleCounter++;
            
            
            for(var i=1;i<8;i++){
                if(element[1][Object.keys(element[1])[i]].search(":")>=0){
                    var data = {
                        schedules_CES:element[1]['CES'],
                        schedules_datetime:Object.keys(element[1])[i] +" "+ element[1][Object.keys(element[1])[i]]
                    } 
                    console.log(data);
                    saveSchedule(data);
                }
            }
        });
	});
}

function saveSchedule(data){
	var sql ='INSERT INTO schedules (`schedules_CES`,`schedules_datetime`) VALUES (?,?)'
	var params =[data.schedules_CES,data.schedules_datetime]

	try{
		db.query(sql, params, function (err, result) {
			if (err){
				console.log("error:"+ err);
				//return err;
			}
		}); 
	}catch(err){
		//console.log(err);
	} finally{
		//recordsProcessed++;
		return 'Schedules saved';
	}
};

function saveLogin(source,ces,datetime,type){
    var data={
        source:source,
        ces:ces,
        datetime:datetime,
        type:type
    }
    var sql ='INSERT INTO `consultlog` (`consultlog_source`, `consultlog_CES`, `consultlog_datetime`, `consultlog_type`) VALUES (?,?,?,?)'
    var params =[data.source, data.ces, data.datetime, data.type]
    //console.log(data);
    db.query(sql, params, function (err, result) {
        if (err){
            console.log(err.message)
            return;
        }
    });
}
// =================== splash

router.post('/register', (req, res) => {
    const  name  =  req.body.name;
    const  email  =  req.body.email;
    const  password  =  bcrypt.hashSync(req.body.password);

    db.createUser([name, email, password], (err)=>{
        if(err) return  res.status(500).send("Server error!");
        findUserByEmail(email, (err, user)=>{
            if (err) return  res.status(500).send('Server error!');  
            const  expiresIn  =  24  *  60  *  60;
            const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
                expiresIn:  expiresIn
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn          
            });
        });
    });
});




router.post('/login', (req, res) => {
    console.log("in login");
    //console.log(req.body);
    const  CES  =  req.body.CES;
    const  password  =  req.body.password;
    
    db.findUserByCES(CES, (err, user)=>{
        //console.log(err);
        if (err) return console.log('Server error!');
        if(user.length==0) {
            console.log('User not found!')
            res.status(401).send('Invalid request')
            return;
        };
        if(!user.users_password) {
            console.log('User found, but not registered!')
            res.status(401).send('Invalid request')
            return;
        };
        const  result = bcrypt.compareSync(password, user.users_password);
        if(!result) {
            console.log('Password not valid!')
            res.status(401).send('Invalid request')
            return;
        };
        

        //console.log(user);
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
        const response = {
            "status": "Logged in",
            "token": token,
            "refreshToken": refreshToken,
            "user": user
        }
        console.log("user");
        var data = {
            ces: user.users_CES,
            time: Date.now(),
            mode: 0
        }
        var sql ='INSERT INTO login (login_user,login_time,login_mode) VALUES (?,?,?)'
        var params =[data.ces, data.time, data.mode]
        //console.log(sql);
        db.query(sql, params, function (err, result) {
            if (err){
                console.log(err);
                return;
            }          
        });
        //console.log(user);
        //tokenList[refreshToken] = response
        res.cookie('userdetails',JSON.stringify(user), { maxAge: config.refreshTokenLife });
        res.cookie('expertname',user.users_alias, { maxAge: config.refreshTokenLife });
        res.cookie('token',token, { maxAge: config.tokenLife });
        res.cookie('refreshToken',refreshToken, { maxAge: config.refreshTokenLife });
        res.status(200).json(response);
    });
}); 
/*
router.post('/token', (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "CES": postData.CES,
            "name": postData.name
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.cookie('token',token, { maxAge: config.refreshTokenLife });
        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
})
*/

app.use('/', router);

router.use(require('./tokenChecker'));

router.get('/', (req,res) => { 
    console.log("in /");
    //console.log(res);
    res.render('index',{basedir: __dirname, userdetails: req.cookies.userdetails});
    //res.sendFile(__dirname + '/main.html');
})

app.all('/*', function(req, res) {
    //history.pushState("","","/");
    res.redirect("https://"+server+"/splash.html");
});


var userObject={};
var userObjectL2={};

try{
    fs.readFile('chatcctqueue.txt',function(err,data){
        try{
            chatCCTConsultQueue=JSON.parse(data);
            console.log(chatCCTConsultQueue);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chatqueue.txt',function(err,data){
        try{
            chatConsultQueue=JSON.parse(data);
            console.log(chatConsultQueue);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chattrainerqueue.txt',function(err,data){
        try{
            chatTrainerQueue=JSON.parse(data);
            console.log(chatTrainerQueue);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chattraineeavail.txt',function(err,data){
        try{
            chatTrainees=JSON.parse(data);
            console.log(chatTrainees);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chattraineeavail2.txt',function(err,data){
        try{
            chatTrainees=JSON.parse(data);
            console.log(chatTrainees2);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chatL2avail.txt',function(err,data){
        try{
            chatConsultL2=JSON.parse(data);
            console.log(chatConsultL2);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chatRmaApprovalL2avail.txt',function(err,data){
        try{
            chatRmaApprovalL2TM=JSON.parse(data);
            console.log(chatRmaApprovalL2TM);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chatRmaApprovalqueue.txt',function(err,data){
        try{
            chatRmaApprovalQueue=JSON.parse(data);
            console.log(chatRmaApprovalQueue);
        }catch(err){
            console.log(err);
        }
    })

    fs.readFile('chatcctavail.txt',function(err,data){
        try{
            chatCCTConsult=JSON.parse(data);
            console.log(chatCCTConsult);
        }catch(err){
            console.log(err);
        }
    })
}catch(err){
    console.log(err)
}

io.on('connection', function(socket){
    //console.log(socket);
    var userID;
    var ip = socket.handshake.address;
    var traineeAvail = false;
    
    userID=socket.id;

/*
    chatConsultQueue.forEach(function(element){
        io.to(`${element.userID}`).emit('chatconsult queue', {'queue':chatConsultQueue});
        io.to(`${element.userID}`).emit('chatconsult l2avail', {'l2avail':chatConsultL2})
    });

    chatConsultL2.forEach(function(element){
        io.to(`${element.userID}`).emit('chatconsult queue', {'queue':chatConsultQueue});
        io.to(`${element.userID}`).emit('chatconsult l2avail', {'l2avail':chatConsultL2})
    });
*/
    //var userIP=ip;
    //console.log(userID + ' connected '+ ip);
    //io.to(`${userID}`).emit('ip address', ip);
    socket.on('register chat', function(data) {
        
        try{
            userNames["A"+data.userCES] = {'username':data.name,'user_CN':data.user.users_CN,'userID':data.userID,'ip':data.ip,'userCES':data.userCES,'userType':data.userType};
        }catch(err){
            console.log(err)
        }
        //console.log(userNames);
        //console.log('register chat from1:');
        userObject={};
        Object.keys(userNames).forEach( (element) => {
            userObject[element]=userNames[element];
        });
        //console.log(userObject);
        io.emit('chat list', userObject);
        console.log(data);
        if(data.userlevel==2){
            try{
                userNamesL2["A"+data.userCES] = {'username':data.name,'userID':data.userID,'ip':data.ip,'userCES':data.userCES,'userType':data.userType};
                userNamesL2TM["A"+data.userCES] = {'username':data.name,'userID':data.userID,'ip':data.ip,'userCES':data.userCES,'userType':data.userType};
            }catch(err){
                console.log(err);
            }
            userObjectL2={};
            Object.keys(userNamesL2).forEach( (element) => {
                userObjectL2[element]=userNamesL2[element];
            });
            io.emit('chat listL2', userObjectL2);
        }
        if(data.userType=='TM'){
            try{
                userNamesL2TM["A"+data.userCES] = {'username':data.name,'userID':data.userID,'ip':data.ip,'userCES':data.userCES,'userType':data.userType};
            }catch(err){
                console.log(err);
            }
        }
        chatCCTConsult.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${userID}`).emit('chatcctconsult open queue');
                }
            }catch(err){
                console.log(err);
            }
        });

        chatCCTConsultQueue.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${element.userID}`).emit('chatcctconsult open queue');
                }
            }catch(err){
                console.log(err);
            }
        });
        
        chatConsultL2.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${userID}`).emit('chatconsult open queue');
                    saveLogin('L2',userCES,Date.now(),'out');
                }
            }catch(err){
                console.log(err);
            }
        });

        chatConsultQueue.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${element.userID}`).emit('chatconsult open queue');
                }
            }catch(err){
                console.log(err);
            }
        });

        chatRmaApprovalL2TM.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${userID}`).emit('chatrmaapproval open queue');
                    saveLogin('L2',userCES,Date.now(),'out');
                }
            }catch(err){
                console.log(err);
            }
        });

        chatRmaApprovalQueue.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${element.userID}`).emit('chatrmaapproval open queue');
                }
            }catch(err){
                console.log(err);
            }
        });

        chatTrainees.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${userID}`).emit('chattrainer open queue');
                }
            }catch(err){
                console.log(err);
            }
        });

        chatTrainees2.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${userID}`).emit('chattrainer open queue');
                }
            }catch(err){
                console.log(err);
            }
        });

        chatTrainerQueue.forEach(function(element){
            try{
                if(element.user_CN==data.user.users_CN){
                    element.userID=userID;
                    io.to(`${element.userID}`).emit('chattrainer open queue');
                }
            }catch(err){
                console.log(err);
            }
        });
        
        io.to(`${userID}`).emit('chatconsult queue', {'queue':chatConsultQueue});
        io.to(`${userID}`).emit('chatconsult l2avail', {'l2avail':chatConsultL2})

        io.to(`${userID}`).emit('chatrmaapproval queue', {'queue':chatRmaApprovalQueue});
        io.to(`${userID}`).emit('chatrmapproval l2avail', {'l2avail':chatRmaApprovalL2TM})

        io.to(`${userID}`).emit('chatcctconsult queue', {'cctqueue':chatCCTConsultQueue});
        io.to(`${userID}`).emit('chatcctconsult cctavail', {'cctavail':chatCCTConsult})

        io.to(`${userID}`).emit('chattrainer queue', {'queue':chatTrainerQueue});
        io.to(`${userID}`).emit('chattrainer avail', {'avail':chatTrainees.concat(chatTrainees2)})

        fs.writeFile('chatcctavail.txt',JSON.stringify(chatCCTConsult), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.writeFile('chatcctqueue.txt',JSON.stringify(chatCCTConsultQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.writeFile('chatL2avail.txt',JSON.stringify(chatConsultL2), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.writeFile('chatqueue.txt',JSON.stringify(chatConsultQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });

        fs.writeFile('chatRmaApprovalL2avail.txt',JSON.stringify(chatRmaApprovalL2TM), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.writeFile('chatRmaApprovalqueue.txt',JSON.stringify(chatRmaApprovalQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });


        fs.writeFile('chattraineeavail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
            if (err) console.log(err);
        });

        fs.writeFile('chattraineeavail2.txt',JSON.stringify(chatTrainees2), 'utf8',	function(err) { 
            if (err) console.log(err);
        });

        fs.writeFile('chattrainerqueue.txt',JSON.stringify(chatTrainerQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });

        console.log("userNamesL2TM");
        console.log(userNamesL2TM);
    });

    socket.on('rta message', function(data) {
        try{
            console.log(data.user);
            io.to(`${data.user}`).emit('message from rta', data.type);
        }catch(error){

        }
        console.log(data);
        
    });
    
    socket.on('setSocketId', function(data) {
        try{
            //console.log(data.user["users_CES"]);
            users.push(data);
            console.log(data.user["users_CN"] + " connected");
        }catch(error){
         
        }
        //console.log(users);
        io.to(`${userID}`).emit('ip address', ip);
    });

    socket.on('aux request', function(name,message,auxtype,auxtime,auxid) {
        console.log('aux request')
        try{
            //console.log(data.user["users_CES"]);
            io.emit('aux request',{name:name,message:message,auxtype:auxtype,auxtime:auxtime,auxid:auxid});
            //io.to(`${auxid}`).emit('aux request',{name:name,message:message,auxtype:auxtype,auxtime:auxtime,auxid:auxid});
        }catch(error){
         
        }
        //console.log(users);
    });

    socket.on('aux approve', function(data) {

        Object.keys(userNames).forEach( (element) => {
            if(userNames[element].userType=='RTA')
                io.to(`${userNames["A"+userNames[element].userCES].userID}`).emit('aux approved request',{auxid:data.auxid,message:data.message});
                //RTAlist[element]=userNames[element];
        });

        try{
            
            io.to(`${userNames["A"+data.auxid.split("-")[0]].userID}`).emit('aux approved request',{auxid:data.auxid,message:data.message});
        }catch(error){
         
        }
        //console.log(users);
    });

    socket.on('aux disapprove', function(data) {
        Object.keys(userNames).forEach( (element) => {
            if(userNames[element].userType=='RTA')
                io.to(`${userNames["A"+userNames[element].userCES].userID}`).emit('aux disapproved request',{auxid:data.auxid,message:data.message});
                //RTAlist[element]=userNames[element];
        });
        
        try{
            io.to(`${userNames["A"+data.auxid.split("-")[0]].userID}`).emit('aux disapproved request',{auxid:data.auxid,message:data.message});
        }catch(error){
         
        }
        //console.log(users);
    });

    socket.on('disconnect', function(reason){
        console.log(userID + " disconnected")
        var userCES;
        try{
            Object.keys(userNames).forEach(function(element){
                if(userNames[element].userID==userID){
                    userCES=userNames[element].userCES;
                    console.log('deleting');
                    console.log(userNames[element]);
                    delete userNames[element];
                };
            })

            //userNames.splice(userNames.indexOf(userNames.find(o => o.userID == userID)),1);

        }catch(err){
            console.log(err);
        }
        if(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID))>=0){
            chatCCTConsultQueue.splice(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chatcctqueue.txt',JSON.stringify(chatCCTConsultQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatcctconsult queue', {'cctqueue':chatCCTConsultQueue})
        }

        if(chatCCTConsult.indexOf(chatCCTConsult.find(o => o.userID == userID))>=0){
            chatCCTConsult.splice(chatCCTConsult.indexOf(chatCCTConsult.find(o => o.userID == userID)),1);
            saveLogin('CCT',userCES,Date.now(),'out');
            fs.writeFile('chatcctavail.txt',JSON.stringify(chatCCTConsult), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatcctconsult cctavail', {'cctavail':chatCCTConsult})
        }

        
        roomCCTConsult.forEach(function(element){
            var content=''
            console.log(element)
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatcctconsults/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatcctconsults/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.sockets.in(element.name).emit('chatcctconsult disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content,"room":element.name});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })



        if(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID))>=0){
            chatConsultQueue.splice(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chatqueue.txt',JSON.stringify(chatConsultQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatconsult queue', {'queue':chatConsultQueue})
        }

        if(chatConsultL2.indexOf(chatConsultL2.find(o => o.userID == userID))>=0){
            chatConsultL2.splice(chatConsultL2.indexOf(chatConsultL2.find(o => o.userID == userID)),1);
            saveLogin('L2',userCES,Date.now(),'out');
            fs.writeFile('chatL2avail.txt',JSON.stringify(chatConsultL2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatconsult l2avail', {'l2avail':chatConsultL2})
        }
        //console.log(users)
        //console.log('disconnected:' + users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN)

        roomConsult.forEach(function(element){
            console.log(element);
            var content=''
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatconsults/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatconsults/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.sockets.in(element.name).emit('chatconsult disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content,"room":element.name});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })

        if(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID))>=0){
            chatRmaApprovalQueue.splice(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chatRmaApprovalqueue.txt',JSON.stringify(chatRmaApprovalQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatrmaapproval queue', {'queue':chatRmaApprovalQueue})
        }

        if(chatRmaApprovalL2TM.indexOf(chatRmaApprovalL2TM.find(o => o.userID == userID))>=0){
            chatRmaApprovalL2TM.splice(chatRmaApprovalL2TM.indexOf(chatRmaApprovalL2TM.find(o => o.userID == userID)),1);
            saveLogin('L2',userCES,Date.now(),'out');
            fs.writeFile('chatRmaApprovalL2avail.txt',JSON.stringify(chatRmaApprovalL2TM), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatrmaapproval l2avail', {'l2avail':chatRmaApprovalL2TM})
        }
        //console.log(users)
        //console.log('disconnected:' + users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN)

        roomRmaApproval.forEach(function(element){
            console.log(element);
            var content=''
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatrmaapproval/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatrmaapproval/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.sockets.in(element.name).emit('chatrmaapproval disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content,"room":element.name});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })


        // chat trainer

        if(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID))>=0){
            chatTrainerQueue.splice(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chattrainerqueue.txt',JSON.stringify(chatTrainerQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chattrainer queue', {'queue':chatTrainerQueue})
        }

        if(chatTrainees.indexOf(chatTrainees.find(o => o.userID == userID))>=0){
            chatTrainees.splice(chatTrainees.indexOf(chatTrainees.find(o => o.userID == userID)),1);
            fs.writeFile('chattraineeavail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
        }
        
        if (chatTrainees2.indexOf(chatTrainees2.find(o => o.userID == userID))>=0){
            chatTrainees2.splice(chatTrainees2.indexOf(chatTrainees2.find(o => o.userID == userID)),1);
            fs.writeFile('chattraineeavail2.txt',JSON.stringify(chatTrainees2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
        }
       
        io.emit('chattrainer avail', {'avail':chatTrainees.concat(chatTrainees2)})

        try{
            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                io.emit('chattrainer disconnected', users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN);
        }catch(err){
            console.log(err);
        }finally{
            roomTrainer.forEach(function(element){
                if((element.participants.traineruser==userID)||(element.participants.traineeuser==userID)){
                    try{
                        fs.appendFile(__dirname+'/chattrainer/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected.#%#\n', 'utf8',	function(err) { 
                            if (err) console.log(err);
                        });
                    }catch(err){
                        console.log(err);
                    }
                }
            })
        }

        
        if(users.indexOf(users.find(o => o.userID == userID))>=0)
            users.splice(users.indexOf(users.find(o => o.userID == userID)),1);
        userObject={};

        Object.keys(userNames).forEach( (element) => {
            userObject[element]=userNames[element];
        });

        io.emit('chat list', userObject);
        //console.log(userObject);
        
        try{
            Object.keys(userNamesL2).forEach(function(element){
                if(userNamesL2[element].userID==userID){
                    delete userNamesL2[element];
                };
            })
        }catch(err){

        }

        userObjectL2={};
        Object.keys(userNamesL2).forEach( (element) => {
            userObjectL2[element]=userNamesL2[element];
        });
        io.emit('chat listL2', userObjectL2);
    });

    socket.on('disconnect me', function(ces){
        try{
            Object.keys(userNames).forEach(function(element){
                if(userNames[element].userID==userID){
                    delete userNames[element];
                };
            })

        }catch(err){
            console.log(err);
        }




// l2chat consult
        
        if(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID))>=0)
            chatConsultQueue.splice(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID)),1);
        fs.writeFile('chatqueue.txt',JSON.stringify(chatConsultQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chatconsult queue', {'queue':chatConsultQueue})
        console.log('L1m');
        console.log(chatConsultQueue);

        if(chatConsultL2.indexOf(chatConsultL2.find(o => o.userID == userID))>=0)
            chatConsultL2.splice(chatConsultL2.indexOf(chatConsultL2.find(o => o.userID == userID)),1);
        fs.writeFile('chatL2avail.txt',JSON.stringify(chatConsultL2), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chatconsult l2avail', {'l2avail':chatConsultL2})
        console.log('L2m');
        console.log(chatConsultL2);

// rmapproval
        
        if(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID))>=0)
            chatRmaApprovalQueue.splice(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID)),1);
        fs.writeFile('chatRmaApprovalqueue.txt',JSON.stringify(chatRmaApprovalQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chatrmaapproval queue', {'queue':chatRmaApprovalQueue})
        console.log('L1RMA');
        console.log(chatRmaApprovalQueue);

        if(chatRmaApprovalL2TM.indexOf(chatRmaApprovalL2TM.find(o => o.userID == userID))>=0)
            chatRmaApprovalL2TM.splice(chatRmaApprovalL2TM.indexOf(chatRmaApprovalL2TM.find(o => o.userID == userID)),1);
        fs.writeFile('chatRmaApprovalL2avail.txt',JSON.stringify(chatRmaApprovalL2TM), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chatrmaapproval l2avail', {'l2avail':chatRmaApprovalL2TM})
        console.log('L2mRMA');
        console.log(chatRmaApprovalL2TM);


        roomRmaApproval.forEach(function(element){
            console.log(element);
            var content=''
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatrmaapproval/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatrmaapproval/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.sockets.in(element.name).emit('chatrmaapproval disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content,"room":element.name});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })

// cct consult
        if(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID))>=0){
            chatCCTConsultQueue.splice(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chatcctqueue.txt',JSON.stringify(chatCCTConsultQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatcctconsult queue', {'cctqueue':chatCCTConsultQueue})
        }

        if(chatCCTConsult.indexOf(chatCCTConsult.find(o => o.userID == userID))>=0){
            chatCCTConsult.splice(chatCCTConsult.indexOf(chatCCTConsult.find(o => o.userID == userID)),1);
            fs.writeFile('chatcctavail.txt',JSON.stringify(chatCCTConsult), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatcctconsult cctavail', {'cctavail':chatCCTConsult})
        }

        roomCCTConsult.forEach(function(element){
            var content=''
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatcctconsults/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatcctconsults/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.emit('chatcctconsult disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })

// chat trainer

        if(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID))>=0)
            chatTrainerQueue.splice(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID)),1);
        fs.writeFile('chattrainerqueue.txt',JSON.stringify(chatTrainerQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chattrainer queue', {'queue':chatTrainerQueue})
        console.log('L1m');
        console.log(chatTrainerQueue);

        if(chatTrainees.indexOf(chatTrainees.find(o => o.userID == userID))>=0)
            chatTrainees.splice(chatTrainees.indexOf(chatTrainees.find(o => o.userID == userID)),1);
        fs.writeFile('chatL2avail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chattrainer avail', {'avail':chatTrainees})
        console.log('L2m');
        console.log(chatTrainees);

        if(users.indexOf(users.find(o => o.userID == userID))>=0)
        users.splice(users.indexOf(users.find(o => o.userID == userID)),1);
        var userObject={};

        Object.keys(userNames).forEach( (element) => {
            userObject[element]=userNames[element];
        });

        io.emit('chat list', userObject);
        
        try{
            Object.keys(userNamesL2).forEach(function(element){
                if(userNamesL2[element].userID==userID){
                    delete userNamesL2[element];
                };
            })
        }catch(err){

        }

        var userObjectL2={};
        Object.keys(userNamesL2).forEach( (element) => {
            userObjectL2[element]=userNamesL2[element];
        });
        io.emit('chat listL2', userObjectL2);
    });
    
    socket.on('chat message', function(expertname,msg){
        io.emit('chat message', expertname,msg);
        console.log(userID + ' ' + expertname);
        var stream = fs.createWriteStream("chatlogs.txt", {flags:'a'});
        stream.write(new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}) + ' # ' + userID + ' # ' + expertname +' : ' + msg + '\n');
        stream.close();
        io.to(`${userID}`).emit('ip address', ip);
    });

    socket.on('chat messageL2', function(expertname,msg){
        io.emit('chat messageL2', expertname,msg);
        console.log(userID + ' ' + expertname);
        var stream = fs.createWriteStream("chatlogsL2.txt", {flags:'a'});
        stream.write(new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}) + ' # ' + userID + ' # ' + expertname +' : ' + msg + '\n');
        stream.close();
        io.to(`${userID}`).emit('ip address', ip);
    });

    socket.on('chat message server', function(expertname,msg){
        io.emit('chat message', expertname,msg);
        var stream = fs.createWriteStream("chatlogs.txt", {flags:'a'});
        stream.write(new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}) + ' # ' + userID + ' # ' + expertname +' : ' + msg + '\n');
        stream.close();
    });
    
    socket.on('new update', function(){
        io.emit('new update');
        console.log('emit new update from other server');
    });

    //l2 chat consult
    socket.on('chatconsult enqueue', function(userCN,user,casenumber,inquiry){
        chatConsultQueue.push({user_CN:userCN,userID:user,casenumber:casenumber,inquiry:inquiry});
        console.log(chatConsultQueue);
        io.emit('chatconsult queue', {'queue':chatConsultQueue});
        io.emit('chatconsult l2avail', {'l2avail':chatConsultL2});
        fs.writeFile('chatqueue.txt',JSON.stringify(chatConsultQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
    })

    socket.on('chatconsult cancel', function(){
        if(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID))>=0)
            chatConsultQueue.splice(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID)),1);
        fs.writeFile('chatqueue.txt',JSON.stringify(chatConsultQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chatconsult queue', {'queue':chatConsultQueue})
    })

    socket.on('chatconsult l2avail', function(userCN,user,userCES,avail){
        var found=false;
        if(avail=='avail'){
            chatConsultL2.forEach(function(element){
                console.log(element);
                console.log(userCN);
                if(element.user_CN==userCN){
                    found=true;
                    element.userID=user;
                    fs.writeFile('chatL2avail.txt',JSON.stringify(chatConsultL2), 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                }
            });
            if(!found)
                chatConsultL2.push({user_CN:userCN,userID:user});
            io.emit('chatconsult queue', {'queue':chatConsultQueue})
            io.emit('chatconsult l2avail', {'l2avail':chatConsultL2})
            fs.writeFile('chatL2avail.txt',JSON.stringify(chatConsultL2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });

            saveLogin('L2',userCES,Date.now(),'in')
            //console.log(req.body);
            
        }else{
            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                chatConsultL2.splice(chatConsultL2.indexOf(chatConsultL2.find(o => o.userID == userID)),1);
            console.log(chatConsultL2);
            fs.writeFile('chatL2avail.txt',JSON.stringify(chatConsultL2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatconsult l2avail', {'l2avail':chatConsultL2})
            saveLogin('L2',userCES,Date.now(),'out')
        }
    })

    socket.on('chatconsult getconsult', function(userCN,user){
        var room=Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        //Math.random().toString(36).slice(-8);
        console.log(room);
        try{
            var participants={L2:userCN,L2user:user,expert:chatConsultQueue[0].user_CN,expertuser:chatConsultQueue[0].userID}
        }catch(err){
            console.log(err);
        }
        io.to(`${user}`).emit('chatconsult joinroom', room, JSON.stringify(participants),chatConsultQueue[0].casenumber,chatConsultQueue[0].inquiry);
        io.to(`${chatConsultQueue[0].userID}`).emit('chatconsult joinroom', room, JSON.stringify(participants),chatConsultQueue[0].casenumber,chatConsultQueue[0].inquiry);
        roomConsult.push({'name':room,'participants':participants});
        fs.appendFile(__dirname+'/chatconsults/chatconsultrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomConsult)+'###Room opened#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.appendFile(__dirname+'/chatconsults/'+room+'.txt',room+"###"+(new Date()).getTime()+"###"+chatConsultQueue[0].casenumber+'###'+chatConsultQueue[0].inquiry+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
    })

    socket.on('chatconsult joinserver room', function(room, participants){
        socket.join(room);

        if(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID))>=0){
            chatConsultQueue.splice(chatConsultQueue.indexOf(chatConsultQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chatqueue.txt',JSON.stringify(chatConsultQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatconsult queue', {'queue':chatConsultQueue})
        }
/*
        if(chatConsultL2.indexOf(chatConsultL2.find(o => o.userID == userID))>=0){
            chatConsultL2.splice(chatConsultL2.indexOf(chatConsultL2.find(o => o.userID == userID)),1);
            fs.writeFile('chatL2avail.txt',JSON.stringify(chatConsultL2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatconsult l2avail', {'l2avail':chatConsultL2})
        }*/
    })

    socket.on('chatconsult message', function(room, expert, message){
        console.log(room);
        console.log(expert);
        console.log(message);
        fs.appendFile(__dirname+'/chatconsults/'+room+'.txt',(new Date()).getTime()+'###'+expert+'###'+message+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.sockets.in(room).emit('chatconsult message',expert,message,room);
    });

    socket.on('chatconsult gettranscript', function(room){
        try{
            var content = fs.readFileSync(__dirname+'/chatconsults/'+room+'.txt','utf8');
            io.to(userID).emit('chatconsult gettranscript',content);
        }catch(err){
            console.log(err);
        }
        //var transcript
    
    });

    socket.on('chatconsult closeroom', function(room){
        roomConsult.forEach(function(element){
            var content=''
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatconsults/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatconsults/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.emit('chatconsult disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content,"room":room});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })

        if(roomConsult.indexOf(roomConsult.find(o => o.name == room))>=0){
            roomConsult.splice(roomConsult.indexOf(roomConsult.find(o => o.name == room)),1);
            fs.appendFile(__dirname+'/chatconsults/chatconsultrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomConsult)+'###Room closed#%#', 'utf8',	function(err) { 
                if (err) console.log(err);
            });
        }
        try{
            var content = fs.readFileSync(__dirname+'/chatconsults/'+room+'.txt','utf8');
            io.to(userID).emit('chatconsult gettranscript',content);
        }catch(err){
            console.log(err);
        }
        //var transcript
    });
//////////////// cct consult
    socket.on('chatcctconsult enqueue', function(userCN,user,casenumber,inquiry){
        chatCCTConsultQueue.push({user_CN:userCN,userID:user,casenumber:casenumber,inquiry:inquiry});
        console.log(chatCCTConsultQueue);
        io.emit('chatcctconsult queue', {'cctqueue':chatCCTConsultQueue});
        io.emit('chatcctconsult cctavail', {'cctavail':chatCCTConsult});
        fs.writeFile('chatcctqueue.txt',JSON.stringify(chatCCTConsultQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
    })

    socket.on('chatcctconsult cancel', function(){
        if(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID))>=0)
            chatCCTConsultQueue.splice(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID)),1);
        fs.writeFile('chatcctqueue.txt',JSON.stringify(chatCCTConsultQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chatcctconsult queue', {'cctqueue':chatCCTConsultQueue})
        console.log(chatCCTConsultQueue);
    })

    socket.on('chatcctconsult cctavail', function(userCN,user,userCES,avail){
        var found=false;
        if(avail=='avail'){
            chatCCTConsult.forEach(function(element){
                console.log(element);
                console.log(userCN);
                if(element.user_CN==userCN){
                    found=true;
                    element.userID=user;
                    fs.writeFile('chatcctavail.txt',JSON.stringify(chatCCTConsult), 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                }
            });
            if(!found)
                chatCCTConsult.push({user_CN:userCN,userID:user});
            io.emit('chatcctconsult queue', {'cctqueue':chatCCTConsultQueue})
            io.emit('chatcctconsult cctavail', {'cctavail':chatCCTConsult})
            fs.writeFile('chatcctavail.txt',JSON.stringify(chatCCTConsult), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            saveLogin('CCT',userCES,Date.now(),'in');
        }else{
            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                chatCCTConsult.splice(chatCCTConsult.indexOf(chatCCTConsult.find(o => o.userID == userID)),1);
            console.log(chatCCTConsult);
            fs.writeFile('chatcctavail.txt',JSON.stringify(chatCCTConsult), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatcctconsult cctavail', {'cctavail':chatCCTConsult})
            saveLogin('CCT',userCES,Date.now(),'out');
        }
    })

    socket.on('chatcctconsult getcctconsult', function(userCN,user){
        var room=Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        //Math.random().toString(36).slice(-8);
        console.log(room);
        try{
            var participants={L2:userCN,L2user:user,expert:chatCCTConsultQueue[0].user_CN,expertuser:chatCCTConsultQueue[0].userID}
        }catch(err){
            console.log(err);
        }
        console.log(chatCCTConsultQueue);
        io.to(`${user}`).emit('chatcctconsult joinroom', room, JSON.stringify(participants),chatCCTConsultQueue[0].casenumber,chatCCTConsultQueue[0].inquiry);
        io.to(`${chatCCTConsultQueue[0].userID}`).emit('chatcctconsult joinroom', room, JSON.stringify(participants),chatCCTConsultQueue[0].casenumber,chatCCTConsultQueue[0].inquiry);
        roomCCTConsult.push({'name':room,'participants':participants});
        fs.appendFile(__dirname+'/chatcctconsults/chatcctconsultrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomConsult)+'###Room opened#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.appendFile(__dirname+'/chatcctconsults/'+room+'.txt',room+"###"+(new Date()).getTime()+"###"+chatCCTConsultQueue[0].casenumber+'###'+chatCCTConsultQueue[0].inquiry+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
    })

    socket.on('chatcctconsult joinserver room', function(room, participants){
        socket.join(room);

        if(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID))>=0){
            chatCCTConsultQueue.splice(chatCCTConsultQueue.indexOf(chatCCTConsultQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chatcctqueue.txt',JSON.stringify(chatCCTConsultQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatcctconsult queue', {'cctqueue':chatCCTConsultQueue})
        }
/*
        if(chatCCTConsult.indexOf(chatCCTConsult.find(o => o.userID == userID))>=0){
            chatCCTConsult.splice(chatCCTConsult.indexOf(chatCCTConsult.find(o => o.userID == userID)),1);
            fs.writeFile('chatcctavail.txt',JSON.stringify(chatCCTConsult), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatconsult cctavail', {'cctavail':chatCCTConsult})
        }*/
    })

    socket.on('chatcctconsult message', function(room, expert, message){
        console.log(room);
        console.log(expert);
        console.log(message);
        fs.appendFile(__dirname+'/chatcctconsults/'+room+'.txt',(new Date()).getTime()+'###'+expert+'###'+message+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.sockets.in(room).emit('chatcctconsult message',expert,message,room);
    });

    socket.on('chatcctconsult gettranscript', function(room){
        try{
            var content = fs.readFileSync(__dirname+'/chatcctconsults/'+room+'.txt','utf8');
            io.to(userID).emit('chatcctconsult gettranscript',content);
        }catch(err){
            console.log(err);
        }
        //var transcript
    
    });

    socket.on('chatcctconsult closeroom', function(room){
        roomCCTConsult.forEach(function(element){
            var content=''
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatcctconsults/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatcctconsults/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.emit('chatcctconsult disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content,"room":room});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })

        if(roomCCTConsult.indexOf(roomCCTConsult.find(o => o.name == room))>=0){
            roomCCTConsult.splice(roomCCTConsult.indexOf(roomCCTConsult.find(o => o.name == room)),1);
            fs.appendFile(__dirname+'/chatcctconsults/chatcctconsultrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomCCTConsult)+'###Room closed#%#', 'utf8',	function(err) { 
                if (err) console.log(err);
            });
        }
        try{
            var content = fs.readFileSync(__dirname+'/chatcctconsults/'+room+'.txt','utf8');
            io.to(userID).emit('chatcctconsult gettranscript',content);
        }catch(err){
            console.log(err);
        }
        //var transcript
    });

    ///////////////////////////////////////chat trainer
    socket.on('chattrainer enqueue', function(userCN,user,FN,LN,email,product,subproduct){
        chatTrainerQueue.push({user_CN:userCN,userID:user,FN:FN,LN:LN,email:email,product:product,subproduct:subproduct});
        console.log(chatTrainerQueue);
        io.emit('chattrainer queue', {'queue':chatTrainerQueue});
        io.emit('chattrainer avail', {'avail':chatTrainees});
        fs.writeFile('chattrainerqueue.txt',JSON.stringify(chatTrainerQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        checkQueue();
        
    })

    function createRoom(){
        var room=Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
            //Math.random().toString(36).slice(-8);
        console.log(room);
        console.log(chatTrainerQueue);
        var participants={trainee:chatTrainees.length>0?chatTrainees[0].user_CN:chatTrainees2[0].user_CN,traineeuser:chatTrainees.length>0?chatTrainees[0].userID:chatTrainees2[0].userID,trainer:chatTrainerQueue[0].user_CN,traineruser:chatTrainerQueue[0].userID}
        if(chatTrainees.length>0){
            io.to(`${chatTrainees[0].userID}`).emit('chattrainer joinroom', room, JSON.stringify(participants),chatTrainerQueue[0].FN,chatTrainerQueue[0].LN,chatTrainerQueue[0].email,chatTrainerQueue[0].product,chatTrainerQueue[0].subproduct);
        }else{
            io.to(`${chatTrainees2[0].userID}`).emit('chattrainer joinroom', room, JSON.stringify(participants),chatTrainerQueue[0].FN,chatTrainerQueue[0].LN,chatTrainerQueue[0].email,chatTrainerQueue[0].product,chatTrainerQueue[0].subproduct);
        }
        io.to(`${chatTrainerQueue[0].userID}`).emit('chattrainer joinroom', room, JSON.stringify(participants),chatTrainerQueue[0].FN,chatTrainerQueue[0].LN,chatTrainerQueue[0].email,chatTrainerQueue[0].product,chatTrainerQueue[0].subproduct);
        roomTrainer.push({'name':room,'participants':participants});
        fs.appendFile(__dirname+'/chattrainer/chattrainerrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomTrainer)+'###Room opened#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.appendFile(__dirname+'/chattrainer/'+room+'.txt',room+"###"+(new Date()).getTime()+"###"+chatTrainerQueue[0].FN+'###'+chatTrainerQueue[0].LN+chatTrainerQueue[0].email+'###'+chatTrainerQueue[0].product+'###'+chatTrainerQueue[0].subproduct+'###'+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
    }

    

    socket.on('chattrainer cancel', function(){
        if(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID))>=0)
            chatTrainerQueue.splice(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID)),1);
        fs.writeFile('chattrainerqueue.txt',JSON.stringify(chatTrainerQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chattrainerconsult queue', {'queue':chatTrainerQueue})
    })

    socket.on('chattrainer avail', function(userCN,user,avail){
        var found1=false;
        var found2=false;
        if(avail=='avail'){
            traineeAvail=true;
            chatTrainees.forEach(function(element){
                console.log(element);
                console.log(userCN);
                if(element.user_CN==userCN){
                    found1=true;
                    element.userID=user;
                    fs.writeFile('chattraineeavail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                }
            });
            chatTrainees2.forEach(function(element){
                console.log(element);
                console.log(userCN);
                if(element.user_CN==userCN){
                    found2=true;
                    element.userID=user;
                    fs.writeFile('chattraineeavail2.txt',JSON.stringify(chatTrainees2), 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                }
            });
            if(!found1){
                chatTrainees.push({user_CN:userCN,userID:user});
            }
            if(!found2){
                chatTrainees2.push({user_CN:userCN,userID:user});
            }
            io.emit('chattrainer queue', {'queue':chatTrainerQueue})
            io.emit('chattrainer avail', {'avail':chatTrainees.concat(chatTrainees2)})
            fs.writeFile('chattraineeavail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            fs.writeFile('chattraineeavail2.txt',JSON.stringify(chatTrainees2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            checkQueue();
        }else{
            traineeAvail=false;
            if(users.indexOf(users.find(o => o.userID == userID))>=0){
                chatTrainees.splice(chatTrainees.indexOf(chatTrainees.find(o => o.userID == userID)),1);
                chatTrainees2.splice(chatTrainees2.indexOf(chatTrainees2.find(o => o.userID == userID)),1);
            }
            console.log(chatTrainees);
            fs.writeFile('chattraineeavail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            fs.writeFile('chattraineeavail2.txt',JSON.stringify(chatTrainees2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chattrainer avail', {'avail':chatTrainees.concat(chatTrainees2)})
        }
    })

    socket.on('chattrainer joinserver room', function(room, participants){
        socket.join(room);

        if(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID))>=0){
            chatTrainerQueue.splice(chatTrainerQueue.indexOf(chatTrainerQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chattrainerqueue.txt',JSON.stringify(chatTrainerQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chattrainer queue', {'queue':chatTrainerQueue})
        }

        if(chatTrainees.indexOf(chatTrainees.find(o => o.userID == userID))>=0){
            chatTrainees.splice(chatTrainees.indexOf(chatTrainees.find(o => o.userID == userID)),1);
            fs.writeFile('chattraineeavail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chattrainer avail', {'avail':chatTrainees.concat(chatTrainees2)})
        }else if(chatTrainees2.indexOf(chatTrainees2.find(o => o.userID == userID))>=0){
            chatTrainees2.splice(chatTrainees2.indexOf(chatTrainees2.find(o => o.userID == userID)),1);
            fs.writeFile('chattraineeavail2.txt',JSON.stringify(chatTrainees2), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chattrainer avail', {'avail':chatTrainees.concat(chatTrainees2)})
        }
        console.log('joining room..');
        console.log(participants);
        console.log(JSON.parse(participants).traineeuser);
        console.log(userID);
        if(JSON.parse(participants).traineeuser==userID)
            checkQueue();
    })

    socket.on('chattrainer message', function(room, expert, message){
        console.log(room);
        console.log(expert);
        console.log(message);
        fs.appendFile(__dirname+'/chattrainer/'+room+'.txt',(new Date()).getTime()+'###'+expert+'###'+message+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.sockets.in(room).emit('chattrainer message',expert,message,room);
    });

    socket.on('chattrainer gettranscript', function(room){
        try{
            var content = fs.readFileSync(__dirname+'/chattrainer/'+room+'.txt','utf8');
            io.to(userID).emit('chattrainer gettranscript',content);
        }catch(err){
            console.log(err);
        }
        //var transcript
    });

    socket.on('chattrainer closeroom', function(room){
        var onQ1=false;
        var onQ2=false;
        try{
            if(users.indexOf(users.find(o => o.userID == userID))>=0)
            console.log('sending disconnect protocol');
                io.sockets.in(room).emit('chattrainer disconnected', users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,room);
        }catch(err){
            console.log(err);
        }finally{
            console.log(roomTrainer)
            roomTrainer.forEach(function(element){
                if(element.name==room){
                    try{
                        fs.appendFile(__dirname+'/chattrainer/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat training terminated.#%#\n', 'utf8',	function(err) { 
                            if (err) console.log(err);
                        });
                    }catch(err){
                        console.log(err);
                    }
                    if(element.participants.traineeuser==userID){
                        chatTrainees.forEach(function(element){
                            console.log(element);
                            if(element.userID==userID){
                                onQ1=true;
                                console.log("in Q1");
                            }
                        });
                        chatTrainees2.forEach(function(element){
                            console.log(element);
                            if(element.userID==userID){
                                onQ2=true;
                                console.log("in Q2");
                            }
                        });
                        if(traineeAvail){
                            if(!onQ1){
                                chatTrainees.push({user_CN:users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,userID:userID});
                            }else if(!onQ2){
                                chatTrainees2.push({user_CN:users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,userID:userID});
                            }
                        }
                        io.emit('chattrainer queue', {'queue':chatTrainerQueue})
                        io.emit('chattrainer avail', {'avail':chatTrainees.concat(chatTrainees2)})
                        fs.writeFile('chattraineeavail.txt',JSON.stringify(chatTrainees), 'utf8',	function(err) { 
                            if (err) console.log(err);
                        });
                        fs.writeFile('chattraineeavail2.txt',JSON.stringify(chatTrainees2), 'utf8',	function(err) { 
                            if (err) console.log(err);
                        });

                        if(roomTrainer.indexOf(roomTrainer.find(o => o.name == room))>=0){
                            roomTrainer.splice(roomTrainer.indexOf(roomTrainer.find(o => o.name == room)),1);
                            fs.appendFile(__dirname+'/chattrainer/chattrainerrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomTrainer)+'###Room closed#%#', 'utf8',	function(err) { 
                                if (err) console.log(err);
                            });
                        }

                        checkQueue();
                    }else{

                    }
                }
                
            })
        }
        try{
            var content = fs.readFileSync(__dirname+'/chattrainer/'+room+'.txt','utf8');
            io.to(userID).emit('chattrainer gettranscript',content);
        }catch(err){
            console.log(err);
        }
        
        //var transcript

        
    });

    function checkQueue(){
        console.log('checking queue:');
        console.log(chatTrainerQueue);
        console.log(chatTrainees);
        console.log(chatTrainees2);
        setTimeout(function(){
            if(chatTrainerQueue.length>0){
                if((chatTrainees.length>0)||(chatTrainees2.length>0)){
                    createRoom();
                }else{
                    
                }
            }
        },2000);
    }

// rma approval socket functions
    socket.on('chatrmaapproval enqueue', function(userCN,user,casenumber,inquiry){
        chatRmaApprovalQueue.push({user_CN:userCN,userID:user,casenumber:casenumber,inquiry:inquiry});
        console.log(chatRmaApprovalQueue);
        io.emit('chatrmaapproval queue', {'queue':chatRmaApprovalQueue});
        io.emit('chatrmaapproval l2avail', {'l2avail':chatRmaApprovalL2TM});
        fs.writeFile('chatRmaApprovalqueue.txt',JSON.stringify(chatRmaApprovalQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
    })

    socket.on('chatrmaapproval cancel', function(){
        if(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID))>=0)
            chatRmaApprovalQueue.splice(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID)),1);
        fs.writeFile('chatRmaApprovalqueue.txt',JSON.stringify(chatRmaApprovalQueue), 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.emit('chatrmaapproval queue', {'queue':chatRmaApprovalQueue})
    })

    socket.on('chatrmaapproval l2avail', function(userCN,user,userCES,avail){
        console.log(chatRmaApprovalL2TM)
        var found=false;
        if(avail=='avail'){
            chatRmaApprovalL2TM.forEach(function(element){
                console.log(element);
                console.log(userCN);
                if(element.user_CN==userCN){
                    found=true;
                    element.userID=user;
                    fs.writeFile('chatRmaApprovalL2avail.txt',JSON.stringify(chatRmaApprovalL2TM), 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                }
            });
            if(!found)
                chatRmaApprovalL2TM.push({user_CN:userCN,userID:user});
            io.emit('chatrmaapproval queue', {'queue':chatRmaApprovalQueue})
            io.emit('chatrmaapproval l2avail', {'l2avail':chatRmaApprovalL2TM})
            fs.writeFile('chatRmaApprovalL2avail.txt',JSON.stringify(chatRmaApprovalL2TM), 'utf8',	function(err) { 
                if (err) console.log(err);
            });

            saveLogin('L2',userCES,Date.now(),'in')
            //console.log(req.body);
            console.log(chatRmaApprovalL2TM);
        }else{
            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                chatRmaApprovalL2TM.splice(chatRmaApprovalL2TM.indexOf(chatRmaApprovalL2TM.find(o => o.userID == userID)),1);
            console.log(chatRmaApprovalL2TM);
            fs.writeFile('chatRmaApprovalL2avail.txt',JSON.stringify(chatRmaApprovalL2TM), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatrmaapproval l2avail', {'l2avail':chatRmaApprovalL2TM})
            saveLogin('L2',userCES,Date.now(),'out')
        }
    })

    socket.on('chatrmaapproval getconsult', function(userCN,user){
        var room=Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        //Math.random().toString(36).slice(-8);
        console.log(room);
        console.log(user);
        try{
            var participants={L2:userCN,L2user:user,expert:chatRmaApprovalQueue[0].user_CN,expertuser:chatRmaApprovalQueue[0].userID}
        }catch(err){
            console.log(err);
        }
        console.log(participants);
        io.to(`${user}`).emit('chatrmaapproval joinroom', room, JSON.stringify(participants),chatRmaApprovalQueue[0].casenumber,chatRmaApprovalQueue[0].inquiry);
        io.to(`${chatRmaApprovalQueue[0].userID}`).emit('chatrmaapproval joinroom', room, JSON.stringify(participants),chatRmaApprovalQueue[0].casenumber,chatRmaApprovalQueue[0].inquiry);
        roomRmaApproval.push({'name':room,'participants':participants});
        fs.appendFile(__dirname+'/chatrmaapproval/chatrmaapprovalrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomConsult)+'###Room opened#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        fs.appendFile(__dirname+'/chatrmaapproval/'+room+'.txt',room+"###"+(new Date()).getTime()+"###"+chatRmaApprovalQueue[0].casenumber+'###'+chatRmaApprovalQueue[0].inquiry+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
    })

    socket.on('chatrmaapproval joinserver room', function(room, participants){
        console.log('joining room');
        socket.join(room);

        if(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID))>=0){
            chatRmaApprovalQueue.splice(chatRmaApprovalQueue.indexOf(chatRmaApprovalQueue.find(o => o.userID == userID)),1);
            fs.writeFile('chatRmaApprovalqueue.txt',JSON.stringify(chatRmaApprovalQueue), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatrmaapproval queue', {'queue':chatRmaApprovalQueue})
        }
/*
        if(chatRmaApprovalL2TM.indexOf(chatRmaApprovalL2TM.find(o => o.userID == userID))>=0){
            chatRmaApprovalL2TM.splice(chatRmaApprovalL2TM.indexOf(chatRmaApprovalL2TM.find(o => o.userID == userID)),1);
            fs.writeFile('chatRmaApprovalL2avail.txt',JSON.stringify(chatRmaApprovalL2TM), 'utf8',	function(err) { 
                if (err) console.log(err);
            });
            io.emit('chatrmaapproval l2avail', {'l2avail':chatRmaApprovalL2TM})
        }*/
    })

    socket.on('chatrmaapproval message', function(room, expert, message){
        console.log(room);
        console.log(expert);
        console.log(message);
        fs.appendFile(__dirname+'/chatrmaapproval/'+room+'.txt',(new Date()).getTime()+'###'+expert+'###'+message+'#%#', 'utf8',	function(err) { 
            if (err) console.log(err);
        });
        io.sockets.in(room).emit('chatrmaapproval message',expert,message,room);
    });

    socket.on('chatrmaapproval gettranscript', function(room){
        try{
            var content = fs.readFileSync(__dirname+'/chatrmaapproval/'+room+'.txt','utf8');
            io.to(userID).emit('chatrmaapproval gettranscript',content);
        }catch(err){
            console.log(err);
        }
        //var transcript
    
    });

    socket.on('chatrmaapproval closeroom', function(room){
        roomConsult.forEach(function(element){
            var content=''
            if((element.participants.L2user==userID)||(element.participants.expertuser==userID)){
                try{
                    fs.appendFile(__dirname+'/chatrmaapproval/'+element.name+'.txt',(new Date()).getTime()+'###Disconnected:###'+users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN+' has been disconnected. Chat consult terminated.#%#\n', 'utf8',	function(err) { 
                        if (err) console.log(err);
                    });
                    try{
                        content = fs.readFileSync(__dirname+'/chatrmaapproval/'+element.name+'.txt','utf8');
                    }catch(err){
                        console.log(err);
                    }finally{
                        try{
                            if(users.indexOf(users.find(o => o.userID == userID))>=0)
                                io.emit('chatrmaapproval disconnected', {"expert":users[users.indexOf(users.find(o => o.userID == userID))].user.users_CN,"transcript":content,"room":room});
                        }catch(err){
                            console.log(err);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        })

        if(roomConsult.indexOf(roomConsult.find(o => o.name == room))>=0){
            roomConsult.splice(roomConsult.indexOf(roomConsult.find(o => o.name == room)),1);
            fs.appendFile(__dirname+'/chatrmaapproval/chatRmaApprovalrooms.txt',(new Date()).getTime()+"###"+JSON.stringify(roomConsult)+'###Room closed#%#', 'utf8',	function(err) { 
                if (err) console.log(err);
            });
        }
        try{
            var content = fs.readFileSync(__dirname+'/chatrmaapproval/'+room+'.txt','utf8');
            io.to(userID).emit('chatrmaapproval gettranscript',content);
        }catch(err){
            console.log(err);
        }
        //var transcript
    });
    
});


//api



