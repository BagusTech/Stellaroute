/* global jQuery, duck */

void function initFeedback($, duck){
	'use strict';

	const $form = $('#FeedbackForm');
	const $flash = $('#FeedbackMessage');

	function failed() {
		$flash.find('.alert-danger').show(0);
		$flash.show(0);

		setTimeout(() => {
			$flash.slideUp(270)
			$flash.find('.alert-danger').slideUp(270);
		}, 5000)
	}

	function success(response) {
		if (response.msg === 'success') {
			$flash.find('.alert-success').show(0);
			$flash.show(0);

			setTimeout(() => {
				$flash.slideUp(270)
				$flash.find('.alert-success').slideUp(270);
			}, 5000);

			setTimeout(() => {
				$form.find('[user="submit"]').prop('disabled', false);
			}, 500);
		} else {
			failed();
		}
	}

	function error() { failed(); }

	$form.find('[type="submit"]').click((e) => {
		$form.find('[type="submit"]').prop('disabled', true);			
		e.preventDefault();

		const user = $form.find('[name="user"]').val();
		const email = $form.find('[name="email"]').val();
		const $subject = $form.find('[name="subject"]');
		const subject = $form.find('[name="subject"]').val();
		const $feedback = $form.find('[name="feedback"]');
		const feedback = $form.find('[name="feedback"]').val();

		const html = `
			<h1>New Feedback</h1>
			<h2>${subject}</h2>

			<p>
				<strong>Name: </strong>${user}
				<strong>Email: </strong>${email}
			</p>

			<h3>Feedback</h3>
			<p>${feedback}</p>

		`;
		const request = {
			html,
			subject: `Feedback: ${subject}`,
		};

		duck.sendEmail(request, success, error);
		$subject.val('')
		$feedback.val('')
	});
}(jQuery.noConflict(), duck)