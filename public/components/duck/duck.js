/*global jQuery */

void function initDuck($){
	'use strict'

	// secure ajax requests
	const CSRF_HEADER = 'X-CSRF-Token';

	function setCSRFToken(securityToken) {
		$.ajaxPrefilter((options, _, xhr) => {
			if (!xhr.crossDomain) {
				xhr.setRequestHeader(CSRF_HEADER, securityToken);
			}
		});
	}

	setCSRFToken($('meta[name="csrf-token"]').attr('content'));

	// stops propagation
	function stopProp(e) {
		e.stopPropagation();
	}

	// generates a universally unique ID (UUID)
	function uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		})
	}

	// renders a pug file with given locals
	function renderPug(file, locals, success) {
		$.ajax({
			type: 'GET',
			url: '/renderPug',
			contentType: 'json',
			data: {file, locals},
			success,
		});
	}

	// sends an email, needs the html OR the template
	// request = {html: (optional)String, template: (optional)String, toEmail: (optional)String, subject: String}
	// success = function
	// failure = function
	function sendEmail(request, success, failure) {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(request),
			url: '/sendEmail',
			contentType: 'application/json',
		}).done(success).fail(failure);
	}

	// send an email to the appropiate user, giving them a randomized, unique password
	// id = string (id of user in database)
	// successCallback = function
	// errorCallback = function
	function sendResetEmail(email, successCallback, errorCallback) {
		return () => {
			$.ajax({
				url: `/reset-password`,
				contentType: 'application/json',
				data: JSON.stringify({ email }),
				method: 'POST',
				success: successCallback,
				error: errorCallback,
			});
		}
	}

	// finds the first level of children that match a selector
	// $elem = jQuery object
	// selector = string
	// example
	/*
		html:
			.foo
				.bar
					.bar
				.other
					.bar
		findRelevantChildren($('.foo'), '.bar')

		elems that are returned
		html:
			.foo
				.bar(I AM RETURNED)
					.bar
				.other
					.bar(I AM RETURNED)
	*/
	function findRelevantChildren($elem, selector) {
		if(!$elem || !selector) {
			return false;
		}

		const allChildren = $elem.children();
		const relevantChildren = allChildren.filter((i, item) => $(item).is(selector));
		const otherChildren = allChildren.not(selector);

		if(otherChildren.length){
				return relevantChildren.add(findRelevantChildren(otherChildren, selector));
		}
		
		return relevantChildren;
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
		// if no options are passed in, return how many items are in the table
		this.exists = (options, successCallback, errorCallback) => {
			$.ajax({
				url: `/exists/${table}`,
				contentType: 'json',
				data: options,
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
				data: JSON.stringify({item}),
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

		this.clearCache = (successCallback, errorCallback) => {
			$.ajax({
				url: `/admin/clear-cache/${table}`,
				method: 'POST',
				success: successCallback,
				error: errorCallback,
			});
		}
	}

	// initialize with table name
	const duck = (table) => (new _duck(table));

	duck.stopProp = stopProp;
	duck.uuid = uuid;
	duck.renderPug = renderPug;
	duck.sendEmail = sendEmail;
	duck.sendResetEmail = sendResetEmail;
	duck.findRelevantChildren = findRelevantChildren;
	duck.callbacks = {};

	window.duck = duck;
}(jQuery.noConflict());