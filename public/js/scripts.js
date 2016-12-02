/*global jQuery */

// Once window is loaded, do this
void function initScripts($){
	'use strict'

	$(() => {
		// hide flash message after 1.5s
		setTimeout(() => {
			$('.flash-message-container').slideUp(1000);
		}, 1500);
		
		// style multiselect via http://davidstutz.github.io/bootstrap-multiselect/
		$('select[multiple]').multiselect();

		// have cursor focus on input after modal opens
		$('button[data-target="#LoginModal"]').click(function onClick(){
			const id = $(this).attr('data-target');
			setTimeout(() => {
				$(`${id} input`).first().focus();
			}, 200);
		});

		// initialize summernote where it is being used
		$('.summernote').summernote({height: 150});
	});	

	/* eslint-disable */
	// polyfills
	if (!String.prototype.contains) {
		String.prototype.contains = function(search, start) {
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
	/* eslint-enable */
}(jQuery.noConflict());

/*
	// should probably be moved into it's own file
	$('.js-new-country .js-make-duplicate').click(() => {
		const duplicate = $('.js-duplicate').last().clone();
		$('.js-duplicate').last().after(duplicate);
		$('.js-duplicate').last().find('.hidden').removeClass('hidden');
	});

	$('.js-new-country').on('click', '.js-delete-row', function deleteRow(){
		$(this).closest('.js-duplicate').detach();
	});


	// should probably be moved into it's own file
	$('.js-update-form .js-make-duplicate').click(() => {
		const duplicate = $('.js-duplicate').last().clone();

		$('.js-duplicate').last().after(duplicate);
		$('.js-duplicate').last().find('.js-name-language option').attr('selected', false);
		$('.js-duplicate').last().find('input[name="native.name"]').attr('value', String());
		$('.js-duplicate').last().find('.form-control-static').addClass('hidden');
	});

	$('.js-update-form').on('click', '.js-delete-row', function deleteRow(){
		$(this).closest('.js-duplicate').detach();
	});
	
	$('.js-languages .multiselect-container input').on('click', function updateOptions(){
		const $this = $(this);

		setTimeout(() => {
			const $countryLanguages = $this.closest('.multiselect-container').find('li.active');
			const $currentCountryLanguageList = $('.js-name-language').find('option').length ? $('.js-name-language') : null; // <select> with each language as an <option>
			
			// if this language isn't in the country language list, add it as an option
			$countryLanguages.each(function updateOption(){
				if(!$currentCountryLanguageList){
					$('.js-name-language').append($('<option/>', {text: $(this).text().substring(1)}));
				} else if($currentCountryLanguageList.find('option').text().indexOf($(this).text().substring(1)) === -1){
					for(const i in $('.js-name-language option')){
						if($(this).text().substring(1) < $($('.js-name-language option')[i]).text()){
							$($('.js-name-language option')[i]).before($('<option/>', {text: $(this).text().substring(1)}));
							return;
						}

						if(i === $('.js-name-language option').length -1){
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

			$('.js-name-language option').sort((a, b) => {
				a = $(a).text().replace(' ', '');
				b = $(b).text().replace(' ', '');


				// compare
				if(a > b) {
					return 1;
				} else if(a < b) {
					return -1;
				}
				
				return 0;
			});
		}, 100);
	});
	// end new file
	
	

	// for updating countries
	$('.js-update-country').click(function(){
		$(this).hide();
		$('#Update').removeClass('hidden');

		$('.js-update').hide();
		$('.form-group').removeClass('hidden');
	});

	//used for all update forms
	function update(updateValues){
		const $form = $('.update-form');

		let $inputs = $form.find('p + .hidden');
		let $values = $form.find('.form-control-static');

		if(updateValues){
			$form.find('.btn-update').unbind('click');

			$inputs = $form.find('p + .hidden');
			$values = $form.find('.form-control-static');
		}

		// toggle between seeing input fields and
		$form.find('.btn-update').click(function(){
			const $this = $(this);

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

	// initilize all update pages
	update();
*/