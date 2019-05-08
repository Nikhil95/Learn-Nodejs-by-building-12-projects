var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var fbRef = new Firebase('https://albumz01.firebaseio.com/');
var multer = require('multer');
var upload = multer({dest:'./public/images/uploads'});

router.get('/', function(req, res, next) {
  	res.render('albums/index');
});

router.get('/add', function(req, res, next) {
	var genreRef = fbRef.child('genres');

	genreRef.once('value', function(snapshot){
		var data = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			data.push({
				id: key,
				name: childData.name
			});
		});
		res.render('albums/add',{genres: data});
	});

});

router.post('/add', upload.single('cover'),function(req, res, next) {
	// Check File Upload
	if(req.file){
	  	console.log('Uploading File...');
	  	var cover = req.file.filename;
	} else {
	  	console.log('No File Uploaded...');
	  	var cover = 'noimage.jpg';
	}

	// Build Album Object
	var album = {
		artist: req.body.artist,
		title: req.body.title,
		genre: req.body.genre,
		info: req.body.info,
		year: req.body.year,
		label: req.body.label,
		tracks: req.body.tracks,
		cover: cover,
	}

	// Create Reference
	var albumRef = fbRef.child("albums");

	// Push Album
  	albumRef.push().set(album);

  	req.flash('success_msg', 'Album Saved');
  	res.redirect('/albums');
});

module.exports = router;
