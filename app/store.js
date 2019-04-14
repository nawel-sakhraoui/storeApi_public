
module.exports = function ( app,io, elasticsearch, elasticurl, jwt, cryptoJS){ 

var fs = require('fs');

var publicUser = "admin", 
publicPwd  ="admin", 
registredUser ="admin",
registredPwd= "admin"; 


//new  store	
app.post('/api/stores', function(req, res) {
	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).json({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		        
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		        var id = req.body.title  ; 
		    	req.body.userid = userid ; 
		    	req.body.ratingcount = 0  ; 
		    	req.body.ratingsum = 0 ; 
		    	req.body.notificationcount = 0 ; 
		    	req.body.notification = []; 
		    	req.body.suspend = false ; 
		    	req.body.admins = []; 
				req.body['created']= new Date().getTime();  

		    	//delete  req.body['title']; 

		        elastic.index({
		    	  	  index:"store", 
		    	  	  type: "store",
		    	  	  id : id ,
		    	  	  body :req.body,
		    	  	  
		    	 }, function (error, response) {
		    	    	
		    	    	 if (error ){
		    	    		 res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
			     }); });
		    
		}else {
			
			res.status(403).json({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};
	
});



//get by store title  
app.get('/api/stores/stores/:idstore',  function(req, res) {
	
	var storename  = req.params.idstore; 
     const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).json({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		      
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token',"store"]
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 
			    	//  if (!resp.store.includes(storename))
					      
				     //     res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
   
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		        elastic.getSource({
		      	  index:"store", 
		      	  type: "store",
		      	  id : storename,
		      
		        }, function (error,response) {
		        	
		        	
		        	if (error){
		        		res.status(500).json(error);
		        		
		        	}else {
		        		res.status(200).json(response);
		        		
		        	}
		        			
		        });
		   });
		    });
	}else {
			
		 res.status(403).json({
		        "error": true,
		        "message": 'No token provided.'
		        	});
	};
	
});		



//get by creator  
app.get('/api/stores/:user',  function(req, res) {


	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).json({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
	
		        var user  = req.params.user; 
		         elastic.search({
		        	index:"store",
  	  				type: "store",
  	  
  	  			body:{
  	  			    "stored_fields" : ['open'],
  	  			    
  	  				'query' : { 
  	  					
  	  						'term' : { "userid" : user }
  	  					
  	  				}
  	  			}
  	  
  	    }, function (error,response) {
  	    	
    	   if (error){
    	   	res.status(500).send(error);
      	   }else {
    		
    		 res.status(200).send( response.hits.hits)
    			
    	  }
    			
      });

	});
		    });
		    
	}else {
			
		res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
	};
});		



app.get('/api/categories', function(req, res){

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).json({"error": true, "message": 'Unauthorized access.' });
		           
		        }
	
	 var readStream = fs.createReadStream(__dirname+'/../files/storesCategories.csv');
	
	 var body = '';
	  // This will wait until we know the readable stream is actually valid before piping
	  readStream.on('data', function (chunk) {
	    // This just pipes the read stream to the response object (which goes to the client)
	     body+= chunk ;
	     
	  })
	  .on('end', function () {  // done
		;
		    res.status(200).json({"categories":body.split('\n')});

	  })
	  
	  // This catches any errors that happen while creating the readable stream (usually invalid names)
	  .on('error', function(err) {
	    res.status(500).json(err);
	  });
	
	});
	}else {
				
				res.status(403).json({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
		

});



app.put('/api/stores/stores/:storeid/rating', function(req, res) {
	

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		      
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		    	elastic.update({
		    	  	  index:"store", 
		    	  	  type: "store",
		    	  	  id : req.params.storeid,
		    	  	  
		    	  	  body: {
			    			
		    			  script: {
		    			      lang: 'painless',
		    			       source: "ctx._source.ratingsum+=params.rating.value;" 
			    			    +"ctx._source.ratingcount+=1;",
		    			       params: { 'rating': req.body}
		    			  },
		    			  upsert: {
		    				  
		    				
		    			  	  ratingsum : req.body.value,  
		    			  	  ratingcount: 1
		    			  }
		    				    
		    		  }  
		    	}
		    	
		    	, function (error, response) {
		    	    	 if (error ){
		    	    		res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    });
		 });
		    });
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};
});




 	
app.get('/api/stores/stores/:storeid/rating', function(req, res) {
	
	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		    	elastic.getSource({
		    		
		    		  index: 'store',
		    		  type: 'store',
		    		  id: req.params.storeid,
		    		 _source: ['ratingcount','ratingsum']
		    	} 
		    	, function (error, response) {
		    		
		    	    	 if (error ){
		    	    		 res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		    });
		    });
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};
});



