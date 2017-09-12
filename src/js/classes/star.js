/**
 * @file Star class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * Star is a solar sytem. It will contains several planet
 *
 * @class
 */
aos.Star = function () {
    /** @type {aos.Planet} */
    this.planets = {};
};

aos.Star.prototype = {

    generate: function () {
        const nbPlanets = Math.floor(Math.random() * 10);        
    },

    generateName: function () {

    }
};



