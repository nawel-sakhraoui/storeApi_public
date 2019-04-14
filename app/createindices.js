
module.exports = function (elasticsearch,elasticurl){
	

//
var elastic = new elasticsearch.Client( {  
	hosts: [
		    elasticurl,
		   	],
		   	httpAuth: 'admin:admin',
		   	log : 'trace'
	});

	//store 
	elastic.indices.create({
		index: 'store',
		
	},function ( err, resp, status){
		if (err){
			console.log(err); 
		}else{
			console.log("create store index" , resp)
		}
	
	});
	
	elastic.indices.putMapping({
		index: 'store', 
		type: "store",
		body : {
			
			  "store": { 
			      "properties": { 
			    	'title':		  { "type": 'text'},
			        "userid":         { "type": "keyword"  }, 
			        "admins":         { "type": "array" }, 
			        "selectedCat":     { "type":"array"}, 
			        "description":    { 'type':"text"},
			        "open":		      { "type":"boolean"},
			        "notificationcount":{ "type":"integer"},
			        "notification"   :{ "type":"object"},
			        "suspend":		  { "type":"boolean"},
			        "ratingsum": 	  { "type": "double"},
			        "ratingcount":    { "type": "integer"},
			        'feedback':       {"type":"text"},
			        "created":        {"type":   "date"}
			      }
			    }
			  
		}

		},function ( err, resp, status){
			if (err){
				console.log(err); 
			}else{
				console.log("put mapping" , resp)
			}
		
		}); 

	elastic.indices.create({
		index: 'article', 
	
	},function ( err, resp, status){
		if (err){
			console.log(err); 
		}else{
			console.log("create article index" , resp)
		}
	
	}); 

	
	elastic.indices.putMapping({
		index: 'article', 
		type: "article",
	
		
		body : {
			    "article": { 
			      "properties": { 
			        "title":       { "type": "keyword", 
			        					"fields": {
			        							"raw": { 
			        								"type":  "text"
			        							}
			        					}
			        				}, 
			        "storetitle":  { "type": "keyword" , 
			        					"fields": {
			        							"raw": { 
			        								"type":  "text"
			        							}
			        					}
			        				},
			        "price" :      {"type":"short", 
			        					"fields": {
			        							"raw": { 
			        								"type":  "text"
			        							}
			        					 }
			        				},
			       "selectedCat":     { "type":"array"}, 

			        'publishedby': {"type": 'keyword'},
			        "description": {"type": "text" },
			        'categories':  {"type": "text"},
			        "available":   {"type": 'boolean'},
			        "number":      {"type":"integer"}, 
			        "created":     {
			                        "type":   "date", 
			                        },
			        
			        "ratingsum":    {"type":"integer"},
		        	"ratingcount":  {'type':'integer'},
		        	"rating":       {
		        		             'type':"nested",
		        		                   "properties":{
		        		                	   
		        		                	   'userid':	{"type":"keyword"},
		        		                	   'value':		{"type":"integer"},
		        		                   	}
		        		
		        					}
			      }
			    }
			
				   
		}
		},function ( err, resp, status){
			if (err){
				console.log(err); 
			}else{
				console.log("put mapping" , resp)
			}
		
		}); 
	
	
	
	
	//cart creation
	elastic.indices.create({
		index: 'useraccount', 
		 
	},function ( err, resp, status){
		if (err){
			console.log(err); 
		}else{
			console.log("create create useraccount");
		}
	
	}); 
	
	elastic.indices.putMapping({
		index: 'useraccount', 
		body : {
			
			"useraccount": { 
	        "properties": { 
	            "articlecart":{ 
	         	"type": "array",
	            	/*"properties":{
	            		'added' :   {'type':"date"},
	            		//"storeid":  {'type':"keyword"}, 
	            	    'articleid':{"type":'array'}
	            			
	            		}*/
	
	
	            
	            	/* "properties":{
			             "storeid": {"type":"keyword"} ,
			          	 "title": {"type":"keyword"}, 			              
					       "articleid":{"type":"keyword"},
					       "price": {"type":"short"},
					       // "pic": {"type":"binary"},  
					        "available": {"type":"boolean"},
					        //"delivery":{"type":"nested"},
					          "updated": {"type":"date"}
			            
		              }*/
	             }, 
	            "fullname":{'type': 'keyword'},
	            "email": {"type":'keyword'},
	            'phone':{"type":'keyword'},
	            "location":{'type': 'text'}, 
	            "joined":{'type': 'date'}, 
	          	"ratingsum":{"type":"integer"},
        	    "ratingcount":{'type':'integer'},
        	    "rating":{'type':"nested",
        		    "properties":{
        			   'userid':{"type":"keyword"},
        			   'value':{"type":"integer"},
        			
        		    }
        		
        	}
	  
	        
	        
	        
	      }
	    }
	}
	});

elastic.indices.create({
		index: 'ongoing', 

		},function ( err, resp, status){
			if (err){
				console.log(err); 
			}else{
				console.log("create  index" , resp)
			}
		
		}); 
		
elastic.indices.putMapping({

		index: 'ongoing', 
		body : {
			
			    "ongoing": { 
			    "properties": { 
			       
			        "articles": { "type": "nested",  
			        	'properties':{ 
			        		  "articleid":  {"type":"keyword"},
			        		  "price" :     {"type":"short"},
						      "color":      {"type":"keyword"},
						      "quantity":   {"type":"integer"},
						      "title":      { "type": "text"  }, 
						
			        	}
			        },
                  
                   "userid": { "type": "keyword"  }, 
			       "storetitle": { "type": "keyword"  },
			      
			       "totalprice" : {"type":"short"},
			       "delivery":  { "type" : "text"}, 
			       "message":    {'type':'array'},
			       "startdate":  {'type':"date"}, 
			       'steps': {	'type':'nested', 
			        			"properties": {
			        					"prepare": {'type':'date'}, 
			        					"send":{'type':'date'}, 
			        					'receive':{'type':'date'},
			        					'litige':{'type':'date'}, 
			        					'close':{'type':'date'}
			        		
			        			}},
			 
			        "messages":	{"type":'nested', 
			      	
			        	  "properties":{ 
			        		  	"from":			{"type":'keyword'}, 
			        		  	"to": 			{"type":'keyword'},
			        		  	"text":			{"type":"text"},
			        		  	"date":         {'create article index"type':"date"}, 
			        
			          }},
     }}}
		
	},function ( err, resp, status){
		if (err){
			console.log(err); 
		}else{
			console.log("create ongoing index" , resp);
		}
	
	}); 
	
	
	


	
elastic.indices.create({
	index: 'message', 
	
	},function ( err, resp, status){
		if (err){
			console.log(err); 
		}else{
			console.log("create  message" , resp)
		}
	
}); 
elastic.indices.putMapping({
	index: 'message', 
	type: "message",
	//ongoing +ongoingId
	
	body : {
		
		    "message": { 	
		        "properties":{ 
		        	"users":{"type":"text"},
		        	"unread0":{"type": "integer"},
		        	"unread1":{"type": "integer"}, 
		        	"count": {'type':"integer"},
			       "messages":	{"type":'nested', 
			      	
			       "properties":{ 
			         "from":			{"type":'keyword'}, 
			         "to": 				{"type":'keyword'},
			         "text":			{"type":"text"},
			         "date":            {'type':"date"}, 
			        
			      }},
		        }
		    },
		        
			   
	}
	},function ( err, resp, status){
		if (err){
			console.log("message"+err); 
		}else{
			console.log("put mapping message" , resp)
		}
	
	}); 
	


//address 
elastic.indices.create({
	index: 'address',
	
},function ( err, resp, status){
	if (err){
		console.log(err); 
	}else{
		console.log("create address index" , resp)
	}

});

elastic.indices.putMapping({
	index: 'address', 
	type: "address",
	body : {
		
		  "address": { 
		      "properties": { 
		    	'title': 		 { "type": "keyword"  },  
		    	'commune': 		 { "type": "keyword"  },  
		        "userid":        { "type": "keyword"  }, 
		        "city":         { "type": "keyword" }, 
		        "zipcode":       { "type": "keyword" }, 	
		        "address":       { 'type':"text"},
		        "phone":		 { "type":"keyword"},
		        "to":            { "type":"keyword"},
		       
		      }
		    }
		  
	}

	},function ( err, resp, status){
		if (err){
			console.log(err); 
		}else{
			console.log("put mapping" , resp)
		}
	
	});


elastic.indices.create({
	index: 'delivery',
	
},function ( err, resp, status){
	if (err){
		console.log(err); 
	}else{
		console.log("create delivery index" , resp)
	}

});

elastic.indices.putMapping({
	index: 'delivery', 
	type: "delivery",
	body : {
		
		  "delivery": { 
		      "properties": { 
		    	'title': 		 { "type": "keyword"  },  
		    	'communes': 		 { "type": "array"  },  
		        "categories":        	 { "type": "array"  }, 
		        "price":         	 { "type": "number" }, 
		        'phone': 		 { "type": "keyword"  }
		       		      
		    }
		  }

	}},function ( err, resp, status){
		if (err){
			console.log(err); 
		}else{
			console.log("put mapping" , resp);
		}
	
	}); 

}