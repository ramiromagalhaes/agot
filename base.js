function Deck() {
	this.deck = new Array();
	this.discarded = new Array();

	this.add = function(card) {
		this.deck.push(card);
	};

	this.peek = function() {
		return this.deck[this.deck.length - 1];
	};

	this.draw = function() {
		var card = this.deck.pop();
		this.discarded.push(card);
		return card;
	};

	this.shuffle = function() {
		var tempDeck = new Array();
		for (var i = this.deck.length; i > 0; i--) {
			var randIndex = (Math.random() * this.deck.length) % this.deck.length; //the extra modulus is to avoid problems when the array size is 0.
			var randomCard = this.deck.splice(randIndex, 1);
			tempDeck.push(randomCard);
		}
		this.deck = tempDeck;
	};

	this.resetAndShuffle = function() {
		this.deck = this.deck.concat(this.discarded);
		this.suffle();
	};
}



function SingleRankTracker(amountPlayers) {
	this.amountPlayers = amountPlayers;
	this.rank = new Array(6); //todo rank is storing Houses. Should it store Players instead?

	this.setPosition = function(position, house) {
		this.rank[position] = house;
	};

	this.moveToLastPosition = function(house) {
		for (var i = 0; i < this.rank.length; i++) {
			if (this.rank[i] === null || typeof(this.rank[i]) === 'undefined') {
				continue;
			}
			if (this.rank[i].name === house.name) {
				this.rank[i] = null;
				this.rank.push(house);
				break;
			}
		}

		this.consolidate();
	};

	this.moveToFirstPosition = function(house) {
		var j = 1;
		var newRank = new Array(this.amountPlayers);

		newRank[0] = house;

		for (var i = 1; i < this.rank.length; i++) {
			if (this.rank[i] === null || typeof(this.rank[i]) === 'undefined') {
				continue;
			}
			if (this.rank[i].name === house.name) {
				continue;
			}

			newRank[j++] = this.rank[i];
		}
		this.rank = newRank;
	};

	this.consolidate = function() {
		var j = 0;
		var newRank = new Array(this.amountPlayers);
		for (var i = 0; i < this.rank.length; i++) {
			if (this.rank[i] === null || typeof(this.rank[i]) === 'undefined') {
				continue;
			}

			newRank[j++] = this.rank[i];
		}
		this.rank = newRank;
	};

	this.getRank = function() {
		this.consolidate();
		return this.rank;
	};

	this.getFirst = function() {
		this.consolidate();
		return this.rank[0];
	};

}



function MultiRankTracker(minPosition, maxPosition) {
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
	//returns the equivalent array index of a position.
	this.checkPosition = function(position) {
		if (position <= this.minimum) {
			return 0;
		} else if (position >= this.maximum) {
			return this.maximum - this.minimum + 1;
		}

		return position - this.minimum;
	};

	//this is supposed to be a private method
	this.putHouseInPosition = function(index, house) {
		if (this.rank[index] === null || typeof(this.rank[index]) === 'undefined') {
			this.rank[index] = new Array();
		}
		this.rank[index].push(house);
	};

	//this is supposed to be a private method
	//remove a house from a position to another
	this.moveHouse = function(fromIndexes, toIndex) {
		var house = this.rank[fromIndexes[0]][fromIndexes[1]];

		this.rank[fromIndexes[0]].splice(fromIndexes[1], 1);
		this.putHouseInPosition(toIndex, house);
	};

	this.setPositionOfHouse = function(position, house) {
		var indexes = this.findHouseOnTrack(house);
		if (indexes === -1) {
			//house not yet added to the track. just add it.
			var index = this.checkPosition(position);
			this.putHouseInPosition(index, house);
		} else {
			this.moveHouse(indexes, position);
		}
	};

	this.movePositionOfHouse = function(amount, house) {
		var indexes = this.findHouseOnTrack(house);
		var newIndex = this.checkPosition(indexes[0] + this.minPosition + amount);
		this.moveHouse(indexes, newIndex);
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




