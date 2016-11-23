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
		this.add = (item) => {return item}
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

		this.delete = (id) => {return id}

		this.uuid = uuid;
	}

	const duck = (table) => {
		return new _duck(table);
	}

	window.duck = duck;
}(jQuery);