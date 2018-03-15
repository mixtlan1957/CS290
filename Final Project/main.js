

//express!
var express = require('express');
var app = express();
//express-handlebars!
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

//bodyParser!
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//events!
var events = require('events');
var eventEmitter = new events.EventEmitter();


//mySQL!
var mysql = require('./dbcon.js');
app.set('mysql', mysql);



//set dependencies
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7963);


//filepath!
express.static('http://localhost:3000/');
app.use(express.static('public'));


//home page
app.get('/',function(req,res){
  

  res.render('home');
});


//about pag
app.get('/about',function(req,res){
  

  res.render('about');
});


//spicy brews page
app.get('/spicymodernbrews',function(req,res){
 
	

  res.render('spicymodernbrews');
});


app.get('/update-card',function(req,res){
 
  

  res.render('update-card');
});


//mtg card database
app.use('/mtgdb', require('./mtgdb.js'));



//404
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

//505
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

















app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});






