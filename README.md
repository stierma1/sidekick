
#rx-sidekick

Create Rx.Observable sequences of http calls

##Install
```
npm install rx-sidekick
```

##Usage
```
var Sidekick = require("rx-sidekick").Sidekick;
var sidekick = Sidekick(
  {
    url:"http://www.google.com"
  });

var sub = sidekick.subscribe(function(responseData){
    var body = responseData[1];
    var response = responseData[0];

    console.log("Success");
  }, function(err){

  }, function(){
    sub.dispose();
    throw new Error("Should not have completed");
  });

#Success
#Success
...

```
To shutdown the polling and dispose sidekick

```
var sidekick = Sidekick(
  {
    url:"http://www.google.com"
  });

sidekick.connection.dispose();
```
##API

###Sidekick.createSidekick(config, params=undefined, hotCold = "hot") -> Rx.Observable

###Config Object properties

| Property   | type   | optional | default   | description                                             |
|------------|--------|----------|-----------|---------------------------------------------------------|
| url        | String | no       | undefined | url to make the http request                            |
| method     | String | yes      | "GET"     | http method                                             |
| headers    | Object | yes      | undefined | http headers                                            |
| body       | Object | yes      | undefined | body to be sent as a form to the endpoint               |
| interval   | Number | yes      | 9000 (ms) | interval to do polling against the endpoint             |
| retryCount | Number | yes      | 3         | number of times to retry the endpoint if the call fails |
| timeout    | Number | yes      | 3000 (ms) | amount of time allowed per http request                                                        |

###Params
(todo)

###hotCold
Values are either "hot" or "cold".  
Will produce a "hot" Observable or a "cold" Observable.  
Note "hot" Observables are already connected and polling by the time the value is returned
