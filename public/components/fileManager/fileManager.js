/* global jQuery */

void function initS3($) {
	'use strict';

	function getFiles(e, options) {
		const $wrapper = e.data.wrapper;

		$wrapper.trigger('gettingFiles');

		if(options && options.files) {
			$wrapper.trigger('gotFiles', [null, options])
			return;
		}

		$.ajax({
			type: 'GET',
			url: '/getFiles',
			dataType: 'json',
			contentType: 'application/json',
			data: options || {},
			success: (data) => {
				$wrapper.trigger('gotFiles', [null, data])
			},
			error: (err) => {
				$wrapper.trigger('gotFiles', [err])
			},
		});
	}

	function uploadFiles(e, filesToUpload, filePath) {
		const $wrapper = e.data.wrapper;
		const files = filesToUpload;

		if (files.length > 0){
			$wrapper.trigger('fileUploading');
			// create a FormData object which will be sent as the data payload in the
			// AJAX request
			const formData = new FormData();

			// loop through all the selected files and add them to the formData object
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				// add the files to formData object for the data payload
				formData.append('files', file, file.name);
			}

			formData.append('filePath', $wrapper.prop('uploadFilePath'))

			$.ajax({
				url: '/upload',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: () => {
					$wrapper.trigger('filesUploaded')
				},
				error: (err) => {
					$wrapper.trigger('filesUploaded', [err])
				},
			});
		} else {
			$wrapper.trigger('fileUploading', [true]);
		}
	}

	function s3(wrapper, options) {
		const $wrapper = $(wrapper);
		const fileUploading = options.fileUploading;
		const filesUploaded = options.filesUploaded;
		const gettingFiles = options.gettingFiles;
		const gotFiles = options.gotFiles;

		if(fileUploading) { $wrapper.off('fileUploading').on('fileUploading', fileUploading); }
		if(filesUploaded) { $wrapper.off('filesUploaded').on('filesUploaded', filesUploaded); }
		if(gettingFiles) { $wrapper.off('gettingFiles').on('gettingFiles', gettingFiles); }
		if(gotFiles) { $wrapper.off('gotFiles').on('gotFiles', gotFiles); }

		$wrapper.off('uploadFiles').on('uploadFiles', {wrapper: $wrapper}, uploadFiles);
		$wrapper.off('getFiles').on('getFiles', {wrapper: $wrapper}, getFiles);
	}

	$.fn.s3 = function init(options) {
		return this.each((index, wrapper) => {
			s3(wrapper, options);
		});
	}
}(jQuery.noConflict());

