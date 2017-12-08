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
    this.cargoSize = 50000;
    this.constructionCost = [];

    this.storedResources = [];
};

aos.Ship.prototype = {

    init: function () {
        aos.resources.forEach(function (resource, i) {
            const res = new aos.Resource();
            res.constructResource(resource.name);
            res.quantity = 0;
            this.storedResources.push(res);
        }, this);
    },

    updateBars: function () {
        aos.game.shipResourceBars.forEach(function (bar, i) {
            aos.game.planetResourceBars[i].htmlElement.firstChild.childNodes[3].style = 'display: none';
            const label = bar.name;
            bar.quantity = 0;
            this.storedResources.forEach(function (resource, j) {
                if (resource.name === label) {
                    bar.quantity = resource.quantity;
                    if (resource.quantity > 0) {
                        aos.game.planetResourceBars[i].htmlElement.firstChild.childNodes[3].style = 'display: inline-block';
                    }
                }
            }, this);
            bar.update();
        }, this);
    },

    occupiedSpace: function () {
        let sum = 0;
        this.storedResources.forEach(function (res, i) {
            sum += 10000 * Math.ceil(res.quantity / 10000);
        }, this);
        return sum;
    },

    availableSpace: function () {
        return this.cargoSize - this.occupiedSpace();
    },

};



