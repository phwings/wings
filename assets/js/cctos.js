function updateCCTOSfeedbackTable(){
	
	var remarks="";
	var editcctosfeedback="";
	var status;
	console.log(userlevel);
	console.log(usertype);
	console.log("in update")
	$('#saveascctosfeedbackxlsbutton').css('display','none');
	$('#generatecctosfeedbackl2report').css('display','none');
	$('#monthselector_l2reportcctosfeedback').css('display','none');
	getDataRecord('/api/cctosfeedback/get',function(cctosfeedback){
		//console.log(cctosfeedback);
		cctosfeedback.sort((a, b) => (a["cctosfeedback_approved"] > b["cctosfeedback_approved"]) ? 1 : -1)
		var html="";
		//console.log(experts.length);
		$('#cctosfeedback_table').css('display','none');
		$("#cctosfeedback_table").html('<thead style="text-align:center;font-weight:bold;cursor: pointer;"><tr><td onclick="sortTable(&quot;cctosfeedback_table&quot;,0)">Date</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,1)">Reported by</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,2)">Expert</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,3)">Case Number</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,4)">Product</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,5)">Reason</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,6)">Duration</td><td class="cctosfeedback_TM_column" onclick="sortTable(&quot;cctosfeedback_table&quot;,7)">TM</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,8)">Expert&quot;s Opportunity</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,9)">TM Feedback</td><td onclick="sortTable(&quot;cctosfeedback_table&quot;,10)">Expert&quot;s Commitment</td><td class="cctosfeedback_approved_column" onclick="sortTable(&quot;cctosfeedback_table&quot;,11)">Status</td><td class="cctosfeedback_approved_column" onclick="sortTable(&quot;cctosfeedback_table&quot;,13)">Remarks</td></tr></thead><tbody>');
		cctosfeedback.forEach(data => {
			commitment=data.cctosfeedback_commitment;
			//console.log(userlevel);

			html="<tr class='hiddenDiv' id='cctosfeedback_" + data.cctosfeedback_id + "'>" +
				"<td> "+ data.cctosfeedback_timestamp +"</td>" +
				"<td id='L2_"+ data.cctosfeedback_id +"'>"+data.L2+"</td>" +
				"<td id='L1_"+ data.cctosfeedback_id +"'>"+data.L1+"</td>" +
				"<td>" + data.cctosfeedback_casenumber + "</td> " +
				"<td>"+ ((data.product==null)?"No device selected.":data.product) +"</td>" +
                "<td>" + data.cctosfeedback_reason + "</td> " +
                "<td>" + data.cctosfeedback_duration + "</td> " +
				"<td class='cctosfeedback_TM_column' id='TM_"+ data.cctosfeedback_id +"'>"+data.TM+"</td>" +
				"<td>" + data.cctosfeedback_opportunity + "</td> " +
				"<td id='cctosfeedback_feedback_"+ data.cctosfeedback_id +"'> " + data.cctosfeedback_feedback + "</td> " +
				"<td id='cctosfeedback_commitment_"+ data.cctosfeedback_id +"'> " + data.cctosfeedback_commitment + "</td> " +
				"<td align='center' class='cctosfeedback_approved_column' id='cctosfeedback_approved_column_"+ data.cctosfeedback_id +"'></td> " +
				"<td align='center' class='cctosfeedback_remarks_column' id='cctosfeedback_remarks_column_"+ data.cctosfeedback_id +"'></td> " +
				"</tr>";
			$("#cctosfeedback_table").append(html);


			if((userLOB=='CCT ARLO')||(userLOB=='OS ARLO')||(userLOB=='CCT/OS ARLO')){
				$('#cctosfeedback_'+data.cctosfeedback_id).removeClass('hiddenDiv');
				//console.log("user level 2")
				
				if(data.cctosfeedback_fornotify=='0001'){
					$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("Waiting for expert's commitment.");
				}
				if(data.cctosfeedback_fornotify=='0010'){
					$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("Waiting for TM's/SME's action.");
				}
				if(usertype!='TM'){
					if(usertype!='Analyst'){
                    
                        //if((data.cctosfeedback_L2 != user.users_CES)&&(data.cctosfeedback_L1 != user.users_CES)){
                        //    $('#cctosfeedback_'+ data.cctosfeedback_id).addClass("hiddenDiv");
                        //    return;
                        //}
						$('#saveascctosfeedbackxlsbutton').css('display','none');
						$('#generatecctosfeedbackl2report').css('display','none');
						$('#monthselector_l2reportcctosfeedback').css('display','none');
						
                        if(data.cctosfeedback_L1 == user.users_CES){
                            if(data.cctosfeedback_fornotify=="0001"){
                                //console.log("no commitment");
                                $('#cctosfeedback_commitment_'+data.cctosfeedback_id).html(data.cctosfeedback_commitment?data.cctosfeedback_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment_cctosfeedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
                            }
                        }
                    }
					//console.log(data.cctosfeedback_fornotify<='0010');
					if((data.cctosfeedback_L2 == user.users_CES)){
						$('#L2_'+data.cctosfeedback_id).append("<br><i class='fa fa-edit tooltip' style='font-size:18px' onclick='editCCTOSfeedback("+ data.cctosfeedback_id +")'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
						$('#L2_'+data.cctosfeedback_id).append("<i class='fa fa-times tooltip' style='font-size:18px;color:red;float:right' onclick='if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteCCTOSfeedback("+ data.cctosfeedback_id +");};'><span class='tooltiptext' style='width:100px; font-size:12px;'>Delete this entry</span></i>");
					}
					
					if((data.cctosfeedback_approved==1)&&((data.cctosfeedback_fornotify!='0001')&&(data.cctosfeedback_fornotify!='0010'))){
						$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("Approved");
					}else if(data.cctosfeedback_approved==0){
						$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("Pending");

					}else if(data.cctosfeedback_approved==-1){
						$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("Disapproved");

					}
					$('#cctosfeedback_remarks_column_'+ data.cctosfeedback_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks_cctosfeedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39);$(&#39;#remarks_modal_cctosfeedback_source&#39;).val(&#39;L2&#39);$(&#39;#previous_remarks_cctosfeedback&#39;).html(&#39;"+data.cctosfeedback_remarks.replace('\'','`').replace('\r','<br style="mso-data-placement:same-cell;" />').replace('\n','<br style="mso-data-placement:same-cell;" />')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Add Remarks</span></i><br>");
					$('#cctosfeedback_remarks_column_'+ data.cctosfeedback_id).append(data.cctosfeedback_remarks.replace(/<br>/g,'<br style="mso-data-placement:same-cell;" />'));
					if(data.cctosfeedback_fornotify=='0100'){
						$('#cctosfeedback_' + data.cctosfeedback_id).css('background-color','#fcbdbd');
					}
				}else{
					console.log("in TM section");
					if(data.cctosfeedback_approved==1){
						$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("Approved");
					}else if(data.cctosfeedback_approved==0){
						$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("<button onclick='approveCCTOSfeedback(" + data.cctosfeedback_id + ",1)' style='width:82px'>Approve</button><br><br><button onclick='approveCCTOSfeedback(" + data.cctosfeedback_id + ",-1)' style='width:82px'>Disapprove</button>");
					}else if(data.cctosfeedback_approved==-1){
						$('#cctosfeedback_approved_column_'+ data.cctosfeedback_id).html("Disapproved");
					}
					
					//console.log(data.cctosfeedback_remarks);
					$('#cctosfeedback_remarks_column_'+ data.cctosfeedback_id).html("<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_remarks_cctosfeedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39);$(&#39;#remarks_modal_cctosfeedback_source&#39;).val(&#39;L2&#39);$(&#39;#previous_remarks_cctosfeedback&#39;).html(&#39;"+data.cctosfeedback_remarks.replace('\'','`').replace('\r','<br style="mso-data-placement:same-cell;" />').replace('\n','<br style="mso-data-placement:same-cell;" />')+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Add Remarks</span></i><br>");
					$('#cctosfeedback_remarks_column_'+ data.cctosfeedback_id).append(data.cctosfeedback_remarks.replace(/<br>/g,'<br style="mso-data-placement:same-cell;" />'));
					//console.log("'$(&#39;#modal_remarks&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#remarks_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39);$(&#39;#previous_remarks&#39;).html(&#39;"+data.cctosfeedback_remarks+"&#39;);'>");
					if(data.cctosfeedback_fornotify=='1000'){
						$('#cctosfeedback_' + data.cctosfeedback_id).css('background-color','#fcbdbd');
					}
					if(data.L1Team==userteam){
						if(data.cctosfeedback_fornotify=='0010'){
							if(!data.cctosfeedback_commitment){
								$('#cctosfeedback_commitment_'+ data.cctosfeedback_id).html("<button onclick='update_notifyCCTOSfeedback(" + data.cctosfeedback_id + ",&#39;0001&#39;)' style='width:62px'>Send to Expert</button>");
							}else{
								$('#cctosfeedback_feedback_'+ data.cctosfeedback_id).html(data.cctosfeedback_feedback?data.cctosfeedback_feedback:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_feedback_cctosfeedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#feedback_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
							}
						}
						if(data.cctosfeedback_fornotify=='0001'){
							$('#cctosfeedback_commitment_'+ data.cctosfeedback_id).html("Waiting for Expert's response");
						}
					}
				}


				

			} else {
				$('.cctosfeedback_approved_column').addClass('hiddenDiv');
				$('.cctosfeedback_TM_column').addClass('hiddenDiv');
				$('.cctosfeedback_remarks_column').addClass('hiddenDiv');
				
				if((usertype!='TM')&&(usertype!='SME')){
					if((data.cctosfeedback_fornotify=="0001")&&(data.cctosfeedback_L1==userCES)){
						//console.log("no commitment");
						$('#cctosfeedback_' + data.cctosfeedback_id).css('background-color','#fcbdbd');
						$('#cctosfeedback_'+ data.cctosfeedback_id).removeClass("hiddenDiv");
						$('#cctosfeedback_commitment_'+data.cctosfeedback_id).html(data.cctosfeedback_commitment?data.cctosfeedback_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment_cctosfeedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
						return;
					}
					
					//console.log(team);
					//console.log(userteam);
				
				}else{
					console.log('in L1 TM');
						//console.log(userteam);
					if(data.L1Team==userteam){
						console.log('show' + data.cctosfeedback_id);
						$('#cctosfeedback_'+data.cctosfeedback_id).removeClass('hiddenDiv');
						//console.log('expert team ' + team);
						//console.log('TM     team ' + userteam);
						//console.log(data.cctosfeedback_approved);
						
						if(data.cctosfeedback_approved<1){
							//console.log('not approved');
							$('#cctosfeedback_'+data.cctosfeedback_id).addClass('hiddenDiv');
						}else{
							if(data.cctosfeedback_L1==userCES){
								$('#cctosfeedback_'+data.cctosfeedback_id).removeClass('hiddenDiv');
								if(data.cctosfeedback_fornotify=='0010'){
									$('#cctosfeedback_' + data.cctosfeedback_id).css('background-color','#fcbdbd');
									$('#cctosfeedback_commitment_'+data.cctosfeedback_id).html(data.cctosfeedback_commitment?data.cctosfeedback_commitment:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_commitment&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#commitment_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");
								}
							}else{
								$('#cctosfeedback_'+data.cctosfeedback_id).removeClass('hiddenDiv');
								if(data.cctosfeedback_fornotify=='0010'){
									$('#cctosfeedback_' + data.cctosfeedback_id).css('background-color','#fcbdbd');
									if(!data.cctosfeedback_commitment){
										$('#cctosfeedback_commitment_'+ data.cctosfeedback_id).html("<button onclick='update_notifyCCTOSfeedback(" + data.cctosfeedback_id + ",&#39;0001&#39;)' style='width:62px'>Send to Expert</button>");
									}else{
										$('#cctosfeedback_feedback_'+ data.cctosfeedback_id).html(data.cctosfeedback_feedback?data.cctosfeedback_feedback:"<i class='fa fa-edit tooltip' style='font-size:18px' onclick='$(&#39;#modal_feedback&#39;).css(&#39;display&#39;,&#39;block&#39;);$(&#39;#feedback_modal_cctosfeedback_id&#39;).val(&#39;"+data.cctosfeedback_id+"&#39;);'><span class='tooltiptext' style='width:100px; font-size:12px;'>Edit this entry</span></i>");

									}
								}
								if(data.cctosfeedback_fornotify=='0001'){
									$('#cctosfeedback_commitment_'+ data.cctosfeedback_id).html("Waiting for Expert's response");
								}
							}
						}
					}
					
				}
			}
			$('#cctosfeedback_table').css('display','block');
		});
		//console.log(html);
		$('.cctosfeedback_add').removeClass('hiddenDiv');
		$('.cctosfeedback_edit').addClass('hiddenDiv');
		resetCCTOSfeedback();
		//$('#L2_cctosfeedback').css('display','block');
		$('#cctosfeedback_filter').val('');
	},);
}

function resetCCTOSfeedback(){
	var user=JSON.parse(getCookie('userdetails'));

	$('#L2_list_cctosfeedback').empty();
	$('#L2_list_cctosfeedback').append(new Option('Select L2 Expert', 0, true, true));
	$('#L2_list_cctosfeedback option').addClass('selectheader');
	
	$('.selectheader').prop('disabled','disabled');
	$('.selectheader').prop('selected','selected');
	
	$('#L2_list_cctosfeedback').val(user.users_CN);

	getDataRecord('/api/users/type/Level 1/0',function(experts){
		//console.log(experts.length);
		//$("#L1_list_cctosfeedback_source").html('');
		getDataRecord('/api/users/type/Level 2/TM',function(expertsL2){
			$("#L1_list_cctosfeedback_source").empty();
			$('#L1_list_cctosfeedback_source').append(new Option('Select Expert', 0, true, true));
			$('#L1_list_cctosfeedback_source option').addClass('selectheader');
			//console.log("in experts");
			experts=experts.concat(expertsL2);
			experts.sort((a, b) => (a["users_CN"] > b["users_CN"]) ? 1 : -1)
			experts.forEach(data => {
				//console.log(data);
				$("#L1_list_cctosfeedback_source").append(new Option(data.users_CN, data.users_CES));
			});
		},'');
	});

	getDataRecord('/api/devices',function(devices){
		$("#cctosfeedback_product").empty();
		$('#cctosfeedback_product').append(new Option('Select Product', 0, true, true));
		$('#cctosfeedback_product option').addClass('selectheader');
		//$("#cctosfeedback_product").html('');
		devices.sort((a, b) => (a["device_name"] > b["device_name"]) ? 1 : -1)
		devices.forEach(data => {
			//console.log(data);
			$("#cctosfeedback_product").append(new Option(data.device_name + "    (" + data.device_model + ")", data.device_model));
		});
	},'');
	
	$("#cctosfeedback_casenumber").val('');
    $("#cctosfeedback_invalidreason").empty();
    $('#cctosfeedback_invalidreason').append(new Option('Select Reason', 0, true, true));
    $('#cctosfeedback_invalidreason option').addClass('selectheader');
    $('#cctosfeedback_invalidreason').append(new Option('RMA', 'RMA', false, false));
    $('#cctosfeedback_invalidreason').append(new Option('Technical', 'Technical', false, false));
    $('#cctosfeedback_invalidreason').append(new Option('Process', 'Process', false, false));
    $('#cctosfeedback_invalidreason').append(new Option('Subscription', 'Subscription', false, false));
    $("#cctosfeedback_opportunity1").empty();
    $('#cctosfeedback_opportunity1').append(new Option('Select Opportunity Type', 0, true, true));
    $('#cctosfeedback_opportunity1 option').addClass('selectheader');
    $('#cctosfeedback_opportunity1').append(new Option('Technical', 'Technical', false, false));
    $('#cctosfeedback_opportunity1').append(new Option('Comms', 'Comms', false, false));
    $('#cctosfeedback_opportunity1').append(new Option('Others', 'Others', false, false));
    $("#cctosfeedback_opportunity2").val('');
    $("#cctosfeedback_duration").val('');
	$("#cctosfeedback_TM").val('');
}

function approveCCTOSfeedback(cctosfeedback_id,approve){
	data={
		cctosfeedback_id:cctosfeedback_id,
		approve:approve
	}
	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/approve" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			updateCCTOSfeedbackTable();
		},
		error:function(error){

		}
	 });
}

function updateRemarksCCTOSfeedback(cctosfeedback_id,remarks,source){
	data={
		cctosfeedback_id:cctosfeedback_id,
		cctosfeedback_remarks:remarks,
		cctosfeedback_remarks_source:source
	}
	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/updateRemarks" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			if(source=='L2'){
				updateCCTOSfeedbackTable();
			}else{
				approveCCTOSfeedback(cctosfeedback_id,0)
			}
			
		},
		error:function(error){

		}
	});
}

