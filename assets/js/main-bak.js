var myID;

var expertName;
var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
var phonetics = ['alpha','bravo','charlie','delta','echo','foxtrot','golf','hotel','india','juliet','kilo','lima','mike','nancy','oscar','papa','quebec','romeo','sierra','tango','uniform','victory','whiskey','xray','yankee','zulu'];
var displayText = '';
var email='';
var EOS=[];
var num_cases=0;
var AHT_num_cases=0;
var standardStorage = [];
var prevSlide;
var googleScriptLoaded=false;
var loopCounter=0;
var birthday=[];
var inbound=0;
var currentStandardT = {
	inquiry:"",
	name:"",
	phone:"",
	email:"",
	BSSN:"",
	BSFW:"",
	CamSN:"",
	CamFW:"",
	DOP:"",
	POP:"",
	ISP:"",
	TS:"",
	caseclosed_standard:"",
	RMA_standard:"",
	call_pulse:"",
	nextaction:"",
	casenumber_standard:"",
	logs:"",
	selfservice:"",
	survey:"",
	KB:""
}
var vdb_affected_SN=['A2G19AK1A0185','A2G19AK8A08DD','A2G19AKEA01AE','A2G19AKJA01F8','A2G19AKTA08A5','A2G19AKYA096F','A2G19AK0A0A5F','A2G19AK8A01A8','A2G19AKDA01E5','A2G19AKJA01DC','A2G19AKTA0227','A2G19AKYA08AA','A2G19AK1A08F2','A2G19AK9A01E1','A2G19AKEA0A31','A2G19AKKA0A1A','A2G19AKTA0A3D','A2G19AK3A01B1','A2G19AKAA01F0','A2G19AKGA0112','A2G19AKMA01FB','A2G19AKUA0987','A2G19AK0A08AB','A2G19AK7A018B','A2G19AKCA08FD','A2G19AKHA0A42','A2G19AKSA0A2E','A2G19AKYA022C','A2G19AK0A099A','A2G19AK8A018C','A2G19AKDA00F6','A2G19AKJA01CE','A2G19AKSA0A3C','A2G19AKYA089C','A2G19AK2A0194','A2G19AK9A0A02','A2G19AKEA0B04','A2G19AKKA0AFE','A2G19AKTA0A75','A2G19AK1A022E','A2G19AK8A0ABB','A2G19AKEA01CA','A2G19AKKA0963','A2G19AKTA08B3','A2G19AKYA097D','A2G19AK0A023B','A2G19AK6A09AE','A2G19AKCA01E4','A2G19AKHA0A0A','A2G19AKSA08C0','A2G19AKYA0191','A2G19AK0A013E','A2G19AK6A01A6','A2G19AKCA01D6','A2G19AKHA0953','A2G19AKSA0234','A2G19AKXA0A5D','A2G19AK4A017A','A2G19AKBA0A04','A2G19AKHA0121','A2G19AKRA095A','A2G19AKWA08A8','A2G19AK2A08F3','A2G19AK9A0ABC','A2G19AKFA01E7','A2G19AKLA0A0D','A2G19AKUA08B4','A2G19AK5A0189','A2G19AKCA01AC','A2G19AKHA01F7','A2G19AKSA010D','A2G19AKXA0239','A2G19AK1A08D6','A2G19AK9A019B','A2G19AKEA0942','A2G19AKKA0A0C','A2G19AKTA0978','A2G19AKYA09A7','A2G19AK3A08D8','A2G19AKAA08DF','A2G19AKGA01BE','A2G19AKMA0206','A2G19AKUA0A5A','A2G19AK3A0AA8','A2G19AKBA019D','A2G19AKGA0960','A2G19AKMA0949','A2G19AKUA0A68','A2G19AK4A08BD','A2G19AKCA0100','A2G19AKHA01DB','A2G19AKRA0A3B','A2G19AKWA09A5','A2G19AK3A0195','A2G19AKAA01C6','A2G19AKGA00EB','A2G19AKLA0A37','A2G19AKUA08C2','A2G19AK3A0AB6','A2G19AKBA08FC','A2G19AKGA0A17','A2G19AKPA0991','A2G19AKWA0238','A2G19AK5A08F6','A2G19AKCA01C8','A2G19AKHA0202','A2G19AKSA0218','A2G19AKXA08B7']

var compareColumns=0;
try{
	expertName=getCookie('expertname');
	var user=JSON.parse(getCookie('userdetails'));
	var userCN=user.users_CN;
	var userlevel=user.users_type.substr(6,1);
	var usertype=user.users_type=='RTA'?'RTA':user.users_type.substr(8);
	var userteam=user.users_team;
	var userCES=user.users_CES;
}catch(err){
}

var l2endorser_editor=[103930,137451];

var expanded = false;

var currentRecord=1;

var mousetimeout;
var screensaver_active = false;
var idletime = 60;
var folder = "/assets/img/commendations/";
var screensaverImageList=[];
var screensaverMasterImageList=[];
var displayLoopHandler;

var placeSearch, autocomplete;

var auxRequestArray=[];
var auxRequestsArray=[];

var slideIndex = [1,0];
var slideId = ["mySlides1", "mySlides2"]
//showSlides(1, 1);

var percentColors = [
    { pct: 0, color: { r: 0xf8, g: 0x69, b: 0x6b } },
    { pct: 65, color: { r: 0xf8, g: 0x69, b: 0x6b } },
	{ pct: 85, color: { r: 0xee, g: 0xe6, b: 0x83 } },
    { pct: 100, color: { r: 0x63, g: 0xbe, b: 0x7b } } ];

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
}

var sundayDate=new Date();
var prevMondayDate=new Date();
var weekMonth1, weekDay1, weekYear1, weekMonth2, weekDay2, weekYear2;

$(document).mousemove(function (){
	//runScreenSaver()
});

document.onkeyup = function(e) {
	//runScreenSaver()
	//console.log(e.target.id);
	//console.log(e.target.id=='#counter');
	//console.log(e);
	if (e.ctrlKey && e.shiftKey && e.which == 85) {
		$("#modal_update").css('display','block');
	}

	if (e.ctrlKey && e.shiftKey && e.which == 220) {
		
		arleeopen=true;
		$('#modal_arlee').css('display','block');
		if(!arleeloaded){
			init();
			$('#testCanvas').css('display','none');
			$('#arleeloading').css('display','block');
		}
	}

	if((e.which == 13)&&(e.target.id=='counter')){
		//console.log('counter trigger');
		//Disable textbox to prevent multiple submit
		$('#counter').attr("disabled", "disabled");
		currentRecord=$('#counter').val();
		getData(0);
		//Enable the textbox again if needed.
		$('#counter').removeAttr("disabled");
	}
}



$('a[href*="#"]')
// Remove links that don't actually link to anything
.not('[href="#"]')
.not('[href="#0"]')
.click(function(event) {
	// On-page links
	if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')&&location.hostname == this.hostname) {
		// Figure out element to scroll to
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
		// Does a scroll target exist?
		if (target.length) {
		// Only prevent default if animation is actually gonna happen
			event.preventDefault();
			$('body').animate({
				scrollTop: target.offset().top
			}, 1000, function() {
				// Callback after animation
				// Must change focus!
				var $target = $(target);
				$target.focus();
				if ($target.is(":focus")) { // Checking if the target was focused
				return false;
				} else {
				$target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
				$target.focus(); // Set focus again
				};
			});
		}
	}
});



//var other_server='10.54.107.196';
var other_server='10.54.108.15';
var metricDate;
var pattern="yy/MM/dd hh:mm";
var chatCounter=0;
var chatCounterL2=0;
var updateCounter=0;
var dashBoardCounter=0;
var auxCounter=0;

arleeloaded=false;
arleeopen=false;
//var socket3;
var socket;


var _lsTotal=0,_xLen,_x;for(_x in localStorage){ if(!localStorage.hasOwnProperty(_x)){continue;} _xLen= ((localStorage[_x].length + _x.length)* 2);_lsTotal+=_xLen; console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")};console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");

$(function(){
	$('.select_endorser').change(function(event){
		if($(this).val()!=''){
			$(this).parent().css('background-color','rgba(255, 255, 255, 0.8)')
		}else{
			$(this).parent().css('background-color','#ad717b');
		}
		if($(this).val()==user.users_CES){
			$(this).parent().css('background-color','#75c98b')
		}
	})

	getMetricDate(function(){
		sundayDate=new Date();
		sundayDate.setDate(metricDate.getDate()-metricDate.getDay());
		prevMondayDate=new Date();
		prevMondayDate.setDate(sundayDate.getDate()-6);
		weekMonth1=((((prevMondayDate.getMonth()+1)+'').length<2)?'0':'')+(prevMondayDate.getMonth()+1);
		weekDay1=(((prevMondayDate.getDate()+'').length<2)?'0':'')+prevMondayDate.getDate();
		weekYear1=prevMondayDate.getFullYear();
		weekMonth2=((((sundayDate.getMonth()+1)+'').length<2)?'0':'')+(sundayDate.getMonth()+1);
		weekDay2=(((sundayDate.getDate()+'').length<2)?'0':'')+sundayDate.getDate();
		weekYear2=sundayDate.getFullYear();
	})
	//runScreenSaver();
	$('#updateform').submit(function(event) {
		event.preventDefault();
		//$(this).submit();
	}); 

	$('#aht_form').submit(function(event) {
		event.preventDefault();
		//$(this).submit();
	}); 
	//socket3 = io(document.location.hostname+":3003");

	if(usertype=='RTA'){
		//localStorage.removeItem('requestsArray');
		if ("requestsArray" in localStorage){
			auxRequestsArray=JSON.parse(localStorage.getItem('requestsArray') || "[]");
			console.log(auxRequestsArray);
			auxRequestsArray.forEach(function (data){
				console.log(data);
				$('#auxRequests').append("<tr id="+data.auxid+"><td>"+data.name+"</td><td>"+data.auxtype+"</td><td>"+data.auxtime+"</td><td>"+data.message+"</td><td><button onclick=approveAuxRequest('"+data.auxid+"',1)>Approve</button><button onclick=approveAuxRequest('"+data.auxid+"',0)>Disapprove</button><textarea id='message_"+data.auxid+"'></textarea></td>")
			})
		}
		
	}
	try{
		
		socket = io(document.location.hostname+":3001");
		socket.on('connect', () => {
			data = {user: user, name: expertName, userId: socket.id, dateLog: new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"})};
			socket.emit('setSocketId', data);
		});

		socket.on('ip address', function(ip){
			$('#localip').html("&nbsp;&nbsp;&nbsp;" + ip.split("::ffff:")[1]==undefined?'':ip.split("::ffff:")[1]);
			myID=ip.split(".")[2]+ip.split(".")[2]
			data = {user: user, name: expertName, userId: socket.id, ip: ip, userlevel:userlevel, userCES: userCES, id:myID};
			socket.emit('register chat', data);
		});

		socket.on('chat list', function(data){
			//console.log(data);
			$('#chatuserlist').html('');
			var sortArray = []
			$.each(data,function(index,value){
				if(value!=null)
					sortArray.push(value.username);
			});
			sortArray.sort((a, b) => (a > b) ? 1 : -1)
			//console.log(sortArray);
			sortArray.forEach(element=>{
				$('#chatuserlist').append($('<li>').html('<b>'+element+'</b>'));
			});
			//
			//daEach(element => {
				//console.log(element);
			//});
		});

		socket.on('chat listL2', function(data){
			//console.log(data);
			$('#chatuserlistL2').html('');
			var sortArray = []
			$.each(data,function(index,value){
				if(value!=null)
					sortArray.push(value.username);
			});
			sortArray.sort((a, b) => (a > b) ? 1 : -1)
			//console.log(sortArray);
			sortArray.forEach(element=>{
				$('#chatuserlistL2').append($('<li>').html('<b>'+element+'</b>'));
			});
			//
			//daEach(element => {
				//console.log(element);
			//});
		});


		socket.on('aux request', function(requestData){
			if(usertype=='RTA'){
				console.log(auxRequestsArray);
				auxRequestsArray.push(requestData);
				localStorage.setItem('requestsArray',JSON.stringify(auxRequestsArray));
				console.log(localStorage.getItem('requestsArray'));
				console.log('aux request');
				$('#auxRequests').html('<thead><th>Name</th><th>Aux Type</th><th>Time</th><th>Message</th><th>Action</th></thead>');
				auxRequestsArray.forEach(function (data){
					$('#auxRequests').append("<tr id="+data.auxid+"><td>"+data.name+"</td><td>"+data.auxtype+"</td><td>"+data.auxtime+"</td><td>"+data.message+"</td><td><button onclick=approveAuxRequest('"+data.auxid+"',1)>Approve</button><button onclick=approveAuxRequest('"+data.auxid+"',0)>Disapprove</button><textarea id='message_"+data.auxid+"'></textarea></td>")
				})
			}
		})

		$('#formL2chat').submit(function(){
			socket.emit('chat messageL2',expertName,$('#chat_messageL2').val());
			$('#chat_messageL2').val('');
			return false;
		});

		$('#formchat').submit(function(){
			socket.emit('chat message',expertName,$('#chat_message').val());
			$('#chat_message').val('');
			return false;
		});

		$('#formaux').submit(function(){
			auxRequestArray.push({id:myID+"-"+$('#auxTime').val().replace(':',''),message:$('#aux_message').val(),type:$('input[name="auxType"]:checked').val(),time:$('#auxTime').val()})
			socket.emit('aux request',userCN,$('#aux_message').val(),$('input[name="auxType"]:checked').val(),$('#auxTime').val(),myID+"-"+$('#auxTime').val().replace(':',''));
			$('#aux_message').val('');
			return false;
		});

		socket.on('new escalation', function(){
			console.log("new escalation received");
			dashBoardCounter++;
			$('#dashBoardBadge').removeClass('hiddenDiv');
			$('#dashBoardBadge').html(dashBoardCounter);
			updateEscalationTable();
		});

		socket.on('new update', function(){
			updateCounter++;
			$('#updateBadge').removeClass('hiddenDiv');
			$('#updateBadge').html(updateCounter);
		});

		socket.on('chat messageL2', function(expertname,msg){
			if($('#chatFormL2').css('display')=='none'){
				chatCounterL2++;
				if($('#chatBadgeL2').hasClass('hiddenDiv')){
					$('#chatBadgeL2').removeClass('hiddenDiv');
				}
				$('#chatBadgeL2').html(chatCounterL2);
			}
			$('#messagesL2').append($('<li>').html('<b>'+expertname+'</b><br><span class="chat_text">'+msg+'</span>'));
			$('#listDisplayL2').scrollTop($('.listDisplayL2').prop('scrollHeight'));
		});
		
		socket.on('chat message', function(expertname,msg){
			if($('#chatForm').css('display')=='none'){
				chatCounter++;
				if($('#chatBadge').hasClass('hiddenDiv')){
					$('#chatBadge').removeClass('hiddenDiv');
				}
				$('#chatBadge').html(chatCounter);
			}
			$('#messages').append($('<li>').html('<b>'+expertname+'</b><br><span class="chat_text">'+msg+'</span>'));
			$('#listDisplay').scrollTop($('.listDisplay').prop('scrollHeight'));
		});

		socket.on('aux approved request', function(data){
			console.log(data);
			alert('Aux Request Approved:\n\n'+data.message);
		})

		socket.on('aux disapproved request', function(data){
			console.log(data);
			alert('Aux Request Disapproved:\n\n'+data.message);
		})
	}catch(err){

	}
	$.ajax({
		url : folder,
		success: function (data) {
			//console.log(data);
			$(data).find("a").attr("href", function (i, val) {
				if( val.match(/\.(jpg|png|gif)$/i) ) { 
					//$("body").append( "<img src='"+ folder + val +"'>" );
					screensaverMasterImageList.push(val);
				}
			});
			screensaverImageList=screensaverMasterImageList.slice();
			console.log(screensaverImageList);
		}
	});
	
});

var chatOpen=false;
var chatL2Open=false;

function approveAuxRequest(id,mode){
	if(mode==1){
		socket.emit('aux approve',{auxid:id,message:$('#message_'+id).val()});
	}else{
		socket.emit('aux disapprove',{auxid:id,message:$('#message_'+id).val()});
	}
	auxRequestsArray.splice(auxRequestsArray.findIndex(element => element.auxid == id), 1);
	localStorage.setItem('requestsArray',JSON.stringify(auxRequestsArray));
	$('#auxRequests').html('<thead><th>Name</th><th>Aux Type</th><th>Time</th><th>Message</th><th>Action</th></thead>');
	auxRequestsArray.forEach(function (data){
		$('#auxRequests').append("<tr id="+data.auxid+"><td>"+data.name+"</td><td>"+data.auxtype+"</td><td>"+data.auxtime+"</td><td>"+data.message+"</td><td><button onclick=approveAuxRequest('"+data.auxid+"',1)>Approve</button><button onclick=approveAuxRequest('"+data.auxid+"',0)>Disapprove</button><textarea id='message_"+data.auxid+"'></textarea></td>")
	})

}

function openAux() {
		var dt=new Date();
		var time = ((dt.getHours()).toString().length<2?('0'+(dt.getHours()).toString()):(dt.getHours()).toString()) + ':' + ((dt.getMinutes()).toString().length<2?('0'+(dt.getMinutes()).toString()):(dt.getMinutes()).toString());
		$('#auxTime').val(time);
		$('#auxForm').css('display','block');
		$('#auxBadge').addClass('hiddenDiv');
		chatCounter=0;

}

function openForm() {
	console.log(chatOpen);
	if(chatL2Open){
		$('#chatForm').css('right','250px')
	}
	if(chatOpen){
		closeForm();
	}else{
		chatOpen=true;
		$('#chatForm').css('display','block');
		$('#chatBadge').addClass('hiddenDiv');
		chatCounter=0;
	}
}

function closeForm() {
	console.log('close form')
	chatOpen=false;
	$('#chatForm').css('display','none');
	if(chatL2Open){
		$('#chatFormL2').css('right','10px')
	}
}

function openFormL2() {
	console.log(chatOpen);
	if(chatOpen){
		$('#chatFormL2').css('right','250px')
	}
	if(chatL2Open){
		closeFormL2();
	}else{
		chatL2Open=true;
		$('#chatFormL2').css('display','block');
		$('#chatBadgeL2').addClass('hiddenDiv');
		chatCounter=0;
	}
}

function closeFormL2() {
	console.log('close form')
	chatL2Open=false;
	$('#chatFormL2').css('display','none');
	if(chatOpen){
		$('#chatForm').css('right','10px')
	}
}

function loadTxt(issue){
	$('#content').empty();
	$('#'+issue+'').clone(true, true).contents().appendTo('#content');
}

function loadPage(page,container,script,callback){
	$('#'+container+'').empty();
	$('#'+container+'').load(page + '.html',function(){if(script){eval($('#'+script+'').text());}});
	if(callback)callback();
}

function loadExternal(page,script,callback){
	$('#content').empty();
	$('#content').load(page + '.html',function(){if(script){eval($('#'+script+'').text());}});
	if(callback)callback();
}

function loadRMAproc(issue){
	console.log(issue);
	$('#rmaproc_details').empty();
	$('#'+issue+'').clone(true, true).contents().appendTo('#rmaproc_details');
}

function loadPic(image,divid){
	$(divid).empty();
	//console.log("<img src='/assets/img/" + image + ".jpg'>");
	$(divid).append("<img style='width:100%;' src='/assets/img/" + image + ".jpg'>");
}

function saveComment(comment){
	data={
		name:expertName,
		comment:comment
	}

	$.ajax({
		type:"POST",
		url:"/api/newcomment" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
		},
		error:function(error){
		}
	});
}

