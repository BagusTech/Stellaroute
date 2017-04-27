/* global jQuery */

void function initCardStyle($){
	'use strict';

	const $error = $('<div class="alert alert-danger p-A z-1 l-0 r-0 t-0">Something went wrong, please try again.</div>');

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
		e.data.addCardIcon.removeClass('fa-eye').addClass('fa-pencil');
	}

	function showAddButtons(e) {
		e.stopPropagation();
		e.preventDefault();

		const $cardsWrapper = e.data.cardsWrapper;
		const $addCardIcon = e.data.addCardIcon;
		const $addButtons = $cardsWrapper.find('[duck-button="add"]');

		
		$addButtons.removeClass('hidden');

		if(!$addCardIcon.hasClass('fa-eye')) {
			$addCardIcon.removeClass('fa-pencil').addClass('fa-eye');
		} else {
			hideAddButtons({data: {cardsWrapper: $cardsWrapper, addCardIcon: $addCardIcon}})
		}
	}

	function initCard(wrapper) {
		const $card = $(wrapper);
		const $cardForm = $card.closest('[duck-table]');
		const $cardTab = $card.find('.panel-heading[role="tab"]');
		const $cardStyles = $card.find('[duck-field="style"] select');
		const $cardPreviews = $card.find('.card-styles--preview');
		const $cardTitle = $card.find('[duck-type="string"] [duck-value]');
		const $cardTitles = $card.find('.js-card-title');
		const $cardImageForm = $card.find('[duck-type="image"]');
		const $cardImage = $cardImageForm.find('[duck-value]');
		const $cardImages = $card.find('.js-card-image');
		const $cardTextFrom = $card.find('[duck-type="wysiwyg"]');
		const $cardText = $cardTextFrom.find('.summernote');
		const $cardTexts = $card.find('.js-card-text');
		const $editToggle = $card.find('.js-card-toggle');
		const noImageCards = ['section', 'sub', 'plain', 'white', 'danger', 'success', 'info'];
		const noTextCards = ['img', 'sub'];
		

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

			const title = $cardTitle.val();

			if(title) {
				$cardTitles.removeClass('guide-card--placeholder').text(title);
			} else {
				$cardTitles.addClass('guide-card--placeholder').text('Card Title');
			}
		});

		$cardText.on('summernote.change', (we, contents) => {
			if(contents) {
				$cardTexts.removeClass('guide-card--placeholder').html(contents);
			} else {
				$cardTexts.addClass('guide-card--placeholder').html('This is where the <strong>Text</strong> for the card will go.');
			}
		});

		$cardStyles.on('input', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const style = $cardStyles.val();

			$cardPreviews.removeClass('card-styles--preview__active');
			$cardImageForm.removeClass('hidden');
			$cardTextFrom.removeClass('hidden');

			$card.find(`.card-styles--preview[card-style="${style}"]`).addClass('card-styles--preview__active');

			if(noImageCards.indexOf(style) > -1) {
				$cardImageForm.addClass('hidden');
			}

			if(noTextCards.indexOf(style) > -1) {
				$cardTextFrom.addClass('hidden');
			}
		});

		$cardImage.on('change', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const imgSrc = $cardImage.val() ? `https://s3-us-west-2.amazonaws.com/stellaroute/${$cardImage.val().replace('.', '-medium.')}` : 'images/no-image--small.svg';


			$cardImages.each((j, _cardImage) => {
				const $_cardImage = $(_cardImage);

				$_cardImage.removeClass('guide-card--img__no-img');

				if($_cardImage.attr('style')) {
					$_cardImage.attr('style', `background-image: url('${imgSrc}')`);
				} else {
					$_cardImage.attr('src', imgSrc);
				}
			});
		});

		$card.on('click', '.js-delete-card', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const $deleteForm = $(e.delegateTarget).parent().find('.js-delete-card-form');

			$deleteForm.addClass('z-1').delay(10).addClass('o-1');
		});

		$card.parent().find('[duck-button="delete"]').on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$cardForm.trigger('duck.form.submit');
		})

		$card.parent().on('click', '.js-cancel-delete', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const $deleteForm = $(e.delegateTarget).find('.js-delete-card-form');

			$deleteForm.removeClass('o-1').delay(180).removeClass('z-1');
		});
	}

	$.fn.guideCard = function init() {
		return this.each((i, wrapper) => {
			initCard(wrapper)
		})	
	}

	function formatCardsForNav(_cards) {
		let endSubCards = _cards.length
		const cards = _cards.map((_card, cardIndex, arr) => {
			const obj = {};

			obj.section = _card
			obj.subCards = [];

			if(obj.section.style !== 'section') {
				return obj;
			}

			const startIndex = cardIndex;
			let endIndex = _cards.length;
			obj.subCards = arr.filter((_subCard, subCardIndex) => {
				if(subCardIndex < cardIndex || subCardIndex >= endSubCards) {
					return false;
				}

				if(_subCard.style === 'section') {
					if(cardIndex !== subCardIndex) {
						endSubCards = subCardIndex;
						endIndex = subCardIndex;
					}
					return false;
				}

				return true;
			});

			_cards.splice(startIndex, (endIndex - startIndex - 1));

			endSubCards = _cards.length;
			return obj;
		}).filter((_) => _);

		return cards;
	}

	function updateBody(e, guide) {
		e.stopPropagation();
		e.preventDefault();

		const $body = e.data.body;
		const cards = guide.cards;
		const locals = {
			isMe: true,
			cards: formatCardsForNav(cards),
			guide: {
				Id: guide.Id,
				isPublished: $('.js-is-publshed-text').hasClass('hidden'),
			},
		};

		$.ajax({
			url: '/renderPug',
			data: {file: '../views/guides/body.pug', locals},
			success: (data) => {
				const $newBody = $(data);
				
				$body.html($newBody).trigger('guide.init.body');
			},
		});
	}

	function initGuideBody(e, skipGlobalInits) {
		e.stopPropagation();

		const $body = e.data.body;
		const $cardsForm = $body.find('[duck-table="Guides"]');
		const $cardsWrapper = $('.js-guide-cards');
		const $expandeCollapse = $('.js-expand-collapse');
		const $expandeCollapseIcon = $expandeCollapse.find('.fa');
		const $previewCards = $('.js-preview-cards');
		const $previewCardsIcon = $previewCards.find('.fa');
		const $addCard = $('.js-add-card-start');
		const $addCardIcon = $addCard.find('.fa');
		const $saveIcons = $cardsWrapper.find('.fa.fa-spinner');

		if(!skipGlobalInits) {
			$body.find('[data-function*="interiorNav"]').interiorNav();
			$body.find('[data-function*="accordion"]').makeAccordion();
			$body.find('[duck-table]').duckForm();
			$body.find('[data-function*="sort"]').sortable();
			$body.find('[data-function*="toggle"]').makeToggle();
			$body.find('[data-function*="form"], [duck-table], form').validateForm();

			// opt in to bootstrap popovers
			$('[data-toggle="tooltip"]').tooltip()

			// initialize summernote where it is being used
			const $summernote = $('.summernote');
			const summernoteLength = $summernote.length;
			let summernoteToInit = 0;
			const summernoteOptions = {
				height: 150,
				disableDragAndDrop: true,
				toolbar: [
					['style', ['bold', 'italic', 'underline', 'clear']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['insert', ['table', 'hr']],
					['link', ['link']],
					['misc', ['fullscreen', 'codeview']],
					['misc', ['undo', 'redo', 'help']],
				],
			};

			// initiating summernotes on interval because it causes a noticable lag
			// if you do ~3+ more at once.
			const initSummernotes = setInterval(() => {
				$summernote.eq(summernoteToInit).summernote(summernoteOptions);
				summernoteToInit++;
				if(summernoteToInit >= (summernoteLength)) {
					clearInterval(initSummernotes);
				}
				
			}, 250);
		}

		$('.js-card').guideCard();

		$.ajax({
			url: '/renderPug',
			data: {file: '../views/guides/cards/_card.pug', locals: {isMe: true, card: {style: 'big'}, startInEditMode: true}},
			success: (data) => {
				$cardsWrapper.prop('ArrayItemTemplate', $(data));
			},
		});

		$cardsForm.on('guide.update.body', {body: $body}, updateBody)

		$cardsForm.on('duck.form.submitted', (evt) => {
			evt.stopPropagation();

			$cardsForm.find('[duck-button="submit"]').prop('disabled', true);

			$cardsForm.addClass('guide-submiting');
			$saveIcons.removeClass('hidden');
			//$cardsForm.find('[duck-button="submit"] .fa').toggleClass('fa-spinner fa-spin fa-floppy-o');
			
		});

		$cardsForm.on('duck.form.success', (evt, item) => {
			evt.stopPropagation();
			
			$cardsForm.trigger('guide.update.body', [item]);
			//$cardsForm.find('[duck-button="submit"] .fa').toggleClass('fa-spinner fa-spin fa-floppy-o');
		});

		$cardsForm.on('duck.form.error', (evt) => {
			evt.stopPropagation();
			
			const _$error = $error.clone();
			$cardsForm.find('[duck-button="submit"]').prop('disabled', false);

			$cardsWrapper.prepend(_$error);

			setTimeout(() => {
				_$error.slideUp(270);
			}, 3000);

			setTimeout(() => {
				_$error.remove();
			}, 3270);
			
			$saveIcons.addClass('hidden');
			$cardsForm.removeClass('guide-submiting');
			//$cardsForm.find('[duck-button="submit"] .fa').toggleClass('fa-spinner fa-spin fa-floppy-o');
		});

		$addCard.on('click', {cardsWrapper: $cardsWrapper, addCardIcon: $addCardIcon}, showAddButtons);
		$expandeCollapse.on('click', {cardsWrapper: $cardsWrapper, expandeCollapseIcon: $expandeCollapseIcon, previewCardsIcon: $previewCardsIcon}, expandeCollapseAll);
		$previewCards.on('click', {cardsWrapper: $cardsWrapper, expandeCollapseIcon: $expandeCollapseIcon, previewCardsIcon: $previewCardsIcon}, previewCards);
	}

	$(() => {
		const $body = $('.js-guide-body');
		$body.on('guide.init.body', {body: $body}, initGuideBody);
		$body.trigger('guide.init.body', [true]);

		const $subHeader = $('.sub-header');
		const $publishForm = $subHeader.find('.js-publish-form');
		const $publish = $publishForm.find('.js-publish');
		const $publishIcon = $publishForm.find('.js-publish-icon');
		const $publishedText = $subHeader.find('.js-is-publshed-text');
		const $guideDetailsForm = $('#GuideDetailsForm');
		const $guideDetailsSaveIcon = $guideDetailsForm.find('[duck-button="submit"] .fa');
		const $guideDetailsEdit = $guideDetailsForm.find('[duck-button="edit"]');
		const $guideDetailsEditIcon = $guideDetailsEdit.find('.fa');
		const $bannerImage = $guideDetailsForm.find('[duck-field="bannerImage"] [duck-value]');

		$publish.on('change', (e) => {
			e.stopPropagation();

			$publishForm.trigger('duck.form.submit')
		});
		$publishForm.on('duck.form.submitted', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$publish.prop('disabled', true);
			$publishIcon.removeClass('hidden');
		});

		$publishForm.on('duck.form.success', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$publishedText.toggleClass('hidden');
			$publish.prop('disabled', false);
			$publishIcon.addClass('hidden');
		});

		$publishForm.on('duck.form.error', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const _$error = $error.clone();

			$publishForm.append(_$error);

			setTimeout(() => {_$error.slideUp(270);}, 3000)
			setTimeout(() => {_$error.remove();}, 3270)

			$publish.prop('disabled', false);
			$publishIcon.addClass('hidden');
		});

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
			$guideDetailsForm.find('[duck-button="submit"]').prop('disabled', false);
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
			$guideDetailsForm.find('[duck-button="submit"]').prop('disabled', false);
		});
	});
}(jQuery.noConflict())