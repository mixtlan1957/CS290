/*********************************************************************
** Program 
** HW Assignment: Activity: Ajax Interactions
** Author: Mario Franco-Munoz
** Date: 02/015/2018
** Description: Illustrates the use of event listners for GET and POST data
** interactions with an API.  
*********************************************************************/


document.addEventListener('DOMContentLoaded', bindZipButtons);
document.addEventListener('DOMContentLoaded', bindPostButton);


function bindZipButtons() {

	document.getElementById('zipSubmit').addEventListener('click', function(event) {


		var req = new XMLHttpRequest();


		var apiKey = ',us&appid=d6093b7d4cd5781458e0f260efb1d6ba';
		var zipcode = document.getElementById('zipcodeInput').value;

		if (isNaN(zipcode) == true) {
			var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
		}
		else {
			var url = 'http://api.openweathermap.org/data/2.5/weather?zip=';
		}

		//var payload = {zipcodeInput:null};
		//payload.zipcodeInput = document.getElementById('zipcodeInput').value;
		

		req.open('GET', url + zipcode + apiKey, true);
		req.send(null);

		req.addEventListener('load', function() {
			if(req.status >= 200 && req.status < 400) {
				var response = JSON.parse(req.responseText);
				document.getElementById('description').textContent = response.weather[0].description;
				document.getElementById('temperature').textContent = response.main.temp;

			}
			else {
				console.log("Error in network request: " + req.statusText);
			}
		});

		event.preventDefault();
	});
	
}


function bindPostButton() {

	document.getElementById('postSubmit').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		var payload = {sendURL:null};
		payload.sendURL = document.getElementById('textInput').value;

		req.open('POST', 'http://httpbin.org/post', true);
		req.setRequestHeader('Content-Type', 'application/json');

		req.addEventListener('load', function() {
			if(req.status >= 200 && req.status < 400) {
				var response = JSON.parse(req.responseText);
				//document.getElementById('textInput').textContent = response.sendURL;
				document.getElementById('textOutput').textContent = response.data.sendURL;

			}
			else {
				console.log("Error in network request: " + req.statusText);
			}

		});
		req.send(JSON.stringify(payload));

		event.preventDefault();



	});

}













