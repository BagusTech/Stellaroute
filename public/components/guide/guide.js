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

		$cardsWrapper.prop('ArrayItemTemplate', e.data.cardTemplate);
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
			//$card.removeClass('guide-card--edit-mode');
			$card.parent().removeClass('guide-card--edit-mode');
			
			if($cardTab.attr('aria-expanded') === 'false') {
				$cardTab.click();
			}
		});

		$card.on('enterEditMode', () => {
			//$card.addClass('guide-card--edit-mode');
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

			//const $this = $(e.currentTarget);
			//const style = $this.attr('card-style');

			//$cardStyles.not($this).removeClass('card-styles--style__active');
			//$this.addClass('card-styles--style__active');
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
		const $guideDetailsForm = $('#GuideDetailsForm');
		const $guideDetailsSave = $guideDetailsForm.find('[duck-button="submit"]');
		const $guideDetailsSaveIcon = $guideDetailsSave.find('.fa');
		const $guideDetailsEdit = $guideDetailsForm.find('[duck-button="edit"]');
		const $guideDetailsEditIcon = $guideDetailsEdit.find('.fa');
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
		const $cardTemplate = $(`
			<div duck-type="object">
				<button class="btn btn-default guide-card--add-card" duck-button='add', duck-add='before'>
					<span>Add&nbsp;</span>
					<i class='fa fa-chevron-right' aria-hidden='true'></i>
				</button>
				<div class="input-group guide-card--admin js-card guide-card--big" data-sort="item">
					<button class="btn btn-default guide-card--edit-toggle js-card-toggle">
						<i class="fa fa-pencil" aria-hidden="true"></i>
					</button>
					<div class="input-group-addon" data-sort="handle">
						<i class="fa fa-arrows-v" aria-hidden="true"></i>
					</div>
					<div class="panel panel-default" data-function="accordion" data-position="0.2">
						<div class="panel-heading" role="tab" aria-expanded="true" id="NewCard">
							<h2 class="panel-title js-card-title">New Card</h2>
						</div>
						<div class="p-0" role="tabpanel" aria-hidden="false" style="display: block;">
							<div class="panel-body">
								<div class="row">
									<div class="col-xs-12 col-md-6 guide-card--edit">
										<div class="form-horizontal">
											<div class="form-group" duck-field="title" duck-type="string">
												<label class="col-sm-2 control-label">Title</label>
												<div class="col-sm-10">
													<input class="form-control" duck-value="" value="New Card" type="text" />
												</div>
											</div>
											<div class="form-group" duck-field="image" duck-type="image">
												<label class="col-sm-2 control-label">Image</label>
												<div class="col-sm-10">
													<input class="hidden" duck-value="" value="" type="hidden" />
													<div class="form-control" duck-button="image-select">
														<i class="fa fa-image" aria-hidden="true"></i>
														<span class="pl-Sm" duck-image-value=""></span>
													</div>
												</div>
											</div>
											<div class="form-group" duck-field="text" duck-type="wysiwyg">
												<label class="col-sm-2 control-label">Text</label>
												<div class="col-sm-10">
													<div class="summernote" style="display: none;">
														This is there the Text goes
													</div>
												</div>
											</div>
											<div class="form-group" duck-field="style" duck-type="select">
												<label class="col-sm-2 control-label">Style</label>
												<div class="col-sm-10">
													<select class="form-control" duck-value="">
														<option value="big" selected="">Big Card</option>
														<option value="small">Small Card</option>
														<option value="section">Section</option>
														<option value="sub">Sub Section</option>
														<option value="img">Image Only</option>
														<option value="plain">Plain Text</option>
														<option value="white">White Text</option>
														<option value="danger">Danger Text</option>
														<option value="success">Success Text</option>
														<option value="info">Info Text</option>
													</select>
												</div>
											</div>
										</div>
									</div>
									<div class="col-xs-12 col-md-6 guide-card--view">
										<div class="card-styles--preview" card-style="section">
											<div class="guide-card--card guide-card--card__big">
												<h2 class="guide-card--title js-card-title">New Card
												</h2>
												<div class="guide-card--text js-card-text">This is there the Text goes
													<br>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="sub">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--body">
													<h3 class="guide-card--title js-card-title">New Card
													</h3>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper card-styles--preview__active" card-style="big">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--body">
													<img class="guide-card--img js-card-image" src="/images/no-image.svg">
													<h3 class="guide-card--title js-card-title">New Card
													</h3>
													<div class="guide-card--text js-card-text">This is there the Text goes
														<br>
													</div>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="small">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--body">
													<img class="guide-card--img js-card-image" src="/images/no-image.svg">
													<div>
														<h4 class="guide-card--title js-card-title">New Card
														</h4>
														<div class="guide-card--text js-card-text">This is there the Text goes
															<br>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="img">
											<div class="guide-card--card guide-card--card__big">
												<img class="guide-card--img js-card-image" src="/images/no-image.svg">
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="plain">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--text js-card-text">This is there the Text goes
													<br>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="white">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--body">
													<div class="guide-card--text js-card-text">This is there the Text goes
														<br>
													</div>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="danger">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--body">
													<div class="guide-card--text js-card-text">This is there the Text goes
														<br>
													</div>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="success">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--body">
													<div class="guide-card--text js-card-text">This is there the Text goes
														<br>
													</div>
												</div>
											</div>
										</div>
										<div class="card-styles--preview guide-card--wrapper" card-style="info">
											<div class="guide-card--card guide-card--card__big">
												<div class="guide-card--body">
													<div class="guide-card--text js-card-text">This is there the Text goes
														<br>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="panel-footer text-right">
								<button class="btn btn-danger" duck-button="delete">Delete Card</button>
								<button class="btn btn-info js-card-toggle">Preview</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`);

		$('.js-card').guideCard();

		console.log($cardsFormSaveButton.length)

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
			
			const $error = $('<div class="alert alert-danger p-A z-1 l-0 r-0 t-0">Something went wrong, please try again.</div>');
			$cardsWrapper.prepend($error);

			setTimeout(() => {
				$error.slideUp(270);
			}, 3000);

			setTimeout(() => {
				$error.remove();
			}, 3270);
			
			$cardsFormSaveIcon.toggleClass('fa-spinner fa-spin fa-floppy-o');
			$cardsFormSaveButton.prop('disabled', false);
		});

		$addCard.on('click', {cardsWrapper: $cardsWrapper, addCardIcon: $addCardIcon, cardTemplate: $cardTemplate}, showAddButtons);
		$expandeCollapse.on('click', {cardsWrapper: $cardsWrapper, expandeCollapseIcon: $expandeCollapseIcon, previewCardsIcon: $previewCardsIcon}, expandeCollapseAll);
		$previewCards.on('click', {cardsWrapper: $cardsWrapper, expandeCollapseIcon: $expandeCollapseIcon, previewCardsIcon: $previewCardsIcon}, previewCards);

		$guideDetailsEdit.on('click', (e) => {
			$guideDetailsEditIcon.toggleClass('fa-eye fa-pencil');
		});

		$guideDetailsForm.on('duck.form.submitted', (e) => {
			e.stopPropagation();

			$guideDetailsSaveIcon.toggleClass('hidden');
		});
		$guideDetailsForm.on('duck.form.success', (e) => {
			e.stopPropagation();

			$guideDetailsSaveIcon.toggleClass('hidden');
			$guideDetailsSave.prop('disabled', false);
			$guideDetailsEdit.click();
		});
		$guideDetailsForm.on('duck.form.error', (e) => {
			e.stopPropagation();

			$guideDetailsSaveIcon.toggleClass('hidden');
			$guideDetailsSave.prop('disabled', false);
		});
	});
}(jQuery.noConflict())