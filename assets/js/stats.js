function getMonthStats(from,to,CES,callback){
	var allExpertStats=[];
	getDataRecord('/api/metric/get', function(allmetricdata){
		//console.log(allmetricdata);
		var timedata = allmetricdata.filter(entry=>{
			var fromDate={
				day:parseInt(from.split("/")[1]),
				month:parseInt(from.split("/")[0]),
				year:parseInt(from.split("/")[2].substring(2))
			}
			var toDate={
				day:parseInt(to.split("/")[1]),
				month:parseInt(to.split("/")[0]),
				year:parseInt(to.split("/")[2].substring(2))
			}
			var statDate={
				day:parseInt(entry["metric-Response-Completiondate"].split("/")[2]),
				month:parseInt(entry["metric-Response-Completiondate"].split("/")[1]),
				year:parseInt(entry["metric-Response-Completiondate"].split("/")[0]),
			}
			//console.log(fromDate);
			//console.log(toDate);
			if(fromDate.year==toDate.year){
				//console.log(statDate)
				return ((statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day))&&
						((statDate.month<=toDate.month)&&(statDate.day<=toDate.day))
			}else{
				//console.log("statDate");
				//console.log(statDate);
				return ((((statDate.year=fromDate.year)&&(statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day))&&
						((statDate.year=fromDate.year)&&(statDate.month<=12)&&(statDate.day<=31)))||
						(((statDate.year=toDate.year)&&(statDate.month>=1)&&(statDate.day>=1))&&
						((statDate.year=toDate.year)&&(statDate.month<=toDate.month)&&(statDate.day<=toDate.day))))
			}
		})
		//console.log(weekdata);
		if(!CES){
			getDataRecord('/api/metric/names', function(allexperts){
				//console.log(allexperts);
				allexperts.forEach(function(expert){
					var csatdata = timedata.filter(dayelement=>{
						return (expert["metric-CES"]==dayelement["metric-CES"])
					}).map(a => a["metric-Q1"]);
					var npsdata = timedata.filter(dayelement=>{
						return (expert["metric-CES"]==dayelement["metric-CES"])
					}).map(a => a["metric-Q2"]);
					var fcrdata = timedata.filter(dayelement=>{
						return (expert["metric-CES"]==dayelement["metric-CES"])
					}).map(a => a["metric-Q4"]);

					allExpertStats.push({
						name:expert["metric-Agent_Name"],
						CES:expert["metric-CES"],
						CSAT:calcCsat(csatdata),
						NPS:calcNps(npsdata),
						FCR:calcFcr(fcrdata)
					})
				})
				var CsatExpertStats= allExpertStats.filter(stat=>{
					return stat.CSAT[0]!='No returns';
				})
				CsatExpertStats.sort((a, b) => (parseFloat(a.CSAT[0]) > parseFloat(b.CSAT[0])) ? 1 : ((parseFloat(a.CSAT[0]) == parseFloat(b.CSAT[0])) ? ((parseFloat(a.CSAT[1]) > parseFloat(b.CSAT[1])) ? 1 : -1) : -1));
				CsatExpertStats.reverse();
				//console.log(CsatExpertStats);
				
				var NpsExpertStats= allExpertStats.filter(stat=>{
					return stat.NPS[0]!='No returns';
				})
				NpsExpertStats.sort((a, b) => (parseFloat(a.NPS[0]) > parseFloat(b.NPS[0])) ? 1 : ((parseFloat(a.NPS[0]) == parseFloat(b.NPS[0])) ? ((parseFloat(a.NPS[3]) > parseFloat(b.NPS[3])) ? 1 : -1) : -1));
				NpsExpertStats.reverse();
				//console.log(NpsExpertStats);

				var FcrExpertStats= allExpertStats.filter(stat=>{
					return stat.FCR[0]!='No returns';
				})
				FcrExpertStats.sort((a, b) => (parseFloat(a.FCR[0]) > parseFloat(b.FCR[0])) ? 1 : ((parseFloat(a.FCR[0]) == parseFloat(b.FCR[0])) ? ((parseFloat(a.FCR[2]) > parseFloat(b.FCR[2])) ? 1 : -1) : -1));
				FcrExpertStats.reverse();
				//console.log(FcrExpertStats);
				if(callback)
					callback({CSAT:CsatExpertStats,NPS:NpsExpertStats,FCR:FcrExpertStats});
			})
		}else{
			
			//console.log(allexperts);
			
			var csatdata = timedata.filter(dayelement=>{
				return (userCES==dayelement["metric-CES"])
			}).map(a => a["metric-Q1"]);
			var npsdata = timedata.filter(dayelement=>{
				return (userCES==dayelement["metric-CES"])
			}).map(a => a["metric-Q2"]);
			var fcrdata = timedata.filter(dayelement=>{
				return (userCES==dayelement["metric-CES"])
			}).map(a => a["metric-Q4"]);

			allExpertStats.push({
				name:userCN,
				CES:userCES,
				CSAT:calcCsat(csatdata),
				NPS:calcNps(npsdata),
				FCR:calcFcr(fcrdata),
				details:timedata.filter(dayelement=>{
					return (userCES==dayelement["metric-CES"])
				})
			})
		
			//console.log(FcrExpertStats);
			if(callback)
				callback(allExpertStats);
		
		}
	})
}

function displayDateStats(from,to,CES,tablenamestats,tablenamedetails,callback){
	//console.log(from);
	//console.log(to);
	$('#'+tablenamedetails).html('');
	$('#'+tablenamestats).html('');
	getMonthStats(from,to,CES,function(stats){
		//console.log(stats);
		
		var allHtml='<tr><th>CSAT %</th><th>CSAT</th><th>NPS %</th><th>NPS</th><th>FCR %</th><th>FCR</th><th>Returns</th></tr>';
		allHtml+="<tr><td>" + stats[0].CSAT[0] + "</td><td>" + stats[0].CSAT[1] + "</td><td>" + stats[0].NPS[0] + "</td><td>" + stats[0].NPS[1] + "</td><td>" + stats[0].FCR[0] + "</td><td>" + stats[0].FCR[1] + "</td><td>" + stats[0].CSAT[2] + "</td></tr>";
		$('#'+tablenamestats).append(allHtml);
		var html='<tr><th style="width:40px">Survey Date</th><th style="width:75px">Case Number</th><th style="width:75px">CSAT</th><th style="width:75px">NPS</th><th style="width:75px">FCR</th><th style="width:75px">Comment</th></tr>';
		//console.log(data);
		stats[0].details.forEach(element => {
			//console.log(new Date(getDateString(element["metric-Response-Completiondate"])));

			html+='<tr><td>' + element["metric-Response-Completiondate"] + '</td><td>' + element["metric-Case_Number"] + '</td><td>' + element["metric-Q1"] + '</td><td>' + element["metric-Q2"] + '</td><td>' + element["metric-Q4"] + '</td><td>' + 
				(((element["metric-General_Comments"]!=null)&&(element["metric-General_Comments"]!='')&&(element["metric-General_Comments"]!=0))?('<b>General Comments:</b>'+ element["metric-General_Comments"] + '<br><br>'):('')) + 
				(((element["metric-NPS_Detractor_Comments"]!=null)&&(element["metric-NPS_Detractor_Comments"]!='')&&(element["metric-NPS_Detractor_Comments"]!=0))?('<b>NPS Detractor Comments:</b>'+ element["metric-NPS_Detractor_Comments"] + '<br><br>'):('')) + 
				(((element["metric-CES_General_Comments"]!=null)&&(element["metric-CES_General_Comments"]!='')&&(element["metric-CES_General_Comments"]!=0))?('<b>CES General Comments:</b>'+ element["metric-CES_General_Comments"] + '<br><br>'):('')) + 
				'</td></tr>';
		})
		$('#'+tablenamedetails).append(html);
		if(callback){
			callback();
		}
	})
	
}

function getQADateStats(from,to,CES,callback){
	if(!CES){
		getDataRecord('/api/QA',function(qadata){

		})
	}else{
		getDataRecord('/api/QA/CES/'+CES,function(qadata){
			var fromDate={
				day:parseInt(from.split("/")[1]),
				month:parseInt(from.split("/")[0]),
				year:parseInt(from.split("/")[2].substring(2))
			}
			var toDate={
				day:parseInt(to.split("/")[1]),
				month:parseInt(to.split("/")[0]),
				year:parseInt(to.split("/")[2].substring(2))
			}
			var timedata = qadata.filter(entry=>{
				console.log()
				var statDate={
					day:parseInt(entry["qa_WE"].substr(2,2)),
					month:parseInt(entry["qa_WE"].substr(0,2)),
					year:parseInt((metricDate.getFullYear()).toString().substr(2,2)),
				}
				console.log(statDate.month);
				//console.log(toDate);
				if(fromDate.year==toDate.year){
					//console.log(statDate)
					return ((statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day))&&
							((statDate.month<=toDate.month)&&(statDate.day<=toDate.day))
				}else{
					//console.log("statDate");
					//console.log(statDate);
					return (((statDate.year=fromDate.year)&&(statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day)&&
							(statDate.year=fromDate.year)&&(statDate.month<=12)&&(statDate.day<=31))||
							((statDate.year=toDate.year)&&(statDate.month>=1)&&(statDate.day>=1)&&
							(statDate.year=toDate.year)&&(statDate.month<=toDate.month)&&(statDate.day<=toDate.day)))
				}
			})
			console.log(timedata);
			var totalScore=0;
			var dailyStat=[];

			timedata.forEach(function (data){
				totalScore+=parseFloat(data.qa_score);
				dailyStat.push({week:data.qa_WE,score:data.qa_score})
			})
			console.log(totalScore);

			if(callback)
				callback({totalScore:totalScore,stats:dailyStat})
			else
				return {totalScore:totalScore,stats:dailyStat}

		});
	}
}

