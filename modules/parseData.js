function parseData(data, schema, table) {
	let errorCount = 0;

	void function parse(data, schema, path){
		for (var item in data){
			// See if the attribute is part of the Schema
			if ( schema[item] === undefined ){
				// uncomment if you want to be able to add new values without messing with the schema
				// good for testing purposes, but do not forget to re-comment out
				// return null;
				console.error(`"${item}" isn't an attribute of "${path}"`); 
				errorCount++;
			}

			const itemType = data[item] && data[item].constructor.name;

			if(itemType) {
				const schemaType = typeof schema[item] === 'object' ? schema[item].constructor.name : schema[item]().constructor.name;

				if (itemType === 'Object') {
					parse(data[item], schema[item], `${path} - ${item}`);
				} else if (schemaType === 'Array' && typeof schema[item][0] === 'object') {
					data[item].forEach((subItem) => {
						parse(subItem, schema[item][0], `${path} - ${item}`);
					});
				} else {
					if ( itemType !== schemaType ){
						console.error('~~~ parsing data failed ~~~')
						console.error(`"${item}" is currently a "${itemType}" and needs to be a "${schemaType}"`);
						errorCount++;
					}
				}
			}
		}
	}(data, schema, table)

	if(errorCount === 0) {
		return 'success';
	}

	return 'failure';
}

module.exports = parseData