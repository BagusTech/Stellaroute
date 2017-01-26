/* global jQuery, duck */

void function initLinkedUpdate($, duck) {
	'use strict';

	function getVal($wrapper, $field) {
		const fieldType = $field.attr('duck-type');

		switch(fieldType) {
			case 'array' :
			case 'checkbox' : {
				const vals = [];

				$field.find('[duck-value]').each((i, v) => {
					const val = $(v).val()

					if(val) {
						vals.push(val);
					}
				});

				return vals;
			}
			case 'select' : 
			case 'string' : {
				return $field.find('[duck-value]').val();
			}
			default : {
				return false;
			}
		}
	}

	function updateItems(Id, table, field, isArray, removeVals) {
		return (items) => {
			if(!items) {
				window.location.reload(true);
			}

			const length = items.length;
			const itemsToUpdate = [];
			for(let i = 0; i < length; i++) {
				const item = items[i];
				let current = item[field] || (isArray ? [] : '');

				if(isArray ? (current.indexOf(Id) === -1) : (Id !== current)) {
					if(isArray) {
						current.push(Id);	
					} else {
						current = Id;
					}

					item[field] = current;
					itemsToUpdate.push(item);
				}
			}

			if(removeVals) {
				if(isArray) {
					if (removeVals instanceof Array) {
						const removeFromValsLength = removeVals.length;
						for(let i = 0; i < removeFromValsLength; i++) {
							const item = items.filter((itm) => itm.Id === removeVals[i])[0];
							if(item) {
								if(isArray) {
									const index = item[field].indexOf(Id);
									item[field].splice(index, 1);
								} else {
									item[field] = '';
								}
								
								itemsToUpdate.push(item);
							}
						}
					} else {
						const item = items.filter((itm) => itm.Id === removeVals)[0];

						if(item) {
							if(isArray) {
								const index = item[field].indexOf(Id);
								item[field].splice(index, 1);
							} else {
								item[field] = '';
							}
							
							itemsToUpdate.push(item);
						}
					}
				} else {
					if (removeVals instanceof Array) {
						const removeFromValsLength = removeVals.length;
						for(let i = 0; i < removeFromValsLength; i++) {
							const item = items.filter((itm) => itm.Id === removeVals[i])[0];
							if(item) {
								if(isArray) {
									const index = item[field].indexOf(Id);
									item[field].splice(index, 1);
								} else {
									item[field] = '';
								}
								
								itemsToUpdate.push(item);
							}
						}
					} else {
						const item = items.filter((itm) => itm.Id === removeVals)[0];

						if(item) {
							if(isArray) {
								const index = item[field].indexOf(Id);
								item[field].splice(index, 1);
							} else {
								item[field] = '';
							}
							
							itemsToUpdate.push(item);
						}
					}
				}
			}

			if(itemsToUpdate.length) {
				table.update(itemsToUpdate, () => {window.location.reload(true)});
			} else {
				window.location.reload(true);
			}
		}
	}

	function linkedUpdate($this, field1, field2, isArray) {
		const Id = $this.attr('duck-key-value'); // get the acting items Id
		const $field1 = $this.find(`[duck-field='${field1}']`);
		const oldVals = getVal($this, $field1); // get the acting itmes Values from before it was updated

		// runs after ajax is complete
		return () => {
			const vals = getVal($this, $field1); // get the acting items updated values
			const valsToFind = vals instanceof Array ? vals : (vals ? [vals] : []);

			// if the old vals are the same as the old ones, don't do anything
			if (vals === oldVals) {
				$this.find('[duck-button="submit"]').prop('disabled', false);
				$this.attr('duck-edit-form', 'view');
				return;
			}

			const table = duck($this.attr('duck-table'));
			let removeVals;

			if(oldVals instanceof Array) {
				removeVals = [];
				const length = oldVals.length;

				for(let j = 0; j < length; j++) {
					const currentId = oldVals[j];

					if(vals.indexOf(currentId) === -1) {
						valsToFind.push(currentId);
						removeVals.push(currentId);
					}
				}
			} else if(oldVals) {
				removeVals = isArray ? [oldVals] : oldVals;
				valsToFind.push(oldVals);
			}

			table.get({field: 'Id', value: valsToFind}, updateItems(Id, table, field2 || field1, isArray, removeVals));
		}
	}

	duck.callbacks.linkedUpdate = linkedUpdate;
}(jQuery.noConflict(), duck)