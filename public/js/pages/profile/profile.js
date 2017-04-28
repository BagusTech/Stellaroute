/* global jQuery, duck */

void function initRequest($){
	'use strict';

	$(() => {
		const $error = $('<div class="alert alert-danger p-A z-1 l-0 r-0 t-0">Something went wrong, please try again.</div>');

	// USER FORM
		const $userForm = $('#MySettings [duck-table="Users"]');
		const $userSubmit = $userForm.find('[duck-button="submit"]');
		const $username = $userForm.find('[duck-field="username"] [duck-value]');
		const startingUsername = $username.val();
		const $profilePicture = $('.js-profile-pic');
		const $profilePictureForm = $userForm.find('[duck-field="profilePicture"] [duck-value]');
		const startingProfilePicture = $profilePictureForm.val();
		const $bannerImage = $('.js-banner-image');
		const $bannerImageForm = $userForm.find('[duck-field="bannerImage"] [duck-value]');
		const startingBannerImage = $bannerImageForm.val();
		const $firstName = $('.js-first-name');
		const $lastName = $('.js-last-name');
		const $tagline = $('.js-tagline');
		const $aboutMeTab = $('.js-about-me-tab');
		const $aboutMe = $('.js-about-me');



		$username.prop('validateFunc', () => () => {
			const newUsername = $username.val();
			
			duck('Users').exists({field: 'username', value: newUsername, fineOne: true}, (length) => {
				if (length === "0" || startingUsername === newUsername) {
					$username.trigger('passedValidation');
				} else {
					$username.trigger('failedValidation');
				}
			});
		});

		$userForm.on('duck.form.submitted', () => {
			$userSubmit.prop('disabled', true);
			$userSubmit.find('i').removeClass('hidden');
		});

		$userForm.duckForm({successCallback: () => {
			const newUsername = $username.val();
			const newProfilePicture = $profilePictureForm.val();
			const newBannerImage = $bannerImageForm.val();
			const newFirstName = $userForm.find('[duck-field="first"] [duck-value]').val();
			const newLastName = $userForm.find('[duck-field="last"] [duck-value]').val();
			const newTagline = $userForm.find('[duck-field="tagline"] [duck-value]').val();
			const newAboutMe = $userForm.find('[duck-field="description"] .summernote').summernote('code');

			$firstName.text(newFirstName);
			$lastName.text(newLastName);
			$tagline.text(newTagline);
			$aboutMe.html(newAboutMe);

			$tagline.removeClass('hidden');
			$aboutMeTab.removeClass('hidden');

			$userSubmit.prop('disabled', false).find('i').addClass('hidden');

			// if username changed refresh page
			if(newUsername.toLowerCase() !== startingUsername.toLowerCase()) {
				window.location.href = `/${newUsername}`;
				return;
			}

			// update profile picture
			if(newProfilePicture !== startingProfilePicture) {
				const _newProfilePicture = newProfilePicture.split('.');
					_newProfilePicture.pop();
				
				const newProfilePicturePath = `https://s3-us-west-2.amazonaws.com/stellaroute/${_newProfilePicture.join('.')}-thumb2.jpg`;
				
				$profilePicture.attr('src', newProfilePicturePath);
			}

			// update banner image
			if(newBannerImage !== startingBannerImage) {
				const _newBannerImage = newBannerImage.split('.');
					_newBannerImage.pop();
				
				const newBannerImagePath = `https://s3-us-west-2.amazonaws.com/stellaroute/${_newBannerImage}-large.jpg`;

				$bannerImage.css('background-image', `url("${newBannerImagePath}")`);
			}

		}, errorCallBack: () => {
			const _$error = $error.clone();

			$userSubmit.prop('disabled', false).find('i').addClass('hidden');
			$userForm.append(_$error);

			setTimeout(() => {
				_$error.slideUp(270);				
			}, 3000);

			setTimeout(() => {
				_$error.remove();				
			}, 3270);
		}});

	// CHANGE PASSWORD FORM
		const $changePasswordModal = $('#ChangePassword'); 
		const $changePasswordForm = $changePasswordModal.find('[duck-table="Users"]');
		const $passwordFields = $changePasswordForm.find('input[type="password"]');
		const $passwordSubmit = $changePasswordForm.find('[duck-button="submit"]');

		$passwordFields.on('input', (e) => {
			e.stopPropagation();
			e.preventDefault();

			if($passwordFields.eq(0).val() && !$passwordFields.eq(1).val()) {
				$passwordSubmit.prop('disabled', true);
			} else if(($passwordFields.eq(0).val() !== $passwordFields.eq(1).val()) || $passwordFields.eq(0).val().length < 8 || $passwordFields.eq(1).val().length < 8) {
				$passwordSubmit.prop('disabled', true);
				$passwordFields.closest('.form-group').addClass('has-error');
			} else {
				$passwordFields.closest('.form-group').removeClass('has-error');
				$passwordSubmit.prop('disabled', false);
			}
		});

		$changePasswordForm.on('duck.form.submitted', () => {
			$passwordSubmit.prop('disabled', true);
			$passwordSubmit.find('i').removeClass('hidden');
		});

		$changePasswordForm.duckForm({successCallback: () => {
			$passwordSubmit.prop('disabled', false).find('i').addClass('hidden');
			$changePasswordModal.modal('hide');
		}});

	// NEW GUIDE FORM
		const $newGuideForm = $('[duck-table="Guides"]');
		const $newGuideSubmit = $newGuideForm.find('[duck-button="submit"]');

		$newGuideSubmit.on('click', () => {
			$newGuideSubmit.append('<i class="fa fa-spin fa-spinner"></i>');
		});

		$newGuideForm.duckForm({successCallback: () => {
			window.location = `${window.location.pathname}/${$('[duck-field="url"] [duck-value]').val()}`;
		}});
	});

}(jQuery.noConflict())