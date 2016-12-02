/*global jQuery */
void function initializeCustomScroll($) {
    'use strict';

    const initScroll = function initScroll(wrapper) {
        const $wrapper = $(wrapper);
        const $contentWrapper = $wrapper.find('> [data-scroll="content-wrapper"]');
        const contentWrapperHeight = $contentWrapper.outerHeight()-6;
        const $content = $contentWrapper.find('[data-scroll="content"]');
        const contentHeight = $content.outerHeight();
        const $scrollBar = $wrapper.find('> [data-scroll="scrollbar"]');
        const $scrollBarButton = $scrollBar.find('button');
        const scrollBarHeightRatio = contentWrapperHeight / contentHeight;
        const scrollBarHeightTrue = contentWrapperHeight * scrollBarHeightRatio;
        const scrollBarHeight = scrollBarHeightTrue < 0 ? 0 : scrollBarHeightTrue;
        const maxScroll = contentHeight - contentWrapperHeight;
        const ratio = contentHeight/ (contentWrapperHeight - scrollBarHeight);
        const topOffset = contentHeight - maxScroll;
        const maxTop = contentWrapperHeight - scrollBarHeight;
        const leftClick = 1;
        let moving = false;
        let offset = 0;

        $scrollBarButton.outerHeight(scrollBarHeight);

        const percentDone = function() { return $contentWrapper.scrollTop() / ((maxTop*ratio)-contentWrapperHeight);}

        const checkReInitScroll = function() {
            if (contentWrapperHeight !== $contentWrapper.outerHeight() || contentHeight !== $content.outerHeight()){
                $wrapper.trigger('reInitScroll');
                return;
            }
        };

        const customScrolling = function customScrolling(e, animate) {
            e.stopPropagation();

            if (moving){
                const trueTop = (e.clientY - offset);
                const trueScrollTop = trueTop * ratio;
                const scrollTopOffset = topOffset * percentDone();
                const scrollTopCalc = trueScrollTop - scrollTopOffset;
                const scrollTopMax = scrollTopCalc > maxScroll ? maxScroll : scrollTopCalc;
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
            e.stopPropagation();

            const scrollSpeed = 50;
            let scrollBy = 2;
            moving = true;

            const scrolling = setInterval(() => {
                if (moving){
                    const isOverScrollBarButton = $scrollBarButton.offset().top > e.clientY;
                    const isUnderScrollBarButton = $scrollBarButton.offset().top + (scrollBarHeight / 2)
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

            const moveTop = maxTop*percentDone();
            $scrollBarButton.css('top', `${moveTop}px`);
        }

        const scrollTo = function scrollTo(e, value) {
            $contentWrapper.animate({scrollTop: value});
        };

        const reInit = function reInit() {
            $wrapper.removeClass('no-scrollbar');
            $scrollBar.unbind('mousedown', sideBarScroll);
            $scrollBarButton.unbind('mousedown', startScrolling);
            $contentWrapper.unbind('scroll', moveScrollBar);
            $contentWrapper.unbind('scrollTo', scrollTo);
            $(document).unbind('mouseup', stopScrolling);
            $wrapper.unbind('reInitScroll', reInit);

            $wrapper.customScroll();

            return false;
        };

        $scrollBar.mousedown(sideBarScroll);
        $scrollBarButton.mousedown(startScrolling);
        $contentWrapper.on('scroll', moveScrollBar)      
        $contentWrapper.on('scrollTo', scrollTo);
        $(document).mouseup(stopScrolling);
        $wrapper.on('reInitScroll', reInit);

        if (scrollBarHeightRatio >= 1){
            $wrapper.addClass('no-scrollbar');
        }

        $(window).on('load', checkReInitScroll);

        return false;
    };

    $.fn.customScroll = function init() {
        return this.each((index, wrapper) => {
            initScroll(wrapper);
        });
    };

    $(() => $('[data-function*="scroll"]').customScroll());
}(jQuery.noConflict());
