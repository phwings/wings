var sysloglines;
var modes;
var rssi_chart;

function searchString(searchStr){
	$('#searchResults').val('');
	var results='';
	//console.log(sysloglines)
	if(searchStr.length>3){
		searchArray=sysloglines.filter(val => val.includes(searchStr));
		//console.log(sysloglines.filter(val => val.includes('9F72')));
		//console.log(searchArray);
		for(i=0;i<searchArray.length;i++){
			results+=searchArray[i] + "\n";
		}
	}
	return results;
}

function searchEvent(device,deviceEvent,lines){
	var searchArray=[];
	$('#searchEvent').val('');
	var results='';
	var signalQualifier='';
	var signalQualifier='Unusable';
	console.log(deviceEvent)
	switch(deviceEvent){
		case 'CameraSignalStrength':
			searchStr=new RegExp('(.*\\[CameraSignalStrength\\]\\['+device+'\\].*RSSI.*)','gi')
			'[CameraSignalStrength]['+device+']'
			break;
		case 'CameraConnectionWakeupThread':
			searchStr='CameraConnectionWakeupThread'
			break;
		case 'pirMotionAlert':
			searchStr=new RegExp('(.*'+device+'.*pirMotionAlert.*)','gi')
			break;
		case 'VideoIngressThread':
			searchStr=new RegExp('(.*VideoIngressThread.*'+device+'.*)','gi')
			break;
		case 'startUserStream':
			searchStr=new RegExp('(.*startUserStream.*'+device+'.*)','gi')
			break;
		case 'BackendAutomationApi (no device)':
			searchStr=new RegExp('(.*BackendAutomationApi.*)','gi')
			break;
		case 'BackendAutomationApi (with device)':
			searchStr=new RegExp('(.*BackendAutomationApi.*'+device+'.*)','gi')
			break;
		case 'AutomationMgr':
			searchStr=new RegExp('(.*AutomationMgr.*)','gi')
			break;
		case 'sessionInfo':
			searchStr=new RegExp('(.*user.debug.*'+device+'.*sessionInfo.*)','gi')
			break;
		case 'GatewayRecoveryThread.cpp':
			searchStr=new RegExp('(.*GatewayRecoveryThread.cpp.*)','gi')
			break;
		case 'BaseStationConnectionEvent':
			searchStr=new RegExp('(.*BaseStationConnectionEvent.*)','gi')
			break;
		case 'activeModes':
			searchStr=new RegExp('(.*activeModes.*)','gi')
			break;
		case 'UPLOAD BANDWIDTH SATURATION':
			searchStr=new RegExp('(.*UPLOAD BANDWIDTH SATURATION.*)','gi')
			break;
		case 'CAM_STATS1':
			searchStr=new RegExp('(.*'+device+'-CAM_STATS1.*)','gi')
			break;
		case 'CAM_STATS2':
			searchStr=new RegExp('(.*'+device+'-CAM_STATS2.*)','gi')
			break;
		case 'CAM_STATS3':
			searchStr=new RegExp('(.*'+device+'-CAM_STATS3.*)','gi')
			break;
		case 'startWPSListener':
			searchStr=new RegExp('(.*startWPSListener.*)','gi')
			break;
			
	}
	//if(searchStr.length>3){
		//console.log(searchStr);
		sysloglines.forEach(function(element,index){
			//console.log(element);
			if(element.match(searchStr)){
				var tempString='';
				//console.log(signalQualifier);
				if(parseInt(lines)==0){
					if((deviceEvent=='CameraSignalStrength')&&(element.includes('='))){
						
						if(element.split('RSSI=')[1]>=-30){
							signalQualifer='Amazing';
						}else if(element.split('RSSI=')[1]>=-67){
							signalQualifer='Very Good';
						}else if(element.split('RSSI=')[1]>=-70){
							signalQualifer='Okay';
						}else if(element.split('RSSI=')[1]>=-80){
							signalQualifer='Not Good';
						}
						tempString+=element + " ("+ signalQualifer + ")" + '\n';
					}else
						tempString+=element+'\n';
//					console.log('no lines');
				}else{
					for(i=(index-parseInt(lines));i<(index+parseInt(lines)+1);i++){
						if(i==index){
							if((deviceEvent=='CameraSignalStrength')&&(element.includes('='))){
							
								if(element.split('RSSI=')[1]>=-30){
									signalQualifer='Amazing';
								}else if(element.split('RSSI=')[1]>=-67){
									signalQualifer='Very Good';
								}else if(element.split('RSSI=')[1]>=-70){
									signalQualifer='Okay';
								}else if(element.split('RSSI=')[1]>=-80){
									signalQualifer='Not Good';
								}
								tempString+='====================================================\n'+element+' ('+ signalQualifer + ')' +'\n====================================================\n'
							}else{
								tempString+='====================================================\n'+sysloglines[i]+'\n====================================================\n'
							}
						} else
							tempString+=sysloglines[i]+'\n';
					}
					tempString+='\n';
				}
				searchArray.push(tempString);
			}
		})
		//searchArray=sysloglines.filter(val => val.includes(searchStr));
		//console.log(sysloglines.filter(val => val.includes('9F72')));
		//console.log(searchArray);
		for(i=0;i<searchArray.length;i++){
			results+=searchArray[i];
		}
	//}
	return results;
/*
	if(searchStr.length>3){
		searchArray=sysloglines.filter(val => val.includes(searchStr));
		//console.log(sysloglines.filter(val => val.includes('9F72')));
		//console.log(searchArray);
		for(i=0;i<searchArray.length;i++){
			results+=searchArray[i] + "\n====================================================\n";
		}
	}
	return results;*/
}


function buttonAddDirectoryToTar_Clicked()
{
	var inputDirectoryToAddToTar = document.getElementById("inputDirectoryToAddToTar");
	var directoryToAddToTar = inputDirectoryToAddToTar.value;
	if (directoryToAddToTar != "")
	{
		var delimiter = "/";
		if (directoryToAddToTar.lastIndexOf(delimiter) < directoryToAddToTar.length - 1)
		{
			directoryToAddToTar += delimiter;
		}
		
		var entryForDirectory = new TarFileEntry.directory(directoryToAddToTar);
		
		var tarFile = Globals.Instance.tarFile;
		
		tarFile.entries.push(entryForDirectory);
	}
	
	this.refreshDivTarFile();
}

function buttonAddFileToTar_Clicked()
{
	var inputFileToAddToTar = document.getElementById("inputFileToAddToTar");
	var fileToLoad = inputFileToAddToTar.files[0];		
	if (fileToLoad != null)
	{
		FileHelper.loadFileAsBinaryString
		(
			fileToLoad,
			null, // contextForCallback
			buttonAddFileToTar_Clicked2 // callback
		);
	}
}

