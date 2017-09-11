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
     * 0 : population decreases deadly, 50 : population stagnation, 100 : population grows highly
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
        this.generateAir();
    },

    generateAir : function(){
        for(let i=0;i<aos.ressources["air"].length;i++){
            console.log(aos.ressources["air"][i]);
        }
    },

    generateGround : function(){

    },

    calculateHealthIndicator: function(){
        this.healtingIndicator = 70;
    },

    populationGrowing : function(){
        if(this.healtingIndicator > 50){
            this.population += 100000;
        }else{
            this.population -= 100000;
        }
    },

    run : function(speedTick){

        self.calculateHealthIndicator();
        self.populationGrowing();

    }

    
};

window.onload = function () {
    const instance = new aos.Planet();
    instance.generate();
};