function getUtilDateStats(from,to,CES,callback){
	getDataRecord('/api/dashboard/get/'+CES,function(dboarddata){
		var timedata = dboarddata.filter(entry=>{
			var fromDate={
				day:parseInt(from.split("/")[1]),
				month:parseInt(from.split("/")[0]),
				year:parseInt(from.split("/")[2].substring(2))
			}
			var toDate={
				day:parseInt(to.split("/")[1]),
				month:parseInt(to.split("/")[0]),
				year:parseInt(to.split("/")[2].substring(2))
			}
			var statDate={
				day:parseInt(entry["dboard_date"].split("/")[2]),
				month:parseInt(entry["dboard_date"].split("/")[1]),
				year:parseInt(entry["dboard_date"].split("/")[0]),
			}
			//console.log(fromDate);
			//console.log(toDate);
			if(fromDate.year==toDate.year){
				//console.log(statDate)
				return ((statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day))&&
						((statDate.month<=toDate.month)&&(statDate.day<=toDate.day))
			}else{
				//console.log("statDate");
				//console.log(statDate);
				return (((statDate.year=fromDate.year)&&(statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day)&&
						(statDate.year=fromDate.year)&&(statDate.month<=12)&&(statDate.day<=31))||
						((statDate.year=toDate.year)&&(statDate.month>=1)&&(statDate.day>=1)&&
						(statDate.year=toDate.year)&&(statDate.month<=toDate.month)&&(statDate.day<=toDate.day)))
			}
		})
		//console.log(timedata);
		var totalUtiltime='0:0:0';
		var totalProdtime='0:0:0';
		var totalLogintime='0:0:0';
		var totalInboundtime='0:0:0';
		var totalOutboundtime='0:0:0';
		var totalInboundHoldtime='0:0:0';
		var totalOutboundHoldtime='0:0:0';
		var totalLabtime='0:0:0';
		var totalChattime='0:0:0';
		var totalWebotstime='0:0:0';
		var totalCasereviewtime='0:0:0';
		var totalAvailtime='0:0:0';
		var totalInbound=0;
		var totalOutbound=0;
		var totalOverbreak=0;
		var totalPresent=0;
		var totalExpected=0;
		var totalTardiness='0:0:0';
		var totalCaseclosed=0;
		var totalCaseReview=0
		timedata.forEach(function(dayelement){
			totalInbound+=dayelement.dboard_inbound_handled;
			totalOutbound+=dayelement.dboard_outbound_handled;
			totalInboundtime=addTime(totalInboundtime,dayelement.dboard_inbound_handle_time);
			totalOutboundtime=addTime(totalOutboundtime,dayelement.dboard_outbound_handle_time);
			totalInboundHoldtime=addTime(totalInboundHoldtime,dayelement.dboard_inbound_hold_time);
			totalOutboundHoldtime=addTime(totalOutboundHoldtime,dayelement.dboard_outbound_hold_time);
			totalLabtime=addTime(totalLabtime,dayelement.dboard_lab);
			totalChattime=addTime(totalChattime,dayelement.dboard_chat_handle_time);
			totalWebotstime=addTime(totalWebotstime,dayelement.dboard_web_ots);
			totalCasereviewtime=addTime(totalCasereviewtime,dayelement.dboard_casereview);
			totalUtiltime=addTime(totalUtiltime,dayelement.dboard_utilized_hours);
			totalProdtime=addTime(totalProdtime,dayelement.dboard_utilized_hours);
			totalLogintime=addTime(totalLogintime,dayelement.dboard_login_time);
			totalAvailtime=addTime(totalAvailtime,dayelement.dboard_avail);
			totalPresent+=dayelement.dboard_present;
			totalExpected+=dayelement.dboard_expected;
			totalTardiness=addTime(totalTardiness,dayelement.dboard_tardiness)
			totalCaseclosed+=dayelement.dboard_cases_closed;
			totalCaseReview+=dayelement.dboard_case_reviews;
			if(toSeconds(addTime(dayelement.dboard_15break,dayelement.dboard_60break))>5400){
				totalOverbreak++;
			}
		})
		if(callback)
			callback({reviews:totalCaseReview,cases:totalCaseclosed,attendance:totalPresent,util:totalUtiltime,prod:totalProdtime,login:totalLogintime,avail:totalAvailtime,overbreak:totalOverbreak,inbound:totalInbound,outbound:totalOutbound,
				inboundtime:totalInboundtime,outboundtime:totalOutboundtime,inboundholdtime:totalInboundHoldtime,outboundholdtime:totalOutboundHoldtime,lab:totalLabtime,chat:totalChattime,webots:totalWebotstime,casereview:totalCasereviewtime})
		else
			return {reviews:totalCaseReview,cases:totalCaseclosed,attendance:timedata.length,util:totalUtiltime,prod:totalProdtime,login:totalLogintime,avail:totalAvailtime,overbreak:totalOverbreak,inbound:totalInbound,outbound:totalOutbound,
				inboundtime:totalInboundtime,outboundtime:totalOutboundtime,inboundholdtime:totalInboundHoldtime,outboundholdtime:totalOutboundHoldtime,lab:totalLabtime,chat:totalChattime,webots:totalWebotstime,casereview:totalCasereviewtime}
	});
}

function getUtilDateTeamStats(from,to,team,callback){
	getDataRecord('/api/dashboard/team/'+team,function(utildata){
		//console.log(utildata);
		var timedata = utildata.filter(entry=>{
			var fromDate={
				day:parseInt(from.split("/")[1]),
				month:parseInt(from.split("/")[0]),
				year:parseInt(from.split("/")[2].substring(2))
			}
			var toDate={
				day:parseInt(to.split("/")[1]),
				month:parseInt(to.split("/")[0]),
				year:parseInt(to.split("/")[2].substring(2))
			}
			var statDate={
				day:parseInt(entry["dboard_date"].split("/")[2]),
				month:parseInt(entry["dboard_date"].split("/")[1]),
				year:parseInt(entry["dboard_date"].split("/")[0]),
			}
			//console.log(fromDate);
			//console.log(toDate);
			if(fromDate.year==toDate.year){
				//console.log(statDate)
				return ((statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day))&&
						((statDate.month<=toDate.month)&&(statDate.day<=toDate.day))
			}else{
				//console.log("statDate");
				//console.log(statDate);
				return (((statDate.year=fromDate.year)&&(statDate.month>=fromDate.month)&&(statDate.day>=fromDate.day)&&
						(statDate.year=fromDate.year)&&(statDate.month<=12)&&(statDate.day<=31))||
						((statDate.year=toDate.year)&&(statDate.month>=1)&&(statDate.day>=1)&&
						(statDate.year=toDate.year)&&(statDate.month<=toDate.month)&&(statDate.day<=toDate.day)))
			}
		})
		var totalUtiltime='0:0:0';
		var totalProdtime='0:0:0';
		var totalLogintime='0:0:0';
		var totalInboundtime='0:0:0';
		var totalOutboundtime='0:0:0';
		var totalInboundHoldtime='0:0:0';
		var totalOutboundHoldtime='0:0:0';
		var totalLabtime='0:0:0';
		var totalChattime='0:0:0';
		var totalWebotstime='0:0:0';
		var totalCasereviewtime='0:0:0';
		var totalAvailtime='0:0:0';
		var totalInbound=0;
		var totalOutbound=0;
		var totalOverbreak=0;
		var totalPresent=0;
		var totalExpected=0;
		var totalTardiness='0:0:0';
		var totalCaseclosed=0;
		var totalCaseReview=0
		timedata.forEach(function(dayelement){
			totalInbound+=dayelement.dboard_inbound_handled;
			totalOutbound+=dayelement.dboard_outbound_handled;
			totalInboundtime=addTime(totalInboundtime,dayelement.dboard_inbound_handle_time);
			totalOutboundtime=addTime(totalOutboundtime,dayelement.dboard_outbound_handle_time);
			totalInboundHoldtime=addTime(totalInboundHoldtime,dayelement.dboard_inbound_hold_time);
			totalOutboundHoldtime=addTime(totalOutboundHoldtime,dayelement.dboard_outbound_hold_time);
			totalLabtime=addTime(totalLabtime,dayelement.dboard_lab);
			totalChattime=addTime(totalChattime,dayelement.dboard_chat_handle_time);
			totalWebotstime=addTime(totalWebotstime,dayelement.dboard_web_ots);
			totalCasereviewtime=addTime(totalCasereviewtime,dayelement.dboard_casereview);
			totalUtiltime=addTime(totalUtiltime,dayelement.dboard_utilized_hours);
			totalProdtime=addTime(totalProdtime,dayelement.dboard_utilized_hours);
			totalLogintime=addTime(totalLogintime,dayelement.dboard_login_time);
			totalAvailtime=addTime(totalAvailtime,dayelement.dboard_avail);
			totalPresent+=dayelement.dboard_present;
			totalExpected+=dayelement.dboard_expected;
			totalTardiness=addTime(totalTardiness,dayelement.dboard_tardiness)
			totalCaseclosed+=dayelement.dboard_cases_closed;
			totalCaseReview+=dayelement.dboard_case_reviews;
			if(toSeconds(addTime(dayelement.dboard_15break,dayelement.dboard_60break))>5400){
				totalOverbreak++;
			}
		})
		if(callback)
			callback({reviews:totalCaseReview,cases:totalCaseclosed,attendance:totalPresent,util:totalUtiltime,prod:totalProdtime,login:totalLogintime,avail:totalAvailtime,overbreak:totalOverbreak,inbound:totalInbound,outbound:totalOutbound,
				inboundtime:totalInboundtime,outboundtime:totalOutboundtime,inboundholdtime:totalInboundHoldtime,outboundholdtime:totalOutboundHoldtime,lab:totalLabtime,chat:totalChattime,webots:totalWebotstime,casereview:totalCasereviewtime})
		else
			return {reviews:totalCaseReview,cases:totalCaseclosed,attendance:timedata.length,util:totalUtiltime,prod:totalProdtime,login:totalLogintime,avail:totalAvailtime,overbreak:totalOverbreak,inbound:totalInbound,outbound:totalOutbound,
				inboundtime:totalInboundtime,outboundtime:totalOutboundtime,inboundholdtime:totalInboundHoldtime,outboundholdtime:totalOutboundHoldtime,lab:totalLabtime,chat:totalChattime,webots:totalWebotstime,casereview:totalCasereviewtime}
	});
}

