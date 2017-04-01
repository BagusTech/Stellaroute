// make as jQuery plugin
// options
// -- top offset
// -- bottom offset
// -- on what scroll
// -- starting top position


/*global jQuery */
void function initializeStickeyAddon($) {
	'use strict';

	function reInitStickey(e, userDefinedOffset, nextStickeyElem) {
		e.stopPropagation();

		e.data.wrapper.stickey(userDefinedOffset, nextStickeyElem);
	}

	function makeStickey(e) {
		e.stopPropagation();

		const $wrapper = e.data.wrapper;
		const $content = e.data.content;

		$wrapper.height($wrapper.outerHeight(true));
		$content.each((i, c) => {$(c).css('width', $(c).outerWidth());});
		$wrapper.addClass('stickey');
		$wrapper.removeClass('stuck');
		$content.css('top', '');
	}

	function makeStuck(e, scrollTop) {
		e.stopPropagation();

		const $wrapper = e.data.wrapper;
		const $content = e.data.content;

		const top = scrollTop - $wrapper.prop('stickeyTop');

		$wrapper.removeClass('stickey');
		$wrapper.height($wrapper.outerHeight(true));
		$wrapper.addClass('stuck');
		$content.css('top', `${top}px`)
	}

	const setOffset = function(e){
		e.stopPropagation();

		const $wrapper = e.data.wrapper;
		const $scrollWrapper = e.data.scrollWrapper;
		const offset = e.data.offset;
		const nextStickeyElem = e.data.nextStickeyElem;
		const userDefinedTop = offset && offset.top || ($wrapper.attr('data-stickey-top') ? ($($wrapper.attr('data-stickey-top')).offset().top + $scrollWrapper.scrollTop() - $($wrapper.attr('data-stickey-top')).outerHeight(true)) : false);
		const $nextStickeyElem = (nextStickeyElem && $(nextStickeyElem)) || $wrapper.nextAll('[data-function*="stickey"]').first();
		const defaultBottom = ($nextStickeyElem.length && $nextStickeyElem.offset().top + $scrollWrapper.scrollTop() - $wrapper.outerHeight(true)) || false;
		const userDefinedBottom = (offset && offset.bottom) || ($wrapper.attr('data-stickey-bottom') ? ($($wrapper.attr('data-stickey-bottom')).offset().top - $wrapper.find('[data-stickey="content"]').outerHeight(true)) : false);

		$wrapper.prop('stickeyTop', userDefinedTop ? $wrapper.offset().top - userDefinedTop + $wrapper.outerHeight(true) : $wrapper.offset().top);
		$wrapper.prop('stickeyBottom', userDefinedBottom || defaultBottom);
	};

	const initStickey = function(wrapper, userDefinedOffset, nextStickeyElem){
		const $wrapper = $(wrapper);
		const $content = $wrapper.find('[data-stickey="content"]');
		const $scrollWrapper = $wrapper.attr('data-stickey-scroll-wrapper') || 
								$wrapper.closest('[data-scroll="content-wrapper"').length ?
									$wrapper.closest('[data-scroll="content-wrapper"') :
									$(window);

		$wrapper.on('setStickeyOffset', {wrapper: $wrapper, scrollWrapper: $scrollWrapper, userDefinedOffset, nextStickeyElem}, setOffset)
		$wrapper.trigger('setStickeyOffset');

		function checkStickey(e) {
			e.stopPropagation();
			const scrollTop = $scrollWrapper.scrollTop();

			if(scrollTop > $wrapper.prop('stickeyTop') && (!$wrapper.prop('stickeyBottom') || scrollTop < $wrapper.prop('stickeyBottom'))){
				if(!$wrapper.hasClass('stickey')){
					$wrapper.trigger('StickeyStick');
				}
			} else if ($wrapper.prop('stickeyBottom') && scrollTop >= ($wrapper.prop('stickeyBottom'))){
				if(!$wrapper.hasClass('stuck')){
					$wrapper.trigger('StickeyStuck', [scrollTop]);
				}
			} else {
				$wrapper.css('height', '');
				$content.css('width', '');
				$content.css('top', '');
				$wrapper.removeClass('stickey stuck');
			}
		}

		$wrapper.on('tab-changed', () => {
			$wrapper.trigger('setStickeyOffset');
		});

		$scrollWrapper.off('scroll', checkStickey).on('scroll', checkStickey);
		$scrollWrapper.off('StickeyStick', makeStickey).on('StickeyStick', {wrapper: $wrapper, content: $content}, makeStickey);
		$scrollWrapper.off('StickeyStuck', makeStuck).on('StickeyStuck', {wrapper: $wrapper, content: $content}, makeStuck);
		$wrapper.off('reInitStickey', reInitStickey).on('reInitStickey', reInitStickey);
		$wrapper.closest('[role="tab"]').off('tab-changed', reInitStickey).on('tab-changed', reInitStickey);

		$(window).off('resize', reInitStickey).on('resize', {wrapper: $wrapper, userDefinedOffset, nextStickeyElem}, reInitStickey);
	}

	$.fn.stickey = function init(offset, nextStickeyElem) {
		return this.each((index, wrapper) => {
			initStickey(wrapper, offset, nextStickeyElem);
		});
	};

	$('[data-function*="stickey"]').stickey();
	$(window).on('load', () => { $('[data-function*="stickey"]').stickey(); })
}(jQuery.noConflict())