//ob: object = {a: {b: 'c'}}
//returns: object = {a.b: 'c'}
const flattenObject = function(ob) {
	const toReturn = {};
	
	for (var i in ob) {
		if (!Object.hasOwnProperty.call(ob, i)) continue;
		
		if ((typeof ob[i]) == 'object' && !(ob[i] instanceof Array)) {
			const flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!Object.hasOwnProperty.call(flatObject, x)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

module.exports = flattenObject;