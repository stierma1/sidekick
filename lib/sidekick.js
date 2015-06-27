
var Caller = require("./caller.js");
var traverse = require("traverse");
var Rx = require("rx");
var thisModule;

function createSidekick(config, params, hotCold){
  var regExes = {};

  for(var i in params){
    regExes[i] = new RegExp("\\$\\(" + i + "\\)");
  }

  config._parameterize = thisModule.createParameterizer(params, regExes);

  if(hotCold === "cold"){
    return Caller.call(config, Rx.Observable.just(42));
  } else {
    return Caller.createHotCaller(config);
  }
}

function createParameterizer(params, regExes){
  return function(data){

    traverse(data).forEach(function(value){
      for(var i in regExes){
        if(regExes[i].test(value)){
          if(typeof(params[i]) === "function"){
            this.update(value.replace(regExes[i], params[i]()));
          } else {
            this.update(value.replace(regExes[i], params[i]));
          }
        }
      }
    });

    return data;
  }
}

module.exports = createSidekick;
module.exports.createParameterizer = createParameterizer;

thisModule = module.exports;
