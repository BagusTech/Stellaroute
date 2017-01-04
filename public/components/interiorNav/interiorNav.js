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

		function becomeActiveNode(e, isParent) {
			const windowWidth = $(window).width();

			if(windowWidth > 767) {
				return;
			}

			const $node = $(e.currentTarget);
			const $toMove = isParent ? $wrapper : $node.closest('[role="tabpanel"');
			const leftOffset = isParent ? 0 : parseInt($wrapper.css('left'), 10) || 0;
			const maxLeft = windowWidth - $toMove.outerWidth() - leftOffset;
			const baseLeft = (leftOffset*-1) - $node.position().left;
			const nodePosition = $node.attr('data-position').split('.');
			const baseWithOffset = nodePosition[nodePosition.length - 1] === '0' ? baseLeft : baseLeft + 40;
			const left = baseLeft <= maxLeft ? maxLeft : baseWithOffset;

			// if there isn't a change between what we are setting and what it is, don't do anything
			if(parseInt($toMove.css('left'), 10) === left) {
				return;
			}

			$toMove.css('left', left);

			if(isParent) {
				$node.next().css('left', -left);
			}
		}

		function checkForActiveTabChange() {
			const $allActiveNodes = $nodes.filter((i, node) => $(node).offset().top <= offset);
			const $activeNodes = $wrapper.find('.active');
			const activePosition = $allActiveNodes.last().attr('data-position');
			const currentPosition = $activeNodes.last().attr('data-position')
			const newActiveNode = ($allActiveNodes.length && (activePosition !== currentPosition));
			const removeActive = (!$allActiveNodes.length && $activeNodes.length) || newActiveNode;

			if (removeActive) {
				$wrapper.find('a').removeClass('active');
			}

			if (newActiveNode){
				const $activeNode = $wrapper.find(`[data-position="${activePosition}"]`);
				const $activeNodeParent = $wrapper.find(`[data-position="${activePosition.split('.')[0]}"]`);

				if ($activeNodeParent.attr('aria-expanded') === 'false') {
					$activeNodeParent.trigger('tab-change');
				}

				$activeNodeParent.addClass('active').trigger('becomeActiveNode', [true]);
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

			if($this[0] === $thisParent[0]) {
				$this.addClass('active').trigger('becomeActiveNode', [true]);
			} else {
				$thisParent.addClass('active').trigger('becomeActiveNode', [true]);
				$this.addClass('active').trigger('becomeActiveNode');
			}

			$contentScrollWrap.off('scroll', checkForActiveTabChange);
			$contentScrollWrap.trigger('scrollTo', [goToVal]);

			// don't check for active tab change when we know it's happening causing it to trigger twice
			setTimeout(() => {
				$contentScrollWrap.on('scroll', checkForActiveTabChange);
			}, $wrapper.attr('data-animation-speed') || 500);
		}

		$wrapper.find('[data-position]').on('becomeActiveNode', becomeActiveNode)

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
