var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var Caller = require("../lib/caller.js");
var requireSubvert = require("require-subvert")(__dirname);

chai.should();
describe("#createCaller", function() {
  var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      stubCall(Caller, sandbox);
      stubRx(sandbox);
      Caller = requireSubvert.require("../lib/caller")
    });
    afterEach(function() {
      sandbox.restore();
      requireSubvert.cleanUp();
    });

    it("should create caller", function(){
      var caller = Caller.createCaller({});
      //This value is just to make sure it made it through the stubs
      expect(caller).to.equal(42);
    });
});

describe("#createHotCaller", function() {
  var sandbox;
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      stubCreateCaller(Caller, sandbox);
    });

    afterEach(function() {
      sandbox.restore();
    });

    it("should create hot caller", function(){
      var hotCaller = Caller.createHotCaller({});
      hotCaller.should.have.property("connection").equals(42);
    })
});

describe("#call", function() {
    beforeEach(function() {});
    afterEach(function() {});
});

describe("#call.formatRequest", function() {
    beforeEach(function() {});
    afterEach(function() {});

    it("should return a formated request object", function(){
      var req = Caller.call.formatRequest({
        url: "http://www.google.com",
        headers: "myHeaders"
      });

      req.should.have.property("url").equals("http://www.google.com");
      req.should.have.property("method").equals("GET");
      req.should.have.property("headers").equals("myHeaders");
    });

    it("should place body on form property", function(){
      var req = Caller.call.formatRequest({
        url: "http://www.google.com"
      }, "hello");

      req.should.have.property("form").equals("hello");
    })
});

function stubCreateCaller(caller, sandbox){
  var createCaller = sandbox.stub(caller, "createCaller");
  var publish = sandbox.stub();
  var connect = sandbox.stub();
  connect.returns(42);

  publish.returns({
    connect: connect
  });

  createCaller.withArgs({}).returns({
    publish : publish
  })
}

function stubRx(sandbox){
  var rx = {};
  rx.Observable = {
    "return":function(){},
    interval:function(){}
  };
  var just = sandbox.stub(rx.Observable, "return");
  var interval = sandbox.stub(rx.Observable, "interval");
  var concat = sandbox.stub();
  var select = sandbox.stub();
  var switchStub = sandbox.stub();

  concat.returns({
    select:select,
    map:select
  });

  select.returns({
    switch: switchStub
  });

  switchStub.returns(42);

  just.returns({
    concat: concat
  });
  requireSubvert.subvert("rx", rx);
}

function stubCall(caller, sandbox){
  var call = sandbox.stub(caller, "call");
  call.closure = sandbox.stub();
  call.closure.returns({});
}
