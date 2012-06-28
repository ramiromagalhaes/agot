//Houses
var stark     = new House('Stark',     3, 4, 2, 1, 2);
var lannister = new House('Lannister', 2, 6, 1, 2, 1);
var baratheon = new House('Baratheon', 1, 5, 4, 2, 1);
var greyjoy   = new House('Greyjoy',   5, 1, 6, 2, 1);
var tyrell    = new House('Tyrell',    6, 2, 5, 2, 1);
var martel    = new House('Martel',    4, 3, 3, 2, 1);
var noHouse   = null;

//Cards - Stark
var ned = new HouseCard('Eddard Stark', 4, 2, 0, null, null);
var robb = new HouseCard('Robb Stark', 3, 0, 0, 'If you win this combat, you may choose the area to which your opponent retreats. You must choose a legal area where your opponent loses the fewest units.', null);
var bolton = new HouseCard('Roose Bolton', 2, 0, 0, 'If you lose this combat, return your entire House card discard pile into your hand (including this card).', null);
var umber = new HouseCard('Greatjon Umber', 2, 1, 0, null, null);
var rodrick = new HouseCard('Ser Rodrick Cassel', 1, 0, 2, null, null);
var blackfish = new HouseCard('The Blackfish', 1, 0, 0, 'You do not take casualties in this combat from House card abilities, Combat icons, or Tides of Battle cards.', null);
var catelyn = new HouseCard('Catelyn Stark', 0, 0, 0, 'If you have a Defense Order token in the embattled area, its value is doubled', null);

//Cards - Lannister
var tywin = new HouseCard('Tywin Lannister', 4, 0, 0, 'If you win this combat, gain two Power tokens', null);
var clegane = new HouseCard('Ser Gregor Clegane', 3, 3, 0, null, null);
var hound = new HouseCard('The Hound', 2, 0, 2, null, null);
var jaime = new HouseCard('Jaime Lannister', 2, 1, 0, null, null);
var tyrion = new HouseCard('Tyrion Lannister', 1, 0, 0, 'You may immediately return your opponent\'s House card to his hand. He must then choose a different House card. If he has no other House cards in hand, he cannot use a House card this combat.', null);
var kevan = new HouseCard('Kevan Lannister', 1, 0, 0, 'If you are attacking, all of your participating Footman (including supporting Lannister footman) add +2 combat strength instead of +1.', null);
var cersei = new HouseCard('Cersei Lannister', 0, 0, 0, 'If you win this combat, you may remove on of your opponent\'s Order tokens from anywhere on the board.');

//Cards - Baratheon
var stannis = new HouseCard('Stannis Baratheon', 4, 0, 0, 'If your opponent has a higher position on the Iron Throne Influence track than you, this card gains +1 combat strength.', null);
var renly = new HouseCard('Renly Baratheon', 3, 0, 0, 'If you win this combat, you may upgrade one of your participating Footman (or one supporting Baratheon Footman) to a Knight.');
var davos = new HouseCard('Ser Davos Seaworth', 2, 0, 0, 'If your \'Stannis Baratheon\' House card is in your discard pile, this card gains +1 combat strength and a sword icon.', null);
var brienne = new HouseCard('Brienne of Tarth', 2, 1, 1, null, null);
var melisandre = new HouseCard('Melisandre', 1, 1, 0, null, null);
var salladhor = new HouseCard('Salladhor Saan', 1, 0, 0, 'If you are being supported in this combat, the combat strength of all non-Baratheon Ships is reduced to 0.', null);
var patchface = new HouseCard('Patchface', 0, 0, 0, 'After combat, you may look at your opponent\'s hand and discard on card of your choice.');

//Cards - Greyjoy
var euron = new HouseCard('Euron Crow\'s Eye', 4, 1, 0, null, null);
var victarion = new HouseCard('Victarion Greyjoy', 3, 0, 0, 'If you are attacking, all of your participating Ships (incl. supporting Greyjoy Ships) add +2 to combat strength instead of +1.', null);
var theon = new HouseCard('Theon Greyjoy', 2, 0, 0, 'If you are defending an area that contains either a Stronghold or a Castle, this card gains +1 combat strength and a sword icon.', null);
var balon = new HouseCard('Balon Greyjoy', 2, 0, 0, 'The printed combat strength of your opponent\'s House card is reduced to 0.', null);
var asha = new HouseCard('Asha Greyjoy', 1, 0, 0, 'If you are not being supported in this combat, this card gains two swords icons and one fortification icon.', null);
var dagmar = new HouseCard('Dagmar Cleftjaw', 1, 1, 1, null, null);
var aeron = new HouseCard('Aeron Damphair', 0, 0, 0, 'You may immediately discard two Power tokens to discard Aeron Damphair and choose a different House Card from your hand (if able).', null);

//Cards - Tyrell
var mace = new HouseCard('Mace Tyrell', 4, 0, 0, 'Immediately destroy one of your opponent\'s attacking or defending Footmen units.', null);
var loras = new HouseCard('Ser Loras Tyrell', 3, 0, 0, 'If you are attacking and win this combat, move the March Order token into the conquered area (instead of discarding it). The March Order may be resolved again later this round', null);
var garlan = new HouseCard('Ser Garlan Tyrell', 2, 2, 0, null, null);
var randyll = new HouseCard('Randyll Tarly', 2, 1, 0, null, null);
var alester = new HouseCard('Alester Florent', 1, 0, 1, null, null);
var margaery = new HouseCard('Margaery Tyrell', 1, 0, 1, null, null);
var queen = new HouseCard('Queen of Thorns', 0, 0, 0, 'Immediately remove one of your opponent\'s Order token in any one area adjacent to the embattled area. You may not remove the March Order token used to start this combat.', null);

