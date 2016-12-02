/*global jQuery */
void function initializeTabs($) {
    'use strict';

    function togglePanels($newPanel, $oldPanel) {
        const currentId = $newPanel.attr('id');

        $oldPanel.toggleClass('hidden active');
        $newPanel.toggleClass('hidden');

        setTimeout(() => {
            $newPanel.toggleClass('active');            
        }, 10);

        $newPanel.attr('id', '');
        window.location.hash = currentId;
        $newPanel.attr('id', currentId);

        $newPanel.trigger('tab-changed');
    }

    function changeTabs(){
        const $this = $(this);

        if($this.hasClass('active')){
            $this.trigger('tab-changed');
            return;
        }

        const $activePanel = $this.siblings('.active');

        togglePanels($this, $activePanel);
    }

    function makeTabPanels(wrapper){
        const $wrapper = $(wrapper);
        const $panels = $wrapper.find('[data-tabs="panel"]');
        const pageAnchor = window.location.hash;

        $panels.each((i, item) => {
            const $panel = $(item);
            const id = $panel.attr('id');

            if(!id){
                return;
            }

            $panel.on('tab-change', changeTabs);

            $(`a[href=#${id}]`).click(function triggerTab(e) {
                e.preventDefault();
                e.stopPropagation();

                const $this = $(this);

                $this.parents('[data-tabs]').find('[data-tabs]').removeClass('active');
                $this.addClass('active');

                $panel.trigger('tab-change');
            });
        });

        // open to current tab on load
        // if there isn't a page anchor, end here
        if (!pageAnchor) {
            return;
        }

        const $anchorToClick = $(`a[data-tabs='control'][href=${pageAnchor}]`);

        if($anchorToClick.length === 1){
            $anchorToClick.click();

            $(window).on('load', () => {
                setTimeout(() => {
                    $('#Body').scrollTop(0);
                }, 1)
            })
        }
    }

    $.fn.makeTabs = function makeTabs() {
        return this.each((index, wrapper) => {
            const $wrapper = $(wrapper);

            makeTabPanels($wrapper);

            $wrapper.trigger('tabs-initialized');
        });
    };

    // initialize default tabs
    $(() => {
        $('[data-function*="tabs"]').makeTabs();
    });
}(jQuery.noConflict());