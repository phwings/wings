var numsCCT;
var chatChatCCTConsultOpen=false;
var expertAvail;
var cctQueue;
var chatsOpen=0;
var chatSession=["",""];
function resetDOMCCT(divSelector) {
	console.log(divSelector)
	numsCCT = document.querySelectorAll('#chatFormChatCCTConsult'+divSelector+' #chatCCTCountdown'+divSelector+' .numsCCT span');
	$('#chatFormChatCCTConsult'+divSelector+' #chatCCTCountdown'+divSelector).addClass('hiddenDiv');
	$('#chatFormChatCCTConsult'+divSelector+' #chatCCTCountdown'+divSelector+' .counterCCTCountdown').removeClass('hide');
    
	numsCCT.forEach(num => {
		num.classList.value = '';
	});
	console.log(divSelector);
	numsCCT[0].classList.add('in');
	
}

function runAnimationCCT(divSelector) {
	if((userLOB=="CCT ARLO")||(userLOB=="CCT IOPEX")||(userLOB=="CCT/OS ARLO")){
		allocate('chatFormChatCCTConsult'+divSelector,1);
	}else{
		$('#chatFormChatCCTConsultQueue').addClass('hiddenDiv');
	}
	$('#chatFormChatCCTConsult'+divSelector).removeClass('hiddenDiv');
	numsCCT = document.querySelectorAll('#chatFormChatCCTConsult'+divSelector+' #chatCCTCountdown'+divSelector+' .numsCCT span');
	console.log(numsCCT);
	numsCCT.forEach((num, idx) => {
		const penultimate = nums.length - 1;
		num.addEventListener('animationend', (e) => {
			if(e.animationName === 'goIn' && idx !== penultimate){
				num.classList.remove('in');
				num.classList.add('out');
			} else if (e.animationName === 'goOut' && num.nextElementSibling){
				num.nextElementSibling.classList.add('in');
			} else {
				resetDOMCCT(divSelector);
				$('#chatFormChatCCTConsult'+divSelector+' #chatCCTCountdown'+divSelector+' .counterCCTCountdown').addClass('hide');
				$('#chatFormChatCCTConsult'+divSelector+' #chatCCTCountdown'+divSelector).addClass('hiddenDiv');
				//$('#chatFormChatCCTConsult'+divSelector).removeClass('hiddenDiv');
				
				$('#formChatCCTConsult'+divSelector).removeClass('hiddenDiv');
			}
		});
	});
}

function L1chatCCTConsultQueue(casenumber,inquiry){
	if((casenumber=="")||(inquiry=="")){
		$('#cctchatconsulterror').removeClass("hiddenDiv");
		setTimeout(function(){
			$('#cctchatconsulterror').addClass("hiddenDiv");
		},5000);
	}else{
		socket.emit('chatcctconsult enqueue',userCN,userID,casenumber,inquiry);
		$('#CCTconsult-info').addClass('hiddenDiv');
		$('#chatCCTQueue').removeClass('hiddenDiv');
	}
}

function cctconsultchange(status){
	if(status){
		expertAvail=true;
		socket.emit('chatcctconsult cctavail',userCN,userID,userCES,'avail');
		
		if($('#chatFormChatCCTConsultQueue').hasClass('hiddenDiv')){
			allocate('chatFormChatCCTConsultQueue',1);
			$('#chatFormChatCCTConsultQueue').removeClass('hiddenDiv');
			chatChatCCTConsultOpen=true;
		}
		if($('#roomnameCCTConsult').html()==""){
			$('#chatCCTQueue').removeClass('hiddenDiv');
			$('#formChatCCTConsult').addClass('hiddenDiv');
			$('#chatBadgeChatCCTConsult').addClass('hiddenDiv');
			chatCounterCCTConsult=0;
		}else{
			$('#chatCCTQueue').addClass('hiddenDiv');
			$('#formChatCCTConsult').removeClass('hiddenDiv');
		}
		if(cctQueue>0)
			$('#getCCTconsult_div').removeClass('hiddenDiv');
		else
			$('#getCCTconsult_div').addClass('hiddenDiv');
	}else{
		expertAvail=false;
		$('#getCCTconsult_div').addClass('hiddenDiv');
		//chatChatCCTConsultOpen=false;
		//$('#chatFormChatCCTConsultQueue').css('display','none');
		socket.emit('chatcctconsult cctavail',userCN,userID,userCES,'unavail');
		if(chatCounterCCTConsult>0)
			$('#chatBadgeChatCCTConsult').removeClass('hiddenDiv');
	}
}

