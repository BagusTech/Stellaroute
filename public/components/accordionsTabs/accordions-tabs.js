/*global jQuery */
void function initializeAccordionsTabs($) {
    'use strict';

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

            const tabTitle = $element.text();
            const originalTabId = createValidAttributeFromTitle(tabTitle);
            let tabId = `#${originalTabId}`;
            let index = 0;

            while ($(tabId).length) {
                tabId = `#${originalTabId}${++index}`;
            }

            $element.attr('id', tabId.substring(1));
        });
    }

    function toggleTab(tabToToggle, animate, animationSpeed, snapTopTo, topOffset) {
        const $tabToToggle = $(tabToToggle);
        const tabState = $tabToToggle.attr('aria-expanded') === 'true';

        $tabToToggle.attr('aria-expanded', !tabState)
            .next('[role="tabpanel"]') // find the tabpanel that it is associated with
            .attr('aria-hidden', tabState)
            .slideToggle(animate ? animationSpeed : 0);

        if (snapTopTo && animate){
            const intervalSpeed = 30;
            let currentIteration = 0;

            const animateScroll = setInterval(() => {
                if (currentIteration > ((animationSpeed/ intervalSpeed) + 1)){
                    const wrapperScroll = snapTopTo === 'body' ? 0 : $(snapTopTo).scrollTop();
                    const scrollTo = wrapperScroll + $tabToToggle.offset().top - topOffset;
                    clearInterval(animateScroll);
                    $(snapTopTo).animate({ scrollTop: `${scrollTo}px` });
                }

                currentIteration++;
            }, intervalSpeed);
        }
    }

    function makeTabPanel(wrapper, isTabs) {
        const $wrapper = $(wrapper);
        const $tabs = $('[role="tab"]', $wrapper);
        const pageAnchor = window.location.hash;

        const defaultBreakpoint = 1170;
        const breakpoint = parseInt($wrapper.attr('data-breakpoint'), 10) || defaultBreakpoint;

        const defaultAnimationSpeed = 750;
        const animationSpeed = parseInt($wrapper.attr('data-animation-speed'), 10) || defaultAnimationSpeed;

        const alwaysShowOne = isTabs || $wrapper.attr('data-always-show-one') === 'true' ? true : false;

        const allowMultiple = $wrapper.attr('data-allow-multiple') === 'true' ? true : false;
        const snapToTop = $wrapper.attr('data-snap-to-top') === 'true' ? true : false;
        const snapTopTo = snapToTop
            ? ($wrapper.attr('data-snap-top-to')
                ? $wrapper.attr('data-snap-top-to') : 'body')
            : false;
        const topOffsetDefault = 30;
        const topOffset = $wrapper.attr('data-top-offset') ? $wrapper.attr('data-top-offset') : topOffsetDefault;

        checkOrSetTabId($tabs);

        $wrapper.removeClass('no-js');

        $wrapper.find('> [aria-hidden="false"]').css({'display': 'block' });
        $wrapper.find('> [aria-hidden="true"]').css({'display': 'none' });

        if (isTabs){
            const initialPanelHeight = $wrapper.find('[aria-hidden="false"]').height();

            $wrapper.css('margin-bottom', `${initialPanelHeight}px`);
        }

        $tabs.on('tab-change', function changeTab(e, isOnLoad) {
            e.stopPropagation();

            const $activeTab = $wrapper.find('> [aria-expanded="true"]');
            const $tab = $(this);
            const currentTabIsActiveTab = ($tab[0] === $activeTab[0]);
            const animate = !(isTabs && $(window).innerWidth() > breakpoint);
            const currentId = $tab.attr('id');

            if (alwaysShowOne && currentTabIsActiveTab){
                // trigger tab-changed event, but pass false because nothing changed
                $tab.trigger('tab-changed', [ false ]);

                return;
            } else if (!currentTabIsActiveTab && $activeTab.length > 0 && !allowMultiple){
                toggleTab($activeTab, animate, animationSpeed);
            }

            toggleTab($tab, animate, animationSpeed, snapTopTo, topOffset);

            if (!animate){
                const panelHeight = $tab.next('[role="tabpanel"]').height();

                $wrapper.css('margin-bottom', `${panelHeight}px`);
            }

            // set hash but don't move the page
            if (!isOnLoad) {
                $tab.attr('id', '');
                window.location.hash = currentId;
                $tab.attr('id', currentId);
            }

            // trigger tab-changed event when done
            $tab.trigger('tab-changed', [ true ]);
        });

        $tabs.click(function clickTab(e) {
            e.preventDefault();
            e.stopPropagation();

            $(this).trigger('tab-change');
        });

        if (!pageAnchor) {
            return;
        }

        const $anchorTab = $tabs.filter(pageAnchor);
        $anchorTab.trigger('tab-change', [ true ]);
    }

    $.fn.makeAccordion = function makeAccordion() {
        return this.each((index, wrapper) => {
            const $wrapper = $(wrapper);

            makeTabPanel($wrapper);

            $wrapper.trigger('accordion-initialized');
        });
    };

    $.fn.makeTabs = function makeTabs() {
        return this.each((index, wrapper) => {
            const $wrapper = $(wrapper);

            makeTabPanel($wrapper, true);

            $wrapper.trigger('tabs-initialized');
        });
    };

    jQuery(() => {
        $('[data-function="accordion"]').makeAccordion();
        $('[data-function="tabs"]').makeTabs();
    });
}(jQuery);
