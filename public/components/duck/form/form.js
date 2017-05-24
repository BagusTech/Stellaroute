/* global jQuery, duck, window */

void function initDuckForm($, duck, window) {
	'use strict'

	function deleteArrayItem(e) {
		e.stopPropagation();
		e.preventDefault();
		
		$(this).closest('[duck-type]').remove();
		$(this).closest('[duck-type="array"]').trigger('duckArrayItemDeleted');
	}

	function addArrayItem(e) {
		e.stopPropagation();
		e.preventDefault();

		const $this = $(this);
		const addDirection = $this.attr('duck-add');
		const target = $this.attr('duck-targt');
		const $wrapper = target ? $(target) : $this.closest('[duck-type="array"]');
		const $item = $wrapper.find('[duck-type]').first();
		const $lastItem = $item.parent().find('> [duck-type]').last();
		const $clone = $wrapper.prop('ArrayItemTemplate') ? $wrapper.prop('ArrayItemTemplate').clone() : $item.clone();

		switch(addDirection) {
			case 'after' : {
				$this.closest('[duck-type]').after($clone)
				break;
			}
			case 'before' : {
				$this.closest('[duck-type]').before($clone)
				break;
			}
			default : {
				$lastItem.after($clone);
				break;		
			}
		}

		$clone.find('[duck-button="delete"]').click(deleteArrayItem);
		$clone.find('[data-function="tabs"]').makeTabs();
		$clone.find('[id]').each((i, idItem) => {
			const $idItem = $(idItem);
			const currentId = $idItem.attr('id');
			const newId = currentId + duck.uuid();

			$idItem.attr('id', newId).prop('id', newId);
		});
		$clone.find('[data-function="accordion"]').makeAccordion();		

		if($item.attr('duck-type') === 'object'){
			$clone.find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
			$clone.find('.summernote').parent().empty().append('<div class="summernote"></div>').find('> .summernote').summernote(window.summernoteOptions);
			$clone.find('[duck-type="array"] > [duck-type]:not(:first-of-type)').remove();
			$clone.find('[duck-button="add"]').click(addArrayItem);
		}

		if($item.attr('duck-type') === 'image') {
			$clone.prop('filePickerInitiated', false);
			$clone.find('[duck-image-value]').text('');
		}

		
		if($clone.guideCard) {
			$clone.find('.js-card').guideCard();
		}

		$item.parent().sortable('[duck-type]');

		$wrapper.trigger('duckArrayItemAdded', [$clone]);
		$wrapper.closest('[data-function*="scroll"]').trigger('initScroll')
	}

	function parseObject(obj, $item, fieldName, buildObjectFunction) {
		const key = $item.attr('duck-key');
		const newObj = obj[fieldName] || {};

		if(key && !newObj[key]){
			newObj[key] = $item.attr('duck-key-value') || duck.uuid();
		}

		obj[fieldName] = buildObjectFunction(newObj, duck.findRelevantChildren($item, '[duck-field]'));
	}

	function parseArray(obj, $item, fieldName, buildObjectFunction) {
		const $objectToUpdate = duck.findRelevantChildren($item, '[duck-type="object"]');
		const value = $objectToUpdate.first().attr('duck-key') ? obj[fieldName] || [] : [];

		if($objectToUpdate.length) {
			$objectToUpdate.each((i, objec) => {
				const $objec = $(objec);
				const key = $objec.attr('duck-key');
				const keyValue = $objec.attr('duck-key-value') || duck.uuid();
				const newObj = key ? value.filter((o) => o[key] === keyValue)[0] || {} : {}

				// if the key is defined, the object is being altered/added without the context of the other items
				if(key){
					// if the key doesn't have a preset value, give it a uuid
					newObj[key] = keyValue;

					// check to see if an item with the same key exists in the array
					const indexOfCurrentId = value.map((o) => o[key]).indexOf(newObj[key]);

					// if it does, remove it from the list of values
					if(indexOfCurrentId !== -1){
						value.splice(indexOfCurrentId, 1);
					}
				}

				// add the new object to the list of values
				value.push(buildObjectFunction(newObj, duck.findRelevantChildren($objec, '[duck-field]')));
			});
		} else {
			$item.find('[duck-value]').each((i, arrayItem) => {
				const val = $(arrayItem).val();

				if(val){
					value.push(val);
				}
			});
		}

		if(obj[fieldName] || value.length){
			obj[fieldName] = value;
		}
	}

	function parseCheckbox(obj, $item, fieldName) {
		const value = [];

		$item.find('input[type="checkbox"]').each((j, checkbox) => {
			const $checkbox = $(checkbox);

			if($checkbox.prop('checked')){
				value.push($checkbox.val());
			}
		});

		if(obj[fieldName] || value.length){
			obj[fieldName] = value;
		}
	}

	function parseRadio(obj, $item, fieldName) {
		const value = $item.find('input[type="radio"]:checked').val();

		if(obj[fieldName] || value){
			obj[fieldName] = value;
		}
	}

	function parseWysiwyg(obj, $item, fieldName) {
		const value = $item.find('.summernote').summernote('code');

		if(value){
			obj[fieldName] = value;
		}
	}

	function buildObject(obj, $context) {
		$context.each((i, item) => {
			const $item = $(item);
			const fieldName = $item.attr('duck-field');
			const type = $item.attr('duck-type');

			switch(type){
				case 'object': {
					parseObject(obj, $item, fieldName, buildObject);

					break;
				}
				case 'array': {
					parseArray(obj, $item, fieldName, buildObject);

					break;
				}
				case 'checkbox': {
					parseCheckbox(obj, $item, fieldName);

					break;
				}
				case 'radio': {
					parseRadio(obj, $item, fieldName);

					break;
				}
				case 'bool': {
					obj[fieldName] = $item.prop('checked') || $item.find('input[type="checkbox"]').prop('checked');
					
					break;
				}
				case 'wysiwyg': {
					parseWysiwyg(obj, $item, fieldName);
					
					break;
				}
				case 'image':
				case 'select': 
				case 'number': 
				case 'string':
				default: {
					const isInputValue = $item.val();
					const value = isInputValue ? isInputValue : $item.find('[duck-value]').val();

					if(obj[fieldName] || value){
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
			$urlField.val($urlFromField.val().replace(/'/g, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()).trigger('validate');
		});
	}

	function addItem($wrapper, table, key, keyValue, $startOfFields, successCallback, errorCallBack) {
		const item = {};
		item[key] = keyValue || duck.uuid();

		const itemToAdd = buildObject(item, $startOfFields);

		duck(table).add(itemToAdd, successCallback, errorCallBack);
		$wrapper.trigger('duck.form.submitted', [itemToAdd]);
	}

	function updateItem($wrapper, table, key, keyValue, $startOfFields, successCallback, errorCallBack) {
		duck(table).get({field: key, value: keyValue, findOne: true}, (data) => {
			const originalPassword = table === 'Users' ? data.local && data.local.password : false; // due to how javascript references values, this has to be declared before the item is built;
			const item = buildObject(data, $startOfFields);

			// because the password is encrypted, it will save over the old password, thinking an update was made
			if(originalPassword) {
				if(item.local.password === originalPassword) {
					delete item.local.password;
				}
			}

			duck(table).update(item, successCallback, errorCallBack);
			$wrapper.trigger('duck.form.submitted', [item]);
		});
	}

	function deleteItem($wrapper, table, key, keyValue) {
		const item = {}
		item[key] = keyValue;

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
		$wrapper.trigger('duck.form.submitted', [item]);
	}

	function editForm(e) {
		const $wrapper = e.data.wrapper;

		$wrapper.attr('duck-edit-form', $wrapper.attr('duck-edit-form') === 'view' ? 'edit' : 'view');
		$('[data-function*="scroll"]').trigger('initScroll');
	}

	function triggerSubmitForm(e) {
		e.preventDefault();
		e.stopPropagation();

		e.data.wrapper.trigger('duck.form.submit');
	}

	function submitForm(e) {
		e.preventDefault();
		e.stopPropagation();

		const crud = e.data.crud;
		const table = e.data.table;
		const key = e.data.key;
		const keyValue = e.data.keyValue;
		const $startOfFields = e.data.startOfFields;
		const $wrapper = e.data.wrapper;
		const successCallback = e.data.successCallback;
		const errorCallBack = e.data.errorCallBack;

		$(e.currentTarget).prop('disabled', true);

		switch(crud){
			// adds an item to the table
			case 'add':{
				addItem($wrapper, table, key, keyValue, $startOfFields, successCallback, errorCallBack);

				break;
			}

			// updates an item from the table
			case 'update':{
				updateItem($wrapper, table, key, keyValue, $startOfFields, successCallback, errorCallBack);

				break;
			}

			// deletes an item from the table
			case 'delete':{
				deleteItem($wrapper, table, key, keyValue);

				break;
			}

			default:
		}
	}

	function duckForm(wrapper, options) {
		const $wrapper = $(wrapper);
		const $startOfFields = duck.findRelevantChildren($wrapper, '[duck-field]');
		const $editButton = $wrapper.find('[duck-button="edit"]');
		const $cancelButton = $wrapper.find('[duck-button="cancel"]');
		const table = (options && options.table) || $wrapper.attr('duck-table');
		const crud = (options && options.crud) || $wrapper.attr('duck-function');
		const key = (options && options.key) || $wrapper.attr('duck-key');
		const keyValue = (options && options.keyValue) || $wrapper.attr('duck-key-value');
		const $urlField = $wrapper.find('[duck-field="url"] input');
		const successCallback = (options && options.successCallback) || ((data) => {$wrapper.trigger('duck.form.success', [data])});
		const errorCallBack = (options && options.errorCallBack) || (() => {$wrapper.trigger('duck.form.error')});

		if($urlField.length){
			autoSetUrl($urlField, $wrapper.find('[duck-field="names"] [duck-field="display"] input'));
		}

		if(!table || !crud || !key || ((crud === 'update' || crud === 'delete') && !keyValue)) {
			return; // need to have a table, key, and it's function set, and must have key value if it's for an update or delete
		}

		$editButton.off('click', editForm)
				.on('click', {wrapper: $wrapper}, editForm);
		$cancelButton.off('click', editForm)
					.on('click', {wrapper: $wrapper}, editForm);

		// set what happens when the submit button is clicked
		$wrapper.off('click', triggerSubmitForm)
				.on('click', '[duck-button="submit"]', {wrapper: $wrapper}, triggerSubmitForm);

		$wrapper.off('duck.form.submit', submitForm).on('duck.form.submit', {crud, table, key, keyValue, wrapper: $wrapper, startOfFields: $startOfFields, successCallback, errorCallBack}, submitForm)

		// set arrays to be sortable
		$wrapper.find('[duck-type="array"]')
				.each((i, item) => {
					const $item = $(item);
					const $itemChildren = duck.findRelevantChildren($item, '[duck-type]');

					$itemChildren.first().parent().sortable('[duck-type]');
				});

		// make add and delete item from array work
		$wrapper.find('[duck-button="add"]').off('click', addArrayItem).click(addArrayItem);
		$wrapper.find('[duck-button="delete"]').off('click', deleteArrayItem).click(deleteArrayItem);
	}

	$.fn.duckForm = function init(options) {
		return this.each((index, wrapper) => {
			duckForm(wrapper, options);
		});
	}

	$(() => {$('[duck-table]').duckForm();});
}(jQuery.noConflict(), duck, window)