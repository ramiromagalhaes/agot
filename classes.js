function Game(id, amountPlayers) {
	this.id = 0;
	this.players = new Array(0);
	this.gameStats = new GameStats(amountPlayers);
	this.board = new Board();
	this.allowedHousesArray = new Array(
		['Stark', 'Lannister', 'Baratheon'],
		['Stark', 'Lannister', 'Baratheon', 'Greyjoy'],
		['Stark', 'Lannister', 'Baratheon', 'Greyjoy', 'Tyrell'],
		['Stark', 'Lannister', 'Baratheon', 'Greyjoy', 'Tyrell', 'Martell']
	);

	if (amountPlayers >= 3 && amountPlayers <= 6) {
		this.players = new Array(amountPlayers);
	} else {
		throw 'At least 3 and at most 6 players can play this game.';
	}

	this.allowedHouses = function() {
		var index = this.players.length - 3;
		if (index < 0 || index > 3) {
			throw 'Impossible to determine the allowed houses since the amount of players is illegal.';
		}

		return this.allowedHousesArray[index];
	};

	this.getPlayers = function() {
		return this.players.length;
	};

	this.addPlayer = function(player) {
		if (this.allowedHouses().indexOf(player.house.name) === -1) {
			throw 'No player can choose house ' + player.house.name + ' in a game with ' + this.getPlayers() + ' players.';
		}

		for (var i = 0; i < this.players.length; i++) {
			if (typeof(this.players[i]) === 'undefined') {
				continue;
			}
			if (this.players[i].name == player.name) {
				throw 'A player named ' + player.name + ' was already added to the game.';
			}
			if (this.players[i].house == player.house) {
				throw 'Another player already chose to play with house ' + player.house.name;
			}
		}

		for (var i = 0; i < this.players.length; i++) {
			if (this.players[i] === null || typeof(this.players[i]) === 'undefined') {
				this.players[i] = player;
				break;
			}
		}
	};
}



function Player(name, house) {
	this.name = name;
	this.house = house;
	this.powerTokens = 5;
	this.ironThrone = 0; //-1 not yours, 0 unused, 1 used
	this.sword = 0;
	this.raven = 0;

	if (this.house.defaultIronThrone == 1) {
		this.ironThrone = 0;
	} else {
		this.ironThrone = -1;
	}

	if (this.house.defaultFiefdom == 1) {
		this.sword = 0;
	} else {
		this.sword = -1;
	}

	if (this.house.defaultKingsCourt == 1) {
		this.raven = 0;
	} else {
		this.raven = -1;
	}

	this.playSword = function() {
		if (this.sword === 1) {
			throw 'Player ' + this.name + ' cannot use the sword because he has already used it.'
		}
		if (this.sword === -1) {
			throw 'Player ' + this.name + ' cannot use the sword because he does not own it.'
		}

		this.sword = 1;
		//todo use sword
	};

	this.playRaven = function() {
		if (this.raven === 1) {
			throw 'Player ' + this.name + ' cannot use the raven because he has already used it.'
		}
		if (this.raven === -1) {
			throw 'Player ' + this.name + ' cannot use the raven because he does not own it.'
		}

		this.raven = 1;
		//todo use raven
	};

	this.discardPower = function(amount) {
		this.powerTokens -= amount;
		if (this.powerTokens < 0) {
			this.powerTokens = 0;
		}
	}

	this.usePower = function(amount) {
		if (amount < 0) {
			throw 'You can only use 0 or more Power tokens.';
		}

		if (this.powerTokens < amount) {
			throw 'You don\'t have ' + amount + ' Power tokens to spare (you have ' + this.powerTokens + ').';
		}

		this.powerTokens -= amount;
	};

	this.gainPower = function(amount) {
		if (amount < 0) {
			throw 'You can only gain 0 or more Power tokens.';
		}

		this.powerTokens += amount;
	};

}



