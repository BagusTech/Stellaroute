/* global jQuery */

void function initDuckFilepicker($) {
	'use strict';

	function buildImage(key) {
		const img = $('<img/>', {
			src: `https://s3-us-west-2.amazonaws.com/lissnerlistner.com/${key}`,
			alt: key,
			'class': 'm-Sm', 
			'duck-image-value': key.replace('-thumb2', '').replace('images/', ''),
			click: (e) => {
				e.stopPropagation();

				const $this = $(e.currentTarget);

				$this.parent().find('img').attr('image-selected', 'false').removeClass('bw-Lg bc-Purp bs-S');
				$this.attr('image-selected', 'true').addClass('bw-Lg bc-Purp bs-S');
			},
		});
		return img;
	}

	function fileUploading($uploadButton) {
		return (e) => {
			e.stopPropagation();

			$uploadButton.attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Uploading...');
		}
	}

	function filesUploaded($uploadButton, $imagePickerImages, $item) {
		return	(e, err) => {
			e.stopPropagation();
			$uploadButton.attr('disabled', false).text(err ? 'Try Again' : 'Upload Another Image');
			
			if(err) {
				$imagePickerImages.text('Sorry, something went wrong uploading your image.');
				return;
			}

			$imagePickerImages.attr('duck-images', false);
			$item.trigger('getFiles');
		}
	}

	function gettingFiles($item, $imagePicker, $saveImageButton, $imagePickerImages) {
		return (e) => {
			e.stopPropagation();
			$imagePicker.modal('show').attr('duck-image-picker', $item.attr('duck-image-picker'))

			if($imagePickerImages.attr('duck-images') === 'false'){
				$imagePickerImages.html('<div class="p-Xl ta-C js-waiting"><i class="fa fa-spinner fa-spin"></div>');
			}
		}
	}

	function gotFiles($imagePickerImages) {
		return (e, err, data) => {
			if (err || !data || !data.length) {
				$imagePickerImages.text('Sorry, something went wrong getting the images.');
				return;
			}

			if($imagePickerImages.attr('duck-images') === 'false'){
				const images = data.filter((img) => img.Key.indexOf('-thumb2.') > -1).sort((a, b) => {
					if(a.LastModified > b.LastModified) {return -1}
					if(a.LastModified < b.LastModified) {return 1}
					return 0;
				});
				const length = images.length;
				
				$imagePickerImages.find('.js-waiting').addClass('hidden')

				for (let i = 0; i < length; i++){
					$imagePickerImages.append(buildImage(images[i].Key))
				}

				$imagePickerImages.attr('duck-images', true);
			}
		}
	}

	function initFilePicker($item, $uploadButton, $imagePicker, $imagePickerImages, $saveImageButton) {
		const $fileInput = $item.find('input[type="file"]');
		const filePickerOptions = {
			fileUploading: fileUploading($uploadButton),
			filesUploaded: filesUploaded($uploadButton, $imagePickerImages, $item),
			gettingFiles: gettingFiles($item, $imagePicker, $saveImageButton, $imagePickerImages),
			gotFiles: gotFiles($imagePickerImages),
		};

		$item.find('[duck-button="image-select"]').on('click', () => {$item.trigger('getFiles')});
		$fileInput.on('change', () => {$item.trigger('uploadFiles')});
		
		$item.filePicker(filePickerOptions);

		$item.prop('filePickerInitiated', true);
	}

	// run after dom has loaded
	$(() => {
		const $imagePicker = $('#ImagePickerModal');
		const $uploadButton = $imagePicker.find('[duck-button="upload"]');
		const $saveImageButton = $imagePicker.find('[duck-button="save-image"]');
		const $imagePickerImages = $imagePicker.find('[duck-images]');

		$uploadButton.on('click', () => {
			const imagePicker = $imagePicker.attr('duck-image-picker');
			const $item = $(`[duck-type="image"][duck-image-picker=${imagePicker}]`);
			const $fileInput = $item.find('input[type="file"]');

			$fileInput.click()
		});

		$saveImageButton.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const imageVal = $imagePickerImages.find('[image-selected="true"]').attr('duck-image-value') || '';
			const imagePicker = $imagePicker.attr('duck-image-picker');
			const $item = $(`[duck-type="image"][duck-image-picker=${imagePicker}]`);

			$imagePicker.modal('hide');
			$item.find('[duck-image-value]').text(imageVal);
			$item.find('[duck-value]').val(imageVal);
		});

		$('[duck-type="image"]').each((i, item) => {
			initFilePicker($(item), $uploadButton, $imagePicker, $imagePickerImages, $saveImageButton);
		});

		$('[duck-type="array"]').on('duckArrayItemAdded', (e) => {
			const $this = $(e.currentTarget);
			const $newItems = $this.find('[duck-type="image"]').filter((i, item) => !$(item).prop('filePickerInitiated'));

			$newItems.each((i, item) => {
				initFilePicker($(item), $uploadButton, $imagePicker, $imagePickerImages, $saveImageButton);
			});
		})
	});
}(jQuery.noConflict())