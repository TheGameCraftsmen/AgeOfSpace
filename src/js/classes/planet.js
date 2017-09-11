/**
 * @file Planet class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * The planet is part of solar system. Player will try to colonize it, according to constraint like breathable air,....
 * Player will certainly need to terraform it.
 *
 * @class
 */
aos.Planet = function () {
    /** @type {number} 
     * in Million km2
    */
    this.size = 0;
    /** @type {aos.ressource} */
    this.air = [];
    /** @type {aos.ressource} */
    this.ground = [];
    /** @type {number} */
    this.landSize = 0;
    /** @type {number} */
    this.population = 0;
    /** @type {number} 
     * Indicator calculated to estimate the viability of the planet. Population will grow or not depending of it.
    */
    this.healtingIndicator = 0;
    /** @type {aos.building} */
    this.buildings=[];
    /** @type {boolean} 
     * Planet must be scanned to show planet properties to Player
    */
    this.scanned = false;
};

aos.Planet.prototype = {

    generate: function () {
        this.size = Math.floor(Math.random * 5) * 150;
        this.landSize = Math.random * this.size;

    },

    generateAir : function(){

    }

    
};
