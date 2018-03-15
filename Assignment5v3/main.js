
//html!
var html = require('html');


//express!
var express = require('express');
var app = express();

//express-handlebars!
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

//bodyParser!
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//set dependencies
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7863);


//mysql connection info
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_francomm',
  password        : '7863',
  database        : 'cs340_francomm'
});



app.set('mysql', mysql);



//staic folder path
app.use(express.static(__dirname + '/public'));



//build table
app.get('/buildTable', function(req, res, next) {
	pool.query('SELECT * FROM workouts', function(err, rows, fields) {
		if(err) {
			next(err);
			return;
		}
		res.send(JSON.stringify(rows));
	});
});


app.get('/addEntry', function(req, res, next){
	var errorFlag = false;

	if(req.query.name == '' || req.query.reps == '' || req.query.date == '' || req.query.lbs == '') {
		errorFlag = true;
	}

	if (errorFlag == false){
		pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)",
			[req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], 
			function(err, result) {
			if(err) {
				next(err);
				return;
			}

			pool.query("SELECT * FROM workouts", function(err, rows, fields) {
				if(err) {
					next(err);
					return;
				}
				res.send(JSON.stringify(rows));
			});
		});
	}
	else {
		return;
	}
});




//delete rows/entries from table
app.get('/deleteEntry', function(req, res, next) {
	pool.query("DELETE FROM workouts WHERE id = (?)", [req.query.id], function(err, result){
		if(err) {
			next(err);
			return;
		}
		res.send(JSON.stringify(result));
	});
});


//update an existing row
function getWorkout(res, mysql, context, id, complete) {
	var sql = "SELECT id, name, reps, weight, DATE_FORMAT(date, '%Y-%m-%d') AS date, lbs FROM workouts WHERE id = ?";
	var inserts = [id];
	pool.query(sql, inserts, function(error, results, fields) {
		if(error) {
			res.write(JSON.stringify(error));
			res.end();
		}
		context.workouts = results[0];
		complete();
	});
}

app.get('/:id', function(req, res) {
	callbackCount = 0;
	var context = {};
	//context.jsscripts["validateForm.js"];
	var mysql = req.app.get('mysql');
	getWorkout(res, mysql, context, req.params.id, complete);
	function complete(){
		callbackCount++;
		if(callbackCount >=1) {
			res.render('update-workouts', context);
		}
	}
});

app.put('/:id', function(req, res) {
	var mysql=req.app.get('mysql');
	var sql = "UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?";
	var inserts = [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.params.id];
	sql = pool.query(sql, inserts, function(error, results, fields){
		if(error) {
			res.write(JSON.stringify(error));
			res.status(400);
			res.end();
		}
		else {
			res.status(202);
			res.end();
		}
	});
});




app.get('/reset/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      //res.render('home',context);
      res.redirect('/');
    })
  });
});




app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});