function SingleRankTracker(amountPlayers) {
	this.amountPlayers = amountPlayers;
	this.rank = new Array(6); //todo rank is storing Houses. Should it store Players instead?

	this.setPosition = function(position, house) {
		this.rank[position] = house;
	};

	this.moveToLastPosition = function(house) {
		for (var i = 0; i < this.rank.length; i++) {
			if (this.rank[i] === null || typeof(this.rank[i]) === 'undefined') {
				continue;
			}
			if (this.rank[i].name === house.name) {
				this.rank[i] = null;
				this.rank.push(house);
				break;
			}
		}

		this.consolidate();
	}

	this.moveToFirstPosition = function(house) {
		var j = 1;
		var newRank = new Array(this.amountPlayers);

		newRank[0] = house;

		for (var i = 1; i < this.rank.length; i++) {
			if (this.rank[i] === null || typeof(this.rank[i]) === 'undefined') {
				continue;
			}
			if (this.rank[i].name === house.name) {
				continue;
			}

			newRank[j++] = this.rank[i];
		}
		this.rank = newRank;
	}

	this.consolidate = function() {
		var j = 0;
		var newRank = new Array(this.amountPlayers);
		for (var i = 0; i < this.rank.length; i++) {
			if (this.rank[i] === null || typeof(this.rank[i]) === 'undefined') {
				continue;
			}

			newRank[j++] = this.rank[i];
		}
		this.rank = newRank;
	};

	this.getRank = function() {
		this.consolidate();
		return this.rank;
	};
};



function MultiRankTracker(minPosition, maxPosition) {
	this.minimum = minPosition;
	this.maximum = maxPosition;
	this.rank = new Array(this.maximum - this.minimum + 1);

	//this is supposed to be a private method
	this.findHouseOnTrack = function(house) {
		for (var i = 0; i <= this.rank.length; i++) {
			if (this.rank[i] === null || typeof(this.rank[i]) === 'undefined') {
				continue;
			}

			for (var j = 0; j < this.rank[i].length; j++) {
				if (this.rank[i][j].name === house.name) {
					return new Array(i, j); //i is the array position on the track; j is the house index array on that track;
				}
			}
		}

		return -1;
	};

	//this is supposed to be a private method
	//returns the equivalent array index of a position.
	this.checkPosition = function(position) {
		if (position < this.minPosition) {
			return 0;
		} else if (position > this.maxPosition) {
			return this.maxPosition - this.minPosition + 1;
		}

		return position - this.minPosition;
	};

	//this is supposed to be a private method
	this.putHouseInPosition = function(index, house) {
		if (this.rank[index] === null || typeof(this.rank[index]) === 'undefined') {
			this.rank[index] = new Array();
		}
		this.rank[index].push(house);
	};

	//this is supposed to be a private method
	//remove a house from a position to another
	this.moveHouse = function(fromIndexes, toIndex) {
		var house = this.rank[fromIndexes[0]][fromIndexes[1]];

		this.rank[fromIndexes[0]] =
			this.rank[fromIndexes[0]].slice(0, fromIndexes[1]).concat(
				this.rank[fromIndexes[0]].slice(fromIndexes[1] + 1)
			);
		this.putHouseInPosition(toIndex, house);
	};

	this.setPositionOfHouse = function(position, house) {
		var indexes = this.findHouseOnTrack(house);
		if (indexes === -1) {
			//house not yet added to the track. just add it.
			var index = this.checkPosition(position);
			this.putHouseInPosition(index, house);
		} else {
			this.moveHouse(indexes, position);
		}
	};

	this.movePositionOfHouse = function(amount, house) {
		var indexes = this.findHouseOnTrack(house);
		var position = this.checkPosition(indexes[0] + this.minPosition);
		this.moveHouse(indexes, position);
	};

	this.getPositionOfHouse = function(house) {
		var indexes = this.findHouseOnTrack(house);

		if (indexes === -1) {
			throw 'House ' + house.name + ' is not on the track.';
		}

		return indexes[0] + this.minimum;
	};

	this.getHousesInPosition = function(position) {
		if (position < this.minimum || position > this.maximum) {
			throw 'The track ranges from ' + this.minimum + ' to ' + this.maximum + '.';
		}

		return this.rank[position - this.minimum];
	};

}