function saveUpdate(title,update){
	if((title=="")||(update=="")){
	}else{
		data={
			name:expertName,
			title:title,
			update:update
		}

		$.ajax({
			type:"POST",
			url:"/api/newupdate" ,
			data:JSON.stringify(data),
			headers:{
				"Content-Type":"application/json"
			},
			//dataType:"json",
			success:function(data){
				//console.log(data);
				socket.emit('new update');
				$('#submit_update').val('');
				$('#update_title').val('');
				$('#modal_update').css('display','none');
			},
			error:function(error){
			}
		});
	}
}


function saveQuestion(question){
	var http = new XMLHttpRequest();
	var url = '/api/newquestion/';
	var params = 'name=' + expertName + '&' + 
	'question=' + question;
	http.open('POST', url, true);
	console.log(params);
	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			//alert(http.responseText);
		}
	}
	http.send(params);
}

function getName(){
	$('#modal_name').css('display','block');
}

function saveShipAddress(){
	var place = autocomplete.getPlace();
	console.log(place.address_components[place.address_components.length-1].short_name);
	saveRMA('RMA_shippingaddress');
	$('#RMA_tz').val(offsetToTZ(place.utc_offset_minutes));
	localStorage.setItem('RMA_tz',$('#RMA_tz').val());
}

function offsetToTZ($offset) {
	console.log($offset);
	switch($offset) {
		case -720 : return 'BIT'; break;
		case -660 : return 'SST'; break;
		case -600 : return 'TAHT'; break;
		case -570 : return 'MART'; break;
		case -540 : return 'AKST'; break;
		case -480 : return 'PST'; break;
		case -420 : return 'PDT'; break;
		case -360 : return 'MDT'; break;
		case -300 : return 'CDT'; break;
		case -240 : return 'EDT'; break;
		case -210 : return 'NST'; break;
		case -180 : return 'ADT'; break;
		case -150 : return 'NDT'; break;
		case -120 : return 'BRST'; break;
		case -60 : return 'AZOT'; break;
		case 0 : return 'GMT'; break;
		case 60 : return 'BST'; break;
		case 120 : return 'CAT'; break;
		case 180 : return 'AST'; break;
		case 210 : return 'IRST'; break;
		case 240 : return 'AMT'; break;
		case 270 : return 'AFT'; break;
		case 300 : return 'AQTT'; break;
		case 330 : return 'IST'; break;
		case 345 : return 'NPT'; break;
		case 360 : return 'ALMT'; break;
		case 390 : return 'ACT'; break;
		case 420 : return 'CXT'; break;
		case 480 : return 'AWST'; break;
		case 525 : return 'ACWST'; break;
		case 540 : return 'CHOST'; break;
		case 570 : return 'ACST'; break;
		case 600 : return 'AEST'; break;
		case 630 : return 'ACDT'; break;
		case 660 : return 'AEDT'; break;
		case 720 : return 'ANAT'; break;
		case 765 : return 'CHAST'; break;
		case 780 : return 'NZDT'; break;
		case 825 : return 'CHADT'; break;
		case 840 : return 'LINT'; break;

	}
}

function initAutocomplete() {
	// Create the autocomplete object, restricting the search predictions to
	// geographical location types.
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('RMA_shippingaddress'), {types: ['geocode']});

	// Avoid paying for data that you don't need by restricting the set of
	// place fields that are returned to just the address components.
	autocomplete.setFields(['address_component','utc_offset']);

	// When the user selects an address from the drop-down, populate the
	// address fields in the form.
	autocomplete.addListener('place_changed', saveShipAddress);
}
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {

	console.log('geolocating')
	var geolocation = {
	lat: 41.850033,
	lng: -87.6500523
	};
	var circle = new google.maps.Circle(
		{center: geolocation, radius: 1200.4});
	autocomplete.setBounds(circle.getBounds());
}  
		  
function addKBlink(){
	$('#KB').val($('#KB').val()+$('#kblinks').val()+'\n');
	saveData('KB');
	$('#kblinks').val(0);
	
}
/*
function filter(tablename) {
console.log(tablename);
var rows = Array.prototype.slice.call($('table#'+tablename+'>tr#FAQ_row'));  
console.log(rows);
  // Always trim user input
  var filter = $('tr#FAQ_row').val().trim().toUpperCase();
  var searchfilters = filter.split(',');
  // Loop the rows
  rows.forEach(function(row) {
  
    // You really don't need to know if the search criteria
    // is in the first or second cell. You only need to know
    // if it is in the row.
    var data = "";
    // Loop over all the cells in the current row and concatenate their text
    Array.prototype.slice.call(row.getElementsByTagName("td")).forEach(function(r){
      // Don't use .innerHTML unless there is HTML. Use textContent when there isn't.
      data += r.textContent;  
    });

    // Check the string for a match and show/hide row as needed
    // Don't set individual styles. Add/remove classes instead
    //if(data.toUpperCase().indexOf(filter) > -1){
    if(searchfilters.every(item => data.toUpperCase().includes(item))){
      // show row
      row.classList.remove("hidden");
    } else {
      // hide row
      row.classList.add("hidden");
    }
  });
  
}*/
function filter(tablename,filtername){
		$("#"+tablename).unmark();
		var value = $("#"+filtername+"").val().toLowerCase();
		$("table#"+tablename+">tbody>tr").filter(function() {$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
		$("#"+tablename).mark(value);
}

function displayOption(option,script){
	console.log($('#'+option+'-selector').val() + '.html');
	$('#'+option+'-content').load($('#'+option+'-selector').val() + '.html',function(){if(script){eval($('#'+script+'').text());}});
	
}

function forAHT(casenumber,device,handletime,holdtime){
	localStorage.setItem('AHT_casenumber_temp',casenumber);
	localStorage.setItem('AHT_device_temp',device);
	localStorage.setItem('AHT_AHT',handletime);
	localStorage.setItem('AHT_holdtime',holdtime);
	console.log(handletime);
	loadAHT(0);
}

function saveAHTFields(storage){
	localStorage.setItem(storage, document.getElementById(storage).value);
	if(storage=='AHT_device'){
		localStorage.setItem('AHT_device_temp', document.getElementById(storage).value);
	}
	if(storage=='AHT_casenum'){
		localStorage.setItem('AHT_casenumber_temp', document.getElementById(storage).value);
	}
}

function loadAHT(menu){
	if(menu){
		$('#AHT_expert').val(localStorage.getItem('AHT_expert'));
		$('#AHT_casenum').val(localStorage.getItem('AHT_casenum'));
		$('#AHT_device').val(localStorage.getItem('AHT_device'));
	}
	$('#AHT_AHT').val(localStorage.getItem('AHT_AHT'));
	$('#AHT_holdtime').val(localStorage.getItem('AHT_holdtime'));
	$('#AHT_holdreason').val(localStorage.getItem('AHT_holdreason')?localStorage.getItem('AHT_holdreason'):"0");
	$('#AHT_reason').val(localStorage.getItem('AHT_reason')?localStorage.getItem('AHT_reason'):"0");
	$('#AHT_complexity').val(localStorage.getItem('AHT_complexity'));
	$('#AHT_resolution').val(localStorage.getItem('AHT_resolution'));
}

function getAHT(){
	AHT = ("AHT" in localStorage)?JSON.parse(localStorage.getItem("AHT")):[];
	AHT_num_cases=localStorage.getItem("AHT_numCases");
	$('#displayAHT').html('');
	displayAHT();
}

function displayAHT(){
	$('#displayAHT').html('');

	console.log(AHT_num_cases);
	console.log(AHT);
	var AHTtable='<table id="AHT_table" border=1 style="text-align:center;border: 1px solid black;border-spacing: 0px;border-collapse: collapse;" width="70%"><tr bgcolor="#00b04f" style="font-size:8pt;font-weight: bold;color:white"><th width="5%">#</th><th width="5%">Expert</th><th width="5%">Case #</th><th width="5%">Device</th><th width="5%">AHT</th><th width="5%">Total Hold Time</th><th width="15%">Reasons for Hold</th><th width="15%">Reason for high AHT</th><th width="15%">Complexity of Scenario Description</th><th width="15%">Resolution</th></tr>';
	for(i=0;i<AHT_num_cases;i++){
	  	AHTtable+='<tr style="font-size:8pt;"><td>' + 
		'<div style="white-space: nowrap"><i class="fa fa-edit tooltip" style="font-size:12px;red;cursor: pointer;" onclick="editAHT('+i+')"></i>&nbsp;' +
	  	(i + 1) +
	  	'<i class="fa fa-times tooltip" style="font-size:12px;color:red;cursor: pointer;" onclick="if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteAHT('+i+')};"></i></div></td>' +
	  	'<td>' + AHT[i][0] + '</td><td>' + AHT[i][1] + '</td><td>' + AHT[i][2] + '</td><td>' + AHT[i][3] + '</td><td>' + AHT[i][4] + '</td><td>' + AHT[i][5] + '</td><td>' + AHT[i][6] + '</td><td>' + AHT[i][7] + '</td><td>' + AHT[i][8] + '</td></tr>';
	}
	AHTtable+='</table>';
	$('#displayAHT').append(AHTtable);
}

function deleteAHT(index){
	AHT.splice(index,1);
	AHT_num_cases--;
	localStorage.setItem("AHT", JSON.stringify(AHT));
	localStorage.setItem("AHT_numCases",AHT_num_cases);
	displayAHT();
}

function editAHT(index){
	$('#AHT_index').val(index);
	$('#AHT_expert').val(AHT[index][0]);
	$('#AHT_casenum').val(AHT[index][1]);
	$('#AHT_device').val(AHT[index][2]);
	$('#AHT_AHT').val(AHT[index][3]);
	$('#AHT_holdtime').val(AHT[index][4]);
	$('#AHT_holdreason').val(AHT[index][5]);
	$('#AHT_reason').val(AHT[index][6]);
	$('#AHT_complexity').val(AHT[index][7]);
	$('#AHT_resolution').val(AHT[index][8]);
	$('#addAHTEntry').toggleClass('hiddenDiv');
	$('#updateAHTEntry').toggleClass('hiddenDiv');
}

function updateAHT(index,expert,casenum,device,aht,holdtime,holdreason,reason,complexity,resolution){
	$('#addAHTEntry').toggleClass('hiddenDiv');
	$('#updateAHTEntry').toggleClass('hiddenDiv');
	console.log(AHT);
	AHT[index][0]=expert;
	AHT[index][1]=casenum;
	AHT[index][2]=device;
	AHT[index][3]=aht;
	AHT[index][4]=holdtime;
	AHT[index][5]=holdreason;
	AHT[index][6]=reason;
	AHT[index][7]=complexity;
	AHT[index][8]=resolution;
	console.log(AHT);
	localStorage.setItem("EOS", JSON.stringify(AHT));
	localStorage.setItem("AHT_numCases",AHT_num_cases);
	clearAHTinput();
	displayAHT();
}

function saveAHT(expert,casenum,device,aht,holdtime,holdreason,reason,complexity,resolution){
	if((expert=="")||(casenum=="")||(device=="0")||(aht=="")||(holdtime=="")||(holdreason=="0")||(reason=="0")||(complexity=="")||(resolution=="")){
	}else{
		AHT_num_cases++
		AHT.push([expert,casenum,device,aht,holdtime,holdreason,reason,complexity,resolution]);
		console.log(AHT);
		localStorage.setItem("AHT", JSON.stringify(AHT));
		localStorage.setItem("AHT_numCases",AHT_num_cases);
		clearAHTinput();
		getAHT();
	}
}

function clearAHTinput(){
	//$('#AHT_expert').val('');
	$('#AHT_AHT').val('');
	$('#AHT_casenum').val('');
	$('#AHT_device').val('0');
	$('#AHT_holdtime').val('');
	$('#AHT_holdreason').val('0');
	$('#AHT_reason').val('0');
	$('#AHT_complexity').val('');
	$('#AHT_resolution').val('');
	localStorage.setItem('AHT_AHT','');
	localStorage.setItem('AHT_holdtime','');
	localStorage.setItem('AHT_holdreason','');
	localStorage.setItem('AHT_reason','');
	localStorage.setItem('AHT_complexity','');
	localStorage.setItem('AHT_resolution','');
	localStorage.setItem('AHT_device_temp','');
	localStorage.setItem('AHT_casenumber_temp','');
}

function resetAHT(){
	localStorage.removeItem("AHT");
	localStorage.removeItem("AHT_numCases");
	AHT_num_cases=0;
	AHT=[];
	displayAHT();
  }

function saveEOS(EOS_casenum,EOS_status,EOS_remarks,EOS_RMA,EOS_callpulse){
	console.log(EOS);
	num_cases++;
	EOS.push([EOS_casenum,EOS_status,EOS_remarks,EOS_RMA,EOS_callpulse]);
	console.log(EOS);
	localStorage.setItem("EOS", JSON.stringify(EOS));
	localStorage.setItem("numCases",num_cases);
	clearEOSinput();
}

function getEOS(){
	console.log("EOS" in localStorage);
	console.log("numCases" in localStorage);
	EOS = ("EOS" in localStorage)?JSON.parse(localStorage.getItem("EOS")):[];
	num_cases=localStorage.getItem("numCases");
	displayEOS();
}

function clearEOSinput(){
	$('#EOS_casenum').val('');
	$('#EOS_status').val('Open');
	$('#EOS_remarks').val('')
	$('#EOS_RMA').val('N');
	$('#EOS_callpulse').val('Y');
}

function deleteEOS(index){
	EOS.splice(index,1);
	num_cases--;
	localStorage.setItem("EOS", JSON.stringify(EOS));
	localStorage.setItem("numCases",num_cases);
	displayEOS();
}

function editEOS(index){
	$('#EOS_index').val(index),
	$('#EOS_casenum').val(EOS[index][0]),
	$('#EOS_status').val(EOS[index][1]),
	$('#EOS_remarks').val(EOS[index][2]),
	$('#EOS_RMA').val(EOS[index][3]),
	$('#EOS_callpulse').val(EOS[index][4])
	$('#addEOSEntry').toggleClass('hiddenDiv');
	$('#updateEOSEntry').toggleClass('hiddenDiv');
}

function updateEOS(index,EOS_casenum,EOS_status,EOS_remarks,EOS_RMA,EOS_callpulse){
	$('#addEOSEntry').toggleClass('hiddenDiv');
	$('#updateEOSEntry').toggleClass('hiddenDiv');
	console.log(EOS);
	EOS[index][0]=EOS_casenum;
	EOS[index][1]=EOS_status;
	EOS[index][2]=EOS_remarks;
	EOS[index][3]=EOS_RMA;
	EOS[index][4]=EOS_callpulse;
	console.log(EOS);
	localStorage.setItem("EOS", JSON.stringify(EOS));
	localStorage.setItem("numCases",num_cases);
	clearEOSinput();
	displayEOS();
}

function displayEOS(){
  $('#displayEOS').html('');
  console.log(num_cases);
  console.log(EOS);
  var EOStable='<table id="EOS_table" border=1 style="text-align:center;border: 1px solid black;border-spacing: 0px;border-collapse: collapse;" width="70%"><tr bgcolor="#00b04f" style="font-size:8pt;font-weight: bold;color:white"><th width="5%">#</th><th width="10%">Case #</th><th width="10%">Status (Open/Closed)</th><th width="25%">Remarks(Why the case was left open)</th><th width="10%">For RMA? (Y/N)</th><th width="10%">Good Call? (Y/N)</th></tr>';
  for(i=0;i<num_cases;i++){
	EOStable+='<tr style="font-size:8pt;"><td><div style="white-space: nowrap"><i class="fa fa-edit tooltip" style="font-size:12px;red;cursor: pointer;" onclick="editEOS('+i+')"></i>&nbsp;' +(i + 1)+
	'&nbsp;<i class="fa fa-times tooltip" style="font-size:12px;color:red;cursor: pointer;" onclick="if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteEOS('+i+')};"></i></div>' + 
	'</td><td>' + EOS[i][0] + '</td><td>' + EOS[i][1] + '</td><td>' + EOS[i][2] + '</td><td>' + EOS[i][3] + '</td><td>' + EOS[i][4] + '</td></tr>';
  }
  EOStable+='</table>';
  $('#displayEOS').append(EOStable);
}

function resetEOS(){
  localStorage.removeItem("EOS");
  localStorage.removeItem("numCases");
  num_cases=0;
  EOS=[];
  displayEOS();
}

function selectElementContents(el,callback) {
	var body = document.body, range, sel;
	if (document.createRange && window.getSelection) {
		range = document.createRange();
		sel = window.getSelection();
		sel.removeAllRanges();
		try {
			range.selectNodeContents(el);
			sel.addRange(range);
		} catch (e) {
			range.selectNode(el);
			sel.addRange(range);
		}
	} else if (body.createTextRange) {
		range = body.createTextRange();
		range.moveToElementText(el);
		range.select();

	}
	document.execCommand("Copy");
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = "Report copied to clipboard.";
	if(callback){
		callback();
	}
}

function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy report to clipboard";
}

function displayPhonetics(source,dest){
	displayText='';
    email=document.getElementById(source).value.toLowerCase();
	for (i=0;i<email.length;i++){
		displayText+=email[i]+ ' = ' + ((phonetics[alphabet.indexOf(email[i])]!=undefined) ? phonetics[alphabet.indexOf(email[i])] : email[i]) + "<br>";
	}
	$('#'+dest).html(displayText);
	//console.log($('#'+dest).html());
}

function downloadFile(){
	console.log(standardStorage[currentRecord])
	var textvalue;
	textvalue='  Case Number:' + standardStorage[currentRecord].casenumber_standard + '\n\n';
	textvalue+='       Issue: ' + standardStorage[currentRecord].inquiry + '\n\n';
	textvalue+='       Email: ' + standardStorage[currentRecord].email + '\n';
	textvalue+='        Name: ' + standardStorage[currentRecord].name + '\n';
	textvalue+='       Phone: ' + standardStorage[currentRecord].phone + '\n\n';
	textvalue+='Case History:\n';
	textvalue+=standardStorage[currentRecord].CH + '\n\n';
	textvalue+='Troubleshooting details at the time of call:\n';
	textvalue+=standardStorage[currentRecord].TS + '\n\n';
	textvalue+='Affected SN and its FW versions:' + '\n';
	textvalue+='      Device: ' + standardStorage[currentRecord].standard_device + '\n';
	textvalue+='          SN: ' + standardStorage[currentRecord].standard_deviceSN + '\n';
	textvalue+='          FW: ' + standardStorage[currentRecord].standard_deviceFW + '\n';
	textvalue+='         DOP: ' + standardStorage[currentRecord].DOP + '\n';
	textvalue+='         POP: ' + standardStorage[currentRecord].POP + '\n';
	textvalue+='         ISP: ' + standardStorage[currentRecord].ISP + '\n\n';
	textvalue+='Affected devices and its FW versions (Web, IOS, Android, model#)' + '\n';
	textvalue+='Login Device: ' + standardStorage[currentRecord].standard_login + '\n';
	textvalue+='    Model/OS: ' + standardStorage[currentRecord].standard_login_model + '\n\n';
	textvalue+='Next Actions:\n' + standardStorage[currentRecord].nextaction + '\n\n';
	textvalue+='Checklist: \n';
	textvalue+='      Downloaded logs? ' + (standardStorage[currentRecord].logs==true?'Y':'N') + '\n';
	textvalue+='Promoted self-service? ' + (standardStorage[currentRecord].selfservice==true?'Y':'N') + '\n';
	textvalue+='       Pitched survey? ' + (standardStorage[currentRecord].survey==true?'Y':'N') + '\n';
	textvalue+='     Attached article: ' + standardStorage[currentRecord].KB;

	textvalue=textvalue.replace(/\n/g, "\n");
	saveTextAsFile(textvalue,$('#casenumber_standard').val());
}

function downloadAllFile(){
	var textvalue='';
	var d = new Date();
	for(i=1;i<standardStorage.length;i++){
		textvalue+='\n\n==========================' + (i) + ' - ' + standardStorage[i].casenumber_standard + '======================================================\n\n';
		textvalue+='       Issue: ' + standardStorage[i].inquiry + '\n\n';
		textvalue+='       Email: ' + standardStorage[i].email + '\n';
		textvalue+='        Name: ' + standardStorage[i].name + '\n';
		textvalue+='       Phone: ' + standardStorage[i].phone + '\n\n';
		textvalue+='Case History:\n';
		textvalue+=standardStorage[i].CH + '\n\n';
		textvalue+='Troubleshooting details at the time of call:\n';
		textvalue+=standardStorage[i].TS + '\n\n';
		textvalue+='Affected SN and its FW versions:' + '\n';
		textvalue+='      Device: ' + standardStorage[i].standard_device + '\n';
		textvalue+='          SN: ' + standardStorage[i].standard_deviceSN + '\n';
		textvalue+='          FW: ' + standardStorage[i].standard_deviceFW + '\n';
		textvalue+='         DOP: ' + standardStorage[i].DOP + '\n';
		textvalue+='         POP: ' + standardStorage[i].POP + '\n';
		textvalue+='         ISP: ' + standardStorage[i].ISP + '\n\n';
		textvalue+='Affected devices and its FW versions (Web, IOS, Android, model#)' + '\n';
		textvalue+='Login Device: ' + standardStorage[i].standard_login + '\n';
		textvalue+='    Model/OS: ' + standardStorage[i].standard_login_model + '\n\n';
		textvalue+='Next Actions:\n' + standardStorage[i].nextaction + '\n\n';
		textvalue+='Checklist: \n';
		textvalue+='      Downloaded logs? ' + (standardStorage[i].logs==true?'Y':'N') + '\n';
		textvalue+='Promoted self-service? ' + (standardStorage[i].selfservice==true?'Y':'N') + '\n';
		textvalue+='       Pitched survey? ' + (standardStorage[i].survey==true?'Y':'N') + '\n';
		textvalue+='     Attached article: ' + standardStorage[i].KB;
	}
	textvalue=textvalue.replace(/\n/g, "\n");

	saveTextAsFile(textvalue,(d.getMonth()+1)+ '-' + d.getDate() + '-' + d.getFullYear());
}

function saveTextAsFile(textToWrite, fileNameToSaveAs)
    {
    	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}); 
    	var downloadLink = document.createElement("a");
    	downloadLink.download = fileNameToSaveAs;
    	downloadLink.innerHTML = "Download File";
    	if (window.webkitURL != null)
    	{
    		// Chrome allows the link to be clicked
    		// without actually adding it to the DOM.
    		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    	}
    	else
    	{
    		// Firefox requires the link to be added to the DOM
    		// before it can be clicked.
    		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    		downloadLink.onclick = destroyClickedElement;
    		downloadLink.style.display = "none";
    		document.body.appendChild(downloadLink);
    	}
    
    	downloadLink.click();
	}
	
