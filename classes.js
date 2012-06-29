function Game(id, amountPlayers) {
	this.id = 0;

	if (amountPlayers >= 3 && amountPlayers <= 6) {
		this.players = new Array(amountPlayers);
	} else {
		throw 'At least 3 and at most 6 players can play this game.';
	}

	this.allowedHouses = function() {
		switch(this.players.length) {
			case 3:
				return ['Stark', 'Lannister', 'Baratheon'];
			case 4:
				return ['Stark', 'Lannister', 'Baratheon', 'Greyjoy'];
			case 5:
				return ['Stark', 'Lannister', 'Baratheon', 'Greyjoy', 'Tyrell'];
			case 6:
				return ['Stark', 'Lannister', 'Baratheon', 'Greyjoy', 'Tyrell', 'Martell'];
			default:
				//todo should not happen
		}
	};

	this.addPlayer = function(player) {
		if (this.allowedHouses().indexOf(player.house.name) === -1) {
			throw 'No player can choose house ' + player.house.name + ' in a game with ' + this.players.length + ' players.';
		}
		if (this.players.indexOf(player) >= 0) { //todo fixme this 'if' is not working
			throw 'Player ' + player.name + ' was already added to the game ' + id;
		}

		for (var i = 0; i < this.players.length; i++) {
			if (this.players[i] === null || this.players[i] === 'undefined') {
				this.players[i] = player;
			}
		}
	};
}



function Player(name, house) {
	this.name = name;
	this.house = house;
	this.stats = new PlayerStats();

	if (this.house.defaultIronThrone == 1) {
		this.stats.ironThrone = 0;
	} else {
		this.stats.ironThrone = -1;
	}

	if (this.house.defaultFiefdom == 1) {
		this.stats.sword = 0;
	} else {
		this.stats.sword = -1;
	}

	if (this.house.defaultKingsCourt == 1) {
		this.stats.raven = 0;
	} else {
		this.stats.raven = -1;
	}

}

function PlayerStats() {
	this.powerTokens = 5;
	this.ironThrone = 0; //-1 not yours, 0 unused, 1 used
	this.sword = 0;
	this.raven = 0;
	this.cards = new Array(7); //each player has 7 cards
}

function GameStats() {
	this.playersCount = 6;
	this.wildlings = 0;
	this.ironThrone = new Array(this.playersCount);
	this.fiefdom = new Array(this.playersCount);
	this.kingsCourt = new Array(this.playersCount);
	this.victory = new Array(this.playersCount);
	this.supply = new Array(this.playersCount);
}

function GameStateMachine(game) {
	this.game = game;
	this.currentState = new GameState(); //startup, westeros, assign orders, execute orders
}

function GameState(action) {
	this.action = action;
}

function House(name, defaultIronThrone, defaultFiefdom, defaultKingsCourt, defaultSupply, defaultVictory, cards) {
	this.name = name;
	this.defaultIronThrone = defaultIronThrone;
	this.defaultFiefdom = defaultFiefdom;
	this.defaultKingsCourt = defaultKingsCourt;
	this.defaultSupply = defaultSupply;
	this.defaultVictory = defaultVictory;
	this.cards = cards;

	this.available = true;
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

function Area(name, type, supply, power, castle, hasPort, defaultController, available) {
	this.name = name;
	this.type = type; //0 = land, 1 = sea

	this.supply = supply;
	this.power = power;
	this.castle = castle; //0 = none, 1 = castle, 2 = stronghold
	this.hasPort = false;

	if(typeof(defaultController)==='undefined') defaultController = null;
	this.defaultController = defaultController;
	this.currentController = defaultController;

	if(typeof(available)==='undefined') this.available = true;
	else this.available = available;



	this.setCurrentController = function(aHouse) {
		if(typeof(aHouse)==='undefined') aHouse = this.defaultController;
		this.currentController = aHouse;
	}
}

function Army() {
	this.units = new Array();
}

function Unit(type, controller) {
	this.type = 0; //1 = footman, 2 = knight, 3 = ship, 4 = siege, 5 = thatThingThatDefendsCastles. Herança representaria melhor...
	this.controller = controller;
}

function WesterosCard() {
	this.name = "";
}

function WildlingCard() {
	this.name = "";
}

function HouseCard(name, power, swords, towers, effect, onEffect) {
	this.name = name;
	this.power = power;
	this.swords = swords;
	this.towers = towers;
	this.effect = effect;
	this.onEffect = onEffect;
}