function calcUtil(data,callback){
	if(toSeconds(data.login)){
		var utilRate=((toSeconds(data.util)/toSeconds(data.login))*100).toFixed(2);
		var prodRate=((toSeconds(data.prod)/toSeconds(data.login))*100).toFixed(2);
		var AHTseconds=(toSeconds(data.inboundtime)+toSeconds(data.inboundholdtime))/(data.inbound);
		var AHT=(AHTseconds/60).toFixed(2);
		var ACD=((data.inbound + (toSeconds(data.avail)/(AHTseconds)))/data.attendance).toFixed(2);
		if((data.attendance==0)||(data.inbound==0)){
			ACD='No Data';
			AHT='No Data';
		}
	}else{
		var utilRate=0;
		var prodRate=0;
		var AHT=0;
		var ACD=0;
	}
	//console.log(utilRate);
	if(callback)
		callback({utilRate:utilRate+'%',prodRate:prodRate+'%',utilSeconds:toSeconds(data.util),prodSeconds:toSeconds(data.prod),
		loginSeconds:toSeconds(data.login),aht:AHT,acd:ACD,totalInbound:data.inbound,totalAvailtime:toSeconds(data.avail),
		totalHandleTime:toSeconds(data.inboundtime)+toSeconds(data.outboundtime),totalCallsHandled:data.inbound+data.outbound,attendance:data.attendance})
	else
		return {utilRate:utilRate+'%',prodRate:prodRate+'%',utilSeconds:toSeconds(data.util),prodSeconds:toSeconds(data.prod),
		loginSeconds:toSeconds(data.login),aht:AHT,acd:ACD,totalInbound:data.inbound,totalAvailtime:toSeconds(data.avail),
		totalHandleTime:toSeconds(data.inboundtime)+toSeconds(data.outboundtime),totalCallsHandled:data.inbound+data.outbound,attendance:data.attendance};
}



function calcProductivity(availElement,inboundElement,outboundElement,totalElement,deficitElement){
	addTime($('#'+availElement+"Hour").val()+":"+$('#'+availElement+"Min").val()+":"+$('#'+availElement+"Sec").val(),$('#'+inboundElement+"Hour").val()+":"+$('#'+inboundElement+"Min").val()+":"+$('#'+inboundElement+"Sec").val(),function(addedTime){
		addTime(addedTime,$('#'+outboundElement+"Hour").val()+":"+$('#'+outboundElement+"Min").val()+":"+$('#'+outboundElement+"Sec").val(),function(totalTime){
			$('#'+totalElement+"Hour").val(totalTime.split(":")[0]<9?(0+totalTime.split(":")[0]):totalTime.split(":")[0]);
			$('#'+totalElement+"Min").val(totalTime.split(":")[1]<9?(0+totalTime.split(":")[1]):totalTime.split(":")[1]);
			$('#'+totalElement+"Sec").val(totalTime.split(":")[2]<9?(0+totalTime.split(":")[2]):totalTime.split(":")[2]);
			var deficitSec=27000-toSeconds(totalTime);
			if(deficitSec<0){
				$('#'+deficitElement+"Hour").val("00");
				$('#'+deficitElement+"Min").val("00");
				$('#'+deficitElement+"Sec").val("00");
			}else{
				var deficitTime=toTime(deficitSec);
				
				$('#'+deficitElement+"Hour").val(deficitTime.split(":")[0]<9?(0+deficitTime.split(":")[0]):deficitTime.split(":")[0]);
				$('#'+deficitElement+"Min").val(deficitTime.split(":")[1]<9?(0+deficitTime.split(":")[1]):deficitTime.split(":")[1]);
				$('#'+deficitElement+"Sec").val(deficitTime.split(":")[2]<9?(0+deficitTime.split(":")[2]):deficitTime.split(":")[2]);
			}
		})
	})
}

function getUtilization(CES,callback){
	getDataRecord('/api/utilization/get/'+CES,function(utildata){
		console.log(CES);
		var month_data = utildata.filter(element => {
			return ((parseInt(element["util_date"].split("/")[1])==metricDate.getMonth()+1)&&(parseFloat(element["util_utilizationrate"])!=0));
		});
		console.log(month_data);
		/*var html="<tbody>";
		updatedata.forEach(update => {
			html+="<tr class='update_row'><td><h5 style='font-size:14px;margin-bottom:5px;'>"+ update.updates_title + "</h5><br>" + update.updates_timestamp + "<br><br><span style='font-size:12px'>" + update.updates_content.replace(/\n/g,'<br>') + "</span></td></tr>";
		});
		html+="</tbody>";*/
		if(callback){
			callback(month_data);
		}
	},'');
}

function getMonthData(CES,callback){
	getDataRecord('/api/utilization/get/'+CES,function(utildata){
		getDataRecord('/api/metric/CES/'+CES,function(csatdata){
			var month_csat_data = csatdata.filter(csatelement => {
				return (parseInt(csatelement["metric-Response-Completiondate"].split("/")[1])==metricDate.getMonth()+1)
			});
			var month_util_data = utildata.filter(utilelement => {
				return (parseInt(utilelement["util_date"].split("/")[1])==metricDate.getMonth()+1);
			});
			//console.log(month_util_data);
			//console.log(month_csat_data);
			var month_data=[]
			month_util_data.forEach(element=>{
				if(element.util_productivityrate=="0.00%"){
					element.util_productivityrate='';
				}
				if(element.util_utilizationrate=="0.00%"){
					element.util_utilizationrate='';
				}
				month_data[month_util_data.indexOf(element)]=element;
				
				var csatdata = month_csat_data.filter(dayelement=>{
					return (parseInt(dayelement["metric-Response-Completiondate"].split("/")[2])<=element.util_date.split("/")[2])
				}).map(a => a["metric-Q1"]);
				var npsdata = month_csat_data.filter(dayelement=>{
					return (parseInt(dayelement["metric-Response-Completiondate"].split("/")[2])<=element.util_date.split("/")[2])
				}).map(a => a["metric-Q2"]);
				var fcrdata = month_csat_data.filter(dayelement=>{
					return (parseInt(dayelement["metric-Response-Completiondate"].split("/")[2])<=element.util_date.split("/")[2])
				}).map(a => a["metric-Q4"]);
				month_data[month_util_data.indexOf(element)].csat=calcCsat(csatdata);
				month_data[month_util_data.indexOf(element)].csat[0]
				month_data[month_util_data.indexOf(element)].nps=calcNps(npsdata);
				month_data[month_util_data.indexOf(element)].fcr=calcFcr(fcrdata);
			})
			//console.log(month_data);
			/*var html="<tbody>";
			updatedata.forEach(update => {
				html+="<tr class='update_row'><td><h5 style='font-size:14px;margin-bottom:5px;'>"+ update.updates_title + "</h5><br>" + update.updates_timestamp + "<br><br><span style='font-size:12px'>" + update.updates_content.replace(/\n/g,'<br>') + "</span></td></tr>";
			});
			html+="</tbody>";*/
			if(callback){
				callback(month_data);
			}
		});
		
	},'');
}

