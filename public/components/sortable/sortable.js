/*global jQuery, duck */

void function initializeIcon($) {
	'use strict';

	function stopProp(e) {e.stopPropagation();}

	function moveItem(e, movingDown, $active, $sibling, siblingTop, siblingHeight) {
		if(siblingTop && siblingHeight) {
			const newSiblingTop = movingDown ? siblingTop - siblingHeight : siblingTop + siblingHeight;
			$sibling.css('top', `${newSiblingTop}px`);
		}

		const $movingItem = $sibling.detach();

		if(movingDown) {
			$active.before($movingItem);
		} else {
			$active.after($movingItem);
		}
	}

	function checkPosition($active, movingDown, sortItemQuery) {
		const $sibling = movingDown ? $active.next(sortItemQuery) : $active.prev(sortItemQuery);
		if(!$sibling.length) {
			return;
		}

		const activeTop = $active.position().top;
		const siblingTop = $sibling.position().top;
		const siblingHeight = $sibling.outerHeight();
		const isMoving = movingDown ? activeTop > siblingTop : activeTop < siblingTop;


		if(isMoving) {
			$active.trigger('moveItem', [movingDown, $active, $sibling, siblingTop, siblingHeight]);
		}
	}

	function sort(e) {
		e.stopPropagation();

		const mouseTop = e.clientY;
		const $item = e.data.itemToSort;
		const offset = mouseTop - e.data.mouseStartTop;
		const top = e.data.itemStartTop + offset
		const currentTop = parseInt($item.css('top'), 10);
		const movingDown = top - currentTop > 0

		$item.css('top', `${top}px`);

		checkPosition(e.data.itemToSort, movingDown, e.data.sortItemQuery)
	}

	function startSort(e) {
		e.stopPropagation();

		const $this = $(e.currentTarget);
		const $wrapper = e.data.wrapper;
		const $items = e.data.items;
		const sortItemQuery = e.data.sortItemQuery;

		$items.each((i, item) => {
			const $item = $(item);

			$item.css('top', `${$item.position().top}px`);
			$item.css('left', `${$item.position().left}px`);
			$item.css('right', `${$wrapper.outerWidth() - ($item.outerWidth() + $item.position().left)}px`);
		});

		$wrapper.height($wrapper.height())

		$wrapper.addClass('sorting');
		$this.addClass('sorting');
		
		$(document).on('mousemove', {
			itemToSort: $this,
			itemStartTop: parseInt($this.css('top'), 10),
			mouseStartTop: e.clientY,
			sortItemQuery,
		}, sort);
	}

	function stopSort(e) {
		e.stopPropagation();

		const $sorting = $('.sorting');

		if($sorting.length) {
			e.data.wrapper.height('')
			$sorting.removeClass('sorting');
			$(document).off('mousemove', sort);
		}
	}

	function moveUp(e) {
		e.stopPropagation();
		const $active = $(e.currentTarget).closest(e.data.sortItemQuery);
		const $sibling = $active.prev(e.data.sortItemQuery);

		if($sibling.length) {
			$active.trigger('moveItem', [false, $active, $sibling]);
		}
	}

	function moveDown(e) {
		e.stopPropagation();
		const $active = $(e.currentTarget).closest(e.data.sortItemQuery);
		const $sibling = $active.next(e.data.sortItemQuery);

		if($sibling.length) {
			$active.trigger('moveItem', [true, $active, $sibling]);
		}
	}

	function sortable(wrapper, sortItems) {
		const $wrapper = $(wrapper).attr('data-function', 'sort');
		const sortItemQuery = sortItems || '[data-sort="item"]';
		const $items = $wrapper.find(`> ${sortItemQuery}`).attr('data-sort', 'item');
		if($items.length < 2) {return;}
		const $sortButtons = duck.findRelevantChildren($items, '[data-sort-buttons]');
		const $upButtons = $sortButtons.find('[data-sort="up"]');
		const $downButtons = $sortButtons.find('[data-sort="down"]');

		if($wrapper.prop('sortInitaited')) {
			$upButtons.off('mousedown', stopProp);
			$upButtons.off('click', moveUp);

			$downButtons.off('mousedown', stopProp);
			$downButtons.off('click', moveDown);

			$items.off('mousedown', startSort);
			$items.off('moveItem', moveItem);

			$(document).off('mouseup', stopSort);
		}

		$upButtons.on('mousedown', stopProp);
		$upButtons.on('click', {sortItemQuery}, moveUp);

		$downButtons.on('mousedown', stopProp);
		$downButtons.on('click', {sortItemQuery}, moveDown);

		$items.on('mousedown', {wrapper: $wrapper, items: $items, sortItemQuery}, startSort);
		$items.on('moveItem', moveItem);

		$(document).on('mouseup', {wrapper: $wrapper}, stopSort);

		$wrapper.prop('sortInitaited', true);
	}

	$.fn.sortable = function init(sortItems) {
		return this.each((index, wrapper) => {
			sortable(wrapper, sortItems);
		});
	};

	$(() => $('[data-function*="sort"]').sortable());
}(jQuery.noConflict(), duck);
