var game = new Game(1, 3);



var stateMachine = new GameStateMachine(game);



//Game states (phases)
var setupState = new GameState(stateMachine, 'Setup');
setupState.start = function() {
	//do lots of stuff to setup the board and players
	return assignState;
};


stateMachine.currentState = setupState; //still configuring the stateMachine


//Deck 1 - Winter is Coming, Mustering, Supply, Last Days of Summer, A Throne of Blades
//Deck 2 - Clash of Kings, Last Days of Summer, Winter is Coming, "Dark Wings, Dark Words", Game of Thrones
//Deck 3 - Wildlings Attack, Put to the Sword, Web of Lies, Rains of Autumn, Sea of Storms, Storm of Swords, Feast for Crows
var westerosState = new GameState(stateMachine, 'Westeros');
westerosState.deckToDraw = 0;
westerosState.start = function() {
	this.deckToDraw++;

	//draw from deck this.deckToDraw
	//resolve card

	if (this.deckToDraw >= 3) {
		westerosState.deckToDraw = 0;
		return assignState;
	} else {
		return westerosState;
	}
};


var assignState = new GameState(stateMachine, 'Assign Orders');
assignState.playersDone = new Array();
assignState.isDone = function() {
	return this.playersDone.length === this.stateMachine.game.players.length;
}
assignState.start = function() {
	if (this.isDone()) {
		//receive player orders
		//checks if all possible orders were correctly given
		return executeState;
	} else {
		//ask players for their orders
		return assignState;
	}
};
assignState.playerDone = function(player) { //todo find a way to notify that a certain player is done and pass it as parameter
	for (var i = 0; i < this.stateMachine.game.players.length; i++) {
		if (this.playersDone[i].name === player.name) {
			return;
		}
	}

	this.playersDone.push(player);
	return this.start(); //todo should I, instead of calling this here, post a 'start' event on the StateMachine and let it consume the event?
}


var executeState = new GameState(stateMachine, 'Execute Orders');
executeState.start = function() {
	//reveal orders
	//can a player use Raven? Ask what if he wants to use it and what for.
	this.ravenUsage(); //todo should I, instead of calling this here, post an event on the StateMachine and let it consume it?
	return westerosState;
};
executeState.ravenUsage = function(use) { //0 (or anything else) == no; 1 == yes, change order; -1 == yes, view next wilding card
	if (use === 1) {
		//allow player to change one of his orders
	} else if (use === -1) {
		//show next wildling to player
	}

	return executeState.postRaven(); //todo should I, instead of calling this here, post an event on the StateMachine and let it consume it?
};
executeState.postRaven = function() {
	//in player order
	//	execute raid orders
	//	execute march orders (no combat/with combat - add power, use house cards, use sword, add final power, resolve victory, retreat)
	//	execute consolidate power orders
	//	more orders?
	//		yes - repeat
	//		no  - cleanup
	return westerosState;
}

