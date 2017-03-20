/* global jQuery */

void function initCardStyle($){
	'use strict';

	const defaultTitle = 'Card Title';
	const defaultText = 'This is where the <strong>Text</strong> for the card will go.';
	const defaultImageSrc = 'images/no-image.svg';

	$(() => {
		const $cards = $('.js-card');
		$cards.each((i, card) => {
			const $card = $(card);
			const $cardStyles = $card.find('.card-styles--style');
			const $cardPreviews = $card.find('.card-styles--preview');
			const $cardTitle = $card.find('[duck-type="string"] [duck-value]');
			const $cardTitles = $card.find('.js-card-title');
			const $cardImage = $card.find('[duck-type="image"] [duck-value]');
			const $cardImages = $card.find('.js-card-image');
			const $cardText = $card.find('.summernote');
			const $cardTexts = $card.find('.js-card-text');

			$cardTitle.on('input', (e) => {
				e.stopPropagation();
				e.preventDefault();

				$cardTitles.text($cardTitle.val() || defaultTitle);
			});

			$cardText.on('summernote.change', (we, contents) => {
				$cardTexts.html(contents || defaultText);
			});

			$cardStyles.on('click', (e) => {
				e.stopPropagation();
				e.preventDefault();

				const $this = $(e.currentTarget);
				const style = $this.attr('card-style');

				$cardStyles.not($this).removeClass('card-styles--style__active');
				$this.addClass('card-styles--style__active');
				$cardPreviews.removeClass('card-styles--preview__active');
				$card.find(`.card-styles--preview[card-style="${style}"]`).addClass('card-styles--preview__active');
			});

			$cardImage.on('change', (e) => {
				e.stopPropagation();
				e.preventDefault();

				const imgSrc = $cardImage.val() ? `https://s3-us-west-2.amazonaws.com/stellaroute/${$cardImage.val().replace('.', '-medium.')}` : defaultImageSrc;


				$cardImages.each((j, _cardImage) => {
					const $_cardImage = $(_cardImage);

					if($_cardImage.attr('style')) {
						$_cardImage.attr('style', `background-image: url('${imgSrc}')`);
					} else {
						$_cardImage.attr('src', imgSrc);
					}
				});
			});
		});
	});
}(jQuery.noConflict())