function showAGWCreds(){
	myWindow = window.open("", "AGW Tool Credentials", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=300,height=100,top="+0+",right="+100);

	myWindow.document.body.innerHTML = "<head><title>AGW Tool Credentials</title></head>"+
	"<body><pre>Username: cameraNTGR.support<br>Password: support.123456</pre></body>"
}

function generateText(){
	var generate_devices='';
	var generate_deviceused='';
	
	var textvalue=document.getElementById('TS').value;
	textvalue=textvalue.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue1=document.getElementById('CH').value;
	textvalue1=textvalue1.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue2=document.getElementById('KB').value;
	textvalue2=textvalue2.replace('\r', '&nbsp;').replace('\n', '<br>');

	myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+0+",right="+100);
	
	if(!document.getElementById('standard_device').value){
		generate_devices="";
	}else{
		generate_devices="<br><br>Affected SN and its FW versions:" +
		"<br>Device: " + document.getElementById('standard_device').value + 
		"<br>SN: " + document.getElementById('standard_deviceSN').value + 
		"<br>FW: " + document.getElementById('standard_deviceFW').value + 
		"<br>DOP: " + document.getElementById('DOP').value + 
		"<br>POP: " + document.getElementById('POP').value + 
		"<br>ISP: " + document.getElementById('ISP').value;
	}
	if(!document.getElementById('standard_login').value){
		generate_deviceused="";
	}else{
		generate_deviceused="<br><br>Affected devices and its FW versions (Web, IOS, Android, model#)" +
		"<br>Login Device: " + document.getElementById('standard_login').value + 
		"<br>Model/OS: " + document.getElementById('standard_login_model').value;
	}
	
	myWindow.document.body.innerHTML = "<head><title>Case Standard Template"+ 
	"</title></head><div style='white-space: pre-wrap;'><pre>Issue: <br>" + document.getElementById('inquiry').value + 
	"<br><br>Email: " + document.getElementById('email').value + 
	"<br>Name: " + document.getElementById('name').value + 
	"<br>Phone: " + document.getElementById('phone').value + 
	"<br><br>Case History:<br>" + textvalue1 + 
	"<br><br>Troubleshooting details at the time of call:<br>" + textvalue + 
	generate_devices +
	generate_deviceused +
	"<br><br>Next Actions:<br>" + document.getElementById('nextaction').value + 
	"<br><br>Checklist: <br>Downloaded logs? " + (document.getElementById('logs').checked==true?'Y':'N') + 
	"<br>Promoted self-service? " + (document.getElementById('selfservice').checked==true?'Y':'N') + 
	"<br>Pitched survey? " + (document.getElementById('survey').checked==true?'Y':'N') + 
	"<br><br>Attached Article:<br>" + document.getElementById('KB').value + "</pre></div>";

	myWindow.focus();
}

function generateOutboundText(){
	var now=new Date();
	var generate_devices='';
	var generate_deviceused='';
	
	var textvalue=document.getElementById('TSoutbound').value;
	textvalue=textvalue.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue1=document.getElementById('CH').value;
	textvalue1=textvalue1.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue2=document.getElementById('KB').value;
	textvalue2=textvalue2.replace('\r', '&nbsp;').replace('\n', '<br>');

	myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+0+",right="+100);
	
	myWindow.document.head.innerHTML = "<head><title>Case Standard Template</title>"

	myWindow.document.body.innerHTML = "Outbound<div style='white-space: pre-wrap;'>"+
	"<pre>Date and Time of Call: " + outBoundStart.toLocaleString('default',{ timeZone: 'Asia/Manila' }) + " PH time" +
	"<br>Phone: " + document.getElementById('phone').value + 
	"<br>Name: " + document.getElementById('name').value + 
	"<br>Status: " + document.getElementById('inquiry').value + 
	"<br><br>Troubleshooting details at the time of call:<br>" + textvalue + 
	"<br><br>Next Actions:<br>" + document.getElementById('nextaction').value + 
	"</pre></div>";

	myWindow.focus();
}

function generateTextRMA(){
	var textvalue=document.getElementById('RMA_prob').value;
	textvalue=textvalue.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue2=document.getElementById('RMA_history').value;
	textvalue2=textvalue2.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue3=document.getElementById('RMA_TS').value;
	textvalue3=textvalue3.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue4=document.getElementById('RMA_wirelessnetwork').value;
	textvalue4=textvalue4.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue6=document.getElementById('RMA_platform').value;
	textvalue6=textvalue6.replace('\r', '&nbsp;').replace('\n', '<br>');

	var textvalue5=document.getElementById('RMA_wirelessdevices').value;
	textvalue5=textvalue5.replace('\r', '&nbsp;').replace('\n', '<br>');

	console.log(document.getElementById('RMA_POP').checked);
	myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+0+",right="+100);

	var accessory = $('#accessory').prop('checked');
	myWindow.document.body.innerHTML = "<head><title>RMA Template"  +
	"</title></head><div style='white-space: pre-wrap;'><pre>Case #: " + document.getElementById('RMA_casenum').value + 
	"<br>Email: " + document.getElementById('RMA_email').value + 
	"<br>Phone: " + document.getElementById('RMA_phone').value + 
	"<br>Time Zone: " + document.getElementById('RMA_tz').value + 
	"<br>POP Updated: " + (document.getElementById('RMA_POP').checked==true?'Y':'N') + 
	"<br>DL Logs: " + (document.getElementById('RMA_logs').checked==true?'Y':'N') + 
	(accessory?("<br>Main Device: " + document.getElementById('RMA_main_device').value):"") +
	"<br>What device should be replaced (Camera/BS/Power Adapter etc): " + (accessory?($('#RMA_accessoryreplacement').val()):(document.getElementById('RMA_main_device').value)) + 
	(accessory?"":("<br>Serial number of the device to be replaced: " + (document.getElementById('RMA_main_deviceSN').value))) + 
	(accessory?("<br>Part Code (if applicable): " + (document.getElementById('RMA_partcode').value)):"") + 
	"<br>Shipping Address: " + (document.getElementById('RMA_shippingaddress').value) + 
	"<br><br>1. Current firmware version of Base Station and Cameras <br>" +
	(accessory?"FW: N/A" :("FW: " + document.getElementById('RMA_main_deviceFW').value)) + "<br>" +
	"<br>2. Platforms Affected:<br>" + textvalue6 + 
	"<br>3. Problem Description Details:<br>" + textvalue + 
	"<br>4. History of Problem:<br>" + textvalue2 + 
	"<br>5. Detailed Troubleshooting Done:<br>" + textvalue3 + 
	"<br>6. Network topology: " +
	"<br>ISP: " + document.getElementById('RMA_ISP').value + 
	"<br>Modem Brand/Model: " + document.getElementById('RMA_modem').value + 
	"<br>Router Brand/Model: " + (document.getElementById('RMA_router').value) + 
	"<br>Wireless devices on network: " + textvalue4 + 
	"<br>Wireless devices used: " + textvalue5 +"</pre></div>"


	myWindow.focus();
}

