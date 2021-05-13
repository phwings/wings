var nums;
var chatChatConsultOpen=false;
var expertAvail;
var chatQueue;
var chatsOpen=0;
var chatSession=["",""];
function resetDOM(divSelector) {
	console.log(divSelector)
	nums = document.querySelectorAll('#chatFormChatConsult'+divSelector+' #chatCountdown'+divSelector+' .nums span');
	$('#chatFormChatConsult'+divSelector+' #chatCountdown'+divSelector).addClass('hiddenDiv');
	$('#chatFormChatConsult'+divSelector+' #chatCountdown'+divSelector+' .counterCountdown').removeClass('hide');
    
	nums.forEach(num => {
		num.classList.value = '';
	});
	console.log(divSelector);
	nums[0].classList.add('in');
}

function runAnimation(divSelector) {
	console.log(divSelector);
	console.log(userLOB);
	if(userLOB=="L2 ARLO"){
		console.log("allocating..");
		allocateL2('chatFormChatConsult'+divSelector,1);
	}else{
		$('#chatFormChatConsultQueue').addClass('hiddenDiv');
	}
	$('#chatFormChatConsult'+divSelector).removeClass('hiddenDiv');
	$('#chatFormChatConsult'+divSelector+' #chatCountdown'+divSelector).removeClass('hiddenDiv');
	numsL2 = document.querySelectorAll('#chatFormChatConsult'+divSelector+' #chatCountdown'+divSelector+' .nums span');
	console.log(nums);
	numsL2.forEach((num, idx) => {
		const penultimate = nums.length - 1;
		num.addEventListener('animationend', (e) => {
			if(e.animationName === 'goIn' && idx !== penultimate){
				num.classList.remove('in');
				num.classList.add('out');
			} else if (e.animationName === 'goOut' && num.nextElementSibling){
				num.nextElementSibling.classList.add('in');
			} else {
				resetDOM(divSelector);
				$('#chatFormChatConsult'+divSelector+' #chatCountdown'+divSelector+' .counterCountdown').addClass('hide');
				$('#chatFormChatConsult'+divSelector+' #chatCountdown'+divSelector).addClass('hiddenDiv');
				//$('#chatFormChatCCTConsult'+divSelector).removeClass('hiddenDiv');
				
				$('#formChatConsult'+divSelector).removeClass('hiddenDiv');
			}
		});
	});
}

function L1chatConsultQueue(casenumber,inquiry){
	if((casenumber=="")||(inquiry=="")){
		$('#l2chatconsulterror').removeClass("hiddenDiv");
		setTimeout(function(){
			$('#l2chatconsulterror').addClass("hiddenDiv");
		},5000);
	}else{
		socket.emit('chatconsult enqueue',userCN,userID,casenumber,inquiry);
		$('#consult-info').addClass('hiddenDiv');
		$('#chatQueue').removeClass('hiddenDiv');
	}
}

function l2consultchange(status){
	if(status){
		expertAvail=true;
		socket.emit('chatconsult l2avail',userCN,userID,userCES,'avail');
		
		if($('#chatFormChatConsultQueue').hasClass('hiddenDiv')){
			allocateL2('chatFormChatConsultQueue',1);
			$('#chatFormChatConsultQueue').removeClass('hiddenDiv');
			chatChatConsultOpen=true;
		}
		if($('#roomnameConsult').html()==""){
			$('#chatQueue').removeClass('hiddenDiv');
			$('#formChatConsult').addClass('hiddenDiv');
			$('#chatBadgeChatConsult').addClass('hiddenDiv');
			chatCounterConsult=0;
		}else{
			$('#chatQueue').addClass('hiddenDiv');
			$('#formChatConsult').removeClass('hiddenDiv');
		}
		if(chatQueue>0)
			$('#getconsult_div').removeClass('hiddenDiv');
		else
			$('#getconsult_div').addClass('hiddenDiv');
	}else{
		expertAvail=false;
		$('#getconsult_div').addClass('hiddenDiv');
		//chatChatCCTConsultOpen=false;
		//$('#chatFormChatCCTConsultQueue').css('display','none');
		socket.emit('chatconsult l2avail',userCN,userID,userCES,'unavail');
		if(chatCounterConsult>0)
			$('#chatBadgeChatConsult').removeClass('hiddenDiv');
	}
}

function getChatConsult(){
	socket.emit('chatconsult getconsult',userCN,userID);
}

