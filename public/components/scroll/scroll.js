/*global jQuery */
void function initializeCustomScroll($) {
    'use strict';

    const initScroll = function initScroll(wrapper) {

        const $wrapper = $(wrapper);
        const $contentWrapper = $wrapper.find('> [data-scroll="content-wrapper"]');
        const $content = $contentWrapper.find('[data-scroll="content"]');
        const $scrollBar = $wrapper.find('> [data-scroll="scrollbar"]');
        const $scrollBarButton = $scrollBar.find('button');
        const scrollProperties = {};

        $scrollBarButton.outerHeight(scrollProperties.scrollBarHeight);

        const percentDone = function() { return $contentWrapper.scrollTop() / ((scrollProperties.maxTop*scrollProperties.ratio)-scrollProperties.contentWrapperHeight);}

        const checkReInitScroll = function() {
            if (scrollProperties.contentWrapperHeight !== $contentWrapper.outerHeight()-6 || scrollProperties.contentHeight !== $content.outerHeight()){
                $wrapper.trigger('initScroll');
                return;
            }
        };

        const customScrolling = function customScrolling(e, animate) {
            e.stopPropagation();

            if (scrollProperties.moving){
                const trueTop = (e.clientY - scrollProperties.offset);
                const trueScrollTop = trueTop * scrollProperties.ratio;
                const scrollTopOffset = scrollProperties.topOffset * percentDone();
                const scrollTopCalc = trueScrollTop - scrollTopOffset;
                const scrollTopMax = scrollTopCalc > scrollProperties.maxScroll ? scrollProperties.maxScroll : scrollTopCalc;
                const scrollTop = scrollTopCalc > 0 ? scrollTopMax : 0;

                if (animate){
                    $contentWrapper.animate({scrollTop});
                } else {
                    $contentWrapper.scrollTop(scrollTop);
                }
            }
        };

        const startScrolling = function startScrolling(e) {
            e.stopPropagation();

            if (e.which === scrollProperties.leftClick){
                scrollProperties.moving = true;
                scrollProperties.offset = e.clientY - $scrollBarButton.position().top;
              $('body').mousemove(customScrolling);
            }
        };

        const stopScrolling = function stopScrolling() {
            if (scrollProperties.moving){
                scrollProperties.moving = false;
                $('body').unbind('mousemove', customScrolling);
            }
        };

        const sideBarScroll = function sideBarScroll(e) {
            e.stopPropagation();

            const scrollSpeed = 50;
            let scrollBy = 2;
            scrollProperties.moving = true;

            const scrolling = setInterval(() => {
                if (scrollProperties.moving){
                    const isOverScrollBarButton = $scrollBarButton.offset().top > e.clientY;
                    const isUnderScrollBarButton = $scrollBarButton.offset().top + (scrollProperties.scrollBarHeight / 2)
                                                   < e.clientY;

                    if (!isOverScrollBarButton && !isUnderScrollBarButton){
                        return;
                    }

                    if (isOverScrollBarButton) {
                        $contentWrapper.scrollTop($contentWrapper.scrollTop() - scrollBy);
                    } else if (isUnderScrollBarButton){
                        $contentWrapper.scrollTop($contentWrapper.scrollTop() + scrollBy);
                    }

                    scrollBy++;
                } else {
                    clearInterval(scrolling);
                }
            }, scrollSpeed);
        };

        const moveScrollBar = function moveScrollBar(e){
            e.stopPropagation();

            checkReInitScroll();

            const moveTop = scrollProperties.maxTop*percentDone();
            $scrollBarButton.css('top', `${moveTop}px`);
        }

        const scrollTo = function scrollTo(e, value) {
            $contentWrapper.animate({scrollTop: value});
        };

        const init = function init() {
            $wrapper.removeClass('no-scrollbar');

            scrollProperties.contentHeight = $content.outerHeight();
            scrollProperties.contentWrapperHeight = $contentWrapper.outerHeight()-6; // minus 6 for styling purposes
            scrollProperties.scrollBarHeightRatio = (scrollProperties.contentWrapperHeight+6) / scrollProperties.contentHeight;
            scrollProperties.scrollBarHeightTrue = (scrollProperties.contentWrapperHeight+6) * scrollProperties.scrollBarHeightRatio;
            scrollProperties.scrollBarHeight = scrollProperties.scrollBarHeightTrue <= 0 ? 0 : scrollProperties.scrollBarHeightTrue;
            scrollProperties.maxScroll = scrollProperties.contentHeight - scrollProperties.contentWrapperHeight;
            scrollProperties.ratio = scrollProperties.contentHeight/ (scrollProperties.contentWrapperHeight - scrollProperties.scrollBarHeight);
            scrollProperties.topOffset = scrollProperties.contentHeight - scrollProperties.maxScroll;
            scrollProperties.maxTop = scrollProperties.contentWrapperHeight - scrollProperties.scrollBarHeight;
            scrollProperties.leftClick = 1;
            scrollProperties.moving = false;
            scrollProperties.offset = 0;

            $scrollBarButton.outerHeight(scrollProperties.scrollBarHeight);

            if (scrollProperties.scrollBarHeightRatio >= 1){
                $wrapper.addClass('no-scrollbar');
            }
        };

        $scrollBar.mousedown(sideBarScroll);
        $scrollBarButton.mousedown(startScrolling);
        $contentWrapper.on('scroll', moveScrollBar)      
        $contentWrapper.on('scrollTo', scrollTo);
        $(document).mouseup(stopScrolling);
        $wrapper.on('initScroll', init);

        if (scrollProperties.scrollBarHeightRatio >= 1){
            $wrapper.addClass('no-scrollbar');
        }

        $(window).on('load', checkReInitScroll);

        $wrapper.trigger('initScroll');
    };

    $.fn.customScroll = function init() {
        return this.each((index, wrapper) => {
            initScroll(wrapper);
        });
    };

    $(() => $('[data-function*="scroll"]').customScroll());
}(jQuery.noConflict());
