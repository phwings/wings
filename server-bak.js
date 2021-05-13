"use strict";
//const server = 'localhost';
const server = '10.54.108.19';
const HTTP_PORT = 3001;
const  express  =  require('express');
const  bodyParser  =  require('body-parser');

const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 

const  app  =  express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const  router  =  express.Router();

app.set('view engine', 'pug');

const cookieParser = require('cookie-parser')

//const tokenList = {}

var db = require("./database.js")

const config = require('./config')

const http = require('http').createServer(app);
const checker = require('http');

var ioClient = require('socket.io-client');
var fs = require('fs')
var users=[];
var userNames=[];
var userNamesL2=[];
var serveIndex = require('serve-index');
//router.use(bodyParser.urlencoded({ extended:  false }));
//router.use(bodyParser.json());

app.use('/assets',express.static(__dirname + '/assets'));
app.use('/partials',express.static(__dirname + '/partials'));
app.use('/favicon.ico',express.static(__dirname + '/favicon.ico'));
app.use('/appsim.html',express.static(__dirname + '/appsim.html'));
app.use('/parser',express.static(__dirname + '/parser.html'));
app.use('/jsonviewer',express.static(__dirname + '/jsonviewer.html'));
app.use('/emergency',express.static(__dirname + '/splash.html'));
app.use('/splash.html',express.static(__dirname + '/splash.html'));
app.use('/assets/img/commendations',serveIndex(__dirname + '/assets/img/commendations'));
app.use('/assets/img/top/WE0125',serveIndex(__dirname + '/assets/img/top/WE0125'));
app.use('/assets/img/QAfyi',serveIndex(__dirname + '/assets/img/QAfyi'));

app.use(bodyParser.json());
app.use(cookieParser());

