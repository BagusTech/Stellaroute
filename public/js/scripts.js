/*global jQuery */

// Once window is loaded, do this
void function initScripts($){
	'use strict'

	$(() => {
		// hide flash message after 1.5s
		setTimeout(() => {
			$('.flash-message-container').slideUp(1000);
		}, 1500);

		// have cursor focus on input after modal opens
		$('button[data-target="#LoginModal"]').click(function onClick(){
			const id = $(this).attr('data-target');
			setTimeout(() => {
				$(`${id} input`).first().focus();
			}, 200);
		});

		// initialize summernote where it is being used
		$('.summernote:visible').summernote({height: 150, disableDragAndDrop: true});

		$('.modal').on('shown.bs.modal', () => {
			$('.summernote:visible').summernote({height: 150, disableDragAndDrop: true});
		});

		$('[duck-button="edit"], [duck-table] .btn').on('click', () => {
			setTimeout(() => {
				$('.summernote').summernote({height: 150, disableDragAndDrop: true});
			}, 10)
		});
	});

	$(window).on('load', () => {
		$('body').removeClass('loading')
	});
}(jQuery.noConflict());