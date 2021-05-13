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