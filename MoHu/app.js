var express = require('express');
var routes = require('./routes/route');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/*var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); */

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(express.static(path.join(__dirname, '/app')));

/*app.use(session({
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {maxAge: 1000*60*60*24*30},
	store: new MongoStore({
		db: settings.db,
		host: settings.host,
		port: settings.port
	})
})); */

app.use('/', routes);

app.listen(3000);