



//function calls

console.log("\nCalling function - function declared below function call.");
firstFunction();
console.log("\nNow calling second function - function defined below function call.");

console.log(secondFx("This should not work!"));



//function declaration
function firstFunction() {
	console.log("Function output: Output from a function declared before function is called!");
}


//function definition
var secondFx = function(x) {
	return x;
};