function getChatCCTConsult(){
	socket.emit('chatcctconsult getcctconsult',userCN,userID);
}

function init_roomCCT(room,participants,casenumber,inquiry){
	
	console.log(chatSession);
	var roomWindow;
	if((userLOB=="CCT ARLO")||(userLOB=="CCT IOPEX")||(userLOB=="CCT/OS ARLO")){
		if(chatSession[0]==""){
			chatSession[0]=room;
			roomWindow=1;
		}
		else if(chatSession[1]==""){
			chatSession[1]=room;
			roomWindow=2;
		}
		chatsOpen++;
		if(chatsOpen==2)
			socket.emit('chatcctconsult cctavail',userCN,userID,userCES,'unavail');
	}else{
		roomWindow="";
	}
	console.log(roomWindow+" "+casenumber+" "+inquiry);
	console.log(chatSession);
	console.log(roomWindow);
	resetDOMCCT(roomWindow);
	runAnimationCCT(roomWindow);
	$('#chatCCTCountdown'+roomWindow+' #room_CCTconsult').html('').html("<b>Creating room</b>: "+room);
	$('#chatCCTCountdown'+roomWindow+' #casenumber_CCTconsult').html('').html("<b>Case Number</b>: "+casenumber);
	$('#chatCCTCountdown'+roomWindow+' #inquiry_CCTconsult').html('').html("<b>Inquiry</b>: "+inquiry);
	//$('#chatCCTQueue').addClass('hiddenDiv');
	
	$('#chatCCTCountdown'+roomWindow).removeClass('hiddenDiv');
	
	$('#formChatCCTConsult'+roomWindow+' #roomnameCCTConsult').html(room);
	var room_members=JSON.parse(participants);

	//console.log(data);
	$('#formChatCCTConsult'+roomWindow+' #messagesChatCCTConsult').html('');

	$('#formChatCCTConsult'+roomWindow+' #messagesChatCCTConsult').append($('<li>').html('<b>Case Number</b><br><span class="chat_text">'+casenumber+'</span>'));
	$('#formChatCCTConsult'+roomWindow+' #messagesChatCCTConsult').append($('<li>').html('<b>Inquiry</b><br><span class="chat_text">'+inquiry+'</span>'));

	//
	//daEach(element => {
		//console.log(element);
	//});
}

function endCCTConsult(room){
	chatsOpen--;
	if((userLOB=="CCT ARLO")||(userLOB=="CCT IOPEX")||(userLOB=="CCT/OS ARLO")){
		if(chatSession[0]==room){
			chatSession[0]="";
			roomWindow=1;
		}
		else if(chatSession[1]==room){
			chatSession[1]="";
			roomWindow=2;
		}
		if(chatsOpen<2)
			socket.emit('chatcctconsult cctavail',userCN,userID,userCES,'avail');
	}else{
		roomWindow="";
	}
	
	console.log(room);
	socket.emit('chatcctconsult closeroom',room);
	if((userLOB=='CCT ARLO')||(userLOB=='CCT IOPEX')||(userLOB=='CCT/OS ARLO')){
		if(chatsOpen!=0)
			socket.emit('chatcctconsult cctavail',userCN,userID,userCES,'avail');
		$('#formChatCCTConsult'+roomWindow).addClass('hiddenDiv');
		$('#chatFormChatCCTConsult'+roomWindow).addClass('hiddenDiv');
		$('#formChatCCTConsult'+roomWindow+' #roomnameCCTConsult').html("");
	}else{
		$('#chatFormChatCCTConsult').addClass('hiddenDiv');
		$('#formChatCCTConsult').addClass('hiddenDiv');
		$('#CCTconsult-info').removeClass('hiddenDiv');
		$('#chatCCTQueue').addClass('hiddenDiv');
		$('#consultCCT_CN').val('');
		$('#consultCCT_inquiry').val('');
		$('#roomnameCCTConsult').html("");
		chatChatCCTConsultOpen=false;
	}
	allocate('chatFormChatCCTConsult'+roomWindow,0);
}

function getCCTTranscript(room){
	socket.emit('chatcctconsult gettranscript',room);
}

function getCCTTranscriptFile(room){
	$.ajax({
		url:'/chatcctconsults/'+room+'.txt',
		success: function (data){
			showCCTTranscript(data);console.log('found');
		},
		error: function(xhr,status,error){
			console.log(error);
		}
	});
	showCCTTranscript(room);
}