function init_room(room,participants,casenumber,inquiry){
	
	console.log(chatSession);
	var roomWindow;
	if(userLOB=="L2 ARLO"){
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
			socket.emit('chatconsult l2avail',userCN,userID,userCES,'unavail');
	}else{
		roomWindow="";
	}
	console.log(roomWindow+" "+casenumber+" "+inquiry);
	console.log(chatSession);
	console.log(roomWindow);
	resetDOM(roomWindow);
	runAnimation(roomWindow);
	$('#chatCountdown'+roomWindow+' #room_consult').html('').html("<b>Creating room</b>: "+room);
	$('#chatCountdown'+roomWindow+' #casenumber_consult').html('').html("<b>Case Number</b>: "+casenumber);
	$('#chatCountdown'+roomWindow+' #inquiry_consult').html('').html("<b>Inquiry</b>: "+inquiry);
	//$('#chatCCTQueue').addClass('hiddenDiv');
	
	$('#chatCountdown'+roomWindow).removeClass('hiddenDiv');
	
	$('#formChatConsult'+roomWindow+' #roomnameConsult').html(room);
	var room_members=JSON.parse(participants);

	//console.log(data);
	$('#formChatConsult'+roomWindow+' #messagesChatConsult').html('');

	$('#formChatConsult'+roomWindow+' #messagesChatConsult').append($('<li>').html('<b>Case Number</b><br><span class="chat_text">'+casenumber+'</span>'));
	$('#formChatConsult'+roomWindow+' #messagesChatConsult').append($('<li>').html('<b>Inquiry</b><br><span class="chat_text">'+inquiry+'</span>'));

	//
	//daEach(element => {
		//console.log(element);
	//});
}

function endConsult(room){
	chatsOpen--;
	if(userLOB=="L2 ARLO"){
		if(chatSession[0]==room){
			chatSession[0]="";
			roomWindow=1;
		}
		else if(chatSession[1]==room){
			chatSession[1]="";
			roomWindow=2;
		}
		if(chatsOpen<2)
			socket.emit('chatconsult l2avail',userCN,userID,userCES,'avail');
	}else{
		roomWindow="";
	}
	
	console.log(room);
	socket.emit('chatconsult closeroom',room);
	if(userLOB=="L2 ARLO"){
		if(chatsOpen!=0)
			socket.emit('chatconsult l2avail',userCN,userID,userCES,'avail');
		$('#formChatConsult'+roomWindow).addClass('hiddenDiv');
		$('#chatFormChatConsult'+roomWindow).addClass('hiddenDiv');
		$('#formChatConsult'+roomWindow+' #roomnameConsult').html("");
	}else{
		$('#chatFormChatConsult').addClass('hiddenDiv');
		$('#formChatConsult').addClass('hiddenDiv');
		$('#consult-info').removeClass('hiddenDiv');
		$('#chatQueue').addClass('hiddenDiv');
		$('#consult_CN').val('');
		$('#consult_inquiry').val('');
		$('#roomnameConsult').html("");
		chatChatConsultOpen=false;
	}
	allocateL2('chatFormChatConsult'+roomWindow,0);
}

function getTranscript(room){
	socket.emit('chatconsult gettranscript',room);
}

function getTranscriptFile(room){
	$.ajax({
		url:'/chatconsults/'+room+'.txt',
		success: function (data){
			showTranscript(data);
		},
		error: function(xhr,status,error){
			console.log(error);
		}
	});
	showTranscript(room);
}

