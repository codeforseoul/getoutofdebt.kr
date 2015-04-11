/**
 * Module dependencies.
 */

var express        = require('express'),
    expressLayouts = require('express-ejs-layouts'),
    path           = require('path'),
    mongoose       = require('mongoose'),
    logger         = require('morgan'),
    bodyParser     = require('body-parser'),
    compress       = require('compression'),
    favicon        = require('static-favicon'),
    methodOverride = require('method-override'),
    errorHandler   = require('errorhandler'),
    config         = require('./config'),
    routes         = require('./routes');


mongoose.connect(config.database.url);
mongoose.connection.on('error', function () {
  console.log('mongodb connection error');
});

var app = express();



/**
 * Express configuration.
 */
app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'views' ));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

app
  .use(expressLayouts)
  .use(compress())
  .use(favicon())
  .use(logger('dev'))
  .use(bodyParser())
  .use(methodOverride())
  .use(express.static(path.join(__dirname + '/public')))
  .use(logger())
  .use(routes.indexRouter)
  .use(function (req, res) {
    res.status(404).render('components/404', {title: 'Not Found :('});
  });

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
