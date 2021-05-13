function updateConsultTable(){
	
	var remarks="";
	var editconsult="";
	var status;
	console.log(userlevel);
	console.log(usertype);
	console.log("in update")
	$('#saveasconsultxlsbutton').css('display','none');
	$('#generateconsultl2report').css('display','none');
	$('#monthselector_l2reportconsult').css('display','none');
	getDataRecord('/api/consults/get',function(consults){
		console.log(consults);
		consults.sort((a, b) => (a["consults_approved"] > b["consults_approved"]) ? 1 : -1)
		var html="";
		//console.log(experts.length);
		$('#consult_table').css('display','none');
		$("#consult_table").html('<thead style="text-align:center;font-weight:bold;cursor: pointer;"><tr><td onclick="sortTable(&quot;consult_table&quot;,0)">Date</td><td onclick="sortTable(&quot;consult_table&quot;,1)">Reported by</td><td onclick="sortTable(&quot;consult_table&quot;,2)">L1 Agent</td><td onclick="sortTable(&quot;consult_table&quot;,3)">Case Number</td><td onclick="sortTable(&quot;consult_table&quot;,4)">Product</td><td onclick="sortTable(&quot;consult_table&quot;,5)">Reason</td><td onclick="sortTable(&quot;consult_table&quot;,6)">Duration</td><td onclick="sortTable(&quot;consult_table&quot;,7)">Long Consult Reason</td><td class="consult_TM_column" onclick="sortTable(&quot;consult_table&quot;,8)">TM</td><td onclick="sortTable(&quot;consult_table&quot;,9)">Expert&quot;s Opportunity</td><td onclick="sortTable(&quot;consult_table&quot;,10)">TM Feedback</td><td onclick="sortTable(&quot;consult_table&quot;,11)">Expert&quot;s Commitment</td><td class="consult_approved_column" onclick="sortTable(&quot;consult_table&quot;,12)">Status</td><td class="consult_approved_column" onclick="sortTable(&quot;consult_table&quot;,13)">Remarks</td></tr></thead><tbody>');
		consults.forEach(data => {
			commitment=data.consults_commitment;
			console.log(data);

			html="<tr class='hiddenDiv' id='consult_" + data.consults_id + "'>" +
				"<td class='hiddenDiv'> "+ (((parseInt(data.consults_L1)>8000)&&(parseInt(data.consults_L1)<8100))?"IOPEX":"CNX") +"</td>" +
				"<td> "+ data.consults_timestamp +"</td>" +
				"<td id='L2_"+ data.consults_id +"'>"+data.L2+"</td>" +
				"<td id='L1_"+ data.consults_id +"'>"+data.L1+"</td>" +
				"<td>" + data.consults_casenumber + "</td> " +
				"<td>"+ ((data.product==null)?"No device selected.":data.product) +"</td>" +
                "<td>" + data.consults_reason + "</td> " +
				"<td>" + data.consults_duration + "</td> " +
				"<td>" + data.consults_durationreason + "</td> " +
				"<td class='consult_TM_column' id='TM_"+ data.consults_id +"'>"+data.TM+"</td>" +
				"<td>" + (data.consults_opportunity.split('=-=')[0]==0?'None':data.consults_opportunity.split('=-=')[0]+":<br><br>"+data.consults_opportunity.split('=-=')[1]) + "</td> " +
				"<td id='consult_feedback_"+ data.consults_id +"'> " + data.consults_feedback + "</td> " +
				"<td id='consult_commitment_"+ data.consults_id +"'> " + data.consults_commitment + "</td> " +
				"<td align='center' class='consult_approved_column' id='consult_approved_column_"+ data.consults_id +"'></td> " +
				"<td align='center' class='consult_remarks_column' id='consult_remarks_column_"+ data.consults_id +"'></td> " +
				"</tr>";
			$("#consult_table").append(html);

			//console.log(userlevel);
			if(userlevel==2){
				$('#consult_'+data.consults_id).removeClass('hiddenDiv');
				//console.log("user level 2")
				if(data.consults_fornotify=='0001'){
					$('#consult_approved_column_'+ data.consults_id).html("Waiting for expert's commitment.");
				}
				if(data.consults_fornotify=='0010'){
					$('#consult_approved_column_'+ data.consults_id).html("Waiting for TM's/SME's action.");
				}
				if(usertype!='TM'){
					if(usertype!='Analyst'){
						//console.log("in user level 2 Voice");
                        //if((data.consults_L2 != user.users_CES)&&(data.consults_L1 != user.users_CES)){
                        //    $('#consult_'+ data.consults_id).addClass("hiddenDiv");
                        //    return;
                        //}
						$('#saveasconsultxlsbutton').css('display','none');
						$('#generateconsultl2report').css('display','none');
						$('#monthselector_l2reportconsult').css('display','none');
						
                        if(data.consults_L1 == user.users_CES){
                            if(data.consults_fornotify=="0001"){
                                //console.log("no commitment");
                                $('#consult_commitment_'+data.consults_id).html(data.consults_commitment?data.consults_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment_consult&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_consult_id&#39;).val(&#39;"+data.consults_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
							}
							if(data.consults_fornotify=="0000"){
                                //console.log("no commitment");
                                $('#consult_commitment_'+data.consults_id).html("No feedback required.");
                            }
                        }
                    }else{
						$('#saveasconsultxlsbutton').css('display','block');
						$('#generateconsultl2report').css('display','block');
						$('#monthselector_l2reportconsult').css('display','block');
					}
					//console.log(data.consults_fornotify<='0010');
					if((data.consults_L2 == user.users_CES)){
						$('#L2_'+data.consults_id).append("<br><i class='fa fa-edit tooltip' style='font-size:18px' onclick='editConsult("+ data.consults_id +")'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
						$('#L2_'+data.consults_id).append("<i class='fa fa-times tooltip' style='font-size:18px;color:red;float:right' onclick='if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteConsult("+ data.consults_id +");};'><span class='tooltiptext' style='width:100px; font-size:12px;'>Delete this entry</span></i>");
					}
					
					if((data.consults_approved==1)&&((data.consults_fornotify!='0001')&&(data.consults_fornotify!='0010'))){
						$('#consult_approved_column_'+ data.consults_id).html("Approved");
					}else if(data.consults_approved==0){
						$('#consult_approved_column_'+ data.consults_id).html("Pending");

					}else if(data.consults_approved==-1){
						$('#consult_approved_column_'+ data.consults_id).html("Disapproved");
					}
					$('#consult_remarks_column_'+ data.consults_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks_consult&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_consult_id&#39;).val(&#39;"+data.consults_id+"&#39);$(&#39;#remarks_modal_consult_source&#39;).val(&#39;L2&#39);$(&#39;#previous_remarks_consult&#39;).html(&#39;"+data.consults_remarks.replace('\'','`').replace(/\\r/g,'<br style="mso-data-placement:same-cell;" />').replace(/\\n/g,'<br style="mso-data-placement:same-cell;" />')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Add Remarks</span></i><br style='mso-data-placement:same-cell;' />");
					$('#consult_remarks_column_'+ data.consults_id).append(data.consults_remarks.replace(/<br>/g,'<br style="mso-data-placement:same-cell;" />'));
					if(data.consults_fornotify=='0100'){
						$('#consult_' + data.consults_id).css('background-color','#fcbdbd');
					}
					if(data.consults_fornotify=="0000"){
						//console.log("no commitment");
						$('#consult_commitment_'+data.consults_id).html("No feedback required.");
						$('#consult_approved_column_'+ data.consults_id).html("Completed");
					}
				}else{
					//console.log("in L2 TM section");
					
					if(data.consults_fornotify=="0000"){
						//console.log("no commitment");
						$('#consult_approved_column_'+ data.consults_id).html("No feedback required.");
					}else{
						if(data.consults_approved==1){
							$('#consult_approved_column_'+ data.consults_id).html("Approved");
						}else if(data.consults_approved==0){
							$('#consult_approved_column_'+ data.consults_id).html("<button onclick='approveConsult(" + data.consults_id + ",1)' style='width:82px'>Approve</button><br><br><button onclick='approveConsult(" + data.consults_id + ",-1);' style='width:82px'>Disapprove</button>");
						}else if(data.consults_approved==-1){
							$('#consult_approved_column_'+ data.consults_id).html("Disapproved");
						}
					}
					//console.log(data.consults_remarks);
					$('#consult_remarks_column_'+ data.consults_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks_consult&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_consult_id&#39;).val(&#39;"+data.consults_id+"&#39);$(&#39;#remarks_modal_consult_source&#39;).val(&#39;L2&#39);$(&#39;#previous_remarks_consult&#39;).html(&#39;"+data.consults_remarks.replace('\'','`').replace(/\\r/g,'<br style="mso-data-placement:same-cell;" />').replace(/\\n/g,'<br style="mso-data-placement:same-cell;" />')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Add Remarks</span></i><br style='mso-data-placement:same-cell;' />");
					$('#consult_remarks_column_'+ data.consults_id).append(data.consults_remarks.replace(/<br>/g,'<br style="mso-data-placement:same-cell;" />'));
					//console.log("'$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_consult_id&#39;).val(&#39;"+data.consults_id+"&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.consults_remarks+"&#39;);'>");
					if(data.consults_fornotify=='1000'){
						$('#consult_' + data.consults_id).css('background-color','#fcbdbd');
					}

					if(data.L1Team==userteam){
						if(data.consults_fornotify=='0010'){
							if(!data.consults_commitment){
								$('#consult_commitment_'+ data.consults_id).html("<button onclick='update_notifyConsult(" + data.consults_id + ",&#39;0001&#39;)' style='width:62px'>Send to Expert</button>");
							}else{
								$('#consult_feedback_'+ data.consults_id).html(data.consults_feedback?data.consults_feedback:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_feedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#feedback_modal_consult_id&#39;).val(&#39;"+data.consults_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
							}
						}
						if(data.consults_fornotify=='0001'){
							$('#consult_commitment_'+ data.consults_id).html("Waiting for Expert's response");
						}
						if(data.consults_fornotify=="0000"){
							//console.log("no commitment");
							$('#consult_commitment_'+ data.consults_id).html("No feedback required.");
							$('#consult_feedback_'+ data.consults_id).html("No feedback required.");
						}
					}
				}


				

			} else {
				//console.log("in user level 1 section");
				
				
				
				//console.log("in user level 1")
				$('.consult_approved_column').addClass('hiddenDiv');
				$('.consult_TM_column').addClass('hiddenDiv');
				$('.consult_remarks_column').addClass('hiddenDiv');
				if((usertype!='TM')&&(usertype!='SME')){
					//console.log("in user level 1 voice");
					if((data.consults_fornotify=="0001")&&(data.consults_L1==userCES)){
						//console.log("no commitment");
						$('#consult_'+ data.consults_id).removeClass("hiddenDiv");
						$('#consult_commitment_'+data.consults_id).html(data.consults_commitment?data.consults_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment_consult&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_consult_id&#39;).val(&#39;"+data.consults_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
						return;
					}
					//console.log(team);
					//console.log(userteam);
				}else{
					console.log("in user level 1 TM");
					
					//console.log(userteam);
					if(data.L1Team==userteam){
						$('#consult_'+data.consults_id).removeClass('hiddenDiv');
						//console.log('expert team ' + team);
						//console.log('TM     team ' + userteam);
						//console.log(data.consults_approved);
						
						if(data.consults_approved<1){
							//console.log('not approved');
							$('#consult_'+data.consults_id).addClass('hiddenDiv');
						}else{
							if(data.consults_L1==userCES){
								$('#.consults_'+data.consults_id).addClass('hiddenDiv');
								if(data.consults_fornotify=='0010'){
									$('#consults_commitment_'+data.consults_id).html(data.consults_commitment?data.cctosfeedback_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
								}
							}else{
								$('#consult_'+data.consults_id).removeClass('hiddenDiv');
								if(data.consults_fornotify=='0010'){
									$('#consult_' + data.consults_id).css('background-color','#fcbdbd');
									if(!data.consults_commitment){
										$('#consult_commitment_'+ data.consults_id).html("<button onclick='update_notifyConsult(" + data.consults_id + ",&#39;0001&#39;)' style='width:62px'>Send to Expert</button>");
									}else{
										$('#consult_feedback_'+ data.consults_id).html(data.consults_feedback?data.consults_feedback:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_feedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#feedback_modal_consult_id&#39;).val(&#39;"+data.consults_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");

									}
								}
								if(data.consults_fornotify=='0001'){
									$('#consult_commitment_'+ data.consults_id).html("Waiting for Expert's response");
								}
							}
						}
					}
					
					
					
				}
			}
			$('#consult_table').css('display','block');
		});
		
		//console.log(html);
		$('.consult_add').removeClass('hiddenDiv');
		$('.consult_edit').addClass('hiddenDiv');
		//$('#L2_consult').css('display','block');
		$('#consult_filter').val('');
	},);
}

function resetConsult(){
	var user=JSON.parse(getCookie('userdetails'));

	$('#L2_list_consult').empty();
	$('#L2_list_consult').append(new Option('Select L2 Expert', 0, true, true));
	$('#L2_list_consult option').addClass('selectheader');
	
	$('.selectheader').prop('disabled','disabled');
	$('.selectheader').prop('selected','selected');
	
	$('#L2_list_consult').val(user.users_CN);

	getDataRecord('/api/users/type/Level 1/0',function(experts){
		//console.log(experts.length);
		//$("#L1_list_consult_source").html('');
		getDataRecord('/api/users/type/Level 2/TM',function(expertsL2){
			$("#L1_list_consult_source").empty();
			$('#L1_list_consult_source').append(new Option('Select Expert', 0, true, true));
			$('#L1_list_consult_source option').addClass('selectheader');
			$('#L1_list_consult_source option').attr('disabled','disabled');
			//console.log("in experts");
			experts=experts.concat(expertsL2);
			experts=experts.filter(element => {
				return element.users_team !==-20
			});
			//console.log(experts)
			experts.sort((a, b) => (a["users_CN"] > b["users_CN"]) ? 1 : -1)
			experts.forEach(data => {
				//console.log(data);
				$("#L1_list_consult_source").append(new Option(data.users_CN, data.users_CES));
			});
		},'');
	});

	getDataRecord('/api/devices',function(devices){
		$("#consult_product").empty();
		$('#consult_product').append(new Option('Select Product', 0, true, true));
		$('#consult_product option').addClass('selectheader');
		$('#consult_product option').attr('disabled','disabled');
		//$("#consult_product").html('');
		devices.sort((a, b) => (a["device_name"] > b["device_name"]) ? 1 : -1)
		devices.forEach(data => {
			//console.log(data);
			$("#consult_product").append(new Option(data.device_name + "    (" + data.device_model + ")", data.device_model));
		});
	},'');
	
	$("#consult_casenumber").val('');
    $("#consult_invalidreason").empty();
    $('#consult_invalidreason').append(new Option('Select Reason', 0, true, true));
	$('#consult_invalidreason option').addClass('selectheader');
	$('#consult_invalidreason option').attr('disabled','disabled');
    $('#consult_invalidreason').append(new Option('RMA Recommendation', 'RMA Recommendation', false, false));
	$('#consult_invalidreason').append(new Option('Technical - Device Functionality/Features', 'Technical - Device Functionality/Features', false, false));
	$('#consult_invalidreason').append(new Option('Technical - Installation', 'Technical - Installation', false, false));
	$('#consult_invalidreason').append(new Option('Technical - Login Issues', 'Technical - Login Issues', false, false));
	$('#consult_invalidreason').append(new Option('Technical - Web/App', 'Technical - Web/App', false, false));
	$('#consult_invalidreason').append(new Option('Technical - 3rd Party Integration', 'Technical - 3rd Party Integration', false, false));
	$('#consult_invalidreason').append(new Option('Process - ATR', 'Process - ATR', false, false));
	$('#consult_invalidreason').append(new Option('Process - Safety and Hazard', 'Process - Safety and Hazard', false, false));
	$('#consult_invalidreason').append(new Option('Process - Litigation and Hold', 'Process - Litigation and Hold', false, false));
	$('#consult_invalidreason').append(new Option('Process - Video Retrieval', 'Process - Video Retrieval', false, false));
	$('#consult_invalidreason').append(new Option('Subscription - Functional', 'Subscription - Functional', false, false));
	$('#consult_invalidreason').append(new Option('Subscription - Transactional', 'Subscription - Transactional', false, false));
	$('#consult_invalidreason').append(new Option('Subscription - Promo', 'Subscription - Promo', false, false));
    $("#consult_opportunity1").empty();
    $('#consult_opportunity1').append(new Option('None', 'None', true, true));
	$('#consult_opportunity1 option').addClass('selectheader');
	$('#consult_opportunity1').append(new Option('Did not follow Call handler/TS guidelines','Did not follow Call handler/TS guidelines', false, false));
	$('#consult_opportunity1').append(new Option('Inaccurate TS Recommendation or Resolution','Inaccurate TS Recommendation or Resolution', false, false));
	$('#consult_opportunity1').append(new Option('Inaccurate/Unclear Case Documentation','Inaccurate/Unclear Case Documentation', false, false));
	$('#consult_opportunity1').append(new Option('Providing Wrong Information','Providing Wrong Information', false, false));
	$('#consult_opportunity1').append(new Option('Incomplete Case Isolation/Probing','Incomplete Case Isolation/Probing', false, false));
    $('#consult_opportunity1').append(new Option('Comms', 'Comms', false, false));
    $('#consult_opportunity1').append(new Option('Others', 'Others', false, false));
    $("#consult_opportunity2").val('');
	$("#consult_duration").val('');
	$("#consult_notes").val('');
	$("#consult_durationreason").val('');
	$("#consult_TM").val('');
	$("#consult_callhandler_na").prop("checked",true);
}

function approveConsult(consult_id,approve){

	$('#consult_approved_column_'+ consult_id).html('<img src="/assets/img/arlobird.gif" width="50px">');
	console.log($('#consult_approved_column_'+ consult_id).html())
	data={
		consult_id:consult_id,
		approve:approve
	}
	$.ajax({
		type:"POST",
		url:"/api/consults/approve" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			updateConsultTable();
		},
		error:function(error){

		}
	 });
}

function updateRemarksConsult(consult_id,remarks,source){
	data={
		consult_id:consult_id,
		consult_remarks:remarks,
		consult_remarks_source:source
	}
	$.ajax({
		type:"POST",
		url:"/api/consults/updateRemarks" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			if(source=='L2'){
				updateConsultTable();
			}else{
				approveConsult(consult_id,0)
			}
			
		},
		error:function(error){

		}
	});
}

function editConsult(consult_id){
	$('.consult_edit').removeClass('hiddenDiv');
	$('.consult_add').addClass('hiddenDiv');
	$('#L2_consult').css('display','block');
	getDataRecord('/api/consults/getSingle/'+consult_id,function(consults){
		getDataRecord('/api/users/CES/'+consults[0].consults_L2+'/a',function(L2data){
			var html4='';
			html4+=L2data[0].users_CN + "<br>";
			$('#L2_'+ data.consults_id).append(html4);
			//console.log(html4);
		},'');
		getTM(consults[0].consults_L1,function(TMname,TMCES){
			$('#consult_TM').val('');
			$('#consult_TM').val(TMname);
			$('#consult_TM').attr('data-tm',TMCES)
		});
		console.log(consults);
		$('#L1_list_consult_source').val(consults[0].consults_L1);
		$('#consult_id').val(consult_id);
		$('#consult_casenumber').val(consults[0].consults_casenumber);
		$('#consult_product').val(consults[0].consults_product);
		$('#consult_duration').val(consults[0].consults_duration);
		$('#consult_invalidreason').val(consults[0].consults_reason);
        $('#consult_opportunity1').val(consults[0].consults_opportunity.split("=-=")[0]);
        $('#consult_opportunity2').val(consults[0].consults_opportunity.split("=-=")[1]);
		$('#consult_feedback').val(consults[0].consults_feedback);
		$('#consult_commitment').val(consults[0].consults_commitment);
	});
}

function update_consult(consult_id,L1,L2,casenumber,product,duration,durationreason,reason,opportunity1,opportunity2,feedback,commitment,datetime){

	var durationarray=duration.split(":");
	if(durationarray[0].length==1)
		durationarray[0]='0'+durationarray[0].toString();
	else if(durationarray[0].length==0)
		durationarray[0]='00';
	if(durationarray[1].length==1)
		durationarray[1]='0'+durationarray[1].toString();
	else if(durationarray[1].length==0)
		durationarray[1]='00';
	
	data={
		consult_id:consult_id,
		L1_list_consult_source:L1,
		L2_list_consult:L2,
		consult_casenumber:casenumber,
		consult_product:product,
		consult_duration:durationarray[0]+":"+durationarray[1],
		consult_durationreason:durationreason,
		consult_invalidreason:reason,
        consult_opportunity:opportunity1+"=-="+opportunity2,
		consult_feedback:feedback,
		consult_commitment:commitment,
		consult_timestamp:datetime,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/consults/update" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			//resetConsult();
			updateConsultTable();
			$("#consult_status").html("Consult updated.");
		},
		error:function(error){
			console.log(error);
		}
	 });
}

function save_consult(L1,L2,casenumber,product,duration,durationreason,reason,callhandler,opportunity1,opportunity2,feedback,commitment,datetime,notes){
var error=false;
	if(casenumber.val()==''){
		casenumber.css('background-color','#ffbfbf');
		error=true;
	}else{
		casenumber.css('background-color','white')
	}
	console.log(L1.val())
	if(L1.val()==null){
		L1.css('background-color','#ffbfbf');
		error=true;
	}else{
		L1.css('background-color','white')
	}
	if(product.val()==null){
		product.css('background-color','#ffbfbf');
		error=true;
	}else{
		product.css('background-color','white')
	}
	if(reason.val()==null){
		reason.css('background-color','#ffbfbf');
		error=true;
	}else{
		reason.css('background-color','white')
	}
	console.log(parseInt(duration.val().split(':')[0]))
	if((duration.val()=='')||(duration.val()==':')){
		duration.css('background-color','#ffbfbf');
		error=true;
	}else{
		duration.css('background-color','white')
	}
	if((notes.val()=='')||(notes.val()==':')){
		notes.css('background-color','#ffbfbf');
		error=true;
	}else{
		notes.css('background-color','white')
	}
	if((parseInt(duration.val().split(':')[0])>10)&&(durationreason.val()=='')){
		durationreason.css('background-color','#ffbfbf');
		error=true;
	}else{
		durationreason.css('background-color','white')
	}
	if((opportunity1.val()=='Others')&&(opportunity2.val()=='')){
		opportunity2.css('background-color','#ffbfbf');
		error=true;
	}else{
		opportunity2.css('background-color','white')
	}
	if(error){
		("#consult_status").html("Please accomplish required fields.");
		return;
	}else{
		var durationarray=duration.val().split(":");
		if(durationarray[0].length==1)
			durationarray[0]='0'+durationarray[0].toString();
		else if(durationarray[0].length==0)
			durationarray[0]='00';
		if(durationarray[1].length==1)
			durationarray[1]='0'+durationarray[1].toString();
		else if(durationarray[1].length==0)
			durationarray[1]='00';
		data={
			L1_list_consult_source:L1.val(),
			L2_list_consult:L2,
			consult_casenumber:casenumber.val(),
			consult_product:product.val(),
			consult_duration:durationarray[0]+":"+durationarray[1],
			consult_durationreason:durationreason.val().replace(/[0-9#%@]/i,'&#35'),
			consult_callhandler:callhandler.val(),
			consult_invalidreason:reason.val().replace(/[0-9#%@]/i,'&#35'),
			consult_opportunity:opportunity1.val() +"=-="+ opportunity2.val().replace(/[0-9#%@]/i,'&#35'),
			consult_timestamp:datetime,
			consult_summary:notes.val()
		}
		generateConsult(product.val(),notes.val());
		console.log(data);

		$.ajax({
			type:"POST",
			url:"/api/newconsults/add" ,
			data:JSON.stringify(data),
			headers:{
				"Content-Type":"application/json"
			},
			//dataType:"json",
			success:function(data){
				//console.log(data);
				resetConsult();
				updateConsultTable();
				$('#save_consult_button').attr('disabled',false);
				$("#consult_status").html("Consult recorded.");
			},
			error:function(error){
				console.log(error);
			}
		});
	}
}

function deleteConsult(id){
	data={
		consult_id:id,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/consults/delete" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetConsult();
			updateConsultTable();
			$("#consult_status").html("Consult recorded.");
		},
		error:function(error){

		}
	});
}

function update_notifyConsult(consult_id,notify){
	data={
		consult_id:consult_id,
		consult_fornotify:notify
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/consults/updateNotify" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			//resetconsult();
			updateConsultTable();
			$("#consult_status").html("consult updated.");
		},
		error:function(error){
			console.log(error);
		}
	 });
}

function saveCommitmentConsult(consult_id,commitment){
	data={
		consult_id:consult_id,
		consult_commitment:commitment,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/consults/updateCommitment" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetConsult();
//			updateConsultTable();
			$("#consult_status").html("Consult recorded.");
		},
		error:function(error){

		}
	 });
}

function saveFeedbackConsult(consult_id,feedback){
	data={
		consult_id:consult_id,
		consult_feedback:feedback,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/consults/updateFeedback" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetConsult();
//			updateConsultTable();
			$("#consult_status").html("Consult recorded.");
		},
		error:function(error){

		}
	 });
}

function updateConsultReportTable(){
	var remarks="";
	var editconsult="";
	var status;

	console.log(userlevel);
	console.log(usertype);
	console.log("in update")
	$('#saveasconsultreportxlsbutton').addClass('hiddenDiv');

	getDataRecord('/api/newconsults/get',function(consults){
		var html="";
		var Llist=[];
		var Lcount=[];
		//console.log(experts.length);
		$('#consult_report_table').addClass('hiddenDiv');
		var today=consults.filter(function(consult){
			return ((new Date(consult.consults_timestamp).toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).split("/")[0]==(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).split("/")[0]&&
					(new Date(consult.consults_timestamp).toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).split("/")[1]==(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).split("/")[1]&&
					(new Date(consult.consults_timestamp).toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).split("/")[2].split(",")[0]==(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).split("/")[2].split(",")[0]&&
					(consult.consults_type=="L2"));
			//return (new Date(data.consults_timestamp).toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).getMonth()==(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"})).getMonth();
		})
		console.log(today);

		Lcount=[];
		Llist = today.map(a => a.consults_source).filter(function(value,index,self){
			return self.indexOf(value)=== index;
		});
		Llist.forEach(function(l,index){
			var seconds=0;
			var temp=today.filter(function(lconsults){
				return l == lconsults.consults_source;
			})
			temp.forEach(function(entry){
				console.log(entry.consults_duration);
				if((entry.consults_duration=="")||(entry.consults_duration==null)||(entry.consults_duration=="NaN")){
					seconds+=0;
				}else{
					if(entry.consults_duration.length<8){
						seconds+=toSeconds("00:"+entry.consults_duration);
					}else{
						seconds+=toSeconds(entry.consults_duration);
					}
				}
			})
			if(seconds<=0){
				seconds=0;
			}
			var data={
				lkey:l,
				lcount:temp.length,
				laht:toTime(seconds/temp.length)
			}
			Lcount.push(data);
		})
		Lcount.sort((a,b)=>(a.lcount < b.lcount) ? 1 : -1);
		Lcount.forEach(function(lc){
			html='<tr><td>' + lc.lkey + '</td><td style="text-align:right">'+ lc.lcount + '</td><td style="text-align:center">'+ lc.laht + '</td></tr>';
			$("#consult_report_source_body").append(html);
		});

		Lcount=[];
		Llist = today.map(a => a.center).filter(function(value,index,self){
			return self.indexOf(value)=== index;
		});
		Llist.forEach(function(l,index){
			var seconds=0;
			var temp=today.filter(function(lconsults){
				return l == lconsults.center;
			})
			temp.forEach(function(entry){
				console.log(entry.consults_duration);
				if((entry.consults_duration=="")||(entry.consults_duration==null)||(entry.consults_duration=="NaN")){
					seconds+=0;
				}else{
					if(entry.consults_duration.length<8){
						seconds+=toSeconds("00:"+entry.consults_duration);
					}else{
						seconds+=toSeconds(entry.consults_duration);
					}
				}
			})
			if(seconds<=0){
				seconds=0;
			}
			var data={
				lkey:l,
				lcount:temp.length,
				laht:toTime(seconds/temp.length)
			}
			Lcount.push(data);
		})
		Lcount.sort((a,b)=>(a.lcount < b.lcount) ? 1 : -1);
		Lcount.forEach(function(lc){
			html='<tr><td>' + lc.lkey + '</td><td style="text-align:right">'+ lc.lcount + '</td><td style="text-align:center">'+ lc.laht + '</td></tr>';
			$("#consult_report_center_body").append(html);
		});
		
		
		
		Lcount=[];
		Llist = today.map(a => a.L2).filter(function(value,index,self){
			return self.indexOf(value)=== index;
		});
		Llist.forEach(function(l,index){
			var seconds=0;
			var temp=today.filter(function(lconsults){
				return l == lconsults.L2;
			})
			temp.forEach(function(entry){
				console.log(entry.consults_duration);
				if((entry.consults_duration=="")||(entry.consults_duration==null)||(entry.consults_duration=="NaN")){
					seconds+=0;
				}else{
					if(entry.consults_duration.length<8){
						seconds+=toSeconds("00:"+entry.consults_duration);
					}else{
						seconds+=toSeconds(entry.consults_duration);
					}
				}
			})
			if(seconds<=0){
				seconds=0;
			}
			var data={
				lkey:l,
				lcount:temp.length,
				laht:toTime(seconds/temp.length)
			}
			Lcount.push(data);
		})
		Lcount.sort((a,b)=>(a.lcount < b.lcount) ? 1 : -1);
		Lcount.forEach(function(lc){
			html='<tr><td>' + lc.lkey + '</td><td style="text-align:right">'+ lc.lcount + '</td><td style="text-align:center">'+ lc.laht + '</td></tr>';
			$("#consult_report_L2_body").append(html);
		});
		
		Lcount=[];
		Llist = today.map(a => a.L1).filter(function(value,index,self){
			return self.indexOf(value)=== index;
		});
		Llist.forEach(function(l,index){
			var seconds=0;
			var temp=today.filter(function(lconsults){
				return l == lconsults.L1;
			})
			temp.forEach(function(entry){
				console.log(entry.consults_duration);
				if((entry.consults_duration=="")||(entry.consults_duration==null)||(entry.consults_duration=="NaN")){
					seconds+=0;
				}else{
					if(entry.consults_duration.length<8){
						seconds+=toSeconds("00:"+entry.consults_duration);
					}else{
						seconds+=toSeconds(entry.consults_duration);
					}
				}
			})
			if(seconds<=0){
				seconds=0;
			}
			var data={
				lkey:l,
				lcount:temp.length,
				laht:toTime(seconds/temp.length)
			}
			Lcount.push(data);
		})
		Lcount.sort((a,b)=>(a.lcount < b.lcount) ? 1 : -1);
		Lcount.forEach(function(lc){
			html='<tr><td>' + lc.lkey + '</td><td style="text-align:right">'+ lc.lcount + '</td><td style="text-align:center">'+ lc.laht + '</td></tr>';
			$("#consult_report_expert_body").append(html);
		});
		
		Lcount=[];
		Llist = today.map(a => a.consults_reason).filter(function(value,index,self){
			return self.indexOf(value)=== index;
		});
		Llist.forEach(function(l,index){
			var seconds=0;
			var temp=today.filter(function(lconsults){
				return l == lconsults.consults_reason;
			})
			temp.forEach(function(entry){
				console.log(entry.consults_duration);
				if((entry.consults_duration=="")||(entry.consults_duration==null)||(entry.consults_duration=="NaN")){
					seconds+=0;
				}else{
					if(entry.consults_duration.length<8){
						seconds+=toSeconds("00:"+entry.consults_duration);
					}else{
						seconds+=toSeconds(entry.consults_duration);
					}
				}
			})
			if(seconds<=0){
				seconds=0;
			}
			var data={
				lkey:l,
				lcount:temp.length,
				laht:toTime(seconds/temp.length)
			}
			Lcount.push(data);
		})
		Lcount.sort((a,b)=>(a.lcount < b.lcount) ? 1 : -1);
		Lcount.forEach(function(lc){
			html='<tr><td>' + lc.lkey + '</td><td style="text-align:right">'+ lc.lcount + '</td><td style="text-align:center">'+ lc.laht + '</td></tr>';
			$("#consult_report_reason_body").append(html);
		});

		
		Lcount=[];
		Llist = today.map(a => a.product).filter(function(value,index,self){
			return self.indexOf(value)=== index;
		});
		Llist.forEach(function(l,index){
			var seconds=0;
			var temp=today.filter(function(lconsults){
				return l == lconsults.product;
			})
			temp.forEach(function(entry){
				console.log(entry.consults_duration);
				if((entry.consults_duration=="")||(entry.consults_duration==null)||(entry.consults_duration=="NaN")){
					seconds+=0;
				}else{
					if(entry.consults_duration.length<8){
						seconds+=toSeconds("00:"+entry.consults_duration);
					}else{
						seconds+=toSeconds(entry.consults_duration);
					}
				}
			})
			if(seconds<=0){
				seconds=0;
			}
			var data={
				lkey:l,
				lcount:temp.length,
				laht:toTime(seconds/temp.length)
			}
			Lcount.push(data);
		})
		Lcount.sort((a,b)=>(a.lcount < b.lcount) ? 1 : -1);
		Lcount.forEach(function(lc){
			html='<tr><td>' + lc.lkey + '</td><td style="text-align:right">'+ lc.lcount + '</td><td style="text-align:center">'+ lc.laht + '</td></tr>';
			$("#consult_report_device_body").append(html);
		});

		today.forEach(data => {
			html="<tr>" +
				//console.log((new Date(data.consults_timestamp)));
				//console.log((new Date(data.consults_timestamp).toLocaleString("en-US",{timeZone:"America/Los_Angeles"})));
				
				"<td>"+ (new Date(data.consults_timestamp).toLocaleString("en-US")) +"</td>" +
				"<td>"+ data.L1Team +"</td>" +
				"<td>"+data.L1+"</td>" +
				"<td>"+data.L2+"</td>" +
				"<td>" + data.consults_casenumber + "</td> " +
				"<td>"+ ((data.product==null)?"No device selected.":data.product) +"</td>" +
                "<td>" + data.consults_reason + "</td> " +
				"<td>" + (data.consults_opportunity.split('=-=')[0]==0?'None':(data.consults_opportunity.split('=-=')[0]+((data.consults_opportunity.split('=-=')[1]=='')?"":(":<br><br>"+data.consults_opportunity.split('=-=')[1]))))+ "</td> " +
				"<td>" + (data.consults_duration.length<8?('00:'+data.consults_duration):data.consults_duration) + "</td> " +
				"<td>"+ (((parseInt(data.consults_L1)>8000)&&(parseInt(data.consults_L1)<8100))?"IOPEX":"CNX") +"</td>" +
				"<td>" + data.consults_source + "</td> " +
				"</tr>";
			$("#consult_report_body").append(html);
		})
		$('#consult_reports_xls').removeAttr('disabled');
		$('.consult_reports').removeClass('hiddenDiv');
		$('#consult_report_loading').addClass('hiddenDiv');
	})
}