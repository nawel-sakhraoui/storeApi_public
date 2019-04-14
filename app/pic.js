module.exports = function ( app, elasticsearch, elasticurl, jwt, cryptoJS, fs){ 


app.get('/api/stores/:store/banner', function(req, res) {  
	

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;

		
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	
	 var readStream = fs.createReadStream(__dirname+'/../images/banner/'+req.params.store);

	 var body = '';
	  readStream.on('data', function (chunk) {
	     body+= chunk ;
	     
	  })
	  .on('end', function () { 
		    res.status(200).send({"banner":body});
	  })
	  
	  .on('error', function(err) {
	    res.status(500).send(err);
	  });
	
	});
	}else {
				
				return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
		

		
	
});
	 

//add banner 
app.put ('/api/stores/:idstore/banner', function(req, res, next){
	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	
		
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		    if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	
		const wstream = fs.createWriteStream(__dirname+'/../images/banner/'+req.params.idstore);

    	wstream.write(req.body.banner);
    	 wstream.end();
    	 res.status(200).send({'ok':"done"});
    	 wstream.on('error', function(err) {
    		    res.status(500).end(err);
    		  });
    
		    });
	}else {
				
				return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
	
});


app.get('/api/articles/:article/pic', function(req, res) { 
	
	  
		 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
		 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
		
			
		if (token) {
			    jwt.verify(token, "secret", function(err, decoded) {
			        if (err) {
			          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        }
		
		 var readStream = fs.createReadStream(__dirname+'/../images/pic/'+req.params.article);

		 var body = '';
		 readStream.on('data', function (chunk) {
			 body+= chunk ;
		     
		  })
		  .on('end', function () {  
			    res.status(200).send({"pic":body});
		  })
		  
		  .on('error', function(err) {
		    res.status(500).send(err);
		  });
		
		});
		}else {
					
			return res.status(403).send({
				        "error": true,
				        "message": 'No token provided.'
				        	});
			};
			

	  
	
});

app.put('/api/articles/:article/pic', function(req, res) {  
	

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	
		
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		    if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	
		const wstream = fs.createWriteStream(__dirname+'/../images/pic/'+req.params.article);
   	    wstream.write(req.body.pic);
   	    wstream.end();
   	    res.status(200).send({'ok':"done"});
   	    wstream.on('error', function(err) {
   		    res.status(500).end(err);
   		  });   	  
   	 
		});
	}else {
				
				return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
	

	
});

app.put('/api/articles/:article/gallery', function(req, res) { 
	

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		    if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	
		const wstream = fs.createWriteStream(__dirname+'/../images/gallery/'+req.params.article);
		
		req.body.gallery.forEach(function(v) { wstream.write(v+"\n"); });

  	    //wstream.write(req.body.gallery);
  	    wstream.end();
  	    res.status(200).send({'ok':"done"});
  	    wstream.on('error', function(err) {
  		    res.status(500).end(err);
  		  });
  	  
  	    
  	 
		});
	}else {
				
				return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
	

	
});


app.get('/api/articles/:article/gallery', function(req, res) {  

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;

		
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	body = [] ; 
	 var lineReader = require('readline').createInterface({
		        	  input:fs.createReadStream(__dirname+'/../images/gallery/'+req.params.article)
	});

	lineReader.on('line', function (line) {
		        	 // console.log('Line from file:', line);
		        		body.push(line);
	});	   
	
	
	lineReader.on('close', function () {  // done
		  
		    res.status(200).send({"gallery":body});
	  })
	  
	  // This catches any errors that happen while creating the readable stream (usually invalid names)
	  lineReader.on('error', function(err) {
		  console.log(error);
	    res.status(500).send(err);
	  });
	
	});
	}else {
				
		return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
		

 
	
});


app.get('/api/users/:user/avatar', function(req, res) {  
	

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	
		
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	
	 var readStream = fs.createReadStream(__dirname+'/../images/users/'+req.params.user);

	 var body = '';
	  readStream.on('data', function (chunk) {
	     body+= chunk ;
	     
	  })
	  .on('end', function () {  
		    res.status(200).send({"avatar":body});
	  })
	  
	  .on('error', function(err) {
	    res.status(500).send(err);
	  });
	
	});
	}else {
				
				return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
		

		
	
});
	 
app.put ('/api/users/:user/avatar', function(req, res, next){
	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;

		
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		    if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	
		const wstream = fs.createWriteStream(__dirname+'/../images/users/'+req.params.user);
    	wstream.write(req.body.avatar);
    	 wstream.end();
    	 res.status(200).send({'ok':"done"});
    	 wstream.on('error', function(err) {
    		    res.status(500).end(err);
    		  });
    
		    });
	}else {
				
				return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
	
});



}