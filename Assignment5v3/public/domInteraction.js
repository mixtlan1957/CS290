
document.addEventListener('DOMContentLoaded', buildTable);
document.addEventListener('DOMContentLoaded', bindNewEntryButton);
//document.addEventListener('DOMContentLoaded', bindResetButton);



//citation: https://www.w3schools.com/js/js_validation.asp
function validateForm() {
    var x = document.forms["addWOForm"]["name"].value;
    var y = document.forms["addWOForm"]["reps"].value;
    var z = document.forms["addWOForm"]["weight"].value;
    var a = document.forms["addWOForm"]["date"].value;
    var b = document.forms["addWOForm"]["lbs"].value;
    if (x == "" || y =="" || z=="" || a=="" || b=="") {
        alert("Submission is incomplete.");
        return false;
    }
}


function buildTable() {
	
	var req = new XMLHttpRequest();
	//req.readyState = "complete";

	method = "GET";
	url = "buildTable";
	
	//citation: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
	// and: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
	req.onreadystatechange = function() {
		if(req.readyState == 4 && req.status == 200) {
			var res = JSON.parse(req.responseText);
			for (var i = 0; i < res.length; i++) {
				buildRows(res[i]);
			}

		}
		else {
			console.log("Request Status: " + req.statusText);
		}
	
	}
	
	req.open(method, url, true);
	req.send(null);
	event.preventDefault();
}



function buildRows(res) {

	//cells
	var id_CELL = document.createElement('td');
	id_CELL.className = 'cell_ID';
	id_CELL.innerHTML = res.id;

	var name_CELL = document.createElement('td');
	name_CELL.innerHTML = res.name;


	var weight_CELL = document.createElement('td');
	weight_CELL.innerHTML = res.weight;

	var reps_CELL = document.createElement('td');
	reps_CELL.innerHTML = res.reps;


	var date_CELL = document.createElement('td');
	
	dateInput = res.date.substring(0, 10);
	if(date != null) {
		date_CELL.innerHTML = dateInput;

	} 
	

	var lbs_CELL = document.createElement('td');
	temp = res.lbs;
	//false = kilos
	if(temp == 0) {
		lbs_CELL.innerHTML = 'KG';
	}
	//true = pounds
	else {
		lbs_CELL.innerHTML = 'LBS';
	}


	//delete cell
	var delete_CELL = document.createElement('td');
	var deleteButton = document.createElement('button');
	deleteButton.innerHTML = 'DELETE';
	deleteButton.type = 'submit';
	deleteButton.value = res.id;
	deleteButton.className = "deleteID_BTN";
	delete_CELL.appendChild(deleteButton);


	//update cell
	var update_CELL = document.createElement('td');
	update_CELL.innerHTML = "<a href=" + res.id + ">Update</a>" 

	
	//rows
	var row = document.createElement('tr');
	row.appendChild(id_CELL);
	row.appendChild(name_CELL);	
	row.appendChild(reps_CELL);
	row.appendChild(weight_CELL);
	row.appendChild(date_CELL);
	row.appendChild(lbs_CELL);
	row.appendChild(delete_CELL);
	row.appendChild(update_CELL);
	
	//append row to table
	var table = document.getElementById('workoutsTable');
	table.appendChild(row);



	//delete button event listener
	deleteButton.addEventListener('click', function(input) {
    var id = input;
    return function () {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          var response = JSON.parse(request.responseText);
          var table = document.getElementById('workoutsTable');
          var rowArr = document.getElementsByClassName('cell_ID');
          var i = 0;
          var found = false
          
          while (!found && i < rowArr.length) {
            if (id == Number(rowArr[i].innerHTML)) {
              found = true;
            }
            i++;
          }
          
          if (found) {
            var row = rowArr[i-1].parentNode;    
            table.removeChild(row);

          }
        }
      }
      
      request.open('GET', '/deleteEntry?id=' + id, true);
      request.send(null);
      event.preventDefault();
    };
    //buildTable();
  }(deleteButton.value)); 
  	

}



function bindNewEntryButton() {
	
	


	document.getElementById('addEntry').addEventListener('click', function(event) {
		var req = new XMLHttpRequest();
		var name = document.getElementById('name').value;
		var reps = document.getElementById('reps').value;
		var weight = document.getElementById('weight').value;
		var date = document.getElementById('date').value;
		var lbs = document.getElementById('lbs').value;

		
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status == 200) {
				var res = JSON.parse(req.responseText);
				for (var i = 0; i < res.length; i++) {
					buildRows(res[i]);
				}
			}
			else {
				console.log("Status request From Send: " + req.statusText);
			}
		}
		


		method = 'GET';
		url = '/addEntry?name=' + name + '&reps=' + reps + '&weight=' + weight + '&date=' + date + '&lbs=' + lbs;
		
		req.open(method, url, true);
		
		req.send(null);

		//manual reset of values
		document.getElementById('name').value = "";
      	document.getElementById('reps').value = "";
      	document.getElementById('weight').value = "";
      	document.getElementById('date').value = "";
      	document.getElementById('lbs').value = "";
      	
      	//append the freshly made row
      	req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status == 200) {
				var res = JSON.parse(req.responseText);
				var len = res.length;	
				buildRows(res[len-1]);
				
			}
			else {
				console.log("Status request From Send: " + req.statusText);
			}
		}



		event.preventDefault();
	});


}
/*
function bindResetButton() {
	document.getElementById('resetButton').addEventListener('click', function(event) {

		var req = new XMLHttpRequest();
		//req.onreadystatechange= function() {
			//if(req.readyState == 4 && req.status == 200) {
				url = 'reset/reset-table';
				method = 'GET';
				req.open(method, url, true);
				req.send(null);   // YIELDS ERROR FOR SOME REASON
				event.preventDefault();	
			//}
		//}
	});
}
*/