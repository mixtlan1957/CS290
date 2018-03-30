/*********************************************************************
** Program Filename: week5Assign
** HW Assignment: DOM and Events
** Author: Mario Franco-Munoz
** Date: 02/08/2018
** Description: this program allows the page visitor to navigate around the different
** cells in a preset table as well as supplying a button that will permanently change
** the background color of a selected cell to yellow.
*********************************************************************/



//initialize table
var newTable = document.createElement("table");
newTable.style.width = "100%";

newTable.setAttribute("border", "1");



for(var i = 0; i < 4; i++) {
	
	var newRow = document.createElement("tr");
	newTable.appendChild(newRow);


	for(var j = 0; j < 4; j++) {

		if (i == 0) {
			var newHeader = document.createElement("th");
			newHeader.height = "40";
			newRow.appendChild(newHeader);
			newHeader.textContent = "Header " + (j + 1);
		}
		else {
			var newCell = document.createElement("td");
			
			newCell.id = i + j;

			newCell.height = "40";
			newCell.align = "center";

			newRow.appendChild(newCell);
			newCell.textContent = (i) + ", " + (j + 1);
		}
	}
	
}

var body = document.getElementsByTagName("body")[0];
body.appendChild(newTable);


var currentCell = document.getElementsByTagName("td")[0, 0];
currentCell.style.borderWidth = "thick";

var tempRowParent = currentCell.parentNode;


document.onkeydown = moveCell;


//this function allows the user to navigate the numbered cell elements using the arrow keys.
function moveCell(input) {

	var count = 0;

	intput = input || window.event;

	//up arrow
	if (input.keyCode == "38") {
		
		tempRowParent = currentCell.parentNode;
		if (tempRowParent.previousElementSibling != document.getElementsByTagName("tr")[0]) {
			currentCell.style.borderWidth = "thin";

			tempRowParent = tempRowParent.previousElementSibling;

			while (currentCell.previousElementSibling != null) {
				currentCell = currentCell.previousElementSibling;
				count++;
			}

			currentCell = tempRowParent.firstElementChild;

			while (count > 0) {
				currentCell = currentCell.nextElementSibling;
				count--;
			}
			currentCell.style.borderWidth = "thick";

		}



		
	}

	//down arrow
	else if (input.keyCode == "40") {
		tempRowParent = currentCell.parentNode;
		if (tempRowParent.nextElementSibling != null) {	
			currentCell.style.borderWidth = "thin";

			tempRowParent = tempRowParent.nextElementSibling;

			while (currentCell.previousElementSibling != null) {
				currentCell = currentCell.previousElementSibling;
				count++;
			}

			currentCell = tempRowParent.firstElementChild;

			while (count > 0) {
				currentCell = currentCell.nextElementSibling;
				count--;
			}
			currentCell.style.borderWidth = "thick";
		}

	}

	//left arrow
	else if (input.keyCode == "37") {
		if (currentCell.previousElementSibling != null) {
			currentCell.style.borderWidth = "thin";
			currentCell = currentCell.previousElementSibling;
			currentCell.style.borderWidth = "thick";
		}

	}

	//right arrow
	else if (input.keyCode == "39") {

		if (currentCell.nextElementSibling != null) {
			currentCell.style.borderWidth = "thin";
			currentCell = currentCell.nextElementSibling;
			currentCell.style.borderWidth = "thick";
		}
	}
}








var button = document.createElement("button");
button.textContent = "Mark Cell";
body.appendChild(button);


function changeCellColor() {
	currentCell.style.backgroundColor = "yellow";

}


button.addEventListener("click", changeCellColor);


