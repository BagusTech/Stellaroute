/* global jQuery */

void function initDuckFilepicker($) {
	'use strict';

	function getImageSize(size) {
		if (size > 1073741824) {
			return `${Math.ceil(size/1024/1024/1024)}gb`;
		} else if (size > 1048576) {
			return `${Math.ceil(size/1024/1024)}mb`;
		} else if (size > 1024) {
			return `${Math.ceil(size/1024)}kb`;
		} else {
			return `${size}b`;
		}
	}

	function buildImage(key, size) {
		const imageSize = getImageSize(size);
		const img = `
			<div class='file-picker--image' duck-image-value="${key.replace('-thumb2', '')}">
				<div class="row">
					<div class="col-xs-4">
						<img class="image--content" src="https://s3-us-west-2.amazonaws.com/stellaroute/${key}" />
					</div>
					<div class="col-xs-8">
						<h3 class="image--name">${key.split('/')[key.split('/').length-1].replace('-thumb2', '')}</h3>
						<h4 class="image--size">${imageSize || 'unknown'}</h4>
					</div>
				</div>
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

			if($imagePickerImages.attr('data-loaded') === 'false'){
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
				$imagePickerImages.html('');
				const images = data.filter((img) => img.Key.indexOf('-thumb2.') > -1).sort((a, b) => {
					if(a.LastModified > b.LastModified) {return -1}
					if(a.LastModified < b.LastModified) {return 1}
					return 0;
				});
				const length = images.length;

				for (let i = 0; i < length; i++){
					const image = images[i];

					$imagePickerImages.append(buildImage(image.Key, image.Size))
				}

				$imagePickerImages
					.attr('data-loaded', true)
					.closest('[data-function*="scroll"]')
					.trigger('initScroll');
			}

			// select the image that is currently being used
			$imagePickerImages
				.find('.file-picker--image')
				.attr('image-selected', false)
				.filter((i, img) => $(img).attr('duck-image-value') === $item.find('[duck-value]').val())
				.attr('image-selected', true);
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

		$item.find('[duck-button="image-select"]').on('click', () => {$item.trigger('getFiles', [$imagePickerImages.attr('data-loaded') === 'true'])});
		$fileInput.on('change', () => {$item.trigger('uploadFiles')});
		
		$item.filePicker(filePickerOptions);

		$item.prop('filePickerInitiated', true);
	}

	// run after dom has loaded
	$(() => {
		const $imagePicker = $('#ImagePickerModal');
		const $uploadButton = $imagePicker.find('[data-file-picker="upload"]');
		const $saveImageButton = $imagePicker.find('[data-file-picker="select"]');
		const $imagePickerImages = $imagePicker.find('[data-file-picker="content"]');

		$uploadButton.on('click', () => {
			const imagePicker = $imagePicker.attr('duck-image-picker');
			const $item = $(`[duck-type="image"][duck-image-picker=${imagePicker}]`);
			const $fileInput = $item.find('input[type="file"]');

			$fileInput.click()
		});

		$imagePickerImages.on('click', '.file-picker--image', (e) => {
			e.stopPropagation();

			const $this = $(e.currentTarget);

			$imagePickerImages.find('.file-picker--image').filter((i, obj) => obj !== e.currentTarget).attr('image-selected', 'false');
			$this.attr('image-selected', $this.attr('image-selected') === 'true' ? 'false' : 'true');
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
		});
	});
}(jQuery.noConflict())