/* global jQuery */

void function initDuckFilepicker($) {
	'use strict';

	function buildImage(key) {
		const img = `
			<div class="p-Sm d-Ib ta-C" style='max-width: 275px;'>
				<span class="d-B bw-0 bbw-Sm bs-S mb-Sm">${key.replace('images/', '').replace('-thumb2', '')}</span>
				<img src="https://s3-us-west-2.amazonaws.com/stellaroute.com/${key}" alt="${key}" duck-image-value="${key.replace('-thumb2', '').replace('images/', '')}"/>
			</div>
		`;

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

	function gotFiles($item, $imagePickerImages) {
		return (e, err, data, isLoaded) => {
			if (!isLoaded && (err || !data || !data.length)) {
				$imagePickerImages.text('Sorry, something went wrong getting the images.');
				return;
			}

			if(!isLoaded){
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

			// select the image that is currently being used
			$imagePickerImages
				.find('img')
				.attr('image-selected', false).removeClass('bw-Lg bc-Purp bs-S')
				.filter((i, img) => $(img).attr('duck-image-value') === $item.find('[duck-value]').val())
				.attr('image-selected', true).addClass('bw-Lg bc-Purp bs-S');
		}
	}

	function initFilePicker($item, $uploadButton, $imagePicker, $imagePickerImages, $saveImageButton) {
		const $fileInput = $item.find('input[type="file"]');
		const filePickerOptions = {
			fileUploading: fileUploading($uploadButton),
			filesUploaded: filesUploaded($uploadButton, $imagePickerImages, $item),
			gettingFiles: gettingFiles($item, $imagePicker, $saveImageButton, $imagePickerImages),
			gotFiles: gotFiles($item, $imagePickerImages),
		};

		$item.find('[duck-button="image-select"]').on('click', () => {$item.trigger('getFiles', [$imagePickerImages.attr('duck-images') === 'true'])});
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

		$imagePickerImages.on('click', 'img', (e) => {
			e.stopPropagation();

			const $this = $(e.currentTarget);

			$imagePickerImages.find('img').filter((i, obj) => obj !== e.currentTarget).attr('image-selected', 'false').removeClass('bw-Lg bc-Purp bs-S');
			$this.attr('image-selected', $this.attr('image-selected') === 'true' ? 'false' : 'true').toggleClass('bw-Lg bc-Purp bs-S');
		})

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