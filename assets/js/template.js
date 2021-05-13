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
		//console.log($.parseHTML(templateContent))
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