function editCCTOSfeedback(cctosfeedback_id){
	$('.cctosfeedback_edit').removeClass('hiddenDiv');
	$('.cctosfeedback_add').addClass('hiddenDiv');
	$('#L2_cctosfeedback').css('display','block');
	getDataRecord('/api/cctosfeedback/getSingle/'+cctosfeedback_id,function(cctosfeedback){
		getDataRecord('/api/users/CES/'+cctosfeedback[0].cctosfeedback_L2+'/a',function(L2data){
			var html4='';
			html4+=L2data[0].users_CN + "<br>";
			$('#L2_'+ data.cctosfeedback_id).append(html4);
			//console.log(html4);
		},'');
		getTM(cctosfeedback[0].cctosfeedback_L1,function(TMname,TMCES){
			$('#cctosfeedback_TM').val('');
			$('#cctosfeedback_TM').val(TMname);
			$('#cctosfeedback_TM').attr('data-tm',TMCES)
		});
		console.log(cctosfeedback);
		$('#L1_list_cctosfeedback_source').val(cctosfeedback[0].cctosfeedback_L1);
		$('#cctosfeedback_id').val(cctosfeedback_id);
		$('#cctosfeedback_casenumber').val(cctosfeedback[0].cctosfeedback_casenumber);
		$('#cctosfeedback_product').val(cctosfeedback[0].cctosfeedback_product);
		$('#cctosfeedback_duration').val(cctosfeedback[0].cctosfeedback_duration);
		$('#cctosfeedback_invalidreason').val(cctosfeedback[0].cctosfeedback_reason);
        $('#cctosfeedback_opportunity1').val(cctosfeedback[0].cctosfeedback_opportunity.split("=-=")[0]);
        $('#cctosfeedback_opportunity2').val(cctosfeedback[0].cctosfeedback_opportunity.split("=-=")[1]);
		$('#cctosfeedback_feedback').val(cctosfeedback[0].cctosfeedback_feedback);
		$('#cctosfeedback_commitment').val(cctosfeedback[0].cctosfeedback_commitment);
	});
}

