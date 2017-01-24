/* global jQuery, duck */

void function initRequestLocation($, duck) {
	'use strict';

	function getNearbyIds($wrapper) {
		const nearbyIds = [];

		$wrapper.find('[duck-field="nearbyNeighborhoods"] [duck-value]').each((j, nearby) => {
			const val = $(nearby).val()

			if(val) {
				nearbyIds.push(val);
			}
		});

		return nearbyIds;
	}

	function updateItems(Id, table, removeFromNearby) {
		return (items) => {
			if(!items) {
				window.location.reload(true);
			}

			const length = items.length;
			const itemsToUpdate = [];

			for(let i = 0; i < length; i++) {
				const item = items[i];
				const current = item.nearbyNeighborhoods || [];

				if(current.indexOf(Id) === -1) {
					current.push(Id);
					item.nearbyNeighborhoods = current;

					itemsToUpdate.push(item);
				}
			}

			const removeFromNearbyLength = removeFromNearby.length;
			if(removeFromNearbyLength) {
				for(let i = 0; i < removeFromNearbyLength; i++) {
					const item = items.filter((itm) => itm.Id === removeFromNearby[i])[0];
					const index = item.nearbyNeighborhoods.indexOf(Id);

					item.nearbyNeighborhoods.splice(index, 1);
					itemsToUpdate.push(item);
				}
			}

			if(itemsToUpdate.length) {
				table.update(itemsToUpdate, () => {window.location.reload(true)});
			} else {
				window.location.reload(true)
			}
		}
	}

	$(() => {
		$('.js-nearby').each((i, item) => {
			const $this = $(item);
			const Id = $this.attr('duck-key-value');
			const oldNearby = getNearbyIds($this);

			$this.duckForm({successCallback: () => {
				const nearbyIds = getNearbyIds($this);
				const removeFromNearby = [];
				const table = duck($this.attr('duck-table'));
				const length = oldNearby.length;

				for(let i = 0; i < length; i++) {
					const currentId = oldNearby[i];

					if(nearbyIds.indexOf(currentId) === -1) {
						nearbyIds.push(currentId);
						removeFromNearby.push(currentId);
					}
				}				

				if (nearbyIds === oldNearby) {
					window.location.reload(true);
					return;
				}

				table.get({field: 'Id', value: nearbyIds}, updateItems(Id, table, removeFromNearby))
			}});
		});
	});
}(jQuery.noConflict(), duck)