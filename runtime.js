// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.BehaviorTree = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.BehaviorTree.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;


	
	
	behtypeProto.onCreate = function()
	{
		
		function nodeTick(tick) {
			var target = tick.target;
			var taskname = this.title;
			target.taskName = taskname
			console.log(target.inst.uid)
			cr_getC2Runtime().trigger(cr.behaviors.BehaviorTree.prototype.cnds.onTask, target.inst);
			var res = target.lastResponse;
			//console.log("construct says",res);
			if(res=="SUCCESS") {
				console.log("returning SUCCESS",b3.SUCCESS);
				return b3.SUCCESS;
			} else if (res=="FAILURE") {
				console.log("returning FAILURE",b3.FAILURE);
				return b3.FAILURE;
			}
			console.log("returning RUNNING",b3.RUNNING);
			return b3.RUNNING;
				
		}
		
		var C2Node = b3.Class(b3.Action);
		C2Node.prototype.name = 'c2Node';
		C2Node.prototype.tick = nodeTick;
		b3.c2Node = C2Node;
		
		
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	
	
	
	behinstProto.onCreate = function()
	{
		// Load properties
		this.btname = this.properties[0];
		this.lastResponse = "";
		this.taskName = "";
		this.blackboard = new b3.Blackboard();
		
		var that = this;
		$.getJSON(this.btname+'.json',function(treedata){
			that.tree = new b3.BehaviorTree();
			that.tree.load(treedata);
		})
		
	
			
			
			
			
		
	};
	
	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your behavior's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": this.type.name,
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				{"name": "Behavior Tree name", "value": this.btname}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "Behavior Tree name")
			this.btname = value;
	};
	/**END-PREVIEWONLY**/

	
	


	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.onTask = function (taskName)
	{
		
		return (this.taskName==taskName);
		// ... see other behaviors for example implementations ...
		
		//return false;
	};
	

	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.returnSuccess = function ()
	{
		// ... see other behaviors for example implementations ...
		this.lastResponse = "SUCCESS";
	};
	
	Acts.prototype.returnFailure = function ()
	{
		this.lastResponse = "FAILURE";
		// ... see other behaviors for example implementations ...
	};
	
	Acts.prototype.returnRunning = function ()
	{
		this.lastResponse = "RUNNING";
		// ... see other behaviors for example implementations ...
	};
	
	Acts.prototype.tickMe = function ()
	{
		this.tree.tick(this, this.blackboard);
	};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	//Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	//{
	//	ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	// };
	
	// ... other expressions here ...
	
	behaviorProto.exps = new Exps();
	
}());