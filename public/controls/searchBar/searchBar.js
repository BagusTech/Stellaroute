/* global jQuery */

void function _initSearchBar($){
	'use strict';
	
	function search(e, _term) {
		e.stopPropagation();

		const $input = e.data.input;
		const $icon = e.data.icon;
		const $resultsWrapper = e.data.resultsWrapper;
		const $results = e.data.results;
		const $backdrop = e.data.backdrop;
		const $zIndex = e.data.zIndex;
		const term = _term || $input.val();

		if($icon.hasClass('fa-search')) {
			$icon.toggleClass('fa-search fa-spin fa-spinner');
		}

		if(!term || !term.trim() || term.trim().length < 3) {
			
			$results.html('')
					.append('<p>Sorry, you must have at least 3 letters before searching</p>');
			$resultsWrapper.removeClass('hidden')
			$icon.toggleClass('fa-search fa-spin fa-spinner');

			return;
		}

		$.ajax({
			type: 'POST',
			url: '/search',
			contentType: 'application/json',
			data: JSON.stringify({term}),
			success: (guides) => {
				$backdrop.removeClass('hidden');
				$zIndex.css('z-index', 1042);
				$results.html('');
				$resultsWrapper.removeClass('hidden');

				if(!guides || !guides.length) {
					$results.append('<p class="p-Xs m-0">No results</p>');
				} else {
					guides.forEach((guide, i) => {
						const $html = $(`
							${i === 0 ? `<span class='f-L p-Xs'>${guides.length} results</span>` : ''}
							<a class='search-results--result' href='/${guide.author}/${guide.url}'>
								<div class='w-25 f-L'>
									<img class='w-100' src='https://s3-us-west-2.amazonaws.com/stellaroute/${guide.cardImage.replace('.jpg', '-thumb1.jpg').replace('.jpeg', '-thumb1.jpeg')}' />
								</div>
								<div class='w-75 f-L plr-Sm pb-Sm ta-L fc-B'>
									<h2 class='mt-Sm'>${guide.names.display}</h2>
									<p class='fc-G__Dk lh-1 hidden-xs'>${guide.tagline || 'No Tagline Provided'}</p>
									<div class='js-countries fs-Sm'></div>
									<div class='js-tags fs-Sm hidden mt-Xs'></div>
								</div>
							</a>
						`);

						if(guide.countriesDisplay) {
							const $countries = $html.find('.js-countries');
							guide.countriesDisplay.forEach((country) => {
								$countries.append(`<span class='fc-W bg-Gr p-XXs d-Ib'>${country}</span>`);
							})
						}

						if(guide.tags) {
							const $tags = $html.find('.js-tags');
							$tags.removeClass('hidden');
							guide.tags.forEach((tag) => {
								$tags.append(`<span class='bw-Sm bs-S bc-G p-XXs d-Ib'>${tag}</span>`);
							})
						}

						$results.append($html);
					});
				}
				$icon.toggleClass('fa-search fa-spin fa-spinner');
			},
			err: (err) => {
				throw err;
			},
		});
	}

	function closeSearch(e) {
		e.stopPropagation();

		e.data.resultsWrapper.addClass('hidden');
		e.data.backdrop.addClass('hidden');
		e.data.zIndex.css('z-index', 'auto');
	}


	function startSearch(e) {
		e.stopPropagation();

		const $wrapper = e.data.wrapper;
		const $icon = e.data.icon;
		const $input = e.data.input;

		if($icon.hasClass('fa-search') && $input.val()) {
			$icon.toggleClass('fa-search fa-spin fa-spinner');
		}

		clearTimeout(e.data.timeout);

		e.data.timeout = setTimeout(() => {
			$wrapper.trigger('duck.search', [$input.val()]);
		}, 1000)
	}

	function goToSearchPage(e) {
		e.stopPropagation();
		e.preventDefault();

		window.location.href = `/search?term=${e.data.input.val()}`
	}

	function initSearchBar(wrapper) {
		const $wrapper = $(wrapper);
		const $icon = $wrapper.find('.js-search-icon');
		const $input = $wrapper.find('.js-search-input');
		const $button = $wrapper.find('.js-search-button');
		const $resultsWrapper = $wrapper.find('.js-search-results-wrapper');
		const $results = $wrapper.find('.js-search-results');
		const $close = $wrapper.find('.js-close-search');
		const $backdrop = $wrapper.find('.js-seach-backdrop');
		const $zIndex = $('.js-search-bar-z-index');
		let timeout;
		
		$input.off('input', startSearch).on('input', {wrapper: $wrapper, icon: $icon, input: $input, timeout}, startSearch);
		$wrapper.off('duck.search', search).on('duck.search', {input: $input, icon: $icon, resultsWrapper: $resultsWrapper, results: $results, backdrop: $backdrop, zIndex: $zIndex}, search);
		$close.off('click', closeSearch).on('click', {resultsWrapper: $resultsWrapper, backdrop: $backdrop, input: $input, zIndex: $zIndex}, closeSearch);
		$wrapper.off('submit', goToSearchPage).on('submit', {input: $input}, goToSearchPage);
		$button.off('click', goToSearchPage).on('click', {input: $input}, goToSearchPage);
	}

	$.fn.searchBar = function init() {
		return this.each((index, wrapper) => initSearchBar(wrapper));
	}

	$(() => {$('.js-search-bar').searchBar()});
}(jQuery.noConflict())