//Cards - Martel
var viper = new HouseCard('The Red Viper', 4, 2, 1, null, null);
var areo = new HouseCard('Areo Hotah', 3, 0, 1, null, null);
var obara = new HouseCard('Obara Sand', 2, 1, 0, null, null);
var darkstar = new HouseCard('Darkstar', 2, 1, 0, null, null);
var nymeria = new HouseCard('Nymeria Sand', 1, 0, 0, 'If you are defending, this card gains a fortification icon. If you are attacking, this card gains a sword icon.', null);
var arianne = new HouseCard('Arianne Martell', 1, 0, 0, 'If you are defending and lose this combat, your opponent may not move his units into the embattled area. They return to the area from which they marched. Your own units must still retreat.', null);
var doran = new HouseCard('Doran Martell', 0, 0, 0, 'Immediately move your opponent to the bottom of one Influence track of your choice.', null);

//Game states (phases)
var setupState = new GameState();
var westerosState = new GameState();
var assignState = new GameState();
var revealState = new GameState();
var cleanupState = new GameState();

//Areas and Board
//                                                             t  s  p  c  port? ctrller
var castleBlack        = new Area('Castle Black',              0, 0, 1, 0, false);
var karhold            = new Area('Karhold',                   0, 0, 1, 0, false);
var winterfell         = new Area('Winterfell',                0, 1, 1, 2, true, stark);
var stonyShore         = new Area('The Stony Shore',           0, 1, 0, 0, false);
var whiteHarbor        = new Area('White Harbor',              0, 0, 0, 1, true);
var widowsWatch        = new Area('Widow\'s Watch',            0, 1, 0, 0, false);
var greywaterWatch     = new Area('Greywater Watch',           0, 1, 0, 0, false);
var flintsFinger       = new Area('Flint\'s Finger',           0, 0, 0, 1, false);
var moatCailin         = new Area('Moat Cailin',               0, 0, 0, 1, false);
var seagard            = new Area('Seagard',                   0, 1, 1, 2, false);
var fingers            = new Area('The Fingers',               0, 1, 0, 0, false);
var twins              = new Area('The Twins',                 0, 0, 1, 0, false);
var pike               = new Area('Pike',                      0, 1, 1, 2, true, greyjoy);
var mountainsOfTheMoon = new Area('The Mountains of the Moon', 0, 1, 0, 0, false);
var riverrun           = new Area('Riverun',                   0, 1, 1, 2, false);
var eyrie              = new Area('Eyrie',                     0, 1, 1, 1, false);
var lannisport         = new Area('Lannisport',                0, 2, 0, 2, true, lannister);
var harrenhal          = new Area('Harrenhal',                 0, 0, 1, 1, false);
var dragonstone        = new Area('Dragonstone',               0, 1, 1, 2, true, baratheon);
var stoneySept         = new Area('Stoney Sept',               0, 0, 1, 0, false);
var crackclawPoint     = new Area('Crackclaw Point',           0, 0, 0, 1, false);
var searoadMarches     = new Area('Searoad Marches',           0, 1, 0, 0, false);
var blackwater         = new Area('Blackwater',                0, 2, 0, 0, false);
var kingsLanding       = new Area('King\'s Landing',           0, 0, 2, 2, false);
var kingswood          = new Area('Kingswood',                 0, 1, 1, 0, false);
var highgarden         = new Area('Highgarden',                0, 2, 0, 2, false);
var reach              = new Area('The Reach',                 0, 0, 0, 1, false);
var dornishMarches     = new Area('Doenish Marches',           0, 0, 1, 0, false);
var stormsEnd          = new Area('Storms End',                0, 0, 0, 1, true);
var boneway            = new Area('The Boneway',               0, 0, 1, 0, false);
var oldtown            = new Area('Oldtown',                   0, 0, 0, 2, true, tyrell);
var princesPass        = new Area('Princes Pass',              0, 1, 1, 0, false);
var threeTowers        = new Area('Three Towers',              0, 1, 0, 0, false);
var sunspear           = new Area('Sunspear',                  0, 1, 1, 2, true, martel);
var yronwood           = new Area('Yronwood',                  0, 0, 0, 1, false);
var saltShore          = new Area('Salt Shore',                0, 1, 0, 0, false);
var starfall           = new Area('Starfall',                  0, 1, 0, 1, false);
var arbor              = new Area('The Arbor',                 0, 0, 1, 0, false);

var bayOfIce           = new Area('Bay of Ice',                1, 0, 0, 0, false);
var shiveringSea       = new Area('The Shivering Sea',         1, 0, 0, 0, false);
var narrowSea          = new Area('The Narrow Sea',            1, 0, 0, 0, false);
var sunsetSea          = new Area('Sunset Sea',                1, 0, 0, 0, false);
var ironmansBay        = new Area('Ironman\'s Bay',            1, 0, 0, 0, false);
var goldenSound        = new Area('The Golden Sound',          1, 0, 0, 0, false);
var blackwaterBay      = new Area('Blackwater Bay',            1, 0, 0, 0, false);
var shipbreakerBay     = new Area('Shipbreaker Bay',           1, 0, 0, 0, false);
var seaOfDorne         = new Area('Sea of Dorne',              1, 0, 0, 0, false);
var redwyneStraights   = new Area('Redwyne Straights',         1, 0, 0, 0, false);
var westSummerSea      = new Area('West Summer Sea',           1, 0, 0, 0, false);
var eastSummerSea      = new Area('East Summer Sea',           1, 0, 0, 0, false);


var board = new Board();

