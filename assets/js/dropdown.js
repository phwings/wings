
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function drop(submenu) {
	var myDropdown = document.getElementsByClassName("show");
	if((myDropdown.length>0)&&(myDropdown[0].id!==submenu)){
		myDropdown[0].classList.remove('show');
	}
	document.getElementById(submenu).classList.toggle("show");
}

function hideMenu(submenu) {
	document.getElementById(submenu).classList.remove("show");
}

function showMenu(submenu) {
	document.getElementById(submenu).classList.add("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
	if (!((e.target.matches('.dropbtn'))||(e.path[1].className=='dropbtn'))) {
		var myDropdown = document.getElementsByClassName("show");
		if(myDropdown.length>0){
			myDropdown[0].classList.remove('show');
		}
	}
}
