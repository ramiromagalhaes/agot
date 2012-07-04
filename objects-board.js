//Areas and Board
//Legend --------------- LAND AREAS -------------------------> t  s  p  c  port? ctrller
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
var sunspear           = new Area('Sunspear',                  0, 1, 1, 2, true, martell);
var yronwood           = new Area('Yronwood',                  0, 0, 0, 1, false);
var saltShore          = new Area('Salt Shore',                0, 1, 0, 0, false);
var starfall           = new Area('Starfall',                  0, 1, 0, 1, false);
var arbor              = new Area('The Arbor',                 0, 0, 1, 0, false);

//Legend --------------- SEA AREAS --------------------------> t  s  p  c  port? ctrller
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

// adding those areas to the board
var board = new Board();
board.addArea(castleBlack);
board.addArea(karhold);
board.addArea(winterfell);
board.addArea(stonyShore);
board.addArea(whiteHarbor);
board.addArea(widowsWatch);
board.addArea(greywaterWatch);
board.addArea(flintsFinger);
board.addArea(moatCailin);
board.addArea(seagard);
board.addArea(fingers);
board.addArea(twins);
board.addArea(pike);
board.addArea(mountainsOfTheMoon);
board.addArea(riverrun);
board.addArea(eyrie);
board.addArea(lannisport);
board.addArea(harrenhal);
board.addArea(dragonstone);
board.addArea(stoneySept);
board.addArea(crackclawPoint);
board.addArea(searoadMarches);
board.addArea(blackwater);
board.addArea(kingsLanding);
board.addArea(kingswood);
board.addArea(highgarden);
board.addArea(reach);
board.addArea(dornishMarches);
board.addArea(stormsEnd);
board.addArea(boneway);
board.addArea(oldtown);
board.addArea(princesPass);
board.addArea(threeTowers);
board.addArea(sunspear);
board.addArea(yronwood);
board.addArea(saltShore);
board.addArea(starfall);
board.addArea(arbor);
board.addArea(bayOfIce);
board.addArea(shiveringSea);
board.addArea(narrowSea);
board.addArea(sunsetSea);
board.addArea(ironmansBay);
board.addArea(goldenSound);
board.addArea(blackwaterBay);
board.addArea(shipbreakerBay);
board.addArea(seaOfDorne);
board.addArea(redwyneStraights);
board.addArea(westSummerSea);
board.addArea(eastSummerSea);

board.setAdjacency(castleBlack, [bayOfIce, karhold, winterfell, shiveringSea]);
board.setAdjacency(karhold, [castleBlack, winterfell, shiveringSea]);
board.setAdjacency(winterfell, [castleBlack, bayOfIce, karhold, stonyShore, whiteHarbor, shiveringSea, moatCailin]);
board.setAdjacency(stonyShore, [bayOfIce, winterfell]);
board.setAdjacency(whiteHarbor, [winterfell, shiveringSea, widowsWatch, narrowSea, moatCailin]);
board.setAdjacency(widowsWatch, [whiteHarbor, shiveringSea, narrowSea]);
board.setAdjacency(greywaterWatch, [bayOfIce, flintsFinger, moatCailin, ironmansBay, seagard]);
board.setAdjacency(flintsFinger, [bayOfIce, greywaterWatch, sunsetSea, ironmansBay]);
board.setAdjacency(moatCailin, [winterfell, whiteHarbor, narrowSea, greywaterWatch, seagard, twins]);
board.setAdjacency(fingers, [narrowSea, twins, mountainsOfTheMoon]);
board.setAdjacency(seagard, [greywaterWatch, moatCailin, ironmansBay, twins, riverrun]);
board.setAdjacency(twins, [narrowSea, moatCailin, seagard, fingers, mountainsOfTheMoon]);
board.setAdjacency(pike, [ironmansBay]);
board.setAdjacency(mountainsOfTheMoon, [narrowSea, fingers, twins, eyrie, crackclawPoint]);
board.setAdjacency(riverrun, [ironmansBay, seagard, lannisport, harrenhal, stoneySept, goldenSound]);
board.setAdjacency(eyrie, [narrowSea, mountainsOfTheMoon]);
//board.setAdjacency(, []);
//board.setAdjacency(, []);

board.setAdjacency(bayOfIce, [castleBlack, winterfell, stonyShore, greywaterWatch, sunsetSea, flintsFinger]);
