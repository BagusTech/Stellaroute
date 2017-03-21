/* global jQuery */

void function initCardStyle($){
	'use strict';

	const defaultTitle = 'Card Title';
	const defaultText = 'This is where the <strong>Text</strong> for the card will go.';
	const defaultImageSrc = 'images/no-image.svg';

	function initCard(wrapper) {
		const $card = $(wrapper);
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

			if($card.hasClass('guide-card--edit-mode')) {
				$card.trigger('exitEditMode');
			} else {
				$card.trigger('enterEditMode');
			}
		});

		$card.on('exitEditMode', () => {
			$card.removeClass('guide-card--edit-mode');
		});

		$card.on('enterEditMode', () => {
			$card.addClass('guide-card--edit-mode');
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
		$('.js-card').guideCard();

		$("[duck-field='cards']").prop('ArrayItemTemplate', $(`
			<div class="input-group mb-Sm" duck-type="object" data-sort="item">
				<div class="input-group-addon" data-sort="handle">
					<i class="fa fa-arrows-v" aria-hidden="true"></i>
				</div>
				<div class="panel panel-default js-card" data-function="accordion">
					<div class="panel-heading" role="tab" aria-expanded="true" id="New-Card">
						
							<h2 class="panel-title js-card-title">New Card</h2>
					</div>
					<div class="p-0" role="tabpanel" aria-hidden="false" style="">
						<div class="panel-body">
							<div class="row">
								<div class="col-xs-12 col-md-6">
									<div class="form-horizontal">
										<div class="form-group" duck-field="title" duck-type="string">
											<label class="col-sm-2 control-label">Title</label>
											<div class="col-sm-10">
												<input class="form-control" duck-value="" type="text">
											</div>
										</div>
										<div class="form-group" duck-field="image" duck-type="image">
											<label class="col-sm-2 control-label">Image</label>
											<div class="col-sm-10">
												<input class="hidden" duck-value="" type="hidden">
												<div class="form-control" duck-button="image-select">
													<i class="fa fa-image" aria-hidden="true"></i>
													<span class="pl-Sm" duck-image-value="">Please select an Image</span>
												</div>
											</div>
										</div>
										<div class="form-group" duck-field="text" duck-type="wysiwyg">
											<label class="col-sm-2 control-label">Text</label>
											<div class="col-sm-10">
												<div class="summernote"></div>
											</div>
										</div>
										<div class="form-group" duck-field="style" duck-type="select">
											<label class="col-sm-2 control-label">Style</label>
											<div class="col-sm-10">
												<select class="form-control" duck-value="">
													<option value="big">Big Card</option>
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
								<div class="col-xs-12 col-md-6">
									<h3 class="mt-0">Preview</h3>
									<div class="card-styles--preview" card-style="section">
										<h2 class="fs-32 fw-B m-0 ta-C js-card-title">
											Card Title
										</h2>
										<div class="lead p-Md ta-C js-card-text">
											This is where the <strong>Text</strong> for this card will appear.
										</div>
									</div>
									<div class="card-styles--preview" card-style="sub">
										<div class="guide-card guide-card__separator">
											<div class="guide-card--content">
												<div class="guide-card--info">
													<h2 class="guide-card--header js-card-title">Card Title</h2>
												</div>
											</div>
										</div>
									</div>
									<div class="card-styles--preview card-styles--preview__active" card-style="big">
										<div class="guide-card guide-card__attraction">
											<div class="guide-card--content">
												<div class="guide-card--img-wrapper">
													<img class="guide-card--img js-card-image" src="images/no-image.svg">
												</div>
												<div class="guide-card--info">
													<h2 class="guide-card--header js-card-title">Card Title</h2>
													<div class="guide-card--description js-card-text">
														This is where the <strong>Text</strong> for the card will go.
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="card-styles--preview" card-style="small">
										<div class="guide-card guide-card__sub">
											<div class="guide-card--content">
												<div class="guide-card--img-wrapper js-card-image" style="background-image: url('images/no-image.svg')">
												</div>
												<div class="guide-card--info">
													<h2 class="guide-card--header js-card-title">Card Title</h2>
													<div class="guide-card--description js-card-text">
														This is where the <strong>Text</strong> for the card will go.
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="card-styles--preview" card-style="img">
										<img class="w-100 js-card-image" src="images/no-image.svg">
									</div>
									<div class="card-styles--preview" card-style="plain">
										<div class="alert js-card-text">
											This is where the <strong>Text</strong> for the card will go. Great for any small information that might be useful.
										</div>
									</div>
									<div class="card-styles--preview" card-style="white">
										<div class="content-card mt-0 js-card-text">
											This is where the <strong>Text</strong> for the card will go. Great for any small information that might be useful.
										</div>
									</div>
									<div class="card-styles--preview" card-style="danger">
										<div class="alert alert-danger js-card-text">
											This is where the <strong>Text</strong> for the card will go. Make sure people know what yo watch out for!
										</div>
									</div>
									<div class="card-styles--preview" card-style="success">
										<div class="alert alert-success js-card-text">
											This is where the <strong>Text</strong> for the card will go. Ensure that people don't miss out on this!
										</div>
									</div>
									<div class="card-styles--preview" card-style="info">
										<div class="alert alert-info js-card-text">
											This is where the <strong>Text</strong> for the card will go. Just a bit of infomation someone should know.
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="panel-footer text-right">
							<button class="btn btn-primary" type="submit" duck-button="submit">Save</button>
						</div>
					</div>
				</div>
				<div class="input-group-btn">
					<button class="btn btn-danger" duck-button="delete">
						<i class="fa fa-times" aria-hidden="true"></i>
						<span class="sr-only">Delete This Card</span>
					</button>
				</div>
			</div>
		`));
	});
}(jQuery.noConflict())