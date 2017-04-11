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

		window.summernoteOptions = summernoteOptions;
	});

	$(window).on('load', () => {
		$('body').removeClass('loading')
	});
}(jQuery.noConflict());