var nums = document.querySelectorAll('.numsTrainer span');
var counterCountdown = document.querySelector('.counterTrainerCountdown');
var finalMessage = document.querySelector('.finalTrainer');
var repl = document.getElementById('replayTrainer');
var chatChatTrainerOpen=false;
var chatChatTrainerOpen2=false;

function sendMessage(window){
	if(window==1){
		socket.emit('chattrainer message',$('#roomnameTrainer').html(),userCN,$('#chat_messageChatTrainer').val())
		$('#chat_messageChatTrainer').val('');
		$('#chat_messageChatTrainer').focus()
	}else{
		socket.emit('chattrainer message',$('#roomnameTrainer2').html(),userCN,$('#chat_messageChatTrainer2').val())
		$('#chat_messageChatTrainer2').val('');
		$('#chat_messageChatTrainer2').focus()
	}
}

function chatTrainerQueue(FN,LN,email,product,subproduct){
	socket.emit('chattrainer enqueue',userCN,userID,FN,LN,email,product,subproduct);
	$('#trainer-info').addClass('hiddenDiv');
	$('#chatTrainerQueue').removeClass('hiddenDiv');
}

function trainerChange(status){
	if(status){
		socket.emit('chattrainer avail',userCN,userID,'avail');
	}else{
		socket.emit('chattrainer avail',userCN,userID,'unavail');
	}
}

function closeFormChatTrainer() {
	console.log('close form')
	chatChatTrainerOpen=false;
	$('#chatFormChatTrainer').css('display','none');
	$('#chatFormChatTrainer').css('display','none');
}

function openFormChatTrainer() {
	console.log(chatOpen);
	if(chatOpen){
		$('#chatFormChatTrainer').css('right','250px')
	}
	if(chatChatTrainerOpen){
		$('#chatFormChatTrainer').css('display','block');
		$('#chatBadgeChatTrainer').addClass('hiddenDiv');
		chatTrainerCounter=0;
		closeFormChatTrainer();
	}else{
		chatChatTrainerOpen=true;
		$('#chatFormChatTrainer').css('display','block');
		$('#chatBadgeChatTrainer').addClass('hiddenDiv');
		chatTrainerCounter=0;
	}
}

function init_trainer_room(room,participants,FN,LN,email,product,subproduct){
	if(usertype=="Chat Trainee"){
		if(chatChatTrainerOpen){
			chatChatTrainerOpen2=true;
			$('#chatFormChatTrainer2').css('right','250px')
			$('#formChatTrainer2').removeClass('hiddenDiv');
			$('#formChatTrainer2').addClass(room);
			$('#roomnameTrainer2').html(room);
			var room_members=JSON.parse(participants);
			$('#messagesChatTrainer2').html('');
			$('#messagesChatTrainer2').append($('<li>').html('<b>Name</b><br><span class="chat_text">'+FN+" "+LN+'</span>'));
			$('#messagesChatTrainer2').append($('<li>').html('<b>Email</b><br><span class="chat_text">'+email+'</span>'));
			$('#messagesChatTrainer2').append($('<li>').html('<b>Product</b><br><span class="chat_text">'+product+'</span>'));
			$('#messagesChatTrainer2').append($('<li>').html('<b>SubProduct</b><br><span class="chat_text">'+subproduct+'</span>'));
		}else{
			chatChatTrainerOpen=true;
			$('#formChatTrainer').removeClass('hiddenDiv');
			$('#formChatTrainer').addClass(room);
			$('#roomnameTrainer').html(room);
			var room_members=JSON.parse(participants);
			$('#messagesChatTrainer').html('');
			$('#messagesChatTrainer').append($('<li>').html('<b>Name</b><br><span class="chat_text">'+FN+" "+LN+'</span>'));
			$('#messagesChatTrainer').append($('<li>').html('<b>Email</b><br><span class="chat_text">'+email+'</span>'));
			$('#messagesChatTrainer').append($('<li>').html('<b>Product</b><br><span class="chat_text">'+product+'</span>'));
			$('#messagesChatTrainer').append($('<li>').html('<b>SubProduct</b><br><span class="chat_text">'+subproduct+'</span>'));
		}
	}else{
		$('#chatTrainerQueue').addClass('hiddenDiv');
		$('#formChatTrainer').removeClass('hiddenDiv');
		$('#formChatTrainer').addClass(room);
		$('#roomnameTrainer').html(room);
		var room_members=JSON.parse(participants);
		$('#messagesChatTrainer').html('');
		$('#messagesChatTrainer').append($('<li>').html('<b>Name</b><br><span class="chat_text">'+FN+" "+LN+'</span>'));
		$('#messagesChatTrainer').append($('<li>').html('<b>Email</b><br><span class="chat_text">'+email+'</span>'));
		$('#messagesChatTrainer').append($('<li>').html('<b>Product</b><br><span class="chat_text">'+product+'</span>'));
		$('#messagesChatTrainer').append($('<li>').html('<b>SubProduct</b><br><span class="chat_text">'+subproduct+'</span>'));
	}
}

