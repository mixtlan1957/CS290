function Automobile( year, make, model, type )
{
    this.year = year; //integer (ex. 2001, 1995)
    this.make = make; //string (ex. Honda, Ford)
    this.model = model; //string (ex. Accord, Focus)
    this.type = type; //string (ex. Pickup, SUV)
}

var automobiles = [
    new Automobile(1995, "Honda", "Accord", "Sedan"),
    new Automobile(1990, "Ford", "F-150", "Pickup"),
    new Automobile(2000, "GMC", "Tahoe", "SUV"),
    new Automobile(2010, "Toyota", "Tacoma", "Pickup"),
    new Automobile(2005, "Lotus", "Elise", "Roadster"),
    new Automobile(2008, "Subaru", "Outback", "Wagon")
    ];

/*This function sorts arrays using an arbitrary comparator.
You pass it a comparator and an array of objects appropriate for that comparator
and it will return a new array which is sorted with the largest object in index 0 and the smallest in the last index*/

function sortArr( comparator, array )
{
   var len = array.length;

   //create copy of original array
   var resultSort = [];
   for (var k = 0; k < len; k++) {
   resultSort[k] = array[k];
   }

   var min = 0;

   for (var i = 0; i < len; i++)
   {
       min = i;
		for (var j=i+1; j < len; j++)
		{
			if (comparator(resultSort[j], resultSort[min]))
				min = j;
		}
		if (min !=i){
			var tmp = resultSort[i];
			resultSort[i] = resultSort[min];
			resultSort[min] = tmp;
		}
   }
   return resultSort;
}

/*For all comparators if cars are 'tied' according to the comparison rules
then the order of those 'tied' cars is not specified and either can come first*/

/*This compares two automobiles based on their year. Newer cars are "greater" than older cars.*/

function yearComparator( auto1, auto2)
{
    if (auto1.year > auto2.year)
		return true;
	else
		return false;
}

/*This compares two automobiles based on their make.
It should be case insensitive and makes which are alphabetically earlier in the alphabet are "greater" than ones that come later.*/

function makeComparator( auto1, auto2)
{
    var x = auto1.make.toLowerCase();
	var y = auto2.make.toLowerCase();

	if ((x < y) || (x ==y))
		return true;
	else
		return  false;
}

/*This compares two automobiles based on their type.
The ordering from "greatest" to "least" is as follows: roadster, pickup, suv, wagon,
(types not otherwise listed). It should be case insensitive.
If two cars are of equal type then the newest one by model year should be considered "greater".*/

function typeComparator(auto1, auto2)
{
    var x = auto1.type.toLowerCase();
	var y = auto2.type.toLowerCase();

	if ( x == "roadster" && y !="roadster")
		return true;
	else if ( x == "pickup" && (y != "roadster" && y != "pickup"))
		return true;
	else if (x== "suv" && (y != "roadster" && y != "pickup" && y != "suv"))
		return true;
	else if (x== "wagon" && (y != "roadster" && y != "pickup" && y != "suv" && y != "wagon"))
		return true;
	else if ( x ==y)
	{
		if (yearComparator(auto1, auto2))
			return true;
		else
			return false;
	}
	else
		return false;
}

//logMe function added to the prototype

Automobile.prototype.logMe = function logMe(boolVal)
{
	if (boolVal)
		console.log( this.year + "      " + this.make + "       " + this.model + "      " + this.type);
	else
		console.log( this.year + "       " + this.make + "      " + this.model);
};

//cars sorted by year
console.log("*****");
console.log("The cars sorted by year are:");
var year = sortArr (yearComparator, automobiles);
year.forEach(function(auto){
	auto.logMe(false);
});

//cars sorted by make
console.log();

console.log("The cars sorted by make are:");
var make = sortArr (makeComparator, automobiles);
make.forEach(function(auto){
	auto.logMe(false);
});

//cars sorted by type
console.log();

console.log("The cars sorted by type are:");
var type = sortArr(typeComparator, automobiles);
type.forEach(function(auto){
	auto.logMe(true);
});
console.log("*****");