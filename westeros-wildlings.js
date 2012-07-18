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





//Westeros Deck 1 - Winter is Coming, Mustering, Supply, Last Days of Summer, A Throne of Blades
var mustering = new WesterosCard('Mustering',           0, 'Recruit new units in Strongholds and Castles');
mustering.takeEffect = function(game) {
	var musteringAreas = game.board.getPlayerOwnedCastleAreas();

	//todo for each area, ask players, in Iron Throne dominance order to muster units in the musteringAreas. This could also be made simultaneously.
	//todo implement the player ordering
	for (var i = 0; i < musteringAreas.length; i++) {
		//todo ask players for mustering options. Upgrade unit to another? Get new units? This should produce only valid mustering options.
	}

	//todo somehow get player's mustering options. Should I verify here if the mustering options are valid? Should I get them already done? What is the data structure?
};

var supply    = new WesterosCard('Supply',              0, 'Adjust Supply track. Reconcile armies.');
var blades    = new WesterosCard('A Throne of Blades',  1, 'The holder of the Iron Throne token chooses whether: a) everyone updates their Supply then reconciles armies, b) everyone musters units, or c) this card has no effect.');

//Westeros Deck 2 - Clash of Kings, Last Days of Summer, Winter is Coming, "Dark Wings, Dark Words", Game of Thrones
var clash   = new WesterosCard('Clash of Kings',         0, 'Bid on the three Influence tracks.');
var thrones = new WesterosCard('Game of Thrones',        0, 'Each player collects one Power token for each icon printed on areas he controls.');
var wings   = new WesterosCard('Dark Wings, Dark Words', 1, 'The holder of the Messenger Raven token chooses whether: a) everyone bids on the three Influence tracks, b) everyone collecs one Power token from every power icon present in areas they control, or c) this card has no effect.');

//Westeros Decks 1 and 2
var winter    = new WesterosCard('Winter is Coming',    0, '');
var summer    = new WesterosCard('Last Days of Summer', 1, 'Nothing happens');

//Westeros Deck 3 - Wildlings Attack, Put to the Sword, Web of Lies, Rains of Autumn, Sea of Storms, Storm of Swords, Feast for Crows
var lies   = new WesterosCard('Web of Lies',      1, 'Support Orders cannot be played during this Planning Phase.');
var attack = new WesterosCard('Wildlings Attack', 0, 'The wildlings attack Westeros.');
var rains  = new WesterosCard('Rains of Autumn',  1, 'March +1 Orders cannot be played this Planning Phase.');
var put    = new WesterosCard('Put to the Sword', 0, 'The holder of the Valyrian Steel Blade chooses one of the following conditions for this Planning Phase: a) Defense Orders cannot be played, b) March +1 Orders cannot be played, or c) no restrictions.');
var sea    = new WesterosCard('Sea of Storms',    1, 'Raid Orders cannot be played during this Planning Phase.');
var storm  = new WesterosCard('Storm of Swords',  1, 'Defense Orders cannot be played during this Planning Phase.');
var feast  = new WesterosCard('Feast for Crows',  0, 'Consolidate Power Orders cannot be played during this Planning Phase.');



//Wildlings Deck
var kingBeyond  = new WildlingCard('A King Beyond the Wall',
	'Moves his tokens to the lowest position of every influence track.',
	'In turn order, each player chooses either the Fiefdoms or King\'s Court influence track and moves his token to the lowest position of that track.',
	'Moves his token to the top of one Influence track of this choice, then takes the appropriate Dominance token.');
