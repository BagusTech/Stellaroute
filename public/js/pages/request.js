/*global jQuery */
jQuery(($) => {
	'use strict'

	const $selectRequestForm = $('#SelectRequestForm');
	const $requestForms = $('.js-request-form');

	$selectRequestForm.on('change', () => {
		$requestForms.addClass('hidden');

		$(`.request-${$selectRequestForm.val()}`).removeClass('hidden');
	});
});