app.put('/api/stores/stores/:storeid/notification', function(req, res) {
	
	const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		       
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		    	elastic.update({
		    		  index: 'store',
		    		  type: 'store',
		    		  id: req.params.storeid, 
		    	  	  
		    	  	  body: {
		    	  		  lang: 'painless',
	    				  script: {
		    			      lang: 'painless',
		    			      source: "ctx._source.notificationcount += 1;"
		    			       		 +"ctx._source.notification.add(params.notification);",
		    			       
		    			       		 params: { 'notification': req.body}
		    			  },
		    			  upsert: {
		    				  notificationcount :1 , 
		    				  notification: [req.body], 
		    			  }
		    				    
		    		  },
		    	  	  
		    	    }, function (error, response) {
		    	    	
		    	    	 if (error ){
		    	    		 res.status(500).json(error);
		    	    	 }else{
		    	    		  
		    	    		 io.emit('store_step'+req.params.storeid, JSON.stringify(req.body));
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		    });
		    });
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
	};
	

});


app.put('/api/stores/stores/:storeid/notification/remove', function(req, res) {
	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token', 'store']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 if (!resp.store.includes(req.params.storeid))
			    		 res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		        console.log(req.body);   
		        
		    	if (req.body.value.localeCompare("message")!=0){
		    		
		        	
		        	elastic.update({
		    		  index: 'store',
		    		  type: 'store',
		    		  id: req.params.storeid, 
		    	  	  
		    	  	  body: {
		    	  		  
	    				  script: {
	    				      lang: 'painless',
		    			      source: "for(int i=0 ; i<  ctx._source.notification.length; i++){" +
		    			      		    "if (ctx._source.notification[i].commandid == params.notif.commandid " +
		    			      		    "&& ctx._source.notification[i].value != params.message " +
		    			      		    "){" +
			    			      		"ctx._source.notification.remove(i); " +

		    			      		        "ctx._source.notificationcount -= 1;" +
		    			      		        "i=0"+
		    			      		      "}" +
		    			      		    "}",
		    			       params: { 'notif': req.body,
		    			    	   			"message":'message',
		    			    	   		}
		    			     
		    			  },		    
		    		  },
		    	  	  
		    	    }, function (error, response) {
		    	    	
		    	    	 if (error ){
		    	    		 res.status(500).json(error);
		    	    	 }else{
		    	    		 io.emit('store_step_remove'+req.params.storeid, JSON.stringify(req.body));

		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		        
		    	}else{
		    		
		    		elastic.update({
			    		  index: 'store',
			    		  type: 'store',
			    		  id: req.params.storeid, 
			    	  	  
			    	  	  body: {
			    	  		  lang: 'painless',
		    				  script: {
		    				      lang: 'painless',
			    			      
			    			      source: "for(int i=0 ; i<  ctx._source.notification.length; i++){" +
	    			      		    "if (ctx._source.notification[i].commandid == params.notif.commandid " +
	    			      		    "&& ctx._source.notification[i].value == params.notif.value " +
	    			      		    " ){" +
		    			      		"ctx._source.notification.remove(i); " +

	    			      		        "ctx._source.notificationcount -= 1;" +
	    			      		        "i=0;"+
	    			      		      "}" +
	    			      		    "}",
			    			       params: { 'notif': req.body}
			    			     
			    			  },
			    			 
			    				    
			    		  },
			    	  	  
			    	    }, function (error, response) {
			    	    	
			    	    	 if (error ){
			    	    		 res.status(500).json(error);
			    	    	 }else{
			    	    		 io.emit('store_step_remove'+req.params.storeid, JSON.stringify(req.body));

			    	    		 res.status(200).json(response); 
			    	    	 }
			    	    			
			    	    });
		    	}

		 });
		    });  
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		   });
	};
	
});

