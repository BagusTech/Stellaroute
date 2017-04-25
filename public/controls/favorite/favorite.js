/* global jQuery, duck */

void function initFavorite($, duck) {
	'use strict';

	duck();

	function favorite(e) {
		e.stopPropagation();
		e.preventDefault();

		const $button = e.data.button;
		const $icon = e.data.icon;
		const isFavorite = $button.attr('isFavorite') === 'true';
		const data = {
			guide: $button.attr('data-guide'),
			card: $button.attr('data-card'),
			user: $button.attr('data-user'),
			addFavorite: !isFavorite,
		}

		$button.prop('disabled', true);
		$icon.removeClass('hidden');

		$.ajax({
			type: 'POST',
			url: '/favorite',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: () => {
				$button.prop('disabled', false);
				$icon.addClass('hidden');
				$button.attr('isFavorite', !isFavorite)
						.toggleClass('favorite-button__active');
			},
			error: () => {
				$icon.addClass('hidden');
				$button.text('Something went wrong, please refresh the page and try again');
			},
		})
	}

	function triggerFavorite(e) {
		e.stopPropagation();
		e.preventDefault();

		const $button = e.data.button;

		$button.trigger('duck.favorite');
	}

	$(() => {
		const $button = $('.js-favorite-button');
		const $icon = $button.find('.fa-spinner');

		$button.off('click', triggerFavorite).on('click', {button: $button}, triggerFavorite);
		$button.off('duck.favorite', favorite).on('duck.favorite', {button: $button, icon: $icon}, favorite)
	});
}(jQuery.noConflict(), duck)

/*
button.js-favorite-button.favorite-button(
	data-guide=guide,
	data-card=card,
	data-user= user.Id,
	type='submit',
	isFavorite= isFavorite,
	class= isFavorite ? (card ? 'favorite-button__icon favorite-button__active' : 'favorite-button__button favorite-button__active') : (card ? 'favorite-button__icon' : 'favorite-button__button'))
*/