/**
 * @file Building class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * Building are built on Planet. They are about terraforming, or exploiting ressources.
 *
 * @class
 */
aos.Building = function () {
    /** @type {string} */
    this.type = "";
    /** @type {string} */
    this.name = "";
    /** @type  */
    this.requirements= {};
    /**  */
    this.production= {};
    /** @type {number} */
    this.storage = 0;
    /** @type {boolean} */
    this.functional = true;
};

aos.Building.prototype = {
    construct : function(name){
        for (let i = 0 ; i < aos.buildings.length ; i++){
            if(aos.buildings[i].name == name){
                this.name = name;
                this.type = aos.buildings[i].type;
                this.requirements = aos.buildings[i].require;
                this.production = aos.buildings[i].produce;
                this.storage = aos.buildings[i].storage;
            }
        }
    },

    renderContextual : function(){
        
    }


};