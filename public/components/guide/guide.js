/* global jQuery */

void function initCardStyle($){
	'use strict';

	function expandeCollapseAll(e) {
		e.stopPropagation();
		e.preventDefault();

		const $cardsWrapper = e.data.cardsWrapper;
		const $card = $cardsWrapper.find('[data-sort="item"]');
		const $expandeCollapseIcon = e.data.expandeCollapseIcon;
		const isExpanded = $expandeCollapseIcon.hasClass('fa-compress');
		const $previewCardsIcon = e.data.previewCardsIcon;

		$cardsWrapper.find(`[role="tab"][aria-expanded="${isExpanded ? true : false}"]`).click();
		$card.addClass('guide-card--edit-mode');
		$expandeCollapseIcon.toggleClass('fa-compress fa-expand')
		$previewCardsIcon.removeClass('fa-pencil').addClass('fa-eye')
	}

	function previewCards(e) {
		e.stopPropagation();
		e.preventDefault();

		const $cardsWrapper = e.data.cardsWrapper;
		const $expandeCollapseIcon = e.data.expandeCollapseIcon;
		const $card = $cardsWrapper.find('.js-card');
		const $icon = e.data.previewCardsIcon;

		$cardsWrapper.find(`[role="tab"][aria-expanded="false"]`).click();
		$expandeCollapseIcon.removeClass('fa-expand').addClass('fa-compress');

		if($icon.hasClass('fa-eye')) {
			$card.trigger('exitEditMode');
		} else {
			$card.trigger('enterEditMode');
		}
		
		$icon.toggleClass('fa-eye fa-pencil')
	}

	function hideAddButtons(e) {
		e.data.cardsWrapper.find('[duck-button="add"]').addClass('hidden');
		e.data.addCardIcon.removeClass('rotate-45');

		$(e.currentTarget).off('click', hideAddButtons);
	}

	function showAddButtons(e) {
		e.stopPropagation();
		e.preventDefault();

		const $cardsWrapper = e.data.cardsWrapper;
		const $addCardIcon = e.data.addCardIcon;
		const $addButtons = $cardsWrapper.find('[duck-button="add"]');

		
		$addButtons.removeClass('hidden');

		if(!$addCardIcon.hasClass('rotate-45')) {
			$('body').on('click', {cardsWrapper: $cardsWrapper, addCardIcon: $addCardIcon}, hideAddButtons);

			$addCardIcon.addClass('rotate-45');
		} else {
			$('body').click();
		}
	}

	const defaultTitle = 'Card Title';
	const defaultText = 'This is where the <strong>Text</strong> for the card will go.';
	const defaultImageSrc = 'images/no-image.svg';

	function initCard(wrapper) {
		const $card = $(wrapper);
		const $cardTab = $card.find('.panel-heading[role="tab"]');
		const $cardStyles = $card.find('[duck-field="style"] select');
		const $cardPreviews = $card.find('.card-styles--preview');
		const $cardTitle = $card.find('[duck-type="string"] [duck-value]');
		const $cardTitles = $card.find('.js-card-title');
		const $cardImage = $card.find('[duck-type="image"] [duck-value]');
		const $cardImages = $card.find('.js-card-image');
		const $cardText = $card.find('.summernote');
		const $cardTexts = $card.find('.js-card-text');
		const $editToggle = $card.find('.js-card-toggle');

		$editToggle.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			if($card.parent().hasClass('guide-card--edit-mode')) {
				$card.trigger('exitEditMode');
			} else {
				$card.trigger('enterEditMode');
			}
		});

		$card.on('exitEditMode', () => {
			$card.parent().removeClass('guide-card--edit-mode');
			
			if($cardTab.attr('aria-expanded') === 'false') {
				$cardTab.click();
			}
		});

		$card.on('enterEditMode', () => {
			$card.parent().addClass('guide-card--edit-mode');
		});

		$cardTitle.on('input', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$cardTitles.text($cardTitle.val() || defaultTitle);
		});

		$cardText.on('summernote.change', (we, contents) => {
			$cardTexts.html(contents || defaultText);
		});

		$cardStyles.on('input', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$cardPreviews.removeClass('card-styles--preview__active');
			$card.find(`.card-styles--preview[card-style="${$cardStyles.val()}"]`).addClass('card-styles--preview__active');
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
	}

	$.fn.guideCard = function init() {
		return this.each((i, wrapper) => {
			initCard(wrapper)
		})
	}

	$(() => {
		const $subHeader = $('.sub-header');
		const $guideDetailsForm = $('#GuideDetailsForm');
		const $guideDetailsSave = $guideDetailsForm.find('[duck-button="submit"]');
		const $guideDetailsSaveIcon = $guideDetailsSave.find('.fa');
		const $guideDetailsEdit = $guideDetailsForm.find('[duck-button="edit"]');
		const $guideDetailsEditIcon = $guideDetailsEdit.find('.fa');
		const $bannerImage = $guideDetailsForm.find('[duck-field="bannerImage"] [duck-value]');
		const $cardsForm = $('#GuideCards');
		const $cardsFormSaveButton = $cardsForm.find('[duck-button="submit"]');
		const $cardsFormSaveIcon = $cardsFormSaveButton.find('.fa');
		const $cardsWrapper = $('.js-guide-cards');
		const $expandeCollapse = $('.js-expand-collapse');
		const $expandeCollapseIcon = $expandeCollapse.find('.fa');
		const $previewCards = $('.js-preview-cards');
		const $previewCardsIcon = $previewCards.find('.fa');
		const $addCard = $('.js-add-card-start');
		const $addCardIcon = $addCard.find('.fa');
		const $error = $('<div class="alert alert-danger p-A z-1 l-0 r-0 t-0">Something went wrong, please try again.</div>');

		$.ajax({
			url: '/renderPug',
			data: {file: '../views/guides/cards/_card.pug', locals: {isMe: true, card: {style: 'big', title: 'New Card', text: 'New card text goes here.'}}},
			success: (data) => {
				$cardsWrapper.prop('ArrayItemTemplate', $(data));
			},
		});

		$('.js-card').guideCard();

		$cardsForm.on('duck.form.submitted', (e) => {
			e.stopPropagation();
			
			$cardsFormSaveIcon.toggleClass('fa-spinner fa-spin fa-floppy-o');
		});

		$cardsForm.on('duck.form.success', (e) => {
			e.stopPropagation();
			
			$cardsFormSaveIcon.toggleClass('fa-spinner fa-spin fa-floppy-o');
			$cardsFormSaveButton.prop('disabled', false);
			$cardsWrapper.find('.js-card').trigger('exitEditMode');
			$previewCardsIcon.removeClass('fa-eye').addClass('fa-pencil')
		});

		$cardsForm.on('duck.form.error', (e) => {
			e.stopPropagation();
			
			const _$error = $error.clone();

			$cardsWrapper.prepend(_$error);

			setTimeout(() => {
				_$error.slideUp(270);
			}, 3000);

			setTimeout(() => {
				_$error.remove();
			}, 3270);
			
			$cardsFormSaveIcon.toggleClass('fa-spinner fa-spin fa-floppy-o');
			$cardsFormSaveButton.prop('disabled', false);
		});

		$addCard.on('click', {cardsWrapper: $cardsWrapper, addCardIcon: $addCardIcon}, showAddButtons);
		$expandeCollapse.on('click', {cardsWrapper: $cardsWrapper, expandeCollapseIcon: $expandeCollapseIcon, previewCardsIcon: $previewCardsIcon}, expandeCollapseAll);
		$previewCards.on('click', {cardsWrapper: $cardsWrapper, expandeCollapseIcon: $expandeCollapseIcon, previewCardsIcon: $previewCardsIcon}, previewCards);

		$guideDetailsEdit.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$guideDetailsEditIcon.toggleClass('fa-eye fa-pencil');
		});

		$guideDetailsForm.on('duck.form.submitted', (e) => {
			e.stopPropagation();

			$guideDetailsSaveIcon.toggleClass('hidden');
		});

		$guideDetailsForm.on('duck.form.success', (e) => {
			e.stopPropagation();

			const imagePath = `https://s3-us-west-2.amazonaws.com/stellaroute/${$bannerImage.val().replace('.jpg', '-large.jpg')}`;
			
			$guideDetailsForm.modal('hide')

			$subHeader.css('background-image', `url("${imagePath}")`);
			$guideDetailsSaveIcon.toggleClass('hidden');
			$guideDetailsSave.prop('disabled', false);
			$guideDetailsEdit.click();
		});
		$guideDetailsForm.on('duck.form.error', (e) => {
			e.stopPropagation();

			const _$error = $error.clone();

			$guideDetailsForm.prepend(_$error);

			setTimeout(() => {
				_$error.slideUp(270);
			}, 3000);

			setTimeout(() => {
				_$error.remove();
			}, 3270);

			$guideDetailsSaveIcon.toggleClass('hidden');
			$guideDetailsSave.prop('disabled', false);
		});
	});
}(jQuery.noConflict())