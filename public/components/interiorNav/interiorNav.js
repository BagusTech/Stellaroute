/*global jQuery */

void function initInteriorNav($) {
	'use strict';

	function checkForActiveTabChange(e) {
		const $wrapper = e.data.wrapper;
		const $nodes = e.data.nodes;
		const $contentScrollWrap = e.data.contentScrollWrap;
		const isWindow = e.data.isWindow;
		const scrollTop = $contentScrollWrap.scrollTop();
		const $allActiveNodes = $nodes.filter((i, node) => $(node).is(':visible') && $(node).offset().top <= (isWindow ? scrollTop : e.data.offset));
		const $activeNodes = $wrapper.find('.active');
		const currentPosition = $activeNodes.last().attr('data-position');
		const $currentActiveNode = $wrapper.find(`[data-position="${currentPosition}"]`);
		const activePosition = $allActiveNodes.last().attr('data-position');
		const $newActiveNode = $wrapper.find(`[data-position="${activePosition}"]`)
		const removeActive = (!$allActiveNodes.length && $activeNodes.length) || $newActiveNode.length;

		if (removeActive) {
			$wrapper.find('a').removeClass('interior-nav--node__active');
		}

		if ($newActiveNode.length && ($currentActiveNode[0] !== $newActiveNode[0])){
			const $activeNodeParent = $wrapper.find(`[data-position="${activePosition.split('.')[0]}"]`);

			$newActiveNode.addClass('interior-nav--node__active');

			if ($activeNodeParent.attr('aria-expanded') === 'false') {
				$activeNodeParent.trigger('tab-change');
			}
		}
	}

	function scrollTo(e) {
		e.preventDefault();

		const $wrapper = e.data.wrapper;
		const $nodes = e.data.nodes;
		const $contentScrollWrap = e.data.contentScrollWrap;
		const $content = e.data.content;
		const offset = e.data.offset;
		const isWindow = e.data.isWindow;
		const $this = $(this);
		const position = $this.attr('data-position');
		const $goTo = $nodes.filter((i, node) => $(node).attr('data-position') === position && $(node).is(':visible'));
		const goToVal = isWindow ? $goTo.offset().top : ($goTo.offset().top - $content.offset().top - offset);

		$wrapper.find('a').removeClass('interior-nav--node__active');
		$this.addClass('interior-nav--node__active');

		$contentScrollWrap.off('scroll', checkForActiveTabChange);

		if (isWindow) {
			$content.animate({scrollTop: goToVal});
		} else {
			$contentScrollWrap.trigger('scrollTo', [goToVal]);
		}

		// don't check for active tab change when we know it's happening causing it to trigger twice
		setTimeout(() => {
			$contentScrollWrap.on('scroll', {wrapper: $wrapper, nodes: $nodes, contentScrollWrap: $contentScrollWrap, offset, isWindow}, checkForActiveTabChange);
		}, $wrapper.attr('data-animation-speed') || 500);
	}

	function toggleNav(e) {
		e.preventDefault();
		e.stopPropagation();

		const $wrapper = e.data.wrapper;
		const $toggleIcon = e.data.toggleIcon;

		$wrapper.toggleClass('interior-nav__active');
		$toggleIcon.toggleClass('fa-rotate-180')
	}

	function interiorNav(wrapper, contentWrapper, userDefinedOffset) {
		const $wrapper = $(wrapper);
		const isWindow = !(contentWrapper || $wrapper.attr('data-interior-nav-content-wrapper'));
		const $contentScrollWrap = contentWrapper ? $(contentWrapper) : 
													($wrapper.attr('data-interior-nav-content-wrapper') ? $($wrapper.attr('data-interior-nav-content-wrapper')) :
																											$(window));
		const $content = isWindow ? $('html, body') : $contentScrollWrap.find('> [data-scroll="content"]');
		const $nodes = $('.js-nav-nodes [data-position]');
		const $toggle = $wrapper.find('[data-interior-nav="toggle"]');
		const $toggleIcon = $toggle.find('.fa');
		const offset = userDefinedOffset || $wrapper.attr('data-interior-nav-offset') || 24;
		
		$toggle.off('click', toggleNav).on('click', {wrapper: $wrapper, toggleIcon: $toggleIcon}, toggleNav);
		$wrapper.find('a').off('click', scrollTo).on('click', {wrapper: $wrapper, nodes: $nodes, contentScrollWrap: $contentScrollWrap, content: $content, offset, isWindow}, scrollTo);
		$contentScrollWrap.off('scroll', checkForActiveTabChange).on('scroll', {wrapper: $wrapper, nodes: $nodes, contentScrollWrap: $contentScrollWrap, offset, isWindow}, checkForActiveTabChange);
	}

	$.fn.interiorNav = function(contentWrapper, offset) {
		return this.each((index, wrapper) => {
			interiorNav(wrapper, contentWrapper, offset);
		});
	};

	$(() => $('[data-function*="interiorNav"]').interiorNav());
}(jQuery.noConflict());