function buttonAddFileToTar_Clicked2(fileToAdd, fileToAddAsBinaryString)
{
	var selectDirectoryToAddFileTo = document.getElementById("selectDirectoryToAddFileTo");
	var directoryToAddFileTo = selectDirectoryToAddFileTo.selectedOptions[0].text;
	if (directoryToAddFileTo == "[root]")
	{
		directoryToAddFileTo = "";
	}
	
	var fileToAddName = directoryToAddFileTo + fileToAdd.name;
	var fileToAddAsBytes = ByteHelper.stringUTF8ToBytes(fileToAddAsBinaryString);
	
	var tarFile = Globals.Instance.tarFile;
	
	var headerToClone = tarFile.entries[0].header;
	
	var tarFileEntryHeader = new TarFileEntryHeader
	(
		fileToAddName,
		headerToClone.fileMode,
		headerToClone.userIDOfOwner,
		headerToClone.userIDOfGroup,
		fileToAddAsBytes.length, // fileSizeInBytes,
		headerToClone.timeModifiedInUnixFormat, // todo
		0, // checksum,
		TarFileTypeFlag.Instances.Normal,
		headerToClone.nameOfLinkedFile,
		headerToClone.uStarIndicator,
		headerToClone.uStarVersion,
		headerToClone.userNameOfOwner,
		headerToClone.groupNameOfOwner,
		headerToClone.deviceNumberMajor,
		headerToClone.deviceNumberMinor,
		headerToClone.filenamePrefix
	);
	
	tarFileEntryHeader.checksumCalculate();
	
	var entryForFileToAdd = new TarFileEntry
	(
		tarFileEntryHeader,
		fileToAddAsBytes
	);
	
	tarFile.entries.push(entryForFileToAdd);
	
	this.refreshDivTarFile();
}

function buttonSaveAsTar_Clicked()
{
	var tarFileToSave = Globals.Instance.tarFile;
	var inputFileNameToSaveAs = document.getElementById("inputFileNameToSaveAs");
	var fileNameToSaveAs = inputFileNameToSaveAs.value;
	tarFileToSave.downloadAs(fileNameToSaveAs);
}

function inputTarFileToLoad_Change(event){
	
	var fileToLoad = event.srcElement.files[0];		
	console.log(fileToLoad);
	if (fileToLoad != null)
	{
		$('#log_file').html('Loaded file: '+fileToLoad.name);
		FileHelper.loadFileAsBinaryString
		(
			fileToLoad,
			null, // contextForCallback
			inputTarFileToLoad_Change2 // callback
		);
	} else {
		console.log("show")
		$('.hiddenClass').css('display','block');
		$('#arlobird').css('display','none');
		
	}
}

