/*global jQuery */

void function initializeIcon($) {
    'use strict';

    const addIcon = function addIcon(wrapper) {
        const $this = $(wrapper);
        const icon = `<i class='${$this.attr('data-icon')}' aria-hidden='true'></i>`;

        $this.prepend(icon);
    };

    $.fn.addIcon = function init() {
        return this.each((index, wrapper) => {
            addIcon(wrapper);
        });
    };

    $(() => $('[data-icon]').addIcon());
}(jQuery.noConflict());