function generateTextFeed(){
myWindow2 = window.open("", "Title2", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=250,top="+300+",right="+300);
console.log($('#accessory').prop('checked'));
var accessory = $('#accessory').prop('checked');
myWindow2.document.body.innerHTML = "<head><title>RMA Text Feed</title></head><div style='white-space: pre-wrap;'><pre>For RMA Approval:<br>Case #: " + document.getElementById('RMA_casenum').value + 
(accessory?("<br>Main Device: " + document.getElementById('RMA_main_device').value):"") +
"<br>Device/Accessory : " + (accessory?(document.getElementById('RMA_accessoryreplacement').value):(document.getElementById('RMA_main_device').value)) + 
(accessory?("<br>Part Code : " + (document.getElementById('RMA_partcode').value)):("<br>Serial number : " + (document.getElementById('RMA_main_deviceSN').value))) + 
(accessory?("<br>Quantity: " + document.getElementById('RMA_quantity').value):"") +
"<br><br>" + "TMs:<br>" + 
"@Darlin Navasca @Maria Vallejo @Ren Balcom<br>" +
"@April Ducao @Aser Oraiz @Flordeliz Diego @Mary Aiko Villafuerte<br>" +
"@Leah Mae Ancog @Michael Peralta @Leah Mae Ancog​<br>" + 
"SMEs:<br>" + 
"@John Jimenea @Ace Orlanes @Meagan Luy<br>" +
"@Antonette Ranoco @Cris Manzano @Sean Christopher Quiñola<br>" +
"@Guiller Camarillo @Renz Alvarado </pre></div>";
myWindow2.focus();
}

function saveRMA(storage){
	localStorage.setItem(storage, document.getElementById(storage).value);
	//console.log(localStorage.getItem(storage));
}

function saveCheckRMA(storage){
	localStorage.setItem(storage, document.getElementById(storage).checked);
	//console.log(localStorage.getItem(storage));
}

function forRMA(device){
	if(device=='BS'){
		localStorage.setItem('RMA_SN',$('#BSSN').val());
		localStorage.setItem('RMA_devicereplacement','Base Station');
	} else if(device=='Camera'){
		localStorage.setItem('RMA_SN',$('#CamSN').val());
		console.log(localStorage.getItem('RMA_SN'));
		localStorage.setItem('RMA_devicereplacement','Camera');
	}

	localStorage.setItem('RMA_main_device',$('#standard_device').val());
	localStorage.setItem('RMA_main_deviceSN',$('#standard_deviceSN').val());
	localStorage.setItem('RMA_main_deviceFW',$('#standard_deviceFW').val());
	console.log($('#logs').prop('checked'));
	localStorage.setItem('RMA_logs',$('#logs').prop('checked'));
	localStorage.setItem('RMA_prob',$('#inquiry').val());
	localStorage.setItem('RMA_history',$('#CH').val());
	localStorage.setItem('RMA_TS',$('#TS').val());
	localStorage.setItem('RMA_casenum',$('#casenumber_standard').val());
	localStorage.setItem('RMA_email',$('#email').val());
	localStorage.setItem('RMA_phone',$('#phone').val());
	localStorage.setItem('RMA_platform',($('#standard_login').val()==null)?'':$('#standard_login').val()+' '+$('#standard_login_model').val());
	localStorage.setItem('RMA_BSFW',$('#BSFW').val());
	localStorage.setItem('RMA_CamFW',$('#CamFW').val());
	localStorage.setItem('RMA_ISP',$('#ISP').val());
}

function forEscalation(){
	localStorage.setItem('L2escalate_case',$('#casenumber_standard').val());
	localStorage.setItem('L2escalate_email',$('#email').val());
	if(($('#standard_device').val()).substr(0,3)=='VMB'){
		localStorage.setItem('L2escalate-bssn',$('#standard_deviceSN').val());	
		localStorage.setItem('L2escalate-bsfw',$('#standard_deviceFW').val());
		if((($('#standard_device').val()).substr(3,4)=='4540')||(($('#standard_device').val()).substr(3,4)=='5000')){
			localStorage.setItem('L2escalate-devicetype','SmartHub');
		}else{
			localStorage.setItem('L2escalate-devicetype','Base Station');
		}
	}else if(($('#standard_device').val()).substr(0,3)=='VMA'){
		localStorage.setItem('L2escalate-devicetype','Accessory');
		localStorage.setItem('L2escalate-camsn',$('#standard_deviceSN').val());
		localStorage.setItem('L2escalate-camfw',$('#standard_deviceFW').val());
	}else if((($('#standard_device').val()).substr(0,3)=='VMC')||(($('#standard_device').val()).substr(0,3)=='ABC')){
		localStorage.setItem('L2escalate-devicetype','Accessory');
		localStorage.setItem('L2escalate-camsn',$('#standard_deviceSN').val());
		localStorage.setItem('L2escalate-camfw',$('#standard_deviceFW').val());
	}
	localStorage.setItem('L2escalate_device',$('#standard_device').val());
}

function loadRMA(){
	console.log(localStorage.getItem('RMA_logs'));
	$('#RMA_casenum').val(localStorage.getItem('RMA_casenum'));
	$('#RMA_email').val(localStorage.getItem('RMA_email'));
	$('#RMA_phone').val(localStorage.getItem('RMA_phone'));
	$('#RMA_tz').val(localStorage.getItem('RMA_tz'));
	$('#RMA_POP').prop('checked',localStorage.getItem('RMA_POP')==='true'?true:false);
	$('#RMA_logs').prop('checked',localStorage.getItem('RMA_logs')==='true'?true:false);
	
	$('#RMA_main_device').val(localStorage.getItem('RMA_main_device'));
	$('#RMA_main_deviceSN').val(localStorage.getItem('RMA_main_deviceSN'));
	$('#RMA_main_deviceFW').val(localStorage.getItem('RMA_main_deviceFW'));
	$('#RMA_quantity').val(localStorage.getItem('RMA_quantity'));
	
	$('#RMA_accessoryreplacement').val(localStorage.getItem('RMA_accessoryreplacement'));
	$('#RMA_partcode').val(localStorage.getItem('RMA_partcode'));
	$('#RMA_shippingaddress').val(localStorage.getItem('RMA_shippingaddress'));
	
	
	//$('#RMA_BSFW').val(localStorage.getItem('RMA_BSFW'));
	//$('#RMA_CamFW').val(localStorage.getItem('RMA_CamFW'));
	$('#RMA_prob').val(localStorage.getItem('RMA_prob'));
	$('#RMA_platform').val(localStorage.getItem('RMA_platform'));
	$('#RMA_history').val(localStorage.getItem('RMA_history'));
	$('#RMA_TS').val(localStorage.getItem('RMA_TS'));
	$('#RMA_ISP').val(localStorage.getItem('RMA_ISP'));
	$('#RMA_modem').val(localStorage.getItem('RMA_modem'));
	$('#RMA_router').val(localStorage.getItem('RMA_router'));
	$('#RMA_wirelessnetwork').val(localStorage.getItem('RMA_wirelessnetwork'));
	$('#RMA_wirelessdevices').val(localStorage.getItem('RMA_wirelessdevices'));
	
}

function clearRMA(){
	localStorage.setItem('RMA_casenum','');
	localStorage.setItem('RMA_email','');
	localStorage.setItem('RMA_phone','');
	localStorage.setItem('RMA_tz','');
	localStorage.setItem('RMA_POP','false');
	localStorage.setItem('RMA_logs','false');
	

	localStorage.setItem('RMA_main_device','');
	localStorage.setItem('RMA_SN','');
	localStorage.setItem('RMA_FW','');
	localStorage.setItem('RMA_accessoryreplacement','');
	localStorage.setItem('RMA_quantity','');
	localStorage.setItem('RMA_partcode','');
	localStorage.setItem('RMA_shippingaddress','');
	
	
	localStorage.setItem('RMA_BSFW','');
	localStorage.setItem('RMA_CamFW','');
	localStorage.setItem('RMA_prob','');
	localStorage.setItem('RMA_platform','');
	localStorage.setItem('RMA_history','');
	localStorage.setItem('RMA_TS','');
	localStorage.setItem('RMA_ISP','');
	localStorage.setItem('RMA_modem','');
	localStorage.setItem('RMA_router','');
	localStorage.setItem('RMA_wirelessnetwork','');
	localStorage.setItem('RMA_wirelessdevices','');
}

function saveData(storage){
	if(storage=='standard_deviceSN'){
		if(vdb_affected_SN.includes($('#standard_deviceSN').val().trim().replace(/\s/g,''))){
			$('#standard_deviceSN').css('color','red');
		}else{
			$('#standard_deviceSN').css('color','black');
		}
	}
	currentStandardT[storage]=document.getElementById(storage).value;
	standardStorage[currentRecord]=currentStandardT;
	localStorage.setItem("standardLocalStorage", JSON.stringify(standardStorage));
}

function saveCheck(storage){
	currentStandardT[storage]=document.getElementById(storage).checked;
	standardStorage[currentRecord]=currentStandardT;
	localStorage.setItem("standardLocalStorage", JSON.stringify(standardStorage));
	
}

function getData(next){
	
	currentRecord=parseInt(currentRecord) + parseInt(next);
	currentRecord=currentRecord<1?1:currentRecord;
	loadData(currentRecord);
}

function loadData(index){
	//console.log(standardStorage);

	//if(localStorage.getItem('standardLocalStorage')!=null){
	standardStorage = ("standardLocalStorage" in localStorage)?JSON.parse(localStorage.getItem("standardLocalStorage")):[];
	//}
	
	if(standardStorage[index]==(undefined||null)){
		Object.keys(currentStandardT).forEach(v => currentStandardT[v] = "");
		//console.log(currentStandardT);
		standardStorage[index]={ ...currentStandardT};
	}else{
		currentStandardT={ ...standardStorage[index]};
	}
	//console.log(standardStorage[index]);
	//console.log(standardStorage[index]!= (undefined||null));
	//console.log(currentStandardT);
	if((standardStorage[index]!= (undefined||null))&&(currentStandardT!= (undefined||null))){
		//console.log(standardStorage[index].inquiry);
		$('#inquiry').val(standardStorage[index].inquiry);
		//document.getElementById('inquiry').value=standardStorage[index].inquiry;
		$('#name').val(standardStorage[index].name);
		$('#email').val(standardStorage[index].email);
		$('#phone').val(standardStorage[index].phone);
		//console.log(standardStorage[index].standard_device);
		$('#standard_device').val(standardStorage[index].standard_device);
		$('#standard_deviceSN').val(standardStorage[index].standard_deviceSN);
		$('#standard_deviceFW').val(standardStorage[index].standard_deviceFW);

		if(vdb_affected_SN.includes($('#standard_deviceSN').val().trim().replace(/\s/g,''))){
			$('#standard_deviceSN').css('color','red');
		}else{
			$('#standard_deviceSN').css('color','black');
		}

		$('#DOP').val(standardStorage[index].DOP);
		$('#POP').val(standardStorage[index].POP);
		$('#ISP').val(standardStorage[index].ISP);

		$('#nextaction').val(standardStorage[index].nextaction);
		$('#CH').val(standardStorage[index].CH);
		$('#standard_login').val(standardStorage[index].standard_login);
		$('#standard_login_model').val(standardStorage[index].standard_login_model);
		$('#TS').val(standardStorage[index].TS);
		$('#TSoutbound').val(standardStorage[index].TSoutbound);
		
		$('#logs').prop('checked',standardStorage[index].logs==true? true : false);
		$('#selfservice').prop('checked',standardStorage[index].selfservice==true? true : false);
		$('#survey').prop('checked',standardStorage[index].survey==true? true : false);
		$('#KB').val(standardStorage[index].KB);
		$('#caseclosed_standard').prop('checked',standardStorage[index].caseclosed_standard==true? true : false);
		$('#casenumber_standard').val(standardStorage[index].casenumber_standard);
		$('#RMA_standard').prop('checked',standardStorage[index].RMA_standard==true? true : false);
		$('#call_pulse').prop('checked',standardStorage[index].call_pulse==true? true : false);
	}
	$('#callflow_cxname').html($('#name').val().split(' ')[0]);
	$('#callflow_casenumber_spiel').html($('#casenumber_standard').val());
}

function resetStorage(){
	standardStorage=[];
	for (var prop in currentStandardT) {
		if (Object.prototype.hasOwnProperty.call(currentStandardT, prop)) {
			prop="";
		}
	}
	localStorage.removeItem("standardLocalStorage");
	
}

function addData(index){
	var blankForm={ ...currentStandardT };
	Object.keys(blankForm).forEach(v => blankForm[v] = "");
	
	standardStorage.splice(index,0,currentStandardT);
	standardStorage[index]=blankForm;
	localStorage.setItem("standardLocalStorage", JSON.stringify(standardStorage));
	loadData(index);
}

function resetData(index){
	//Object.keys(currentStandardT).forEach(v => currentStandardT[v] = "");
	//console.log(currentStandardT);
	//standardStorage[index]=currentStandardT;
	standardStorage=standardStorage.filter(function(item,indx){
		if(indx!==index){
			return true;
		}
	});
	localStorage.setItem("standardLocalStorage", JSON.stringify(standardStorage));
	loadData(index);
}

function showMenu(target){
$('.submenu').slideUp();
($('#' + target + '').css("display")== "none")?($('#' + target + '').slideDown("fast")):($('#' + target + '').slideUp("fast"));
$('#' + target + 'New').css("display","none")
}

function generateTemplate(){
  var templatetext=$('#email_followup_templates').val();
  templatetext=templatetext.replace(/<<CUXNAME>>/g,$('#template_cxname').val());
  templatetext=templatetext.replace(/<<EXPERTNAME>>/g,expertName);
  templatetext=templatetext.replace(/<<CASENUMBER>>/g,$('#template_casenum').val());
  $('#email_followup_templates').val(templatetext);


  templatetext=$('#email_followupcallback_templates').val();
  templatetext=templatetext.replace(/<<CUXNAME>>/g,$('#template_cxname').val());
  templatetext=templatetext.replace(/<<EXPERTNAME>>/g,expertName);
  templatetext=templatetext.replace(/<<CASENUMBER>>/g,$('#template_casenum').val());
  $('#email_followupcallback_templates').val(templatetext);

  templatetext=$('#email_followupkb_templates').val();
  templatetext=templatetext.replace(/<<CUXNAME>>/g,$('#template_cxname').val());
  templatetext=templatetext.replace(/<<EXPERTNAME>>/g,expertName);
  templatetext=templatetext.replace(/<<CASENUMBER>>/g,$('#template_casenum').val());
  $('#email_followupkb_templates').val(templatetext);

  templatetext=$('#email_close_templates').val();
  templatetext=templatetext.replace(/<<CUXNAME>>/g,$('#template_cxname').val());
  templatetext=templatetext.replace(/<<EXPERTNAME>>/g,expertName);
  templatetext=templatetext.replace(/<<CASENUMBER>>/g,$('#template_casenum').val());
  $('#email_close_templates').val(templatetext);
}

function plusSlides(n, no) {
  prevSlide=slideIndex[no];
  //console.log('prevslide: '+prevSlide);
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  var i;
  var x = document.getElementsByClassName(slideId[no]);
  //console.log(x[0]);
  //console.log('length: ' + x.length)
  //console.log('slide to display : '+ n);
  //console.log(n > x.length);
  
  if (n > x.length) {slideIndex[no] = 1}else{slideIndex[no] = n}
  //console.log('slideindex: ' + slideIndex[no]);
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  //console.log(slideIndex[no]-1);
  //console.log(x[0]);
  x[slideIndex[no]-1].style.display = "block";  
  //$('#vdinstall_counter').html("Step " + slideIndex[no]);
}

function showCallHandler(issue_num){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			try{
			var callhandler = JSON.parse(xhttp.responseText);
			console.log(callhandler.data.issue_callhandler);
			
			$('#call_handler').html(callhandler.data.issue_callhandler.replace(/\n/g, "<br>"));
			}catch{}
			finally{
			}
		}
	};
	xhttp.open("GET", "/api/callhandler/"+issue_num, true);
	xhttp.send();	
}

function loadIssues(){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			try{
			var issueList = JSON.parse(xhttp.responseText);
			var table_content='<thead><tr class="header"><th class="tg-0pky" style="width:20%">Issue Number</th><th class="tg-0pky" style="width:60%">Description</th><th class="tg-0pky" style="width:20%">Affected Device/Platform/Feature</th></tr></thead><tbody>';
			for(i=0;i<issueList.data.length;i++){
				table_content+='<tr>';
				table_content+='<td><a href="#" onclick="showCallHandler(' + issueList.data[i].issue_number + ')">' + issueList.data[i].issue_number + '</a></td>';
				table_content+='<td>' + issueList.data[i].issue_description + '</td>';
				table_content+='<td>' + issueList.data[i].issue_keywords + '</td>';
				table_content+='</tr>';
			}
			table_content+='</tbody>';
			$("#issue_table").html(table_content);
			}catch{}
			finally{
			
			//$("#issue_filter").on('keyup', filter('issue_table'));
			//$("#issue_filter").on('search', filter('issue_table'));
			sortTable(0);
			}
		}
	};
	xhttp.open("GET", "/api/issues", true);
	xhttp.send();
	
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("issue_table");
  
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
	
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
/*
// Get the modal
var modal = document.getElementById("modal_comment");

// Get the button that opens the modal
var btn = document.getElementById("modal_btn_comment");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
*/
// When the user clicks anywhere outside of the modal, close it



/*
function getIP(){
	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;  
	var pc = new RTCPeerConnection({iceServers:[]}), 
	noop = function(){}; 
     
   	pc.createDataChannel("");  
	pc.createOffer(pc.setLocalDescription.bind(pc), noop);   
    	pc.onicecandidate = function(ice){ 
   	if(!ice || !ice.candidate || !ice.candidate.candidate)  return;

        	var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];

        	console.log('my IP: ', myIP); 
			//$('.ipAdd').text(myIP);
  
        	pc.onicecandidate = noop;
  
	 }; 
}
*/

function compareHide(camera){
	$('.'+camera+'compare').addClass('compare-hidden');
	compareColumns=compareColumns-1;
	$('.compare').css('width',(80/compareColumns) + '%');
	console.log(compareColumns);
	$('#'+camera+'-option').removeAttr('disabled');
	if(compareColumns<5){
		$('.compare').css('width','16%');
		$('.compare-table').css('width',(20+(20*compareColumns)) + '%');
	}else{
		$('.compare').css('width',(80/compareColumns) + '%');
		$('.compare-table').css('width','100%');
	}
	if(!compareColumns){
		$('.selectcompare').removeClass('compare-hidden');
		$('.compare-tbody').addClass('compare-hidden');
		$('.compare-table').css('width','40%');
	}
}

function compareShow(camera){
	$('.'+camera+'compare').removeClass('compare-hidden');
	compareColumns=compareColumns+1;
	if(compareColumns<5){
		$('.compare').css('width','16%');
		$('.compare-table').css('width',(20+(20*compareColumns)) + '%');
	}else{
		$('.compare').css('width',(80/compareColumns) + '%');
		$('.compare-table').css('width','100%');
	}
	//console.log($('.compare').css('width'));
	$('#'+camera+'-option').prop('disabled','true');
	if(compareColumns){
		$('.selectcompare').addClass('compare-hidden');
		showFilters();
	}
}

