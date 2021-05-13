"use strict";
const server = "icsph.com";
//const server = "localhost:4030";
const HTTP_PORT = 50081;
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
const {performance} = require('perf_hooks');
const csvMetrics=require('csvtojson')
const csvHandling=require('csvtojson')
const csvUtilization=require('csvtojson')
const csvDashboard=require('csvtojson')
const csvQA=require('csvtojson')
var afterHeader=false;
var startTime;
var endTime;
var metricCounter=0;
var qaCounter=0;
var handlingCounter=0;
var metricObject;
var qaObject;
var dashboardObject;
var handlingObject;
var utilizationCounter=0;
var dashboardCounter=0;
var utilObject;
var upload = multer({ storage: storage })
var fs = require('fs')

//const tokenList = {}

var db = require("./database-mysql.js")

const http = require('http').createServer(app);

http.listen(HTTP_PORT, function(){
    console.log('upload server listening on port '+HTTP_PORT);
});

//router.use(bodyParser.urlencoded({ extended:  false }));
//router.use(bodyParser.json());

app.use(bodyParser.json());


app.get('/upload',function(req,res){
    res.sendFile(__dirname + '/upload.html');
  });
  
app.get("/api/callhandler/:issue_number", (req, res, next) => {
    var sql = "select * from issue where issue_number = ?"
    var params = [req.params.issue_number]
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
          getData('http://'+server+'/api/metric/teams',parseCSV,filepath,res);
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
          getData('http://'+server+'/api/metric/teams',parseCSVUtil,filepath,res);
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

//api

function saveMetrics(data,file){
	var sql ='INSERT INTO metrics ("metric-Month","metric-WE","metric-Date","metric-Channel","metric-CES","metric-Phone_ID","metric-Agent_Name","metric-LOB","metric-Team","metric-Survey_Call_Center","metric-Case_Start_Channel","metric-Case_Number","metric-Response-Completiondate","metric-Survey_Agent","metric-General_Comments","metric-NPS_Detractor_Comments","metric-CES_General_Comments","metric-Q1","metric-Q2","metric-Q3","metric-Q4","metric-Q5","metric-Q6","metric-Q7","metric-Q8","metric-Q9","metric-Q10","metric-Q11","metric-Q12","metric-Q13","metric-Q14","metric-Q15","metric-Q16","metric-Q17","metric-Daily","metric-Combi","metric-Tenure","metric-Count","metric-DET") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
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
	var sql ='INSERT INTO qa ("qa_CES","qa_score","qa_WE") VALUES (?,?,?)'
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
	var sql ='INSERT INTO handling ("handling_date","handling_CES","handling_agentID","handling_availtime","handling_handled","handling_handletime","handling_holdtime","handling_inbound") VALUES (?,?,?,?,?,?,?,?)'
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
	var sql ='INSERT INTO utilization ("util_date","util_CES","util_logged","util_availtime","util_break","util_productivityrate","util_utilizationrate","util_utilizedhours","util_productivehours","util_inbound","util_outbound","util_inboundtime","util_outboundtime","util_labtime","util_chattime","util_webotstime","util_casereviewtime") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
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
	var sql ='INSERT INTO dboard ("dboard_id","dboard_date","dboard_CES","dboard_unavail_T","dboard_inbound_pending","dboard_15break","dboard_casereview","dboard_60break","dboard_pbreak","dboard_unavail","dboard_chat","dboard_web_ots","dboard_logged_in","dboard_lab","dboard_training","dboard_meeting","dboard_outbound","dboard_technical","dboard_coaching","dboard_outbound_pending","dboard_admin","dboard_acw_manual","dboard_consult_pending","dboard_acw_auto","dboard_transfer_pending","dboard_login_time","dboard_avail","dboard_utilized_hours","dboard_inbound_handled","dboard_inbound_handle_time","dboard_inbound_hold_time","dboard_outbound_handled","dboard_outbound_handle_time","dboard_outbound_hold_time","dboard_outbound_calls","dboard_expected","dboard_present","dboard_absent","dboard_sched_leave","dboard_unsched_leave","dboard_tardiness","dboard_chat_offered","dboard_chat_handled","dboard_chat_handle_time","dboard_case_notes","dboard_chat2","dboard_customer_comment_reply","dboard_inbound_call","dboard_outbound_call","dboard_presales_case_notes","dboard_presales_inbound_call","dboard_presales_customer_comment_reply","dboard_presales_chat","dboard_presales_outbound_call","dboard_case_reviews","dboard_cases_closed") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
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
		//console.log('response:'+res);
		res.on("data", (chunk) => {
			body = JSON.parse(chunk);
//		});
		//console.log(body.data);
//		res.on("end", () => {
			//console.log(body.data);
		if(body.data){ 
			//console.log('saving:' +data.metricCount);
			callback(body.data,data);
		}else{
			//console.log('exists');
		}
	});
}) 
	
	
	
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
		db.parallelize(() => {
			qaArray.forEach(function(element,index){
				//console.log(element[1].Expert);
				getData('http://'+server+'/api/users/CES/'+element[1].Expert,function(qadata){
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
		db.parallelize(() => {
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
		db.parallelize(() => {
			handlingArray.forEach(element=>{
                if(!afterHeader){
				}else if(afterHeader)
				{
					//console.log("after header2");
					if((element[1].Agent_ID!='')&&(element[1].Classification=='')){
						
						handlingPromise.push(new Promise(function(resolve,reject){
							getData('http://'+server+'/api/users/agent/'+element[1].Agent_ID+'/z',function(userDetails){
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
        
		db.parallelize(() => {
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
		});
		//console.log(recordsProcessed);
        
	});
}

function parseCSVDashboard(csvFilePath){
	afterHeader=false;
	dashboardCounter=0;
	csvDashboard({
		noheader:false,
		headers:['AHT','Daily Rank','','','Date','WE','Month','Tenure','CES','Name','Team','LOB','Type','GROUP','Total Unavailable Time','InboundPending','15min Break','Case Review','60min Break','Personal Break','Unavailable','Chat','Web/OTS','Logged In','Lab','Training','Meeting','Outbound','Technical Issue','Coaching','OutboundPending','Admin Work','After Call Work (Manual)','ConsultPending','After Call Work (Auto)','TransferPending','Login Time','Available Time','Utilized Hours','Inbound Handled','Inbound Handle Time','Inbound Hold Time','Outbound Handled','Outbound Handled Time','Outbound Hold Time','Outbound Calls (Above 180 secs)','EXPECTED','PRESENT','ABSENT','Sched. Leaves','Unched. Leaves','Tardiness','Chat Offered','Chat Handled','Chat Handle Time','Case Notes','Chat2','Customer Comment – Reply','Inbound Call','Outbound Call','Presales Case Notes','Presales Inbound Call','Presales Customer Comment – Reply','Presales Chat','Presales Outbound Call','Case Reviews','Cases Closed']
	})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		//console.log(jsonObj);
		dashboardObject= JSON.parse(JSON.stringify(jsonObj));
		//console.log(metricObject);
		var dashboardArray=Object.entries(dashboardObject);
        startTime=performance.now();
        //console.log(utilizationArray);
        
		db.parallelize(() => {
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
							dboard_60break:element[1]['60min Break'],
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
							dboard_inbound_handled:element[1]['Inbound Handled'],
							dboard_inbound_handle_time:element[1]['Inbound Handle Time'],
							dboard_inbound_hold_time:element[1]['Inbound Hold Time'],
							dboard_outbound_handled:element[1]['Outbound Handled'],
							dboard_outbound_handle_time:element[1]['Outbound Handled Time'],
							dboard_outbound_hold_time:element[1]['Outbound Hold Time'],
							dboard_outbound_calls:element[1]['Outbound Calls (Above 180 secs)'],
							dboard_expected:element[1]['EXPECTED'],
							dboard_present:element[1]['PRESENT'],
							dboard_absent:element[1]['ABSENT'],
							dboard_sched_leave:element[1]['Sched. Leaves'],
							dboard_unsched_leave:element[1]['Unched. Leaves'],
							dboard_tardiness:element[1]['Tardiness'],
							dboard_chat_offered:element[1]['Chat Offered'],
							dboard_chat_handled:element[1]['Chat Handled'],
							dboard_chat_handle_time:element[1]['Chat Handle Time'],
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
						saveDashboard(data);
					}else{
						console.log("Duplicate Entry");
					}
				})
					
				}
			});
		});
		//console.log(recordsProcessed);
        
	});
}

