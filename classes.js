function Game(id, amountPlayers) {
	this.id = 0;
	this.amountPlayers = amountPlayers;
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

	this.discardPower = function(amount) {
		this.powerTokens -= amount;
		if (this.powerTokens < 0) {
			this.powerTokens = 0;
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
	};

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

	this.getFirst = function() {
		this.consolidate();
		return this.rank[0];
	};

}



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
		if (position <= this.minimum) {
			return 0;
		} else if (position >= this.maximum) {
			return this.maximum - this.minimum + 1;
		}

		return position - this.minimum;
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

		this.rank[fromIndexes[0]].splice(fromIndexes[1], 1);
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
		var newIndex = this.checkPosition(indexes[0] + this.minPosition + amount);
		this.moveHouse(indexes, newIndex);
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

	this.swordUsed = false;
	this.ravenUsed = false;

	this.ironThrone = new SingleRankTracker(amountPlayers);
	this.fiefdom = new SingleRankTracker(amountPlayers);
	this.kingsCourt = new SingleRankTracker(amountPlayers);

	this.victory = new MultiRankTracker(1, 7);
	this.supply = new MultiRankTracker(0, 6);


	this.isSwordUsable = function() {
		return !this.swordUsed;
	};

	this.isRavenUsable = function() {
		return !this.ravenUsed;
	};

	this.ownsIronThrone = function(house) {
		return house.name === this.ironThrone.getFirst().name;
	};

	this.ownsSword = function(house) {
		return house.name === this.fiefdom.getFirst().name;
	};

	this.ownsRaven = function(house) {
		return house.name === this.kingsCourt.getFirst().name;
	};

	this.ironThroneStatusText = function(house) {
		if ( this.ownsIronThrone(house) ) {
			return 'yours';
		} else {
			return 'not yours';
		}
	};

	this.swordStatusText = function(house) {
		var text = '';
		if ( this.isSwordUsable() ) {
			text += 'unused';
		} else {
			text += 'used';
		}
		if ( !this.ownsSword(house) ) {
			text += ' (not yours)';
		}
		return text;
	};

	this.ravenStatusText = function(house) {
		var text = '';
		if ( this.isRavenUsable() ) {
			text += 'unused';
		} else {
			text += 'used';
		}
		if ( !this.ownsRaven(house) ) {
			text += ' (not yours)';
		}
		return text;
	};


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



function GameStateMachine(game) {
	this.game = game;
	this.currentState = null; //setup, westeros (1, 2, 3, wildlings), assign orders, execute orders (raid, march, combat, consolidate, cleanup)

	switch (this.game.amountPlayers) {
		case 3:
			this.currentState = new Setup3PlayerGame(this);
			break;
		case 4:
			this.currentState = new Setup4PlayerGame(this);
			break;
		case 5:
			this.currentState = new Setup5PlayerGame(this);
			break;
		case 6:
			this.currentState = new Setup6PlayerGame(this);
			break;
	}

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
Setup3PlayerGame.prototype.setupNeutrals = function() {
	var board = this.stateMachine.game.board;
	board.setOccupiers(kingsLanding, new Garrison(noHouse, 5));
	board.setOccupiers(pike, new Garrison(noHouse, -1));
	board.setOccupiers(boneway, new Garrison(noHouse, -1));
	board.setOccupiers(yronwood, new Garrison(noHouse, -1));
	board.setOccupiers(eyrie, new Garrison(noHouse, 6));
	board.setOccupiers(highgarden, new Garrison(noHouse, -1));
	board.setOccupiers(threeTowers, new Garrison(noHouse, -1));
	board.setOccupiers(sunspear, new Garrison(noHouse, -1));
	board.setOccupiers(princesPass, new Garrison(noHouse, -1));
	board.setOccupiers(starfall, new Garrison(noHouse, -1));
	board.setOccupiers(saltShore, new Garrison(noHouse, -1));
	board.setOccupiers(stormsEnd, new Garrison(noHouse, -1));
	board.setOccupiers(dornishMarches, new Garrison(noHouse, -1));
	board.setOccupiers(oldtown, new Garrison(noHouse, -1));
};
Setup3PlayerGame.prototype.start = function() {
	this.setGameStats();

	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();

	this.setupNeutrals();

	//todo setup king's court overlay

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
Setup4PlayerGame.prototype.setupNeutrals = function() {
	var board = this.stateMachine.game.board;
	board.setOccupiers(kingsLanding, new Garrison(noHouse, 5));
	board.setOccupiers(boneway, new Garrison(noHouse, 3));
	board.setOccupiers(yronwood, new Garrison(noHouse, 3));
	board.setOccupiers(eyrie, new Garrison(noHouse, 6));
	board.setOccupiers(threeTowers, new Garrison(noHouse, 3));
	board.setOccupiers(sunspear, new Garrison(noHouse, 5));
	board.setOccupiers(princesPass, new Garrison(noHouse, 3));
	board.setOccupiers(starfall, new Garrison(noHouse, 3));
	board.setOccupiers(saltShore, new Garrison(noHouse, 3));
	board.setOccupiers(stormsEnd, new Garrison(noHouse, 4));
	board.setOccupiers(dornishMarches, new Garrison(noHouse, 3));
	board.setOccupiers(oldtown, new Garrison(noHouse, 3));
};
Setup4PlayerGame.prototype.start = function() {
	this.setGameStats();

	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();
	this.setupGreyjoyUnits();

	this.setupNeutrals();
	//setup king's court overlay

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
Setup5PlayerGame.prototype.setupNeutrals = function() {
	var board = this.stateMachine.game.board;
	board.setOccupiers(kingsLanding, new Garrison(noHouse, 5));
	board.setOccupiers(boneway, new Garrison(noHouse, 3));
	board.setOccupiers(yronwood, new Garrison(noHouse, 3));
	board.setOccupiers(eyrie, new Garrison(noHouse, 6));
	board.setOccupiers(threeTowers, new Garrison(noHouse, 3));
	board.setOccupiers(sunspear, new Garrison(noHouse, 5));
	board.setOccupiers(princesPass, new Garrison(noHouse, 3));
	board.setOccupiers(starfall, new Garrison(noHouse, 3));
	board.setOccupiers(saltShore, new Garrison(noHouse, 3));
};
Setup5PlayerGame.prototype.start = function() {
	this.setGameStats();

	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();
	this.setupGreyjoyUnits();
	this.setupTyrellUnits();

	this.setupNeutrals();
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
Setup6PlayerGame.prototype.setupNeutrals = function() {
	var board = this.stateMachine.game.board;
	board.setOccupiers(kingsLanding, new Garrison(noHouse, 5));
	board.setOccupiers(eyrie, new Garrison(noHouse, 6));
};
Setup6PlayerGame.prototype.start = function() {
	this.setGameStats();

	this.setupBaratheonUnits();
	this.setupLannisterUnits();
	this.setupStarkUnits();
	this.setupGreyjoyUnits();
	this.setupTyrellUnits();
	this.setupMartellUnits();

	this.setupNeutrals();

	return null;
};



function WesterosState(machine, decks) { //should receive an array of the 3 westeros decks
	this.decks = decks;
	this.stateMachine = machine;

	this.start = function() {
		var cards = new Array(
			this.decks[0].draw(),
			this.decks[1].draw(),
			this.decks[2].draw()
		);

		//todo show cards to players

		for (var i = 0; i < cards.length; i++) {
			this.stateMachine.gameStats.wildlings += cards[i].wildling * 2;

			//todo cards[i].takeEffect();
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
			//checks if all possible orders were correctly given (starred orders, all units got orders, no orders give to somewhere else)
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



function Deck() {
	this.deck = new Array();
	this.discarded = new Array();

	this.add = function(card) {
		this.deck.push(card);
	};

	this.peek = function() {
		return this.deck[this.deck.length - 1];
	};

	this.draw = function() {
		var card = this.deck.pop();
		this.discarded.push(card);
		return card;
	};

	this.shuffle = function() {
		var tempDeck = new Array();
		for (var i = this.deck.length; i > 0; i--) {
			var randIndex = (Math.random() * this.deck.length) % this.deck.length; //the extra modulus is to avoid problems when the array size is 0.
			var randomCard = this.deck.splice(randIndex, 1);
			tempDeck.push(randomCard);
		}
		this.deck = tempDeck;
	};

	this.resetAndShuffle = function() {
		this.deck = this.deck.concat(this.discarded);
		this.suffle();
	};
}