function showTranscript2(transcript){
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

function showTranscript(transcript){
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

function updateRoom(room,transcript){
	data={
		room:room,
		transcript:transcript,
		endtime:(new Date()).getTime()
	}
	console.log(data);
	try{
		$.ajax({
			type:"POST",
			url:"/api/chatconsults/update" ,
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

function saveChatConsult(timestamp,room,L2,expert,casenumber,inquiry){
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
		url:"/api/chatconsults/add" ,
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

function populateChatConsults(){
	var html="";

	getDataRecord("/api/chatconsults/get",function(consults){
		console.log(consults);
		//$('#chatconsults_table').css('display','none');
		$("#chatconsults_table").html('<thead style="text-align:center;font-weight:bold;cursor: pointer;"><tr><td onclick="sortTable(&quot;consult_table&quot;,0)">Date</td><td onclick="sortTable(&quot;consult_table&quot;,1)">L2</td><td onclick="sortTable(&quot;consult_table&quot;,2)">Expert</td><td onclick="sortTable(&quot;consult_table&quot;,3)">Case Number</td><td onclick="sortTable(&quot;consult_table&quot;,4)">Inquiry</td><td onclick="sortTable(&quot;consult_table&quot;,5)">Room</td><td onclick="sortTable(&quot;consult_table&quot;,6)">Duration</td></tr></thead><tbody>');
		consults.forEach(function(data){
			//console.log(data);
			var transcriptArray=data.chatconsults_transcript.split('#%#');
			var firstArray=transcriptArray[0].split('###');
			var showHtml='Date/Time: '+(new Date(Math.floor(firstArray[1]))).toLocaleString('en-US', {timeZone: "America/Los_Angeles", day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})+' PST<br>';
			showHtml+='Case Number: <span id=casenumber>'+(firstArray[2]==undefined?'':firstArray[2])+'</span><br>Inquiry: '+(firstArray[3]==undefined?'':firstArray[3].replace(/\n/gi,"<br>").replace(/\r/gi,"<br>").replace(/\'/gi,"\`").replace(/\"/gi,"\`"))+'<br><br>'
			transcriptArray.splice(0,1);
			transcriptArray.splice(transcriptArray.length-1,1);
			transcriptArray.forEach(function(line){
				var lineArray=line.split('###');
				if(data.chatconsults_casenumber==41884907) console.log(lineArray[1]);
				showHtml+=(new Date(Math.floor(lineArray[0]))).toLocaleString('en-US', {timeZone: "America/Los_Angeles", day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})+` PST <b>`+lineArray[1].replace(/\'/gi,"\`").replace(/\"/gi,"\`")+`</b><br>`+lineArray[2].replace(/\n/gi,"<br>").replace(/\r/gi,"<br>").replace(/\'/gi,"\`").replace(/\"/gi,"\`")+`<br>`;
			});
			//console.log(data);
			var dateString=(new Date(Math.floor(data.chatconsults_timestamp))).toLocaleString('en-US', {timeZone: "America/Los_Angeles", day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
			var seconds=data.chatconsults_endtime-data.chatconsults_timestamp;
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
			html="<tr id='consults_" + data.chatconsults_id + "'>" +
				"<td> "+ dateString +" PST</td>" +
				"<td id='L2_"+ data.chatconsults_id +"'>"+data.chatconsults_L2+"</td>" +
				"<td id='L1_"+ data.chatconsults_id +"'>"+data.chatconsults_expert+"</td>" +
				"<td>" + data.chatconsults_casenumber + "</td> " +
				"<td><custom style=' white-space: pre-wrap;'>" + data.chatconsults_inquiry.replace(/[\n]/g,"<br style='mso-data-placement:same-cell;' />") + "</custom></td> " +
				`<td><a href='#' onclick='showTranscript("`+showHtml+`");'>` + data.chatconsults_room + `</a></td>` +
				"<td> "+ hours +":"+ mins + ":" + secs + "</td>" +
				"</tr>";
			$("#chatconsults_table").append(html);
		})
		
	})
}

function closeFormChatConsultQueue() {
	console.log('close form')
	chatChatConsultOpen=false;
	allocateL2('chatFormChatConsultQueue',0);
	$('#chatFormChatConsultQueue').addClass('hiddenDiv');
	socket.emit('chatconsult cancel');
	$('#chatQueue').addClass('hiddenDiv');
}

function openFormChatConsultQueue() {
	console.log(chatOpen);
	
	if(chatChatConsultOpen){
		closeFormChatConsultQueue();
	}else{
		chatChatConsultOpen=true;
		allocateL2('chatFormChatConsultQueue',1);
		$('#chatFormChatConsultQueue').removeClass('hiddenDiv');
		if($('#roomnameConsult').html()==""){
			$('#chatQueue').removeClass('hiddenDiv');
			$('#formChatConsult').addClass('hiddenDiv');
		}else{
			$('#chatQueue').removeClass('hiddenDiv');
			$('#formChatConsult').removeClass('hiddenDiv');
		}
	}
}

function closeFormChatConsult() {
	console.log('close form')
	chatChatConsultOpen=false;
	$('#chatFormChatConsultQueue').addClass('hiddenDiv');
	socket.emit('chatconsult cancel');
	$('#consult_CN').val('');
	$('#consult_inquiry').val('');
	$('#consult-info').removeClass('hiddenDiv');
	$('#chatQueue').addClass('hiddenDiv');
	if(chatChatCCTConsultOpen){
		$('#chatFormChatCCTConsultQueue').css('right','10px')
	}
}

function openFormChatConsult() {
	console.log(chatChatCCTConsultOpen);
	console.log(chatChatConsultOpen);
	
	if(chatChatConsultOpen){
		closeFormChatConsult();
	}else{
		if(chatChatCCTConsultOpen){
			$('#chatFormChatConsultQueue').css('right','250px')
		}else{
			$('#chatFormChatConsultQueue').css('right','10px')
		}
		chatChatConsultOpen=true;
		$('#chatFormChatConsultQueue').removeClass('hiddenDiv');
		if($('#roomnameConsult').html()==""){
			$('#consult-info').removeClass('hiddenDiv');
			$('#chatQueue').addClass('hiddenDiv');
			$('#formChatConsult').addClass('hiddenDiv');
		}else{
			$('#consult-info').addClass('hiddenDiv');
			$('#chatQueue').addClass('hiddenDiv');
			$('#formChatConsult').removeClass('hiddenDiv');
		}
	}
}

function allocateL2(divWindow, mode){
	console.log(divWindow);
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