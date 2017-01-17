/* global jQuery */

void function initFilepicker($){
	'use strict';

	function getFiles(e) {
		const $wrapper = e.data.wrapper;

		$wrapper.trigger('gettingFiles');

		$.ajax({
			url: '/getFiles',
			type: 'GET',
			contentType: 'application/json',
			success: (data) => {
				$wrapper.trigger('gotFiles', [null, data])
			},
			error: (err) => {
				$wrapper.trigger('gotFiles', [err])
			},
		});
	}

	function uploadFiles(e) {
		const $wrapper = e.data.wrapper;
		const files = $wrapper.find('input[type="file"]').get(0).files;

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

	function filePicker(wrapper, options) {
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

	$.fn.filePicker = function init(options) {
		return this.each((index, wrapper) => {
			filePicker(wrapper, options);
		});
	}
}(jQuery.noConflict());