app.get("/api/issues", (req, res, next) => {
    var sql = "select * from issue"
    var params = []
    db.all(sql, params, (err, rows) => {
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
    db.all(sql, params, (err, rows) => {
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

app.get("/api/questions", (req, res, next) => {
    var sql = "select * from questions ORDER BY questions_id DESC"
    var params = []
    db.all(sql, params, (err, rows) => {
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



app.get("/api/callhandler/:issue_number", (req, res, next) => {
    var sql = "select * from issue where issue_number = ?"
    var params = [req.params.issue_number]
    db.get(sql, params, (err, row) => {
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
    db.all(sql, params, (err, rows) => {
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
    db.run(sql, params, function (err, result) {
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
    db.all(sql, params, (err, rows) => {
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
    console.log(data);
    var sql ='INSERT INTO endorsers (endorsers_week,endorsers_data) VALUES (?,?)'
    var params =[data.week, JSON.stringify(data.endorsers)]
	//console.log(sql);
    db.run(sql, params, function (err, result) {
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
    db.run(sql, params, function (err, result) {
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
    var sql ='INSERT INTO usage (usage_timestamp,usage_name, usage_ip) VALUES (?,?,?)'
    var params =[Date.now(), data.name, data.ip]
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
    db.run(sql, params, function (err, result) {
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
    db.run(sql, params, function (err, result) {
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
    db.run(sql, params, function (err, result) {
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

    db.all(sql, params, (err, rows) => {
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
    db.run(sql, params, function (err, result) {
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
            io.to(`${element.userId}`).emit('new escalation');
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
    
    console.log(data);
    var sql ='UPDATE escalations SET escalations_L1 = ?, escalations_L2 = ?, escalations_casenumber = ?, escalations_product= ?, escalations_invalid = ?, escalations_reason = ?, escalations_opportunity = ?, escalations_feedback = ?, escalations_commitment = ?, escalations_timestamp = ?, escalations_approved = ?, escalations_fornotify = ? WHERE escalations_id = ?'
    var params =[data.escalations_L1,data.escalations_L2,data.escalation_casenumber,data.escalation_product,data.escalation_invalid,data.escalation_invalidreason,data.escalation_opportunity,data.escalation_feedback,data.escalation_commitment,data.escalation_timestamp, data.escalation_approved, data.escalation_fornotify, data.escalations_id];
	//console.log(sql);
    db.run(sql, params, function (err, result) {
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
    console.log(req.body);
    var data = {
        escalations_id:req.body.escalation_id,
    }
    
    console.log(data);
    var sql ='DELETE FROM `escalations` WHERE `escalations_id`=?'
    var params =[data.escalations_id];
	//console.log(sql);
    db.run(sql, params, function (err, result) {
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
    var sql = "select * from escalations"
    var params = []
    db.all(sql, params, (err, rows) => {
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
    console.log(data.source);
    if(data.source=='L2'){
        var sql ='UPDATE escalations set escalations_remarks=? WHERE escalations_id=?'
    } else {
        var sql ='UPDATE escalations set escalations_remarks=?, escalations_approved="0", escalations_fornotify="0100" WHERE escalations_id=?'
    }
    console.log(sql);
    var params =[data.remarks, data.id]
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




app.get("/api/devices/:column/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from devices where `device_" + req.params.column + "` = ?"
    
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

app.get("/api/devices", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from devices"
    
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

app.get("/api/users/birthday/get", (req, res, next) => {
    var params = [];
    var sql = "select `users`.`users_CN`,`users`.`users_bday` from `users`"
    
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

app.get("/api/users/CES/:username", (req, res, next) => {
	var params = [req.params.username]
    //console.log(params);
    var sql = "select users_CES from users where `users_qa`=?"
    
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

app.get("/api/QA/CES/:CES", (req, res, next) => {
	var params = [req.params.CES]
    //console.log(params);
    var sql = "select * from qa where `qa_CES`=?"
    
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

app.get("/api/QA", (req, res, next) => {
	var params = []
    //console.log(params);
    var sql = "select * from qa"
    
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

app.get("/api/verify/:CES/:MN", (req, res, next) => {
	var params = [req.params.CES,req.params.MN]
    var sql = "select * from users where users_CES = ? and users_MN = ?"
    
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
    db.run(sql, params, function (err, result) {
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


app.get("/api/metric/:column/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from metrics where `metric-" + req.params.column + "` = ? ORDER BY `metric-Response-Completiondate` ASC"
    
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

app.get("/api/metric/names", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select DISTINCT `metric-Agent_Name`,`metric-CES` from metrics"
    
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

app.get("/api/metric/teams", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select *  from teams"
    
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

app.get("/api/metric/metricdate", (req, res, next) => {
	var params = [req.params.id]
    var sql = "SELECT `metric-Response-Completiondate` FROM metrics ORDER BY `metric-Response-Completiondate` DESC LIMIT 1"
    
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

// =================== updates

app.get("/api/viewupdates", (req, res, next) => {
    var sql = "select * from updates order by updates_id DESC"
    var params = []
    db.all(sql, params, (err, rows) => {
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
	console.log(sql);
    db.run(sql, params, function (err, result) {
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
    db.run(sql, params, function (err, result) {
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
    db.run(sql, params, function (err, result) {
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

// =================== ACD

app.get("/api/handling/get/:id", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from handling where `handling_CES` = ? ORDER BY `handling_date` ASC"
    
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

app.get("/api/handling", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from handling ORDER BY `handling_date` ASC"
    
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

app.get("/api/handling/team/:team", (req, res, next) => {
	var params = [req.params.team]
    var sql = "select `handling`.* from handling INNER JOIN users WHERE (`users`.`users_Team` = ?) AND (`users`.`users_CES` = `handling`.`handling_CES`) ORDER BY `handling`.`handling_date` ASC"
    
    db.all(sql, params, (err, rows) => {
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
    
    db.all(sql, params, (err, rows) => {
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

// =================== utilization

app.get("/api/utilization/team/:team", (req, res, next) => {
	var params = [req.params.team]
    var sql = "select `utilization`.* from utilization INNER JOIN users WHERE (`users`.`users_Team` = ?) AND (`users`.`users_CES` = `utilization`.`util_CES`) ORDER BY `utilization`.`util_date` ASC"
    
    db.all(sql, params, (err, rows) => {
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

app.get("/api/utilization", (req, res, next) => {
	var params = [req.params.id]
    var sql = "select * from utilization ORDER BY `util_date` ASC"
    
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

// =================== SMEEOS

app.get("/api/SMEEOS/get/:CES/:date", (req, res, next) => {
    var params = [req.params.CES,req.params.date]
    var sql = "select * from SMEEOS where `SMEEOS_CES` = ? AND `SMEEOS_date` = ?"
    
    db.all(sql, params, (err, rows) => {
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
    console.log(datacheck);

    console.log('data');
	//console.log(datacheck);
    checker.get('http://'+server+'/api/SMEEOS/get/'+req.body.ces+'/'+req.body.date,resp=>{
        var data='';
        //console.log('cases');
        
        resp.on('data', (chunk) => {
            data += chunk;
        });
        
          // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(JSON.parse(data));
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
            
            
            db.run(sql, params, function (err, result) {
                console.log(result);
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

app.post("/api/cases/save", (req, res, next) => {
    var recordExists=false;
    var datacheck = {
        ces: req.body.ces,
        data: req.body.dataStandard,
        aht: req.body.dataAHT,
        eos: req.body.dataEOS,
        
    }
    console.log(datacheck);
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    //console.log('data');
	//console.log(datacheck);
    checker.get('http://'+server+'/api/cases/get/'+req.body.ces,resp=>{
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
                var sql ='UPDATE cases SET cases_datesaved=?, cases_data=?, cases_AHT=?, cases_EOS=? WHERE cases_CES=?'
                var params =[new Date(), datacheck.data, datacheck.aht, datacheck.eos, datacheck.ces]
            }else{
                var sql ='INSERT INTO cases (cases_datesaved, cases_CES, cases_data, cases_AHT, cases_EOS) VALUES (?,?,?,?,?)'
                var params =[new Date(), datacheck.ces, datacheck.data, datacheck.aht, datacheck.eos]
            }
            
            
            db.run(sql, params, function (err, result) {
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
        if (err) return console.log('Server error!');
        if (!user) return console.log('User not found!');
        if(!user.users_password) return console.log('User not registered');
        const  result  =  bcrypt.compareSync(password, user.users_password);
        if(!result) {
            console.log('Password not valid!')
            res.status(401).send('Invalid request')
            return;
        };
        console.log(user);
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
        const response = {
            "status": "Logged in",
            "token": token,
            "refreshToken": refreshToken,
            "user": user
        }
        console.log("user");
        console.log(user);
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


app.all('*', function(req, res) {
    //history.pushState("","","/");
    res.redirect("http://"+server+"/splash.html");
});

router.use(require('./tokenChecker'));

router.get('/', (req,res) => { 
    console.log("in /");
    //console.log(res);
    res.render('index',{basedir: __dirname, userdetails: req.cookies.userdetails});
    //res.sendFile(__dirname + '/main.html');
})


app.listen(config.port || process.env.port || 3000);
var io = require('socket.io')(http);

http.listen(HTTP_PORT, function(){
    console.log('socket io listening on port '+HTTP_PORT);
});

io.on('connection', function(socket){
    //console.log(socket);
    var userID;
    
    var ip = socket.handshake.address;
    
    userID=socket.id;
    //var userIP=ip;
    //console.log(userID + ' connected '+ ip);
    io.to(`${userID}`).emit('ip address', ip);
    
    socket.on('register chat', function(data) {
        //console.log(data.userCES);
        //userNames[data.ip.split(".")[2]+data.ip.split(".")[3]] = {'username':data.name,'userID':data.userId,'ip':data.ip};
        //console.log('register chat from:');
        //console.log(data);
        //console.log(userNames);
        //console.log(JSON.stringify(userNames));
        //io.emit('chat list', userNames);
        if(data.userlevel==2){
            //userNamesL2[data.ip.split(".")[2]+data.ip.split(".")[3]] = {'username':data.name,'userID':data.userId,'ip':data.ip};
            //io.emit('chat listL2', userNamesL2);
        }
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
        //console.log(data);
        console.log(userNames);
        
        console.log('approve '+userNames[data.auxid.split("-")[0]].userID)
        try{
            io.to(`${userNames[data.auxip.split(".")[2]+data.auxip.split(".")[3]].userID}`).emit('aux approved request',{auxid:data.auxid,message:data.message});
        }catch(error){
         
        }
        //console.log(users);
    });

    socket.on('aux disapprove', function(data) {
        //console.log(data);
        console.log('disapprove '+userNames[data.auxid.split("-")[0]].userID)
        try{
            io.to(`${userNames[data.auxip.split(".")[2]+data.auxip.split(".")[3]].userID}`).emit('aux disapproved request',{auxid:data.auxid,message:data.message});
        }catch(error){
         
        }
        //console.log(users);
    });

    socket.on('disconnect', function(reason){
        try{
            console.log(users[users.indexOf(users.find(o => o.userId == userID))].user["users_CN"] + ' disconnected because of ' + reason);
        }catch(err){
            console.log(err);
        }

        //console.log(users);
        //users.splice(users.indexOf(users.find(o => o.userId == userID)),1);
        //delete userNames[ip];
        //console.log(userNames);
        io.emit('chat list',userNames);
    });
    
    socket.on('chat message', function(expertname,msg){
        io.emit('chat message', expertname,msg);
        //console.log(userID + ' ' + expertname);
        var stream = fs.createWriteStream("chatlogs.txt", {flags:'a'});
        stream.write(new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"}) + ' # ' + userID + ' # ' + expertname +' : ' + msg + '\n');
        stream.close();
        io.to(`${userID}`).emit('ip address', ip);
    });

    socket.on('chat messageL2', function(expertname,msg){
        io.emit('chat messageL2', expertname,msg);
        //console.log(userID + ' ' + expertname);
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
});



//api



