/*global jQuery */

void function initCookbookFilter($){
	'use strict';

	function getItemsToFilter(filterSections, $object) {		
		for (const key in filterSections) {
			if(filterSections.hasOwnProperty(key)) {
				$object = $object.add($(`[data-filter-${key}]`));
			}
		}

		return $object;
	}

	function checkItemAgainstFilter(key, values, $item) {
		const itemValue = $item.attr(`data-filter-${key}`);

		if(!itemValue) {
			return true;
		}

		const types = itemValue.split('|');

		while (types.length) {
			if(values.indexOf(types.shift()) !== -1) {
				return false
			}
		}

		return true;
	}

	function filter(filterSections, $itemsToFilter) {
		return (e) => {
			e.stopPropagation();

			$itemsToFilter.removeClass('hidden');

			for (const key in filterSections) {
				if(filterSections.hasOwnProperty(key)) {
					const values = [];

					$(`[data-filter-section='${key}'] input:checked`).each((i, val) => {values.push($(val).val())});

					if (values.length) {
						$itemsToFilter.filter((i, item) => checkItemAgainstFilter(key, values, $(item))).addClass('hidden')
					}
				}
			}
		}
	}

	function filterable(wrapper) {
		const $wrapper = $(wrapper);
		const $filters = $wrapper.find('input[type="checkbox"]');
		const $filterSections = $wrapper.find('[data-filter-section]');
		const filterSections = {};

		if(!$filterSections.length) {
			return;
		}

		$filterSections.each((i, section) => {
			filterSections[$(section).attr('data-filter-section')] = [];
		});

		const $itemsToFilter = getItemsToFilter(filterSections, $([]));

		$filters.click(filter(filterSections, $itemsToFilter));
	}

	$.fn.filterable = function init() {
        return this.each((index, wrapper) => {
            filterable(wrapper);
        });
    };

    $(() => $('[data-function*="filter"]').filterable());

}(jQuery.noConflict());

/*
	void function initializeIcon($) {
	    'use strict';

	    const addIcon = function addIcon(wrapper) {
	        const $this = $(wrapper);
	        const icon = `<i class='${$this.attr('data-icon')}' aria-hidden='true'></i>`;

	        $this.prepend(icon);
	    };

	    $.fn.addIcon = function init() {
	        return this.each((index, wrapper) => {
	            addIcon(wrapper);
	        });
	    };

	    $(() => $('[data-icon]').addIcon());
	}(jQuery.noConflict());
*/