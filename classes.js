function Game(id, amountPlayers) {
	this.id = 0;
	this.players = new Array(0);
	this.gameStats = new GameStats(amountPlayers);
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
			throw 'No player can choose house ' + player.house.name + ' in a game with ' + this.getPlayers() + ' players.'; //todo message should say what houses are allowed
		}
		if (this.players.indexOf(player) >= 0) { //todo fixme this 'if' is not working
			throw 'Player ' + player.name + ' was already added to the game.';
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
		if (this.sword != 0) {
			throw 'You cannot use the sword because you don\'t own it or it has already been used.';
		}
	};

	this.playRaven = function() {
		if (this.raven != 0) {
			throw 'You cannot use the raven because you don\'t own it or it has already been used.';
		}
	};

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
	this.rank = new Array(6);

	this.setPosition = function(position, house) {
		this.rank[position] = house;
	};

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
	this.putHouseInPosition = function(amount, house) {
		if (this.rank[amount] === null || typeof(this.rank[amount]) === 'undefined') {
			this.rank[amount] = new Array();
		}
		this.rank[amount].push(house);
	};

	this.setPosition = function(amount, house) {
		var indexes = this.findHouseOnTrack(house);
		if (indexes === -1) {
			//house not yet added to the track. just add it.
			this.putHouseInPosition(amount, house);
		} else {
			//house already on track: remove it first, then add it on the right place
			this.rank[indexes[0]] =
				this.rank[indexes[0]].slice(0, indexes[1]).concat(
					this.rank[indexes[0]].slice(indexes[1] + 1)
				);
			this.putHouseInPosition(amount, house);
		}
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
		this.supply.setPosition(supply, house);
	};

	this.getSupplyOfHouse = function(house) {
		return this.supply.getPositionOfHouse(house);
	};

	this.setVictory = function(victory, house) {
		this.victory.setPosition(victory, house);
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



function Occupation(area, occupiers) {
	this.area = null;
	this.occupiers = null;
	this.house = null; //occupant house
}



function Board() {
	this.areaCount = 50; //12 sea, 38 land = 50
	this.areas = new Array();
	this.adjacency = new Array();
	this.occupations = new Array();

	for (var i = 0; i < this.areaCount; i++) {
		this.adjacency.push(new Array(this.areaCount));
	}

	this.addArea = function(area) {
		area.id = this.areas.length;
		this.areas.push(area);
	};

	this.setAdjacency = function(area, adjacents) {
		for (var i = 0; i < adjacents.length; i++) {
			this.adjacency[area.id][adjacents[i].id] = true;
			this.adjacency[adjacents[i].id][area.id] = true;
		}
	};

	this.addOccupation = function(occupation) {
		//todo lots of checks and verifications
		this.occupations.push(occupation);
	};
}



function Area(name, type, supply, power, castle, hasPort, defaultController) {
	this.id = 0; //used to index this Area in the Board.

	this.name = name;
	this.type = type; //0 = land, 1 = sea, -1 port
	//ports will be treated like a normal area, but with special features

	this.supply = supply;
	this.power = power;
	this.castle = castle; //0 = none, 1 = castle, 2 = stronghold

	if(typeof(defaultController)==='undefined') {
		defaultController = null;
	} else {
		this.defaultController = defaultController;
	}
}



function Unit(type, controller) {
	this.routed = false;
	this.controller = controller;
}

function Footman() {};
Footman.prototype = new Unit();
Footman.prototype.constructor = Unit;
Footman.prototype.strength = function() {
	return 1;
};

function Knight() {};
Knight.prototype = new Unit();
Knight.prototype.constructor = Unit;
Knight.prototype.strength = function() {
	return 2;
};

function Ship() {};
Ship.prototype = new Unit();
Ship.prototype.constructor = Unit;
Ship.prototype.strength = function() {
	return 1;
};

function Siege() {};
Siege.prototype = new Unit();
Siege.prototype.constructor = Unit;
Siege.prototype.strength = function(embattledArea) {
	if (embattledArea.castle === 0) {
		return 0;
	} else {
		return 4;
	}
};

function Garrison(strength) {
	this.strength = strength;
};
Garrison.prototype = new Unit();
Garrison.prototype.constructor = Garrison;
Garrison.prototype.strength = function() {
	return this.strength;
};



function Army() {
	this.units = new Array();
}
Army.prototype = new Unit();
Army.prototype.constructor = Army;
Army.prototype.strength = function(embattledArea) {
	var armyStrength = 0;
	for (var i = 0; i < this.units.length; i++) {
		armyStrength += this.units[i].strength(embattledArea);
	}
	return armyStrength;
};
Army.prototype.size = function() {
	this.units.length;
};



function HouseCard(name, power, swords, towers, text, effect) {
	this.name = name;
	this.power = power;
	this.swords = swords;
	this.towers = towers;
	this.text = text;
	this.effect = effect;
	this.available = true;

	//Plays the card
	this.play = function() {
		this.effect();
		this.available = false;
	};
}



function WesterosCard(name, wildling, text) {
	this.name = name;
	this.wildling = wildling;
	this.text = text;
}



function WildlingCard(name, lowestBidderText, everyoneElseText, highestBidderText) {
	this.name = name;
	this.lowestBidderText = lowestBidderText;
	this.everyoneElseText = everyoneElseText;
	this.highestBidderText = highestBidderText;
}



function GameStateMachine(game) {
	this.game = game;
	this.currentState = null; //setup, westeros (1, 2, 3, wildlings), assign orders, execute orders (raid, march, combat, consolidate, cleanup)

	this.fireEvent = function(event, params) { //event should be the function name to call on the state
		this.currentState = this.currentState[event](params);
	}

}



//Got some info about inheritance from:
//	http://blog.jcoglan.com/2007/07/23/writing-a-linked-list-in-javascript/
//	http://phrogz.net/js/classes/OOPinJS2.html



function GameState(machine, stateName) {
	this.stateMachine = machine;
	this.name = stateName;
};



function Setup3PlayerGame() {};
Setup3PlayerGame.prototype = new GameState();
Setup3PlayerGame.prototype.constructor = Setup3PlayerGame;
Setup3PlayerGame.prototype.setGameStats = function() {
	var game = stateMachine.game;
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
Setup3PlayerGame.prototype.start = function() {
	this.setGameStats();

	//setup the garrisons and neutrals
	//setup players units

	return null;
};



function Setup4PlayerGame() {};
Setup4PlayerGame.prototype = new Setup3PlayerGame();
Setup4PlayerGame.prototype.constructor = Setup4PlayerGame;
Setup4PlayerGame.prototype.start = function() {
	this.setGameStats();

	return null;
};



function Setup5PlayerGame() {};
Setup5PlayerGame.prototype = new Setup3PlayerGame();
Setup5PlayerGame.prototype.constructor = Setup5PlayerGame;
Setup5PlayerGame.prototype.start = function() {
	this.setGameStats();

	return null;
};



function Setup6PlayerGame() {};
Setup6PlayerGame.prototype = new Setup3PlayerGame();
Setup6PlayerGame.prototype.constructor = Setup6PlayerGame;
Setup6PlayerGame.prototype.start = function() {
	this.setGameStats();

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
