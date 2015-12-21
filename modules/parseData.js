function parseData(data, schema, table) {
	var errorCount = 0;

	!function parse(data, schema){
		for (var item in data){
			// See if the attribute is part of the Schema
			if ( schema[item] === undefined ){
				console.error('"' + item + '" isn\'t an attribute of "' + table + '"'); 
				errorCount++;
				return null;
			}

			var itemType = data[item] instanceof Array === true ? 'array' : typeof data[item];
			var schemaType = typeof schema[item] === 'object' ? 'object' : 
				(schema[item]() instanceof Array === true ? 'array' : typeof schema[item]());

			if ( itemType === 'object' ) {
				parse(data[item], schema[item])
			} else {
				if ( itemType !== schemaType ){
					console.error('"' + item + '" is currently a "' + itemType + '" and needs to be a "' + schemaType + '"');
					errorCount++;
					return null;
				}
			}
		}
	}(data, schema)

	if(errorCount === 0) {
		return 'success';
	}

	return 'failure';
}

module.exports = parseData