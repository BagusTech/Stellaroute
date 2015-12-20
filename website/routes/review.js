var express = require('express'),
	router = express.Router();

// Pages
router.get('/submitted', function(req, res, next){
	var db = req.db,
		params = {TableName : 'ReviewForm'};

	db.scan(params, function(err, data){
		if (err){
			console.log('Error: '+ err)

			res.render('submitted', {
				title: 'Submitted Reviews - Qandira',
				description: 'Wire a review to be used in Qandira\'s latest project. These reviews will be used to help users all over the world get a better sense of what places they may want to go to based on what people with similar preferences think.',
				data: []
			});
		} else {
			res.render('submitted', {
				title: 'Submitted Reviews - Qandira',
				description: 'Wire a review to be used in Qandira\'s latest project. These reviews will be used to help users all over the world get a better sense of what places they may want to go to based on what people with similar preferences think.',
				data: data.Items
			});

		}
	})
});

// REST calls
router.get('/submitted-reviews', function(req, res, next){
	var db = req.db,
		params = {
			TableName: 'ReviewForm',
		}

	db.scan(params, function(err, data){
		res.json(data.Items);
	})
});

router.post('/submit-review', function(req, res){
	var db = req.db,
		item = req.body,
		params = {
			TableName: 'ReviewForm',
			Item: {
				'Id': item.Id,
				'name': item.name,
				'rating': item.rating,
				'type': item.type,
				'address': item.address,
				'comments': item.comments,
				'stay': {
					'length': item.stay.length,
					'unit': item.stay.unit
				},
				'cost': {
					'amount': item.cost.amount,
					'currency': item.cost.currency,
					'unit': item.cost.unit
				},
				'interest': {
					'adventure': item.interest.adventure,
					'culture': item.interest.culture,
					'family': item.interest.family,
					'nightlife': item.interest.nightlife,
					'architecture': item.interest.architecture,
					'history': item.interest.history,
					'food': item.interest.food,
					'scenery': item.interest.scenery,
					'museums': item.interest.museums,
					'outdoors': item.interest.outdoors,
					'exotics': item.interest.exotics,
					'music': item.interest.music,
					'nature': item.interest.nature,
					'sports': item.interest.sports
				}
			}
		}

	db.put(params, function(err, data) {
		res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
	});
});

router.delete('/delete-review/:id', function(req, res){
	var db = req.db,
		params = {
			TableName: 'ReviewForm',
			Key: {
				'Id': req.params.id
			}
		}

	db.delete(params, function(err, data){
		res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
	})
});

router.put('/update-review', function(req, res){
	var db = req.db,
		params = {
			TableName: 'ReviewForm',
			Key: {
				'Id': req.body.Id
			},

			UpdateExpression: 'set Country = :c, Thoughts = :t',
			ExpressionAttributeValues: {
				':c': req.body.Country,
				':t': req.body.Thoughts
			},
		}

	db.update(params, function(err, data){
		res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
	})
});

module.exports = router;