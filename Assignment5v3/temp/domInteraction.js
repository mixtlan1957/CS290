
//document.addEventListener('DOMContentLoaded', bindSendDataButton);
document.addEventListener('DOMContentLoaded', buildTable);


//citation: https://www.w3schools.com/js/js_validation.asp
function validateForm() {
    var x = document.forms["addWorkout"]["name"].value;
    if (x == "") {
        alert("Workout name must be filled out");
        return false;
    }
}


function buildTable() {
	var req = new XMLHttpRequest();

	method = "GET";
	url = "/buildTable";


	//citation: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
	
	req.onreadystatechange = function() {
		if(req.readyState ===XMLHttpRequest.DONE && req.status == 200 && req.status < 400) {
			var res = JSON.parse(req.responseText);
			for (var i = 0; i < req.length; i++) {
				buildRows(res[i]);
			}

		}
	}
	


	/*		
	req.addEventListener('load', function() {
		if(req.status >=200 && req.status < 400) {
			var res = JSON.parse(req.responseText);

			for (var i = 0; i < req.length; i++) {
				createRow(res[i]);
			}

		}
	});
	*/

	req.open(method, url, true);
	req.send(null);
	event.preventDefault();
}


function buildRows(data) {

	//cells
	var id_CELL = document.createElement('td');
	id_CELL.innerHTML = data.id;

	var name_CELL = document.createElement('td');
	name_CELL.innerHTML = data.name;


	var weight_CELL = document.createElement('td');
	weight_CELL.innerHTML = data.weight;

	var reps_CELL = document.createElement('td');
	reps_CELL.innerHTML = data.reps;


	var date_CELL = document.createElement('td');
	reps_CELL.date = substring(data.reps, 0, 10);

	var lbs_CELL = document.createElement('td');
	temp = data.lbs;
	//false = kilos
	if(temp == 0) {
		lbs_CELL.innerHTML = 'KG';
	}
	//true = pounds
	else {
		lbs_CELL.innerHTML = 'LBS';
	}

	//rows
	var row = document.createElement('tr');
	row.appendChild(id_CELL);
	row.appendChild(name_CELL);	
	row.appendChild(reps_CELL);
	row.appendChild(weight_CELL);
	row.appendChild(date_CELL);
	row.appendChild(lbs_CELL);

	//append row to table
	var table = document.getElementById('workoutsTable');
	table.appendChild(row);

}


/*
function bindSendDataButton() {
	document.getElementById('submitTable').addEventListener('click', function(event){
		var req = new XMLHttpRequest();






	})
}

*/