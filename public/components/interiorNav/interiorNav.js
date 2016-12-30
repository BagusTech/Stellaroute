/*global jQuery */

void function initInteriorNav($) {
	'use strict';

	const interiorNav = (wrapper, contentWrapper, userDefinedOffset) => {
		const $wrapper = $(wrapper);
		const $contentScrollWrap = contentWrapper ? $(contentWrapper) : 
													($wrapper.attr('data-interior-nav-content-wrapper') ? $($wrapper.attr('data-interior-nav-content-wrapper')) :
																											$('[data-scroll=content-wrapper]').first());
		const $content = $contentScrollWrap.find('> [data-scroll="content"]');
		const $nodes = $('.js-nav-nodes [data-position]');
		const offset = userDefinedOffset || $wrapper.attr('data-interior-nav-offset') || 24;

		function becomeActiveNode(e, test) {
			console.log(test)
			
			if((window).width() > 767) {
				return;
			}
		}

		function checkForActiveTabChange() {
			const $activeNodes = $nodes.filter((i, node) => $(node).offset().top <= offset);

			$wrapper.find('a').removeClass('active');

			if ($activeNodes.length){
				const currentPosition = $activeNodes.last().attr('data-position');
				const $activeNode = $wrapper.find(`[data-position="${currentPosition}"]`);
				const $activeNodeParent = $wrapper.find(`[data-position="${currentPosition.split('.')[0]}"]`);

				if ($activeNodeParent.attr('aria-expanded') === 'false') {
					$activeNodeParent.trigger('tab-change');
				}

				$activeNodeParent.addClass('active').trigger('becomeActiveNode', ['parent'])
				$activeNode.addClass('active').trigger('becomeActiveNode');
			}
		}

		function scrollTo(e) {
			e.preventDefault();

			const $this = $(this);
			const position = $this.attr('data-position');
			const $thisParent = $wrapper.find(`[data-position="${position.split('.')[0]}"]`);
			const $goTo = $nodes.filter((i, node) => $(node).attr('data-position') === position);
			const goToVal = $goTo.offset().top - $content.offset().top - offset;

			$wrapper.find('a').removeClass('active');
			$this.addClass('active');
			$thisParent.addClass('active');
			$contentScrollWrap.off('scroll', checkForActiveTabChange);
			$contentScrollWrap.trigger('scrollTo', [goToVal]);

			// don't check for active tab change when we know it's happening causing it to trigger twice
			setTimeout(() => {
				$contentScrollWrap.on('scroll', checkForActiveTabChange);
			}, $wrapper.attr('data-animation-speed') || 500);
		}

		$nodes.on('becomeActiveNode', becomeActiveNode)

		$wrapper.find('a').click(scrollTo);
		$contentScrollWrap.on('scroll', checkForActiveTabChange);
	};

	$.fn.interiorNav = function(contentWrapper, offset) {
		return this.each((index, wrapper) => {
			interiorNav(wrapper, contentWrapper, offset);
		});
	};

	$(() => $('[data-function*="interiorNav"]').interiorNav());
}(jQuery.noConflict());