function update_cctosfeedback(cctosfeedback_id,L1,L2,casenumber,product,duration,reason,opportunity1,opportunity2,feedback,commitment,datetime){
	data={
		cctosfeedback_id:cctosfeedback_id,
		L1_list_cctosfeedback_source:L1,
		L2_list_cctosfeedback:L2,
		cctosfeedback_casenumber:casenumber,
		cctosfeedback_product:product,
		cctosfeedback_duration:duration,
		cctosfeedback_invalidreason:reason,
        cctosfeedback_opportunity:opportunity1+"=-="+opportunity2,
		cctosfeedback_feedback:feedback,
		cctosfeedback_commitment:commitment,
		cctosfeedback_timestamp:datetime,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/update" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			//resetCCTOSfeedback();
			updateCCTOSfeedbackTable();
			$("#cctosfeedback_status").html("CCTOSfeedback updated.");
		},
		error:function(error){
			console.log(error);
		}
	 });
}

function save_cctosfeedback(L1,L2,casenumber,product,duration,reason,opportunity1,opportunity2,feedback,commitment,datetime){
	data={
		L1_list_cctosfeedback_source:L1,
		L2_list_cctosfeedback:L2,
		cctosfeedback_casenumber:casenumber,
		cctosfeedback_product:product,
		cctosfeedback_duration:duration,
		cctosfeedback_invalidreason:reason,
		cctosfeedback_opportunity:opportunity1 +"=-="+ opportunity2,
		cctosfeedback_feedback:feedback,
		cctosfeedback_commitment:commitment,
		cctosfeedback_timestamp:datetime,
		cctosfeedback_approved:(userLOB=='CCT/OS ARLO'?1:0),
		cctosfeedback_fornotify:(userLOB=='CCT/OS ARLO'?'0010':'1000')
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/add" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetCCTOSfeedback();
			updateCCTOSfeedbackTable();
			$("#cctosfeedback_status").html("CCT/OS Feedback recorded.");
		},
		error:function(error){
			console.log(error);
		}
	});
}

