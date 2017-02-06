const joinObject = function(item, field, dataJoin, joinOn, dataDisplay, display, joinedFieldName){
	if(field.length > 1 && item[field[0]]){
		item[field[0]] = joinObject(item[field[0]], field.splice(1), dataJoin, joinOn, dataDisplay, display, joinedFieldName);
		return item;
	}

	if(joinOn.length > 1 && dataJoin[joinOn[0]]){
		return joinObject(item, field, dataJoin[joinOn[0]], joinOn.splice(1), dataDisplay, display, joinedFieldName);
	}

	if(display.length > 1 && dataDisplay[display[0]]){
		return joinObject(item, field, dataJoin, joinOn, dataDisplay[display[0]], display.splice(1), joinedFieldName);
	}

	if(item[joinedFieldName] == dataDisplay[display[0]]){
		return item;
	}

	if(item[field[0]] instanceof Array){
		item[joinedFieldName] = item[joinedFieldName] || [];

		for(var i in item[field[0]]){
			if(dataJoin[joinOn[0]] == item[field[0]][i]){
				item[joinedFieldName].push(dataDisplay[display[0]]);
			}
		}
	} else {
		if(item[field[0]] == dataJoin[joinOn[0]]){
			item[joinedFieldName] = dataDisplay[display[0]];
		}
	}

	return item;
}

module.exports = joinObject;