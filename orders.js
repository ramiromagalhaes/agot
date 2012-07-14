function Order(name, area) {
	this.name = name;
	this.area = area; //todo attach an order to an unit or to an area?
}


RaidOrder.prototype = new Order();
RaidOrder.prototype.constructor = RaidOrder;
function RaidOrder() {
	Order.call(this, 'Raid');

	this.execute = function() {
	};
};


MarchOrder.prototype = new Order();
MarchOrder.prototype.constructor = MarchOrder;
function MarchOrder() {
	Order.call(this, 'March');

	this.execute = function() {
		//player will split army?
		//what units and where will you move them to?
		//will you leave a power token?
		//combat, if needed (support + defend) orders
		//retreat and route
	};
};


SupportOrder.prototype = new Order();
SupportOrder.prototype.constructor = SupportOrder;
function SupportOrder() {
	Order.call(this, 'Support');

	this.execute = function() {
	};
};


DefendOrder.prototype = new Order();
DefendOrder.prototype.constructor = DefendOrder;
function DefendOrder() {
	Order.call(this, 'Defend');

	this.execute = function() {
	};
};


ConsolidatePowerOrder.prototype = new Order();
ConsolidatePowerOrder.prototype.constructor = ConsolidatePowerOrder;
function ConsolidatePowerOrder() {
	Order.call(this, 'Consolidate Power');

	this.execute = function() {
	};
};




