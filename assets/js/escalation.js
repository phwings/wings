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
			experts=experts.filter(element => {
				return element.users_team !==-20
			});
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
	$('#saveasxlsbutton').css('display','none');
	$('#generatel2report').css('display','none');
	$('#monthselector_l2report').css('display','none');
	getDataRecord('/api/escalations/get',function(escalations){
		//console.log(escalations);
		escalations.sort((a, b) => (a["escalations_approved"] > b["escalations_approved"]) ? 1 : -1)
		var html="";
		//console.log(experts.length);
		$('#escalation_table').css('display','none');
		$("#escalation_table").html('<thead style="text-align:center;font-weight:bold;cursor: pointer;"><tr><td onclick="sortTable(&quot;escalation_table&quot;,0)">Date</td><td onclick="sortTable(&quot;escalation_table&quot;,1)">Reported by</td><td onclick="sortTable(&quot;escalation_table&quot;,2)">L1 Agent</td><td onclick="sortTable(&quot;escalation_table&quot;,3)">Case Number</td><td onclick="sortTable(&quot;escalation_table&quot;,4)">Product</td><td onclick="sortTable(&quot;escalation_table&quot;,5)" width="50">Reason</td><td class="escalation_TM_column" onclick="sortTable(&quot;escalation_table&quot;,6)">TM</td><td onclick="sortTable(&quot;escalation_table&quot;,7)">Expert&quot;s Opportunity</td><td onclick="sortTable(&quot;escalation_table&quot;,8)">TM Feedback</td><td onclick="sortTable(&quot;escalation_table&quot;,9)">Expert&quot;s Commitment</td><td class="escalation_approved_column" onclick="sortTable(&quot;escalation_table&quot;,10)">Status</td><td class="escalation_approved_column" onclick="sortTable(&quot;escalation_table&quot;,11)">Remarks</td></tr></thead><tbody>');
		escalations.forEach(data => {
			commitment=data.escalations_commitment;
			//console.log(userlevel);

			html="<tr class='hiddenDiv' id='escalation_" + data.escalations_id + "'>" +
				"<td> "+ data.escalations_timestamp +"</td>" +
				"<td id='L2_"+ data.escalations_id +"'> "+ data.L2 +"</td>" +
				"<td id='L1_"+ data.escalations_id +"'> "+ data.L1 +"</td>" +
				"<td>" + data.escalations_casenumber + "</td> " +
				"<td>"+ ((data.product==null)?"No device selected.":data.product) +"</td>" +
				"<td  style='width:50px!important'>" + data.escalations_reason + "</td> " +
				"<td class='escalation_TM_column' id='TM_"+ data.escalations_id +"'>"+ data.TM +"</td>" +
				"<td>" + data.escalations_opportunity + "</td> " +
				"<td id='escalation_feedback_"+ data.escalations_id +"'> " + data.escalations_feedback + "</td> " +
				"<td id='escalation_commitment_"+ data.escalations_id +"'> " + data.escalations_commitment + "</td> " +
				"<td align='center' class='escalation_approved_column' id='escalation_approved_column_"+ data.escalations_id +"'></td> " +
				"<td align='center' class='escalation_remarks_column' id='escalation_remarks_column_"+ data.escalations_id +"'>" + data.escalations_remarks.replace(/<br>/g,'<br style="mso-data-placement:same-cell;" />') + "</td> " +
				"</tr>";
			$("#escalation_table").append(html);


			if(userlevel==2){
				$('#escalation_'+data.escalations_id).removeClass('hiddenDiv');
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
                        $('#monthselector_l2report').css('display','none');
                        
                        if(data.escalations_L1 == user.users_CES){
                            if(data.escalations_fornotify=="0001"){
                                //console.log("no commitment");
                                $('#escalation_commitment_'+data.escalations_id).html(data.escalations_commitment?data.escalations_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
                            }
                        }
                    }else{
						$('#saveasxlsbutton').css('display','block');
                        $('#generatel2report').css('display','inline-block');
                        $('#monthselector_l2report').css('display','inline-block');
					}
					//console.log(data.escalations_fornotify<='0010');
					if((data.escalations_L2 == user.users_CES)){
						$('#L2_'+data.escalations_id).append("<br><i class='fa fa-edit tooltip' style='font-size:18px' onclick='editEscalation("+ data.escalations_id +")'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
						$('#L2_'+data.escalations_id).append("<i class='fa fa-times tooltip' style='font-size:18px;color:red;float:right' onclick='if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteEscalation("+ data.escalations_id +");};'><span class='tooltiptext' style='width:100px; font-size:12px;'>Delete this entry</span></i>");
					}
					
					if((data.escalations_approved==1)&&((data.escalations_fornotify!='0001')&&(data.escalations_fornotify!='0010'))){
						$('#escalation_approved_column_'+ data.escalations_id).html("Approved");
					}else if(data.escalations_approved==0){
						$('#escalation_approved_column_'+ data.escalations_id).html("Pending");

					}else if(data.escalations_approved==-1){
						$('#escalation_approved_column_'+ data.escalations_id).html("Disapproved");

					}
					$('#escalation_remarks_column_'+ data.escalations_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39);$(&#39;#remarks_modal_escalation_source&#39;).val(&#39;L2&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.escalations_remarks.replace('\'','`').replace('\r','<br style="mso-data-placement:same-cell;" />').replace('\n','<br style="mso-data-placement:same-cell;" />')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Add Remarks</span></i><br>");
					$('#escalation_remarks_column_'+ data.escalations_id).append(data.escalations_remarks.replace(/<br>/g,'<br style="mso-data-placement:same-cell;" />'));
					if(data.escalations_fornotify=='0100'){
						$('#escalation_' + data.escalations_id).css('background-color','#fcbdbd');
					}
				}else{
					//console.log("in L2 TM section");
					
					if(data.escalations_approved==1){
						$('#escalation_approved_column_'+ data.escalations_id).html("Approved");
					}else if(data.escalations_approved==0){
						$('#escalation_approved_column_'+ data.escalations_id).html("<button onclick='approveEscalation(" + data.escalations_id + ",1)' style='width:82px'>Approve</button><br><br><button onclick='approveEscalation(" + data.escalations_id + ",-1)' style='width:82px'>Disapprove</button>");
					}else if(data.escalations_approved==-1){
						$('#escalation_approved_column_'+ data.escalations_id).html("Disapproved");
					}
					
					//console.log(data.escalations_remarks);
					$('#escalation_remarks_column_'+ data.escalations_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39);$(&#39;#remarks_modal_escalation_source&#39;).val(&#39;L2&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.escalations_remarks.replace('\'','`').replace('\r','<br style="mso-data-placement:same-cell;" />').replace('\n','<br style="mso-data-placement:same-cell;" />')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Add Remarks</span></i><br>");
					$('#escalation_remarks_column_'+ data.escalations_id).append(data.escalations_remarks.replace(/<br>/g,'<br style="mso-data-placement:same-cell;" />'));
					//console.log("'$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.escalations_remarks+"&#39;);'>");
					if(data.escalations_fornotify=='1000'){
						$('#escalation_' + data.escalations_id).css('background-color','#fcbdbd');
					}
					if(data.L1Team==userteam){
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


				

			} else {
				
				$('.escalation_approved_column').addClass('hiddenDiv');
				$('.escalation_TM_column').addClass('hiddenDiv');
				$('.escalation_remarks_column').addClass('hiddenDiv');
				if((usertype!='TM')&&(usertype!='SME')){
					if((data.escalations_fornotify=="0001")&&(data.escalations_L1==userCES)){
						$('#escalation_'+ data.escalations_id).removeClass("hiddenDiv");
						$('#escalation_commitment_'+data.escalations_id).html(data.escalations_commitment?data.escalations_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_escalation_id&#39;).val(&#39;"+data.escalations_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
						return;
					}
					
					//console.log(team);
					//console.log(userteam);
				}else{
					//console.log('in L1 TM section')
					//console.log(team);
					//console.log(userteam);
					if(data.L1Team==userteam){
						//console.log('teammate');
						$('#escalation_'+data.escalations_id).removeClass('hiddenDiv');
						//console.log('expert team ' + team);
						//console.log('TM     team ' + userteam);
						//console.log(data.escalations_approved);
						
						if(data.escalations_approved<1){
							//console.log('not approved');
							$('#escalation_'+data.escalations_id).addClass('hiddenDiv');
						}else{
							if(data.escalations_L1==userCES){
								$('#.escalations_'+data.escalations_id).addClass('hiddenDiv');
								if(data.escalations_fornotify=='0010'){
									$('#escalations_commitment_'+data.escalations_id).html(data.escalations_commitment?data.cctosfeedback_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
								}
							}else{
								$('#escalation_'+data.escalations_id).removeClass('hiddenDiv');
								if(data.escalations_fornotify=='0010'){
									$('#escalation_' + data.escalations_id).css('background-color','#fcbdbd');
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
					}
				}
			}
			$('#escalation_table').css('display','block');
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