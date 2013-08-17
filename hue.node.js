
var dgram = require("dgram");
var osc = require('osc-min');

var huereq = require("node-hue-api");
console.log(huereq);

var hue = require("node-hue-api");

console.log(hue);

var lightState = require("node-hue-api").lightState;

var username = "newdeveloper";

var hostname = "192.168.1.57";

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

hue.locateBridges().then(displayBridges).done();

var api = new hue.HueApi(hostname, username);

api.connect().then(displayResult).done();

api.lights()
    .then(displayResult)
    .done();

var state;

state = lightState.create().on().hsl(100, 100, 100);

api.setLightState(2, state)
  .done();


  // listener setup, for listening to requests from max via udp
var listener = dgram.createSocket("udp4");
listener.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " +
    rinfo.address + ":" + rinfo.port);
  console.log(rinfo);
  processMessage(msg, rinfo);
});

listener.on("listening", function () {
  var address = listener.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

listener.bind(11000);
// server listening 0.0.0.0:41234


// processing messages sent from max (maybe this can me merged with messages from twitter itself?)
function processMessage(msg, rInfo){
//	msg = ""+msg;

	var fb = osc.fromBuffer(msg);
	console.log(fb);	

	var args = fb.args;

	var msg = fb.args[0].value;
	var type = fb.args[0].type;
	var addr = fb.address;

	console.log("addr '" +  addr +"'");
	console.log("msg '" + msg +"'");
	console.log("type '" + type +"'");

	switch (addr){
		case "hsl":
			hsl(args);
			break;
		case "rgb":
			rgb(args);
			break;
		default:
			console.log("unknown address "  + addr);


	}
}


function hsl(args){

	//msg = msg.trim();

	console.log(args);

	var h = args[0].value;
	var s = args[1].value;
	var l = args[2].value;


	var state;

	console.log("going to set hsl " + h + " " + s + " " + l);

	state = lightState.create().on().hsl(h, s, l);


	api.setLightState(2, state)
  		.done();

}



function rgb(args){

	//msg = msg.trim();

	console.log(args);

	var r = args[0].value;
	var g = args[1].value;
	var b = args[2].value;


	var state;

	console.log("going to set rgb " + r + " " + g + " " + b);

	state = lightState.create().on().rgb(r, g, b);

	try{
		api.setLightState(2, state)
  			.done();
	}catch(e){
		console.log("error");
		console.log(e);
	}
}