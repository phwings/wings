var chatOpen=false;
var chatL2Open=false;
var chatChatConsultOpen=false;

function approveAuxRequest(id,mode,otherRTA){
	var dataRequest;
	if(!otherRTA){
		if(mode==1){
			socket.emit('aux approve',{auxid:id,message:$('#message_'+id).val()});
		}else{
			socket.emit('aux disapprove',{auxid:id,message:$('#message_'+id).val()});
		}
	}else{
		dataRequest=auxRequestsArray[auxRequestsArray.findIndex(element => element.auxid == id)];
		console.log($('#message_'+id).val());
		
		auxRequestListArray.push(auxRequestsArray.splice(auxRequestsArray.findIndex(element => element.auxid == id), 1)[0]);
		auxRequestListArray[auxRequestListArray.length-1].reply=$('#message_'+id).val();
		auxRequestListArray[auxRequestListArray.length-1].approved=mode;
		localStorage.setItem('auxRequestListArray',JSON.stringify(auxRequestListArray));
		localStorage.setItem('requestsArray',JSON.stringify(auxRequestsArray));
		$('#auxRequests').html("<thead><th onclick=sortTable('auxRequests',0)>Name</th><th onclick=sortTable('auxRequests',1)>Aux Type</th><th  onclick=sortTable('auxRequests',2)>Time</th><th>Message</th><th>Action</th></thead>");
		auxRequestsArray.reverse().forEach(function (data){
			$('#auxRequests').append("<tr id="+data.auxid+" class='blink-bg'><td>"+data.name+"</td><td>"+data.auxtype+"</td><td>"+data.auxtime+"</td><td>"+data.message+"</td><td><button onclick=approveAuxRequest('"+data.auxid+"',1)>Approve</button><button onclick=approveAuxRequest('"+data.auxid+"',0)>Disapprove</button><textarea id='message_"+data.auxid+"'></textarea></td></tr>")
		})
		$('#auxRequestList').html("<thead><th onclick=sortTable('auxRequestList',0)>Name</th><th onclick=sortTable('auxRequestList',1)>Aux Type</th><th onclick=sortTable('auxRequestList',2)>Time</th><th>Message</th><th>Reply</th><th onclick=sortTable('auxRequestList',5)>Action</th></thead>");
		auxRequestListArray.reverse().forEach(function (dataR){
			console.log(dataR)
			$('#auxRequestList').append("<tr id="+dataR.auxid+"><td>"+dataR.name+"</td><td>"+dataR.auxtype+"</td><td>"+dataR.auxtime+"</td><td>"+dataR.message+"</td><td>"+dataR.reply+"</td><td>"+((dataR.approved==1)?"Approved":"Disapproved")+"</td></tr>")
		})
	}

}

function clearRequests(){
	auxRequestsArray=[];
	auxRequestListArray=[];
	localStorage.setItem('auxRequestListArray','');
	localStorage.setItem('requestsArray','');
	$('#auxRequests').html("<thead><th onclick=sortTable('auxRequests',0)>Name</th><th onclick=sortTable('auxRequests',1)>Aux Type</th><th  onclick=sortTable('auxRequests',2)>Time</th><th>Message</th><th>Action</th></thead>");
	$('#auxRequestList').html("<thead><th onclick=sortTable('auxRequestList',0)>Name</th><th onclick=sortTable('auxRequestList',1)>Aux Type</th><th onclick=sortTable('auxRequestList',2)>Time</th><th>Message</th><th>Reply</th><th onclick=sortTable('auxRequestList',5)>Action</th></thead>");
}

function openAux() {
		var dt=new Date();
		var time = ((dt.getHours()).toString().length<2?('0'+(dt.getHours()).toString()):(dt.getHours()).toString()) + ':' + ((dt.getMinutes()).toString().length<2?('0'+(dt.getMinutes()).toString()):(dt.getMinutes()).toString()) + ':' + ((dt.getSeconds()).toString().length<2?('0'+(dt.getSeconds()).toString()):(dt.getSeconds()).toString());
		$('#auxTime').val(time);
		$('#auxForm').css('display','block');
		$('#auxBadge').addClass('hiddenDiv');
		//chatCounter=0;

}

function closeAux() {
	console.log('close form')
	chatOpen=false;
	$('#auxForm').css('display','none');
}

function openForm() {
	if((usertype=='Chat')||(usertype=='OTS')){
		console.log(chatOpen);

		if(chatChatConsultOpen){
			$('#chatForm').css('right','250px')
		}

	}else{
		console.log(chatOpen);

		if(chatL2Open){
			$('#chatForm').css('right','250px')
		}
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

