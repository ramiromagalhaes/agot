function Game() {
	this.id = 0;
	this.players = new Array();
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

	this.stats.cards = this.house.cards;
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

function GameStateMachine() {
	this.currentState = new GameState(); //startup, westeros, assign orders, execute orders
}

function GameState() {
	this.action = function() {
	}
}

function House() {
	this.name = "";
	this.available = true;
	this.defaultIronThrone = 1;
	this.defaultFiefdom = 1;
	this.defaultKingsCourt = 1;
	this.defaultSupply = 1;
	this.defaultVictory = 1;
	this.cards = new Array(7);
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
	}
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


