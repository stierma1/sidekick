var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
chai.should();
var Sidekick = require("../lib/sidekick.js");
var Rx = require("rx");

describe("#createSidekick", function() {
    beforeEach(function() {});
    afterEach(function() {});

    it("should create a sidekick", function(done){
      this.timeout(15100);
      var connection;
      var sidekick = Sidekick(
        {
          url:"http://www.google.com"
        });

      var sub = sidekick.subscribe(function(data){
          sub.dispose();
          done();
        }, function(err){
          sub.dispose();
          done(err)
        }, function(){
          sub.dispose();
          done(new Error("Should not have completed"));
        });
    });

    it("should create a sidekick with params", function(done){
      this.timeout(15100);
      var connection;
      var sidekick = Sidekick(
        {
          url:"http://www.google.com"
        }, {hello:"world"});

      var sub = sidekick.subscribe(function(data){
          sub.dispose();
          done();
        }, function(err){
          sub.dispose();
          done(err)
        }, function(){
          sub.dispose();
          done(new Error("Should not have completed"));
        });
    });

    it("should create a sidekick cold", function(done){
      this.timeout(15100);
      var connection;
      var sidekick = Sidekick(
        {
          url:"http://www.google.com"
        }, null, "cold");

      var sub = sidekick.subscribe(function(data){
          sub.dispose();
          done();
        }, function(err){
          sub.dispose();
          done(err)
        }, function(){
          sub.dispose();
          done(new Error("Should not have completed"));
        });
    });
});

describe("#sidekick.createParameterizer", function() {
    beforeEach(function() {});
    afterEach(function() {});

    it("should inject patameters", function(){
      var params = {
        "hello": "world",
        "heywood" : function(){return "jablome"}
      }
      var regExes = {};
      for(var i in params){
        regExes[i] = new RegExp("\\$\\(" + i + "\\)");
      }

      var paramFunc = Sidekick.createParameterizer(params, regExes);
      var formattedBody = paramFunc(
        {
          "test1": "$(hello)",
          "test2": "$(heywood)"
        }
      );

      formattedBody.should.have.property("test1").equals("world");
      formattedBody.should.have.property("test2").equals("jablome");

    });
});
