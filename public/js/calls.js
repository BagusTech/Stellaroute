/* $(document).ready(function(){
	$('.delete-button').click(deleteReview);
	$('.update-button').click(updateMode);
	$('.cancel-update-button').click(updateMode);

	$('#SubmitReview').on('click', submitReview);
});

var updateMode = function(e){
	e.preventDefault();

	var row = $(this).parent().parent(),
		updateButton = row.find('.update-button'),
		deleteButton = row.find('.delete-button'),
		country = row.find('.country'),
		thoughts = row.find('.thoughts');

	console.log(updateButton);

	row.toggleClass('update-mode');

	deleteButton.unbind();
	updateButton.unbind();

	updateButton.toggleClass('btn-info');
	updateButton.toggleClass('btn-success');

	$('.update').click(updateReview);

	var currentCountry,
		currentThoughts;

	if (row.hasClass('update-mode')){
		deleteButton.click(updateMode);
		updateButton.click(updateReview);

		currentCountry = country.text();
		currentThoughts = thoughts.text();


		country.html('<input class="form-control" id="UpdateCountry" value="'+ currentCountry +'"/>');
		
		thoughts.html('<textarea class="form-control" id="UpdateThoughts" />');
		$('#UpdateThoughts').val(currentThoughts);

		deleteButton.text('Cancel');
	} else {
		deleteButton.click(deleteReview);
		updateButton.click(updateMode);

		currentCountry = $('#UpdateCountry').val();
		currentThoughts = $('#UpdateThoughts').val();

		country.text(currentCountry);
		thoughts.text(currentThoughts);
	}
};

function showSubmittedReviews(){
	var reviews = '';

	$.getJSON('/review/submitted-reviews', function(data){
		$.each(data, function(){
			reviews += '<div class="col-sm-6 col-xs-12"><div class="profile">';
				reviews += '<h2 class="bw-0 bbw-Sm bc-G bs-S mb-0">' + this.name + '<small class="d-Ib pb-Xs">'+ this.rating +'</small></h2>';
				reviews += '<small class="mb-Sm mt-Xs d-B">' + this.address + '</small>';
				
				reviews += '<div class="row">';
					reviews += '<section class="col-xs-12">';
						reviews += '<h3 class="m-0">Comments</h3>';
						reviews += '<p class="mt-Xs">' + this.comments + '</p>';
					reviews += '</section>';
					reviews += '<section>';
						reviews += '<div class="col-xs-6">';
							reviews += '<h3 class="m-0">Cost</h3>';
							reviews += this.cost.amount + ' ' + this.cost.currency + 'per/' + this.cost.unit;
						reviews += '</div>';
						reviews += '<div class="col-xs-6">';
							reviews += '<h3 class="m-0">Length of Stay</h3>';
							reviews += this.stay.length + ' ' + this.stay.unit;
						reviews += '</div>';
					reviews += '</section>';
				reviews += '</div>';

				reviews += '<h4 class="c-B bw-0 bs-S btw-Sm bc-G pt-Sm">Reviewer\'s Interests</h4>';
				reviews += '<div class="row checkbox">';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="adventure" type="checkbox" value="adventure" checked="' + this.interest.adventure + '" disabled />Adventure</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="culture" type="checkbox" value="culture" checked="' + this.interest.culture + '" disabled />Culture</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="family" type="checkbox" value="family" checked="' + this.interest.family + '" disabled />Family</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="nightlife" type="checkbox" value="nightlife" checked="' + this.interest.nightlife + '" disabled />Nightlife</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="architecture" type="checkbox" value="architecture" checked="' + this.interest.architecture + '" disabled />Architecture</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="history" type="checkbox" value="history" checked="' + this.interest.history + '" disabled />History</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="food" type="checkbox" value="food" checked="' + this.interest.food + '" disabled />Food</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="scenery" type="checkbox" value="scenery" checked="' + this.interest.scenery + '" disabled />Scenery</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="museums" type="checkbox" value="museums" checked="' + this.interest.museums + '" disabled />Museums</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="outdoors" type="checkbox" value="outdoors" checked="' + this.interest.outdoors + '" disabled />Outdoors</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="exotics" type="checkbox" value="exotics" checked="' + this.interest.exotics + '" disabled />Exotics</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="music" type="checkbox" value="music" checked="' + this.interest.music + '" disabled />Music</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="nature" type="checkbox" value="nature" checked="' + this.interest.nature + '" disabled />Nature</label>';
					reviews += '<label class="col-sm-3 col-xs-6"><input class="sports" type="checkbox" value="sports" checked="' + this.interest.sports + '" disabled />Sports</label>';
				reviews += '</div>';

				reviews += '<div class="c-B ta-R">';
					reviews += '<button class="btn btn-info update-button mr-Sm" value="' + this.Id + '">Update</button>';
					reviews += '<button class="btn btn-danger delete-button" value="' + this.Id + '">Delete</button>';
				reviews += '</div>';
			reviews += '</div></div>';
		});

		$('#SubmittedReviews').html(reviews);

	}).done(function(){
		$('.delete-button').click(deleteReview);
		$('.update-button').click(updateMode);
		$('.cancel-update-button').click(updateMode);
	});
}

function submitReview(e){
	e.preventDefault();

	// Create a guid
	function makeGuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	}
	
	var guid = makeGuid();

	// Super basic validation - increase errorCount if any fields are blank
	var errorCount = 0;
	$('#Review input').each(function(){
		if($(this).val() === ''){
			errorCount++;
		}
	});
	$('#Review textarea').each(function(){
		if($(this).val() === ''){
			errorCount++;
		}
	});

	if(errorCount === 0){
		
		// Create the Object that will be added into the table
		var Review = {
			'Id': guid,
			'name': $('#Name').val(),
			'rating': $('#Rating').val(),
			'type': $('#Type').val(),
			'address': $('#Address').val(),
			'comments': $('#Comments').val(),
			'stay': {
				'length': $('#Time').val(),
				'unit': $('[name=time]:checked').val()
			},
			'cost': {
				'amount': $('#Amount').val(),
				'currency': $('#Currency').val(),
				'unit': $('#MoneyUnit').val()
			},
			'interest': {
				'adventure': $('#Adventure').prop('checked'),
				'culture': $('#Culture').prop('checked'),
				'family': $('#Family').prop('checked'),
				'nightlife': $('#Nightlife').prop('checked'),
				'architecture': $('#Architecture').prop('checked'),
				'history': $('#History').prop('checked'),
				'food': $('#Food').prop('checked'),
				'scenery': $('#Scenery').prop('checked'),
				'museums': $('#Museums').prop('checked'),
				'outdoors': $('#Outdoors').prop('checked'),
				'exotics': $('#Exotics').prop('checked'),
				'music': $('#Music').prop('checked'),
				'nature': $('#Nature').prop('checked'),
				'sports': $('#Sports').prop('checked')
			}
		};

		$.ajax({
			type: 'POST',
			data: JSON.stringify(Review),
			url: '/review/submit-review',
			contentType: "application/json"
		}).done(function(response){
			console.log('done!');

			// Check if the response message matches our success message in defined review.js
			if(response.msg === ''){
				// Reset the form
				$('#Review input[type=text]').val('');
				$('#Review input[type=number]').val('');
				$('input[type=checkbox]').prop('checked', false);
				$('#Review textarea').val('');

				// Update the table
				//showSubmittedReviews();
			} else {

				// If something goes wrong, alert the error message
				alert('Error: ' + response.msg);
			}
		}).fail(function(err){
			console.log(err);
		});
	} else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
}

function deleteReview(e){
	e.preventDefault();

	var confirmation = confirm('Are you sure you would like to delete this review?');

	if (confirmation === true){
		$.ajax({
			type: 'DELETE',
			url: '/review/delete-review/' + $(this).val() 
		}).done(function(response){
			if(response.msg === ''){
				showSubmittedReviews();
			} else {
				console.log('Error: ' + response.msg);
			}
		});
	} else {
		// User did not confirm
		return false;
	}
}

function updateReview(e){
	e.preventDefault();

	//create data object
	var updatedReview = {
		'Id': $(this).val(),
		'Country': $('#UpdateCountry').val(),
		'Thoughts': $('#UpdateThoughts').val()
	};

	$.ajax({
		type: 'PUT',
		data: updatedReview,
		url: '/review/update-review',
		dataType: 'JSON'
	}).done(function(response){
		if (response.msg === ''){
			showSubmittedReviews();
		} else {
			console.log('Error: ' + response.msg);
			alert('Failed to update, see console for error');
			showSubmittedReviews();
		}
	});
} */