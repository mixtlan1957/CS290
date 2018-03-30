



function deepEqual(x, y) {

	if (typeof x == "object" && x != null  && typeof y == "object" && x != null) {
		for (p in x) {
			if (deepEqual(x[p], y[p]) == false) {
				return false;
			}
		}
		return true;
	}

	else if (x == y) {
				
		return true;
	}
	else {
		return false;
	}	
}




// Your code here.

var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, 
	{here: 1, 
		object: 2
	})
);
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true