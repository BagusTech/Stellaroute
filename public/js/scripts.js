void function($){
	// Once window is loaded, do this
	$(window).on('load', function(){
		setTimeout(function(){
			$('.flash-message-container').slideUp(1000);
		}, 1500);

		
		init(); 

		// for updating countries
		$('.js-update-country').click(function(){
			$(this).hide();
			$('#Update').removeClass('hidden');

			$('.js-update').hide();
			$('.form-group').removeClass('hidden');
		});
	});
}(jQuery);

//////////////  Define Functions  //////////////////////
function init(){
	// initilize all update pages
	update();

	// style multiselect via http://davidstutz.github.io/bootstrap-multiselect/
	$('select[multiple]').multiselect();

	$('button[data-target]').click(function onClick(e){
		var id = $(this).attr('data-target');
		setTimeout(function focusElement(){
			$(id + ' input').first().focus();
			console.log('done');
		}, 200);
	});
}

function update(){
	//used for all update forms

	var $form = $('.update-form');

	var $inputs = $form.find('p + .hidden');
	var $values = $form.find('.form-control-static');

	// toggle between seeing input fields and
	$form.find('.btn-update').click(function(){
		var $this = $(this);

		// toggle between static values and inputs
		$inputs.toggleClass('hidden');
		$values.toggleClass('hidden');

		// change color and text of the update button
		$this.toggleClass('btn-warning').toggleClass('btn-primary');
		$this.attr('value', $this.attr('value') === 'Update' ? 'Cancel' : 'Update');

		// toggle save button
		$form.find('.btn-save').toggleClass('hidden');
	});
	//save button saves the data
}


// polyfills
if (!String.prototype.contains) {
  String.prototype.contains = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}