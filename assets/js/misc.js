function titleCase(string) {
	var sentence = string.toLowerCase().split(" ");
	for(var i = 0; i< sentence.length; i++){
	   sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
	}
	sentence.splice(2,sentence.length-2)
	return sentence.join(" ");
}

function daysInMonth(month,year) {
    return new Date(year, month-1, 0).getDate();
}

function getSundays(month,callback){
	var d = new Date('2020',month-1);
	console.log(d);
	var getTot = daysInMonth(d.getMonth(),d.getFullYear()); //Get total days in a month
	var sun = new Array();   //Declaring array for inserting Sundays

	for(var i=1;i<=getTot;i++){    //looping through days in month
		var newDate = new Date(d.getFullYear(),d.getMonth(),i)
		if(newDate.getDay()==0){   //if Sunday
			sun.push(i);
		}
	}
	if(callback)
		callback(sun)
	else
		return sun
}

function sortTable(tablename,n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById(tablename);
	switching = true;
	// Set the sorting direction to ascending:
	dir = "desc";
	/* Make a loop that will continue until
	no switching has been done: */
	while (switching) {
	  // Start by saying: no switching is done:
	  switching = false;
	  console.log(table);
	  rows = table.rows;
	  console.log(rows);
	  /* Loop through all table rows (except the
	  first, which contains table headers): */
	  for (i = 0; i < (rows.length - 1); i++) {
		// Start by saying there should be no switching:
		shouldSwitch = false;
		/* Get the two elements you want to compare,
		one from current row and one from the next: */
		x = rows[i].getElementsByTagName("td")[n];
		y = rows[i + 1].getElementsByTagName("td")[n];
		/* Check if the two rows should switch place,
		based on the direction, asc or desc: */
		console.log(x);
		console.log(y);
		if (dir == "asc") {
		  if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
			// If so, mark as a switch and break the loop:
			shouldSwitch = true;
			break;
		  }
		} else if (dir == "desc") {
		  if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
			// If so, mark as a switch and break the loop:
			shouldSwitch = true;
			break;
		  }
		}
	  }
	  if (shouldSwitch) {
		/* If a switch has been marked, make the switch
		and mark that a switch has been done: */
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
		// Each time a switch is done, increase this count by 1:
		switchcount ++;
	  } else {
		/* If no switching has been done AND the direction is "asc",
		set the direction to "desc" and run the while loop again. */
		if (switchcount == 0 && dir == "asc") {
		  dir = "desc";
		  switching = true;
		}
	  }
	}
}

function sortTableNum(tablename,n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById(tablename);
	switching = true;
	// Set the sorting direction to ascending:
	dir = "desc";
	/* Make a loop that will continue until
	no switching has been done: */
	while (switching) {
	  // Start by saying: no switching is done:
	  switching = false;
	  console.log(table);
	  rows = table.rows;
	  console.log(rows);
	  /* Loop through all table rows (except the
	  first, which contains table headers): */
	  for (v = 0; v < (rows.length - 2); v++) {
		for (i = 1; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
			one from current row and one from the next: */
			x = rows[v].getElementsByTagName("td")[n];
			y = rows[i].getElementsByTagName("td")[n];
			/* Check if the two rows should switch place,
			based on the direction, asc or desc: */
			console.log(x);
			console.log(y);
			if (dir == "asc") {
			if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
				// If so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
			}
			} else if (dir == "desc") {
			if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
				// If so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
			}
			}
		}
	}
	  if (shouldSwitch) {
		/* If a switch has been marked, make the switch
		and mark that a switch has been done: */
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
		// Each time a switch is done, increase this count by 1:
		switchcount ++;
	  } else {
		/* If no switching has been done AND the direction is "asc",
		set the direction to "desc" and run the while loop again. */
		if (switchcount == 0 && dir == "asc") {
		  dir = "desc";
		  switching = true;
		}
	  }
	}
}