app.get('/api/stores/stores/:storeid/notification', function(req, res) {
	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		       
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token', 'store']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 if (!resp.store.includes(req.params.storeid))
			    		 res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		        
		        
		        elastic.getSource({
		    		  index: 'store',
		    		  type: 'store',
		    		  id: req.params.storeid, 
		    	  	  _source : ["notification","notificationcount"],

		    	  	  
		    	    }, function (error, response) {
		    	    	
		    	    	 if (error ){
		    	    		res.status(500).json(error);
		    	    	 }else{
		    	    		
		    	    		 	try {
		    	    		 	     res.status(200).json(response); 
		    	    		 	}catch (error ){
		    	    		 		 res.status(200).json(response); 	
		    	    		 	}
		    	    	 }
		    	    			
		    	    });


		    });
		    });
	}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
	};

});



app.put('/api/stores/stores/:storeid/categories', function(req, res) {
	

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		        
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token', 'store']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 if (!resp.store.includes(req.params.storeid))
			    		 res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		    	elastic.update({
		    	  	  index:"store", 
		    	  	  type: "store",
		    	  	  id : req.params.storeid,
		    	  	  
		    	  	  body: {
			    			
		    			  script: {
		    			      lang: 'painless',
		    			      //source: 'ctx._source.cart.add(params.articleid)',
		    			       source: "ctx._source.selectedCat=params.selectedCat", 
			    			   
		    			       params: { 'selectedCat': req.body.selectedCat}
		    			  },
		    			  upsert: {
		    			  	 'selectedCat': req.body
		    			  }
		    				    
		    		  }  
		    	}
		    	
		    	, function (error, response) {
		    	    	 if (error ){
		    	    		res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		      });
		    });
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};	
});



app.put('/api/stores/stores/:storeid/description', function(req, res) {
	

	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		        
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token', 'store']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 if (!resp.store.includes(req.params.storeid))
			    		 res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		    	elastic.update({
		    	  	  index:"store", 
		    	  	  type: "store",
		    	  	  id : req.params.storeid,
		    	  	  
		    	  	  body: {
			    			
		    			  script: {
		    			      lang: 'painless',
		    			      //source: 'ctx._source.cart.add(params.articleid)',
		    			       source: "ctx._source.description=params.description", 
			    			   
		    			       params: { 'description': req.body.description}
		    			  },
		    			   
		    		  }  
		    	}
		    	
		    	, function (error, response) {
		    	    	 if (error ){
		    	    		res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		});
		    });
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};
	
});




app.put('/api/stores/stores/:storeid/admins', function(req, res) {
	
	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		      
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token', 'store']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 if (!resp.store.includes(req.params.storeid))
			    		 res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		        
		        
		    	elastic.update({
		    	  	  index:"store", 
		    	  	  type: "store",
		    	  	  id : req.params.storeid,
		    	  	  
		    	  	  body: {
			    			
		    			  script: {
		    			      lang: 'painless',
		    			      //source: 'ctx._source.cart.add(params.articleid)',
		    			       source: "ctx._source.admins =params.admins", 
			    			   
		    			       params: { 'admins': req.body.admins}
		    			  },
		    			   
		    		  }  
		    	}
		    	
		    	, function (error, response) {
		    		
		    	    	 if (error ){
		    	    		 res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		        
		        

		    });
		    });
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};
	
	
	
});


