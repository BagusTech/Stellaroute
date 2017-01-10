/*global jQuery */

void function initializeToggle($) {
    'use strict';

    function toggleClasses($target, classes){
        return (e) => {
            e.stopPropagation();

            const length = classes.length
            for(let i = 0; i < length; i++ ){
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

        if(elem){
            const classes = elem.classList.value.replace(/\s/g, '.');

            return `${elem.nodeName}#${elem.id}.${classes}`
        }

        return 'NoTargetFound'
    }

    function makeToggle(wrapper) {
        const $this = $(wrapper);
        const targets = ($this.attr('data-target') && $this.attr('data-target').split(',')) || ['this'];
        const event = $this.attr('data-event') || 'click';
        const length = targets.length;

        for(let i = 0; i < length ; i++){
            const isSelf = (targets[i] === ' this' || targets[i] === 'this');
            const thisIndex = targets[i].indexOf('this');
            const referencesSelf = !isSelf && (thisIndex === 0 || (thisIndex === 1 && targets[i][0] === ' '));
            const $target = isSelf ? $this : 
                                    referencesSelf ? $this.find(targets[i].substring(5)) : $(targets[i]);
            const classes = $target.attr('data-toggle') ? $target.attr('data-toggle').split(' ') : ['active'];
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

    $(() => $('[data-function*="toggle"]').makeToggle());
}(jQuery.noConflict());