function getMonthDataTeam(team,callback){
	getDataRecord('/api/utilization/team/'+team,function(utildata){
		getDataRecord('/api/metric/team/'+team,function(csatdata){
			var month_csat_data = csatdata.filter(csatelement => {
				return (parseInt(csatelement["metric-Response-Completiondate"].split("/")[1])==metricDate.getMonth()+1)
			});
			var month_util_data = utildata.filter(utilelement => {
				return (parseInt(utilelement["util_date"].split("/")[1])==metricDate.getMonth()+1);
			});
			//console.log(month_util_data);
			//console.log(month_csat_data);
			var month_data=[]
			month_util_data.forEach(element=>{
				if(element.util_productivityrate=="0.00%"){
					element.util_productivityrate='';
				}
				if(element.util_utilizationrate=="0.00%"){
					element.util_utilizationrate='';
				}
				month_data[month_util_data.indexOf(element)]=element;
				
				var csatdata = month_csat_data.filter(dayelement=>{
					return (parseInt(dayelement["metric-Response-Completiondate"].split("/")[2])<=element.util_date.split("/")[2])
				}).map(a => a["metric-Q1"]);
				var npsdata = month_csat_data.filter(dayelement=>{
					return (parseInt(dayelement["metric-Response-Completiondate"].split("/")[2])<=element.util_date.split("/")[2])
				}).map(a => a["metric-Q2"]);
				var fcrdata = month_csat_data.filter(dayelement=>{
					return (parseInt(dayelement["metric-Response-Completiondate"].split("/")[2])<=element.util_date.split("/")[2])
				}).map(a => a["metric-Q4"]);
				month_data[month_util_data.indexOf(element)].csat=calcCsat(csatdata);
				month_data[month_util_data.indexOf(element)].csat[0]
				month_data[month_util_data.indexOf(element)].nps=calcNps(npsdata);
				month_data[month_util_data.indexOf(element)].fcr=calcFcr(fcrdata);
			})
			//console.log(month_data);
			/*var html="<tbody>";
			updatedata.forEach(update => {
				html+="<tr class='update_row'><td><h5 style='font-size:14px;margin-bottom:5px;'>"+ update.updates_title + "</h5><br>" + update.updates_timestamp + "<br><br><span style='font-size:12px'>" + update.updates_content.replace(/\n/g,'<br>') + "</span></td></tr>";
			});
			html+="</tbody>";*/
			if(callback){
				callback(month_data);
			}
		});
		
	},'');
}

function getTopData(from,to,callback){
	console.log(from);
	console.log(to);
	var allExpertStats=[];
	getDataRecord('/api/metric/get', function(allmetricdata){
		//console.log(allmetricdata);
		var weekdata = allmetricdata.filter(entry=>{
			var fromDate={
				day:parseInt(from.split("/")[1]),
				month:parseInt(from.split("/")[0]),
				year:parseInt(from.split("/")[2].substring(2))
			}
			var toDate={
				day:parseInt(to.split("/")[1]),
				month:parseInt(to.split("/")[0]),
				year:parseInt(to.split("/")[2].substring(2))
			}
			var statDate={
				day:parseInt(entry["metric-Response-Completiondate"].split("/")[2]),
				month:parseInt(entry["metric-Response-Completiondate"].split("/")[1]),
				year:parseInt(entry["metric-Response-Completiondate"].split("/")[0]),
			}
			if(toDate.month!=fromDate.month){
				return (((statDate.month==fromDate.month)&&
				(statDate.day>=fromDate.day))||
				((statDate.month==toDate.month)&&
				(statDate.day<=toDate.day)));
			}else{
				return (((statDate.month==fromDate.month)&&
				(statDate.day>=fromDate.day))&&
				((statDate.month==toDate.month)&&
				(statDate.day<=toDate.day)));
			}

			
		})
		//console.log(weekdata);
		getDataRecord('/api/metric/names', function(allexperts){
			//console.log(allexperts);
			allexperts.forEach(function(expert){
				var csatdata = weekdata.filter(dayelement=>{
					return (expert["metric-CES"]==dayelement["metric-CES"])
				}).map(a => a["metric-Q1"]);
				var npsdata = weekdata.filter(dayelement=>{
					return (expert["metric-CES"]==dayelement["metric-CES"])
				}).map(a => a["metric-Q2"]);
				var fcrdata = weekdata.filter(dayelement=>{
					return (expert["metric-CES"]==dayelement["metric-CES"])
				}).map(a => a["metric-Q4"]);

				allExpertStats.push({
					name:expert["metric-Agent_Name"],
					CES:expert["metric-CES"],
					CSAT:calcCsat(csatdata),
					NPS:calcNps(npsdata),
					FCR:calcFcr(fcrdata)
				})
			})
			//console.log(allExpertStats);
			var CsatExpertStats= allExpertStats.filter(stat=>{
				return stat.CSAT[0]!='No returns';
			})
			CsatExpertStats.sort((a, b) => (parseFloat(a.CSAT[0]) > parseFloat(b.CSAT[0])) ? 1 : ((parseFloat(a.CSAT[0]) == parseFloat(b.CSAT[0])) ? ((parseFloat(a.CSAT[1]) > parseFloat(b.CSAT[1])) ? 1 : -1) : -1));
			CsatExpertStats.reverse();
			//console.log(CsatExpertStats);
			
			var NpsExpertStats= allExpertStats.filter(stat=>{
				return stat.NPS[0]!='No returns';
			})
			NpsExpertStats.sort((a, b) => (parseFloat(a.NPS[0]) > parseFloat(b.NPS[0])) ? 1 : ((parseFloat(a.NPS[0]) == parseFloat(b.NPS[0])) ? ((parseFloat(a.NPS[3]) > parseFloat(b.NPS[3])) ? 1 : -1) : -1));
			NpsExpertStats.reverse();
			//console.log(NpsExpertStats);

			var FcrExpertStats= allExpertStats.filter(stat=>{
				return stat.FCR[0]!='No returns';
			})
			FcrExpertStats.sort((a, b) => (parseFloat(a.FCR[0]) > parseFloat(b.FCR[0])) ? 1 : ((parseFloat(a.FCR[0]) == parseFloat(b.FCR[0])) ? ((parseFloat(a.FCR[2]) > parseFloat(b.FCR[2])) ? 1 : -1) : -1));
			FcrExpertStats.reverse();
			//console.log(FcrExpertStats);
			if(callback)
				callback({CSAT:CsatExpertStats,NPS:NpsExpertStats,FCR:FcrExpertStats});
		})
	})
}

function populateTopWETable(topData){
	//console.log(topData);
	var CSAThtml='<tr><th>Name</th><th>CSAT %</th><th>CSAT</th><th>Returns</th></tr>';
	for(i=0;i<10;i++){
		CSAThtml+="<tr class='"+ ((parseInt(topData.CSAT[i].CSAT[0])==parseInt(topData.CSAT[0].CSAT[0]))&&(parseInt(topData.CSAT[i].CSAT[1])==parseInt(topData.CSAT[0].CSAT[1]))?"top_stats":"") +"'><td>" + topData.CSAT[i].name + "</td><td>" + topData.CSAT[i].CSAT[0] + "</td><td>" + topData.CSAT[i].CSAT[1] + "</td><td>" + topData.CSAT[i].CSAT[2] + "</td></tr>";
	}
	//console.log(CSAThtml);
	$('#table_top_CSATWE').append(CSAThtml);

	var NPShtml='<tr><th>Name</th><th>NPS %</th><th>NPS</th><th>Returns</th></tr>';
	for(i=0;i<10;i++){
		NPShtml+="<tr class='"+ ((parseInt(topData.NPS[i].NPS[0])==parseInt(topData.NPS[0].NPS[0]))&&(parseInt(topData.NPS[i].NPS[1])==parseInt(topData.NPS[0].NPS[1]))?"top_stats":"") +"'><td>" + topData.NPS[i].name + "</td><td>" + topData.NPS[i].NPS[0] + "</td><td>" + topData.NPS[i].NPS[1] + "</td><td>" + topData.NPS[i].NPS[3] + "</td></tr>";
	}
	//console.log(NPShtml);
	$('#table_top_NPSWE').append(NPShtml);

	var FCRhtml='<tr><th>Name</th><th>FCR %</th><th>FCR</th><th>Returns</th></tr>';
	for(i=0;i<10;i++){
		FCRhtml+="<tr class='"+ ((parseInt(topData.FCR[i].FCR[0])==parseInt(topData.FCR[0].FCR[0]))&&(parseInt(topData.FCR[i].FCR[1])==parseInt(topData.FCR[0].FCR[1]))?"top_stats":"") +"'><td>" + topData.FCR[i].name + "</td><td>" + topData.FCR[i].FCR[0] + "</td><td>" + topData.FCR[i].FCR[1] + "</td><td>" + topData.FCR[i].FCR[2] + "</td></tr>";
	}
	//console.log(FCRhtml);
	$('#table_top_FCRWE').append(FCRhtml);
}