function tablesToExcel (tables, wsnames, appname) {
	var uri = 'data:application/vnd.ms-excel;base64,'
	, tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
	  + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
	  + '<Styles>'
	  + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
	  + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
	  + '</Styles>' 
	  + '{worksheets}</Workbook>'
	, tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
	, tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
	, base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
	, format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
	  var ctx = "";
	  var workbookXML = "";
	  var worksheetsXML = "";
	  var rowsXML = "";

	  for (var i = 0; i < tables.length; i++) {
		if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
		for (var j = 0; j < tables[i].rows.length; j++) {
		  rowsXML += '<Row>'
		  for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
			var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
			var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
			var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
			dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML.replace(new RegExp("<br>", "g"), "\r\n");
			var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
			dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
			ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':''
				   , nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String'
				   , data: (dataFormula)?'':dataValue
				   , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
				  };
			rowsXML += format(tmplCellXML, ctx);
		  }
		  rowsXML += '</Row>'
		}
		ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
		worksheetsXML += format(tmplWorksheetXML, ctx);
		rowsXML = "";
	  }

	  ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
	  workbookXML = format(tmplWorkbookXML, ctx);

	  var link = document.createElement("A");
	  link.href = uri + base64(workbookXML);
	  link.download = (new Date().toLocaleString("en-US").replace(new RegExp("/", "g"), "-").split(',')[0])+'.xls' || 'Workbook.xls';
	  link.target = '_blank';
	  document.body.appendChild(link);
	  link.click();
	  document.body.removeChild(link);
	}


function exportTableToExcelSheet(tables,name){


	var uri = 'data:application/vnd.ms-excel;base64,'
		,
		template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
		, base64 = function (s) {
			return window.btoa(unescape(encodeURIComponent(s)))
		}
		, format = function (s, c) {
			return s.replace(/{(\w+)}/g, function (m, p) {
				return c[p];
			})
		}
	var a = document.createElement('a');
	a.href = uri
	tables.forEach(function(table){
		if (!table.nodeType) table = document.getElementById(table)
		var ctx = {worksheet: table || 'Worksheet', table: table.innerHTML}
		a.href += base64(format(template, ctx))
	})
	
	a.download = name+'.xls';
	//triggering the function
	a.click();
	
}

function exportTableToExcel(tableID, filename = ''){
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, ' ').replace(/<i.*?\/i>/sgi, "").replace(/Add Remarks/gi,"").replace(/<br><br>/gi,"");
    
	// Specify file name
	window.open('data:application/vnd.ms-excel;base64,' + btoa(unescape(encodeURIComponent(tableHTML))));
}

function copyToCB(value) {
    var tempInput = document.createElement("textarea");
	tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value.replace(/<br>/gi,'\n');
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function tableToExcel(table, name, filename) {
	let uri = 'data:application/vnd.ms-excel;base64,', 
	template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>', 
	base64 = function(s) {
		try{
			window.btoa(unescape(decodeURIComponent(encodeURIComponent(s))))
		}catch(error){
			console.log(s)
		}finally{
			return window.btoa(unescape(decodeURIComponent(encodeURIComponent(s)))) 
		}
	},
	format = function(s, c) { 
		return s.replace(/{(\w+)}/g, function(m, p) { 
			return c[p]; 
		})
	}
	
	if (!table.nodeType) table = document.getElementById(table)
	var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}

	var link = document.createElement('a');
	link.download = filename;
	link.href = uri + base64(format(template, ctx));
	link.click();
}

function toSeconds(time){
	timeSplit=time.split(':');
	//console.log( (parseInt(timeSplit[0])*60*60)+(parseInt(timeSplit[1])*60)+parseInt(timeSplit[2]))
	if(time.length<2){
		return 0
	}else{
		return (parseInt(timeSplit[0])*60*60)+(parseInt(timeSplit[1])*60)+parseInt(timeSplit[2])
	}
}

function toTime(seconds){
	if(seconds==0){
		return "00:00:00";
	}else{
		hours=parseInt(seconds/3600);
		mins=parseInt(parseInt(seconds/60)%60);
		secs=parseInt(seconds%60);
		return ('0'+hours).slice(-2)+':'+('0'+mins).slice(-2)+':'+('0'+secs).slice(-2);
	}
}

function addTime(time1,time2,callback){
	//console.log(time1);
	//console.log(time2);
	var totalSeconds=toSeconds(time1)+toSeconds(time2);
	
	hours=parseInt(totalSeconds/3600);
	mins=parseInt(totalSeconds/60)%60;
	secs=totalSeconds%60;

	if(callback)
		callback(hours+':'+mins+':'+secs);
	else
		return hours+':'+mins+':'+secs;
}

function loadEmergency(){
	window.open("http://10.54.108.15/emergency","_self");
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getCookie(cname) {
	//console.log(document.cookie);
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  	var c = ca[i];
	  	while (c.charAt(0) == ' ') {
			c = c.substring(1);
	 	}
	 	if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
	  	}
	}
	return "";
}

