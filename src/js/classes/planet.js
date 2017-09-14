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
        this.size = Math.floor(Math.random() * 5) * 150;
        this.landSize = Math.random * this.size;
        this.generateAir();
        this.generateGround();
    },

    generateAir : function(){
        var compositionPercent=0;
        for(let i=0;i<aos.ressources["air"].length;i++){   
            let ressource = new aos.Ressource();
            ressource.type="air";
            ressource.name=aos.ressources["air"][i].name;
            if (i==(aos.ressources["air"].length-1)){
                ressource.quantity=100-compositionPercent;
            }else{
                let itAirPrcent = Math.floor(Math.random() * (100-compositionPercent))
                ressource.quantity=itAirPrcent;
                compositionPercent+=itAirPrcent;
            }
            this.air.push(ressource);
        }
    },

    generateMetal : function(prcent){
        var compositionPercent = 0;
        for(let i=0;i<aos.ressources["metal"].length;i++){   
            let ressource = new aos.Ressource();
            ressource.type="metal";
            ressource.name=aos.ressources["metal"][i].name;
            if (i==(aos.ressources["metal"].length-1)){
                ressource.quantity=prcent-compositionPercent;
            }else{
                let itPrcent = Math.floor(Math.random() * (prcent-compositionPercent))
                ressource.quantity=itPrcent * 100000000;
                compositionPercent+=itPrcent;
            }
            this.ground.push(ressource);
        }
    },

    generateGround : function(){
        var compositionPercent=0;
        for(let i=0;i<aos.ressources["ground"].length;i++){   
            let ressource = new aos.Ressource();
            ressource.type="ground";
            ressource.name=aos.ressources["ground"][i].name;
            if (i==(aos.ressources["ground"].length-1)){
                ressource.quantity=100-compositionPercent;
                this.ground.push(ressource);
            }else{
                let itPrcent = Math.floor(Math.random() * (100-compositionPercent))
                if(aos.ressources["ground"][i].name == "metal"){
                    this.generateMetal(itPrcent);
                }else{
                    
                    ressource.quantity=itPrcent;
                    this.ground.push(ressource);
                }
                compositionPercent+=itPrcent;
            }
            
        }
        console.log(this.ground);
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

        this.calculateHealthIndicator();
        this.populationGrowing();
        this.showStats();
    },

    showPlanetRessources: function(){
        for(let i=0;i<this.ground.length;i++){
            if (this.ground[i].type == "metal"){
                document.getElementById('p' + this.ground[i].name + 'Text').innerHTML = this.ground[i].quantity;            
            }
        }
    },

    showStoredRessrouces : function(){

    },

    showStats : function(){
        document.getElementById('populationTxt').innerHTML = this.population + " colons";    
        document.getElementById('healthingTxt').innerHTML = this.healtingIndicator + " %";    
        this.showPlanetRessources();
        this.showStoredRessrouces();
    }

    
};
var instance = null;
window.onload = function () {
    instance = new aos.Planet();
    instance.generate();
};

window.setInterval(function(){
    instance.run(1);
},500);