function Order(name, issuer) {
	//how the starred orders will be played?
	this.name = name;
	this.issuer = issuer; //todo should I store the player or the house?
}



function OrderCollection(board, gameStats) { //todo more verifications on the order placement
	this.board = board;
	this.gameStats = gameStats;
	this.orders = new Array(this.board.areaCount);
	this.revealOrders = false;

	//returns true if it replaced a previously placed order
	this.placeOrder = function(area, order) {
		if (!board.hasController(area) && !board.isOccupied(area)) {
			throw 'A player can only place orders on units he controls. ' + area.name + ' has no controller or is not occupied.';
		}
		if (board.getController(area).name != order.issuer.name) {
			throw 'A player can only place orders on the units he controls. Those units are controlled by the house ' + board.getController(area).name;
		}

		//todo other checks?
		//todo check if a player placed more orders than he's able to. Consider his King's Court track.

		var returnValue = false;
		if (this.orders[area.id] != null) {
			returnValue = true;
		}

		this.orders[area.id] = order;

		return returnValue;
	};

	this.removeOrder = function(area) {
		this.orders[area.id] = null;
	};

	//supposed to be a private method
	this.getOrdersOfType = function(orderName) {
		var orderClass = window[orderName];
		var ordersOfType = new Array();
		for (var i = 0; i < this.orders.length; i++) {
			if (this.orders[i] === null || typeof(this.orders[i]) === 'undefined') {
				continue;
			}
			if (this.orders[i] instanceof orderClass) {
				ordersOfType.push(this.orders[i]);
			}
		}

		return ordersOfType;
	};

	//supposed to be a private method
	this.sortOrdersByIronThroneInfluence = function(someOrders) { //todo it seems this will be reused a lot. Should this method really be here?
		var rank = this.gameStats.ironThrone.getRank();
		var hashRank = new Object(); //todo consider applying this technique in the SingleRankTracker.getRank() method
		for (var i = 0; i < rank.length; i++) {
			hashRank[rank[i].name] = i;
		}

		var sortFunction = function(orderA, orderB) {
			return hashRank[orderA.issuer.name] - hashRank[orderB.issuer.name];
		};

		someOrders.sort(sortFunction);
		return someOrders;
	};

	this.getRaidOrders = function() {
		return this.sortOrdersByIronThroneInfluence(this.getOrdersOfType('RaidOrder'));
	};
	this.getMarchOrders = function() {
		return this.sortOrdersByIronThroneInfluence(this.getOrdersOfType('MarchOrder'));
	};
	this.getDefendOrders = function() {
		return this.getOrdersOfType('DefendOrder');
	};
	this.getSupportOrders = function() {
		return this.getOrdersOfType('SupportOrder');
	};
	this.getConsolidatePowerOrders = function() {
		return this.sortOrdersByIronThroneInfluence(this.getOrdersOfType('ConsolidatePowerOrder'));
	};

}



RaidOrder.prototype = new Order();
RaidOrder.prototype.constructor = RaidOrder;
function RaidOrder(issuer) {
	Order.call(this, 'Raid', issuer);

	this.execute = function() {
		//todo this.game.board.getAdjacents(this.area);
		//check for adjacent orders to see if they can be raided
		//show options to player
		//ask him to choose what he wants to raid, or if he wants to ignore those orders
	};
};


MarchOrder.prototype = new Order();
MarchOrder.prototype.constructor = MarchOrder;
function MarchOrder(issuer, strength) {
	Order.call(this, 'March', issuer);
	this.strength = strength;

	this.execute = function() {
		//player will split army?
		//what units and where will you move them to?
		//will you leave a power token?
		//combat, if needed (support + defend) orders + kills + retreat and route
	};
};


SupportOrder.prototype = new Order();
SupportOrder.prototype.constructor = SupportOrder;
function SupportOrder(issuer) {
	Order.call(this, 'Support', issuer);

	this.execute = function() {
		//autodetect suportable units
		//allow the player to declare support (before cards are shown)
	};
};


DefendOrder.prototype = new Order();
DefendOrder.prototype.constructor = DefendOrder;
function DefendOrder(issuer) {
	Order.call(this, 'Defend', issuer);

	this.execute = function() {
	};
};


ConsolidatePowerOrder.prototype = new Order();
ConsolidatePowerOrder.prototype.constructor = ConsolidatePowerOrder;
function ConsolidatePowerOrder(issuer) {
	Order.call(this, 'Consolidate Power', issuer);

	this.execute = function() {
	};

	this.cancel = function() {
		throw 'Cannot cancel a consolidate power order.';
	};
};

