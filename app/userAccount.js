
module.exports = function ( app,io,  elasticsearch, elasticurl, jwt, cryptoJS){ 

	// create my useraccount ! 
	
	var publicUser = "admin", 
		publicPwd  ="admin", 
		registredUser ="admin"
	    registredPwd= "admin";
		
	app.post('/api/useraccount/', function(req, res) {
		
		
		 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
		 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
		 
		 var joined = new Date().getTime();
		 if (token) {
			    jwt.verify(token, "secret", function(err, decoded) {
			    if (err) {
			          res.status(401).json({"error": true, "message": 'Unauthorized access.' });
			     }else {
			    
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
			        
			        if (!bdToken.includes(testToken)){
			      
				          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
 
			        } else {
			        
			        var elastic = require('./connexion.js')
					( elasticsearch, elasticurl,  registredUser, registredPwd);//, jwt,  cryptoJS, res).elastic;
			       
			    	elastic.index({
			    		
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: userid,
			    		  body: {
			    			'phone': req.body.phone , 
			    			'articlecart':[],
			    			'fullname': req.body.fullname , 
			    			'joined':  joined,
			    			'rating': [], 
		    			    'ratingsum' :0,  
		    			    'ratingcount': 0,
		    			    'notification':[], 
		    			    'notificationcount':0,
		    			    "messagesnotification" :[], 
		    			    "messagesnotificationcount":0
			    		  },
			    		 
			    
			    	}, function (error, response) {
			    	    
			    			if (error ){
			    	    		res.status(500).json(error);
			    	    	 }else{
			    	    		 res.status(200).json(response); 
			    	    	 }
			    	    			
			    	  });
			  }});
			    }
			}); 
			     
			}else {
				
				res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
			};
		
	});
	

	//get any useraccount 	
	app.get('/api/useraccount/:user', function(req, res) {
		
	
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
			    		
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.user,
			    	
			    		}    
			    	   
			    	
			    	, function (error, response) {
			    	    	console.log(error); 
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
	
	

	//update any useraccount 	
	app.put('/api/useraccount/:userid/rating', function(req, res) {
	
		
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
			    	  	  index:"useraccount", 
			    	  	  type: "useraccount",
			    	  	  id : req.params.userid,
			    	  	  
			    	  	  body: {
				    			
			    			  script: {
			    			      lang: 'painless',
			    			      //source: 'ctx._source.cart.add(params.articleid)',
			    			       source: "ctx._source.ratingsum+=params.rating.value;" 
				    			    +"ctx._source.ratingcount+=1;" 
				    			    +"ctx._source.rating.add(params.rating);" , 
			    			       params: { 'rating': req.body}
			    			  },
			    			  upsert: {
			    				  
			    				  rating: [req.body], 
			    			  	  ratingsum : req.body.value,  
			    			  	  ratingcount: 1
			    			  }
			    				    
			    		  }  
			    	}
			    	
			    	, function (error, response) {
			    	    	 if (error ){
			    	    		return  res.status(500).json(error);
			    	    	 }else{
			    	    		 res.status(200).json(response); 
			    	    	 }
			    	    			
			    	    });
			        
			        

			    });
			    });
			}else {
				
				return res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			     });
			};
		
		
		
	});
	
	
	

	//get any useraccount rating  	
	app.get('/api/useraccount/:userid/ratinglist', function(req, res) {
	
		 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
		 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
		 
		 
			if (token) {
			    jwt.verify(token, "secret", function(err, decoded) {
			        if (err) {
			          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        }
			        var pwd  = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
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
			        
			        var elastic = require('./connexion.js')
					( elasticsearch, elasticurl,  userid,pwd);//, jwt,  cryptoJS, res).elastic;
			        
			    	elastic.getSource({
			    		
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid,
			    		 _source: ['rating']
			    			
			    		 
			    		 
			    
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
	
	
	//get useraccount rating 	
	app.get('/api/useraccount/:userid/rating', function(req, res) {
		
		
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
			    		
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid,
			    		 _source: ['ratingcount','ratingsum']
			    			
			    		 
			    		 
			    
			    		}    
			    	   
			    	
			    	, function (error, response) {
			    	    	console.log(error); 
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
	
	
	
	//put notif any useraccount 
	app.put('/api/useraccount/:userid/notifications', function(req, res) {
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
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid, 
			    	  	  
			    	  	  body: {
			    	  		  lang: 'painless',
		    				  script: {
			    			      lang: 'painless',
			    			      source: "ctx._source.notificationcount += 1;"
			    			       		 +"ctx._source.notification.add(params.notification);",
			    			       params: { 'notification': req.body}
			    			  },
			    		
			    		  },
			    	  	  
			    	    }, function (error, response) {
			    	    	
			    	    	 if (error ){
			    	    		res.status(500).json(error);
			    	    	 }else{
			    	    		  io.emit('ongoing_step'+req.params.userid, JSON.stringify(req.body));
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
	
	
//remove my useraccount notification 
app.put('/api/useraccount/:userid/notifications/removelist', function(req, res) {
		
		const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
	    const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
		if (token) {
			    jwt.verify(token, "secret", function(err, decoded) {
			        if (err) {
			          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        }
			        if (req.params.userid.localeCompare(userid)!=0)
			        	res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
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
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid, 
			    	  	  
			    	  	  body: {
			    	  		  lang: 'painless',
		    				  script: {
			    			      lang: 'painless',
			    			      
			    			      source: "for (not in params.notif.notifs){" +
			    			      		"if (ctx._source.notification.contains(not) ){" +
			    			      		"ctx._source.notification.remove(ctx._source.notification.indexOf(not)); " +
			    			      		  "ctx._source.notificationcount -= 1;}}",
			    			       params: { 'notif': req.body}
			    			  },
			    			  
			    		  },
			    	  	  
			    	    }, function (error, response) {
			    	    	
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
	
	

//remove my notif 
app.put('/api/useraccount/:userid/notifications/remove/:type', function(req, res) {
		
		const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
		const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
		if (token) {
			    jwt.verify(token, "secret", function(err, decoded) {
			        if (err) 
			          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        
			        if (req.params.userid.localeCompare(userid)!=0)
			        	res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        var publicelastic = require('./connexion.js')
					( elasticsearch, elasticurl,  publicUser, publicPwd );//, jwt,  cryptoJS, res).elastic;
			       
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
	 
				        req.body.value = req.params.type ; 
			    
			        var elastic = require('./connexion.js')
					( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
			        
			        
			        
			        if (req.params.type == "notif"){
			    		
			    	  elastic.update({
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid, 
			    	  	  
			    	  	  body: {
		    				  script: {
			    			      lang: 'painless',
			    			      
			    			      
			    			      source: "for(int i=0 ; i<  ctx._source.notification.length; i++){" +
			    			      		    "if (ctx._source.notification[i].commandid == params.notif.commandid && ctx._source.notification[i].value != params.message " +
			    			      		    "&& ctx._source.notification[i].value != params.rating ){" +
				    			      		"ctx._source.notification.remove(i); " +

			    			      		        "ctx._source.notificationcount -= 1;" +
			    			      		        "i= 0;   "+
			    			      		      "}" +
			    			      		    "}",
			    			       params: { 'notif': req.body, 
			    			    	   		"message": "message", 
			    			    	   		'rating': 'rating'}
			    			  },
			    			  
			    		  },
			    	  	  
			    	    }, function (error, response) {
			    	    	
			    	    	 if (error ){
			    	    		  res.status(500).json(error);
			    	    	 }else{
			    	    		// req.body.value = req.params.type ; 
				    	    //		console.log(req.body ); 

			    	    		 io.emit('ongoing_remove_step'+req.params.userid, JSON.stringify(req.body));
			    	    		 res.status(200).json(response); 
			    	    	 }
			    	    			
			    	    });
			        
			        }else {
			        	 if (req.params.type == "message"){
					    		
						    	elastic.update({
						    		  index: 'useraccount',
						    		  type: 'useraccount',
						    		  id: req.params.userid, 
						    	  	  
						    	  	  body: {
						    	  		  lang: 'painless',
					    				  script: {
						    			      lang: 'painless',
						    			      
						    			      
						    			      source: "for(int i=0 ; i<  ctx._source.notification.length; i++){" +
						    			      		    "if (ctx._source.notification[i].commandid == params.notif.commandid && ctx._source.notification[i].value == params.message )" +
						    			      		    "{" +
							    			      		"ctx._source.notification.remove(i); " +

						    			      		        "ctx._source.notificationcount -= 1;" +
						    			      		        "i= 0; "+
						    			      		      "}" +
						    			      		    "}",
						    			       params: { 'notif': req.body, 
						    			    	   		"message": "message", 
						    			    	   		'rating': 'rating'}
						    			  },
						    			  
						    		  },
						    	  	  
						    	    }, function (error, response) {
						    	    	
						    	    	 if (error ){
						    	    		res.status(500).json(error);
						    	    	 }else{
						    	    		// req.body.value = req.params.type ; 
						    	    		//console.log(req.body ); 
						    	    		 io.emit('ongoing_remove_step'+req.params.userid, JSON.stringify(req.body));
						    	    		 res.status(200).json(response); 
						    	    	 }
						    	    			
						    	    });
						        
						        }else{
						        	 if (req.params.type == "rating"){
								    		
									    	elastic.update({
									    		  index: 'useraccount',
									    		  type: 'useraccount',
									    		  id: req.params.userid, 
									    	  	  
									    	  	  body: {
									    	  		  lang: 'painless',
								    				  script: {
									    			      lang: 'painless',
									    			      
									    			      
									    			      source: "for(int i=0 ; i<  ctx._source.notification.length; i++){" +
									    			      		    "if (ctx._source.notification[i].commandid == params.notif.commandid && ctx._source.notification[i].value == params.rating ){" +
										    			      		"ctx._source.notification.remove(i); " +

									    			      		        "ctx._source.notificationcount -= 1;" +
									    			      		        " i =0; "+
									    			      		      "}" +
									    			      		    "}",
									    			       params: { 'notif': req.body, 
									    			    	   		"message": "message", 
									    			    	   		'rating': 'rating'}
									    			  },
									    			  
									    		  },
									    	  	  
									    	    }, function (error, response) {
									    	    	
									    	    	 if (error ){
									    	    		res.status(500).json(error);
									    	    	 }else{
									    	    	//	
										    	   // 		console.log(req.body ); 

									    	    		 io.emit('ongoing_remove_step'+req.params.userid, JSON.stringify(req.body));
									    	    		 res.status(200).json(response); 
									    	    	 }
									    	    			
									    	    })
									    	    }}}

			    });
			    });
		}else {
				
				 res.status(403).send({
			        "error": true,
			        "message": 'No token provided.'
			        	});
		};
});
	
	
//get my useraccount notif 	
app.get('/api/useraccount/:userid/notifications', function(req, res) {
		
		const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
		const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
		if (token) {
			    jwt.verify(token, "secret", function(err, decoded) {
			        if (err) {
			          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        }
			       
			        if (req.params.userid.localeCompare(userid)!=0)
			        	res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
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
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id:req.params.userid, 
			    		  
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
	

//search any useraccount 	
app.get('/api/useraccount/search/:userphone',  function(req, res) {

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
			        
		
			        var phone  = req.params.userphone; 
			        elastic.search({
			        	index:"useraccount",
			         body:{
			     	    query : { 
	  	  					
  	  						term : { "phone" : phone }
  	  					
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
	
	

// update any useraccount 
app.put('/api/useraccount/:userid/messages/notifications', function(req, res) {
		
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
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid, 
			    	  	  
			    	  	  body: {
			    	  		  lang: 'painless',
		    				  script: {
			    			      lang: 'painless',
			    			      source: "ctx._source.messagesnotificationcount += 1;",
			    			   
			    			  },
			    			  upsert: {
			    				  messagesnotificationcount :1 , 
			    		 
			    			  }
			    				    
			    		  },
			    	  	  
			    	    }, function (error, response) {
			    	    	
			    	    	 if (error ){
			    	    		 res.status(500).json(error);
			    	    	 }else{
			    	    		
			    	    		  io.emit('messages_notif'+req.params.userid, JSON.stringify({unread:1}));
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
	

// get my 
app.get('/api/useraccount/:userid/messages/notifications', function(req, res) {
	     
	     console.log(req.headers.authorization) ; 
	
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
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid, 
			    		  _source : ["messagesnotificationcount"],

			    	  	  
			    	    }, function (error, response) {
			    	    	
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
	


//get any useraccount fullname 
app.get('/api/useraccount/:user/fullname', function(req, res) {
		
		
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
				    	  console.log(err);
				    	 console.log(resp);
				        // compare token with store one :
				        var bdToken = resp.token ;
				        var testToken = cryptoJS.AES.decrypt( decoded.id, 'secret').toString(cryptoJS.enc.Utf8);
				        
				        if (!bdToken.includes(testToken))
				      
					          res.status(401).json({"error": true, "message": 'Unauthorized access, wrong token' });
	 
			        
			    
			        var elastic = require('./connexion.js')
					( elasticsearch, elasticurl,  registredUser,registredPwd);//, jwt,  cryptoJS, res).elastic;
			        
			        
			    	elastic.getSource({
			    		 
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.user,
			    		  _source: ['fullname']
			    	} , function (error, response) {
			    	    	
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
	

//remove notif my 	
app.put('/api/useraccount/:userid/messages/notificationsdown', function(req, res) {
		
		 const token = JSON.parse(req.headers.authorization.split(" ")[1]).token;
		 const userid =JSON.parse(req.headers.authorization.split(" ")[1]).userid;
		
		 if (token) {
			    jwt.verify(token, "secret", function(err, decoded) {
			        if (err) {
			          res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        }
			      
			        if (req.params.userid.localeCompare(userid)!=0)
			        	res.status(401).send({"error": true, "message": 'Unauthorized access.' });
			           
			        
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
			    		  index: 'useraccount',
			    		  type: 'useraccount',
			    		  id: req.params.userid, 
			    	  	  
			    	  	  body: {
			    	  		  lang: 'painless',
		    				  script: {
			    			      lang: 'painless',
			    			      source: "if ( ctx._source.messagesnotificationcount >0 )" +
			    			      		"  ctx._source.messagesnotificationcount-= params.read;",
			    			       		// +"ctx._source.messagesnotification.add(params.notification);",
			    			       params: { 'read': req.body.read}
			    			  },
			    			  
			    				    
			    		  },
			    	  	  
			    	    }, function (error, response) {
			    	    	
			    	    	 if (error ){
			    	    		 res.status(500).json(error);
			    	    	 }else{
			    	    
			    	    		  io.emit('messages_notif'+req.params.userid, JSON.stringify({unread:-req.body.read}));
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
	

//put user fav category and remove 

//update any useraccount 	
app.put('/api/useraccount/:userid/add/category', function(req, res) {

	
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
		    	  	  index:"useraccount", 
		    	  	  type: "useraccount",
		    	  	  id : req.params.userid,
		    	  	  
		    	  	  body: {
			    			
		    			  script: {
		    			      lang: 'painless',
		    			      //source: 'ctx._source.cart.add(params.articleid)',
		    			       source:"ctx._source.categories.add(params.category);" , 
		    			       params: { 'category': req.body.category}
		    			  },
		    			  upsert: {
		    				  
		    				  categories: [req.body.category ], 
		    			  	 
		    			  }
		    				    
		    		  }  
		    	}
		    	
		    	, function (error, response) {
		    	    	 if (error ){
		    	    		return  res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		        
		        

		    });
		    });
		}else {
			
			return res.status(403).send({
		        "error": true,
		        "message": 'No token provided.'
		     });
		};
	
	
	
});
//

//update any useraccount 	
app.put('/api/useraccount/:userid/remove/category', function(req, res) {

	
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
		    	  	  index:"useraccount", 
		    	  	  type: "useraccount",
		    	  	  id : req.params.userid,
		    	  	  
		    	  	  body: {
			    			
		    			  script: {
		    			      lang: 'painless',
		    			      //source: 'ctx._source.cart.add(params.articleid)',
		    			       source:"ctx._source.categories.remove(ctx._source.categories.indexOf(params.category));" , 

		    			       
		    			       params: { 'category': req.body.category}
		    			  },
		    			  
		    				    
		    		  }  
		    	}
		    	
		    	, function (error, response) {
		    	    	 if (error ){
		    	    		return  res.status(500).json(error);
		    	    	 }else{
		    	    		 res.status(200).json(response); 
		    	    	 }
		    	    			
		    	    });
		        
		        

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