function deleteCCTOSfeedback(id){
	data={
		cctosfeedback_id:id,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/delete" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetCCTOSfeedback();
			updateCCTOSfeedbackTable();
			$("#cctosfeedback_status").html("CCTOSfeedback recorded.");
		},
		error:function(error){

		}
	});
}

function update_notifyCCTOSfeedback(cctosfeedback_id,notify){
	data={
		cctosfeedback_id:cctosfeedback_id,
		cctosfeedback_fornotify:notify
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/updateNotify" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			//resetcctosfeedback();
			updateCCTOSfeedbackTable();
			$("#cctosfeedback_status").html("cctosfeedback updated.");
		},
		error:function(error){
			console.log(error);
		}
	 });
}

function saveCommitmentCCTOSfeedback(cctosfeedback_id,commitment){
	data={
		cctosfeedback_id:cctosfeedback_id,
		cctosfeedback_commitment:commitment,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/updateCommitment" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetCCTOSfeedback();
//			updateCCTOSfeedbackTable();
			$("#cctosfeedback_status").html("CCTOSfeedback recorded.");
		},
		error:function(error){

		}
	 });
}

function saveFeedbackCCTOSfeedback(cctosfeedback_id,feedback){
	data={
		cctosfeedback_id:cctosfeedback_id,
		cctosfeedback_feedback:feedback,
	}
	console.log(data);

	$.ajax({
		type:"POST",
		url:"/api/cctosfeedback/updateFeedback" ,
		data:JSON.stringify(data),
		headers:{
			"Content-Type":"application/json"
		},
		//dataType:"json",
		success:function(data){
			//console.log(data);
			resetCCTOSfeedback();
//			updateCCTOSfeedbackTable();
			$("#cctosfeedback_status").html("CCTOSfeedback recorded.");
		},
		error:function(error){

		}
	 });
}