kingBeyond.takeEffect = function(playerVictory, gameStats, bidders, bids) { //bidders are Players ordered by bidding order; bids indexes are the same as the bidders
	if (playerVictory) {
		var highestBidder = bidders[0].house;
		//get choice of player X between Iron Throne, Fiefdom or King's Court to move to the last position
		var choice = 0; //-1: throne, 0: fiefdom, 1: court
		switch (choice) {
			case -1:
				gameStats.ironThrone.moveToLastPosition( null ); //todo will fiefdom store players or houses???
				break;
			case 0:
				gameStats.fiefdom.moveToLastPosition( null ); //todo will fiefdom store players or houses???
				break;
			case 1:
				gameStats.kingsCourt.moveToLastPosition( null ); //todo will kingsCourt store players or houses???
				break;
		}
	} else {
		var lowestBidder =  bidders[bidders.length - 1].house;
		gameStats.ironThrone.moveToLastPosition( lowestBidder );

		var actors = gameStats.ironThrone.getRank();
		for (var i = 0; i < actors.length; i++) {
			//get choice of player X between Fiefdom or King's Court to move to the last position
			var choice = 0; //0: fiefdom, 1: court
			switch (choice) {
				case 0:
					gameStats.fiefdom.moveToLastPosition( null ); //todo will fiefdom store players or houses???
					break;
				case 1:
					gameStats.kingsCourt.moveToLastPosition( null ); //todo will kingsCourt store players or houses???
					break;
			}
		}
	}
};



var crowKillers = new WildlingCard('Crow Killers',
	'Replaces all of his Knights with available Footmen. Any Knight unable to be replaced is destroyed.',
	'Replaces 2 of their Knights with available Footmen. Any Knight unable to be replaced is destroyed.',
	'May immediately replace up to 2 of his Footmen, anywhere, with available Knights.');



var skinChanger = new WildlingCard('Skinchanger Scout',
	'Discards all available Power tokens.',
	'Discards 2 available Power tokens, or as many as they are able.',
	'All Power tokens he bid on this attack are immediately returned to his available Power.');
skinChanger.takeEffect = function(playerVictory, gameStats, bidders, bids) {
	if (playerVictory) {
		var lowestBidder =  bidders[bidders.length - 1].house;
		lowestBidder.discardPower(lowestBidder.powerTokens);

		for (var i = 0; i < bidders.length - 1; i++) {
			bidders[i].discardPower(2);
		}
	} else {
		bidders[0].gainPower(bids[0]);
	}
};



var preemptive  = new WildlingCard('Preemptive Raid',
	'Chooses on of the following: A. Destroys 2 of his units anywhere. B. Is reduced 2 positions on his highest Influence track.',
	'Nothing happens.',
	'The wildlings immediately attack again with a strength of 6. You do not participate in the bidding against this attack (nor do you receive any rewards or penalties).');
var mammoth     = new WildlingCard('Mammoth Riders',
	'Destroys 3 of his units anywhere.',
	'Destroys 2 of their units anywhere.',
	'May retrieve 1 House card of his choice from his House card discard pile.');
var horde       = new WildlingCard('The Horde Descends',
	'Destroys 2 of his units at one of his Castles or Strongholds. If unable, he destroys 2 of his units anywhere.',
	'Destroys 1 of their units anywhere.',
	'May muster forces (following normal mustering rules) in any one Castle or Stronghold area he controls.');
var milkwater   = new WildlingCard('Massing on the Milkwater',
	'If he has more than one House card in his hand, he discards all cards with the highest combat strength.',
	'If they have more than one House card in their hand, they must choose and discard one of those cards.',
	'Returns his entire House card discard pile into his hand.');

var silence     = new WildlingCard('Silence at the Wall', 'Nothing happens.', 'Nothing happens.', 'Nothing happens.');
silence.takeEffect = function(playerVictory, gameStats, bidders, bids) {
	//nothing happens
};

var rattleshirt = new WildlingCard('Rattleshirt\'s Raiders',
	'Is reduced 2 positions on the Supply track (to no lower than 0). Then reconcile armies to their new Supply limits.',
	'Is reduced 1 position on the Supply track (to no lower than 0). Then reconcile armies to their new Supply limits.',
	'Is increased 1 position on the Supply track (to no higher than 6).');
rattleshirt.takeEffect = function(playerVictory, gameStats, bidders, bids) {
	if (playerVictory) {
		gameStats.supply.movePositionOfHouse(-2, bidders[bidders.length - 1].house);
		for (var i = 0; i < bidders.length - 1; i++) {
			gameStats.supply.movePositionOfHouse(-1, bidders[i].house);
		}
		//todo reconcile armies, i.e. ask players which units they want to destroy and destroy them
	} else {
		gameStats.supply.movePositionOfHouse(1, bidders[0].house);
	}
};

