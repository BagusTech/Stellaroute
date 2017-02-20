/* global jQuery */

void function initDuckFilepicker($) {
	'use strict';

	function addFolders(parentDirectory, folders) {
		const $parentDirectory = $(`[data-prefix="${parentDirectory || ''}"] > ul`);

		folders.forEach((folder) => {
			if($parentDirectory.find(`> [data-prefix="${parentDirectory || ''}${folder}/"]`).length === 0) {
				$parentDirectory.append(`
					<li data-prefix="${parentDirectory || ''}${folder}/">
						<i class="fa fa-folder" aria-hidden="true"></i>
						${folder}
						<ul></ul>
					</li>
				`);
			}
		});
	}

	function getFileSize(size) {
		if (size > 1073741824) {
			return `${Math.ceil(size/1024/1024/1024)}gb`;
		} else if (size > 1048576) {
			return `${Math.ceil(size/1024/1024)}mb`;
		} else if (size > 1024) {
			return `${Math.ceil(size/1024)}kb`;
		}

		return `${size}b`;
	}

	function buildImage(image) {
		const imageSize = getFileSize(image.Size);
		const key = image.Key;
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

			console.log('uploading');

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
			$imagePickerImages.html('<div class="p-Xl ta-C js-waiting"><i class="fa fa-spinner fa-spin"></div>');
		}
	}

	function gotFiles($item, $imagePickerImages) {
		const $header = $('[data-file-picker="header"] h2');

		return (e, err, data) => {
			if (err) {
				$imagePickerImages.text('Sorry, something went wrong getting the images.');
				return;
			}

			const files = data.files;
			const folder = data.folder;
			const subFolders = data.subFolders;
			const marker = data.marker;
			const nextMarker = data.nextMarker;

			$header.text(folder || 'Root');

			if(files){
				$imagePickerImages.html('');

				const images = files.filter((img) => img.Key.indexOf('-thumb2.') > -1).sort((a, b) => {
					if(a.LastModified > b.LastModified) {return -1}
					if(a.LastModified < b.LastModified) {return 1}
					return 0;
				});

				addFolders(folder, subFolders);

				if(!images) {
					$imagePickerImages.text('Sorry, there aren\'t any images in this folder.');
				} else {
					images.forEach((image) => {
						$imagePickerImages.append(buildImage(image))
					});
				}

				$imagePickerImages
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

	function buildPrefix($folder, currentPrefix) {
			const prefix = `${$folder.attr('data-prefix')}${currentPrefix || ''}`;
			const $parentFolder = $folder.parent().closest('[data-prefix]');

			if($parentFolder.length === 1) {
				return buildPrefix($parentFolder, prefix);
			}

			return prefix;
	}

	function initFilePicker($fileManager, $uploadButton, $imagePicker, $imagePickerImages, $saveImageButton, $fileManagerDirectory) {
		const $fileInput = $fileManager.find('input[type="file"]');
		const filePickerOptions = {
			fileUploading: fileUploading($uploadButton),
			filesUploaded: filesUploaded($uploadButton, $imagePickerImages, $fileManager),
			gettingFiles: gettingFiles($fileManager, $imagePicker, $saveImageButton, $imagePickerImages),
			gotFiles: gotFiles($fileManager, $imagePickerImages),
		};

		$fileManager.find('[duck-button="image-select"]').on('click', () => {$fileManager.trigger('getFiles')});
		//$fileInput.on('change', () => {$fileManager.trigger('uploadFiles')});
		
		$fileManager.filePicker(filePickerOptions);

		$fileManagerDirectory.on('click', '[data-prefix]', (e) => {
			e.stopPropagation();

			const $folder = $(e.target);
			const options = {
				folder: $folder.attr('data-prefix'),
				files: $folder.prop('files'),
			}

			$fileManager.trigger('getFiles', [options]);
		});

		$fileManager.prop('filePickerInitiated', true);
	}

	// run after dom has loaded
	$(() => {
		const $imagePicker = $('#ImagePickerModal');
		const $uploadButton = $imagePicker.find('[data-file-picker="upload"]');
		const $cancelButton = $imagePicker.find('[data-file-picker="cancel"]');
		const $saveImageButton = $imagePicker.find('[data-file-picker="select"]');
		const $imagePickerImages = $imagePicker.find('[data-file-picker="content"]');
		const $fileManagerDirectory = $imagePicker.find('[data-file-picker="directory"]');
		const $fileUploader = $imagePicker.find('[data-file-picker="uploader"].file-picker--uploader');
		const $footerButtons = $imagePicker.find('[data-file-picker="footer"] button');

		$uploadButton.add($cancelButton).on('click', () => {
			$fileUploader.toggleClass('hidden');
			$footerButtons.toggleClass('hidden');
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
			initFilePicker($(item), $uploadButton, $imagePicker, $imagePickerImages, $saveImageButton, $fileManagerDirectory);
		});

		$('[duck-type="array"]').on('duckArrayItemAdded', (e) => {
			const $this = $(e.currentTarget);
			const $newItems = $this.find('[duck-type="image"]').filter((i, item) => !$(item).prop('filePickerInitiated'));

			$newItems.each((i, item) => {
				initFilePicker($(item), $uploadButton, $imagePicker, $imagePickerImages, $saveImageButton, $fileManagerDirectory);
			});
		});
	});
}(jQuery.noConflict());