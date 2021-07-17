var mysql      = require('mysql');
var restify = require('restify');

var connection = mysql.createConnection({
  host     : 'bdbfdxkmnmagdjif1ogt-mysql.services.clever-cloud.com',
  user     : 'uooqmxjckiowss2f',
  password : 'sfLpVre3wLT6Xwy61LF7',
  database : 'bdbfdxkmnmagdjif1ogt'
});
connection.connect();

const server = restify.createServer({
  name: 'AirQualityServer',
  version: '1.0.0'
});
var aux = []

const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['API-Token', 'Authorization'],
    exposeHeaders: ['API-Token-Expiry', 'Authorization']
});

server.pre(cors.preflight)
server.use(cors.actual)
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

/////////////////////////////////////////////////////////////////////

server.get('/',async function(req, res, next) {   
  res.send("Its working ")
  return next();
});

server.get('/getRegisto/:id',async function(req, res, next) {     //retorna os sensores e os seus valores lidos
    var id = req.params.id;

    var query = "select * from Registo where user_id="+id;
    connection.query(query, function (error, results, fields) {
      if (error)
      {
        res.json({bad:error})
      }
      else{
        var resp = results
        res.json(resp)
      }
     
    });
   
    return next();
});

server.get('/getDispositivoInfo/:mac',async function(req, res, next) {     //retorna os sensores e os seus valores lidos
  var mac = req.params.mac;

  var query = "select * from Dispositivo where mac="+mac;
  connection.query(query, function (error, results, fields) {
    if (error)
    {
      res.json({bad:error})
    }
    else{
      var resp = results
      res.json(resp)
    }
   
  });
 
  return next();
});

server.get('/getSensorValues/:mac',async function(req, res, next) {     //retorna os sensores e os seus valores lidos
  var mac = req.params.mac;

  var reads = [];
  var query = "select * from Leitura where mac="+mac;
  connection.query(query, function (error, results, fields) {
    if (error)
    {
      res.json({bad:error})
    }
    else{
      var resp = results
      res.json(resp)
    }
   
  });
 
  return next();
});

server.post('/registerMac/',async function(req, res, next) {     //associa mac a um id do utilizaodr
  var mac = req.body.mac;
  var id = req.body.id;
  var designacao = req.body.designacao;


  var query = `INSERT INTO Registo(user_id, mac, designacao) VALUES (${id},"${mac}","${designacao}")`
  connection.query(query, function (error, results, fields) {
    if (error)
    {
      res.json({bad:error})
    }
    else{
      res.json({Sucess:true})
    }
   
  });
 
  return next();
});

server.post('/addSensorValue/',async function(req, res, next) {     //adiciona uma leitura
  var value = req.body.value;
  var mac = req.body.mac;

  console.log(value)
  const po_leitura = value.po_leitura;
  const h_leitura =value.h_leitura;
  const t_leitura =value.t_leitura;
  const gas_leitura = value.gas_leitura;
  const data_leitura = '1970-01-01 00:00:02';

  let query = `INSERT INTO Leitura(mac,data_leitura,po_leitura,h_leitura,t_leitura,gas_leitura) values ("${mac}","${data_leitura}",${po_leitura} ,${h_leitura}, ${t_leitura},${gas_leitura})`

    connection.query(query, function (error, results, fields) {
      if (error)
      {
        res.json({bad:error})
      }
      else{
        res.json({Sucess:true})
      }
    
    });
  return next();
});

server.post('/registerUser/',async function(req, res, next) {     //registar user
  var email = req.body.email;
  var password = req.body.password;

  let query = `INSERT INTO user(email, password) VALUES ("${email}","${password}")`
 
  connection.query(query, function (error, results, fields) {
    if (error)
    {
      res.json({bad:error})
    }
    else{
      res.json({Sucess:true})
    }
  
  });
  return next();
});

server.post('/setToken/',async function(req, res, next) {     //set token of user
  var id = req.body.id;
  var token = req.body.token;

  let query = `UPDATE users SET token="${token}" WHERE id=${id}`
 
  connection.query(query, function (error, results, fields) {
    if (error)
    {
      res.json({bad:error})
    }
    else{
      res.json({Sucess:true})
    }
  
  });
  return next();
});

server.listen(3003, function() {
  console.log('%s listening at %s', server.name, server.url);
});