function openKB(KB){
	window.open("https://kb.arlo.com/"+KB,'KB', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,top='+300+',right='+300);
}

function openSite(site,appsim){
	if(appsim)
		window.open(site,'External Site', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=380,height=760,top='+20+',right='+300)
	else
		window.open(site,'External Site', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,top='+300+',right='+300);
}

function getTM(CES,callback){
	//console.log(CES);
	getDataRecord('/api/users/CES/'+CES+'/a',function(userdata){
		console.log(userdata);
		
			getDataRecord('/api/users/getteam/'+userdata[0].users_team,function(team){
				console.log(team);
				var TM = team.find(o => o.users_type.split(" ")[2] == "TM");
				console.log(TM);
				try{
					callback(TM.users_CN,TM.users_CES);
				}catch(err){
					callback('not found, check database',0);
				}finally{
				}
			},'');
		
	},'');
}

function getTeam(CES,callback){
	getDataRecord('/api/users/CES/'+CES+'/a',function(userdata){
		//console.log(userdata);
		if(callback){
			//console.log('in callback');
			callback(userdata[0].users_team);
		}else{
			//console.log(userdata[0].users_team);
			return userdata[0].users_team;
		}
	},'');	
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
  
function sortSelect(selector){
    $('#' + selector).html($('#' + selector).find('option').sort(function(x, y) {
        return $(x).text() > $(y).text() ? 1 : -1;
    }));
}

function roundDown(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}

function getDataRecord(api,callback,data){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', api)
	xhr.send();
	xhr.onload = function() {
		if (xhr.status != 200) { // analyze HTTP status of the response
			console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
		} else {
			//console.log(xhr.response);
			callback(JSON.parse(xhr.response).data,data);
		}
	}
	xhr.onerror = function() {
	  console.log("Request failed");
	};
}

function getExpertName(selector){
	getDataRecord('/api/metric/names',populateExpertSelect,selector);
}

function getTeamName(selector){
	getDataRecord('/api/metric/teams',populateTeamSelect,selector);
}

function selectElementContents(el,callback) {
	var body = document.body, range, sel;
	if (document.createRange && window.getSelection) {
		range = document.createRange();
		sel = window.getSelection();
		sel.removeAllRanges();
		try {
			range.selectNodeContents(el);
			sel.addRange(range);
		} catch (e) {
			range.selectNode(el);
			sel.addRange(range);
		}
	} else if (body.createTextRange) {
		range = body.createTextRange();
		range.moveToElementText(el);
		range.select();

	}
	document.execCommand("Copy");
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = "Report copied to clipboard.";
	if(callback){
		callback();
	}
}

function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy report to clipboard";
}

function filter(tablename,filtername){
	$("#"+tablename).unmark();
	var value = $("#"+filtername+"").val().toLowerCase();
	$("table#"+tablename+">tbody>tr").filter(function() {$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	});
	$("#"+tablename).mark(value);
}

function searchTagging(){
	$('#tagging_suggestions').unmark();
	$('#tagging_suggestions').html("<thead><th>Subtype</th><th>Problem</th><th>Symptom</th><th>RootCause</th></thead>");
	var htmlSuggestion='';
	console.log($('#tagging_keywords').val())
	if($('#tagging_keywords').val()!=""){
		var deviceTagsSearched=[];
		var deviceTags=taggingCodes.filter(element =>
			element["tagging_device"]==$("#tagging_device").val()
		)
		var keywordArray=[];
		console.log($('input[name="searchType"]:checked').val());
		if($('input[name="searchType"]:checked').val()=="whole"){
			deviceTagsSearched=deviceTags.filter(element => 
				element.tagging_subtype.toLowerCase().includes($('#tagging_keywords').val().toLowerCase())||
				element.tagging_problem.toLowerCase().includes($('#tagging_keywords').val().toLowerCase())||
				element.tagging_symptom.toLowerCase().includes($('#tagging_keywords').val().toLowerCase())||
				element.tagging_root.toLowerCase().includes($('#tagging_keywords').val().toLowerCase())
			);

		}else{
			keywordArray=$('#tagging_keywords').val().split(" ");
			keywordArray.forEach(function(keyword){
				console.log(keyword);
				deviceTagsSearched=deviceTagsSearched.concat(deviceTags.filter(element => 
					element.tagging_subtype.toLowerCase().includes(keyword.toLowerCase())||
					element.tagging_problem.toLowerCase().includes(keyword.toLowerCase())||
					element.tagging_symptom.toLowerCase().includes(keyword.toLowerCase())||
					element.tagging_root.toLowerCase().includes(keyword.toLowerCase())
				));
			})

		}
		deviceTagsSearched=[...new Set(deviceTagsSearched)]
		deviceTagsSearched.forEach(function(tag){
			htmlSuggestion+="<tr><td>"+tag.tagging_subtype+"</td><td>"+tag.tagging_problem+"</td><td>"+tag.tagging_symptom+"</td><td>"+tag.tagging_root+"</td></tr>"
		})

		$('#tagging_suggestions').append(htmlSuggestion);
		if($('input[name="searchType"]:checked').val()=="whole"){
			$('#tagging_suggestions').mark($('#tagging_keywords').val());
			$('#tagging_keywords').mark($('#tagging_keywords').val())
		}else{
			keywordArray.forEach(function(keyword){
				$('#tagging_suggestions').mark(keyword);
				$('#tagging_keywords').mark(keyword);
			});
		}
	}
}

function taggingChange(field,next){
	
	console.log($("#tagging_"+field).val());
	if(field=='device'){
		$('#tagging_keywords').prop("disabled",false);
		$('#tagging_keywords').val("");
		$('#tagging_keywords').attr("placeholder","Type search words");
		changeTags=taggingCodes.filter(element =>
			element["tagging_"+field]==$("#tagging_"+field).val()
		)
		$("#tagging_subtype").empty();
		$("#tagging_subtype").append(new Option('--None--', 0, true, true));
		$("#tagging_problem").empty();
		$("#tagging_problem").append(new Option('--None--', 0, true, true));
		$("#tagging_symptom").empty();
		$("#tagging_symptom").append(new Option('--None--', 0, true, true));
		$("#tagging_root").empty();
		$("#tagging_root").append(new Option('--None--', 0, true, true));
	} else if(field=='subtype'){
		changeTags=taggingCodes.filter(element =>
			element.tagging_device==$("#tagging_device").val()&&element["tagging_"+field]==$("#tagging_"+field).val()
		)
		$("#tagging_problem").empty();
		$("#tagging_problem").append(new Option('--None--', 0, true, true));
		$("#tagging_symptom").empty();
		$("#tagging_symptom").append(new Option('--None--', 0, true, true));
		$("#tagging_root").empty();
		$("#tagging_root").append(new Option('--None--', 0, true, true));
	} else if(field=='problem'){
		changeTags=taggingCodes.filter(element =>
			element.tagging_device==$("#tagging_device").val()&&element.tagging_subtype==$("#tagging_subtype").val()&&element["tagging_"+field]==$("#tagging_"+field).val()
		)
		$("#tagging_symptom").empty();
		$("#tagging_symptom").append(new Option('--None--', 0, true, true));
		$("#tagging_root").empty();
		$("#tagging_root").append(new Option('--None--', 0, true, true));
	} else if(field=='symptom'){
		changeTags=taggingCodes.filter(element =>
			element.tagging_device==$("#tagging_device").val()&&element.tagging_subtype==$("#tagging_subtype").val()&&element.tagging_problem==$("#tagging_problem").val()&&element["tagging_"+field]==$("#tagging_"+field).val()
		)
		$("#tagging_root").empty();
		$("#tagging_root").append(new Option('--None--', 0, true, true));
	}
	console.log(changeTags);
	console.log(next);

	$("#tagging_"+next+" option").addClass('selectheader');
	$("#tagging_"+next+" option").attr('disabled','disabled');
	var uniqueTags=changeTags.map(function(a){
		return a["tagging_"+next]
	});
	uniqueTags=[...new Set(uniqueTags)]
	console.log(uniqueTags);
	uniqueTags.sort((a, b) => (a > b) ? 1 : -1)
	uniqueTags.forEach(data => {
		//console.log(data);
		$("#tagging_"+next).append(new Option(data, data));
	});
	
}

function openTab(tabs,tab) {
	$('.'+tabs).css('display','none');
	$('.'+tabs).addClass('hiddenDiv');
	$('.tab_button').css('background-color','white').removeClass('callbackDisplayed');
	$('.tab_button').css('color','black');
	$('.'+tabs+'#'+tab).css('display','block');
	$('.'+tabs+'#'+tab).removeClass('hiddenDiv');
	$('.tab_button#'+tab).css('background-color','green');
	$('.tab_button#'+tab).css('color','white');
	getDashboardNotifications()
}