app.put('/api/stores/stores/:storeid/close', function(req, res) {

	
	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	
	 
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token', 'store']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 if (!resp.store.includes(req.params.storeid))
			    		 res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		        
		        
		    	elastic.update({
		    	  	  index:"store", 
		    	  	  type: "store",
		    	  	  id : req.params.storeid,
		    	  	  
		    	  	  body: {
			    			
		    			  script: {
		    			      lang: 'painless',
		    			      //source: 'ctx._source.cart.add(params.articleid)',
		    			       source: "ctx._source.open =params.open", 
			    			   
		    			       params: { 'open': req.body.open}
		    			  },
		    			   
		    		  }  
		    	}
		    	
		    	, function (error, response) {
		    		
		    	    	 if (error ){
		    	    		res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		    });
		    });
		}else {
			
			res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};
});



app.get('/api/stores/stores/:storeid/status', function(req, res) {
	
	const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
		           
		        }
		       
		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			    	 
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		         
		        
		        
		    	elastic.getSource({
		    	  	  index:"store", 
		    	  	  type: "store",
		    	  	  id : req.params.storeid,
		    	  	  _source: ["open"]
		    	}
		    	
		    	, function (error, response) {

		    	    	 if (error ){
		    	    		
		    	    		 res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	   });
		     });
		    });
		}else {
			
			
		 res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		        	});
		};

});


app.get('/api/stores/stores/search/:query',  function(req, res) {


	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).json({"error": true, "message": 'Unauthorized access.' });
		           
		        }

		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			     
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		        
		        var query  = req.params.query; 
		        elastic.search({
		        	index:"store",
		        	body: {
		        	    query: {
		        	    
		        	    	       /*  query_string : {
	        	                fields : ["description", "title.raw"],
	        	                query: query
	        	            }
	        	        */
	        	    	
	        	        bool : {
	        	           should :[
	        	        	         {match :{ "title" :query }}, 
	        	        	         {  multi_match : {
	        	        	        	 	query:    query, 
	        	        	        	 	fields: [ "categories", "description"] ,
	    	        	    	 
	        	        	         	},
	        	        	         }
	        	        	         ],
	        	            minimum_should_match: 1, 
	        	        	filter :{
	        					term: {
	        						'open':true , 
	        					}
	        				},
	        	        
	     
	        	  /*          "must" : {
	        	    	  multi_match : {
	        	    	      query:    query, 
	        	    	      fields: [ title, description] ,
	        	    	 
	        	    	    },
	        	   
	        				
	        	    	}*/
	        	    },
		        	    		
		        	    		
		        				
		        	    	
		        	    },
		        	}
  	  
  	    }, function (error,response) {
    	   if (error){
    	   	res.status(500).json(error);
      	   }else {
    		 res.status(200).json( response.hits.hits)
  	  	  }
    			
      });

	  });
		    });
	}else {
		 res.status(403).json({
		        "error": true,
		        "message": 'No token provided.'
		        	});
	};

});	

//store filter + order by + size fixed      
app.get('/api/stores/store/:storeid/selectedcat',  function(req, res) {


	 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
	 if (token) {
		    jwt.verify(token, "secret", function(err, decoded) {
		        if (err) {
		          res.status(401).json({"error": true, "message": 'Unauthorized access.' });
		           
		        }

		        var publicelastic = require('./connexion.js')
				( elasticsearch, elasticurl,  publicUser, publicPwd);//, jwt,  cryptoJS, res).elastic;
		       
			     publicelastic.getSource ({
			    		 index : 'users', 
			    		 type  : "users", 
			    		 id    : userid ,
			    		 _source: ['token']
			     }, function (err, resp){
			    	  if (err )
			    		   res.status(500).json(err);
			    	  
			     
			        // compare token with store one :
			        var bdToken = resp.token ;
			        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
			        
			        if (!bdToken.includes(testToken))
			        	res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
		        
		    
		        var elastic = require('./connexion.js')
				( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
		        
		        var query  = req.params.query; 
		        elastic.getSource({
		        	index:"store",
		        	type:'store', 
		        	id : req.params.storeid , 
		        	_source : ['selectedCat']
		  
  	  
  	    }, function (error,response) {
    	   if (error){
    	   	res.status(500).json(error);
      	   }else {
    		 res.status(200).json( response)
  	  	  }
    			
      });

	  });
		    });
	}else {
		 res.status(403).json({
		        "error": true,
		        "message": 'No token provided.'
		        	});
	};

});	


}

