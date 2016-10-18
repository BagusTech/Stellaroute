/*global jQuery */
jQuery(($) => {
	'use strict'

	const $emailInput = $('#EmailCaptureInput');
	const $emailSubmit = $('#EmailCaptureButton');
	const $guideInput = $('#RequestGuideInput');
	const $guideSubmit = $('#RequestGuideButton');

	const isValid = (email) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return re.test(email);
	};

	const $error = $('[data-beta-signup="error"]');
	const failed = function() {
		$error.toggleClass('active');

		setTimeout(() => {
			$error.toggleClass('active');
		}, 2000);
	};

	$emailSubmit.click((e) => {
		e.preventDefault();

		const email = $emailInput.val();

		if(isValid(email)){
			$('[data-beta-signup="error"]').text('Sorry, we experienced an error. Please refresh the page and try again.');
			const user = {
				"local.email": email,
				recieveNewsletter: true,
			};

			$.ajax({
				type: 'POST',
				data: JSON.stringify(user),
				url: '/newsletter-signup',
				contentType: 'application/json',
			}).done((response) => {
				if(response.msg === "success"){
					$('[data-beta-signup="email-capture"]').css('opacity', 0);
					$('[data-beta-signup="success"]').slideDown(180);
				} else {
					failed();
				}

			}).fail(() => {
				failed();
			});
		} else {
			failed();
		}
	});

	$guideSubmit.click((e) => {
		e.preventDefault();

		const $header = $('[data-submit-guide="header"]');
		const $text = $('[data-submit-guide="text"]');
		const request = {
			fromEmail: $emailInput.val(),
			request: $guideInput.val(),
		};

		$.ajax({
			type: 'POST',
			data: JSON.stringify(request),
			url: '/request-location',
			contentType: 'application/json',
		}).done((response) => {
			if(response.msg === "success"){
				$header.text('Success! You\'ve Requested a Guide.');
				$text.text('We\'ll get back to you as quickly as we can. Feel free to request another.');
				$guideInput.val('');
			} else {
				failed();
			}

		}).fail(() => {
			failed();
		});
	});
});