function GameStats(amountPlayers) {
	this.wildlings = 0;
	this.ironThrone = new SingleRankTracker(amountPlayers);
	this.fiefdom = new SingleRankTracker(amountPlayers);
	this.kingsCourt = new SingleRankTracker(amountPlayers);

	this.victory = new MultiRankTracker(1, 7);
	this.supply = new MultiRankTracker(0, 6);

	this.setSupply = function(supply, house) {
		this.supply.setPositionOfHouse(supply, house);
	};

	this.getSupplyOfHouse = function(house) {
		return this.supply.getPositionOfHouse(house);
	};

	this.setVictory = function(victory, house) {
		this.victory.setPositionOfHouse(victory, house);
	};

	this.getVictoryOfHouse = function(house) {
		return this.victory.getPositionOfHouse(house);
	};
}



function House(name, defaultIronThrone, defaultFiefdom, defaultKingsCourt, defaultSupply, defaultVictory, cards) {
	this.name = name;
	this.defaultIronThrone = defaultIronThrone;
	this.defaultFiefdom = defaultFiefdom;
	this.defaultKingsCourt = defaultKingsCourt;
	this.defaultSupply = defaultSupply;
	this.defaultVictory = defaultVictory;
	this.cards = cards;
}



function Area(name, type, supply, power, castle, hasPort, defaultController) {
	this.id = 0; //used to index this Area in the Board.

	this.name = name;
	this.type = type; //0 = land, 1 = sea, -1 port
	//ports will be treated like a normal area, but with special features

	this.supply = supply;
	this.power = power;
	this.castle = castle; //0 = none, 1 = castle, 2 = stronghold

	if (typeof(defaultController) === 'undefined') {
		this.defaultController = null;
	} else {
		this.defaultController = defaultController;
	}

	this.hasDefaultController = function() {
		return this.defaultController != null;
	}
}



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
	this.garrisonStrength = strength;
}
Garrison.prototype = new Unit();
Garrison.prototype.constructor = Garrison;
Garrison.prototype.strength = function() {
	return this.garrisonStrength;
};