function showFilters(){
	$('#checkboxes').children().each(function(index){
		if($(this).hasClass('compare-filtered')){
			$('tbody.compare-'+$(this).get(0).id.split('-')[1]+'-tbody').removeClass('compare-hidden');
		}else{
			$('tbody.compare-'+$(this).get(0).id.split('-')[1]+'-tbody').addClass('compare-hidden');
		}
	});
}

function compareFilter(filter){
	console.log($('#filter-'+filter).hasClass('compare-filtered'));
	
	if($('#filter-'+filter).hasClass('compare-filtered')){
		$('#filter-'+filter).removeClass('compare-filtered');
	}else{
		$('#filter-'+filter).addClass('compare-filtered');
	}
	if(compareColumns){
		showFilters();
	}
}

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
	checkboxes.style.display = "block";
    expanded = true;
  } else {
	checkboxes.style.display = "none";
    expanded = false;
  }
}

window.onclick = function(event) {
	if ($(event.target).attr('class') == 'modal') {
		if ($(event.target).attr('id') !== 'modal_name'){
			$(event.target).css('display','none');
		}
		if ($(event.target).attr('id') == 'modal_arlee'){
			arleeopen=false;
		}
    //modal.style.display = "none";
	}
	if((expanded)&&(!($(event.target).hasClass('overSelect'))&&(!$(event.target).hasClass('compare-filter')))){
		$('#checkboxes').css('display','none');
		expanded=false;
	}
}

function showMessage(expertname,message,id){
	
	if(expertName==expertname){
		if(localStorage.getItem('expertName'+id)!=='sent'){
			$('#modal_message').css('display','block');
			$('#modal_message_name').html(expertname);
			$('#modal_message_reply').html(message);
			localStorage.setItem('expertName'+id,'sent');
		}
	}
}

function priceCalc(numCameras,plan,div,countrycode){
	console.log(countrycode);
	var country={
		'USD':{pmc:9.99, psc:2.99, emc:14.99, esc:4.99},
		'CAD':{pmc:13.49, psc:3.99, emc:19.99, esc:6.49},
		'EUR':{pmc:8.99, psc:2.79, emc:13.99, esc:4.49},
		'GBP':{pmc:7.99, psc:2.49, emc:12.49, esc:3.99},
		'AUD':{pmc:14.99, psc:4.49, emc:21.99, esc:7.49},
		'DKK':{pmc:69, psc:20, emc:99, esc:35},
		'SEK':{pmc:95, psc:29, emc:145, esc:49},
		'CHF':{pmc:10.99, psc:2.99, emc:15.99, esc:4.99},
		'CZK':{pmc:235, psc:70, emc:350, esc:155},
		'PLN':{pmc:39, psc:12, emc:59, esc:20},
		'NZD':{pmc:14.99, psc:4.99, emc:23.99, esc:7.99},
		'NOK':{pmc:89, psc:27, emc:135, esc:45},
		'HUF':{pmc:2960, psc:885, emc:4440, esc:1475},
		'HKD':{pmc:79, psc:24, emc:117, esc:39},
		'JPY':{pmc:1060, psc:320, emc:1595, esc:530},
		'ZAR':{pmc:152, psc:45, emc:229, esc:76},
		'SGD':{pmc:13.99, psc:4.49, emc:21.99, esc:6.99},

	}
	console.log(plan);
	var format = new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: countrycode, 
                minimumFractionDigits: 2, 
			}); 
			
	if(numCameras<4){
		if(plan=='premier'){
			$('#'+div).html('Premier Single Cam Plans: '+format.format(numCameras*country[countrycode].psc));;
		}else{
			return numCameras*country[countrycode].pmc;
		}
	}else{
		if(plan=='premier'){
			if(numCameras>5){
				$('#'+div).html('Premier Multi-cam Plan X1: '+ format.format(country[countrycode].pmc)+'<br>Premier Single Cam Plan <b>(50%off)</b> X' + (numCameras-5) + ': '+format.format((roundDown((numCameras-5)*(country[countrycode].psc/2),2)))+'<br>Total: '+format.format((roundDown(((numCameras-5)*(country[countrycode].psc/2))+country[countrycode].pmc,2))));
			}else{
				$('#'+div).html('Premier Multi-cam Plan X1: '+ format.format(country[countrycode].pmc));
			}
		}else{
			if(numCameras>5){
				$('#'+div).html('Elite Multi-cam Plan X1: '+ format.format(country[countrycode].emc)+'<br>Elite Single Cam Plan <b>(50%off)</b> X' + (numCameras-5) + ': '+format.format((roundDown((numCameras-5)*(country[countrycode].esc/2),2)))+'<br>Total: '+format.format((roundDown(((numCameras-5)*(country[countrycode].esc/2))+country[countrycode].emc,2))));
			}else{
				$('#'+div).html('Elite Multi-cam Plan X1: '+ format.format(country[countrycode].emc));
			}

		}
	}
}

function roundDown(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}

function getDataRecord(api,callback,data){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', api)
	xhr.send();
	xhr.onload = function() {
		if (xhr.status != 200) { // analyze HTTP status of the response
			console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
		} else {
			callback(JSON.parse(xhr.response).data,data);
		}
	}
	xhr.onerror = function() {
	  console.log("Request failed");
	};

}

function getExpertName(selector){
	getDataRecord('/api/metric/names',populateExpertSelect,selector);
}

function getTeamName(selector){
	getDataRecord('/api/metric/teams',populateTeamSelect,selector);
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
	for (i=0;i<data.length;i++){
		if((data[i]=='Excellent')||(data[i]=='Very Good')||(data[i]=='Good')){	
			CSAT_count++
		}
	}
	return data.length>0?[((CSAT_count/data.length)*100).toFixed(2)+'%',CSAT_count,data.length]:['No returns',0,0];
}

function calcFcr(data){
	var FCR_count=0;
	for (i=0;i<data.length;i++){
		if(data[i]=='Only 1 contact'){	
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
				resolve('resovled');
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

function recordUser(user){
	data={
		name:expertName
	}

	$.ajax({
		type:"POST",
		url:"/api/recorduser" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
		},
		error:function(error){
		}
	 });
}

function getMetricDate(callback){
	let xhr = new XMLHttpRequest();
	try{
		xhr.open('GET', '/api/metric/metricdate')
		xhr.send();
		xhr.onload = function() {
			if (xhr.status != 200) { // analyze HTTP status of the response
				console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
			} else {
				var tempDate=JSON.parse(xhr.response).data[0]["metric-Response-Completiondate"]
				metricDate=new Date(getDateString(tempDate));
				if(callback){
					//console.log("in callback");
					callback(tempDate);
				}
				//console.log(tempDate);
				return tempDate;
			}
		}
		xhr.onerror = function() {
			console.log("Request failed");
		};
	}catch(err){
		console.log(err)
	}
}

function showMetricDate(data,callback){
//	metricDate=new Date(getMetricDate());
	$('#metricDateDiv').html('As of ' + metricDate.toLocaleString('default',{month:'long'}) +' ' + parseInt(metricDate.getDate()) + ', ' + parseInt(metricDate.getYear()+1900));

	if(callback){
		console.log("in callback");
		callback(data);
	}
}

function getDateString(tempdate){
	return (tempdate.split("/")[1]) + "/" + tempdate.split("/")[2].split(" ")[0] + "/" + tempdate.split("/")[0] + " " + tempdate.split("/")[2].split(" ")[1] + " " + tempdate.split("/")[2].split(" ")[2];
}

function toggleQuicklinks(source){
	if ($("#quicklinks_panel").hasClass('show')) {
		$("#quicklinks_panel").animate({
			left: "-96px"
        }, 0).removeClass('show').addClass('hide');
		$("#content").animate({
			"padding-left": "0px"
		},0);
	} else {
		$("#quicklinks_panel").css("left","0px").removeClass('hide').addClass('show');
		$("#quicklinks:after").css('content','\f152');
		//$('#quicklinks').css("width","100px");
		$("#content").animate({
			"padding-left": "96px"
		},0);
	}
}

function getCommendations(){
	var folder = "/assets/img/commendations";
	console.log('commend');
	$.ajax({
		url : folder,
		type:'GET',
		success: function (data) {
			console.log(data);
			$(data).find("a").attr("href", function (i, val) {
				if( val.match(/\.(jpe?g|png|gif)$/i) ) { 
					console.log('image');
					console.log(folder + ' ' + val);
					$("#table_commendations").append( "<tr><td><img src='"+ val +"' width=100%></td></tr>" );
				} 
			});
		}
	});
}

function getVL(){
	var folder = "/assets/img/commendations";
	console.log('commend');
	$.ajax({
		url : folder,
		type:'GET',
		success: function (data) {
			console.log(data);
			$(data).find("a").attr("href", function (i, val) {
				if( val.match(/vl.*\.(jpe?g|png|gif)$/i) ) { 
					console.log('image');
					console.log(folder + ' ' + val);
					$("#table_VL").append( "<tr><td><img src='"+ val +"' width=100%></td></tr>" );
				} 
			});
		}
	});
}

function ecommerceCalc(){
	var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	var today = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
	var PST = new Date(today);
	var hPST = PST.getHours();
	var mPST = PST.getMinutes();
	var sPST = PST.getSeconds();
	var dayPST = PST.getDay();
	hPST = checkTime(hPST);
	mPST = checkTime(mPST);
	sPST = checkTime(sPST);
	today = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
	var EST = new Date(today);
	var hEST = EST.getHours();
	var mEST = EST.getMinutes();
	var sEST = EST.getSeconds();
	var dayEST = EST.getDay();
	hEST = checkTime(hEST);
	mEST = checkTime(mEST);
	sEST = checkTime(sEST);
	today = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});
	var CST = new Date(today);
	var hCST = CST.getHours();
	var mCST = CST.getMinutes();
	var sCST = CST.getSeconds();
	var dayCST = CST.getDay();
	hCST = checkTime(hCST);
	mCST = checkTime(mCST);
	sCST = checkTime(sCST);
	$('#ecomTimeCST').html('<b>' + days[dayCST] + ' ' + hCST + ":" + mCST + " CST</b>");
	$('#ecomTimeEST').html('<b>' + days[dayEST] + ' ' + hEST + ":" + mEST + " EST</b>");
	$('#ecomTimePST').html('<b>' + days[dayPST] + ' ' + hPST + ":" + mPST + " PST</b>");
	$('#ecommerceTime').html('<b>' + days[dayPST] + ' ' + hPST + ":" + mPST + ":" + sPST + " PST</b>");
	$('#ecomStatus').html((((dayPST>0)&&(dayPST<6))&&((hPST>5)&&(hPST<17)))?'ECOM is <b style="color:#a3ffbc">OPEN</b>':'ECOM is <b style="color:#ff7373">CLOSED</b>');
	$('#ecommerceStatus').html((((dayPST>0)&&(dayPST<6))&&((hPST>5)&&(hPST<17)))?'ECOM Status: <b>OPEN</b>':'ECOM Status: <b>CLOSED</b>');
	var t = setTimeout(ecommerceCalc, 500);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function sortSelect(selector){
		$('#' + selector).html($('#' + selector).find('option').sort(function(x, y) {
			return $(x).text() > $(y).text() ? 1 : -1;
		  }));
}

function save_intervention(coach,agents,topic,product){

	data={
		interventions_coach:coach,
		interventions_attendees:agents,
		interventions_topic:topic,
		interventions_devices:product
	}

	$.ajax({
		type:"POST",
		url:"/api/intervention/add" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetIntervention();
			updateInterventionTable();
			$("#intervention_status").html("Intervention recorded.");
		},
		error:function(error){

		}
	});
}

function resetEscalation(){
	var user=JSON.parse(getCookie('userdetails'));

	$('#L2_list_escalation').empty();
	$('#L2_list_escalation').append(new Option('Select L2 Expert', 0, true, true));
	$('#L2_list_escalation option').addClass('selectheader');

	
	
	$('.selectheader').prop('disabled','disabled');
	$('.selectheader').prop('selected','selected');
	
	$('#L2_list_escalation').val(user.users_CN);

	getDataRecord('/api/users/type/Level 1/0',function(experts){
		//console.log(experts.length);
		//$("#L1_list_escalation_source").html('');
		getDataRecord('/api/users/type/Level 2/TM',function(expertsL2){
			$("#L1_list_escalation_source").empty();
			$('#L1_list_escalation_source').append(new Option('Select Expert', 0, true, true));
			$('#L1_list_escalation_source option').addClass('selectheader');
			//console.log("in experts");
			experts=experts.concat(expertsL2);
			experts.sort((a, b) => (a["users_CN"] > b["users_CN"]) ? 1 : -1)
			experts.forEach(data => {
				//console.log(data);
				$("#L1_list_escalation_source").append(new Option(data.users_CN, data.users_CES));
			});
		},'');
	});

	getDataRecord('/api/devices',function(devices){
		$("#escalation_product").empty();
		$('#escalation_product').append(new Option('Select Product', 0, true, true));
		$('#escalation_product option').addClass('selectheader');
		//$("#escalation_product").html('');
		devices.sort((a, b) => (a["device_name"] > b["device_name"]) ? 1 : -1)
		devices.forEach(data => {
			//console.log(data);
			$("#escalation_product").append(new Option(data.device_name + "    (" + data.device_model + ")", data.device_model));
		});
	},'');
	
	$("#escalation_casenumber").val('');
	$("#escalation_invalidreason").val('');
	$("#escalation_opportunity").val('');
	$("#escalation_TM").val('');
}

function resetIntervention(){
	$('#L2_list_intervention').html('');
	$('#L2_list_intervention').append(new Option('Select L2 Expert', 0, true, true));
	$('#L2_list_intervention option').addClass('selectheader');
	$('.selectheader').prop('disabled','disabled');
	$('.selectheader').prop('selected','selected');
	
	$('#intervention_topic').val('');
	$("#L1_list_intervention_dest").html('');
	getDataRecord('/api/users/type/Level 2/TM',function(experts){
		//console.log(experts.length);
		//$("#L2_list_intervention").html('');
		experts.sort((a, b) => (a["users_CN"] > b["users_CN"]) ? 1 : -1)
		experts.forEach(data => {
			//console.log(data);
			$("#L2_list_intervention").append(new Option(data.users_CN, data.users_CES));
		});
	},'L2_list_intervention');

	getDataRecord('/api/users/type/Level 1/0',function(experts){
		//console.log(experts);
		
		$("#L1_list_intervention_source").html('');
		experts.sort((a, b) => (a["users_CN"] > b["users_CN"]) ? 1 : -1)
		experts.forEach(data => {
			//console.log(data);
			$("#L1_list_intervention_source").append(new Option(data.users_CN, data.users_CES));
		});
	},'L1_list_intervention_source');
	

	getDataRecord('/api/devices',function(devices){
		//console.log(experts.length);
		$("#intervention_product").html('');
		devices.sort((a, b) => (a["device_name"] > b["device_name"]) ? 1 : -1)
		devices.forEach(data => {
			//console.log(data);
			$("#intervention_product").append(new Option(data.device_name + "    (" + data.device_model + ")", data.device_model));
		});
	},'intervention_product');
}

function updateInterventionTable(){
	
	getDataRecord('/api/interventions/get',function(interventions){
		var html="";
		//console.log(interventions);
		$("#intervention_table").html('<tr><td>Coach</td><td>L1 Agents</td><td>Topic</td><td>Product</td></tr>');
		interventions.forEach(data => {
			html="<tr><td id='coach_"+ data.interventions_id +"'></td><td id='attendees_"+ data.interventions_id +"'></td><td>" + data.interventions_topic + "</td><td id='devices_"+ data.interventions_id +"'></td></tr>";
			$("#intervention_table").append(html);
			getDataRecord('/api/users/CES/'+data.interventions_coach+'/0',function(coachdata){
					var html4='';
					html4+=coachdata[0].users_CN + "<br>";
					$('#coach_'+ data.interventions_id).append(html4);
					//console.log(html4);
			},'');


			var attendees_array =  data.interventions_attendees.split(",");
			attendees_array.forEach(attendee =>{
				getDataRecord('/api/users/CES/'+attendee+'/0',function(attendeedata){
					var html2='';
					html2+=attendeedata[0].users_CN + "<br>";
					$('#attendees_'+ data.interventions_id).append(html2);
					//console.log(html2);
				},'');
			});

			var devices_array =  data.interventions_devices.split(",");
			//console.log(devices_array);
			devices_array.forEach(device =>{
				getDataRecord('/api/devices/model/'+device,function(devicedata){
					var html3='';
					//console.log(devicedata);
					html3+=devicedata[0].device_name + "<br>";
					$('#devices_'+ data.interventions_id).append(html3);
					//console.log(html3);
				},'');
			});
		});
		//console.log(html);
		
	},'');
}

function approveEscalation(escalation_id,approve){
	data={
		escalation_id:escalation_id,
		approve:approve
	}
	$.ajax({
		type:"POST",
		url:"/api/escalations/approve" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			updateEscalationTable();
		},
		error:function(error){

		}
	 });
}

function updateRemarks(escalation_id,remarks,source){
	data={
		escalation_id:escalation_id,
		escalation_remarks:remarks,
		escalation_remarks_source:source
	}
	$.ajax({
		type:"POST",
		url:"/api/escalations/updateRemarks" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			if(source=='L2'){
				updateEscalationTable();
			}else{
				approveEscalation(escalation_id,0)
			}
			
		},
		error:function(error){

		}
	});
}

