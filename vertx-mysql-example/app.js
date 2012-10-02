var vertx = require('vertx.js');
var template = require('lib/js/template.js');
var staticfile = require('lib/js/staticfile.js');

var eb = vertx.eventBus;
var rm = new vertx.RouteMatcher();

var statics = {
  '/css/bootstrap.css': 'lib/css/bootstrap.css',
  '/css/bootstrap-responsive.css': 'lib/css/bootstrap-responsive.css'
};

staticfile.setStaticFiles( statics, rm ) ;

function wrapPostHandler (callback) {
  return function (req) {
    req.dataHandler(function (buffer) {
      var query = buffer.getString(0, buffer.length()),
        params = {},
        i = 0,
        qs = query.split('&'),
        n = qs.length,
        pair;

      for(; i < n; ++i) {
        pair = qs[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
      }
      callback(req, params);
    });
  };
}

function index( req ) {
  eb.send( 'test.persistor', {
    action: 'select',
    stmt: 'SELECT name, message FROM messages'
  }, function( reply ) {
    if( reply.status === 'ok' ) {
      template.renderTemplate( req, 'vertx-mysql-example/templates/index.html', { messages: reply.results } ) ;
    } else {
      req.response.end( reply.message ) ;
    }
  });
}

rm.get( '/', index ) ;

rm.post( '/', function( req ) {
  eb.send('test.persistor', {
    action: 'insert',
    stmt: 'INSERT INTO messages( name, message ) VALUES( ?, ? )',
    params: [ req.params().name, req.params().text ]
  }, function (reply) {
    index( req ) ;
  });
});

vertx.createHttpServer().requestHandler( rm ).listen( 8080 ) ;

var mysqlPersistorConf = {
  address  : "test.persistor",

  // JDBC connection settings
  driver   : "com.mysql.jdbc.Driver",
  url      : "jdbc:mysql://localhost:3306/mysql",
  username : "test",
  password : "test",
}

vertx.deployModule( 'com.bloidonia.jdbc-persistor-v1.0', mysqlPersistorConf, 1, function( reply ) {
    console.log( 'connected' ) ;
});
