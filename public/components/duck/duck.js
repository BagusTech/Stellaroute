/*global jQuery */

void function initDuck($){
	'use strict'

	function uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		})
	}

	function _duck(table) {
		this.add = (item, successCallback, errorCallback) => {
			$.ajax({
				url: `/add/${table}`,
				contentType: 'application/json',
				method: 'POST',
				data: JSON.stringify(item),
				success: successCallback,
				error: errorCallback,
			});
		}

		// (object)options
		// -- (string)field - the field to search on
		// -- (dynamic)value - matches the type the field represents
		// -- (bool)findOne - if true, returns at most 1 item
		// if no options are passed in, return all items in provided table
		this.get = (options, successCallback, errorCallback) => {
			$.ajax({
				url: `/get/${table}`,
				contentType: 'json',
				dataType: 'json',
				data: options,
				success: successCallback,
				error: errorCallback,
			});
		}

		// (object)item is what will be added to the table provided
		this.update = (item, successCallback, errorCallback) => {
			$.ajax({
				url: `/update/${table}`,
				contentType: 'application/json',
				method: 'POST',
				data: JSON.stringify(item),
				success: successCallback,
				error: errorCallback,
			});
		}

		// (string)id is which item will be deleted from the provided table
		this.delete = (id, successCallback, errorCallback) => {
			$.ajax({
				url: `/delete/${table}`,
				contentType: 'application/json',
				method: 'POST',
				data: JSON.stringify({key: id}),
				success: successCallback,
				error: errorCallback,
			});
		}
	}

	// initialize with table name
	const duck = (table) => (new _duck(table));
	duck.uuid = uuid;

	window.duck = duck;
}(jQuery.noConflict());