function editEscalation(escalation_id){
	$('.escalation_edit').removeClass('hiddenDiv');
	$('.escalation_add').addClass('hiddenDiv');
	$('#L2_escalation').css('display','block');
	getDataRecord('/api/escalations/getSingle/'+escalation_id,function(escalations){
		getDataRecord('/api/users/CES/'+escalations[0].escalations_L2+'/a',function(L2data){
			var html4='';
			html4+=L2data[0].users_CN + "<br>";
			$('#L2_'+ data.escalations_id).append(html4);
			//console.log(html4);
		},'');
		getTM(escalations[0].escalations_L1,function(TMname,TMCES){
			$('#escalation_TM').val('');
			$('#escalation_TM').val(TMname);
			$('#escalation_TM').attr('data-tm',TMCES)
		});
		console.log(escalations);
		$('#L1_list_escalation_source').val(escalations[0].escalations_L1);
		$('#escalation_id').val(escalation_id);
		$('#escalation_casenumber').val(escalations[0].escalations_casenumber);
		$('#escalation_product').val(escalations[0].escalations_product);
		$('#escalation_invalid').prop('checked',escalations[0].escalations_invalid=='on'?'true':'false');
		$('#escalation_invalidreason').val(escalations[0].escalations_reason);
		$('#escalation_opportunity').val(escalations[0].escalations_opportunity);
		$('#escalation_feedback').val(escalations[0].escalations_feedback);
		$('#escalation_commitment').val(escalations[0].escalations_commitment);
	});
}

function updateEscalationTable(){
	
	var remarks="";
	var editescalation="";
	var status;
	console.log(userlevel);
	console.log(usertype);
	console.log("in update")
	getDataRecord('/api/escalations/get',function(escalations){
		//console.log(escalations);
		escalations.sort((a, b) => (a["escalations_approved"] > b["escalations_approved"]) ? 1 : -1)
		var html="";
		//console.log(experts.length);
		$("#escalation_table").html('<thead style="text-align:center;font-weight:bold;cursor: pointer;"><tr><td onclick="sortTable(&quot;escalation_table&quot;,0)">Date</td><td onclick="sortTable(&quot;escalation_table&quot;,1)">Reported by</td><td onclick="sortTable(&quot;escalation_table&quot;,2)">L1 Agent</td><td onclick="sortTable(&quot;escalation_table&quot;,3)">Case Number</td><td onclick="sortTable(&quot;escalation_table&quot;,4)">Product</td><td onclick="sortTable(&quot;escalation_table&quot;,5)">Reason</td><td class="escalation_TM_column" onclick="sortTable(&quot;escalation_table&quot;,6)">TM</td><td onclick="sortTable(&quot;escalation_table&quot;,7)">Expert&quot;s Opportunity</td><td onclick="sortTable(&quot;escalation_table&quot;,8)">TM Feedback</td><td onclick="sortTable(&quot;escalation_table&quot;,9)">Expert&quot;s Commitment</td><td class="escalation_approved_column" onclick="sortTable(&quot;escalation_table&quot;,10)">Status</td><td class="escalation_approved_column" onclick="sortTable(&quot;escalation_table&quot;,11)">Remarks</td></tr></thead><tbody>');
		escalations.forEach(data => {
			commitment=data.escalations_commitment;
			//console.log(userlevel);

			html="<tr id='escalation_" + data.escalations_id + "'>" +
				"<td> "+ data.escalations_timestamp +"</td>" +
				"<td id='L2_"+ data.escalations_id +"'></td>" +
				"<td id='L1_"+ data.escalations_id +"'></td>" +
				"<td>" + data.escalations_casenumber + "</td> " +
				"<td id='product_"+ data.escalations_id +"'></td>" +
				"<td>" + data.escalations_reason + "</td> " +
				"<td class='escalation_TM_column' id='TM_"+ data.escalations_id +"'></td>" +
				"<td>" + data.escalations_opportunity + "</td> " +
				"<td id='escalation_feedback_"+ data.escalations_id +"'> " + data.escalations_feedback + "</td> " +
				"<td id='escalation_commitment_"+ data.escalations_id +"'> " + data.escalations_commitment + "</td> " +
				"<td align='center' class='escalation_approved_column' id='escalation_approved_column_"+ data.escalations_id +"'></td> " +
				"<td align='center' class='escalation_remarks_column' id='escalation_remarks_column_"+ data.escalations_id +"'></td> " +
				"</tr>";
			$("#escalation_table").append(html);


			if(userlevel==2){
				//console.log("user level 2")
				if(data.escalations_fornotify=='0001'){
					$('#escalation_approved_column_'+ data.escalations_id).html("Waiting for expert's commitment.");
				}
				if(data.escalations_fornotify=='0010'){
					$('#escalation_approved_column_'+ data.escalations_id).html("Waiting for TM's/SME's action.");
				}
				if(usertype!='TM'){
					if(usertype!='Analyst'){
                    
                        //if((data.escalations_L2 != user.users_CES)&&(data.escalations_L1 != user.users_CES)){
                        //    $('#escalation_'+ data.escalations_id).addClass("hiddenDiv");
                        //    return;
                        //}
						$('#saveasxlsbutton').css('display','none');
						$('#generatel2report').css('display','none');
                        if(data.escalations_L1 == user.users_CES){
                            if(data.escalations_fornotify=="0001"){
                                //console.log("no commitment");
                                $('#escalation_commitment_'+data.escalations_id).html(data.escalations_commitment?data.escalations_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
                            }
                        }
                    }
					//console.log(data.escalations_fornotify<='0010');
					if((data.escalations_L2 == user.users_CES)){
						$('#L2_'+data.escalations_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='editEscalation("+ data.escalations_id +")'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
						$('#L2_'+data.escalations_id).append("<i class='fa fa-times tooltip' style='font-size:18px;color:red;float:right' onclick='if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteEscalation("+ data.escalations_id +");};'><span class='tooltiptext' style='width:100px; font-size:12px;'>Delete this entry</span></i><br><br>");
					}
					
					if((data.escalations_approved==1)&&((data.escalations_fornotify!='0001')&&(data.escalations_fornotify!='0010'))){
						$('#escalation_approved_column_'+ data.escalations_id).html("Approved");
					}else if(data.escalations_approved==0){
						$('#escalation_approved_column_'+ data.escalations_id).html("Pending");

					}else if(data.escalations_approved==-1){
						$('#escalation_approved_column_'+ data.escalations_id).html("Disapproved");

					}
					$('#escalation_remarks_column_'+ data.escalations_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39);$(&#39;#remarks_modal_escalation_source&#39;).val(&#39;L2&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.escalations_remarks.replace('\'','`').replace('\r','<br>').replace('\n','<br>')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Add Remarks</span></i><br>");
					$('#escalation_remarks_column_'+ data.escalations_id).append(data.escalations_remarks);
					if(data.escalations_fornotify=='0100'){
						$('#escalation_' + data.escalations_id).css('background-color','#fcbdbd');
					}
				}else{
					//console.log("in TM section");
					if(data.escalations_approved==1){
						$('#escalation_approved_column_'+ data.escalations_id).html("Approved");
					}else if(data.escalations_approved==0){
						$('#escalation_approved_column_'+ data.escalations_id).html("<button onclick='approveEscalation(" + data.escalations_id + ",1)' style='width:82px'>Approve</button><br><br><button onclick='approveEscalation(" + data.escalations_id + ",-1)' style='width:82px'>Disapprove</button>");
					}else if(data.escalations_approved==-1){
						$('#escalation_approved_column_'+ data.escalations_id).html("Disapproved");
					}
					
					//console.log(data.escalations_remarks);
					$('#escalation_remarks_column_'+ data.escalations_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.escalations_remarks.replace('\'','`').replace('\r','<br>').replace('\n','<br>')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i><br><br>");
					//console.log("'$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.escalations_remarks+"&#39;);'>");
					if(data.escalations_fornotify=='1000'){
						$('#escalation_' + data.escalations_id).css('background-color','#fcbdbd');
					}
					getTeam(data.escalations_L1,function(team){
						if(team==userteam){
							if(data.escalations_fornotify=='0010'){
								if(!data.escalations_commitment){
									$('#escalation_commitment_'+ data.escalations_id).html("<button onclick='update_notify(" + data.escalations_id + ",&#39;0001&#39;)' style='width:62px'>Send to Expert</button>");
								}else{
									$('#escalation_feedback_'+ data.escalations_id).html(data.escalations_feedback?data.escalations_feedback:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_feedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#feedback_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
								}
							}
							if(data.escalations_fornotify=='0001'){
								$('#escalation_commitment_'+ data.escalations_id).html("Waiting for Expert's response");
							}
						}
					});
				}


				

			} else {
				$('#L2_'+data.escalations_id).text('');
				
				$('#saveasxlsbutton').css('display','none');
				$('#generatel2report').css('display','none');
				//console.log("in user level 1")
				$('.escalation_approved_column').addClass('hiddenDiv');
				$('.escalation_TM_column').addClass('hiddenDiv');
				
				if((usertype!='TM')&&(usertype!='SME')){
					if(data.escalations_L1!=userCES){
						$('#escalation_'+ data.escalations_id).addClass("hiddenDiv");
						return;
					}
					if(data.escalations_fornotify=="0001"){
						//console.log("no commitment");
						$('#escalation_commitment_'+data.escalations_id).html(data.escalations_commitment?data.escalations_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
					}else{
						$('#escalation_'+ data.escalations_id).addClass("hiddenDiv");
						return;
					}
					//console.log(team);
					//console.log(userteam);
					$('.escalation_remarks_column').addClass('hiddenDiv');
				}else{
					getTeam(data.escalations_L1,function(team){
						//console.log(team);
						//console.log(userteam);
						if(team!=userteam){
							$('#escalation_'+data.escalations_id).addClass('hiddenDiv');
						}else{
							//console.log('expert team ' + team);
							//console.log('TM     team ' + userteam);
							//console.log(data.escalations_approved);
							
							if(data.escalations_approved<1){
								//console.log('not approved');
								$('#escalation_'+data.escalations_id).addClass('hiddenDiv');
							}else{
								if(data.escalations_fornotify=='0010'){
									if(!data.escalations_commitment){
										$('#escalation_commitment_'+ data.escalations_id).html("<button onclick='update_notify(" + data.escalations_id + ",&#39;0001&#39;)' style='width:62px'>Send to Expert</button>");
									}else{
										$('#escalation_feedback_'+ data.escalations_id).html(data.escalations_feedback?data.escalations_feedback:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_feedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#feedback_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
									}
								}
								if(data.escalations_fornotify=='0001'){
									$('#escalation_commitment_'+ data.escalations_id).html("Waiting for Expert's response");
								}
							}
						}
					})
					
					
				}
			}
			

			getDataRecord('/api/users/CES/'+data.escalations_L2+'/a',function(L2data){
					var html4='';
					
					html4=L2data[0].users_CN + "<br>";
					$('#L2_'+ data.escalations_id).append(html4);
					//console.log(html4);
			},'');
			getDataRecord('/api/users/CES/'+data.escalations_L1+'/a',function(L1data){
					//console.log(L1data);
					var html4='';
					
					html4+=L1data[0].users_CN + "<br>";
					$('#L1_'+ data.escalations_id).html(html4);
					//console.log(html4);
			},'');
				//console.log(data);
			//console.log(devices_array);
			getDataRecord('/api/devices/model/'+data.escalations_product,function(devicedata){
				var html3='';
				//console.log(devicedata);
				if(devicedata.length){
					html3+=devicedata[0].device_name + "<br>";
				}else{
					html3+="No device selected."
				}
				$('#product_'+ data.escalations_id).append(html3);
				//console.log(html3);
			},'');
			getTM(data.escalations_L1,function(TMname,TMCES){
				//console.log(TMname);
				$('#TM_'+ data.escalations_id).append(TMname);
			})
		});
		//console.log(html);
		$('.escalation_add').removeClass('hiddenDiv');
		$('.escalation_edit').addClass('hiddenDiv');
		resetEscalation();
		//$('#L2_escalation').css('display','block');
		$('#escalation_filter').val('');
	},);
}

function update_notify(escalation_id,notify){
	data={
		escalation_id:escalation_id,
		escalation_fornotify:notify
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/escalations/updateNotify" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			//resetEscalation();
			updateEscalationTable();
			$("#escalation_status").html("Escalation updated.");
		},
		error:function(error){
			console.log(error);
		}
	 });
}

function update_escalation(escalation_id,L1,L2,casenumber,product,invalid,reason,opportunity,feedback,commitment,datetime){
	data={
		escalation_id:escalation_id,
		L1_list_escalation_source:L1,
		L2_list_escalation:L2,
		escalation_casenumber:casenumber,
		escalation_product:product,
		escalation_invalid:invalid,
		escalation_invalidreason:reason,
		escalation_opportunity:opportunity,
		escalation_feedback:feedback,
		escalation_commitment:commitment,
		escalation_timestamp:datetime,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/escalations/update" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			//resetEscalation();
			updateEscalationTable();
			$("#escalation_status").html("Escalation updated.");
		},
		error:function(error){
			console.log(error);
		}
	 });
}

function save_escalation(L1,L2,casenumber,product,invalid,reason,opportunity,feedback,commitment,datetime){
	data={
		L1_list_escalation_source:L1,
		L2_list_escalation:L2,
		escalation_casenumber:casenumber,
		escalation_product:product,
		escalation_invalid:invalid,
		escalation_invalidreason:reason,
		escalation_opportunity:opportunity,
		escalation_feedback:feedback,
		escalation_commitment:commitment,
		escalation_timestamp:datetime
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/escalations/add" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetEscalation();
			updateEscalationTable();
			$("#escalation_status").html("Escalation recorded.");
		},
		error:function(error){

		}
	});
}

function deleteEscalation(id){
	data={
		escalation_id:id,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/escalations/delete" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetEscalation();
			updateEscalationTable();
			$("#escalation_status").html("Escalation recorded.");
		},
		error:function(error){

		}
	});
}

function saveCommitment(escalation_id,commitment){
	data={
		escalation_id:escalation_id,
		escalation_commitment:commitment,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/escalations/updateCommitment" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetEscalation();
//			updateEscalationTable();
			$("#escalation_status").html("Escalation recorded.");
		},
		error:function(error){

		}
	 });
}

function saveFeedback(escalation_id,feedback){
	data={
		escalation_id:escalation_id,
		escalation_feedback:feedback,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/escalations/updateFeedback" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetEscalation();
//			updateEscalationTable();
			$("#escalation_status").html("Escalation recorded.");
		},
		error:function(error){

		}
	 });
}

function getTM(CES,callback){
	//console.log(CES);
	getDataRecord('/api/users/CES/'+CES+'/a',function(userdata){
		//console.log(userdata);
		
			getDataRecord('/api/users/team/'+userdata[0].users_team+'/a',function(team){
				//console.log(team);
				var TM = team.find(o => o.users_type.split(" ")[2] == "TM");
				//console.log(TM);
				try{
					
					callback(TM.users_CN,TM.users_CES);
				}catch(err){
					callback('not found, check database',0);
				}finally{
				}
			},'');
		
	},'');
}

function getTeam(CES,callback){
	getDataRecord('/api/users/CES/'+CES+'/a',function(userdata){
		//console.log(userdata);
		if(callback){
			//console.log('in callback');
			callback(userdata[0].users_team);
		}else{
			//console.log(userdata[0].users_team);
			return userdata[0].users_team;
		}
	},'');	
}

function getUpdates(callback){
	getDataRecord('/api/viewupdates',function(updatedata){
		console.log(updatedata);
		var html="<tbody>";
		updatedata.forEach(update => {
			html+="<tr class='update_row'><td style='text-wrap:normal;word-wrap: break-word;'><h5 style='font-size:14px;margin-bottom:5px;margin-right:0px;width:99%;'>"+ update.updates_title + "</h5><br>" + update.updates_timestamp + "<br><br><span style='font-size:12px;'>" + update.updates_content.replace(/\n/g,'<br>') + "</span></td></tr>";
		});
		html+="</tbody>";
		callback(html);
	},'');
}

function getCookie(cname) {
	//console.log(document.cookie);
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  	var c = ca[i];
	  	while (c.charAt(0) == ' ') {
			c = c.substring(1);
	 	}
	 	if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
	  	}
	}
	return "";
}

