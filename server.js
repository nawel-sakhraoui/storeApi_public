var https 			= require('http'),
 	express 		= require('express'),
 	elasticsearch	= require('elasticsearch'),
 	fs              = require('fs'),
	bodyParser      = require('body-parser'),
    path            = require('path'), 
    CryptoJS        = require("crypto-js"),
    jwt             = require('jsonwebtoken'),
	bearerToken     = require('express-bearer-token');

    const app = express();

    app.use(function (req, res, next) {

   
    	res.setHeader('Access-Control-Allow-Origin', '*');
    	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept , Authorization');
    	res.setHeader('Access-Control-Allow-Credentials', true);
    	res.setHeader('Access-Control-Expose-Headers', 'header')  ;
    	next();
    });

    app.use(bodyParser.json({limit: '100mb'}));
    app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
   
    app.use(bearerToken());
 
    var elasticurl ="https://127.0.0.1:9200";
    var allowedOrigins = "*:*";
   
    const port = 3000; 
    const hostname ="0.0.0.0";
    const server = https.createServer(app); 
    const  io   = require('socket.io')(server);
    io.set('origins', '*:*');
    io.on('connection', (socket) => {
    	   console.log('user connected'); 
		   io.emit('userid', { connected: 'on' });
 
    	   socket.on('disconnect', function(){
    		   io.emit('userid', {connected: 'off'})
    		   
    	   });
    	
    });
   
    
    
    require ('./app/pic.js')(app, elasticsearch, elasticurl, jwt, CryptoJS, fs);  
    require ("./app/createindices.js")(elasticsearch, elasticurl);
    require ("./app/store.js")(app,io, elasticsearch, elasticurl, jwt, CryptoJS );
    require ("./app/userAccount.js")(app,io,elasticsearch, elasticurl, jwt, CryptoJS );
    require ("./app/address.js")(app, elasticsearch, elasticurl, jwt, CryptoJS, fs );

    require ("./app/delivery.js")(app, elasticsearch, elasticurl, jwt, CryptoJS );

    require ("./app/cart.js")(app,elasticsearch, elasticurl, jwt, CryptoJS );
    require ("./app/article.js")(app,elasticsearch, elasticurl, jwt, CryptoJS );
    require ('./app/myhome.js')(app, elasticsearch, elasticurl, jwt, CryptoJS); 
    require ("./app/ongoing.js")(app, io, elasticsearch, elasticurl, jwt, CryptoJS );
    require ("./app/message.js")(app, io, elasticsearch, elasticurl, jwt, CryptoJS );

    
    
    server.listen(port, hostname, function(req, res){
        console.log('Server is running at port: ',port);
      });
      
