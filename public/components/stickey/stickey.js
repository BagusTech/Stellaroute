// make as jQuery plugin
// options
// -- top offset
// -- bottom offset
// -- on what scroll
// -- starting top position


/*global jQuery */
void function initializeStickeyAddon($) {
	'use strict';

	const getOffset = function($elem, $scrollWrapper, offset, nextStickeyElem){
		const defaultTop = $elem.offset().top + $scrollWrapper.scrollTop();
		const userDefinedTop = offset && offset.top || ($elem.attr('data-stickey-top') ? ($($elem.attr('data-stickey-top')).offset().top + $scrollWrapper.scrollTop() - $($elem.attr('data-stickey-top')).outerHeight(true)) : false);
		const $nextStickeyElem = (nextStickeyElem && $(nextStickeyElem)) || $elem.nextAll('[data-function*="stickey"]').first();
		const defaultBottom = ($nextStickeyElem.length && $nextStickeyElem.offset().top + $scrollWrapper.scrollTop() - $elem.outerHeight(true)) || false;
		const userDefinedBottom = (offset && offset.bottom) || ($elem.attr('data-stickey-bottom') ? ($($elem.attr('data-stickey-bottom')).offset().top + $scrollWrapper.scrollTop() - $elem.outerHeight(true)) : false);

		return {
			start: userDefinedTop ? $elem.position().top - userDefinedTop + $elem.outerHeight(true) : $elem.position().top,
			top: userDefinedTop || defaultTop,
			bottom: userDefinedBottom || defaultBottom,
		};
	};

	const initStickey = function(wrapper, userDefinedOffset, nextStickeyElem){
		const $wrapper = $(wrapper);
		const $content = $wrapper.find('[data-stickey="content"]');
		const $scrollWrapper = $wrapper.attr('data-stickey-scroll-wrapper') || 
								$wrapper.closest('[data-scroll="content-wrapper"').length ?
									$wrapper.closest('[data-scroll="content-wrapper"') :
									$(window);
		const offset = getOffset($wrapper, $scrollWrapper, userDefinedOffset, nextStickeyElem);

		function makeStickey() {
			const scrollTop = $scrollWrapper.scrollTop();

			if(scrollTop > offset.top && (!offset.bottom || scrollTop < offset.bottom)){
				if(!$wrapper.hasClass('stickey')){
					$wrapper.height($wrapper.height());
					$content.css('width', $wrapper.width())
					$wrapper.addClass('stickey');
					$wrapper.removeClass('stuck');
				}
			} else if (offset.bottom && scrollTop >= (offset.bottom)){
				if(!$wrapper.hasClass('stuck')){
					const top = scrollTop - offset.top;

					$wrapper.removeClass('stickey');
					$wrapper.height($wrapper.height());
					$wrapper.addClass('stuck');
					$content.css('top', `${top}px`)
				}
			} else {
				$wrapper.css('height', 'auto');
				$content.css('width', 'auto');
				$wrapper.removeClass('stickey stuck');
			}
		}

		function reInitStickey() {
			$(window).off('resize', reInitStickey)
			$scrollWrapper.off('scroll', makeStickey);

			$wrapper.stickey(userDefinedOffset, nextStickeyElem);
		}

		$scrollWrapper.on('scroll', makeStickey);
		$wrapper.on('reInitStickey', reInitStickey);
		$wrapper.closest('[role="tabpanel"]').on('tab-changed', reInitStickey);

		$(window).on('resize', reInitStickey);
	}

	$.fn.stickey = function init(offset, nextStickeyElem) {
		return this.each((index, wrapper) => {
			initStickey(wrapper, offset, nextStickeyElem);
		});
	};

	$(window).on('load', () => { $('[data-function*="stickey"]').stickey(); })
}(jQuery.noConflict())