function openKB(KB){
	window.open("https://kb.arlo.com/"+KB,'KB', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,top='+300+',right='+300);
}

function openSite(site,appsim){
	if(appsim)
		window.open(site,'External Site', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=380,height=760,top='+20+',right='+300)
	else
		window.open(site,'External Site', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,top='+300+',right='+300);
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

function loadEmergency(){
	window.open("http://10.54.108.15/emergency","_self");
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
/*
((parseFloat(a.CSAT[1]) > parseFloat(b.CSAT[1])) ? 1 : -1)

	getDataRecord('/api/utilization/get/'+CES,function(utildata){
		getDataRecord('/api/metric/CES/'+CES,function(csatdata){
			var month_csat_data = csatdata.filter(csatelement => {
				return (parseInt(csatelement["metric-Response-Completiondate"].split("/")[1])==metricDate.getMonth()+1)
			});
			var month_util_data = utildata.filter(utilelement => {
				return (parseInt(utilelement["util_date"].split("/")[1])==metricDate.getMonth()+1);
			});
			console.log(month_util_data);
			console.log(month_csat_data);
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
			console.log(month_data);
			/*var html="<tbody>";
			updatedata.forEach(update => {
				html+="<tr class='update_row'><td><h5 style='font-size:14px;margin-bottom:5px;'>"+ update.updates_title + "</h5><br>" + update.updates_timestamp + "<br><br><span style='font-size:12px'>" + update.updates_content.replace(/\n/g,'<br>') + "</span></td></tr>";
			});
			html+="</tbody>";
			if(callback){
				callback(month_data);
			}
		});
		
	},''); 

}*/

function save_cases(){

}

function show_screensaver(){
    $('#screensaver').fadeIn().css('display','table');
    screensaver_active = true;
    screensaver_animation();
}

function stop_screensaver(){
    $('#screensaver').fadeOut();
    screensaver_active = false;
}

function screensaver_animation(){
    if (screensaver_active) {
        
    }
}

function changeScreenSaverImage(){
	if(!screensaverImageList.length){
		screensaverImageList=screensaverMasterImageList.slice();
	}
	var randomImage=Math.floor(Math.random()*screensaverImageList.length);
	console.log(randomImage);
	mousetimeout=setTimeout(function(){
		changeScreenSaverImage();	
	},idletime*1000);
	$('#screensaverSlides').fadeIn().attr('src',screensaverImageList[randomImage]);
	screensaverImageList.splice(randomImage,1);;
	console.log(screensaverImageList);
}

function runScreenSaver(){
    clearTimeout(mousetimeout);
    if (screensaver_active) {
        stop_screensaver();
	}
	
    mousetimeout = setTimeout(function(){
		changeScreenSaverImage()
		show_screensaver();
    }, 1000 * idletime); // 5 secs
};

function saveCases(){
	data = {
		ces:userCES,
		dataStandard:localStorage.getItem('standardLocalStorage'),
		dataEOS:localStorage.getItem('EOS'),
		dataAHT:localStorage.getItem('AHT')
	}
	$.ajax({
		type:"POST",
		url:"/api/cases/save" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
		},
		error:function(error){
		}
	});
}

function loadCases(){
	data = {
		ces:userCES,
		data:localStorage.getItem('standardLocalStorage'),
		dataEOS:localStorage.getItem('EOS'),
		dataAHT:localStorage.getItem('AHT')
	}
	$.ajax({
		type:"GET",
		url:"/api/cases/get/"+userCES,
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data.data.length);
			//console.log(standardStorage);
			if(data.data.length){
				try{
					standardStorage=[];
					standardStorage=JSON.parse(data.data[0].cases_data).slice();
					localStorage.setItem('standardLocalStorage',JSON.stringify(standardStorage));
				}catch(err){
					console.log(err);
				}
				try{
					AHT=[];
					AHT=JSON.parse(data.data[0].cases_AHT).slice();
					localStorage.setItem('AHT',JSON.stringify(AHT));
					AHT_num_cases=AHT.length;
					localStorage.setItem('AHT_numCases',AHT_num_cases);
				}catch(err){
					console.log(err);
				}
				try{
					EOS=[];
					EOS=JSON.parse(data.data[0].cases_EOS).slice();
					localStorage.setItem('EOS',JSON.stringify(EOS));
					num_cases=EOS.length;
					localStorage.setItem('numCases',num_cases);
				}catch(err){
					console.log(err);
				}
				
				
				
				console.log(AHT);
				console.log(standardStorage);
				//localStorage.setItem('standardLocalStorage',[JSON.stringify(data.data[0].cases_data)]);
				loadData(currentRecord);
			}else{
				alert("No cases in database.");
			}
			
		},
		error:function(error){
		}
	});
}

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

function toSeconds(time){
	timeSplit=time.split(':');
	return parseInt(timeSplit[0])*60*60+parseInt(timeSplit[1])*60+parseInt(timeSplit[2])
}

function addTime(time1,time2,callback){
	
	var totalSeconds=toSeconds(time1)+toSeconds(time2);
	
	hours=parseInt(totalSeconds/3600);
	mins=parseInt(totalSeconds/60)%60;
	secs=totalSeconds%60;

	if(callback)
		callback(hours+':'+mins+':'+secs);
	else
		return hours+':'+mins+':'+secs;
}

function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20').replace(/<i.*?\/i>/gi, "").replace(/Add Remarks/gi,"").replace(/<br><br>/gi,"");
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

function copyToCB(value) {
    var tempInput = document.createElement("textarea");
	tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value.replace(/<br>/gi,'\n');
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function openTab(tabs,tab) {
	$('.'+tabs).css('display','none');
	$('.'+tabs).addClass('hiddenDiv');
	$('.tab_button').css('background-color','white');
	$('.tab_button').css('color','black');
	$('.'+tabs+'#'+tab).css('display','block');
	$('.'+tabs+'#'+tab).removeClass('hiddenDiv');
	$('.tab_button#'+tab).css('background-color','green');
	$('.tab_button#'+tab).css('color','white');
}

function getDeficit(actual,total,target){
	if(total==0){
		return 1;
	}
	const fn = (x,y,z) => ((x+z)/(y+z))*100;
	var deficit=0;
	const fnParams = [actual,total,deficit];
	//console.log(fnParams);
	try {
		const result = goalSeek({
		fn,
		fnParams,
		percentTolerance: 0.1,
		maxIterations: 1000000,
		maxStep: 0.01,
		goal: target,
		independentVariableIdx: 2
		})
		//console.log(result);
		return (Math.ceil(result));
		// result => 98
	} catch(e) {
		console.log(e);

  	}
}

function addTemplate(title,content){
	var templateContent=content;
	templateContent=templateContent
		.replace(/&/g, "&amp;")
		.replace(/\r/gi, '&nbsp;')
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/gi,"&quot;")
		.replace(/'/gi,"&apos;")
		.replace(/\\/g, "&#92;");
		
	data={
		templates_CES:userCES,
		templates_title:title,
		templates_content:templateContent.replace(/\n/gi, '<br>')
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/templates/add" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetEscalation();
			updateEscalationTable();
			$("#escalation_status").html("Escalation recorded.");
		},
		error:function(error){

		}
	});
}

function getTemplates(CES,callback){
	$.ajax({
		type:"GET",
		url:"/api/templates/get/"+CES,
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			console.log(data.data);
			if(callback){
				callback(data.data);
			}
			return data.data;
			
		},
		error:function(error){
		}
	})
}

function deleteTemplate(id,ces){
	data={
		templates_id:id,
		templates_CES:ces,
	}
	$.ajax({
		type:"POST",
		url:"/api/templates/delete" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetEscalation();
			updateEscalationTable();
			$("#escalation_status").html("Escalation recorded.");
		},
		error:function(error){

		}
	});
	getTemplates(userCES,function(data){
        displayTemplates(data);
    })
}

function editTemplate(id,title,content){
	var templateContent=content;
	templateContent=templateContent
		.replace(/&/g, "&amp;")
		.replace(/\r/gi, '&nbsp;')
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/gi,"&quot;")
		.replace(/'/gi,"&apos;")
		.replace(/\\/g, "&#92;");
		
	data={
		templates_id:id,
		templates_CES:userCES,
		templates_title:title,
		templates_content:templateContent.replace(/\n/gi, '<br>')
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/templates/edit" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetEscalation();
			updateEscalationTable();
			$("#escalation_status").html("Escalation recorded.");
		},
		error:function(error){

		}
	});
	cancelEditTemplate();
}

function showEditTemplate(id,title,content){
	var templateContent=content;
	templateContent=templateContent
		.replace(/&nbsp;/gi, ' ')
		.replace(/<br>/gi, '\n')
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<")
		.replace(/&apos;/gi,"'")
		.replace(/&quot;/gi,'"')
		.replace(/&#92;/g, "\\")
		.replace(/&amp;/g, "&");

	$('#mytemplate_flow_collapse_add').click();
	$('#mytemplate_flow_collapse_add>h5').html('Edit Template');
	$('#templated_edit_id').val(id);
	$('#mytemplate_title').val(title);
	$('#mytemplate_content').val(templateContent);
	$('#template_add').addClass('hiddenDiv');
	$('#template_edit').removeClass('hiddenDiv');
	$('#template_edit_cancel').removeClass('hiddenDiv');
}

function cancelEditTemplate(){
	$('#template_add').removeClass('hiddenDiv');
	$('#template_edit').addClass('hiddenDiv');
	$('#template_edit_cancel').addClass('hiddenDiv');
	$('#mytemplate_flow_collapse_add>h5').html('Add Template');
	$('#mytemplate_title').val('');
	$('#mytemplate_content').val('');
}

function displayTemplates(data,callback){
	$('#mytemplates_container').html('');
	data.forEach(function(element){
		var templateContent=element.templates_content;

		templateContent=templateContent
			.replace(/\r/gi, '&nbsp;')
			.replace(/\n/gi, '<br>')
			//.replace(/</g, "&lt;")
			//.replace(/>/g, "&gt;")
			.replace(/'/gi,"&apos;")
			.replace(/"/gi,"&quot;")
			.replace(/&/g, "&amp;")
			.replace(/\\/g, "&#92;")
        
		var templateHtml="<div type='button' class='collapsible mytemplate' id='mytemplate_flow_collapse'><h5>"+
		"<span class=mytemplate_flow_hide style='border: solid white; border-width: 0 3px 3px 0; display: inline-block; padding: 3px;transform: rotate(45deg); -webkit-transform: rotate(45deg);'></span>"+
		" "+element.templates_title+"</i><span style='float:right;'><i class='fa fa-edit tooltip' style='font-size:12px;color:black;cursor: pointer;' onclick='event.stopPropagation();event.preventDefault();showEditTemplate(&quot;"+element.templates_id+"&quot;,&quot;"+element.templates_title+"&quot;,&quot;"+templateContent+"&quot;)'></i>&nbsp;<i class='fa fa-times tooltip' style='font-size:14px;color:red;cursor: pointer;' onclick='if(confirm(&quot;Are you sure you want to delete template "+ element.templates_title +"?&quot;)){event.stopPropagation();event.preventDefault();deleteTemplate("+element.templates_id+","+userCES+")};'></i></span></h5></div>"+
		"<div class='mytemplate_flow_content' style='display:none'>"+
			"<button onclick='copyToCB($(this).next().html())'>Copy</button>"+
			"<div id='template_"+element.templates_id+"'>"+element.templates_content+"</div>"+
			"</div>";
		$('#mytemplates_container').append(templateHtml);
		//$('#template_'+element.templates_id).append($.parseHTML(templateContent));
		console.log($.parseHTML(templateContent))
	});
	var collTemplate = $('.collapsible.mytemplate');
	var i;
	for (i = 0; i < collTemplate.length; i++) {
		collTemplate[i].removeEventListener("click", templateClickHandler);
		collTemplate[i].addEventListener("click", templateClickHandler);
	}
	if(callback){
		callback();
	}
}

function templateClickHandler(){
	console.log($(this));
	$('.mytemplate_flow_content').css("display","none");
	$('.mytemplate').not($(this)).removeClass("active");
	var content = $(this).next();
	$(this).toggleClass("active");
	if ($(this).hasClass('active')) {
		content.css("display","block");
	} else {
		content.css("display","none");
	}
}

function getBirthdays(callback){
	$.ajax({
		type:"GET",
		url:"/api/users/birthday/get",
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data.data);
			if(callback){
				callback(data.data);
			}
			return data.data;
			
		},
		error:function(error){
		}
	})
}

function sortTable(tablename,n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById(tablename);
	switching = true;
	// Set the sorting direction to ascending:
	dir = "asc";
	/* Make a loop that will continue until
	no switching has been done: */
	while (switching) {
	  // Start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /* Loop through all table rows (except the
	  first, which contains table headers): */
	  for (i = 1; i < (rows.length - 1); i++) {
		// Start by saying there should be no switching:
		shouldSwitch = false;
		/* Get the two elements you want to compare,
		one from current row and one from the next: */
		x = rows[i].getElementsByTagName("TD")[n];
		y = rows[i + 1].getElementsByTagName("TD")[n];
		/* Check if the two rows should switch place,
		based on the direction, asc or desc: */
		if (dir == "asc") {
		  if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
			// If so, mark as a switch and break the loop:
			shouldSwitch = true;
			break;
		  }
		} else if (dir == "desc") {
		  if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
			// If so, mark as a switch and break the loop:
			shouldSwitch = true;
			break;
		  }
		}
	  }
	  if (shouldSwitch) {
		/* If a switch has been marked, make the switch
		and mark that a switch has been done: */
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
		// Each time a switch is done, increase this count by 1:
		switchcount ++;
	  } else {
		/* If no switching has been done AND the direction is "asc",
		set the direction to "desc" and run the while loop again. */
		if (switchcount == 0 && dir == "asc") {
		  dir = "desc";
		  switching = true;
		}
	  }
	}
  }

  function populateMIPCurrentStats(){
	var mip=0;
	console.log($('#table_metrics_summary_data td:nth-child(12)').html());
	inbound=$('#table_metrics_summary_data td:nth-child(12)').html();
	console.log(inbound);
	$('#mip_CSAT').html($('#table_metrics_summary_data td:nth-child(1)').html());
    $('#mip_NPS').html($('#table_metrics_summary_data td:nth-child(4)').html());
    $('#mip_FCR').html($('#table_metrics_summary_data td:nth-child(5)').html());
	$('#mip_ACD').html($('#table_metrics_summary_data td:nth-child(9)').html());
	$('#mip_QA').html($('#table_metrics_summary_data td:nth-child(10)').html());
	$('#mip_closure').html(((parseFloat($('#table_metrics_summary_data td:nth-child(13)').html())/inbound)*100).toFixed(2)+'%');
	
	mip=(identifyMIPRating('CSAT')*parseFloat($('#mip_CSAT_wt').html())/100+
		identifyMIPRating('NPS')*parseFloat($('#mip_NPS_wt').html())/100+
		identifyMIPRating('FCR')*parseFloat($('#mip_FCR_wt').html())/100+
		identifyMIPRating('ACD')*parseFloat($('#mip_ACD_wt').html())/100+
		identifyMIPRating('QA')*parseFloat($('#mip_QA_wt').html())/100+
		identifyMIPRating('closure')*parseFloat($('#mip_closure_wt').html())/100).toFixed(2);
	$('#mip_score').html(mip);
  }

function identifyMIPRating(stat){
	$('.mip_'+stat+'_grid').css('background-color','white');
	switch(true){
		case (parseFloat($('#mip_'+stat).html())>=parseFloat($('#mip_'+stat+'_5').html())):
			$('#mip_'+stat+'_5').css('background-color','#fce303');
			return(5);
			break;
		case (parseFloat($('#mip_'+stat).html())>=parseFloat($('#mip_'+stat+'_4').html())):
			$('#mip_'+stat+'_4').css('background-color','#fce303');
			return(4);
			break;
		case (parseFloat($('#mip_'+stat).html())>=parseFloat($('#mip_'+stat+'_3').html())):
			$('#mip_'+stat+'_3').css('background-color','#fce303');
			return(3);
			break;
		case (parseFloat($('#mip_'+stat).html())>=parseFloat($('#mip_'+stat+'_2').html())):
			$('#mip_'+stat+'_2').css('background-color','#fce303');
			return(2);
			break;
		case (parseFloat($('#mip_'+stat).html())<parseFloat($('#mip_'+stat+'_1').html())):
			$('#mip_'+stat+'_1').css('background-color','#fce303');
			return(1);
			break;
		default:
			$('#mip_'+stat+'_1').css('background-color','#fce303');
			return(1);

	}
}

function populateL2Endorsers(table,selector,week){

	
		if(l2endorser_editor.indexOf(user.users_CES)>=0){
			$("."+table+" ."+selector).html();
			$("."+table+" ."+selector).append(new Option('Select Expert',''));
			getDataRecord('/api/users/type/Level 2/TM',function(expertsL2){
				expertsL2.forEach(function(expert){
					$("."+table+" ."+selector).append(new Option(expert.users_alias,expert.users_CES))
				})
				getDataRecord('/api/endorser/get/'+week,function(data){
					if(data.length>0){
						var endorsers=JSON.parse(data[0].endorsers_data);
						//console.log(endorsers);
						endorsers.forEach(function(endorser){
							//console.log(endorser.endorser);
							//console.log(user.users_ces);
							if(endorser.endorser!=null){
								if(endorser.endorser==user.users_CES){
									$("#"+endorser.slot).val(endorser.endorser);
									$("#"+endorser.slot).parent().css('background-color','#75c98b')
								}else{
									$("#"+endorser.slot).val(endorser.endorser);
									$("#"+endorser.slot).parent().css('background-color','rgba(255, 255, 255, 0.8)')
								}
							}else{
								$("#"+endorser.slot).val('');
								$("#"+endorser.slot).parent().css('background-color','#ad717b')
							}
							
						})
					}else{
						$("."+selector).val('');
						$("."+selector).parent().css('background-color','#ad717b')
					}
				})
			});
			
		}else{
			getDataRecord('/api/endorser/get/'+week,function(data){
				if(data.length>0){
					var endorsers=JSON.parse(data[0].endorsers_data);
					//console.log(endorsers);
					endorsers.forEach(function(endorser){
						//console.log(endorser);
						getDataRecord("/api/users/CES/"+endorser.endorser+"/A",function(user){
							if(user.length>0){
								//console.log(user);
								$("#"+(endorser.slot).substr(0,5)+ " .endorser_name").html(user[0].users_alias);
								if(user[0].users_alias==user.users_alias){
									//console.log(user.users_alias);
									$("#"+(endorser.slot).substr(0,5)).css('background-color','#75c98b')
								}else{
									$("#"+(endorser.slot).substr(0,5)).css('background-color','rgba(255, 255, 255, 0.8)')
								}
							}else{
								$("#"+(endorser.slot).substr(0,5)+ " .endorser_name").html("None");
								$("#"+(endorser.slot).substr(0,5)).css('background-color','#ad717b')
							}
	
						})
					})
				}else{
					$('.endorser_name').html('None');
					$('.endorser_name').parent().css('background-color','#ad717b')
				}
			})
		}
	
}

