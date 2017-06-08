(function(){
	var Hapi = require("hapi")
	const server = new Hapi.Server()

	server.connection({
		port:  '3030',
		host : 'localhost'
	})

	server.register([require("inert")],(err)=>{
		if(err) throw err;
		server.route([
		{
			method: "GET",
    		path: "/public/{p*}",
    		handler: {
        		directory: {
            		path: "public",
            		listing: false
        		}
    		}
    	},
    	{
    		method: '*',
    		path: '/{p*}', // catch-all path
    		handler: function(request, reply) {
        		console.log("Getting all requests")
        		reply.file("public/index.html")
    		}
    	}
		])

		server.start((err)=>{
			if(!err)
			{
				console.log("Server Started at port : 3030")
			} else {
				console.log(err)
			}
		})
	})
})()