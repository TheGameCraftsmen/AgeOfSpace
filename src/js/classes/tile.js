/**
 * @file Tile class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * Tiles are subdivisions of a  Planet. They may contain Buildings.
 *
 * @class
 */
aos.Tile = function () {
    /** @type {string} */
    this.buildingTemplate = '';
    /** @type {boolean} */
    this.functional = true;
    /** @type {boolean} */
    this.isLand = false;
    this.rng = Math.random();
    this.color = '';
};

aos.Tile.prototype = {


};
