void function($){
	// Once window is loaded, do this
	$(window).on('load', function(){
		setTimeout(function(){
			$('.flash-message-container').hide(1000);
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
}

function update(){
	//used for all update forms (ajax)

	var $form = $('.update-form');

	//create the appropriate inputs
	$form.find('[data-type=text]').each(function(){
		var $this = $(this);

		var input = $( '<input/>', {
				class: 'form-control hidden',
				type: 'text',
				value: $this.text()
			});

		$this.after(input);
	});

	$form.find('[data-type=email]').each(function(){
		var $this = $(this);

		var input = $( '<input/>', {
				class: 'form-control hidden',
				type: 'email',
				value: $this.text()
			});

		$this.after(input);
	});

	$form.find('[data-type=textarea]').each(function(){
		var $this = $(this);

		var input = $( '<textarea/>', {
				class: 'form-control hidden',
				text: $this.text()
			});

		$this.after(input);
	});

	$form.find('[data-type=select]').each(function(){
		var $this = $(this);

		var input = $( '<select/>', {
				class: 'form-control hidden',
				value: $this.text()
			});

		// get the options for the 'data-options' attribute and make it an array
		var options = $this.attr('data-options').split(',');

		$.each(options, function(i, option){
			input.append($('<option/>', {
				value: option,
				selected: option === $this.text(),
				text: option
			}));
		});

		$this.after(input);
	});

	$form.find('[data-type=multi-select]').each(function(){
		var $this = $(this);

		var container = $('<div/>', {
			class: 'multi-select form-group hidden'
		}).append();

		var input = $( '<select/>', {
				class: 'form-control',
				multiple: 'true',
				value: $this.text()
			});

		container.append(input);

		// get the options for the 'data-options' attribute and make it an array
		var options = $this.attr('data-options').split(',');

		$.each(options, function(i, option){
			input.append($('<option/>', {
				value: option,
				selected: $this.text().contains(option),
				text: option
			}));
		});

		$this.after(container);
	});

	$form.find('[data-type=radio]').each(function(){
		var $this = $(this);

		var container = $('<div/>', {
			class: 'radio-group hidden'
		});

		// get the options for the 'data-options' attribute and make it an array
		var options = $this.attr('data-options').split(',');

		$.each(options, function(i, option){
			container
			.append($('<div/>', { class: 'radio' })
			.append($('<label/>', {text: option})
			.prepend($('<input/>', {
							type: 'radio',
							name: 'TODO-radio',
							checked: $this.text() === option
						})
					)
				)
			);
		});

		$this.after(container);
	});

	$form.find('[data-type=checkbox]').each(function(){
		var $this = $(this);

		var container = $('<div/>', {
			class: 'checkbox-group hidden'
		});

		// get the options for the 'data-options' attribute and make it an array
		var options = $this.attr('data-options').split(',');

		$.each(options, function(i, option){
			container
			.append($('<div/>', { class: 'checkbox' })
			.append($('<label/>', {text: option})
			.prepend($('<input/>', {
							type: 'checkbox',
							name: 'TODO-checkbox',
							checked: $this.text() === option
						})
					)
				)
			);
		});

		$this.after(container);
	});

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
		$this.text($this.text() === 'Update' ? 'Cancel' : 'Update');

		// toggle save button
		$form.find('.btn-save').toggleClass('hidden');
	});
	//click update
	//all available inputs become the appropriate type of input
	//save button saves the data
	//cancel button flips away from inputs
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