function Army(units) {
	this.controller = units[0].controller;
	for (var i = 1; i < units.length; i++) {
		if (units[i].controller.name === this.controller.name) {
			continue;
		}
		throw 'All units in an Army should be controlled by the same house.';
	}
	this.units = units;


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

function Board() {
	this.areaCount = 50; //12 sea, 38 land
	this.areas = new Array();
	this.adjacency = new Array(); //big matrix telling what is adjacent to what
	this.occupations = new Array(); //what units are in a certain area. Army or 1 Unit.

	for (var i = 0; i < this.areaCount; i++) {
		this.adjacency.push(new Array(this.areaCount));
	}

	this.addArea = function(area) {
		area.id = this.areas.length; //the area's id is the area's index on the array
		this.areas.push(area);
		this.occupations.push(null);
	};

	this.setAdjacency = function(area, adjacents) {
		for (var i = 0; i < adjacents.length; i++) {
			this.adjacency[area.id][adjacents[i].id] = true;
			this.adjacency[adjacents[i].id][area.id] = true;
		}
	};

	this.isOccupied = function(area) {
		var occupier = this.occupations[area.id];
		if (occupier == null || typeof(occupier) === 'undefined') {
			return false;
		}

		return true;
	};

	this.hasController = function(area) {
		if ( this.isOccupied(area) ) {
			return true;
		} else if ( this.areas[area.id].hasDefaultController() ) {
			return true;
		}

		return false;
	};

	this.getController = function(area) {
		if ( this.hasController(area) ) {
			return this.occupations[area.id];
		}

		return null;
	};

	this.setOccupiers = function(area, units) {
		if ( this.isOccupied(area) ) {
			//todo throw error?
		} else {
			this.occupations[area.id] = units;
		}
	};

}



function GameStateMachine(game) {
	this.game = game;
	this.currentState = null; //setup, westeros (1, 2, 3, wildlings), assign orders, execute orders (raid, march, combat, consolidate, cleanup)

	this.fireEvent = function(event, params) { //event should be the function name to call on the state
		this.currentState = this.currentState[event](params);
	}

}



//Got some info about inheritance from:
//  HOT - http://www.coolpage.com/developer/javascript/Correct%20OOP%20for%20Javascript.html
//	http://blog.jcoglan.com/2007/07/23/writing-a-linked-list-in-javascript/
//	http://phrogz.net/js/classes/OOPinJS2.html



//Nice tips about other stuff
//  http://aymanh.com/9-javascript-tips-you-may-not-know/

function GameState(machine, stateName) {
	this.stateMachine = machine;
	this.name = stateName;
};



function Setup3PlayerGame(machine) {
	GameState.call(this, machine, '3 player game setup');
};
Setup3PlayerGame.prototype = new GameState();
Setup3PlayerGame.prototype.constructor = Setup3PlayerGame;
Setup3PlayerGame.prototype.setGameStats = function() {
	var game = this.stateMachine.game;
	var gameStats = game.gameStats;

	for (var i = 0; i < game.getPlayers(); i++) {
		var theHouse = game.players[i].house;

		gameStats.ironThrone.setPosition(theHouse.defaultIronThrone, theHouse);
		gameStats.fiefdom.setPosition(theHouse.defaultFiefdom, theHouse);
		gameStats.kingsCourt.setPosition(theHouse.defaultKingsCourt, theHouse);
		gameStats.setSupply(theHouse.defaultSupply, theHouse);
		gameStats.setVictory(theHouse.defaultVictory, theHouse);
	}
};
Setup3PlayerGame.prototype.setupBaratheonUnits = function() {
	var board = this.stateMachine.game.board;
	var players = this.stateMachine.game.players;

	board.setOccupiers(dragonstone,
		new Army([
			new Knight(baratheon),
			new Footman(baratheon),
			new Garrison(baratheon, 2)
		])
	);
	board.setOccupiers(shipbreakerBay,
		new Army([
			new Ship(baratheon),
			new Ship(baratheon)
		])
	);
	board.setOccupiers(kingswood,
		new Footman(baratheon)
	);
};
Setup3PlayerGame.prototype.setupLannisterUnits = function() {
	var board = this.stateMachine.game.board;
	var players = this.stateMachine.game.players;

	board.setOccupiers(goldenSound,
		new Ship(lannister)
	);
	board.setOccupiers(lannisport,
		new Army([
			new Knight(lannister),
			new Footman(lannister),
			new Garrison(lannister, 2)
		])
	);
	board.setOccupiers(stoneySept,
		new Footman(lannister)
	);
};
Setup3PlayerGame.prototype.setupStarkUnits = function() {
	var board = this.stateMachine.game.board;
	var players = this.stateMachine.game.players;

	board.setOccupiers(shiveringSea,
		new Ship(stark)
	);
	board.setOccupiers(winterfell,
		new Army([
			new Knight(stark),
			new Footman(stark),
			new Garrison(stark, 2)
		])
	);
	board.setOccupiers(whiteHarbor,
		new Footman(stark)
	);

};
Setup3PlayerGame.prototype.start = function() {
	this.setGameStats();
	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();
	//setup the garrisons and neutrals
	//setup players units

	return null;
};



function Setup4PlayerGame(machine) {
	GameState.call(this, machine, '4 player game setup');
};
Setup4PlayerGame.prototype = new Setup3PlayerGame();
Setup4PlayerGame.prototype.constructor = Setup4PlayerGame;
Setup4PlayerGame.prototype.setupGreyjoyUnits = function() {
	var board = this.stateMachine.game.board;
	var players = this.stateMachine.game.players;

	board.setOccupiers(ironmansBay,
		new Ship(greyjoy)
	);
	board.setOccupiers(ironmansBay, //todo need an area named Pike port to put unit on it
		new Ship(greyjoy)
	);
	board.setOccupiers(pike,
		new Army([
			new Knight(greyjoy),
			new Footman(greyjoy),
			new Garrison(greyjoy, 2)
		])
	);
	board.setOccupiers(greywaterWatch,
		new Footman(greyjoy)
	);
};
Setup4PlayerGame.prototype.start = function() {
	this.setGameStats();

	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();
	this.setupGreyjoyUnits();

	return null;
};



function Setup5PlayerGame(machine) {
	GameState.call(this, machine, '5 player game setup');
};
Setup5PlayerGame.prototype = new Setup4PlayerGame();
Setup5PlayerGame.prototype.constructor = Setup5PlayerGame;
Setup5PlayerGame.prototype.setupTyrellUnits = function() {
	var board = this.stateMachine.game.board;
	var players = this.stateMachine.game.players;

	board.setOccupiers(highgarden,
		new Army([
			new Knight(tyrell),
			new Footman(tyrell),
			new Garrison(tyrell, 2)
		])
	);
	board.setOccupiers(redwyneStraights,
		new Ship(greyjoy)
	);
	board.setOccupiers(dornishMarches,
		new Footman(greyjoy)
	);

};
Setup5PlayerGame.prototype.start = function() {
	this.setGameStats();

	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();
	this.setupGreyjoyUnits();
	this.setupTyrellUnits();

	return null;
};



function Setup6PlayerGame(machine) {
	GameState.call(this, machine, '6 player game setup');
};
Setup6PlayerGame.prototype = new Setup5PlayerGame();
Setup6PlayerGame.prototype.constructor = Setup6PlayerGame;
Setup6PlayerGame.prototype.setupMartellUnits = function() {
	var board = this.stateMachine.game.board;
	var players = this.stateMachine.game.players;

	board.setOccupiers(seaOfDorne,
		new Ship(martell)
	);
	board.setOccupiers(sunspear,
		new Army([
			new Knight(martell),
			new Footman(martell),
			new Garrison(martell, 2)
		])
	);
	board.setOccupiers(saltShore,
		new Footman(martell)
	);
};
Setup6PlayerGame.prototype.start = function() {
	this.setGameStats();

	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();
	this.setupGreyjoyUnits();
	this.setupTyrellUnits();
	this.setupMartellUnits();

	return null;
};



function WesterosState() {
	this.deckToDraw = 0;

	this.start = function() {
		this.deckToDraw++;

		//draw from deck #this.deckToDraw
		//resolve card

		if (this.deckToDraw >= 3) {
			westerosState.deckToDraw = 0;
			return assignState;
		} else {
			return westerosState;
		}
	};
}



function AssignState() {
	this.playersDone = new Array();

	this.isDone = function() {
		return this.playersDone.length === this.stateMachine.game.players.length;
	}

	this.start = function() {
		if (this.isDone()) {
			//receive player orders
			//checks if all possible orders were correctly given
			return null;
		} else {
			//ask players for their orders
			return null;
		}
	};

	this.playerDone = function(player) { //todo find a way to notify that a certain player is done and pass it as parameter
		for (var i = 0; i < this.stateMachine.game.players.length; i++) {
			if (this.playersDone[i].name === player.name) {
				return null;
			}
		}

		this.playersDone.push(player);
		return this.start(); //todo should I, instead of calling this here, post a 'start' event on the StateMachine and let it consume the event?
	};

}



function AssignState() {
	this.start = function() {
		//reveal orders
		//can a player use Raven? Ask what if he wants to use it and what for.
		this.ravenUsage(); //todo should I, instead of calling this here, post an event on the StateMachine and let it consume it?
		return null;
	};

	this.ravenUsage = function(use) { //0 (or anything else) == no; 1 == yes, change order; -1 == yes, view next wilding card
		if (use === 1) {
			//allow player to change one of his orders
		} else if (use === -1) {
			//show next wildling to player
		}

		return this.postRaven(); //todo should I, instead of calling this here, post an event on the StateMachine and let it consume it?
	};

	this.postRaven = function() {
		//in player order
		//	execute raid orders
		//	execute march orders (no combat/with combat - add power, use house cards, use sword, add final power, resolve victory, retreat)
		//	execute consolidate power orders
		//	more orders?
		//		yes - repeat
		//		no  - cleanup
		return null;
	};

}
