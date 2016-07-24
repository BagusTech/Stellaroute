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

	// should probably be moved into it's own file
	$('.js-new-country .js-make-duplicate').click(function duplicateNativeNameRow(){
		var duplicate = $('.js-duplicate').last().clone();
		$('.js-duplicate').last().after(duplicate);
		$('.js-duplicate').last().find('.hidden').removeClass('hidden');
	});

	$('.js-new-country').on('click', '.js-delete-row', function(){
		$(this).closest('.js-duplicate').detach();
	});


	// should probably be moved into it's own file
	$('.js-update-form .js-make-duplicate').click(function duplicateNativeNameRow(){
		var duplicate = $('.js-duplicate').last().clone();

		$('.js-duplicate').last().after(duplicate);
		$('.js-duplicate').last().find('.js-name-language option').attr('selected', false);
		$('.js-duplicate').last().find('input[name="native.name"]').attr('value', String());
		$('.js-duplicate').last().find('.form-control-static').addClass('hidden');
	});

	$('.js-update-form').on('click', '.js-delete-row', function(){
		$(this).closest('.js-duplicate').detach();
	});
	
	$('.js-languages .multiselect-container input').on('click', function(){
		var $this = $(this);

		setTimeout(function(){
			var $countryLanguages = $this.closest('.multiselect-container').find('li.active');
			var $currentCountryLanguageList = $('.js-name-language').find('option').length ? $('.js-name-language') : null; // <select> with each language as an <option>
			
			// if this language isn't in the country language list, add it as an option
			$countryLanguages.each(function(){
				if(!$currentCountryLanguageList){
					$('.js-name-language').append($('<option/>', {text: $(this).text().substring(1)}));
				} else if($currentCountryLanguageList.find('option').text().indexOf($(this).text().substring(1)) === -1){
					for(var i in $('.js-name-language option')){
						if($(this).text().substring(1) < $($('.js-name-language option')[i]).text()){
							$($('.js-name-language option')[i]).before($('<option/>', {text: $(this).text().substring(1)}));
							return;
						}

						if(i == $('.js-name-language option').length -1){
							$('.js-name-language').append($('<option/>', {text: $(this).text().substring(1)}));
						}
					}
				}
			});

			// if this language is no longer one of the country languages- remove it
			if($currentCountryLanguageList){
				$currentCountryLanguageList.find('option').each(function removeDeselectedLanguages(){
					if($countryLanguages.text().indexOf($(this).text()) === -1){
						$(this).detach();
					}
				});
			}

			$('.js-name-language option').sort(function sortAtoZ(a, b) {
				a = $(a).text().replace(' ', '');
				b = $(b).text().replace(' ', '');

				console.log(a);
				console.log(b);

				// compare
				if(a > b) {
					console.log(1);
					return 1;
				} else if(a < b) {
					console.log(2);
					return -1;
				} else {
					console.log(3);
					return 0;
				}
			});
		}, 100);
	});
	// end new file

	$('button[data-target]').click(function onClick(e){
		var id = $(this).attr('data-target');
		setTimeout(function focusElement(){
			$(id + ' input').first().focus();
		}, 200);
	});
}

function update(updateValues){
	//used for all update forms

	var $form = $('.update-form');

	var $inputs = $form.find('p + .hidden');
	var $values = $form.find('.form-control-static');

	if(updateValues){
		$form.find('.btn-update').unbind('click');

		$inputs = $form.find('p + .hidden');
		$values = $form.find('.form-control-static');
	}

	// toggle between seeing input fields and
	$form.find('.btn-update').click(function(){
		var $this = $(this);

		// toggle between static values and inputs
		$inputs.toggleClass('hidden');
		$values.toggleClass('hidden');

		// toggle native names area when there aren't any native names
		$('.js-no-native-name').toggleClass('hidden');

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