/*********************************************************************
** Program Filename: week4Assign
** Author: Mario Franco-Munoz
** Date: 02/01/2018
** Description: this program implements higher order functions to sort
** an array of "automobile" objects by different criteria. 
*********************************************************************/


function Automobile(year, make, model, type) {
    this.year = year; //integer (ex. 2001, 1995)
    this.make = make; //string (ex. Honda, Ford)
    this.model = model; //string (ex. Accord, Focus)
    this.type = type; //string (ex. Pickup, SUV)
}

Automobile.prototype.logMe = function(boolIn) {
    if (boolIn == true) {
        console.log(this.year + " " + this.model + " " + this.type);     
    }
    else {
        console.log(this.year + " " + this.make + " " + this.model);
    }
};


var automobiles = [ 
    new Automobile(1995, "Honda", "Accord", "Sedan"),
    new Automobile(1990, "Ford", "F-150", "Pickup"),
    new Automobile(2000, "GMC", "Tahoe", "SUV"),
    new Automobile(2010, "Toyota", "Tacoma", "Pickup"),
    new Automobile(2005, "Lotus", "Elise", "Roadster"),
    new Automobile(2008, "Subaru", "Outback", "Wagon")
    ];

/*This function sorts arrays using an arbitrary comparator. You pass it a comparator and an array of objects 
appropriate for that comparator and it will return a new array which is sorted with the largest object 
in index 0 and the smallest in the last index*/
function sortArr( comparator, array ){
    var arrLen = array.length;
    var temp;

    //make new for return
    var producedArr = [];
    for (var k = 0; k < arrLen; k++) {
        producedArr[k] = array[k]; 
    }
    


    
    //This fucntion was implemented using basic bubble sort based on pseudocode 
    //found on wikipedia.org and CS162 lecture material
    for (var i = 0; i < arrLen - 1; i++) {

        for (var j = 0; j < arrLen - i - 1; j++) {

            //swap elements if comperator returns false
            if ( !(comparator(producedArr[j], producedArr[j + 1]))) {
                temp = producedArr[j];
                producedArr[j] = producedArr[j + 1];
                producedArr[j + 1] = temp;
            }
        }
    }
    
    return producedArr;
}

/*A comparator takes two arguments and uses some algorithm to compare them. 
If the first argument is larger or greater than the 2nd it returns true, otherwise it returns false. 
Here is an example that works on integers*/
function exComparator( int1, int2){
    if (int1 > int2){
        return true;
    } else {
        return false;
    }
}

/*For all comparators if cars are 'tied' according to the comparison rules then the order of those 'tied' 
cars is not specified and either can come first*/

/*This compares two automobiles based on their year. Newer cars are "greater" than older cars.*/
function yearComparator(auto1, auto2){

    if (auto1.year <= auto2.year) {
        return true;
    }
    else {
        return false;
    }
}

/*This compares two automobiles based on their make. It should be case insensitive and makes which are alphabetically 
earlier in the alphabet are "greater" than ones that come later.*/
function makeComparator( auto1, auto2){
    var make1 = auto1.make.toLowerCase();
    var make2 = auto2.make.toLowerCase();
    var len1 = make1.length;
    var len2 = make2.length;

    var testLength = len1;
    var index = 0;
    if (len2 < len1) {
        testLength = len2;
    }

    var char1 = make1.charAt(0);
    var char2 = make2.charAt(0);

     while (index < testLength) {
        if (char1 < char2) {
            return true;
        }
        else if (char1 > char2) {
            return false;
        }

        char1 = make1.at(index);
        char2 = make2.at(index);

     }

     //if the while loop concluded and there is no difference, the result is a tie
     //and default return value set to "true"
     return true;
}

/*This compares two automobiles based on their type. The ordering from "greatest" to "least" 
is as follows: roadster, pickup, suv, wagon, (types not otherwise listed). It should be case insensitive. 
If two cars are of equal type then the newest one by model year should be considered "greater".*/
function typeComparator( auto1, auto2){
    var type1 = auto1.type.toLowerCase();
    var type2 = auto2.type.toLowerCase();


    if (type1 == type2) {
        if (yearComparator(auto1, auto2) == true) {
            return true;
        }
        else {
            return false;
        }
    }

    else if (type1 == "roadster") {
        return true;
    }
    else if (type1 == "pickup" && type2 != "roadster") {
        return true;
    }
    else if (type1 == "suv" && type2 != "pickup" && type2 != "roadster") {
        return true;
    }
    else if(type1 == "wagon" && type2 != "pickup" && type2 != "roadster" && type2 != "suv") {
        return true;
    }
    else {
        return false;
    }


}

/*Your program should output the following to the console.log, including the opening and closing 5 stars. 
All values in parenthesis should be replaced with appropriate values. Each line is a seperate call to console.log.

Each line representing a car should be produced via a logMe function. 
This function should be added to the Automobile class and accept a single boolean argument. 
If the argument is 'true' then it prints "year make model type" with the year, make, model 
and type being the values appropriate for the automobile. If the argument is 'false' then the 
type is ommited and just the "year make model" is logged.

*****
The cars sorted by year are:
(year make model of the 'greatest' car)
(...)
(year make model of the 'least' car)

The cars sorted by make are:
(year make model of the 'greatest' car)
(...)
(year make model of the 'least' car)

The cars sorted by type are:
(year make model type of the 'greatest' car)
(...)
(year make model type of the 'least' car)
*****

As an example of the content in the parenthesis:
1990 Ford F-150 */



logAutos = function(arrIn, boolIn) {
    for (var i = 0; i < arrIn.length; i++) {
        arrIn[i].logMe(boolIn);
    }
}

console.log("*****");

//Autos sorted by year with output year/make/model
console.log("The cars sorted by year are:");
byYear = sortArr(yearComparator, automobiles);
logAutos(byYear, false);
console.log("\n");

//Autos sorted by make with output year/make/model
console.log("The cars sorted by make are:");
byMake = sortArr(makeComparator, automobiles);
logAutos(byMake, false);
console.log("\n");

//Autos sorted by type with output year/make/model/type
console.log("The cars sorted by type are:");
byType = sortArr(typeComparator, automobiles);
logAutos(byType, true);

console.log("*****");











/*
class Automobile {

    constructor( year, make, model, type ){
        this.year = year; //integer (ex. 2001, 1995)
        this.make = make; //string (ex. Honda, Ford)
        this.model = model; //string (ex. Accord, Focus)
        this.type = type; //string (ex. Pickup, SUV)
    }

    logMe(boolIn) {
        if (boolIn == true) {
            console.log(this.year + " " + this.model + " " + this.type);     
        }
        else {
            console.log(this.year + " " + this.make + " " + this.model);
        }
    }
}
*/