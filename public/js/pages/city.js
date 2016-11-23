/* global jQuery, duck */

void function initCityFood($){
	'use strict'

	function toggleUpdateFood(){
		const $this = $(this);
		const $wrapper = $this.closest('.content-card');

		$wrapper.find('.js-food-item').toggleClass('hidden');
		$wrapper.find('.js-update-food-item').toggleClass('hidden');
		$wrapper.find('.js-edit-food-submit').toggleClass('hidden');

		$this.toggleClass('btn-primary')
			.toggleClass('btn-warning')
			.text($this.text() === 'Edit' ? 'Cancel' : 'Edit');
	}

	function updateCityFood(currentItem, wrapper){
		return () => {
			const $inputs = $(wrapper).find('.js-food-field');
			const updatedItem = {
				Id: $('#CityId').val(),
				food: {
					foods: currentItem && currentItem.food && currentItem.food.foods || [],
				},
			}
			const newFood = { Id: $(this).siblings('.js-food-id').val() || duck().uuid() }

			$inputs.each((i, item) => {
				const $item = $(item);

				if($item.attr('data-summernote')){
					newFood[$item.attr('name')] = $item.find('> .summernote').summernote('code');
				} else if($item.attr('name') === 'dishes' && $item.val()){
					newFood[$item.attr('name')] = $item.val().split(', ');
				} else if($item.attr('type') === 'checkbox') {
					if(newFood[$item.attr('name')] && $item.prop('checked')){
						newFood[$item.attr('name')].push($item.val());
					} else if($item.prop('checked')){
						newFood[$item.attr('name')] = [$item.val()];
					}
				} else if($item.val()) {
					newFood[$item.attr('name')] = $item.val();
				}
			});

			updatedItem.food.foods.push(newFood);

			duck('Cities').update(updatedItem, () => {location.reload();});
		}
	}

	jQuery(() => {
		duck('Cities').get({field: 'Id', value: $('#CityId').val(), findOne: true}, (data) => {
			$('#AddFoodSubmit').click(updateCityFood(data, '#AddFoodForm'));
			$('.js-edit-food').click(toggleUpdateFood);
			$('.js-edit-food-submit').click(() => {
				updateCityFood(data, $(this).closest('.content-card'))()
			})
		});
	});
}(jQuery)