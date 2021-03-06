/* global jQuery, duck */

void function initDuckFilepicker($, duck) {
	'use strict';

	function selectCurrentFile($imagePicker) {
		$imagePicker.find('.file-manager--image').each((i, image) => {
			const $image = $(image);

			if($image.attr('title') === $imagePicker.prop('duck-start-value')) {
				$image.addClass('file-manager--image__active');
			}
		})
	}

	duck.initDuckFilepicker = () => {
		const $imagePickerModal = $('#ImagePickerModal');
		const $imagePicker = $imagePickerModal.find('[duck-filepicker]');
		const $select = $imagePickerModal.find('[duck-filepicker="select"]');
		
		$('[duck-table]').on('click', '[duck-type="image"]', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const $this = $(e.currentTarget);
			const startVal = $this.find('[duck-value]').val();

			$imagePickerModal.modal('show');
			$imagePicker.prop('duck-image', $this);
			$imagePicker.prop('duck-start-value', startVal);
			selectCurrentFile($imagePicker);
		});

		$select.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const $image = $imagePicker.prop('duck-image');
			const selectedImage = $imagePicker.prop('duck-current-value');

			$image.find('[duck-value]').val(selectedImage).change();
			$image.find('[duck-image-value]').text(selectedImage);
			$imagePickerModal.modal('hide');
		});

		$imagePicker.on('selectFile', (e, $targetFile) => {
			$imagePickerModal.find('.file-manager--image__active').not($targetFile).removeClass('file-manager--image__active');
			$imagePicker.prop('duck-current-value', $targetFile.attr('title'));
		});

		$imagePicker.on('gotFiles', () => {
			selectCurrentFile($imagePicker);
		});

		$imagePicker.fileManager();
	}

	// run after dom has loaded
	$(() => {
		duck.initDuckFilepicker();
	});
}(jQuery.noConflict(), duck);