function showCCTTranscript2(transcript){
	console.log(transcript);
	var htmlContent='';
	
//	var intlDateObj = new Intl.DateTimeFormat('en-US', { 
//		timeZone: "America/Los_Angeles",day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
//	}); 
	var content=transcript.split('#%#');
	content.splice(content.length-1,1);
	content.forEach(function(line){
		lineArray=line.split('###');
		console.log(lineArray);
		casenumber=lineArray[2];
		if(lineArray.length>3){
			//var dateString = intlDateObj.format(new Date(Math.floor(lineArray[1]))); 
			var dateString=(new Date(Math.floor(lineArray[1]))).toLocaleString('en-US', {timeZone: "America/Los_Angeles",day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
			htmlContent+="Room: "+lineArray[0]+"<br>Session Start:"+dateString+" PST<br>Case Number: <span id='casenumber'>"+lineArray[2]+"</span><br>Inquiry: "+lineArray[3]+"<br>";
		}else{
			//var dateString = intlDateObj.format(new Date(Math.floor(lineArray[1]))); 
			var dateString=(new Date(Math.floor(lineArray[0]))).toLocaleString('en-US', {timeZone: "America/Los_Angeles",day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
			htmlContent+="<br>"+dateString+" PST <b>"+lineArray[1]+":</b> <br>"+lineArray[2]+"<br>";
		}
	})

	console.log(transcript);
	myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+0+",right="+100);
	var theScript = document.createElement('script');
	myWindow.document.head.innerHTML = "<head><title>Chat Consult Transcript</title>"

	function saveTextAsFile(){
		var textDownload=document.getElementById("transcript").innerHTML.replace(/<br>/gi,'\n').replace(/<b>/gi,'').replace(/<\/b>/gi,'').replace(/<\/span>/gi,'').replace(/<span id="casenumber">/gi,'');

		var textFileAsBlob = new Blob([textDownload], {type:'text/plain'}); 
		var downloadLink = document.createElement("a");
		downloadLink.download = document.getElementById("casenumber").innerHTML;
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
	};

	function copyToCB() {
		var textDownload=document.getElementById("transcript").innerHTML.replace(/<br>/gi,'\n').replace(/<b>/gi,'').replace(/<\/b>/gi,'').replace(/<\/span>/gi,'').replace(/<span id="casenumber">/gi,'');
		var tempInput = document.createElement("textarea");
		tempInput.style = "position: absolute; left: -1000px; top: -1000px";
		tempInput.value = textDownload;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand("copy");
		document.body.removeChild(tempInput);
	}
	theScript.innerHTML = saveTextAsFile.toString() + ';' +copyToCB.toString() + ';';
	myWindow.document.body.innerHTML = '<button onclick="copyToCB()">Copy to Clipboard</button><button onclick="saveTextAsFile()">Download</button><br><br>';
	myWindow.document.body.innerHTML += '<pre id="transcript">'+htmlContent+'</pre>';
	
	myWindow.document.body.appendChild(theScript);
	myWindow.focus();

}

function showCCTTranscript(transcript){
	console.log(transcript);
	myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+0+",right="+100);
	var theScript = document.createElement('script');
	myWindow.document.head.innerHTML = "<head><title>Chat Consult Transcript</title>"

	function saveTextAsFile(){
		var textDownload=document.getElementById("transcript").innerHTML.replace(/<br>/gi,'\n').replace(/<b>/gi,'').replace(/<\/b>/gi,'').replace(/<\/span>/gi,'').replace(/<span id="casenumber">/gi,'');

		var textFileAsBlob = new Blob([textDownload], {type:'text/plain'}); 
		var downloadLink = document.createElement("a");
		downloadLink.download = document.getElementById("casenumber").innerHTML;
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
	};

	function copyToCB() {
		var textDownload=document.getElementById("transcript").innerHTML.replace(/<br>/gi,'\n').replace(/<b>/gi,'').replace(/<\/b>/gi,'').replace(/<\/span>/gi,'').replace(/<span id="casenumber">/gi,'');
		var tempInput = document.createElement("textarea");
		tempInput.style = "position: absolute; left: -1000px; top: -1000px";
		tempInput.value = textDownload;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand("copy");
		document.body.removeChild(tempInput);
	}
	theScript.innerHTML = saveTextAsFile.toString() + ';' +copyToCB.toString() + ';';
	myWindow.document.body.innerHTML = '<button onclick="copyToCB()">Copy to Clipboard</button><button onclick="saveTextAsFile()">Download</button><br><br>';
	myWindow.document.body.innerHTML += '<pre id="transcript">'+transcript+'</pre>';
	
	myWindow.document.body.appendChild(theScript);
	myWindow.focus();
}

function updateCCTRoom(room, transcript){
	data={
		room:room,
		endtime:(new Date()).getTime(),
		transcript:transcript
	}
	console.log(data);
	try{
		$.ajax({
			type:"POST",
			url:"/api/chatcctconsults/update" ,
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
	}catch(error){
		console.log(error)
	}
}

function saveChatCCTConsult(timestamp,room,L2,expert,casenumber,inquiry){
	data={
		timestamp:timestamp,
		room:room,
		L2:L2,
		expert:expert,
		casenumber:casenumber,
		inquiry:inquiry
	}
	console.log(data);
	$.ajax({
		type:"POST",
		url:"/api/chatcctconsults/add" ,
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

function populateChatCCTConsults(){
	getDataRecord("/api/chatcctconsults/get",function(consults){
		console.log(consults);
		//$('#chatconsults_table').css('display','none');
		$("#chatcctconsults_table").html('<thead style="text-align:center;font-weight:bold;cursor: pointer;"><tr><td onclick="sortTable(&quot;consult_table&quot;,0)">Date</td><td onclick="sortTable(&quot;consult_table&quot;,1)">L2</td><td onclick="sortTable(&quot;consult_table&quot;,2)">Expert</td><td onclick="sortTable(&quot;consult_table&quot;,3)">Case Number</td><td onclick="sortTable(&quot;consult_table&quot;,4)">Inquiry</td><td onclick="sortTable(&quot;consult_table&quot;,5)">Transcript</td><td onclick="sortTable(&quot;consult_table&quot;,6)">Duration</td></tr></thead><tbody>');
		consults.forEach(function(data){
			var transcriptArray=data.chatcctconsults_transcript.split('#%#');
			var firstArray=transcriptArray[0].split('###');
			var showHtml='Date/Time: '+(new Date(Math.floor(firstArray[1]))).toLocaleString('en-US', {timeZone: "America/Los_Angeles", day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})+' PST<br>';
			showHtml+='Case Number: <span id=casenumber>'+(firstArray[2]==undefined?'':firstArray[2])+'</span><br>Inquiry: '+(firstArray[3]==undefined?'':firstArray[3].replace(/\n/gi,"<br>").replace(/\r/gi,"<br>").replace(/\'/gi,"\`").replace(/\"/gi,"\`"))+'<br><br>'
			transcriptArray.splice(0,1);
			transcriptArray.splice(transcriptArray.length-1,1);
			transcriptArray.forEach(function(line){
				var lineArray=line.split('###');
				showHtml+=(new Date(Math.floor(lineArray[0]))).toLocaleString('en-US', {timeZone: "America/Los_Angeles", day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})+` PST <b>`+lineArray[1].replace(/\'/gi,"\`").replace(/\"/gi,"\`")+`</b><br>`+lineArray[2].replace(/\n/gi,"<br>").replace(/\r/gi,"<br>").replace(/\'/gi,"\`").replace(/\"/gi,"\`")+`<br>`;
			});
			console.log(data);
			var dateString=(new Date(Math.floor(data.chatcctconsults_timestamp))).toLocaleString('en-US', {timeZone: "America/Los_Angeles", day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
			var seconds=data.chatcctconsults_endtime-data.chatcctconsults_timestamp;
				console.log(seconds);
				if(seconds>0){
					hours=(Math.floor(seconds/3600000))<10?'0'+(Math.floor(seconds/3600000)).toString():(Math.floor(seconds/3600000)).toString();
					mins=(Math.floor(seconds/60000))<10?'0'+(Math.floor(seconds/60000)).toString():(Math.floor(seconds/60000)).toString();
					secs=(Math.floor(seconds/1000)%60)<10?'0'+(Math.floor(seconds/1000)%60).toString():(Math.floor(seconds/1000)%60).toString();
					console.log(hours);
					if(isNaN(parseInt(hours)))
						hours='00';
				}else{
					hours=0;
					mins=0;
					secs=0;
				}
			html="<tr id='cctconsults_" + data.chatcctconsults_id + "'>" +
				"<td> "+ dateString +" PST</td>" +
				"<td id='L2_"+ data.chatcctconsults_id +"'>"+data.chatcctconsults_L2+"</td>" +
				"<td id='L1_"+ data.chatcctconsults_id +"'>"+data.chatcctconsults_expert+"</td>" +
				"<td>" + data.chatcctconsults_casenumber + "</td> " +
				"<td><custom style=' white-space: pre-wrap;'>" + data.chatcctconsults_inquiry.replace(/[\n]/g,"<br style='mso-data-placement:same-cell;' />") + "</custom></td> " +
				'<td><a href="#" onclick=showCCTTranscript("'+showHtml+'");>' + data.chatcctconsults_room + '</a></td> ' +
				"<td> "+ hours +":"+ mins + ":" + secs + "</td>" +
				"</tr>";
			$("#chatcctconsults_table").append(html);
			


		})
		
	})
}

function closeFormChatCCTConsult() {
	console.log('close form')
	chatChatCCTConsultOpen=false;
	$('#chatFormChatCCTConsultQueue').addClass('hiddenDiv');
	socket.emit('chatcctconsult cancel');
	$('#consultCCT_CN').val('');
	$('#consultCCT_inquiry').val('');
	$('#CCTconsult-info').removeClass('hiddenDiv');
	$('#chatCCTQueue').addClass('hiddenDiv');
	if(chatChatConsultOpen){
		$('#chatFormChatConsultQueue').css('right','10px')
	}
}

function openFormChatCCTConsult() {
	console.log(chatChatConsultOpen);
	
	if(chatChatCCTConsultOpen){
		closeFormChatCCTConsult();
	}else{
		if(chatChatConsultOpen){
			$('#chatFormChatCCTConsultQueue').css('right','250px')
		}else{
			$('#chatFormChatCCTConsultQueue').css('right','10px')
		}
		chatChatCCTConsultOpen=true;
		$('#chatFormChatCCTConsultQueue').removeClass('hiddenDiv');
		if($('#roomnameCCTConsult').html()==""){
			$('#CCTconsult-info').removeClass('hiddenDiv');
			$('#chatCCTQueue').addClass('hiddenDiv');
			$('#formChatCCTConsult').addClass('hiddenDiv');
		}else{
			$('#CCTconsult-info').addClass('hiddenDiv');
			$('#chatCCTQueue').addClass('hiddenDiv');
			$('#formChatCCTConsult').removeClass('hiddenDiv');
		}
	}
}

function closeFormChatCCTConsultQueue() {
	console.log('close form')
	chatChatCCTConsultOpen=false;
	allocate('chatFormChatCCTConsultQueue',0);
	$('#chatFormChatCCTConsultQueue').addClass('hiddenDiv');
	socket.emit('chatcctconsult cancel');
	$('#chatCCTQueue').addClass('hiddenDiv');
}

function openFormChatCCTConsultQueue() {
	console.log(chatOpen);
	
	if(chatChatCCTConsultOpen){
		closeFormChatCCTConsultQueue();
	}else{
		chatChatCCTConsultOpen=true;
		allocate('chatFormChatCCTConsultQueue',1);
		$('#chatFormChatCCTConsultQueue').removeClass('hiddenDiv');
		if($('#roomnameCCTConsult').html()==""){
			$('#chatCCTQueue').removeClass('hiddenDiv');
			$('#formChatCCTConsult').addClass('hiddenDiv');
		}else{
			$('#chatCCTQueue').removeClass('hiddenDiv');
			$('#formChatCCTConsult').removeClass('hiddenDiv');
		}
	}
}

function allocate(divWindow, mode){
	console.log(window_slot);
	console.log(mode);
	if(mode==1){
		for(i=0;i<window_slot.length;i++){
			if(!window_slot[i].occupied){
				window_slot[i].dom=divWindow;
				window_slot[i].occupied=true;
				$('#'+divWindow).css('right',window_location[i]);
				$('#'+divWindow).removeClass('hiddenDiv');
				break;
			}
		}
	}else{
		var m=window_slot.length;
		console.log(divWindow);
		for(i=0;i<m;i++){
			console.log(window_slot[i].dom);
			if(window_slot[i].dom==divWindow){
				console.log(i);
				console.log("splicing");
				window_slot.splice(i,1);
				window_slot.push({occupied:false,dom:""})
			}
			if(window_slot[i].occupied){
				$('#'+window_slot[i].dom).css('right',window_location[i]);
				console.log('Setting '+'#'+window_slot[i].dom+' to '+window_location[i]);
			}
		}
		console.log(window_slot);
	}
}