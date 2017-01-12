/*global jQuery */
void function initializeTabs($) {
    'use strict';

    function togglePanels($newPanel, $oldPanel) {
        const currentId = $newPanel.attr('id');

        $oldPanel.attr('aria-hidden', 'true');
        $newPanel.attr('aria-hidden', ''); // for animation purposes

        setTimeout(() => {
            $newPanel.attr('aria-hidden', 'false');            
        }, 10);

        if($newPanel.attr('id')) {
            $newPanel.attr('id', '');
            window.location.hash = currentId;
            $newPanel.attr('id', currentId);
        }

        $newPanel.trigger('tab-changed');
    }

    function changeTabs(){
        const $this = $(this);

        if($this.is('[aria-hidden="false"]')){
            $this.trigger('tab-changed');
            return;
        }

        const $activePanel = $this.siblings('[aria-hidden="false"]');

        togglePanels($this, $activePanel);
    }

    function makeTabPanels(wrapper){
        const $wrapper = $(wrapper);
        const $tabs = $wrapper.find('> [role="tab"]');
        const $panels = $wrapper.find('> [role="tabpanel"]');
        const $controls = $('[data-tabs="controls"]');
        const pageAnchor = window.location.hash;

        if ($tabs.length) {
            $tabs.each((i, tab) => {
                $(tab).click((e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const $this = $(e.currentTarget);

                    if ($this.attr('aria-expanded') === 'true') {
                        return;
                    }

                    $this.siblings('[aria-expanded="true"]').attr('aria-expanded', 'false');
                    $this.attr('aria-expanded', 'true');

                    $panels.eq(i).trigger('tab-change');
                });
            });
        }

        $panels.each((i, panel) => {
            const $panel = $(panel);
            const id = $panel.attr('id');

            $panel.on('tab-change', changeTabs);

            if(!id){
                return;
            }

            $(`a[href="#${id}"]`).click((e) => {
                e.preventDefault();
                e.stopPropagation();

                $controls.each((j, tabControls) => {
                    const $tabControls = $(tabControls);
                    const $activeTab = $tabControls.find(`a[href="#${id}"]`);
                    const isActiveControl = $activeTab.length > 0;

                    if(isActiveControl) {
                        $tabControls.find('[role="tab"]').attr('aria-expanded', 'false');
                        $activeTab.attr('aria-expanded', 'true');
                    }
                });

                $panel.trigger('tab-change');
            });
        });

        // open to current tab on load
        // if there isn't a page anchor, end here
        if (!pageAnchor) {
            return;
        }

        const $anchorToClick = $(`[data-tabs="controls"] a[href="${pageAnchor}"]`);

        if($anchorToClick.length){
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