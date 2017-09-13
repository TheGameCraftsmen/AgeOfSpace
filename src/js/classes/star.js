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
 * The Star class represents a stellar sytem. It contains one star and several planets.
 *
 * @class
 */
aos.Star = function () {
    // star details
    this.x = 0; // coordinates relative to the galaxy
    this.y = 0;
    this.isNotable = false;
    this.greekLetter = {};

    // technical private stuff, required for kruskal
    this.r = 0;
    this.group = 0;
    this.keep = true;

    //planet details
    /** @type {aos.Planet} */
    this.planets = [];
};

aos.Star.prototype = {

    generate: function () {
        const nbPlanets = Math.floor(Math.random() * 10);        
    },

    generateName: function () {

    }
};



