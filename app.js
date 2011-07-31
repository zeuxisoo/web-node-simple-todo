var express = require('express'),
	csrf = require('express-csrf'),
	config = require('./config'),
	todo = require('./controllers/todo');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: config.session_secret_key }));
	app.use(csrf.check());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

// Register Helper
app.helpers({
	config: config
});

app.dynamicHelpers({
	csrf: csrf.token
});

// Routes
app.get('/', todo.index);
app.post('/new', todo.new);
app.get('/delete/:id', todo.delete);
app.get('/finish/:id', todo.finish);
app.get('/unfinish/:id', todo.unfinish);
app.get('/edit/:id', todo.edit);
app.post('/save', todo.save);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