function populateTopMonthTable(topData){
	
	var CSAThtml='<tr><th>Name</th><th>CSAT %</th><th>CSAT</th><th>Returns</th></tr>';
	for(i=0;i<10;i++){
		console.log((parseInt(topData.CSAT[i].CSAT[1])==parseInt(topData.CSAT[0].CSAT[1]))?"background-color:green":"background-color:none");
		CSAThtml+="<tr class='"+ ((parseInt(topData.CSAT[i].CSAT[0])==parseInt(topData.CSAT[0].CSAT[0]))&&(parseInt(topData.CSAT[i].CSAT[1])==parseInt(topData.CSAT[0].CSAT[1]))?"top_stats":"") +"'><td>" + topData.CSAT[i].name + "</td><td>" + topData.CSAT[i].CSAT[0] + "</td><td>" + topData.CSAT[i].CSAT[1] + "</td><td>" + topData.CSAT[i].CSAT[2] + "</td></tr>";
	}
	//console.log(CSAThtml);
	$('#table_top_CSATMonth').append(CSAThtml);

	var NPShtml='<tr><th>Name</th><th>NPS %</th><th>NPS</th><th>Returns</th></tr>';
	for(i=0;i<10;i++){
		NPShtml+="<tr class='"+ ((parseInt(topData.NPS[i].NPS[0])==parseInt(topData.NPS[0].NPS[0]))&&(parseInt(topData.NPS[i].NPS[1])==parseInt(topData.NPS[0].NPS[1]))?"top_stats":"") +"'><td>" + topData.NPS[i].name + "</td><td>" + topData.NPS[i].NPS[0] + "</td><td>" + topData.NPS[i].NPS[1] + "</td><td>" + topData.NPS[i].NPS[3] + "</td></tr>";
	}
	//console.log(NPShtml);
	$('#table_top_NPSMonth').append(NPShtml);

	var FCRhtml='<tr><th>Name</th><th>FCR %</th><th>FCR</th><th>Returns</th></tr>';
	for(i=0;i<10;i++){
		FCRhtml+="<tr class='"+ ((parseInt(topData.FCR[i].FCR[0])==parseInt(topData.FCR[0].FCR[0]))&&(parseInt(topData.FCR[i].FCR[1])==parseInt(topData.FCR[0].FCR[1]))?"top_stats":"") +"'><td>" + topData.FCR[i].name + "</td><td>" + topData.FCR[i].FCR[0] + "</td><td>" + topData.FCR[i].FCR[1] + "</td><td>" + topData.FCR[i].FCR[2] + "</td></tr>";
	}
	//console.log(FCRhtml);
	$('#table_top_FCRMonth').append(FCRhtml);
}

function populateTeamSelect(names,data){
	//console.log(names);
	names.sort((a, b) => (a["team_name"] > b["team_name"]) ? 1 : -1)
	names.forEach(element=>{
		//console.log(element["metric-CES"]);
		var options = new Option(element["team_name"],element["team_id"]);
		$(options).html(element["team_name"]);
		$('#'+data).append(options);
	})
}

function populateExpertSelect(names,data){
	names.sort((a, b) => (a["metric-Agent_Name"] > b["metric-Agent_Name"]) ? 1 : -1)
	names.forEach(element=>{
		//console.log(element["metric-CES"]);
		var options = new Option(element["metric-Agent_Name"],element["metric-CES"]);
		$(options).html(element["metric-Agent_Name"]);
		$('#'+data).append(options);
	})
}

function getCsatTable(CES){
	//console.log(CES);
	if(CES!==null){
		getDataRecord('/api/metric/CES/'+CES,populateCsatTable,CES);
	}
}

function getCsatTeamTable(team){
	//console.log(team);
	if(team!==null){
		getDataRecord('/api/metric/team/'+team,populateCsatTeamTable,team);
	}
}

function getCsatAllTeamTable(){
	getDataRecord('/api/metric/teams',populateAllTeamTable);
}

function getCsatAllExpertTable(){
	getDataRecord('/api/metric/names',populateAllExpertTable);
}

function getUtilizationAllExpertTable(){
	getDataRecord('/api/utilization/get/all',populateAllExpertTableUtilization);
}

function populateAllExpertTableUtilization(data){
	data.sort((a, b) => (parseFloat(a[2]) > parseFloat(b[2])) ? -1 : (a[2]==b[2] ? (a[3] > b[3] ? -1 : 1) : 1));
	var html='<tr><th style="width:50px">Date</th><th style="">Expert Name</th><th style="width:50px">Login In Hours</th><th style="width:50px">Utilized Hours</th><th style="width:50px">Productive Hours</th><th style="width:50px">Total Breaks</th><th style="width:50px">Utilization</th><th style="width:50px">Productivity</th></tr>';
	var html2="";
	//console.log(data);
	data.sort((a, b) => (a.users_CN > b.users_CN) ? 1 : -1);
	data.forEach(element => {
		//console.log(data);
		overbreak=element.util_break.split(":")[0]*60*60 + element.util_break.split(":")[1]*60 + element.util_break.split(":")[2]*1;
		underutilized=element.util_utilizedhours.split(":")[0]*60*60 + element.util_utilizedhours.split(":")[1]*60 + element.util_utilizedhours.split(":")[2]*1;
		
		html2+='<tr><th>'+element.util_date+'</th><th>'+ element.users_CN.toString().trim() + '</th><th>'+element.util_logged+'</th><th style="background-color:'+ ((underutilized<27000)?((underutilized==0)?'none':'#ffa3a3'):'#81db93') +'">'+element.util_utilizedhours+'</th><th>'+element.util_productivehours+'</th><th style="background-color:'+ (overbreak>5400?'#ffa3a3':'none') +'">'+element.util_break+'</th><th>'+element.util_utilizationrate+'</th><th>'+element.util_productivityrate+'</th></tr>';
	});
	$('#table_metrics_summary').html(html+html2);
}



function populateAllExpertTable(data){
	$('.statSelector').attr('disabled',true);
	var html='<tr><th style="width:100px">Expert Name</th><th style="width:40px">CSAT%</th><th style="width:40px">CSAT</th><th style="width:40px">Returns</th><th style="width:40px">NPS</th><th style="width:40px">FCR</th><th style="width:40px">Utilization</th><th style="width:40px">Productivity</th><th style="width:40px">AHT</th><th style="width:40px">ACD</th></tr>';
	var html2;
	var html3='<tr><th style="width:40px">CSAT%</th><th style="width:40px">CSAT</th><th style="width:40px">Returns</th><th style="width:40px">NPS</th><th style="width:40px">FCR</th><th style="width:40px">Utilization</th><th style="width:40px">Productivity</th><th style="width:40px">AHT</th><th style="width:40px">ACD</th></tr>';
	var allExpertStats=[];
	var allStats={
		CSAT:0,
		CSAT_returns:0,
		FCR:0,
		FCR_returns:0,
		NPS_promotor:0,
		NPS_detractor:0,
		NPS_returns:0,
		utilSeconds:0,
		prodSeconds:0,
		loginSeconds:0,
		inbound:0,
		availtime:0,
		handletime:0,
		callshandled:0,
		dayspresent:0
	}
	var statPromise=[];
	$('#arlobirdloading').removeClass('hiddenDiv');
	console.log("in all expert table")
	data.forEach(element => {
		statPromise.push(new Promise(function(resolve,reject){
			getDataRecord('/api/metric/CES/'+element["metric-CES"],function(data){
				getUtilDateStats((metricDate.getMonth()+1)+'/1/'+metricDate.getFullYear(),(metricDate.getMonth()+1)+'/'+metricDate.getDate()+'/'+metricDate.getFullYear(),element["metric-CES"],function(datautil){
					//console.log(datautil);
					calcUtil(datautil,function(utildata){
						var expertStats=[element["metric-Agent_Name"],element["metric-CES"],getStats(data)[0][0],getStats(data)[0][1],getStats(data)[0][2],getStats(data)[1][0],getStats(data)[2][0],utildata.utilRate,utildata.prodRate,utildata.aht,utildata.acd];
						//console.log(expertStats);
						if(expertStats[2]!=='No returns'){
							allExpertStats.push(expertStats);
							allStats.CSAT+=getStats(data)[0][1];
							allStats.CSAT_returns+=getStats(data)[0][2];
							allStats.NPS_promotor+=getStats(data)[1][1];
							allStats.NPS_detractor+=getStats(data)[1][2];
							allStats.NPS_returns+=getStats(data)[1][3];
							allStats.FCR+=getStats(data)[2][1];
							allStats.FCR_returns+=getStats(data)[2][2];
							allStats.utilSeconds+=utildata.utilSeconds;
							allStats.prodSeconds+=utildata.prodSeconds;
							allStats.loginSeconds+=utildata.loginSeconds;
							allStats.inbound+=utildata.totalInbound;
							allStats.availtime+=utildata.totalAvailtime;
							allStats.handletime+=utildata.totalHandleTime;
							allStats.callshandled+=utildata.totalCallsHandled
							allStats.dayspresent+=utildata.attendance;
							//console.log(getStats(data));
							resolve('resolved');

						}else{
							resolve('rejected');
						}
	

						//console.log(utildata); #$#$
					})
				});
			});
		}));
	});
	
	Promise.all(statPromise).then(function(){
		html2='';
		allExpertStats.sort((a, b) => (parseFloat(a[2]) > parseFloat(b[2])) ? -1 : (a[2]==b[2] ? (a[3] > b[3] ? -1 : 1) : 1));
		allExpertStats.forEach(expert => {
			//console.log(expert);
			html2+='<tr><th><a href="#" onclick=\"showExpert(\''+ expert[1].toString().trim() +'\')\">'+expert[0]+'</a></th><th style=background-color:' + getColorForPercentage(parseFloat(expert[2])) + '>'+expert[2]+'</th><th>'+expert[3]+'</th><th>'+expert[4]+'</th><th style=background-color:' + getColorForPercentage(parseFloat(expert[5])) + '>'+expert[5]+'</th><th style=background-color:' + getColorForPercentage(parseFloat(expert[6])) + '>'+expert[6]+'</th><th>'+expert[7]+'</th><th>'+expert[8]+'</th><th>'+expert[9]+'</th><th>'+expert[10]+'</th></tr>';
			
		});
		$('#table_metrics').html(html+html2);
		//console.log((allStats.NPS_promotor-allStats.NPS_detractor)/allStats.NPS_returns);
		/*console.log("allexperts:"+allStats.dayspresent);
		console.log("allexpertshandletime:"+allStats.handletime);
		console.log("allexpertshandled:"+allStats.callshandled);
		console.log("allexpertsavail:"+allStats.availtime);
		console.log("allexpertsinbound:"+allStats.inbound);*/
		var totalAHT=((allStats.handletime/allStats.callshandled)/60).toFixed(2);
		var totalACD=Math.round((allStats.inbound+(allStats.availtime/(allStats.handletime/allStats.callshandled)))/(allStats.dayspresent));
		html4='<td style="text-align:center;background-color:'+ getColorForPercentage(parseFloat(((allStats.CSAT/allStats.CSAT_returns)*100).toFixed(2)))+'">'+((allStats.CSAT/allStats.CSAT_returns)*100).toFixed(2)+'%</td><td style="text-align:center">'+allStats.CSAT+'</td><td style="text-align:center">'+allStats.CSAT_returns+'</td><td style="text-align:center;background-color:'+getColorForPercentage(parseFloat((((allStats.NPS_promotor-allStats.NPS_detractor)/allStats.NPS_returns)*100).toFixed(2)))+'">'+(((allStats.NPS_promotor-allStats.NPS_detractor)/allStats.NPS_returns)*100).toFixed(2)+'%</td><td style="text-align:center;background-color:'+ getColorForPercentage(parseFloat(((allStats.FCR/allStats.FCR_returns)*100).toFixed(2)))+'">'+((allStats.FCR/allStats.FCR_returns)*100).toFixed(2)+'%</td><td style="text-align:center">'+((allStats.utilSeconds/allStats.loginSeconds)*100).toFixed(2)+'%</td><td style="text-align:center">'+((allStats.prodSeconds/allStats.loginSeconds)*100).toFixed(2)+'%</td><td style="text-align:center">'+totalAHT+'</td><td style="text-align:center">'+totalACD+'</td></tr>';
		$('#table_metrics_summary').html(html3+html4);


		$('#table_metrics_summary').removeClass('hiddenDiv');
		$('#table_metrics').removeClass('hiddenDiv');
		$('#arlobirdloading').addClass('hiddenDiv');
		$('.statSelector').attr('disabled',false);

		$('#table_metrics_deficit').removeClass('hiddenDiv');
		$('#CSAT_deficit').html(getDeficit(allStats.CSAT,allStats.CSAT_returns,85));
    	$('#NPS_deficit').html(getDeficit(allStats.NPS_promotor-allStats.NPS_detractor,allStats.NPS_returns,45));
    	$('#FCR_deficit').html(getDeficit(allStats.FCR,allStats.FCR_returns,70));
	})
}

