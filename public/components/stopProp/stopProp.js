/*global jQuery */

void function stopProp($) {
    'use strict';

    function makeStopProp(wrapper) {
        const $this = $(wrapper);
        const event = $this.attr('data-event') || 'click';
        
        $this.on(event, (e) => e.stopPropagation());
    }

    $.fn.makeStopProp = function init() {
        return this.each((index, wrapper) => {
            makeStopProp(wrapper);
        });
    };

    $(() => $('[data-function*="stopProp"]').makeStopProp());
}(jQuery.noConflict());