function inputTarFileToLoad_Change2(fileToLoad, fileAsBinaryString){
	$('#searchString').val('');
	$('#searchResults').val('');
	var systemLogFile=[]
	var VMBtype;
	var VMBchannel;
	fileAsBytes=pako.inflate(fileAsBinaryString,[1,2,3,4,5,6,7,8,9]);
    var fileName = fileToLoad.name;

	//console.log(fileAsBytes);
    var tarFile = TarFile.fromBytes(fileName, fileAsBytes);
	//console.log(tarFile);
	var search=getTarData(tarFile);
	//console.log(search);
	var logArchive = (search.filter(obj => Object.values(obj).some(val => val.includes('log-archive/syslog-'))));
	//console.log(logArchive);	
	for(i=0;i<logArchive.length;i++){
		var syslog=pako.inflate(logArchive[i].data,[1,2,3,4,5,6,7,8,9]);
		systemLogFile=systemLogFile.concat(ByteHelper.bytesToStringUTF8(syslog).split("\n"));
	}
	
	
	//console.log(ByteHelper.bytesToStringUTF8(syslog));
	systemLogFile.reverse();
	try{
	var wifidevs = (search.filter(obj => Object.values(obj).some(val => val.includes('wifiscan'))))[0].data.split("\n\n");
	}catch(error){
		console.log(error);
	}
	var sysloglinelatest = (search.filter(obj => Object.values(obj).some(val => val.includes('system-log'))))[0].data.split("\n").reverse();
	//console.log(wifidevs);
	//console.log(sysloglines);
	sysloglines=sysloglinelatest.concat(systemLogFile);
	//console.log(sysloglines);
	
	var lastLogDate=sysloglines[1].substring(0,15);
	try {
		VMBtype=sysloglines[sysloglines.findIndex(element => element.includes('message="{"resource":"basestation",'))].split(',')[6].split('":"VMB')[1].substring(0,4);
	} catch(error) {
		try {
		VMBtype=sysloglines[sysloglines.findIndex(element => element.includes('VMB'))].split('VMB')[1].substring(0,4);
		} catch(error) {
		console.log(error);
		VMBtype='AVD1001A';
		}
	} finally {
		try {
			VMBchannel=sysloglines[sysloglines.findIndex(element => element.includes("Current Wifi channel"))].split("system-status: ")[1].split(" ")[3];
		} catch(error) {
			console.log(error);
			VMBchannel='Unable to retrieve.';
		} finally {
			try {
				var VMBfw=sysloglines[sysloglines.findIndex(element => element.includes('{"resource":"basestation"'))].split('"swVersion":"')[1].split('"')[0];
			} catch(error){
				console.log(error);
				var VMBfw='Unable to retrieve.';
			} finally{
			
				var VMBserial=sysloglines[sysloglines.findIndex(element => element.includes('/publish/'))].split('/publish/')[1].substring(0,13);
				
				$('#VMBserial').html(VMBserial);
				if(VMBtype!=='AVD1001A'){
					$('#VMBtypename').html('VMB'+VMBtype);
				}else{
					$('#VMBtypename').html(VMBtype);
				}
				$('#VMBchannel').html(VMBchannel);
				$('#VMBfw').html(VMBfw);
				$('#lastLogDate').html(lastLogDate);
				//console.log(VMBtype);
				console.log(VMBtype);
				console.log(VMBchannel);
				switch(VMBtype){
					case '3500':
					case '4500':
						var info=new Array();
						//console.log(wifidevs)
						for(i=0;i<wifidevs.length-1;i++){
							var details=new Object();
							
							var wifi_parse=wifidevs[i].split("\n");
							//console.log(wifi_parse)
							details.SSID=wifi_parse[1].split("ESSID: ")[1].replace(/['"]+/g, '');
							details.strength=wifi_parse[3].split("Signal: ")[1].substring(0,3);
							details.channel=wifi_parse[2].split("Channel: ")[1];
							console.log(details);
							info.push(details);
						}
						console.log(info);
						break;
					case '3010':
					case '4000':
						var info=new Array();
						for(i=0;i<wifidevs.length-1;i++){
							var details=new Object();
							var wifi_parse=wifidevs[i].split("\n");
							//console.log(wifi_parse);
							var wifi_line2=wifi_parse[1].split("	");
							//console.log(wifi_line2);
							details.SSID=wifi_parse[0].split(": ")[1].replace(/['"]+/g, '');
							
							if(details.SSID.substring(0,4)=='\\x00'){
								//console.log(details.SSID.substring(0,4));
								details.SSID=details.SSID.substring(0,4) + '(truncated)';
							}
							details.strength=wifi_line2[1].split(":")[1].split(" ")[1];
							details.channel=wifi_line2[wifi_line2.length-1].split(":")[1];
							info.push(details);
						}
						break;
					case '4540':
						var info=new Array();
						console.log(wifidevs)
						//var wifidevs = (search.filter(obj => Object.values(obj).some(val => val.includes('tmp/wifiscan'))))[0].data.split("Address");
						//console.log(wifidevs);
						for(i=1;i<wifidevs.length-1;i++){
							var details=new Object();
							var wifi_parse=wifidevs[i].split("\n");
							console.log(wifi_parse)
							try{
								details.SSID=wifi_parse[1].split("ESSID:")[1].replace(/['"]+/g, '');
								details.strength=wifi_parse[3].split("Signal: ")[1].substring(0,3);
								details.channel=wifi_parse[2].split("Channel: ")[1];
								console.log(details);
								info.push(details);
							}catch(error){
								console.log(error);
								details.SSID=wifi_parse[1].split("Mode:")[1].replace(/['"]+/g, '');
								details.strength=wifi_parse[3].split("Signal level=")[1].substring(0,3);
								details.channel=wifi_parse[2].split("Channel ")[1].split(")")[0];
								//details.channel=(wifi_parse[2].split("Channel ")[1].split(")")[0].len<2)?("0"+wifi_parse[2].split("Channel ")[1].split(")")[0]):(wifi_parse[2].split("Channel ")[1].split(")")[0]);
								console.log(details);
								info.push(details);
							}
							console.log(details.SSID);
						}
						console.log(info);
						break;
					case '5000':
						var info=new Array();
						console.log(wifidevs)
						var wifidevs = (search.filter(obj => Object.values(obj).some(val => val.includes('wifiscan'))))[0].data.split("Address");
						console.log(wifidevs);
						for(i=1;i<wifidevs.length-1;i++){
							var details=new Object();
							var wifi_parse=wifidevs[i].split("\n");
							console.log(wifi_parse)
							try{
								details.SSID=wifi_parse[1].split("ESSID:")[1].replace(/['"]+/g, '');
								details.strength=wifi_parse[4].split("Signal level=")[1].substring(0,3);
								details.channel=wifi_parse[3].split("Channel ")[1].split(")")[0];
								console.log(details);
								info.push(details);
							}catch(error){
								details.SSID=wifi_parse[1].split("Mode:")[1].replace(/['"]+/g, '');
								details.strength=wifi_parse[3].split("Signal level=")[1].substring(0,3);
								details.channel=wifi_parse[2].split("Channel ")[1].split(")")[0];
								//details.channel=(wifi_parse[2].split("Channel ")[1].split(")")[0].len<2)?("0"+wifi_parse[2].split("Channel ")[1].split(")")[0]):(wifi_parse[2].split("Channel ")[1].split(")")[0]);
								console.log(details);
								info.push(details);
							}
							console.log(details.SSID);
							
							
						}
						console.log(info);
						break;
					case 'AVD1001A':
						var info=new Array();
						var wifi=searchString('scan table').split('\n');
						for(i=0;i<wifi.length-1;i++){
							var details=new Object();
							details.SSID=wifi[i].split('ssid is ')[1].split(' ,')[0];
							details.strength=wifi[i].split('rssi ')[1];
							details.channel='';
							console.log(info.filter(e => e.SSID === details.SSID).length);
							if (info.filter(e => e.SSID === details.SSID).length > 0) {
								console.log('SSID exists');
							} else {
								info.push(details);
							}
						}
						var wifidevString='<table><tr><th></th><th>SSID</th><th>Channel</th><th style="padding-left:20px;">Strength</th></tr>';
						info.sort(compare);
						for(i=0;i<info.length;i++){
							var signal_level;
							if(info[i].strength>=-30){
								signal_level=5;
							}else if(info[i].strength>=-67){
								signal_level=4;
							}else if(info[i].strength>=-70){
								signal_level=3;
							}else if(info[i].strength>=-80){
								signal_level=2;
							}else if(info[i].strength<-80){
								signal_level=1;
							}
							wifidevString+='<tr><td><img src="/assets/img/parser/wifi-'+ signal_level +'.png" width="20px"></td><td style="text-align:left;">'+ info[i].SSID+'</td><td>'+ info[i].channel.match(/(\d+)/)[0]+'</td><td style="padding-left:20px;">'+ info[i].strength+' dBm</td></tr>';
						}
						if(!info.length){
							wifidevString+='<tr><td colspan="3">No scan table found.</td></tr>'
						}
						wifidevString+='</table>';
						$('#wifi_SSID').html(wifidevString);
						displayRSSIChart(info);
						break;
				}
				console.log(info);
				if(VMBtype!=='AVD1001A'){
					var wifidevString='<table class="table_parser"><tr><th></th><th>SSID</th><th>Channel</th><th style="padding-left:20px;">Strength</th></tr>';
					console.log(info);
					info.sort(compare);
					for(i=0;i<info.length;i++){
						var signal_level;
						if(info[i].strength>=-30){
							signal_level=5;
						}else if(info[i].strength>=-67){
							signal_level=4;
						}else if(info[i].strength>=-70){
							signal_level=3;
						}else if(info[i].strength>=-80){
							signal_level=2;
						}else if(info[i].strength<-80){
							signal_level=1;
						}
						wifidevString+='<tr><td><img src="/assets/img/parser/wifi-'+ signal_level +'.png" width="20px"></td><td style="text-align:left;">'+ info[i].SSID+'</td><td>'+ info[i].channel.match(/(\d+)/)[0].match(/(\d+)/)[0]+'</td><td style="padding-left:20px;">'+ info[i].strength+' dBm</td></tr>';
					}
					wifidevString+='</table>';
					$('#wifi_SSID').html(wifidevString);
					displayRSSIChart(info);
				}else{
					try{
						var vdb_SSID=sysloglines[sysloglines.findIndex(element => element.includes('"resource":"wifi/ap"'))].split('"ssid":"')[1].split('"')[0];
						var vdb_channel=sysloglines[sysloglines.findIndex(element => element.includes('Channel:'))].split('Channel:')[1];
						var vdb_rssi=sysloglines[sysloglines.findIndex(element => element.includes('rssi:-'))].split('rssi:')[1];
						var vdb_ip=sysloglines[sysloglines.findIndex(element => element.includes('DHCP got IP:'))].split('DHCP got IP:')[1].split('^')[0];
						var vdb_mac=sysloglines[sysloglines.findIndex(element => element.includes('fetch mac address ='))].split('fetch mac address = ')[1].split(' ')[0];
						$('#vdb_details').html('<br>Video Doorbell connect to: '+ vdb_SSID + '<br>Channel: ' + vdb_channel + '<br>RSSI: ' + vdb_rssi + '<br>Mac Address: ' + vdb_mac + '<br>IP Address: ' + vdb_ip);
					}catch(error){
					}
				}
				//Globals.Instance.tarFile = tarFile;
				 
				//this.refreshDivTarFile();
			}
		}
	}
	if(VMBtype!=='AVD1001A'){
		var modeArchive = (search.filter(obj => Object.values(obj).some(val => val.includes('conf/modes/mode'))));
		var bsConfigArchive = (search.filter(obj => Object.values(obj).some(val => val.includes('conf/BasestationConfiguration.json'))));
		
		
		var entitlementArchive = search.filter(function(record){
			return record.fileName.includes('Entitlement.json');
		});

		/*for(i=0;i<logArchive.length;i++){
			var syslog=pako.inflate(logArchive[i].data,[1,2,3,4,5,6,7,8,9]);
			systemLogFile=systemLogFile.concat(ByteHelper.bytesToStringUTF8(syslog).split("\n"));
		}*/
		try{
			console.log(entitlementArchive);
			var modes=[];
			var bsConfig=JSON.parse(bsConfigArchive[0].data);
			var entitlementConfig=JSON.parse(entitlementArchive[0].data);
			console.log(entitlementConfig);	
			
			modeArchive.forEach(element=>{
				var data = JSON.parse(element.data);
				//console.log(data);
				var rules=[];
				data.rules.forEach(rule=>{
					//console.log(rule);
					var rule_settings=(search.filter(obj => Object.values(obj).some(val => val.includes(rule+".json"))));
					//console.log(JSON.parse(rule_settings[0].data));
					//console.log(JSON.parse(rule_settings[0].data).triggers);
					rules.push({"name":JSON.parse(rule_settings[0].data).name,"triggers":JSON.parse(rule_settings[0].data).triggers,"actions":JSON.parse(rule_settings[0].data).actions});
					
				});
				modes.push({"name":(data.name==""?data.type:data.name),"id":data.id,"rules":rules});

			})
			console.log(modes);
			var cameraList=[];
			var entitlementArray=[];
			console.log(entitlementConfig);
			Object.keys(entitlementConfig.features).forEach(function(element){
				entitlementConfig.features[element].id=element.substring(element.length-13);
				entitlementArray.push(entitlementConfig.features[element]);
				console.log(element.substring(element.length-13));
				cameraList.push(element.substring(element.length-13));
				$("#parser_devices").html="";
				$("#parser_devices").append(new Option(element.substring(element.length-13),element.substring(element.length-13)));
			});
		}catch(err){

		}
		
		try{
			$('#bsconfig-json').jsonViewer(bsConfig, {collapsed: true});
			//$('#mode-json').jsonViewer(modes, {collapsed: true});
			var modehtml="";
			modes.forEach(function(mode){
				if(mode.name=="disarmed"){
					modehtml+=mode.name.toUpperCase()+"<br>";
					return;
				}else{
					modehtml+=mode.name.toUpperCase()+"<br><table style='border-collapse:collapse'><tr><th>Trigger/s</th><th>Action/s</th>";
					mode.rules.forEach(function(rule){
						modehtml+="</tr>";
						if(rule.triggers[0].type=="pirMotionActive"){
							modehtml+="<td>Motion is detected on:<br>"+rule.triggers[0].deviceId+"<br>at "+rule.triggers[0].sensitivity+" sensitivity</td>";
						}
						modehtml+="<td><ul>";
						rule.actions.forEach(function(action){
							//console.log(rule);
							//console.log(action);
							if(action.type=="recordVideo"){
								modehtml+="<li>Record video on "+action.deviceId;
								if(!("timeout" in action.stopCondition)){
									modehtml+=" until activity stops</li>";
								}else{
									modehtml+=" for "+ action.stopCondition.timeout +" seconds</li>";
								}
							}else if (action.type=="pushNotification"){
								modehtml+="<li>Send push notification</li>";
							}else if (action.type=="sendEmailAlert"){
								modehtml+="<li>Send email alert to:<ul>";
								action.recipients.forEach(function(recipient){
									if(recipient="__OWNER_EMAIL__"){
										modehtml+="<li>Owner's email</li>";
									}else
										modehtml+="<li>"+recipient+"</li>";
								})
								modehtml+="</ul></li>";
							}
						})
						modehtml+="</ul></td></tr>";
					})
				}

			})
			modehtml+="</table>";
			$('#mode-json').html(modehtml);
			//$('#entitlement-json').jsonViewer(entitlementConfig, {collapsed: true});
			console.log(entitlementArray);
			var entitlementhtml="Plan:";
			//entitlementhtml+=
			entitlementhtml+="<table><tr><td>Camera</td><td>Arlo Smart</td><td>Features</td></tr>";
			entitlementArray.forEach(function(feature){
				entitlementhtml+="<tr><td>"+feature.id+"</td><td>"+(feature.arloSmartEnabled?"Enabled":"Disabled")+"</td><td>";
				entitlementhtml+=(feature.smartFeatures.videoFeatures["animalDetection"]?"CVR: On":"Animal Detection: Off")+"<br>";
				entitlementhtml+=(feature.smartFeatures.videoFeatures["animalDetection"]?"Animal Detection: On":"Animal Detection: Off")+"<br>";
				entitlementhtml+=(feature.smartFeatures.videoFeatures["packageDetection"]?"Package Detection: On":"Package Detection: Off")+"<br>";
				entitlementhtml+=(feature.smartFeatures.videoFeatures["personDetection"]?"Person Detection: On":"Person Detection: Off")+"<br>";
				entitlementhtml+=(feature.smartFeatures.videoFeatures["vehicleDetection"]?"Vehicle Detection: On":"Vehicle Detection: Off")+"<br>";
				entitlementhtml+=(feature.smartFeatures.videoFeatures["otherVideo"]?"Other Motion: On":"Other Motion: Off")+"<br></td></tr>";
			})
			entitlementhtml+="</table>";
			console.log(entitlementhtml);
			$('#entitlement-json').html(entitlementhtml);
		}catch(err){
			
		}
	}

	$('#arlobird').css('display','none');
	$('.hiddenClass').css('display','block');



	
}

function displayRSSIChart(wifi){
	var channelList = [];
	for(i=0;i<11;i++){
		channelList[i]=2412+(i*5);
	}
	//channelList[13]=2484;
	//console.log(channelList);

	//console.log(wifi)
	
	var ctx = document.getElementById('rssi_chart').getContext('2d');
	if(rssi_chart)
		rssi_chart.destroy();
	var freq=[];
	var wifidata=[];
	var labels=[];
	for(i=2401;i<2474;i++){
		freq.push(i);
		wifidata.push(null);
		if(i-2412>=0){
			if((i-2412)%5==0){
				if((((i-2412)/5)+1)<=11){
					labels.push(''+(((i-2412)/5)+1));
				}else labels.push('');
			}else labels.push('');
		}else labels.push('');
	}
	console.log(labels);
	var devices=[];
	wifi.forEach(function(element){
		if(element.channel.match(/(\d+)/)[0]<15){
			//channelList[element.channel]
			var deviceData=wifidata.slice();
			
			deviceData[channelList[element.channel.match(/(\d+)/)[0]-1]-2401-11]=-100;
			deviceData[channelList[element.channel.match(/(\d+)/)[0]-1]-2401-10]=element.strength;
			deviceData[channelList[element.channel.match(/(\d+)/)[0]-1]-2401]=element.strength;
			deviceData[channelList[element.channel.match(/(\d+)/)[0]-1]-2401+10]=element.strength;
			deviceData[channelList[element.channel.match(/(\d+)/)[0]-1]-2401+11]=-100;
			//console.log(deviceData);
			var device={
				label:element.SSID,
				data:deviceData,
				borderWidth: 1,
				spanGaps:true,
				lineTension:0,
				fill:true,
				pointBackgroundColor:'rgba(255, 99, 132, 0)',
				pointBorderColor:'rgba(255, 99, 132, 0)',
				backgroundColor:'rgba(0,0,0,0)',
				borderColor:'rgba('+Math.floor(Math.random() * 255)+', '+Math.floor(Math.random() * 255)+', '+Math.floor(Math.random() * 255)+', 1)',
				xAxisID: 'Frequency',
			}
			devices.push(device);
		}
	})
	//console.log(wifidata);
	rssi_chart = new Chart(ctx, {
		pointDot : true,
		type: 'line',
		data: {
			labels: freq,
			datasets: devices
		},
		options: {
			legend:{
				display:true
			},
/*			tooltips:{
				callbacks:{
					label: function(tooltipItem,data){
						var label=data.datasets[tooltipItem.datasetIndex].label || 'hi';
						return label;
					}
				}
			},
*/			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMax: 0,
						suggestedMin: -100,
					},
					scaleLabel:{
						display:true,
						labelString:'RSSI',
					},
				}],
				xAxes: [{
					id: 'Frequency',
					display:false,
					ticks: {
						beginAtZero: false,
					},
					scaleLabel:{
						display:false,
						labelString:'Frequency',
					},
				},
				{
					id: 'Channels',
					type: 'category',
					labels: labels,
					ticks: {
						userCallback: function(item,index){
							if(index-11>=0){
								if((index-11)%5==0){
									if((((index-11)/5)+1)<=11){
										return item;
									}
								}
							}


						},
						autoSkip: false
					},
					scaleLabel:{
						display:true,
						labelString:'Channels',
					},
					gridLines:{
						display:true
					}
				}],
			},
			title: {
				display:true,
				text: 'RSSI Levels',
			}
		}
	});
}

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const chanA = parseInt(a.channel);
  const chanB = parseInt(b.channel);
	
  let comparison = 0;
  if (chanA > chanB) {
    comparison = 1;
  } else if (chanA < chanB) {
    comparison = -1;
  } 
  
  return comparison;
}



function getTarData(tarFile){
	
	var tarFiles=[];
	for(i=0;i<tarFile.entries.length;i++){
		var tarData={fileName:'',data:'',date:''};
		tarData.fileName=tarFile.entries[i].header.fileName;
		tarData.data=ByteHelper.bytesToStringUTF8(tarFile.entries[i].dataAsBytes);
		tarData.date=ByteHelper.bytesToStringUTF8(tarFile.entries[i].header.timeModifiedInUnixFormat);
		tarFiles.push(tarData);
	}
	return tarFiles;

}

function refreshDivTarFile()
{
	var tarFile = Globals.Instance.tarFile;
	var tarFileAsDOMElement = DOMDisplayHelper.tarFileToDOMElement(tarFile);
	var divTarFile = document.getElementById("divTarFile");
	divTarFile.innerHTML = "";
	divTarFile.appendChild(tarFileAsDOMElement);	
	
	var selectDirectoryToAddFileTo = document.getElementById("selectDirectoryToAddFileTo");
	selectDirectoryToAddFileTo.innerHTML = "";
	
	var optionRoot = document.createElement("option");
	optionRoot.innerHTML = "[root]";
	selectDirectoryToAddFileTo.appendChild(optionRoot);
	
	var entriesForDirectories = tarFile.entriesForDirectories();	
	for (var i = 0; i < entriesForDirectories.length; i++)
	{
		var entry = entriesForDirectories[i];
		var option = document.createElement("option");
		option.innerHTML = entry.header.fileName;
		selectDirectoryToAddFileTo.appendChild(option);
	}
}

// extensions

function StringExtensions()
{
	// extension class
}
{
	String.prototype.padLeft = function(lengthToPadTo, characterToPadWith)
	{
		var result = this;
		
		if (characterToPadWith == null)
		{
			characterToPadWith = " ";
		}
	
		while (result.length < lengthToPadTo)
		{
			result = characterToPadWith + result;
		}
		
		return result;
	}

	String.prototype.padRight = function(lengthToPadTo, characterToPadWith)
	{
		var result = this;
		
		if (characterToPadWith == null)
		{
			characterToPadWith = " ";
		}
	
		while (result.length < lengthToPadTo)
		{
			result += characterToPadWith;
		}
		
		return result;
	}
}


// classes

function ByteHelper()
{}
{
	ByteHelper.BitsPerByte = 8;
	ByteHelper.BitsPerNibble = ByteHelper.BitsPerByte / 2;
	ByteHelper.ByteValueMax = Math.pow(2, ByteHelper.BitsPerByte) - 1;

	ByteHelper.bytesToStringHexadecimal = function(bytesToConvert)
	{
		var returnValue = "";

		var bitsPerNibble = ByteHelper.BitsPerNibble;

		for (var i = 0; i < bytesToConvert.length; i++)
		{
			var byte = bytesToConvert[i];

			for (var d = 1; d >= 0; d--)
			{
				var digitValue = byte >> (bitsPerNibble * d) & 0xF;
				var digitString = "";
				digitString += (digitValue < 10 ? digitValue : String.fromCharCode(55 + digitValue));
				returnValue += digitString;
			}

			returnValue += " ";
		}

		return returnValue;
	}

	ByteHelper.bytesToStringUTF8 = function(bytesToConvert)
	{
		var returnValue = "";

		for (var i = 0; i < bytesToConvert.length; i++)
		{
			var charCode = bytesToConvert[i];
			var character = String.fromCharCode(charCode);
			returnValue += character;
		}

		return returnValue;
	}

	ByteHelper.bytesToNumber = function(bytes)
	{
		var returnValue = 0;

		var bitsPerByte = ByteHelper.BitsPerByte;

		for (var i = 0; i < bytes.length; i++)
		{
			var byte = bytes[i];
			var byteValue = (byte << (bitsPerByte * i));
			returnValue += byteValue;
		}

		return returnValue;
	}

	ByteHelper.numberOfBytesNeededToStoreNumber = function(number)
	{
		var numberOfBitsInNumber = Math.ceil
		(
			Math.log(number + 1) / Math.log(2)
		);

		var numberOfBytesNeeded = Math.ceil
		(
			numberOfBitsInNumber 
			/ ByteHelper.BitsPerByte
		);

		return numberOfBytesNeeded;
	}

	ByteHelper.numberToBytes = function(number, numberOfBytesToUse)
	{
		var returnValues = [];

		if (numberOfBytesToUse == null)
		{
			numberOfBytesToUse = this.numberOfBytesNeededToStoreNumber
			(
				number
			);
		}

		var bitsPerByte = ByteHelper.BitsPerByte;

		for (var i = 0; i < numberOfBytesToUse; i++)
		{
			var byte = (number >> (bitsPerByte * i)) & 0xFF;
			returnValues.push(byte);
		}

		return returnValues;
	}

	ByteHelper.stringUTF8ToBytes = function(stringToConvert)
	{
		var returnValues = [];

		for (var i = 0; i < stringToConvert.length; i++)
		{
			var charCode = stringToConvert.charCodeAt(i);
			returnValues.push(charCode);
		}

		return returnValues;
	}

	ByteHelper.xorBytesWithOthers = function(bytes0, bytes1)
	{
		for (var i = 0; i < bytes0.length; i++)
		{
			bytes0[i] ^= bytes1[i];	
		}

		return bytes0;
	}
}

function ByteStream(bytes)
{
	this.bytes = bytes;  

	this.byteIndexCurrent = 0;
}
{
	// constants

	ByteStream.BitsPerByte = 8;
	ByteStream.BitsPerByteTimesTwo = ByteStream.BitsPerByte * 2;
	ByteStream.BitsPerByteTimesThree = ByteStream.BitsPerByte * 3;

	// instance methods

	ByteStream.prototype.hasMoreBytes = function()
	{
		return (this.byteIndexCurrent < this.bytes.length);
	}
	
	ByteStream.prototype.readBytes = function(numberOfBytesToRead)
	{
		var returnValue = [];

		for (var b = 0; b < numberOfBytesToRead; b++)
		{
			returnValue[b] = this.readByte();
		}

		return returnValue;
	}

	ByteStream.prototype.readByte = function()
	{
		var returnValue = this.bytes[this.byteIndexCurrent];

		this.byteIndexCurrent++;

		return returnValue;
	}

	ByteStream.prototype.readString = function(lengthOfString)
	{
		var returnValue = "";

		for (var i = 0; i < lengthOfString; i++)
		{
			var byte = this.readByte();

			if (byte != 0)
			{
				var byteAsChar = String.fromCharCode(byte);
				returnValue += byteAsChar;
			}
		}

		return returnValue;
	}

	ByteStream.prototype.writeBytes = function(bytesToWrite)
	{
		for (var b = 0; b < bytesToWrite.length; b++)
		{
			this.bytes.push(bytesToWrite[b]);
		}

		this.byteIndexCurrent = this.bytes.length;
	}

	ByteStream.prototype.writeByte = function(byteToWrite)
	{
		this.bytes.push(byteToWrite);

		this.byteIndexCurrent++;
	}

	ByteStream.prototype.writeString = function(stringToWrite, lengthPadded)
	{	
		for (var i = 0; i < stringToWrite.length; i++)
		{
			this.writeByte(stringToWrite.charCodeAt(i));
		}
		
		var numberOfPaddingChars = lengthPadded - stringToWrite.length;
		for (var i = 0; i < numberOfPaddingChars; i++)
		{
			this.writeByte(0);
		}
	}
}

function DOMDisplayHelper()
{
	// static class
}
{
	DOMDisplayHelper.tarFileEntryToDOMElement = function(tarFileEntry)
	{
		var returnValue = document.createElement("tr");

		var header = tarFileEntry.header;
		
		var td = document.createElement("td");
		td.innerHTML = header.fileName;
		returnValue.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = header.typeFlag.name;
		returnValue.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = header.fileSizeInBytes;
		returnValue.appendChild(td);

		var td = document.createElement("td");

		if (header.typeFlag.name == "Normal")
		{
			var buttonDownload = document.createElement("button");
			buttonDownload.innerHTML = "Download";
			buttonDownload.onclick = tarFileEntry.download.bind(tarFileEntry);
			td.appendChild(buttonDownload);
		}

		returnValue.appendChild(td);
		
		var td = document.createElement("td");
		var buttonDelete = document.createElement("button");
		buttonDelete.innerHTML = "Delete";
		buttonDelete.onclick = tarFileEntry.remove.bind(tarFileEntry);
		td.appendChild(buttonDelete);

		returnValue.appendChild(td);		

		return returnValue;
	}
	
	DOMDisplayHelper.tarFileToDOMElement = function(tarFile)
	{
		var returnValue = document.createElement("div");

		var pFileName = document.createElement("p");
		pFileName.innerHTML = tarFile.fileName;
		returnValue.appendChild(pFileName);

		var tableEntries = document.createElement("table");
		tableEntries.style.border = "1px solid";

		var thead = document.createElement("thead");

		var th = document.createElement("th");
		th.innerHTML = "File Name";
		th.style.border = "1px solid";
		thead.appendChild(th);

		var th = document.createElement("th");
		th.innerHTML = "Type";
		th.style.border = "1px solid";
		thead.appendChild(th);

		th = document.createElement("th");
		th.innerHTML = "Size in Bytes";
		th.style.border = "1px solid";
		thead.appendChild(th);

		tableEntries.appendChild(thead);

		for (var i = 0; i < tarFile.entries.length; i++)
		{
			var entry = tarFile.entries[i];
			var domElementForEntry = DOMDisplayHelper.tarFileEntryToDOMElement(entry);
			tableEntries.appendChild(domElementForEntry);
		}

		returnValue.appendChild(tableEntries);

		return returnValue;
	}
	
}

function FileHelper()
{
	// static class
}
{
	FileHelper.destroyClickedElement = function(event)
	{
		document.body.removeChild(event.target);
	}

	FileHelper.loadFileAsBinaryString = function(fileToLoad, contextForCallback, callback)
	{	
		
		console.log(fileToLoad)
		var fileReadr = new FileReader();
		fileReadr.readAsBinaryString(fileToLoad);
		fileReadr.onloadend = function(fileLoadedEvent)
		{
			var returnValue = null;

			if (fileLoadedEvent.target.readyState == FileReader.DONE)
			{
				returnValue = fileLoadedEvent.target.result;
			}

			callback.call
			(
				contextForCallback, 
				fileToLoad,
				returnValue
			);
		}
	
	}

	FileHelper.saveBytesAsFile = function(bytesToWrite, fileNameToSaveAs)
	{
		var bytesToWriteAsArrayBuffer = new ArrayBuffer(bytesToWrite.length);
		var bytesToWriteAsUIntArray = new Uint8Array(bytesToWriteAsArrayBuffer);
		for (var i = 0; i < bytesToWrite.length; i++) 
		{
			bytesToWriteAsUIntArray[i] = bytesToWrite[i];
		}

		var bytesToWriteAsBlob = new Blob
		(
			[ bytesToWriteAsArrayBuffer ], 
			{ type:"application/type" }
		);

		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";

		downloadLink.href = window.URL.createObjectURL(bytesToWriteAsBlob);
		downloadLink.onclick = FileHelper.destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);	
		downloadLink.click();
	}
}

function Globals()
{
	// do nothing
}
{
	Globals.Instance = new Globals();
}

// Based on specifications found at the URL
// https://en.wikipedia.org/wiki/Tar_file

function TarFile(fileName, entries)
{
	this.fileName = fileName;
	this.entries = entries;
}
{
	// constants

	TarFile.ChunkSize = 512;

	// static methods

	TarFile.fromBytes = function(fileName, bytes)
	{
		var reader = new ByteStream(bytes);

		var entries = [];

		var chunkSize = TarFile.ChunkSize;

		var numberOfConsecutiveZeroChunks = 0;

		while (reader.hasMoreBytes() == true)
		{
			var chunkAsBytes = reader.readBytes(chunkSize);

			var areAllBytesInChunkZeroes = true;

			for (var b = 0; b < chunkAsBytes.length; b++)
			{
				if (chunkAsBytes[b] != 0)
				{
					areAllBytesInChunkZeroes = false;
					break;
				}
			}

			if (areAllBytesInChunkZeroes == true)
			{
				numberOfConsecutiveZeroChunks++;

				if (numberOfConsecutiveZeroChunks == 2)
				{
					break;
				}
			}
			else
			{
				numberOfConsecutiveZeroChunks = 0;

				var entry = TarFileEntry.fromBytes(chunkAsBytes, reader);

				entries.push(entry);
			}
		}

		var returnValue = new TarFile
		(
			fileName,
			entries
		);

		return returnValue;
	}
	
	TarFile.new = function(fileName)
	{
		return new TarFile
		(
			fileName,
			[] // entries
		);
	}

	// instance methods
	
	TarFile.prototype.downloadAs = function(fileNameToSaveAs)
	{	
		FileHelper.saveBytesAsFile
		(
			this.toBytes(),
			fileNameToSaveAs
		)
	}	
	
	TarFile.prototype.entriesForDirectories = function()
	{
		var returnValues = [];
		
		for (var i = 0; i < this.entries.length; i++)
		{
			var entry = this.entries[i];
			if (entry.header.typeFlag.name == "Directory")
			{
				returnValues.push(entry);
			}
		}
		
		return returnValues;
	}
	
	TarFile.prototype.toBytes = function()
	{
		var fileAsBytes = [];		

		// hack - For easier debugging.
		var entriesAsByteArrays = [];
		
		for (var i = 0; i < this.entries.length; i++)
		{
			var entry = this.entries[i];
			var entryAsBytes = entry.toBytes();
			entriesAsByteArrays.push(entryAsBytes);
		}		
		
		for (var i = 0; i < entriesAsByteArrays.length; i++)
		{
			var entryAsBytes = entriesAsByteArrays[i];
			fileAsBytes = fileAsBytes.concat(entryAsBytes);
		}
		
		var chunkSize = TarFile.ChunkSize;
		
		var numberOfZeroChunksToWrite = 2;
		
		for (var i = 0; i < numberOfZeroChunksToWrite; i++)
		{
			for (var b = 0; b < chunkSize; b++)
			{
				fileAsBytes.push(0);
			}
		}

		return fileAsBytes;
	}
	
	// strings

	TarFile.prototype.toString = function()
	{
		var newline = "\n";

		var returnValue = "[TarFile]" + newline;

		for (var i = 0; i < this.entries.length; i++)
		{
			var entry = this.entries[i];
			var entryAsString = entry.toString();
			returnValue += entryAsString;
		}

		returnValue += "[/TarFile]" + newline;

		return returnValue;
	}
}

function TarFileEntry(header, dataAsBytes)
{
	this.header = header;
	this.dataAsBytes = dataAsBytes;
}
{
	// methods
	
	// static methods
	
	TarFileEntry.directoryNew = function(directoryName)
	{
		var header = new TarFileEntryHeader.directoryNew(directoryName);
		
		var entry = new TarFileEntry(header, []);
		
		return entry;
	}
	
	TarFileEntry.fileNew = function(fileName, fileContentsAsBytes)
	{
		var header = new TarFileEntryHeader.fileNew(fileName, fileContentsAsBytes);
		
		var entry = new TarFileEntry(header, fileContentsAsBytes);
		
		return entry;
	}
	
	TarFileEntry.fromBytes = function(chunkAsBytes, reader)
	{
		var chunkSize = TarFile.ChunkSize;
	
		var header = TarFileEntryHeader.fromBytes
		(
			chunkAsBytes
		);
	
		var sizeOfDataEntryInBytesUnpadded = header.fileSizeInBytes;	

		var numberOfChunksOccupiedByDataEntry = Math.ceil
		(
			sizeOfDataEntryInBytesUnpadded / chunkSize
		)
	
		var sizeOfDataEntryInBytesPadded = 
			numberOfChunksOccupiedByDataEntry
			* chunkSize;
	
		var dataAsBytes = reader.readBytes
		(
			sizeOfDataEntryInBytesPadded
		).slice
		(
			0, sizeOfDataEntryInBytesUnpadded
		);
	
		var entry = new TarFileEntry(header, dataAsBytes);
		
		return entry;
	}
	
	TarFileEntry.manyFromByteArrays = function(entriesAsByteArrays)
	{
		var returnValues = [];
		
		for (var i = 0; i < entriesAsByteArrays.length; i++)
		{
			var entryAsBytes = entriesAsByteArrays[i];
			var entry = TarFileEntry.fileNew
			(
				"File" + i, // hack - fileName
				entryAsBytes
			);
			
			returnValues.push(entry);
		}
		
		return returnValues;
	}
	
	// instance methods

	TarFileEntry.prototype.download = function(event)
	{
		FileHelper.saveBytesAsFile
		(
			this.dataAsBytes,
			this.header.fileName
		);
	}
	
	TarFileEntry.prototype.remove = function(event)
	{
		alert("Not yet implemented!"); // todo
	}
	
	TarFileEntry.prototype.toBytes = function()
	{
		var entryAsBytes = [];
	
		var chunkSize = TarFile.ChunkSize;
	
		var headerAsBytes = this.header.toBytes();
		entryAsBytes = entryAsBytes.concat(headerAsBytes);
		
		entryAsBytes = entryAsBytes.concat(this.dataAsBytes);

		var sizeOfDataEntryInBytesUnpadded = this.header.fileSizeInBytes;	

		var numberOfChunksOccupiedByDataEntry = Math.ceil
		(
			sizeOfDataEntryInBytesUnpadded / chunkSize
		)
	
		var sizeOfDataEntryInBytesPadded = 
			numberOfChunksOccupiedByDataEntry
			* chunkSize;
			
		var numberOfBytesOfPadding = 
			sizeOfDataEntryInBytesPadded - sizeOfDataEntryInBytesUnpadded;
	
		for (var i = 0; i < numberOfBytesOfPadding; i++)
		{
			entryAsBytes.push(0);
		}
		
		return entryAsBytes;
	}	
		
	// strings
	
	TarFileEntry.prototype.toString = function()
	{
		var newline = "\n";

		headerAsString = this.header.toString();

		var dataAsHexadecimalString = ByteHelper.bytesToStringHexadecimal
		(
			this.dataAsBytes
		);

		var returnValue = 
			"[TarFileEntry]" + newline
			+ headerAsString
			+ "[Data]"
			+ dataAsHexadecimalString
			+ "[/Data]" + newline
			+ "[/TarFileEntry]"
			+ newline;

		return returnValue
	}
	
}

function TarFileEntryHeader
(
	fileName,
	fileMode,
	userIDOfOwner,
	userIDOfGroup,
	fileSizeInBytes,
	timeModifiedInUnixFormat,
	checksum,
	typeFlag,
	nameOfLinkedFile,
	uStarIndicator,
	uStarVersion,
	userNameOfOwner,
	groupNameOfOwner,
	deviceNumberMajor,
	deviceNumberMinor,
	filenamePrefix
)
{
	this.fileName = fileName;
	this.fileMode = fileMode;
	this.userIDOfOwner = userIDOfOwner;
	this.userIDOfGroup = userIDOfGroup;
	this.fileSizeInBytes = fileSizeInBytes;
	this.timeModifiedInUnixFormat = timeModifiedInUnixFormat;
	this.checksum = checksum;
	this.typeFlag = typeFlag;
	this.nameOfLinkedFile = nameOfLinkedFile;
	this.uStarIndicator = uStarIndicator;
	this.uStarVersion = uStarVersion;
	this.userNameOfOwner = userNameOfOwner;
	this.groupNameOfOwner = groupNameOfOwner;
	this.deviceNumberMajor = deviceNumberMajor;
	this.deviceNumberMinor = deviceNumberMinor;
	this.filenamePrefix = filenamePrefix;
}
{
	TarFileEntryHeader.SizeInBytes = 500;

	// static methods
	
	TarFileEntryHeader.default = function()
	{
		var returnValue = new TarFileEntryHeader
		(
			"".padRight(100, "\0"), // fileName
			"100777 \0", // fileMode
			"0 \0".padLeft(8), // userIDOfOwner
			"0 \0".padLeft(8), // userIDOfGroup
			0, // fileSizeInBytes
			"".padRight(12, "\0"), // hack - timeModifiedInUnixFormat
			0, // checksum
			TarFileTypeFlag.Instances.Normal,		
			"".padRight(100, "\0"), // nameOfLinkedFile,
			"".padRight(6, "\0"), // uStarIndicator,
			"".padRight(2, "\0"), // uStarVersion,
			"".padRight(32, "\0"), // userNameOfOwner,
			"".padRight(32, "\0"), // groupNameOfOwner,
			"".padRight(8, "\0"), // deviceNumberMajor,
			"".padRight(8, "\0"), // deviceNumberMinor,
			"".padRight(155, "\0") // filenamePrefix	
		);		
		
		return returnValue;
	}
	
	TarFileEntryHeader.directoryNew = function(directoryName)
	{
		var header = TarFileEntryHeader.default();
		header.fileName = directoryName;
		header.typeFlag = TarFileTypeFlag.Instances.Directory;
		header.fileSizeInBytes = 0;
		header.checksumCalculate();
		
		return header;
	}
	
	TarFileEntryHeader.fileNew = function(fileName, fileContentsAsBytes)
	{
		var header = TarFileEntryHeader.default();
		header.fileName = fileName;
		header.typeFlag = TarFileTypeFlag.Instances.Normal;
		header.fileSizeInBytes = fileContentsAsBytes.length;
		header.checksumCalculate();
		
		return header;
	}

	TarFileEntryHeader.fromBytes = function(bytes)
	{
		var reader = new ByteStream(bytes);

		var fileName = reader.readString(100).trim();
		var fileMode = reader.readString(8);
		var userIDOfOwner = reader.readString(8);
		var userIDOfGroup = reader.readString(8);
		var fileSizeInBytesAsStringOctal = reader.readString(12);
		var timeModifiedInUnixFormat = reader.readBytes(12);
		var checksumAsStringOctal = reader.readString(8);
		var typeFlagValue = reader.readString(1);
		var nameOfLinkedFile = reader.readString(100);
		var uStarIndicator = reader.readString(6);
		var uStarVersion = reader.readString(2);
		var userNameOfOwner = reader.readString(32);
		var groupNameOfOwner = reader.readString(32);
		var deviceNumberMajor = reader.readString(8);
		var deviceNumberMinor = reader.readString(8);
		var filenamePrefix = reader.readString(155);
		var reserved = reader.readBytes(12);

		var fileSizeInBytes = parseInt
		(
			fileSizeInBytesAsStringOctal.trim(), 8
		);
		
		var checksum = parseInt
		(
			checksumAsStringOctal, 8
		);		
		
		var typeFlags = TarFileTypeFlag.Instances._All;
		var typeFlagID = "_" + typeFlagValue;
		var typeFlag = typeFlags[typeFlagID];

		var returnValue = new TarFileEntryHeader
		(
			fileName,
			fileMode,
			userIDOfOwner,
			userIDOfGroup,
			fileSizeInBytes,
			timeModifiedInUnixFormat,
			checksum,
			typeFlag,
			nameOfLinkedFile,
			uStarIndicator,
			uStarVersion,
			userNameOfOwner,
			groupNameOfOwner,
			deviceNumberMajor,
			deviceNumberMinor,
			filenamePrefix
		);

		return returnValue;
	}

	// instance methods
	
	TarFileEntryHeader.prototype.checksumCalculate = function()
	{	
		var thisAsBytes = this.toBytes();
	
		// The checksum is the sum of all bytes in the header,
		// except we obviously can't include the checksum itself.
		// So it's assumed that all 8 of checksum's bytes are spaces (0x20=32).
		// So we need to set this manually.
						
		var offsetOfChecksumInBytes = 148;
		var numberOfBytesInChecksum = 8;
		var presumedValueOfEachChecksumByte = " ".charCodeAt(0);
		for (var i = 0; i < numberOfBytesInChecksum; i++)
		{
			var offsetOfByte = offsetOfChecksumInBytes + i;
			thisAsBytes[offsetOfByte] = presumedValueOfEachChecksumByte;
		}
		
		var checksumSoFar = 0;

		for (var i = 0; i < thisAsBytes.length; i++)
		{
			var byteToAdd = thisAsBytes[i];
			checksumSoFar += byteToAdd;
		}		

		this.checksum = checksumSoFar;
		
		return this.checksum;
	}
	
	TarFileEntryHeader.prototype.toBytes = function()
	{
		var headerAsBytes = [];
		var writer = new ByteStream(headerAsBytes);
		
		var fileSizeInBytesAsStringOctal = (this.fileSizeInBytes.toString(8) + " ").padLeft(12, " ")
		var checksumAsStringOctal = (this.checksum.toString(8) + " \0").padLeft(8, " ");

		writer.writeString(this.fileName, 100);
		writer.writeString(this.fileMode, 8);
		writer.writeString(this.userIDOfOwner, 8);
		writer.writeString(this.userIDOfGroup, 8);
		writer.writeString(fileSizeInBytesAsStringOctal, 12);
		writer.writeBytes(this.timeModifiedInUnixFormat);
		writer.writeString(checksumAsStringOctal, 8);
		writer.writeString(this.typeFlag.value, 1);		
		writer.writeString(this.nameOfLinkedFile, 100);
		writer.writeString(this.uStarIndicator, 6);
		writer.writeString(this.uStarVersion, 2);
		writer.writeString(this.userNameOfOwner, 32);
		writer.writeString(this.groupNameOfOwner, 32);
		writer.writeString(this.deviceNumberMajor, 8);
		writer.writeString(this.deviceNumberMinor, 8);
		writer.writeString(this.filenamePrefix, 155);
		writer.writeString("".padRight(12, "\0")); // reserved

		return headerAsBytes;
	}		
		
	// strings

	TarFileEntryHeader.prototype.toString = function()
	{		
		var newline = "\n";
	
		var returnValue = 
			"[TarFileEntryHeader "
			+ "fileName='" + this.fileName + "' "
			+ "typeFlag='" + (this.typeFlag == null ? "err" : this.typeFlag.name) + "' "
			+ "fileSizeInBytes='" + this.fileSizeInBytes + "' "

			/*
			+ "fileMode='" + "[value]" + "' "
			+ "userIDOfOwner='" + "[value]" + "' "
			+ "userIDOfGroup='" + "[value]" + "' "
			+ "timeModifiedInUnixFormat='" + "[value]" + "' "
			+ "checksum='" + "[value]" + "' "
			+ "nameOfLinkedFile='" + "[value]" + "' "
			+ "uStarIndicator='" + "[value]" + "' "
			+ "uStarVersion='" + "[value]" + "' "
			+ "userNameOfOwner='" + "[value]" + "' "
			+ "groupNameOfOwner='" + "[value]" + "' "
			+ "deviceNumberMajor='" + "[value]" + "' "
			+ "deviceNumberMinor='" + "[value]" + "' "
			+ "filenamePrefix='" + "[value]" + "' "
			*/

			+ "]"
			+ newline;

		return returnValue;
	}
}	

function TarFileTypeFlag(value, name)
{
	this.value = value;
	this.id = "_" + this.value;
	this.name = name;
}
{
	TarFileTypeFlag.Instances = new TarFileTypeFlag_Instances();

	function TarFileTypeFlag_Instances()
	{
		this.Normal 		= new TarFileTypeFlag("0", "Normal");
		this.HardLink 		= new TarFileTypeFlag("1", "Hard Link");
		this.SymbolicLink 	= new TarFileTypeFlag("2", "Symbolic Link");
		this.CharacterSpecial 	= new TarFileTypeFlag("3", "Character Special");
		this.BlockSpecial 	= new TarFileTypeFlag("4", "Block Special");
		this.Directory		= new TarFileTypeFlag("5", "Directory");
		this.FIFO		= new TarFileTypeFlag("6", "FIFO");
		this.ContiguousFile 	= new TarFileTypeFlag("7", "Contiguous File");

		// Additional types not implemented:
		// 'g' - global extended header with meta data (POSIX.1-2001)
		// 'x' - extended header with meta data for the next file in the archive (POSIX.1-2001)
		// 'A'–'Z' - Vendor specific extensions (POSIX.1-1988)
		// [other values] - reserved for future standardization

		this._All = 
		[
			this.Normal,
			this.HardLink,
			this.SymbolicLink,
			this.CharacterSpecial,
			this.BlockSpecial,
			this.Directory,
			this.FIFO,
			this.ContiguousFile,
		];

		for (var i = 0; i < this._All.length; i++)
		{
			var item = this._All[i];
			this._All[item.id] = item;
		}
	}
}
