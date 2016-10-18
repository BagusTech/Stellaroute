/*global jQuery */
void function initializeCustomScroll($) {
    'use strict';

    const initScroll = function initScroll(wrapper) {
        const $wrapper = $(wrapper);
        const $contentWrapper = $wrapper.find('> [data-scroll="content-wrapper"]');
        const contentWrapperHeight = $contentWrapper.outerHeight();
        const $content = $contentWrapper.find('[data-scroll="content"]');
        const contentHeight = $content.outerHeight();
        const $scrollBar = $wrapper.find('> [data-scroll="scrollbar"]');
        const $scrollBarButton = $scrollBar.find('button');
        const currentScrollBarHeight = $scrollBarButton.outerHeight();
        const scrollBarHeightRatio = contentWrapperHeight / contentHeight;
        const scrollBarHeightTrue = contentWrapperHeight * scrollBarHeightRatio;
        const scrollBarHeight = scrollBarHeightTrue < currentScrollBarHeight ? currentScrollBarHeight
                                                                             : scrollBarHeightTrue;
        const maxScroll = contentHeight - contentWrapperHeight;
        const ratio = contentHeight/ (contentWrapperHeight - scrollBarHeight);
        const topOffset = contentHeight - maxScroll;
        const maxTop = contentWrapperHeight - scrollBarHeight;
        const leftClick = 1;
        const middleClick = 2;
        let moving = false;
        let top = 0;
        let offset = 0;

        $scrollBarButton.outerHeight(scrollBarHeight);

        // I think this can be removed, but not 100% sure
        // $wrapper.on('reInitScroll', () => initScroll($wrapper));

        const customScrolling = function customScrolling(e, animate) {
            if (moving){
                const trueTop = (e.clientY - offset);
                const percentDone = trueTop / maxTop >= 0 ? trueTop / maxTop : 0;
                const trueScrollTop = trueTop * ratio;
                const scrollTopOffset = topOffset * percentDone;
                const scrollTopCalc = trueScrollTop - scrollTopOffset;
                const scrollTopMax = scrollTopCalc > maxScroll ? maxScroll : scrollTopCalc;
                const scrollTopVal = scrollTopCalc > 0 ? scrollTopMax : 0;
                const topVal = trueTop > 0 ? trueTop : 0;

                top = topVal > maxTop ? maxTop : topVal;

                if (animate){
                    $scrollBarButton.animate({'top': `${top}px`});
                    $contentWrapper.animate({scrollTop: scrollTopVal});
                } else {
                    $scrollBarButton.css('top', `${top}px`);
                    $contentWrapper.scrollTop(scrollTopVal);
                }

                $contentWrapper.trigger('scrolling');
            }
        };

        const startScrolling = function startScrolling(e) {
            e.stopPropagation();

            if (contentWrapperHeight !== $contentWrapper.outerHeight()){
                $wrapper.trigger('reinit');

                return;
            }

            if (e.which === leftClick){
                moving = true;
                offset = e.clientY - $scrollBarButton.position().top;
              $('body').mousemove(customScrolling);
            }
        };

        const stopScrolling = function stopScrolling() {
            if (moving){
                moving = false;
                $('body').unbind('mousemove', customScrolling);
            }
        };

        const sideBarScroll = function sideBarScroll(e) {
            const middle = 2;
            const scrollSpeed = 50;
            let scrollBy = 2;
            moving = true;

            const scrolling = setInterval(() => {
                if (moving){
                    const isOverScrollBarButton = $scrollBarButton.offset().top > e.clientY;
                    const isUnderScrollBarButton = $scrollBarButton.offset().top + (scrollBarHeight / middle)
                                                   < e.clientY;

                    if (!isOverScrollBarButton && !isUnderScrollBarButton){
                        return;
                    }

                    offset = 0;

                    if (isOverScrollBarButton) {
                        customScrolling({ clientY: top - scrollBy});
                    } else if (isUnderScrollBarButton){
                        customScrolling({ clientY: top + scrollBy});
                    }

                    scrollBy++;
                } else {
                    clearInterval(scrolling);
                }
            }, scrollSpeed);
        };

        const mouseWheelScroll = function mouseWheelScroll(e) {
            e.preventDefault();
            e.stopPropagation();

            // different browsers use different event properties
            const scrollValue = e.originalEvent.wheelDelta || -e.originalEvent.detail;
            const scrollBy = 3;

            offset = 0;
            moving = true;

            if (scrollValue > 0) {
                // scroll up

                customScrolling({ clientY: top - scrollBy});
            } else {
                // scroll down

                customScrolling({ clientY: top + scrollBy});
            }

            moving = false;
        };

        const middleClickScroll = function middleClickScroll(e) {
            e.stopPropagation();

            if (contentWrapperHeight !== $contentWrapper.outerHeight()){
                $wrapper.trigger('reinit');

                return;
            }

            if (e.which === middleClick){
                e.preventDefault();

                moving = true;
                offset = e.clientY - $scrollBarButton.position().top;
              $('body').mousemove(customScrolling);
            }
        };

        const scrollTo = function scrollTo(e, value) {
            const scrollbarTop = value / ratio;
            const percentDone = (scrollbarTop / maxScroll);
            const scrollTop = scrollbarTop + (topOffset * percentDone);

            moving = true;
            offset = 0;
            customScrolling({ clientY: scrollTop }, true);
            moving = false;
        };

        const reInit = function reInit() {
            $wrapper.removeClass('no-scrollbar');
            $scrollBar.unbind('mousedown', sideBarScroll);
            $scrollBarButton.unbind('mousedown', startScrolling);
            $contentWrapper.unbind('mousewheel', mouseWheelScroll);
            $contentWrapper.unbind('mousedown', middleClickScroll);
            $contentWrapper.unbind('scrollTo', scrollTo);
            $(document).unbind('mouseup', stopScrolling);
            $wrapper.unbind('reinit', reInit);

            $wrapper.customScroll();

            return false;
        };

        $scrollBar.mousedown(sideBarScroll);
        $scrollBarButton.mousedown(startScrolling);
        $contentWrapper.mousedown(middleClickScroll);
        $contentWrapper.mousewheel(mouseWheelScroll);
        $contentWrapper.on('scrollTo', scrollTo);
        $(document).mouseup(stopScrolling);
        $wrapper.on('reinit', reInit);

        if (scrollBarHeightRatio >= 1){
            $wrapper.addClass('no-scrollbar');
            return false;
        }

        return false;
    };

    $.fn.customScroll = function init() {
        return this.each((index, wrapper) => {
            initScroll($(wrapper));
        });
    };

    $('[data-function="scroll"]').customScroll();
}(jQuery);
