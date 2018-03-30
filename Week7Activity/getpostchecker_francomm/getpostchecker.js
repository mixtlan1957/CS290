var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res){
  res.render('home');
});



//combined get and post checker function
app.use('/getpostchecker',function(req,res){

  var userInput = [];
  for (var i in req.query) {
  	userInput.push({'name':i,'value':req.query[i]});
  }


 
  for(var p in req.body) {
  	userInput.push({'name':p,'value':req.body[p]});
  }
  

  
  console.log(userInput);
  console.log(req.query);
  console.log(req.body);


  var context = {};
  context.dataList = userInput;

  res.render('getpostchecker', context); 
});


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