function showExpert(expert){
	$('#expertradio').prop('checked',true);
	$('#expert_name').val(expert);
	$('#team_name_div').addClass('hiddenDiv');
	$('#table_metrics_expert_summary').html('');
	$('#table_metrics_expert_summary').addClass('hiddenDiv');
	$('#expert_name_div').removeClass('hiddenDiv');
	$('#table_metrics').html('');
	$('#table_metrics_summary').html('');
	getCsatTable($('#expert_name').val());
}

function showTeam(team){
	$('#teamradio').prop('checked',true);
	$('#team_name').val(team);
	$('#expert_name_div').addClass('hiddenDiv');
	$('#team_name_div').removeClass('hiddenDiv');
	$('#table_metrics_expert_summary').html('');
	$('#table_metrics_expert_summary').addClass('hiddenDiv');
	$('#table_metrics').html('');
	$('#table_metrics_summary').html('');
	getCsatTeamTable($('#team_name').val());
}

function populateAllTeamTable(data){
	$('.statSelector').attr('disabled',true);
	var html='<tr><th style="width:100px">Expert Name</th><th style="width:40px">CSAT%</th><th style="width:40px">CSAT</th><th style="width:40px">Returns</th><th style="width:40px">NPS</th><th style="width:40px">FCR</th><th style="width:40px">Utilization</th><th style="width:40px">Productivity</th><th style="width:40px">AHT</th><th style="width:40px">ACD</th></tr>';
	var html2;
	var html3='<tr><th style="width:40px">CSAT%</th><th style="width:40px">CSAT</th><th style="width:40px">Returns</th><th style="width:40px">NPS</th><th style="width:40px">FCR</th><th style="width:40px">Utilization</th><th style="width:40px">Productivity</th><th style="width:40px">AHT</th><th style="width:40px">ACD</th></tr>';
	var allTeamStats=[];

	var allStats={
		CSAT:0,
		CSAT_returns:0,
		FCR:0,
		FCR_returns:0,
		NPS_promotor:0,
		NPS_detractor:0,
		NPS_returns:0,
		utilSeconds:0,
		prodSeconds:0,
		loginSeconds:0,
		inbound:0,
		availtime:0,
		handletime:0,
		callshandled:0,
		dayspresent:0
	}
	var statPromise=[];
	$('#arlobirdloading').removeClass('hiddenDiv');
	data.forEach(element => {
		//console.log(element.team_id);
		statPromise.push(new Promise(function(resolve,reject){
			getDataRecord('/api/metric/team/'+element.team_id,function(data){ 
				getUtilDateTeamStats((metricDate.getMonth()+1)+'/1/'+metricDate.getFullYear(),(metricDate.getMonth()+1)+'/'+metricDate.getDate()+'/'+metricDate.getFullYear(),element.team_id,function(datautil){
					//console.log(datautil);
					calcUtil(datautil,function(utildata){
							
						var teamStats=[element.team_name,element.team_id,getStats(data)[0],getStats(data)[1],getStats(data)[2],utildata.utilSeconds,utildata.prodSeconds,utildata.loginSeconds,utildata.aht,utildata.acd];
					
						if(teamStats[2][0]!="No returns"){
							allTeamStats.push(teamStats);
							resolve('rejected');
						}
						
						allStats.CSAT+=getStats(data)[0][1];
						allStats.CSAT_returns+=getStats(data)[0][2];
						allStats.NPS_promotor+=getStats(data)[1][1];
						allStats.NPS_detractor+=getStats(data)[1][2];
						allStats.NPS_returns+=getStats(data)[1][3];
						allStats.FCR+=getStats(data)[2][1];
						allStats.FCR_returns+=getStats(data)[2][2];
						allStats.utilSeconds+=utildata.utilSeconds;
						allStats.prodSeconds+=utildata.prodSeconds;
						allStats.loginSeconds+=utildata.loginSeconds;
						allStats.inbound+=utildata.totalInbound;
						allStats.availtime+=utildata.totalAvailtime;
						allStats.handletime+=utildata.totalHandleTime;
						allStats.callshandled+=utildata.totalCallsHandled
						allStats.dayspresent+=utildata.attendance;
						//console.log(getStats(data));
						resolve();
						
					});
				});
			});
		}));
	});
	
	Promise.all(statPromise).then(function(){
		html2='';
		allTeamStats.sort((a, b) => (parseFloat(a[2][0]) > parseFloat(b[2][0])) ? -1 : 1)
		allTeamStats.forEach(team => {
			//console.log(team);
			html2+='<tr><th><a href="#" onclick=\"showTeam(\''+ team[1].toString().trim() +'\')\">'+team[0]+'</a></th><th style="background-color:' + getColorForPercentage(parseFloat(team[2][0])) + '">'+team[2][0]+'</th><th>'+team[2][1]+'</th><th>'+team[2][2]+'</th><th style="background-color:' + getColorForPercentage(parseFloat(team[3][0])) + '">'+team[3][0]+'</th><th style="background-color:' + getColorForPercentage(parseFloat(team[4][0])) + '">'+team[4][0]+'</th><th>'+(((team[5]/team[7])*100).toFixed(2))+'%</th><th>'+(((team[6]/team[7])*100).toFixed(2))+'%</th><th>'+team[8]+'</th><th>'+team[9]+'</th></tr>';
		});
		$('#table_metrics').html(html+html2);

		var totalAHT=((allStats.handletime/allStats.callshandled)/60).toFixed(2);
		var totalACD=Math.round((allStats.inbound+(allStats.availtime/(allStats.handletime/allStats.callshandled)))/(allStats.dayspresent));
		html4='<th style="background-color:'+ getColorForPercentage(parseFloat(((allStats.CSAT/allStats.CSAT_returns)*100).toFixed(2)))+'">'+((allStats.CSAT/allStats.CSAT_returns)*100).toFixed(2)+'%</th><th>'+allStats.CSAT+'</th><th>'+allStats.CSAT_returns+'</th><th style="background-color:'+ getColorForPercentage(parseFloat((((allStats.NPS_promotor-allStats.NPS_detractor)/allStats.NPS_returns)*100).toFixed(2)))+'">'+(((allStats.NPS_promotor-allStats.NPS_detractor)/allStats.NPS_returns)*100).toFixed(2)+'%</th><th style="background-color:'+ getColorForPercentage(parseFloat(((allStats.FCR/allStats.FCR_returns)*100).toFixed(2)))+'">'+((allStats.FCR/allStats.FCR_returns)*100).toFixed(2)+'%</th><th style="text-align:center">'+((allStats.utilSeconds/allStats.loginSeconds)*100).toFixed(2)+'%</th><th style="text-align:center">'+((allStats.prodSeconds/allStats.loginSeconds)*100).toFixed(2)+'%</th><th style="text-align:center">'+totalAHT+'</th><th style="text-align:center">'+totalACD+'</th></tr>';
		$('#table_metrics_summary').html(html3+html4);

		$('#table_metrics_summary').removeClass('hiddenDiv');
		$('#table_metrics').removeClass('hiddenDiv');
		$('#arlobirdloading').addClass('hiddenDiv');
		$('.statSelector').attr('disabled',false);

		$('#table_metrics_deficit').removeClass('hiddenDiv');
		$('#CSAT_deficit').html(getDeficit(allStats.CSAT,allStats.CSAT_returns,85));
    	$('#NPS_deficit').html(getDeficit(allStats.NPS_promotor-allStats.NPS_detractor,allStats.NPS_returns,45));
    	$('#FCR_deficit').html(getDeficit(allStats.FCR,allStats.FCR_returns,70));
	})
}

