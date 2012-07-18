function Game(id, amountPlayers) {
	this.id = 0;
	this.amountPlayers = amountPlayers;
	this.players = new Array(0);
	this.gameStats = new GameStats(amountPlayers);
	this.board = board; //todo how shall I initiate the board? Is like this ok?
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
	this.maxPower = 20;

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

		if (this.powerTokens > this.maxPower) {
			this.maxPower = 20;
		}
	};

}



function GameStats(amountPlayers) {
	this.round = 1;
	this.wildlings = 2;

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

	this.swordStatusText = function(house) {
		if ( this.isSwordUsable() ) {
			return 'unused';
		} else {
			return 'used';
		}
	};

	this.ravenStatusText = function(house) {
		if ( this.isRavenUsable() ) {
			return 'unused';
		} else {
			return 'used';
		}
	};

	this.setSupply = function(supply, house) {
		this.supply.setPositionOfHouse(supply, house);
	};

	this.getSupplyOfHouse = function(house) {
		return this.supply.getPositionOfHouse(house);
	};

	this.getArmyLimitsOfHouse = function(house) {
		var limits = [
			[2, 2],
			[3, 2],
			[3, 2, 2],
			[3, 2, 2, 2],
			[3, 3, 2, 2],
			[4, 3, 2, 2],
			[4, 3, 2, 2, 2]
		];

		return limits[this.supply.getPositionOfHouse(house) - this.supply.minimum];
	};

	this.setVictory = function(victory, house) {
		this.victory.setPositionOfHouse(victory, house);
	};

	this.getVictoryOfHouse = function(house) {
		return this.victory.getPositionOfHouse(house);
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
		new Ship(tyrell)
	);
	board.setOccupiers(dornishMarches,
		new Footman(tyrell)
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


AssignState.prototype = new GameState();
AssignState.prototype.constructor = AssignState;
function AssignState(machine) {
	GameState.call(this, machine, 'Assign Orders');
	this.playersDone = new Array();

	this.isDone = function() {
		return this.playersDone.length === this.stateMachine.game.players.length;
	}

	this.start = function() {
		if (this.isDone()) {
			//todo ask for players orders and put them in a OrdersCollection instance
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



ExecuteState.prototype = new GameState();
ExecuteState.prototype.constructor = ExecuteState;
function ExecuteState() {
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

