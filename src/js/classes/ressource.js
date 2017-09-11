/**
 * @file Resssource class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * This class concerns the ressource available on a planet (air, ground, crops...)
 *
 * @class
 */
aos.Ressource = function () {
    /** @type {String} 
     * Air, Ground, metal
    */
    this.type = "";
    /** @type {String} */
    this.name = "";
    /** @type {number} */
    this.quantity=0;
};