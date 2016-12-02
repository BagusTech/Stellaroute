/*global jQuery */

void function initializeBanner($) {
    'use strict';

    // banner functionality
    const makeBanner = function makeBanner(wrapper) {
        const $wrapper = $(wrapper);
        const $bannerItems = $wrapper.find('[data-banner-item]');
        const animationSpeed = $wrapper.attr('data-animation-speed') || 4000;

        $bannerItems.addClass('after');
        $bannerItems.eq(0).removeClass('after').addClass('active');
        $bannerItems.eq(1).removeClass('after').addClass('before');

        function rotate(){
            const $active = $wrapper.find('.active');
            const $before = $wrapper.find('.before');
            const beforeIndex = $bannerItems.index($before);
            const nextBeforeIndex = beforeIndex === $bannerItems.length - 1 ? 0 : beforeIndex + 1;

            $active.removeClass('active').addClass('after');
            $before.removeClass('before').addClass('active');
            $bannerItems.eq(nextBeforeIndex).removeClass('after').addClass('before');
        }

        let startRotate = setInterval(rotate, animationSpeed);
        
        $wrapper.on('mouseenter', () => {
            clearInterval(startRotate);
        });

        $wrapper.on('mouseleave', () => {
            startRotate = setInterval(rotate, animationSpeed);
        });
    };

    $.fn.makeBanner = function init() {
        return this.each((index, wrapper) => makeBanner(wrapper));
    };

    $(() => $('[data-function*="banner"]').makeBanner());
}(jQuery.noConflict());
