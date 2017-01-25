/* global jQuery, duck */

void function initParentAttractionLink($, duck) {
	'use strict';

	$(() => {
		$('.js-parent-attraction').each((i, item) => {
			const $this = $(item);

			$this.duckForm({successCallback: duck.callbacks.linkedUpdate($this, 'parentAttraction', 'subAttractions', true) });
		});
	});
}(jQuery.noConflict(), duck)