/*global jQuery */

void function initializeToggle($) {
    'use strict';

    function toggleClasses($target, classes){
        return (e) => {
            e.stopPropagation();
            for(const i in classes){
                $target.toggleClass(classes[i])
            }

            $target.trigger('toggled');
        }
    }

    function triggerToggleEvent($target, toggleEventName){
        return (e) => {
            e.stopPropagation();
            $target.trigger(toggleEventName);
        };
    }

    function getElementString($elem){
        const elem = $elem[0]
        const classes = elem.classList.value.replace(/\s/g, '.');

        return `${elem.nodeName}#${elem.id}.${classes}`
    }

    function makeToggle(wrapper) {
        const $this = $(wrapper);
        const $targets = ($this.attr('data-target') && $this.attr('data-target').split(',')) || [$this];
        const event = $this.attr('data-event') || 'click';

        
        for(const i in $targets){
            const $target = $($targets[i]);
            const classes = ($target.attr('data-toggle') && $target.attr('data-toggle').split(' ')) || ['active'];
            const toggleEventName = `${getElementString($this)}.toggles.${getElementString($target)}.to.${classes.join('.')}`;
            
            $target.off(toggleEventName); // make sure there is at most one toggle event on the target so it won't double toggle
            $target.on(toggleEventName, toggleClasses($target, classes));

            if(event === 'hover'){
                $this.hover(triggerToggleEvent($target, toggleEventName));
            } else {
                $this.on(event, triggerToggleEvent($target, toggleEventName));
            }
        }
    }

    $.fn.makeToggle = function init() {
        return this.each((index, wrapper) => {
            makeToggle(wrapper);
        });
    };

    jQuery(() => $('[data-function="toggle"]').makeToggle());
}(jQuery);