void function initFileManager($) {
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

	function fileUploading($uploadStartButton) {
		return (e) => {
			e.stopPropagation();

			$uploadStartButton.attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Uploading...');
		}
	}

	function filesUploaded($uploadStartButton, $content, $wrapper) {
		return	(e, err) => {
			e.stopPropagation();
			$uploadStartButton.attr('disabled', false).text(err ? 'Try Again' : 'Upload Another Image');
			
			if(err) {
				$content.text('Sorry, something went wrong uploading your image.');
				return;
			}

			$content.attr('duck-images', false);
			$wrapper.trigger('getFiles');
		}
	}

	function gettingFiles($content) {
		return (e) => {
			e.stopPropagation();
			$content.html('<div class="p-Xl ta-C js-waiting"><i class="fa fa-spinner fa-spin"></div>');
		}
	}

	function gotFiles($wrapper, $content) {
		const $header = $('[data-file-manager="header"] h2');

		return (e, err, data) => {
			if (err) {
				$content.text('Sorry, something went wrong getting the images.');
				return;
			}

			const files = data.files;
			const folder = data.folder;
			const subFolders = data.subFolders;
			//const marker = data.marker;
			//const nextMarker = data.nextMarker;

			$wrapper.prop('uploadFilePath', folder)
			$header.text(folder || 'Root');

			if(files){
				$content.html('');

				const images = files.filter((img) => img.Key.indexOf('-thumb2.') > -1).sort((a, b) => {
					if(a.LastModified > b.LastModified) {return -1}
					if(a.LastModified < b.LastModified) {return 1}
					return 0;
				});

				addFolders(folder, subFolders);

				if(!images) {
					$content.text('Sorry, there aren\'t any images in this folder.');
				} else {
					images.forEach((image) => {
						$content.append(buildImage(image))
					});
				}

				$content
					.closest('[data-function*="scroll"]')
					.trigger('initScroll');
			}

			// select the image that is currently being used
			/*$content
				.find('.file-picker--image')
				.attr('image-selected', false)
				.filter((i, img) => $(img).attr('duck-image-value') === $item.find('[duck-value]').val())
				.attr('image-selected', true);*/
		}
	}

	function filesAdded(e, files) {
		e.stopPropagation();

		const $wrapper = e.data.wrapper;
		const $filesList = e.data.filesList;
		const $uploadButton = e.data.uploadButton;
		const filesToUpload = $wrapper.prop('filesToUpload') || [];

		for (let i = 0, length = files.length; i < length; i++) {
			const file = files[i];
			const duplicateFile = $filesList.find('li').filter((j, item) => $(item).attr('data-file-name') === file.name).length > 0;

			if(duplicateFile) {
				// TODO: Handle Duplicate Files
				return;
			}

			filesToUpload.push(file);
			$filesList.append(`<li data-file-name='${file.name}'>${file.name}<button class='uploader--delete' data-uploader='delete'><i class='fa fa-times' aria-hidden='true'></i><span class='sr-only'>Remove File From Upload List</i></button></li>`);
			$uploadButton.prop('disabled', false);
		}

		$wrapper.prop('filesToUpload', filesToUpload);
	}

	function fileManager(wrapper, options) {
		const $wrapper = $(wrapper);
		const $content = $wrapper.find('[data-file-manager="content"]'); // where all the files are shown
		const $directory = $wrapper.find('[data-file-manager="directory"]'); // where the file structure is shown
		const $footerButtons = $wrapper.find('[data-file-manager="footer"] button'); // all buttons in the footer
		const $uploader = $wrapper.find('[data-file-manager="uploader"]'); // container for uploader
		const $fileDrop = $wrapper.find('[data-uploader="file-drop"]'); // area where files can be dragged and dropped to for upload
		const $filesList = $wrapper.find('[data-uploader="files"]'); // list of files to be uploaded
		const $uploadStartButton = $wrapper.find('[data-file-manager="upload"]'); // button to start the upload
		const $uploadButton = $wrapper.find('[data-uploader="upload"]'); // button to do upload
		const $cancelButton = $wrapper.find('[data-file-manager="cancel"]'); // button to cancel the upload
		const $filesInput = $('<input type="file" multiple="true">'); // created in the dom but never put on the page, used so user can add file by clicking on file drop location		
		const fileManagerOptions = options || {
			fileUploading: fileUploading($uploadStartButton),
			filesUploaded: filesUploaded($uploadStartButton, $content, $wrapper),
			gettingFiles: gettingFiles($content),
			gotFiles: gotFiles($wrapper, $content),
		};

		$uploadStartButton.add($cancelButton).on('click', () => {
			$uploader.toggleClass('hidden');
			$footerButtons.toggleClass('hidden');
		});

		$wrapper.on('filesAdded', {wrapper: $wrapper, filesList: $filesList, uploadButton: $uploadButton}, filesAdded);

		$directory.on('click', '[data-prefix]', (e) => {
			e.stopPropagation();

			const $folder = $(e.target);
			const getFileOptions = {
				folder: $folder.attr('data-prefix'),
				files: $folder.prop('files'),
			}

			$wrapper.trigger('getFiles', [getFileOptions]);
		});

		$filesList.on('click', '[data-uploader="delete"]', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const $file = $(e.target).closest('li');
			const fileName = $file.attr('data-file-name');
			const filesToUpload = $wrapper.prop('filesToUpload') || [];

			filesToUpload.forEach((file, i) => {
				if(file.name === fileName) {
					filesToUpload.splice(i, 1);
					return;
				}
			});

			$file.detach();

			if(filesToUpload.length === 0) {
				$uploadButton.prop('disabled', true);
			}

			$wrapper.prop('filesToUpload', filesToUpload)
		});

		$fileDrop.on('dragenter', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$fileDrop.addClass('.uploader--file-drop__active');
		});

		$fileDrop.on('dragleave', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$fileDrop.removeClass('.uploader--file-drop__active');
		});

		$fileDrop.on('dragover', (e) => {
			e.stopPropagation();
			e.preventDefault();

			let effect;

			try {
				effect = e.originalEvent.dataTransfer.effectAllowed;
			} catch (_error) {
				effect = null;
			}

			e.originalEvent.dataTransfer.dropEffect = effect === 'move' || effect === 'linkMove' ? 'move' : 'copy';
		});

		$filesInput.on('change', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$wrapper.trigger('filesAdded', [$filesInput[0].files]);
		});

		$fileDrop.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$filesInput.click();
		});

		$fileDrop.on('drop', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$wrapper.trigger('filesAdded', [e.originalEvent.dataTransfer.files]);
		});

		$uploadButton.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$wrapper.trigger('uploadFiles', [$wrapper.prop('filesToUpload')]);
		});

		$wrapper.s3(fileManagerOptions);

		$wrapper.trigger('getFiles')

		$wrapper.prop('fileManagerInitiated', true);

		//$wrapper.find('[duck-button="image-select"]').on('click', () => {$wrapper.trigger('getFiles')});
	}

	$.fn.fileManager = function init(options) {
		return this.each((index, wrapper) => { fileManager(wrapper, options); });
	}

	// run after dom has loaded
	$(() => {$('[data-function*="file-manager"').fileManager();});

	/*
		const $saveImageButton = $imagePicker.find('[data-file-manager="select"]');

		$content.on('click', '.file-picker--image', (e) => {
			e.stopPropagation();

			const $this = $(e.currentTarget);

			$content.find('.file-picker--image').filter((i, obj) => obj !== e.currentTarget).attr('image-selected', 'false');
			$this.attr('image-selected', $this.attr('image-selected') === 'true' ? 'false' : 'true');
		});
	

		$saveImageButton.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const imageVal = $content.find('[image-selected="true"]').attr('duck-image-value') || '';
			const imagePicker = $imagePicker.attr('duck-image-picker');
			const $item = $(`[duck-type="image"][duck-image-picker=${imagePicker}]`);

			$imagePicker.modal('hide');
			$item.find('[duck-image-value]').text(imageVal);
			$item.find('[duck-value]').val(imageVal);
		});


		$('[duck-type="array"]').on('duckArrayItemAdded', (e) => {
			const $this = $(e.currentTarget);
			const $newItems = $this.find('[duck-type="image"]').filter((i, item) => !$(item).prop('filePickerInitiated'));

			$newItems.each((i, item) => {
				initFilePicker($(item), $uploadStartButton, $imagePicker, $content, $saveImageButton, $directory);
			});
		});
	*/
}(jQuery.noConflict());