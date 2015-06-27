var Bluebird = require("bluebird");
Bluebird.onPossiblyUnhandledRejection(function(){});
var Rx = require("rx");
var request = Bluebird.promisify(require("request"));
var thisModule = module.exports;

function call(config, obs){
  var body;
  if(config.body){
    body = JSON.stringify(config.body);
  }

  return obs
    .map(function(){
      var req = thisModule.call.formatRequest(config, body);
      return request(req);
    })
    .flatMap(function(obs){
      return obs;
    })
    .flatMap(function(data){
      if(!config.suppressStatusCodeCheck && data && data[0] && data[0].statusCode > 299){
        throw new Error("Call returned statusCode: " + data[0].statusCode);
      }
      return data;
    })
    .timeout(config.timeout || 3000)
    .retry(config.retryCount || 3);
}

call.closure = function(config){
  return function(data, idx, obs){
    return call(config, obs);
  }
};

call.formatRequest = function(config, body){
  var req = {
    url:config.url,
    method:config.method || "GET"
  }
  if(config.headers){
    req.headers = config.headers
  }

  if(body){
    if(config._parameterize){
      req.form = config._parameterize(JSON.parse(body));
    } else {
      req.form = body;
    }
  }

  return req;
}

function createCaller(config){

  return Rx.Observable.return(42)
    .concat(Rx.Observable.interval(config.interval || 9000))
    .select(thisModule.call.closure(config))
    .switch();
}

function createHotCaller(config){
  var hotCaller = thisModule.createCaller(config)
    .publish()

  hotCaller.connection = hotCaller.connect();
  return hotCaller;
}

module.exports.call = call;
module.exports.createCaller = createCaller;
module.exports.createHotCaller = createHotCaller;