function saveCCTEOS(CCTEOS_casenum,CCTEOS_skills,CCTEOS_AHT,CCTEOS_status,CCTEOS_remarks){
	console.log(CCTEOS);
	num_casesCCT++;
	CCTEOS.push([CCTEOS_casenum,CCTEOS_skills,CCTEOS_AHT,CCTEOS_status,CCTEOS_remarks]);
	console.log(CCTEOS);
	localStorage.setItem("CCTEOS", JSON.stringify(CCTEOS));
	localStorage.setItem("numCasesCCT",num_casesCCT);
	clearCCTEOSinput();
}

function getCCTEOS(){
	console.log("CCTEOS" in localStorage);
	console.log("numCasesCCT" in localStorage);
	CCTEOS = ("CCTEOS" in localStorage)?JSON.parse(localStorage.getItem("CCTEOS")):[];
	num_casesCCT=localStorage.getItem("numCasesCCT");
	displayCCTEOS();
}

function clearCCTEOSinput(){
	$('#CCTEOS_casenum').val('');
	$('#CCTEOS_skills').val('CNX CCT Consult');
	$('#CCTEOS_AHT').val('')
	$('#CCTEOS_status').val('N');
	$('#CCTEOS_remarks').val('');
}

function deleteCCTEOS(index){
	CCTEOS.splice(index,1);
	num_casesCCT--;
	localStorage.setItem("CCTEOS", JSON.stringify(CCTEOS));
	localStorage.setItem("numCasesCCT",num_casesCCT);
	displayCCTEOS();
}

