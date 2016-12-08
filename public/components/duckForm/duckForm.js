/* global jQuery, duck, window */

void function initCityFood($, duck, window) {
	'use strict'

	function deleteArrayItem(){
		$(this).parent().remove();
	}

	function addArrayItem(){
		const $this = $(this);
		const $wrapper = $this.parent();
		const $item = $wrapper.find('> [duck-type]').first();
		const $clone = $item.clone();

		$clone.find('[duck-value]').val(null);

		if($item.attr('duck-type') === 'object'){
			$clone.find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
			$clone.find('.summernote').parent().empty().append('<div class="summernote"></div>').find('> .summernote').summernote({height: 150});
			$clone.find('[duck-type="array"] > [duck-type]:not(:first-of-type)').remove();
		}

		$clone.append($('<button>', {
					text: 'Delete',
					'class': 'btn btn-danger btn-small',
					'duck-button': 'add',
					type: 'button',
					click: deleteArrayItem,
				}));

		$clone.find('[duck-button="add"]').click(addArrayItem);
		
		$this.before($clone);
	}

	function removeFromObject(obj, path, value){
		const pathList = typeof path === 'string' ? path.split('.') : path;
		const length = pathList.length

		for(let i = 0; i < length; i++){
			const field = pathList[i];
			const isLastItem = length === 1;
			const isObject = typeof obj[field] === 'object';

			if(isLastItem && !isObject){
				delete obj[field];
			} else if (!isObject){
				break;
			}

			const type = obj[field] instanceof Array ? 'array' : 'object';

			if(type === 'object'){
				const newPathList = pathList.slice(0);
				newPathList.splice(0, 1);

				obj[field] = removeFromObject(obj[field], newPathList, value);
			} else {
				const indexToSplice = isLastItem ?  obj[field].indexOf(value) : 
													obj[field].map((o) => o[pathList[i+1]]).indexOf(value);
				
				obj[field].splice(indexToSplice, 1)
			}
		}

		return obj;
	}

	function buildObject(obj, $context) {
		$context.each((i, item) => {
			const $item = $(item);
			const fieldName = $item.attr('duck-field');
			const type = $item.attr('duck-type');

			switch(type){
				case 'object': {
					const key = $item.attr('duck-key');
					const newObj = obj[fieldName] || {};

					if(key && !newObj[key]){
						newObj[key] = $item.attr('duck-key-value') || duck.uuid();
					}

					obj[fieldName] = buildObject(newObj, $item.find('> [duck-field]'));
					break;
				}
				case 'array': {
					const $objectToUpdate = $item.find('> [duck-type="object"]');
					const value = $objectToUpdate.first().attr('duck-key') ? obj[fieldName] : [];

					if($objectToUpdate.length) {
						$objectToUpdate.each((j, objec) => {
							const $objec = $(objec);
							const key = $objec.attr('duck-key');
							const newObj = {}

							// if the key is defined, the object is being altered/added without the context of the other items
							if(key){
								// if the key doesn't have a preset value, give it a uuid
								newObj[key] = $objec.attr('duck-key-value') || duck.uuid();

								// check to see if an item with the same key exists in the array
								const indexOfCurrentId = value.map((o) => o[key]).indexOf(newObj[key]);

								// if it does, remove it from the list of values
								if(indexOfCurrentId !== -1){
									value.splice(indexOfCurrentId, 1);
								}
							}

							// add the new object to the list of values
							value.push(buildObject(newObj, $objec.find('> [duck-field]')));
						});
					} else {
						$item.find('[duck-value]').each((j, arrayItem) => {
							const val = $(arrayItem).val();

							if(val){
								value.push(val);
							}
						});
					}

					if(value.length){
						obj[fieldName] = value;
					}
					break;
				}
				case 'checkbox': {
					const value = [];

					$item.find('input[type="checkbox"]').each((j, checkbox) => {
						const $checkbox = $(checkbox);

						if($checkbox.prop('checked')){
							value.push($checkbox.val());
						}
					});

					if(value.length){
						obj[fieldName] = value;
					}

					break;
				}
				case 'radio': {
					const value = $item.find('input[type="radio"]:checked').val();

					if(value){
						obj[fieldName] = value;
					}			

					break;
				}
				case 'bool': {
					obj[fieldName] = $item.prop('checked') || $item.find('input[type="checkbox"]').prop('checked');
					
					break;
				}
				case 'wysiwyg': {
					const value = $item.find('.summernote').summernote('code');

					if(value){
						obj[fieldName] = value;
					}
					
					break;
				}
				case 'select': 
				case 'number': 
				case 'string':
				default: {
					const isInputValue = $item.val();
					const value = isInputValue ? isInputValue : $item.find('[duck-value]').val();

					if(value){
						obj[fieldName] = value;
					}

					break;
				}
			}
		});

		return obj;
	}

	function autoSetUrl($urlField, $urlFromField) {
		$urlFromField.on('input', () => {
			$urlField.val($urlFromField.val().replace(/'/g, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase());
		});
	}

	function duckForm(wrapper){
		const $wrapper = $(wrapper);
		const $startOfFields = $wrapper.find('> [duck-field]');
		const $submit = $wrapper.find('[duck-button="submit"]');
		const table = $wrapper.attr('duck-table');
		const crud = $wrapper.attr('duck-function');
		const key = $wrapper.attr('duck-key');
		const keyValue = $wrapper.attr('duck-key-value');
		const $urlField = $wrapper.find('[duck-field="url"] input');

		if($urlField.length){
			autoSetUrl($urlField, $wrapper.find('[duck-field="names"] [duck-field="display"] input'));
		}

		if(!table || !crud || !key || ((crud === 'update' || crud === 'delete') && !keyValue)) {
			return; // need to have a table, key, and it's function set, and must have key value if it's for an update or delete
		}

		// set what happens when the submit button is clicked
		$submit.click((e) => {
			e.preventDefault();
			e.stopPropagation();

			$submit.prop('disabled', true);

			switch(crud){
				// adds an item to the table
				case 'add':{
					const item = {};
					item[key] = keyValue || duck.uuid();

					duck(table).add(buildObject(item, $startOfFields), () => {window.location.reload(true)});

					break;
				}

				// updates an item from the table
				case 'update':{
					duck(table).get({field: key, value: keyValue, findOne: true}, (data) => {
						const item = buildObject(data, $startOfFields);
						duck(table).update(item, () => {window.location.reload(true)});
					});

					break;
				}

				// deletes an item from the table
				case 'delete':{
					duck(table).delete(keyValue, () => {
						const currentLocation = window.location.href.split('/');
						const goTo = $wrapper.attr('duck-goTo');

						if(currentLocation[currentLocation.length - 1]){
							currentLocation.pop();
						} else {
							currentLocation.pop();
							currentLocation.pop();
						}

						const newLocation = goTo ? goTo : currentLocation.join('/');
						if(window.location.href === newLocation) {
							window.location.reload(true);
						} else{
							window.location.href = newLocation;
						}
					});

					break;
				}

				// deletes a field or value from an item in the table
				case 'deleteField':{
					const path = $wrapper.attr('duck-delete-path');
					const value = $wrapper.attr('duck-delete-value');

					duck(table).get({field: key, value: keyValue, findOne: true}, (data) => {
						const item = removeFromObject(data, path, value);

						duck(table).update(item, () => {window.location.reload(true)});
					});

					break;
				}
				default:
			}
		});

		// set arrays to add and remove items
		$wrapper.find('[duck-type="array"]').each((i, item) => {
			const $item = $(item);
			const $addItem = $('<button>', {
				text: `Add ${$item.attr('duck-field')}`,
				'class': 'btn btn-primary btn-small',
				'duck-button': 'add',
				type: 'button',
				click: addArrayItem,
			});

			$item.append($addItem);

			$item.find('> [duck-type]').each((j, subItem) => {
				if(j === 0){
					return;
				}

				const $subItem = $(subItem);
				const $deleteItem = $('<button>', {
					text: 'Delete',
					'class': 'btn btn-danger btn-small',
					'duck-button': 'delete',
					click: deleteArrayItem,
				});

				$subItem.append($deleteItem);
			});
		});
	}

	$.fn.duckForm = function init() {
		return this.each((index, wrapper) => {
			duckForm(wrapper);
		});
	}

	$(window).load(() => {
		$('[duck-table]').duckForm();
	});
}(jQuery.noConflict(), duck, window)