function saveEndorserSchedule(selector,week){
	var endorsersElements=$('.'+selector).map(function(){
		return {slot:$(this).attr('id'),endorser:$(this).val()};
	}).get();
	
	data={
		week:week,
		endorser:endorsersElements
	}
	console.log(data);
	getDataRecord("/api/endorser/get/"+week,function(schedule){
		console.log(schedule);
		if(schedule.length>0){
			$.ajax({
				type:"POST",
				url:"/api/endorser/update" ,
				data:JSON.stringify(data),
				headers:{
					"Content-Type":"application/json"
				},
				//dataType:"json",
				success:function(data){
					//console.log(data);
				},
				error:function(error){
				}
			});
		}else{
			$.ajax({
				type:"POST",
				url:"/api/endorser/add" ,
				data:JSON.stringify(data),
				headers:{
					"Content-Type":"application/json"
				},
				//dataType:"json",
				success:function(data){
					//console.log(data);
				},
				error:function(error){
					console.log(error)
				}
			});
		}
	})
}

function getSundays(month,callback){
	var d = new Date('2020',month-1);
	console.log(d);
	var getTot = daysInMonth(d.getMonth(),d.getFullYear()); //Get total days in a month
	var sun = new Array();   //Declaring array for inserting Sundays

	for(var i=1;i<=getTot;i++){    //looping through days in month
		var newDate = new Date(d.getFullYear(),d.getMonth(),i)
		if(newDate.getDay()==0){   //if Sunday
			sun.push(i);
		}
	}
	if(callback)
		callback(sun)
	else
		return sun
}



function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function generateEscalationReport(month){
	var reasons=[
		"Incorrect Tagging",
		"Did not download doorbell logs/BS Logs",
		"Did not follow Call handler/TS guidelines",
		"Did not escalate for Issue attachment",
		"Inaccurate TS Recommendation or Resolution",
		"Inaccurate/Unclear Case Documentation",
		"Delayed Escalation",
		"Did not processed callback nor endorsed for callback",
		"Did not follow escalation process",
		"Did not escalate to L2",
		"Providing Wrong Information",
		"Did Not follow the RMA process",
		"Closing Case without resolution",
		"Incomplete case isolation",
		"Others"
	]
	var reasonsLower=[
		"incorrect tagging",
		"did not download doorbell logs/bs logs",
		"did not follow call handler/ts guidelines",
		"did not escalate for issue attachment",
		"inaccurate ts tecommendation or tesolution",
		"inaccurate/unclear case documentation",
		"delayed escalation",
		"did not processed callback nor endorsed for callback",
		"did not follow escalation process",
		"did not escalate to l2",
		"providing wrong information",
		"did not follow the rma process",
		"closing case without resolution",
		"incomplete case isolation",
		"others"
	]
	var reasonsCount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	
	var results=[];
	var otherReasons=[];
	var html,html2;
	var totalReasons=0;
	getDataRecord('/api/devices',function(devices){
		getDataRecord('/api/escalations/get',function(escalations){
			var month_escalations=escalations.filter(function(escalation){
				if(escalation.escalations_timestamp.split("/")[0]==month)
					return true;
			});
			console.log(month_escalations);
			month_escalations.forEach(function(escalation){
				totalReasons++;
				if(reasonsLower.indexOf(escalation.escalations_reason.toLowerCase())==-1){
					reasonsCount[14]++;
					otherReasons.push(escalation.escalations_reason);
				}else{
					reasonsCount[reasonsLower.indexOf(escalation.escalations_reason.toLowerCase())]++
				};
			})
			console.log(reasons.length);
			console.log(reasonsCount);
			for(i=0;i<reasons.length;i++){
				results.push({reason:reasons[i],count:reasonsCount[i]})
			}
			console.log(results);
			results.sort((a, b) => (a.count > b.count) ? -1 : 1)
			console.log(results);
			html="<tr><th style='width:500px;text-align:left;background-color:rgb(169, 208, 142);border:1px solid black'>Feedback Summary</th><th style='width:100px;background-color:rgb(169, 208, 142);border:1px solid black'>Count</th></tr>"
			results.forEach(function(result){
				html+="<tr><td>"+result.reason+"</td><td style='text-align:center'>"+result.count+"</td></tr>";
			})
			html+="<tr style='background-color:rgb(169, 208, 142);border:1px solid black;'><th style='text-align:left'>Total</th><th>"+totalReasons+"</th></tr>"

			html2="<tr><th style='width:500px;text-align:left;background-color:rgb(169, 208, 142);border:1px solid black'>Other Reasons</th></tr>"
			otherReasons.forEach(function(result){
				html2+="<tr><td style='border:1px solid black'>"+result+"</td></tr>";
			})
			myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=800,top="+0+",right="+100);
			myWindow.document.head.innerHTML = "<title>Invalid Escalation Report"+ 
			'</title><link rel="stylesheet" href="/assets/js/json-viewer/jquery.json-viewer.css"/><link rel="stylesheet" href="/assets/css/carousel.css"/><link rel="stylesheet" href="/assets/css/index.css"/><link rel="stylesheet" href="/assets/font/css/all.css"/><link rel="stylesheet" href="/assets/font/css/fontawesome.css"/><link rel="stylesheet" href="/assets/font/css/solid.css"/><link rel="stylesheet" href="/assets/js/jqueryui/jquery-ui.css"/><link rel="stylesheet" href="/assets/css/dropdown.css"/><link rel="stylesheet" href="/assets/css/arleebird.css"/><link rel="stylesheet" href="/assets/js/charts/Chart.css"/><link rel="stylesheet" href="/assets/css/chat.css"/>'+
			'<script src="/assets/js/jquery-3.4.1.min.js"></script><script src="/assets/js/socket/socket.io.js"></script><script src="/assets/js/createjs-2013.09.25.min.js"></script><script src="/assets/js/ndgmr.Collision.js"></script><script src="/assets/js/arleebird.js"></script><script src="/assets/js/dropdown.js"></script><script src="/assets/js/charts/Chart.js"></script><script src="/assets/js/jquery.mark.min.js"></script><script src="/assets/js/jqueryui/jquery-ui.js"></script><script src="/assets/js/main.js"></script><script src="/assets/js/pako.min.js"></script><script src="/assets/js/logfilereader.js"></script><script src="/assets/js/json-viewer/jquery.json-viewer.js"></script><script src="/assets/js/goalseek.js"></script>';
			
			myWindow.document.body.innerHTML = "<table style='border-collapse:collapse;border:1px solid black;'>"+html+"</table>"+
			"<table style='border-collapse:collapse;border:1px solid black;'>"+html2+"</table>"+
			'<canvas id="reasonsChart" width="100%" style="max-width:100%!important;max-height:400px!important;min-height:100px!important;"></canvas>';
			myWindow.document.body.onload = function(){
				reasonsChart.update();
			}
				var ctx = myWindow.document.getElementById('reasonsChart').getContext('2d');
				console.log(reasonsCount);
				var reasonsChart = new Chart(ctx, {
					type: 'pie',
					data: {
						labels: reasons,
						datasets: [{
							label: 'Feedback',
							data: reasonsCount,
						}]
					},
					options: {
						
						title: {
							display:true,
							text: 'Feedback',
						},
						plugins:{
							labels:{
								render: 'label',
							}
						}
					}
				});
				setTimeout(function(){reasonsChart.update();},1000);
				myWindow.focus();
				
			
			
		});
	});
}

function displaySMEEOS(){
	console.log(localStorage);
	$('#SMEEOSCallHandled_total').html(parseInt(localStorage.getItem('SMEEOSCallHandled_total'))>0?parseInt(localStorage.getItem('SMEEOSCallHandled_total')):0);
	$('#SMEEOSEscalatedHandled_total').html(parseInt(localStorage.getItem('SMEEOSEscalatedHandled_total'))>0?parseInt(localStorage.getItem('SMEEOSEscalatedHandled_total')):0);
	$('#SMEEOSEndorsementsHandled_total').html(parseInt(localStorage.getItem('SMEEOSEndorsementsHandled_total'))>0?parseInt(localStorage.getItem('SMEEOSEndorsementsHandled_total')):0);
	$('#SMEEOSCallFollowup_total').html(parseInt(localStorage.getItem('SMEEOSCallFollowup_total'))>0?parseInt(localStorage.getItem('SMEEOSCallFollowup_total')):0);
	$('#SMEEOSCoached_total').html(parseInt(localStorage.getItem('SMEEOSCoached_total'))>0?parseInt(localStorage.getItem('SMEEOSCoached_total')):0);
	$('#SMEEOSLab_total').html(parseInt(localStorage.getItem('SMEEOSLab_total'))>0?parseInt(localStorage.getItem('SMEEOSLab_total')):0);
	$('#SMEEOSTransfer_total').html(parseInt(localStorage.getItem('SMEEOSTransfer_total'))>0?parseInt(localStorage.getItem('SMEEOSTransfer_total')):0);
	$('#SMEEOSEmail_total').html(parseInt(localStorage.getItem('SMEEOSEmail_total'))>0?parseInt(localStorage.getItem('SMEEOSEmail_total')):0);

	$('#SMEEOSCallHandled_details').html(localStorage.getItem('SMEEOSCallHandled_details'));
	$('#SMEEOSEscalatedHandled_details').html(localStorage.getItem('SMEEOSEscalatedHandled_details'));
	$('#SMEEOSEndorsementsHandled_details').html(localStorage.getItem('SMEEOSEndorsementsHandled_details'));
	$('#SMEEOSCallFollowup_details').html(localStorage.getItem('SMEEOSCallFollowup_details'));
	$('#SMEEOSCoached_details').html(localStorage.getItem('SMEEOSCoached_details'));
	$('#SMEEOSLab_details').html(localStorage.getItem('SMEEOSLab_details'));
	$('#SMEEOSTransfer_details').html(localStorage.getItem('SMEEOSTransfer_details'));
	$('#SMEEOSEmail_details').html(localStorage.getItem('SMEEOSEmail_details'));
}

function addLocalSMEEOS(element){
	localStorage.setItem(element + "_total",parseInt($("#"+element+ "_total").html()));
	localStorage.setItem(element + "_details",$("#"+element+ "_details").html());
}

function addToSMEEOS(element,mode){
	if(mode==0){
		if($('#SMEEOS_casenum').val()!=""){
			$("#"+element.attr("id").split("_")[0] + "_total").html(parseInt($("#"+element.attr("id").split("_")[0] + "_total").html())+1)
			$("#"+element.attr("id").split("_")[0] + "_details").append("<div id='"+element.attr("id").split("_")[0] +"_"+ $('#SMEEOS_casenum').val() +"';>"+$('#SMEEOS_casenum').val()+ " " + $('#SMEEOS_remarks').val() +"<i class='fa fa-times tooltip' style='font-size:12px;color:red;cursor: pointer;' onclick=$('#"+element.attr("id").split("_")[0] +"_"+ $('#SMEEOS_casenum').val() +"').remove();$('#"+element.attr('id').split('_')[0] + "_total').html(parseInt($('#"+element.attr('id').split('_')[0] + "_total').html())-1);addLocalSMEEOS('"+element.attr('id').split('_')[0] +"');></i></div>");
			addLocalSMEEOS(element.attr("id").split("_")[0]);
			$('#SMEEOS_casenum').val("");
			$('#SMEEOS_remarks').val("");
		}
	}else{
		if(parseInt(parseInt($("#"+element.attr("id").split("_")[0] + "_total").html())+mode)<0){
			$("#"+element.attr("id").split("_")[0] + "_total").html("0");
			addLocalSMEEOS(element.attr("id").split("_")[0]);
		}else{
			$("#"+element.attr("id").split("_")[0] + "_total").html(parseInt($("#"+element.attr("id").split("_")[0] + "_total").html())+mode)
			addLocalSMEEOS(element.attr("id").split("_")[0]);
		}
	}
}

function resetSMEEOS(){
	$('#SMEEOS_total').children().each(function(element){
		localStorage.setItem($(this).attr("id"),0)
		$(this).html("0");
	})
	$('#SMEEOS_details').children().each(function(element){
		$(this).html("");
		localStorage.setItem($(this).attr("id"),"")
	})
}

function saveSMEEOS(){
	var dateNow=new Date();
	var checkDate=(dateNow.getMonth()+1)+"-"+dateNow.getDate()+"-"+dateNow.getFullYear()
	data = {
		ces:userCES,
		date:checkDate,
		data:{
			SMEEOSCallHandled_total:localStorage.getItem("SMEEOSCallHandled_total"),
			SMEEOSEscalatedHandled_total:localStorage.getItem("SMEEOSEscalatedHandled_total"),
			SMEEOSEndorsementsHandled_total:localStorage.getItem("SMEEOSEndorsementsHandled_total"),
			SMEEOSCallFollowup_total:localStorage.getItem("SMEEOSCallFollowup_total"),
			SMEEOSCoached_total:localStorage.getItem("SMEEOSCoached_total"),
			SMEEOSLab_total:localStorage.getItem("SMEEOSLab_total"),
			SMEEOSTransfer_total:localStorage.getItem("SMEEOSTransfer_total"),
			SMEEOSEmail_total:localStorage.getItem("SMEEOSEmail_total"),
			SMEEOSCallHandled_details:localStorage.getItem("SMEEOSCallHandled_details"),
			SMEEOSEscalatedHandled_details:localStorage.getItem("SMEEOSEscalatedHandled_details"),
			SMEEOSEndorsementsHandled_details:localStorage.getItem("SMEEOSEndorsementsHandled_details"),
			SMEEOSCallFollowup_details:localStorage.getItem("SMEEOSCallFollowup_details"),
			SMEEOSCoached_details:localStorage.getItem("SMEEOSCoached_details"),
			SMEEOSLab_details:localStorage.getItem("SMEEOSLab_details"),
			SMEEOSTransfer_details:localStorage.getItem("SMEEOSTransfer_details"),
			SMEEOSEmail_details:localStorage.getItem("SMEEOSEmail_details")
		}
	}
	$.ajax({
		type:"POST",
		url:"/api/SMEEOS/save" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			console.log(data);
		},
		error:function(error){
			console.log(error);
		}
	});
}

function generateL2Text(){
	var rdparty=$('#l2esca_3rdparty').val();
	rdparty=rdparty.replace('\r', '&nbsp;').replace('\n', '<br>');
	var network=$('#l2esca_network').val();
	network=network.replace('\r', '&nbsp;').replace('\n', '<br>');
	var issuedesc=$('#l2esca_issuedesc').val();
	issuedesc=issuedesc.replace('\r', '&nbsp;').replace('\n', '<br>');
	var steps=$('#l2esca_steps').val();
	steps=steps.replace('\r', '&nbsp;').replace('\n', '<br>');
	var history=$('#l2esca_history').val();
	history=history.replace('\r', '&nbsp;').replace('\n', '<br>');

	myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+0+",right="+100);

	myWindow.document.head.innerHTML = "<title>Case Standard Template</title><style>.hiddenDiv{display:none}</style>"
	myWindow.document.body.innerHTML = "<div style='white-space: pre-wrap;'><pre>"+
	"Arlo account Email: " + $('#l2esca_email').val() + "<br>" +
	"Affected device: " + $('#l2esca_device').val() + "<br>" +
	"Device Type/Firmware version (BS/Camera): " + $('#l2esca_type').val() + "<br>" +
	"iOS/Android/Web - model/version/OS: " + $('#l2esca_access').val() + "<br>" +
	"Minimum upload download speed: " + $('#l2esca_dlul').val() + "<br>" +
	"3rd Party device details (apps/routers/etc..): <br>" + rdparty + "<br>" +
	"Network Topology Example: <br>" + network + "<br>" + 
	"Issue Description: <br>" + issuedesc + "<br>" +
	"Steps to reproduce the issue: <br>" + steps + "<br>" +
	"History of the problem: <br>" + history + "<br>" +
	"All logs/screenshot/library recording: " + $('#l2esca_logs').val() + "<br>" +
	"RMA History: " + $('#l2esca_rma').val() + "<br>" +
	"Other: " + $('#l2esca_other').val() + "<pre></div>" +
	$('#l2subtemplates_div').html()


	myWindow.focus();
}