function editCCTEOS(index){
	$('#CCTEOS_index').val(index),
	$('#CCTEOS_casenum').val(CCTEOS[index][0]),
	$('#CCTEOS_skills').val(CCTEOS[index][1]),
	$('#CCTEOS_AHT').val(CCTEOS[index][2]),
	$('#CCTEOS_status').val(CCTEOS[index][3]),
	$('#CCTEOS_remarks').val(CCTEOS[index][4])
	$('#addCCTEOSEntry').toggleClass('hiddenDiv');
	$('#updateCCTEOSEntry').toggleClass('hiddenDiv');
}

function updateCCTEOS(index,CCTEOS_casenum,CCTEOS_skills,CCTEOS_AHT,CCTEOS_status,CCTEOS_remarks){
	$('#addCCTEOSEntry').toggleClass('hiddenDiv');
	$('#updateCCTEOSEntry').toggleClass('hiddenDiv');
	console.log(CCTEOS);
	CCTEOS[index][0]=CCTEOS_casenum;
	CCTEOS[index][1]=CCTEOS_skills;
	CCTEOS[index][2]=CCTEOS_AHT;
	CCTEOS[index][3]=CCTEOS_status;
	CCTEOS[index][4]=CCTEOS_remarks;
	console.log(CCTEOS);
	localStorage.setItem("CCTEOS", JSON.stringify(CCTEOS));
	localStorage.setItem("numCasesCCT",num_casesCCT);
	clearCCTEOSinput();
	displayCCTEOS();
}

