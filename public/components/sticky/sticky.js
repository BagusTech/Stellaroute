/*global jQuery */

void function initializeStickyContentAddon($) {
	'use strict';

	function checkHeight(e) {
		e.stopPropagation();
		e.preventDefault();

		const $wrapper = e.data.wrapper;
		const $sticky = e.data.sticky;

		$wrapper.css('height', 'auto').removeClass('scroll-y');

		const stickyHeight = $sticky.height();
		const contentHeight = $wrapper.outerHeight(true);
		const windowHeight = $(window).height();
		const stickyTop = $sticky.css('top');
		const maxContentHeight = windowHeight - (stickyTop ? parseInt(stickyTop, 10) : 0) - (stickyHeight - contentHeight) - 12;

		window.$wrapper = $wrapper;
		window.$sticky = $sticky;
		window.stickyHeight = stickyHeight;
		window.windowHeight = windowHeight;
		window.contentHeight = contentHeight;


		if(contentHeight >= maxContentHeight) {
			$wrapper.addClass('scroll-y').height(maxContentHeight);
		}
	}

	function triggerCheckHeight(e) {
		e.stopPropagation();

		e.data.wrapper.trigger('checkHeight');
	}

	function resize() {
		let resizeDebounce;

		return (e) => {
			clearTimeout(resizeDebounce);

			resizeDebounce = setTimeout(() => {
				e.data.wrapper.trigger('checkHeight');
			}, 100);
		}
	}

	const initSticky = function(wrapper){
		const $wrapper = $(wrapper);
		const $sticky = $wrapper.closest('.sticky');
		const $triggerButtons = $sticky.find('.js-sticky-content-trigger');

		$wrapper.off('checkHeight', checkHeight).on('checkHeight', {wrapper: $wrapper, sticky: $sticky}, checkHeight);
		$wrapper.off('tab-changed', triggerCheckHeight).on('tab-changed', {wrapper: $wrapper}, triggerCheckHeight);
		$triggerButtons.off('click', triggerCheckHeight).on('click', {wrapper: $wrapper}, triggerCheckHeight);
		$(window).off('resize', resize).on('resize', {wrapper: $wrapper}, resize());

		$wrapper.trigger('checkHeight');
	}

	$.fn.stickyContent = function init() {
		return this.each((index, wrapper) => {
			initSticky(wrapper);
		});
	};

	$(() => { $('.js-sticky-content').stickyContent(); })
}(jQuery.noConflict())