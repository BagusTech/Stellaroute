/*global jQuery */
void function initializeAccordions($) {
    'use strict';

    function removeHash() { 
        let scrollV, scrollH;
        const loc = window.location;
        if ("pushState" in history) {
            history.pushState("", document.title, loc.pathname + loc.search);
        } else {
            // Prevent scrolling by storing the page's current scroll offset
            scrollV = document.body.scrollTop;
            scrollH = document.body.scrollLeft;

            loc.hash = "";

            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scrollV;
            document.body.scrollLeft = scrollH;
        }
    }

    // on click of any link that starts with a hash, if it is a tab, then change that tab
    $('a[href^="#"]').on('click', function clickAnchor(e) {
        const $goToVal = $($(this).attr('href'));

        if (!$goToVal.is('[role=tab]')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        $goToVal.trigger('tab-change');
    });

    function createValidAttributeFromTitle(title) {
        const findInvalidAttributeCharacters = /[^a-z0-9\s]|^[^a-z\s]+/gi;
        const findMultipleSpaces = /\s\s+/g;
        const findAllSpaces = /\s/g;

        return title.replace(findInvalidAttributeCharacters, '')
                    .replace(findMultipleSpaces, ' ')
                    .trim()
                    .replace(findAllSpaces, '-');
    }

    function checkOrSetTabId($tabs) {
        $tabs.each((i, element) => {
            const $element = $(element);

            if ($element.attr('id')) {
                return;
            }

            const tabTitle = $element.text() || 'Empty';
            const originalTabId = createValidAttributeFromTitle(tabTitle);
            let tabId = `#${originalTabId}`;
            let index = 0;

            while ($(tabId).length) {
                tabId = `#${originalTabId}${++index}`;
            }

            $element.attr('id', tabId.substring(1));
        });
    }

    function toggleTab($tabToToggle, animationSpeed) {
        const tabState = $tabToToggle.attr('aria-expanded') === 'true';

        $tabToToggle.attr('aria-expanded', !tabState)
            .next('[role="tabpanel"]') // find the tabpanel that it is associated with
            .attr('aria-hidden', tabState)
            .slideToggle(animationSpeed);

        // trigger tab-changed event when done
        setTimeout(() => {
            $tabToToggle.closest('[data-function*="scroll"]').trigger('initScroll')
        }, animationSpeed);

        $tabToToggle.trigger('tab-changed', [ true ]);
    }

    function changeTab(e, isOnLoad) {
        e.stopPropagation();
        const $activeTab = e.data.wrapper.find('> [aria-expanded="true"]');
        const $tab = $(e.currentTarget);
        const currentTabIsActiveTab = ($tab[0] === $activeTab[0]);
        const currentId = $tab.attr('id');
        const alwaysShowOne = e.data.alwaysShowOne;
        const animationSpeed = e.data.animationSpeed;

        // if trying to toggle the current tab and one must always be shown, do nothing
        if (alwaysShowOne && currentTabIsActiveTab){
            $tab.trigger('tab-changed', [ false ]); // trigger tab-changed event, but pass false because nothing changed
            return; // return to stop anything else from happeneing
        } 

        // close other active tab 
        if (!currentTabIsActiveTab && $activeTab.length > 0 && !e.data.allowMultiple){
            toggleTab($activeTab, animationSpeed);
        }

        toggleTab($tab, animationSpeed);
        // set hash but don't move the page
        if (!isOnLoad) {
            if(!alwaysShowOne && currentTabIsActiveTab){
                removeHash();
            } else {
                $tab.attr('id', '');
                window.location.hash = currentId;
                $tab.attr('id', currentId);
            }
        }
    }

    function initTabChange(e) {
        e.preventDefault();
        e.stopPropagation();

        $(e.currentTarget).trigger('tab-change');
    }

    function makeTabPanel(wrapper) {
        const $wrapper = $(wrapper);
        const $tabs = $wrapper.children('[role="tab"]');
        const pageAnchor = window.location.hash;

        const defaultAnimationSpeed = 270;
        const animationSpeed = parseInt($wrapper.attr('data-animation-speed'), 10) || defaultAnimationSpeed;

        const alwaysShowOne = $wrapper.attr('data-always-show-one');
        const allowMultiple = $wrapper.attr('data-allow-multiple');

        checkOrSetTabId($tabs);

        $wrapper.removeClass('no-js');

        // make sure what is supposed to be shown is, and what isn't, isn't
        $wrapper.find('> [aria-hidden="false"]').css({'display': 'block' });
        $wrapper.find('> [aria-hidden="true"]').css({'display': 'none' });

        $tabs.on('tab-change', {wrapper: $wrapper, alwaysShowOne, allowMultiple, animationSpeed}, changeTab);

        // on click of tab, trigger the tab change
        $tabs.click(initTabChange);

        // if there isn't a page anchor, end here
        if (!pageAnchor) {
            $wrapper.trigger('accordin-initialized');
            return;
        }

        // get the tab that is being linked to in top
        const $anchorTab = $tabs.filter(pageAnchor);

        //only trigger tab change if the tab we are going to isn't currently open
        if($anchorTab.attr('aria-expanded') === 'false'){
            $(window).on('load', () => {
                $anchorTab.click();
            });
        }

        $wrapper.trigger('accordin-initialized');
    }

    $.fn.makeAccordion = function makeAccordion() {
        return this.each((index, wrapper) => {
            makeTabPanel(wrapper);
        });
    };

    // initialize default accordions and tabs
    $(() => {
        $('[data-function*="accordion"]').makeAccordion();
    });
}(jQuery.noConflict());