function displayCCTEOS(){
  $('#displayCCTEOS').html('');
  console.log(num_casesCCT);
  console.log(CCTEOS);
  var CCTEOStable='<table id="CCTEOS_table" border=1 style="text-align:center;border: 1px solid black;border-spacing: 0px;border-collapse: collapse;" width="70%"><tr bgcolor="#00b04f" style="font-size:8pt;font-weight: bold;color:white"><th width="5%">#</th><th width="10%">Case #</th><th width="25%">Skill</th><th width="15%">AHT</th><th width="10%">Status<br>(Closed/Open)</th><th width="30%">Remarks</th></tr>';
  for(i=0;i<num_casesCCT;i++){
	CCTEOStable+='<tr style="font-size:8pt;"><td><div style="white-space: nowrap"><i class="fa fa-edit tooltip" style="font-size:12px;red;cursor: pointer;" onclick="editCCTEOS('+i+')"></i>&nbsp;' +(i + 1)+
	'&nbsp;<i class="fa fa-times tooltip" style="font-size:12px;color:red;cursor: pointer;" onclick="if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteCCTEOS('+i+')};"></i></div>' + 
	'</td><td>' + CCTEOS[i][0] + '</td><td>' + CCTEOS[i][1] + '</td><td>' + CCTEOS[i][2] + '</td><td>' + CCTEOS[i][3] + '</td><td>' + CCTEOS[i][4] + '</td></tr>';
  }
  CCTEOStable+='</table>';
  $('#displayCCTEOS').append(CCTEOStable);
}

function resetCCTEOS(){
  localStorage.removeItem("CCTEOS");
  localStorage.removeItem("numCasesCCT");
  num_casesCCT=0;
  CCTEOS=[];
  displayCCTEOS();
}

//============ OS EOS

function saveOSEOS(OSEOS_casenum,OSEOS_ordernum,OSEOS_concern,OSEOS_AHT,OSEOS_status,OSEOS_remarks){
	console.log(OSEOS);
	num_casesOS++;
	OSEOS.push([OSEOS_casenum,OSEOS_ordernum,OSEOS_concern,OSEOS_AHT,OSEOS_status,OSEOS_remarks]);
	console.log(OSEOS);
	localStorage.setItem("OSEOS", JSON.stringify(OSEOS));
	localStorage.setItem("numCasesOS",num_casesOS);
	clearOSEOSinput();
}

function getOSEOS(){
	console.log("OSEOS" in localStorage);
	console.log("numCasesOS" in localStorage);
	OSEOS = ("OSEOS" in localStorage)?JSON.parse(localStorage.getItem("OSEOS")):[];
	num_casesOS=localStorage.getItem("numCasesOS");
	displayOSEOS();
}

