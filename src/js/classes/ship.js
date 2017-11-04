/**
 * @file Ship class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * A ship transports resources from one planet to another.
 *
 * @class
 */
aos.Ship = function () {
    this.startTick = 0;
    this.from = 0; // ID of the the planet where the ship starts
    this.to = 0; // ID of the planet where the ship ends

    this.name = "";
    this.speed = 0;
    this.cargoSize = 0;
    this.constructionCost = [];

};

aos.Ship.prototype = {

};



