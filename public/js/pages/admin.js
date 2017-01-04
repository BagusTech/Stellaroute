/* global jQuery, duck */

void function initAdminControls($, duck) {
	'use strict';

	void function initClearCache() {
		const $clearCache = $('#ClearCache');
		const tablesToClear = [ 'Attractions',
								'Cities',
								'CityRegions',
								'Continents',
								'Countries',
								'CountryRegions',
								'Guides',
								'Neighborhoods',
								'ProvinceRegions',
								'Provinces',
								'Users',
								'WorldRegions',
							];

		function clearCache(table) {
			duck(table).clearCache(() => {
				if(tablesToClear.length) {
					clearCache(tablesToClear.shift())
				} else {
					$clearCache.prop('disabled', false).text('Clear Cache');
				}
			});
		}

		$clearCache.click(() => {
			clearCache(tablesToClear.shift());

			$clearCache.prop('disabled', true).text('Clearing, Please Wait').append('<i class="fa fa-spinner fa-spin ml-Xs"></i>');
		});
	}();

	void function initUpdateUser() {
		const $users = $('#UserList li');

		$users.each((i, user) => {
			const $user = $(user);
			const $submit = $user.find('[duck-button]');
			const $submitSpinner = $submit.find('i');
			const $reset = $user.find('.js-password-reset');
			const userEmail = $user.find('.js-user-email').text();

			$submit.click(() => {$submitSpinner.toggleClass('hidden')});

			$user.find('[duck-function="update"]').duckForm({
				table: 'Users',
				key: 'Id',
				successCallback: () => {
					$submit.prop('disabled', false);
					$submitSpinner.toggleClass('hidden');
				},
			});

			$reset.click(duck.sendResetEmail(userEmail));
		})
	}();
}(jQuery.noConflict(), duck);