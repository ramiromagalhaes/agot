function Game(id, amountPlayers) {
	this.id = 0;
	this.players = new Array(0);
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

	this.addPlayer = function(player) {
		if (this.allowedHouses().indexOf(player.house.name) === -1) {
			throw 'No player can choose house ' + player.house.name + ' in a game with ' + this.players.length + ' players.';
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



function MultiplayerRankTracker(minPosition, maxPosition) {
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



function GameStats() {
	this.playersCount = 6;
	this.wildlings = 0;
	this.ironThrone = new Array(this.playersCount);
	this.fiefdom = new Array(this.playersCount);
	this.kingsCourt = new Array(this.playersCount);

	this.victory = new MultiplayerRankTracker(1, 7);
	this.supply = new MultiplayerRankTracker(0, 6);

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



function GameState(stateMachine, name) {
	this.stateMachine = stateMachine;
	this.name = name;
	//maybe some functions will fit here.
}



function GameStateMachine(game) {
	this.game = game;
	this.currentState = null; //setup, westeros (1, 2, 3, wildlings), assign orders, execute orders (raid, march, combat, consolidate, cleanup)

	this.fireEvent = function(event, params) { //event should be the function name to call on the state
		this.currentState = this.currentState[event](params);
	}

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



function Board() {
	this.areas = new Array(50); //12 mar, 38 terra = 50 áreas
	this.adjacency = 0;

	this.buildAdjacencyMatrix = function() {
		this.adjacency = new Array(this.areas.length);
		for (var i = 0; i < this.areas.length; i++) {
			this.adjacency[i] = new Array(this.areas.length);
		}
		return this.adjacency;
	};
}



function Area(name, type, supply, power, castle, hasPort, defaultController) {
	this.name = name;
	this.type = type; //0 = land, 1 = sea

	this.supply = supply;
	this.power = power;
	this.castle = castle; //0 = none, 1 = castle, 2 = stronghold
	this.hasPort = false;

	if(typeof(defaultController)==='undefined') {
		defaultController = null;
	} else {
		this.defaultController = defaultController;
	}
}



function Army() {
	this.units = new Array();
	this.controller = null;
}



function Unit(type, controller) {
	this.type = 0; //1 = footman, 2 = knight, 3 = ship, 4 = siege, 5 = neutral
	this.routed = false;
	this.controller = controller;
}



function Occupation(area, occupiers) {
	this.area = null;
	this.occupiers = null;
	this.contestants = null; //should I use this attribute to controll combat?
	this.house = null; //occupant house
}



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

