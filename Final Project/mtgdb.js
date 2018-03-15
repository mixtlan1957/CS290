

module.exports = function() {
	var express = require('express');
	var router = express.Router();

	function getCards(res, mysql, context, complete) {
		mysql.pool.query("SELECT mc.card_id, mc.card_name, mc.type, mc.color1, mc.color2, mc.color3," +
			" mc.color4, mc.color5, mc.converted_mana_cost, p.name FROM magic_card mc INNER JOIN plane p ON "+
			"p.plane_id=mc.planeID;",
			function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.magic_card = results;
			complete();
		});
	}


	function getDecks(res, mysql, context, complete) {
		mysql.pool.query("SELECT deck_id, deck_name, description FROM deck;", 
			function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.deck = results;
			complete();
		});
	}


	function getPlanes(res, mysql, context, complete) {
		mysql.pool.query("SELECT name, plane_id FROM plane;",
			function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.plane = results;
			complete();
		});
	}


	function getExpansionSets(res, mysql, context, complete) {
		mysql.pool.query("SELECT es.set_id, es.set_name, p.name FROM expansion_set es "+
			"INNER JOIN plane p ON p.plane_ID=es.planeID;", 
			function (error, results, fields){
				if(error) {
					res.write(JSON.stringify(error));
					res.end();
				}
				context.expansion_set = results;
				complete();
			});
	}




	//displays cards in db, and allows for deletion via ajax* 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteCard.js", "deletePlane.js", "deleteCardFromDeck.js"];
		var mysql = req.app.get('mysql');
		getCards(res, mysql, context, complete);
		getPlanes(res, mysql, context, complete);
		getDecks(res, mysql, context, complete);
		getExpansionSets(res, mysql, context, complete);
		//selectCardsInDeck(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 4) {
				res.render('mtgdb', context);
			}
		}
	});



	

	//function for adding of new cards to db
	router.post('/card', function(req, res){
		var mysql=req.app.get('mysql');
		var sql= "INSERT INTO magic_card (card_name, type, color1, color2, color3, color4, color5, "+
		"converted_mana_cost, planeID) VALUES (?,?,?,?,?,?,?,?,?)";
		var inserts = [req.body.card_name, req.body.type, req.body.color1, req.body.color2, req.body.color3, 
		req.body.color4, req.body.color5, req.body.converted_mana_cost, req.body.planeID];

		//conditional statements for null values
		if(req.body.color1 == "") {
			req.body.color1=null;
		}
		if(req.body.color2 == "") {
			req.body.color2=null;
		}
		if(req.body.color3 == "") {
			req.body.color3=null;
		}
		if(req.body.color4 == "") {
			req.body.color4=null;
		}
		if(req.body.color5 == "") {
			req.body.color5=null;
		}

		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			else {
				res.redirect('/mtgdb');
			}
		});
	});


	//function for adding of new planes to db
	router.post('/plane', function(req, res){
		var mysql=req.app.get('mysql');
		var sql="INSERT INTO plane (name) VALUES (?)";
		var inserts = [req.body.name];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end;
			}
			else {
				res.redirect('/mtgdb');
			}
		});
	});

	//function for adding of new decks to db
	router.post('/deck', function(req, res){
		var mysql=req.app.get('mysql');
		var sql="INSERT INTO deck (deck_name, description) VALUES (?, ?)";
		var inserts = [req.body.deck_name, req.body.description];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end;
			}
			else {
				res.redirect('/mtgdb');
			}
		});
	});


	//function for adding of new expansion sets to db
	router.post('/expansion_set', function(req, res){
		var mysql=req.app.get('mysql');
		var sql="INSERT INTO expansion_set (set_name, planeID) VALUES (?, ?)";
		var inserts = [req.body.set_name, req.body.planeID];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end;
			}
			else {
				res.redirect('/mtgdb');
			}
		});
	});

	//update Deck/Card to many-to-many Relationship: create new relationship
	router.post('/updateDeckAdd', function(req, res){
		var mysql=req.app.get('mysql');
		var sql = "INSERT INTO card_deck (cid, did) VALUES ((SELECT card_id FROM magic_card WHERE card_name=?), "+
		"(SELECT deck_id FROM deck WHERE deck_name=?))";
	
		var inserts = [req.body.card_name, req.body.deck_name];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				res.end;
			}
			else {
				res.redirect('/mtgdb');
			}
		});
	});


	//update Expansion/Card to many-to-many Relationship: create new relationship
	router.post('/updateExpAdd', function(req, res){
		var mysql=req.app.get('mysql');
		var sql = "INSERT INTO card_expansion_set (sid, cid) "+
		"VALUES ((SELECT set_id FROM expansion_set WHERE set_name=?), "+
		"(SELECT card_id FROM magic_card WHERE card_name=?));"
		var inserts = [req.body.set_name, req.body.card_name];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				res.end;
			}
			else {
				res.redirect('/mtgdb');
			}	
		});

	});






	//display cards in deck (many to many relationship)
	router.post('/displayCardsInDeck', function(req, res){
		var context = {};
		var mysql=req.app.get('mysql');
		var sql = "SELECT mc.card_name, mc.card_id FROM magic_card mc "+ 
		"INNER JOIN card_deck cd ON cd.cid=mc.card_id "+
		"INNER JOIN deck d ON d.deck_id=cd.did " +
		"WHERE d.deck_name=(?)";
		var inserts = [req.body.deck_name];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				res.end;
			}
			else {
				context.decklist = results;
				res.render('displayCardsInDeck', context);
			}
		});
			
	});

	//displays card in expansion (many to many relationship)
	router.post('/displayCardsInExp', function(req, res){
		var context = {};
		var mysql=req.app.get('mysql');
		var sql = "SELECT mc.card_name FROM magic_card mc "+
		"INNER JOIN card_expansion_set ces ON ces.cid=mc.card_id "+
		"INNER JOIN expansion_set es ON es.set_id=ces.sid "+
		"WHERE es.set_name=(?)";
		var inserts = [req.body.set_name];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				res.end;
			}
			else {
				context.explist = results;
				res.render('displayCardsInExp', context);
			}
		});
	});

	


	//delete cards from db function
	router.delete('/card/:card_id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM magic_card WHERE card_id = ?";
		var inserts = [req.params.card_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            else { 
                res.status(202).end();
            }

		});

	});


	//delete planes from db function
	router.delete('/plane/:plane_id', function(req, res){
		var mysql=req.app.get('mysql');
		var sql= "DELETE FROM plane WHERE plane_id = ?";
		var inserts = [req.params.plane_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            else { 
                res.status(202).end();
            }
		});
	});

	//remove cards from deck-to-card many-to-many relationship
	router.delete('/displayCardsInDeck/:card_id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql ="DELETE FROM card_deck WHERE cid = ?";
		var inserts = [req.params.card_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            else { 
                res.status(202).end();
            }
		});
	}); 
	





/* UPDATE CARD SECTION */

	function getCard(res, mysql, context, card_id, complete) {
		var sql = "SELECT card_id, card_name, planeID FROM magic_card WHERE card_id = ?";
		var inserts = [card_id];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.magic_card = results[0];
            complete();
		});

	}




	router.get('/:card_id', function(req, res){
        callbackCount = 0;
        var context = {};
        //context.jsscripts = ["selectPlane.js", "updateCard.js"];
        var mysql = req.app.get('mysql');
        getCard(res, mysql, context, req.params.card_id, complete);
        getPlanes(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-card', context);
            }

        }
    });




	router.put('/:card_id', function(req, res){
		var mysql=req.app.get('mysql');
		var sql = "UPDATE magic_card SET card_name = ?, planeID = ? WHERE card_id =?";
		var inserts = [req.body.card_name, req.body.planeID, req.params.card_id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
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


/*  */








	return router;
}();