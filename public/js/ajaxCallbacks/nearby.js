/* global jQuery, duck */

void function initNearby($, duck) {
	'use strict';

	$(() => {
		$('.js-nearby').each((i, item) => {
			const $this = $(item);

			$this.duckForm({successCallback: duck.callbacks.linkedUpdate($this, 'nearbyNeighborhoods', null, true) });
		});
	});
}(jQuery.noConflict(), duck)