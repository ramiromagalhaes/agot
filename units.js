function Unit(controller) {
	this.routed = false;
	this.controller = controller;
}
Unit.prototype.strength = function() {};


function Footman(controller) {
	Unit.call(this, controller);
}
Footman.prototype = new Unit();
Footman.prototype.constructor = Footman;
Footman.prototype.strength = function() {
	return 1;
};


function Knight(controller) {
	Unit.call(this, controller);
}
Knight.prototype = new Unit();
Knight.prototype.constructor = Knight;
Knight.prototype.strength = function() {
	return 2;
};


function Ship(controller) {
	Unit.call(this, controller);
}
Ship.prototype = new Unit();
Ship.prototype.constructor = Ship;
Ship.prototype.strength = function() {
	return 1;
};


function Siege(controller) {
	Unit.call(this, controller);
}
Siege.prototype = new Unit();
Siege.prototype.constructor = Siege;
Siege.prototype.strength = function(embattledArea) {
	if (embattledArea.castle === 0) {
		return 0;
	} else {
		return 4;
	}
};


function Garrison(controller, strength) {
	Unit.call(this, controller);
	this.garrisonStrength = strength; //-1 = infinity
}
Garrison.prototype = new Unit();
Garrison.prototype.constructor = Garrison;
Garrison.prototype.strength = function() {
	return this.garrisonStrength;
};



function Army(units) {
	this.units = units;
	this.controller = units[0].controller;
	for (var i = 1; i < units.length; i++) {
		if (units[i].controller.name === this.controller.name) {
			continue;
		}
		throw 'All units in an Army should be controlled by the same house.';
	}


	this.strength = function(embattledArea) {
		var armyStrength = 0;
		for (var i = 0; i < this.units.length; i++) {
			armyStrength += this.units[i].strength(embattledArea);
		}
		return armyStrength;
	};

	this.size = function() {
		return this.units.length;
	};
}



