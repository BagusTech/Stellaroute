/* global jQuery, duck */

void function initChildAttractionLink($, duck) {
	'use strict';

	$(() => {
		$('.js-child-attractions').each((i, item) => {
			const $this = $(item);

			$this.duckForm({successCallback: duck.callbacks.linkedUpdate($this, 'subAttractions', 'parentAttraction', false) });
		});
	});
}(jQuery.noConflict(), duck)