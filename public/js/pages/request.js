jQuery(function initRequestToggle(){
	var $selectRequestForm = $('#SelectRequestForm');
	var $requestForms = $('.js-request-form');

	$selectRequestForm.on('change', function showSelectedForm(){
		$requestForms.addClass('hidden');

		$('.request-'+$selectRequestForm.val()).removeClass('hidden');
	});
});