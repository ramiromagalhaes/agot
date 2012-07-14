function Order(name, area) {
	//how the starred orders will be played?
	this.name = name;
	this.area = area; //todo attach an order to an unit or to an area?

	this.cancel = function() {
		//just remove the order from the board.
	};
}


RaidOrder.prototype = new Order();
RaidOrder.prototype.constructor = RaidOrder;
function RaidOrder(area) {
	Order.call(this, 'Raid', area);

	this.execute = function() {
		//todo this.game.board.getAdjacents(this.area);
		//check for adjacent orders to see if they can be raided
		//show options to player
		//ask him to choose what he wants to raid, or if he wants to ignore those orders
	};
};


MarchOrder.prototype = new Order();
MarchOrder.prototype.constructor = MarchOrder;
function MarchOrder() {
	Order.call(this, 'March', area);

	this.execute = function() {
		//player will split army?
		//what units and where will you move them to?
		//will you leave a power token?
		//combat, if needed (support + defend) orders + kills + retreat and route
	};
};


SupportOrder.prototype = new Order();
SupportOrder.prototype.constructor = SupportOrder;
function SupportOrder() {
	Order.call(this, 'Support', area);

	this.execute = function() {
		//autodetect suportable units
		//allow the player to declare support (before cards are shown)
	};
};


DefendOrder.prototype = new Order();
DefendOrder.prototype.constructor = DefendOrder;
function DefendOrder() {
	Order.call(this, 'Defend', area);

	this.execute = function() {
	};
};


ConsolidatePowerOrder.prototype = new Order();
ConsolidatePowerOrder.prototype.constructor = ConsolidatePowerOrder;
function ConsolidatePowerOrder() {
	Order.call(this, 'Consolidate Power', area);

	this.execute = function() {
	};

	this.cancel = function() {
		throw 'Cannot cancel a consolidate power order.';
	};
};

