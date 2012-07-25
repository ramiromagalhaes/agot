//todo create a class that represents the view

function svgNamespace() {
	return "http://www.w3.org/2000/svg";
}

function svgDocument() {
	return document.getElementsByTagName('embed').item(0).getSVGDocument();
}

function svgElement() {
	return svgDocument().childNodes[0];
}



function highlightControlledArea(theBoard, someArea) {
	var controller = theBoard.getController(someArea);

	var color = '#c8e5ff';
	switch (controller.name) {
		case stark.name:
			color = '#e0e0e0';
			break;
		case lannister.name:
			color = '#ffc0c0';
			break;
		case baratheon.name:
			color = '#dfdfa0';
			break;
		case greyjoy.name:
			color = '#a6a6a6';
			break;
		case tyrell.name:
			color = '#afa';
			break;
		case martell.name:
			color = '#fa6';
			break;
	}

	svgDocument().getElementById(someArea.codeName).setAttribute('fill', color);
}



function useUnit(useId, color) {
	var use = svgDocument().createElementNS(svgNamespace(), 'use');
	use.setAttribute('x', Math.random()*1458);
	use.setAttribute('y', Math.random()*2736);
	use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', useId);
	use.setAttribute('fill', color);
	svgElement().appendChild(use);
}

function drawUnit(unit, area) {
	var color = '#000';
	switch (unit.controller.name) {
		case stark.name:
			color = '#909090';
			break;
		case lannister.name:
			color = '#f00';
			break;
		case baratheon.name:
			color = '#cc0';
			break;
		case greyjoy.name:
			color = '#222';
			break;
		case tyrell.name:
			color = '#26701f';
			break;
		case martell.name:
			color = '#d70';
			break;
	}

	if (unit instanceof Footman) {
		useUnit('#footmen', color);
	}
	if (unit instanceof Knight) {
		useUnit('#knight', color);
	}
	if (unit instanceof Ship) {
		useUnit('#ship', color);
	}
	if (unit instanceof Siege) {
		useUnit('#siege', color);
	}
}



function PlayerPanel(game, player) {

	this.game = game;
	this.player = player;

	this.houseNameElement = $('#houseName');
	this.powerTokensElement = $('#playerPowerTokens');
	this.playerSupplyElement = $('#playerSupply');
	this.playerVictoryElement = $('#playerVictory');

	this.currentRoundElement = $('#currentRound');
	this.wildlingsStrengthElement = $('#wildlingsStrength');

	this.cardsTableElement = document.getElementById('playerCards').tBodies[0];

	this.bladeStatusElement = $('#bladeStatus');
	this.ravenStatusElement = $('#ravenStatus');

	this.ironThroneTrackElement = $('#ironThroneTrack');
	this.fiefdomTrackElement = $('#fiefdomTrack');
	this.kingsCourtTrackElement = $('#kingsCourtTrack');

	this.victoryTrack = $('#victoryTrack');
	this.supplyTrack = $('#supplyTrack');

	//supposed to be private
	this.updatePlayerData = function() {
		this.houseNameElement.text(this.player.house.name);
		this.powerTokensElement.text(this.player.powerTokens);

		//todo report orders left
		//todo report units in play/left

		this.currentRoundElement.text(this.game.gameStats.round);
		this.wildlingsStrengthElement.text(this.game.gameStats.wildlings);

		$(this.cardsTableElement).empty();
		for (var i = 0; i < this.player.house.cards.length; i++) {
			var row = this.cardsTableElement.insertRow(-1);

			var card = this.player.house.cards[i];
			row.insertCell(0).textContent = card.name;
			row.insertCell(1).textContent = card.power;
			row.insertCell(2).textContent = card.swords;
			row.insertCell(3).textContent = card.towers;
			row.insertCell(4).textContent = card.text;

			if (!card.available) {
				row.setAttribute('class', 'unavailable');
			}
		}
	};

	//supposed to be private
	this.updateSingleRankTracker = function(element, singlePlayerRank) {
		element.empty();
		var rank = singlePlayerRank.getRank();
		for (var i = 0; i < rank.length; i++) {
			var li = document.createElement('li');
			li.textContent = rank[i].name;
			element.append(li);
		}
	};

	//supposed to be private
	this.updateIronThroneTrack = function() {
		this.updateSingleRankTracker(this.ironThroneTrackElement, this.game.gameStats.ironThrone);
	};

	//supposed to be private
	this.updateFiefdomTrack = function() {
		this.updateSingleRankTracker(this.fiefdomTrackElement, this.game.gameStats.fiefdom);
	};

	//supposed to be private
	this.updateKingsCourtTrack = function() {
		this.updateSingleRankTracker(this.kingsCourtTrackElement, this.game.gameStats.kingsCourt);
	};

	//supposed to be private
	this.updateMultiRankTracker = function(element, rank) {
		element.empty();
		for (var i = rank.minimum; i <= rank.maximum; i++) {
			var li = document.createElement('li');
			li.textContent = '';

			var housesOnPosition = rank.getHousesInPosition(i);
			for (var j = 0; j < housesOnPosition.length; j++) {
				li.textContent += housesOnPosition[j].name;
				if (j != housesOnPosition.length - 1) {
					li.textContent += ', ';
				}
			}

			element.append(li);
		}
	};

	//supposed to be private
	this.updateVictoryTrack = function() {
		this.playerVictoryElement.text(this.game.gameStats.victory.getPositionOfHouse(this.player.house));
		this.updateMultiRankTracker(this.victoryTrack, this.game.gameStats.victory);
	};

	//supposed to be private
	this.updateSupplyTrack = function() {
		var theSupply = this.game.gameStats.supply;
		this.playerSupplyElement.text(theSupply.getPositionOfHouse(this.player.house));
		this.updateMultiRankTracker(this.victoryTrack, theSupply);
	};

	//supposed to be private
	this.updateGameData = function() {
		this.bladeStatusElement.text(this.game.gameStats.swordStatusText());
		this.ravenStatusElement.text(this.game.gameStats.ravenStatusText());

		this.updateIronThroneTrack();
		this.updateFiefdomTrack();
		this.updateKingsCourtTrack();

		this.updateVictoryTrack();
		this.updateSupplyTrack();
	};

	this.update = function() {
		this.updatePlayerData();
		this.updateGameData();
		this.updateMap();
	};

	this.updateMap = function(overlayId) {
		//todo REVIEW ME!!!!
		//todo implement overlaying

		//this will display controlled areas on the map
		for (var i = 0; i < this.game.board.occupiers.length; i++) {
			if (this.game.board.hasController(this.game.board.areas[i])) {
				highlightControlledArea(this.game.board, this.game.board.areas[i]);
			}
		}

		//draw units on map
		for (var i = 0; i < this.game.board.occupiers.length; i++) {
			var occupier = this.game.board.occupiers[i];
			if (occupier === null || typeof(occupier) === 'undefined') {
				continue;
			}
			if (occupier instanceof Army) {
				for (var j = 0; j < occupier.units.length; j++) {
					drawUnit(occupier.units[j], this.game.board.areas[i]);
				}
			} else {
				drawUnit(occupier, this.game.board.areas[i]);
			}
		}
	};

}

