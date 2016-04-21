// set an objects property to a nested value base off an array
// obj: object = {}
// keyPath: array = ['a', 'b', 'c']
/// OR ///
// keyPath: string = 'a.b.c'
// value: string = 'foobar'
// return: obj = { a : { b : { c : 'foobar'}}}
var assign = function assign(obj, keyPath, value) {
	if (typeof keyPath === 'string'){
		keyPath = keyPath.split('.');
	}

	lastKeyIndex = keyPath.length-1;

	for (var i = 0; i < lastKeyIndex; ++ i) {
		var key = keyPath[i];

		if (!(key in obj)){
			obj[key] = {}
		}
		obj = obj[key];
	}

	obj[keyPath[lastKeyIndex]] = value;
}

module.exports = assign;