function populateCsatTable(data,CES){
	$('.statSelector').attr('disabled',true);
	var statPromise=[];
	var html2='';
	var html='<tr><th style="width:40px">Survey Date</th><th style="width:75px">Case Number</th><th style="width:75px">CSAT</th><th style="width:75px">NPS</th><th style="width:75px">FCR</th><th style="width:75px">Comment</th></tr>';
	//console.log(data);
	$('#arlobirdloading').removeClass('hiddenDiv');

	data.forEach(element => {
		//console.log(new Date(getDateString(element["metric-Response-Completiondate"])));
		statPromise.push(new Promise(function(resolve,reject){
			if(new Date(getDateString(element["metric-Response-Completiondate"])).getMonth()==metricDate.getMonth()){
				html+='<tr><td>' + element["metric-Response-Completiondate"] + '</td><td>' + element["metric-Case_Number"] + '</td><td>' + element["metric-Q1"] + '</td><td>' + element["metric-Q2"] + '</td><td>' + element["metric-Q4"] + '</td><td>' + 
					(((element["metric-General_Comments"]!=null)&&(element["metric-General_Comments"]!='')&&(element["metric-General_Comments"]!=0))?('<b>General Comments:</b>'+ element["metric-General_Comments"] + '<br><br>'):('')) + 
					(((element["metric-NPS_Detractor_Comments"]!=null)&&(element["metric-NPS_Detractor_Comments"]!='')&&(element["metric-NPS_Detractor_Comments"]!=0))?('<b>NPS Detractor Comments:</b>'+ element["metric-NPS_Detractor_Comments"] + '<br><br>'):('')) + 
					(((element["metric-CES_General_Comments"]!=null)&&(element["metric-CES_General_Comments"]!='')&&(element["metric-CES_General_Comments"]!=0))?('<b>CES General Comments:</b>'+ element["metric-CES_General_Comments"] + '<br><br>'):('')) + 
					'</td></tr>';
				//console.log(html);
				resolve('resolved');
			}else{
				resolve('rejected');
			}
		}));
	})
	//console.log(getStats(data));
	statPromise.push(new Promise(function(resolve,reject){
		getUtilDateStats((metricDate.getMonth()+1)+'/1/'+metricDate.getFullYear(),(metricDate.getMonth()+1)+'/'+metricDate.getDate()+'/'+metricDate.getFullYear(),CES,function(datautil){
			calcUtil(datautil,function(utildata){
				getQADateStats((metricDate.getMonth()+1)+'/1/'+metricDate.getFullYear(),(metricDate.getMonth()+1)+'/'+metricDate.getDate()+'/'+metricDate.getFullYear(),CES,function(qadata){
					var inbound=utildata.totalInbound;
					var qascore=(qadata.stats.length)?(qadata.totalScore/qadata.stats.length).toFixed(2)+'%':'No Data';
					
					console.log(qascore);
					//var expertStats=[element["metric-Agent_Name"],element["metric-CES"],getStats(data)[0][0],getStats(data)[0][1],getStats(data)[0][2],getStats(data)[1][0],getStats(data)[2][0],utildata.utilRate,utildata.prodRate,aht,acd];
					html2='<tr id="table_metrics_summary_header"><th style="width:70px">CSAT%</th><th style="width:70px">CSAT</th><th style="width:70px">Returns</th><th style="width:70px">NPS</th><th style="width:70px">FCR</th><th style="width:70px">Utilization</th><th style="width:70px">Productivity</th><th style="width:70px">AHT</th><th style="width:70px">ACD</th><th style="width:70px">QA</th><th style="width:70px">Overbreaks</th><th style="width:70px;display:none">Inbound</th><th style="width:70px;display:none">Cases Closed</th></tr>'+
					'<tr id="table_metrics_summary_data"><td style="text-align:center;background-color:'+ getColorForPercentage(parseFloat(getStats(data)[0][0])) +'">'+getStats(data)[0][0]+'</td><td style="text-align:center">'+getStats(data)[0][1]+'</td><td style="text-align:center">'+getStats(data)[0][2]+'</td><td style="text-align:center;background-color:'+ getColorForPercentage(parseFloat(getStats(data)[1][0])) +'">'+getStats(data)[1][0]+'</td><td style="text-align:center;background-color:'+ getColorForPercentage(parseFloat(getStats(data)[2][0])) +'">'+getStats(data)[2][0]+'</td><td style="text-align:center">'+utildata.utilRate+'</td><td style="text-align:center">'+utildata.prodRate+'</td><td style="text-align:center">'+utildata.aht+'</td><td style="text-align:center">'+utildata.acd+'</td><td style="text-align:center">'+qascore+'</td><td style="text-align:center">'+datautil.overbreak+'</td><td style="text-align:center;display:none">'+inbound+'</td><td style="text-align:center;display:none">'+datautil.cases+'</td></tr>';
					resolve('resolved');
				})

			})
		});
	}));
	Promise.all(statPromise).then(function(){
		$('#table_metrics').html(html);
		$('#table_metrics_summary').html(html2);
		$('#arlobirdloading').toggleClass('hiddenDiv');
		$('#table_metrics_summary').removeClass('hiddenDiv');
		$('#table_metrics').removeClass('hiddenDiv');
		$('.statSelector').attr('disabled',false);

		$('#table_metrics_deficit').removeClass('hiddenDiv');
		$('#CSAT_deficit').html(getDeficit(getStats(data)[0][1],getStats(data)[0][2],85));
    	$('#NPS_deficit').html(getDeficit(getStats(data)[1][1]-getStats(data)[1][2],getStats(data)[1][3],45));
    	$('#FCR_deficit').html(getDeficit(getStats(data)[2][1],getStats(data)[2][2],70));
	});
}

function getStats(data){
	//console.log(data);
	var date_now = new Date();
	
	var CSAT_data = data.filter(element => {
			//console.log(element)
			return new Date(getDateString(element["metric-Response-Completiondate"])).getMonth()==metricDate.getMonth();
		}
	).map(a => a["metric-Q1"]);
	//console.log(CSAT_data);
	//var CSAT_data = data.map(a => a["metric-Q1"]);
	var NPS_data = data.filter(element => {
			return new Date(getDateString(element["metric-Response-Completiondate"])).getMonth()==metricDate.getMonth()
		}
	).map(a => a["metric-Q2"]);
	//console.log(NPS_data);
	var FCR_data = data.filter(element => {
			return new Date(getDateString(element["metric-Response-Completiondate"])).getMonth()==metricDate.getMonth()
		}
	).map(a => a["metric-Q4"]);
	//console.log(FCR_data);
	
	//console.log('Date: ' + data["metric-Response-Completiondate"])
	return [calcCsat(CSAT_data),calcNps(NPS_data),calcFcr(FCR_data)];
}

function calcCsat(data){
	var CSAT_count=0;
	var CSAT_returns=0;
	for (i=0;i<data.length;i++){
		if((data[i].toLowerCase()=='excellent')||(data[i].toLowerCase()=='very good')||(data[i].toLowerCase()=='good')||(data[i]=='5')||(data[i]=='4')||(data[i]=='3')){	
			CSAT_count++
		};
		if(data[i]!==''){
			CSAT_returns++
		}
	}
	return data.length>0?[((CSAT_count/CSAT_returns)*100).toFixed(2)+'%',CSAT_count,CSAT_returns]:['No returns',0,0];
}

function calcFcr(data){
	var FCR_count=0;
	for (i=0;i<data.length;i++){
		if(data[i].toLowerCase()=='only 1 contact'){	
			FCR_count++
		}
	}
	return data.length>0?[((FCR_count/data.length)*100).toFixed(2)+'%',FCR_count,data.length]:['No returns',0,0];
}

