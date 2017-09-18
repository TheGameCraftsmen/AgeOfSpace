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
 * The Star class represents a stellar and planetary sytem. It contains one star and several planets.
 *
 * @class
 */
aos.Star = function () {
    // general data, relative to galaxy
    this.x = 0; // coordinates relative to the galaxy
    this.y = 0;
    this.isNotable = false;
    this.greekLetter = {};
    this.constellation = {};

    // detail data for star (lore)
    this.luminosityClass = '?';
    this.spectralClass = '?';
    this.temperature = 0;
    this.mass = 0;
    this.radius = 0;
    this.bolometricLuminosity = 0;

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
        // we only generate main sequence stars because they represent more than 90% of the galaxy
        // source: https://astronomy.stackexchange.com/questions/13165/what-is-the-frequency-distribution-for-luminosity-classes-in-the-milky-way-galax
        let classRatio;
        if (this.isNotable) {
            classRatio = 1.0 + 3.0 * Math.random();
        } else {
            classRatio = 7.0 * Math.random() * Math.random();
        }
        if (classRatio < 1.0) {
            // source: https://en.wikipedia.org/wiki/Stellar_classification#Modern_classification
            this.luminosityClass = 'V';
            this.spectralClass = 'M';
            this.temperature = 2400.0 + 1300.0 * classRatio;
            this.mass = 2.0 + 7.0 * classRatio; // unit is 10^29 kg ; divide by 20 to get mass in M☉
            this.radius = 3.0 + 2.0 * classRatio; // unit is 10^8 m ; divide by 7 to get radius in R☉
            this.bolometricLuminosity = 1.0 + 319.0 * classRatio; // unit is 10^22 W ; divide by 4000 to get luminosity in L☉
        }
        const nbPlanets = Math.floor(Math.random() * 10);
    },

};



