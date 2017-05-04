/* global jQuery */

void function _initFavorite($) {
	'use strict';

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
		$icon.addClass('fa-spin');

		$.ajax({
			type: 'POST',
			url: '/favorite',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: () => {
				$button.prop('disabled', false);
				$icon.removeClass('fa-spin');
				$button.attr('isFavorite', !isFavorite)
						.toggleClass('favorite-button__active');
			},
			error: () => {
				$icon.removeClass('fa-spin');
			},
		})
	}

	function triggerFavorite(e) {
		e.stopPropagation();
		e.preventDefault();

		const $button = e.data.button;

		$button.trigger('duck.favorite');
	}

	$.fn.favoriteButton = function initFavorite() {
		return this.each((i, wrapper) => {
			const $button = $(wrapper);
			const $icon = $button.find('.fa');

			$button.off('click', triggerFavorite).on('click', {button: $button}, triggerFavorite);
			$button.off('duck.favorite', favorite).on('duck.favorite', {button: $button, icon: $icon}, favorite)
		});
	}

	$(() => {
		$('.js-favorite-button').favoriteButton()
	});
}(jQuery.noConflict())

/*
button.js-favorite-button.favorite-button(
	data-guide=guide,
	data-card=card,
	data-user= user.Id,
	type='submit',
	isFavorite= isFavorite,
	class= isFavorite ? (card ? 'favorite-button__icon favorite-button__active' : 'favorite-button__button favorite-button__active') : (card ? 'favorite-button__icon' : 'favorite-button__button'))
*/