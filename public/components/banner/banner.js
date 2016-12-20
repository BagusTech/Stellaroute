/*global jQuery */

void function initializeBanner($) {
    'use strict';

    // banner functionality
    const makeBanner = function makeBanner(wrapper) {
        const $wrapper = $(wrapper);
        const $bannerItems = $wrapper.find('[data-banner="item"]');
        const animationSpeed = $wrapper.attr('data-animation-speed') || 1; // in seconds for CSS
        const autoRotateSpeed = $wrapper.attr('data-interval-speed') || 4000;
        const autoRotate = $wrapper.attr('data-banner-auto-rotate') === 'false' ? false : true;
        const $forward = $wrapper.find('[data-banner="forward"]');
        const $back = $wrapper.find('[data-banner="back"]');

        $bannerItems.css('transition-duration', `${animationSpeed}s`)

        $bannerItems.addClass('after');
        $bannerItems.eq(0).removeClass('after').addClass('active');
        $bannerItems.eq(1).removeClass('after').addClass('before');

        function rotate(back){
            return () => {
                back = back === undefined ? false : back;

                const $active = $wrapper.find('.active');
                const $before = $wrapper.find('.before');

                $active.removeClass('active').addClass(back ? 'before' : 'after').addClass('in-transition');
                $before.removeClass('before').addClass(back ? 'after' : 'active');

                setTimeout(() => {$wrapper.find('.in-transition').removeClass('in-transition')}, animationSpeed * 1000);

                if (back) {
                    const activeIndex = $bannerItems.index($active);
                    const nextActiveIndex = activeIndex === 0 ? $bannerItems.length - 1 : activeIndex -1;
                    
                    $bannerItems.eq(nextActiveIndex).removeClass('after').addClass('active');
                } else {
                    const beforeIndex = $bannerItems.index($before);
                    const nextBeforeIndex = beforeIndex === $bannerItems.length - 1 ? 0 : beforeIndex + 1;

                    $bannerItems.eq(nextBeforeIndex).removeClass('after').addClass('before');
                }
            }
        }

        $forward.click(rotate());
        $back.click(rotate(true));

        if(autoRotate) {
            let startRotate = setInterval(rotate(), autoRotateSpeed);

            $wrapper.on('mouseenter', () => { clearInterval(startRotate); });
            $wrapper.on('mouseleave', () => { startRotate = setInterval(rotate(), autoRotateSpeed); });
        }
    };

    $.fn.makeBanner = function init() {
        return this.each((index, wrapper) => makeBanner(wrapper));
    };

    $(() => $('[data-function*="banner"]').makeBanner());
}(jQuery.noConflict());