function endTrainer(room,window){
	console.log(room);
	console.log(window);
	socket.emit('chattrainer closeroom',room);
	if(usertype=="Chat Trainee"){
		if(window=="1"){
			$('#chatFormChatTrainer').css('display','none');
			$('#formChatTrainer').removeClass(room);
			chatChatTrainerOpen=false;
		}else{
			$('#chatFormChatTrainer2').css('display','none');
			$('#formChatTrainer2').removeClass(room);
			chatChatTrainerOpen2=false;
		}
	}else{
		$('#formChatTrainer').removeClass(room);
		$('#formChatTrainer').addClass('hiddenDiv');
		$('#trainer-info').removeClass('hiddenDiv');
		$('#chatTrainerQueue').addClass('hiddenDiv');
		$('#trainer_FN').val('');
		$('#trainer_LN').val('');
		$('#trainer_email').val('');
		$('#trainer_product').val('');
		$('#trainer_subproduct').val('');
	}
}

function getTrainerTranscript(room){
	socket.emit('chattrainer gettranscript',room);
}

function getTrainerTranscriptFile(room){
	$.ajax({
		url:'/chattrainers/'+room+'.txt',
		success: function (data){
			showTranscript(data);
		},
		error: function(xhr,status,error){
			console.log(error);
		}
	});
	showTrainerTranscript(room);
}

function showTrainerTranscript(transcript){
	console.log(transcript);
	var htmlContent='<pre>';
	var content=transcript.split('#%#');
	content.splice(content.length-1,1);
	content.forEach(function(line){
		lineArray=line.split('###');
		console.log(lineArray);
		if(lineArray.length>3){
			var dateString=(new Date(Math.floor(lineArray[1]))).toLocaleString('en-US', {day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
			htmlContent+="Room: "+lineArray[0]+"<br>Session Start:"+dateString+"<br>Case Number: "+lineArray[2]+"<br>Inquiry: "+lineArray[3]+"<br>";
		}else{
			var dateString=(new Date(Math.floor(lineArray[0]))).toLocaleString('en-US', {day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
			htmlContent+="<br>"+dateString+" "+lineArray[1]+": <br>"+lineArray[2]+"<br>";
		}
	})
	htmlContent+='<pre';
	var myWindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+0+",right="+100);
	
	myWindow.document.head.innerHTML = "<head><title>Chat Trainer Transcript</title>"

	myWindow.document.body.innerHTML = htmlContent;

	myWindow.focus();

}

function saveChatTrainer(timestamp,room,trainee,trainer,FN,LN,email,product,subproduct){
	data={
		timestamp:timestamp,
		room:room,
		trainee:trainee,
		trainer:trainer,
		FN:FN,
		LN:LN,
		email:email,
		product:product,
		subproduct:subproduct
	}

	$.ajax({
		type:"POST",
		url:"/api/chattrainers/add" ,
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

function populateChatTrainer(){
	getDataRecord("/api/chattrainers/get",function(trainers){
		console.log(trainers);
		//$('#chattrainers_table').css('display','none');
		$("#chattrainers_table").html('<thead style="text-align:center;font-weight:bold;cursor: pointer;"><tr><td onclick="sortTable(&quot;trainer_table&quot;,0)">Date</td><td onclick="sortTable(&quot;trainer_table&quot;,1)">L2</td><td onclick="sortTable(&quot;trainer_table&quot;,2)">Expert</td><td onclick="sortTable(&quot;trainer_table&quot;,3)">Case Number</td><td onclick="sortTable(&quot;trainer_table&quot;,4)">Inquiry</td><td onclick="sortTable(&quot;trainer_table&quot;,5)">Room</td><td onclick="sortTable(&quot;trainer_table&quot;,6)">Duration</td></tr></thead><tbody>');
		trainers.forEach(function(data){
			$.ajax({
				url:'/chattrainers/'+data.chattrainers_room+'.txt',
				success: function (transcript){
					var content=transcript.split('#%#');
					var startchat=Math.floor(content[0].split('###')[1]);
					content.splice(content.length-1,1);
					var endchat=Math.floor(content[content.length-1].split('###')[0]);
					var chatduration=endchat-startchat;
					//console.log((Math.floor(chatduration/60000)).toString());
					var mins = (Math.floor(chatduration/60000))<10?'0'+(Math.floor(chatduration/60000)).toString():(Math.floor(chatduration/60000)).toString();
					var secs = (Math.floor(chatduration/1000)%60)<10?'0'+(Math.floor(chatduration/1000)%60).toString():(Math.floor(chatduration/1000)%60).toString();
					var dateString=(new Date(Math.floor(data.chattrainers_timestamp))).toLocaleString('en-US', {day:'2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
					
					html="<tr id='chattrainers_" + data.chattrainers_id + "'>" +
						"<td> "+ dateString +"</td>" +
						"<td id='L2_"+ data.chattrainers_id +"'>"+data.chattrainers_L2+"</td>" +
						"<td id='L1_"+ data.chattrainers_id +"'>"+data.chattrainers_expert+"</td>" +
						"<td>" + data.chattrainers_casenumber + "</td> " +
						"<td><custom style=' white-space: pre-wrap;'>" + data.chattrainers_inquiry.replace(/[\n]/g,"<br style='mso-data-placement:same-cell;' />") + "</custom></td> " +
						"<td><a href='#' onclick=getTranscriptFile('" + data.chattrainers_room + "')>" + data.chattrainers_room + "</a></td> " +
						"<td> 00:"+ mins + ":" + secs + "</td>" +
						"</tr>";
					$("#chattrainers_table").append(html);
		
				},
				error: function(xhr,status,error){
					console.log(error);
				}
			});

		})
		
	})
}