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

	function uploadFiles(e, filesToUpload) {
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
					$wrapper.trigger('filesUploaded');
				},
				error: (err) => {
					$wrapper.trigger('filesUploaded', [err]);
				},
			});
		} else {
			$wrapper.trigger('fileUploading', [true]);
		}
	}

	function deleteFiles(e, filesToDelete) {
		const $wrapper = e.data.wrapper;

		$.ajax({
			type: 'POST',
			url: '/deleteFiles',
			contentType: 'application/json',
			data: JSON.stringify({files: filesToDelete}),
			success: () => {
				$wrapper.trigger('filesDeleted');
			},
			error: (err) => {
				$wrapper.trigger('filesDeleted', [err]);
			},
		})
	}

	function s3(wrapper, options) {
		const $wrapper = $(wrapper);
		const fileUploading = options && options.fileUploading;
		const filesUploaded = options && options.filesUploaded;
		const gettingFiles = options && options.gettingFiles;
		const gotFiles = options && options.gotFiles;
		const deletingFiles = options && options.deletingFiles;
		const deletedFiles = options && options.deletedFiles;

		if(fileUploading) { $wrapper.off('fileUploading').on('fileUploading', fileUploading); }
		if(filesUploaded) { $wrapper.off('filesUploaded').on('filesUploaded', filesUploaded); }
		if(gettingFiles) { $wrapper.off('gettingFiles').on('gettingFiles', gettingFiles); }
		if(gotFiles) { $wrapper.off('gotFiles').on('gotFiles', gotFiles); }
		if(deletingFiles) { $wrapper.off('deletingFiles').on('deletingFiles', deletingFiles); }
		if(deletedFiles) { $wrapper.off('deletedFiles').on('deletedFiles', deletedFiles); }

		$wrapper.off('uploadFiles').on('uploadFiles', {wrapper: $wrapper}, uploadFiles);
		$wrapper.off('getFiles').on('getFiles', {wrapper: $wrapper}, getFiles);
		$wrapper.off('deleteFiles').on('deleteFiles', {wrapper: $wrapper}, deleteFiles);
	}

	$.fn.s3 = function init(options) {
		return this.each((index, wrapper) => {
			s3(wrapper, options);
		});
	}
}(jQuery.noConflict());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~ file manager ~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
void function initFileManager($) {
	'use strict';

	

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
			<div class='file-manager--image' duck-image-value="${key.replace('-thumb2', '')}">
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

	function gotFiles($wrapper, $content, $uploader) {
		const $currentDirectory = $('[data-file-manager="current-directory"]');

		return (e, err, data) => {
			if (err) {
				$content.text('Sorry, something went wrong getting the images.');
				return;
			}

			const files = data.files;
			const folder = data.folder;

			//const marker = data.marker;
			//const nextMarker = data.nextMarker;

			$uploader.prop('uploadFilePath', folder || '');
			$currentDirectory.text(folder || 'Root');

			if(files){
				$content.html('');

				const images = files.filter((img) => img.Key.indexOf('-thumb2.') > -1).sort((a, b) => {
					if(a.LastModified > b.LastModified) {return -1}
					if(a.LastModified < b.LastModified) {return 1}
					return 0;
				});

				

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
		}
	}

	function fileManager(wrapper, options) {
		const $wrapper = $(wrapper);
		const $content = $wrapper.find('[data-file-manager="content"]'); // where all the files are shown
		const $directory = $wrapper.find('[data-file-manager="directory"]'); // where the file structure is shown
		const $deleteButton = $wrapper.find('[data-file-manager="delete"]'); // button to delete selected files
		const $uploader = $wrapper.find('[data-file-manager="uploader"]'); // container for uploader
		const $uploadStartButton = $wrapper.find('[data-file-manager="upload"]'); // button to start the upload
		const rootDirectory = options && options.rootDirectory;
		
		$uploader.on('fileUploading', fileUploading($uploadStartButton));
		$uploader.on('filesUploaded', filesUploaded($uploadStartButton, $content, $wrapper));

		$directory.on('gettingFiles', gettingFiles($content));
		$directory.on('gotFiles', gotFiles($wrapper, $content, $uploader));
		

		$uploadStartButton.on('click', () => {
			$uploader.toggleClass('hidden');
		});

		$content.on('click', '.file-manager--image', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const $this = $(e.currentTarget);

			$this.toggleClass('file-manager--image__active');

			if($content.find('.file-manager--image__active').length) {
				$deleteButton.prop('disabled', false);
			}
		});

		$deleteButton.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const files = [];
			$content.find('.file-manager--image__active').each((i, item) => {
				const key = $(item).attr('duck-image-value'); //"undefinedhero-small.jpg"
				const fileName = key.split('.')[0];
				const fileType = key.split('.')[1];
				const fileSizes = ['large', 'medium', 'small', 'thumb1', 'thumb2'];

				fileSizes.forEach((size) => {
					files.push({Key: `${fileName}-${size}.${fileType}`});
				});
			});
			$wrapper.trigger('deleteFiles', [files]);
		});

		/*
		const $createFolder = $wrapper.find('[data-file-manager="new-folder"]');
		const $newFolder = $wrapper.find('[data-file-manager="new-folder"]');
		$newFolder.find('button').click((e) => {
			e.stopPropagation();
			e.preventDefault();

			addFolders($uploader.prop('uploadFilePath'), [$newFolder.find('input').val()]);
			$newFolder.find('input').val('')
			$newFolder.detach();
		}); 

		$createFolder.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$createFolder.after($newFolder)
		});*/

		$directory.directory(rootDirectory);
		$uploader.uploader();
		$wrapper.prop('fileManagerInitiated', true);

		//$wrapper.find('[duck-button="image-select"]').on('click', () => {$wrapper.trigger('getFiles')});
	}

	$.fn.fileManager = function init(options) {
		return this.each((index, wrapper) => { fileManager(wrapper, options); });
	}

	// run after dom has loaded
	$(() => {$('[data-function*="file-manager"').fileManager();});
}(jQuery.noConflict());


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~ uploader ~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
void function initUploader($) {
	'use strict';

	function addFileToUploadQueue($wrapper, $filesInput) {
		return (e) => {
			e.stopPropagation();
			e.preventDefault();

			if($filesInput) {
				$wrapper.trigger('filesAdded', [$filesInput[0].files]);
				return;
			}

			$wrapper.trigger('filesAdded', [e.originalEvent.dataTransfer.files]);
		}
	}

	function deleteFileFromUploadQueue($wrapper, $uploadButton) {
		return (e) => {
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

	function uploader(wrapper) {
		const $wrapper = $(wrapper);
		const $fileDrop = $wrapper.find('[data-uploader="file-drop"]'); // area where files can be dragged and dropped to for upload
		const $filesList = $wrapper.find('[data-uploader="files"]'); // list of files to be uploaded
		const $uploadButton = $wrapper.find('[data-uploader="upload"]'); // button to do upload
		const $cancelButton = $wrapper.find('[data-uploader="cancel"]'); // button to cancel the upload
		const $filesInput = $('<input type="file" multiple="true">'); // created in the dom but never put on the page, used so user can add file by clicking on file drop location		

		$wrapper.on('filesAdded', {wrapper: $wrapper, filesList: $filesList, uploadButton: $uploadButton}, filesAdded);

		$cancelButton.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$wrapper.toggleClass('hidden');
		});

		$filesList.on('click', '[data-uploader="delete"]', deleteFileFromUploadQueue($wrapper, $uploadButton));

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

		$fileDrop.on('drop', addFileToUploadQueue($wrapper));
		$fileDrop.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$filesInput.click();
		});
		$filesInput.on('change', addFileToUploadQueue($wrapper, $filesInput));

		$uploadButton.on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();

			$wrapper.trigger('uploadFiles', [$wrapper.prop('filesToUpload')]);
		});

		$wrapper.s3();
	}

	$.fn.uploader = function init(options) {
		return this.each((index, wrapper) => {
			uploader(wrapper, options);
		});
	}
}(jQuery.noConflict());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~ directory ~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
void function initDirectory($) {
	'use strict';

	function getFiles(e) {
		e.stopPropagation();
		e.preventDefault();

		const $wrapper = e.data.wrapper;
		const $folder = $(e.target);
		const $icon = $folder.find('> i');
		const isOpen = $icon.hasClass('fa-folder-open')
		const folder = $folder.attr('data-prefix');

		if(isOpen && folder === $wrapper.prop('currentDirectory')) {
			$folder.find('> i').removeClass('fa-folder-open').addClass('fa-folder');
			$folder.find('> ul').slideUp('270');

			return;
		}

		const options = {
			folder,
			files: $folder.prop('files'),
			subFolders: $folder.prop('subFolders'),
		}

		$wrapper.trigger('getFiles', [options]);
	}

	function gotFiles(e, err, data) {
		if(err) return;

		const $wrapper = e.data.wrapper;
		const folder = data.folder;
		const subFolders = data.subFolders;
		const $folder = $wrapper.find(`[data-prefix="${folder}"]`);
		
		$folder.prop('files', data.files);
		$folder.prop('subFolders', subFolders);
		$wrapper.prop('currentDirectory', folder);
		$wrapper.trigger('addFolders', [folder, subFolders]);
	}

	function makeFolder(parentDirectory, folder) {
		const $folder = $('<li/>', { // the base folder element
			'data-prefix': folder ? `${parentDirectory || ''}${folder}/` : '',
			text: ` ${folder || '/ (root)'}`,
		});
		const $folderIcon = $('<i/>', {
			'class': 'fa fa-folder',
			'aria-hidden': 'true'
		});

		$folder.prepend($folderIcon);

		$folder.append($('<ul/>', {style: 'display: none;'})) // where the next set of sub folders will live
		
		return $folder;
	}

	function addFolders(e, parentDirectory, folders) {
		e.stopPropagation();

		const $wrapper = e.data.wrapper;
		const $parentDirectory = $wrapper.find(`[data-prefix="${parentDirectory || ''}"]`);
		const $parentDirectorySubFoldersList = $parentDirectory.find('> ul');

		$parentDirectory.find('> i').removeClass('fa-folder').addClass('fa-folder-open');

		folders.forEach((folder) => {
			if($parentDirectorySubFoldersList.find(`> [data-prefix="${parentDirectory || ''}${folder}/"]`).length === 0) {
				$parentDirectorySubFoldersList.append(makeFolder(parentDirectory, folder));
			}
		});

		if($parentDirectorySubFoldersList.find('> [data-directory]').length === 0) {
			const $addIcon = $('<i/>', {
				'class': 'fa fa-plus',
				'aria-hidden': 'true'
			});
			const $addButton = $('<button/>', {text: ' New Folder'});
			const $addListItem = $('<li/>', {'data-directory': 'new-folder'});

			$addButton.prepend($addIcon);
			$addListItem.append($addButton);
			$parentDirectorySubFoldersList.append($addListItem);
		}

		$parentDirectorySubFoldersList.slideDown('270');
	}

	function makeNewFolder(e) {
		e.stopPropagation();
		e.preventDefault();

		const $wrapper = e.data.wrapper;
		const $button = $(e.target);
		const $listItem = $button.parent();
		$listItem.append($('<input/>'));
		const $input = $listItem.find('input');
		const prefix = $listItem.closest('[data-prefix]').attr('data-prefix');
		
		$button.addClass('hidden');
		$input.focus();

		$input.on('blur', (e) => {
			e.stopPropagation();
			e.preventDefault();

			const val = $input.val();
			console.log(prefix, val)

			if(val) {
				$listItem.remove();
				$wrapper.trigger('addFolders', [prefix, [val]]);
			} else {
				$input.remove();
				$button.removeClass('hidden');
			}
		});
		
	}

	function directory(wrapper, rootDirectory) {
		const $wrapper = $(wrapper);

		$wrapper.find('> ul').append(makeFolder(null, rootDirectory));
		$wrapper.on('gotFiles', {wrapper: $wrapper}, gotFiles)
		$wrapper.on('addFolders', {wrapper: $wrapper}, addFolders);
		$wrapper.on('click', '[data-prefix]', {wrapper: $wrapper}, getFiles);
		$wrapper.on('click', '[data-directory="new-folder"] button', {wrapper: $wrapper}, makeNewFolder);
		$wrapper.s3();
		$wrapper.trigger('getFiles', {folder: rootDirectory || ''});
	}

	$.fn.directory = function init(rootDirectory) {
		return this.each((index, wrapper) => {
			directory(wrapper, rootDirectory);
		});
	}
}(jQuery.noConflict());