function clearOSEOSinput(){
	$('#OSEOS_casenum').val('');
	$('#OSEOS_ordernum').val('');
	$('#OSEOS_concern').val('');
	$('#OSEOS_AHT').val('')
	$('#OSEOS_status').val('N');
	$('#OSEOS_remarks').val('');
}

function deleteOSEOS(index){
	OSEOS.splice(index,1);
	num_casesOS--;
	localStorage.setItem("OSEOS", JSON.stringify(OSEOS));
	localStorage.setItem("numCasesOS",num_casesOS);
	displayOSEOS();
}

function editOSEOS(index){
	$('#OSEOS_index').val(index),
	$('#OSEOS_casenum').val(OSEOS[index][0]),
	$('#OSEOS_ordernum').val(OSEOS[index][1]),
	$('#OSEOS_concern').val(OSEOS[index][2]),
	$('#OSEOS_AHT').val(OSEOS[index][3]),
	$('#OSEOS_status').val(OSEOS[index][4]),
	$('#OSEOS_remarks').val(OSEOS[index][5])
	$('#addOSEOSEntry').toggleClass('hiddenDiv');
	$('#updateOSEOSEntry').toggleClass('hiddenDiv');
}

function updateOSEOS(index,OSEOS_casenum,OSEOS_ordernum,OSEOS_concern,OSEOS_AHT,OSEOS_status,OSEOS_remarks){
	$('#addOSEOSEntry').toggleClass('hiddenDiv');
	$('#updateOSEOSEntry').toggleClass('hiddenDiv');
	console.log(OSEOS);
	OSEOS[index][0]=OSEOS_casenum;
	OSEOS[index][1]=OSEOS_ordernum;
	OSEOS[index][2]=OSEOS_concern;
	OSEOS[index][3]=OSEOS_AHT;
	OSEOS[index][4]=OSEOS_status;
	OSEOS[index][5]=OSEOS_remarks;
	console.log(OSEOS);
	localStorage.setItem("OSEOS", JSON.stringify(OSEOS));
	localStorage.setItem("numCasesOS",num_casesOS);
	clearOSEOSinput();
	displayOSEOS();
}

function displayOSEOS(){
  $('#displayOSEOS').html('');
  console.log(num_casesOS);
  console.log(OSEOS);
  var OSEOStable='<table id="OSEOS_table" border=1 style="text-align:center;border: 1px solid black;border-spacing: 0px;border-collapse: collapse;" width="90%"><tr bgcolor="#00b04f" style="font-size:8pt;font-weight: bold;color:white"><th width="5%">#</th><th width="10%">Case #</th><th width="15%">Order Number</th><th width="20%">Concern</th><th width="15%">AHT</th><th width="10%">Status<br>(Closed/Open)</th><th width="20%">Remarks</th></tr>';
  for(i=0;i<num_casesOS;i++){
	OSEOStable+='<tr style="font-size:8pt;"><td><div style="white-space: nowrap"><i class="fa fa-edit tooltip" style="font-size:12px;red;cursor: pointer;" onclick="editOSEOS('+i+')"></i>&nbsp;' +(i + 1)+
	'&nbsp;<i class="fa fa-times tooltip" style="font-size:12px;color:red;cursor: pointer;" onclick="if(confirm(&quot;Are you sure you want to delete this entry?&quot;)){deleteOSEOS('+i+')};"></i></div>' + 
	'</td><td>' + OSEOS[i][0] + '</td><td>' + OSEOS[i][1] + '</td><td>' + OSEOS[i][2] + '</td><td>' + OSEOS[i][3] + '</td><td>' + OSEOS[i][4] + '</td><td>' + OSEOS[i][5] + '</td></tr>';
  }
  OSEOStable+='</table>';
  $('#displayOSEOS').append(OSEOStable);
}

function resetOSEOS(){
  localStorage.removeItem("OSEOS");
  localStorage.removeItem("numCasesOS");
  num_casesOS=0;
  OSEOS=[];
  displayOSEOS();
}