function calcNps(data){
	var NPS_promoter_count=0;
	var NPS_detractor_count=0;
	for (i=0;i<data.length;i++){
		if(data[i]<7){	
			NPS_detractor_count++;
		} else if (data[i]>8){	
			NPS_promoter_count++;
		}
	}
	//console.log([(((NPS_promoter_count-NPS_detractor_count)/data.length)*100).toFixed(2)+'%',NPS_promoter_count,NPS_detractor_count,data.length]);
	return data.length?[(((NPS_promoter_count-NPS_detractor_count)/data.length)*100).toFixed(2)+'%',NPS_promoter_count,NPS_detractor_count,data.length]:['No returns',0,0,0];
}
//collate per expert data and then display, use api/distinctmetric/team
function populateCsatTeamTable(data,team){
	$('.statSelector').attr('disabled',true);
	$('#table_metrics_expert_summary').addClass('hiddenDiv');
	$('#table_metrics_summary').addClass('hiddenDiv');
	$('#table_metrics').addClass('hiddenDiv');
	$('#table_metrics_deficit').addClass('hiddenDiv');
	var html='';
	var html2='';
	var html3='';
	var statPromise=[];
	var allStats={
		CSAT:0,
		CSAT_returns:0,
		FCR:0,
		FCR_returns:0,
		NPS_promotor:0,
		NPS_detractor:0,
		NPS_returns:0,
		utilSeconds:0,
		prodSeconds:0,
		loginSeconds:0,
		inbound:0,
		availtime:0,
		handletime:0,
		callshandled:0,
		dayspresent:0
	}
	$('#arlobirdloading').removeClass('hiddenDiv');

	var datedReturns=data.filter(element => {
		return (new Date(getDateString(element["metric-Response-Completiondate"])).getMonth()==metricDate.getMonth());
	});
	
	//console.log(datedReturns);
	//var expertCES=[...new Set(datedReturns.map(x=>x["metric-CES"]))];

	var experts = Array.from(new Set(datedReturns.map(s => s["metric-CES"])))
		.map(ces => {
			return {
				ces:ces,
				name: datedReturns.find(s => s["metric-CES"] === ces)["metric-Agent_Name"]
			}
		})
	//console.log(experts);
	var allexpertStats=[];

	experts.forEach(function(element){
		var data=datedReturns.filter(ces=> {
			return ces["metric-CES"] === element.ces
		})
		//console.log(data);
		statPromise.push(new Promise(function(resolve,reject){
			getUtilDateStats((metricDate.getMonth()+1)+'/1/'+metricDate.getFullYear(),(metricDate.getMonth()+1)+'/'+metricDate.getDate()+'/'+metricDate.getFullYear(),element.ces,function(datautil){
				
				calcUtil(datautil,function(utildata){
					var expertStats=[element.name,element.ces,getStats(data)[0][0],getStats(data)[0][1],getStats(data)[0][2],getStats(data)[1][0],getStats(data)[2][0],utildata.utilRate,utildata.prodRate,utildata.aht,utildata.acd];
					
					//console.log(expertStats);
					if(expertStats[2]!=='No returns'){
						allexpertStats.push(expertStats);
						
						allStats.CSAT+=getStats(data)[0][1];
						allStats.CSAT_returns+=getStats(data)[0][2];
						allStats.NPS_promotor+=getStats(data)[1][1];
						allStats.NPS_detractor+=getStats(data)[1][2];
						allStats.NPS_returns+=getStats(data)[1][3];
						allStats.FCR+=getStats(data)[2][1];
						allStats.FCR_returns+=getStats(data)[2][2];
						allStats.utilSeconds+=utildata.utilSeconds;
						allStats.prodSeconds+=utildata.prodSeconds;
						allStats.loginSeconds+=utildata.loginSeconds;
						allStats.inbound+=utildata.totalInbound;
						allStats.availtime+=utildata.totalAvailtime;
						allStats.handletime+=utildata.totalHandleTime;
						allStats.callshandled+=utildata.totalCallsHandled
						allStats.dayspresent+=utildata.attendance;
						//console.log(getStats(data));
						resolve('resolved');

					}else{
						resolve('rejected');
					}
					//console.log(utildata); #$#$
				})
			});
		}))
	});
	
	//console.log(allexpertStats);
	//allexpertStats.sort
	//console.log(experts);
	
	
	
	
	data.sort((a, b) => (a["metric-Agent_Name"] > b["metric-Agent_Name"]) ? 1 : -1)
	var html='<tr><th style="width:40px">Survey Date</th><th style="width:75px">Agent Name</th><th style="width:75px">Case Number</th><th style="width:75px">CSAT</th><th style="width:75px">NPS</th><th style="width:75px">FCR</th><th>Comment</th></tr>';
	data.forEach(element => {
		statPromise.push(new Promise(function(resolve,reject){
			if(new Date(getDateString(element["metric-Response-Completiondate"])).getMonth()==metricDate.getMonth()){
				//console.log(element["metric-CES"]);
				//experts[element["metric-CES"]]=0;
				//console.log(experts);
				//experts[element["metric-CES"]].push(element);
				//console.log(metricDate.getMonth());
				//console.log(new Date(getDateString(element["metric-Response-Completiondate"])).getMonth());
				html+='<tr><td>'+ element["metric-Response-Completiondate"] +'</td><td>'+ element["metric-Agent_Name"] +'</td><td>'+ element["metric-Case_Number"] +'</td><td>'+ element["metric-Q1"] +'</td><td>'+ element["metric-Q2"] +'</td><td>'+ element["metric-Q4"] +'</td><td>' +
					(((element["metric-General_Comments"]!=null)&&(element["metric-General_Comments"]!='')&&(element["metric-General_Comments"]!=0))?('<b>General Comments:</b>'+ element["metric-General_Comments"] + '<br><br>'):('')) + 
					(((element["metric-NPS_Detractor_Comments"]!=null)&&(element["metric-NPS_Detractor_Comments"]!='')&&(element["metric-NPS_Detractor_Comments"]!=0))?('<b>NPS Detractor Comments:</b>'+ element["metric-NPS_Detractor_Comments"] + '<br><br>'):('')) + 
					(((element["metric-CES_General_Comments"]!=null)&&(element["metric-CES_General_Comments"]!='')&&(element["metric-CES_General_Comments"]!=0))?('<b>CES General Comments:</b>'+ element["metric-CES_General_Comments"] + '<br><br>'):('')) + 
					'</td></tr>';
				resolve('resolved');
			}else{
				resolve('rejected');
			}
		}));
	})
	
	Promise.all(statPromise).then(function(){
		var totalAHT=((allStats.handletime/allStats.callshandled)/60).toFixed(2);
		var totalACD=Math.round((allStats.inbound+(allStats.availtime/(allStats.handletime/allStats.callshandled)))/(allStats.dayspresent));
		console.log(totalAHT);
		console.log(totalACD);
		html2='<tr><th style="width:40px">CSAT%</th><th style="width:40px">CSAT</th><th style="width:40px">Returns</th><th style="width:40px">NPS</th><th style="width:40px">FCR</th><th style="width:40px">Utilization</th><th style="width:40px">Productivity</th><th style="width:40px">AHT</th><th style="width:40px">ACD</th></tr>'+
		'<tr><th style="background-color:'+ getColorForPercentage(parseFloat(getStats(data)[0][0])) +'">'+getStats(data)[0][0]+'</th><th >'+getStats(data)[0][1]+'</th><th>'+getStats(data)[0][2]+'</th><th style="background-color:'+ getColorForPercentage(parseFloat(getStats(data)[1][0])) +'">'+getStats(data)[1][0]+'</th><th style="background-color:'+ getColorForPercentage(parseFloat(getStats(data)[2][0])) +'">'+getStats(data)[2][0]+'</th><th>'+((allStats.utilSeconds/allStats.loginSeconds)*100).toFixed(2)+'%</th><th style="text-align:center">'+((allStats.prodSeconds/allStats.loginSeconds)*100).toFixed(2)+'%</th><th>' + totalAHT + '</th><th>' + totalACD + '</th></tr>';
	

		allexpertStats.sort((a, b) => (parseFloat(a[2]) > parseFloat(b[2])) ? -1 : (a[2]==b[2] ? (a[3] > b[3] ? -1 : 1) : 1));
		html3='<tr><th style="text-align:center">Expert</th><th style="width:40px">CSAT%</th><th style="width:40px">CSAT</th><th style="width:40px">Returns</th><th style="width:40px">NPS</th><th style="width:40px">FCR</th><th style="width:40px">Utilization</th><th style="width:40px">Productivity</th><th style="width:40px">AHT</th><th style="width:40px">ACD</th></tr>';
		allexpertStats.forEach(function (expert){
			html3+='<tr><th><a href="#" onclick=\"showExpert(\''+ expert[1].toString().trim() +'\')\">'+expert[0]+'</a></th><th style="background-color:' + getColorForPercentage(parseFloat(expert[2])) + '">'+expert[2]+'</th><th>'+expert[3]+'</th><th>'+expert[4]+'</th><th style="background-color:' + getColorForPercentage(parseFloat(expert[5])) + '">'+expert[5]+'</th><th style="background-color:' + getColorForPercentage(parseFloat(expert[6])) + '">'+expert[6]+'</th><th>'+expert[7]+'</th><th>'+expert[8]+'</th><th>'+expert[9]+'</th><th>'+expert[10]+'</th></tr>';
		})

		$('#table_metrics').html(html);
		$('#table_metrics_summary').html(html2);
		$('#table_metrics_expert_summary').html(html3);
		$('#arlobirdloading').toggleClass('hiddenDiv');
		$('#table_metrics_expert_summary').removeClass('hiddenDiv');
		$('#table_metrics_summary').removeClass('hiddenDiv');
		$('#table_metrics').removeClass('hiddenDiv');
		$('.statSelector').attr('disabled',false);

		$('#table_metrics_deficit').removeClass('hiddenDiv');

		$('#CSAT_deficit').html(getDeficit(getStats(data)[0][1],getStats(data)[0][2],85));
    	$('#NPS_deficit').html(getDeficit(getStats(data)[1][1]-getStats(data)[1][2],getStats(data)[1][3],45));
    	$('#FCR_deficit').html(getDeficit(getStats(data)[2][1],getStats(data)[2][2],70));
	});
	//console.log(experts);
}