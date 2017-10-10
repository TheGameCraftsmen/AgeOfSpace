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
    /** @type {String} */
    this.id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    /** @type {number} 
     * in Million km2
    */
    this.size = 0;
    /** @type {aos.ressource} */
    this.ressources = [];
    /** @type {aos.ressource} */
    this.ressourcesStored = [];
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
    this.buildings = [];
    /** @type {boolean} 
     * Planet must be scanned to show planet properties to Player
    */
    this.scanned = false;
};

aos.Planet.prototype = {
    /**
     * addressource : allow to add a ressource to a storage on a planet
     * 
     * This method allows :
     *         -- to pass argument ressource an aos.ressource (type & quantity are optional in this case)
     *         -- to pass argument ressource as a string, type & quantity are mandatory in this case
     * 
     * Argument to if passed define which store is concerned by the ressource :
     *         -- "planet" : to add ressource to planet (water, oxygen, ...)
     *         -- "local"  : to add ressource to stored ressource by the player (metal, food, ...)
     */
    addRessource: function (ressource, to, type, quantity) {
        let res = ressource;
        let typ = type;
        let quant = quantity;
        if (typeof ressource == "object") {
            res = ressource.name;
            typ = ressource.type;
            quant = ressource.quantity;
        }
        let storage = null;
        if (to == "planet") {
            storage = this.ressources;
        } else {
            storage = this.ressourcesStored;
        }
        let resFound = null;
        for (let i = 0 ; i < storage.length && resFound == null ; i++) {
            if (storage[i].name == res) {
                resFound = storage[i];
            }
        }
        if (resFound == null) {
            resFound = new aos.Ressource();
            resFound.name = res;
            resFound.type = typ;
            resFound.quantity = quant;
            storage.push(resFound);
        } else {
            resFound.quantity += quant;
        }
    },

    generate: function () {
        this.size = Math.floor(Math.random() * 5 + 1);
        this.landSize = Math.random * this.size;
        this.generateAir();
        this.generateGround();
        this.generateLiquid();
        /*let b = new aos.Building();
        b.construct("metal Mine");
        this.buildings.push(b);
        b = new aos.Building();
        b.construct("solar plant");
        this.buildings.push(b);

        b = new aos.Building();
        b.construct("CO2 epuration");
        this.buildings.push(b);

        console.log(this.ressources);
        */
    },

    addBuilding : function(name){
        let b = new aos.Building();
        b.construct(name);
        this.buildings.push(b);
    },

    generateAir: function () {
        var compositionPercent = 0;
        for (let i = 0 ; i < aos.ressources.length ; i++) {
            if (aos.ressources[i].category == "air") {
                let ressource = new aos.Ressource();
                ressource.type = "air";
                ressource.name = aos.ressources[i].name;
                if (i == (aos.ressources.length - 1)) {
                    ressource.percent = 100 - compositionPercent;
                    ressource.quantity = (100 - compositionPercent) * this.size * aos.volumeRessources[ressource.type];
                } else {
                    let itAirPrcent = Math.floor(Math.random() * (100 - compositionPercent))
                    ressource.quantity = itAirPrcent * this.size * aos.volumeRessources[ressource.type];
                    ressource.percent = itAirPrcent;
                    compositionPercent += itAirPrcent;
                }
                this.ressources.push(ressource);
            }
        }
    },

    generateLiquid: function () {
        var compositionPercent = 0;
        for (let i = 0 ; i < aos.ressources.length ; i++) {
            if (aos.ressources[i].category == "liquid") {
                let ressource = new aos.Ressource();
                ressource.type = "liquid";
                ressource.name = aos.ressources[i].name;
                if (i == (aos.ressources.length - 1)) {
                    ressource.quantity = (100 - compositionPercent) * this.size * aos.volumeRessources[ressource.type];
                    ressource.percent = (100 - compositionPercent) * this.size * aos.volumeRessources[ressource.type];
                } else {
                    let itPrcent = Math.floor(Math.random() * (100 - compositionPercent))
                    ressource.quantity = itPrcent * this.size * aos.volumeRessources[ressource.type];
                    ressource.percent = itPrcent;
                    compositionPercent += itPrcent;
                }
                this.ressources.push(ressource);
            }
        }
    },

    generateGround: function () {
        var compositionPercent = 0;
        for (let i = 0 ; i < aos.ressources.length ; i++) {
            if (aos.ressources[i].category == "ground") {
                let ressource = new aos.Ressource();
                ressource.type = "ground";
                ressource.name = aos.ressources[i].name;
                if (i == (aos.ressources.length - 1)) {
                    ressource.percent = 100 - compositionPercent;
                    ressource.quantity = ressource.percent * this.size * aos.volumeRessources[ressource.type];
                    this.ressources.push(ressource);
                } else {
                    let itPrcent = Math.floor(Math.random() * (100 - compositionPercent))
                    ressource.percent = itPrcent;
                    ressource.quantity = itPrcent * this.size * aos.volumeRessources[ressource.type];
                    this.ressources.push(ressource);
                    compositionPercent += itPrcent;
                }
            }

        }
    },

    populationGrowing: function () {
        if (this.healtingIndicator > 50) {
            this.population += 100000;
        } else {
            this.population -= 100000;
        }
    },

    removeRessource: function (name, quantity, planetRessource, isChecking) {
        let qtyRemoved = 0;
        if (planetRessource) {
            for (let itPlanetRes = 0 ; itPlanetRes < this.ressources.length ; itPlanetRes++) {
                if (this.ressources[itPlanetRes].name == name && this.ressources[itPlanetRes].quantity >= quantity) {
                    if (!isChecking) this.ressources[itPlanetRes].quantity -= quantity;
                    qtyRemoved = quantity;
                }
            }
        } else {
            for (let itRes = 0 ; itRes < this.ressourcesStored.length ; itRes++) {
                if (this.ressourcesStored[itRes].name == name && this.ressourcesStored[itRes].quantity >= quantity) {
                    qtyRemoved = quantity;
                    if (!isChecking) this.ressourcesStored[itRes].quantity -= qtyRemoved;
                }
            }
        }
        return qtyRemoved;
    },

    checkCondition : function(condition){
        var result = true;  
        if (condition.planetRessource) {
            for (let itPlanetRes = 0 ; itPlanetRes < this.ressources.length ; itPlanetRes++) {
                if ( this.ressources[itPlanetRes].name == condition.name){
                    if (typeof condition.quantity === "undefined"){
                        //console.log(this.ressources[itPlanetRes]);
                        result = this.ressources[itPlanetRes].percent >= condition.percent;
                    }else{
                        result = this.ressources[itPlanetRes].quantity >= condition.quantity;
                    }
                }
            }
        }

        return result;
    },

    produce: function (typeProduct) {
        for (let itBuilding = 0 ; itBuilding < this.buildings.length ; itBuilding++) {
            let building = this.buildings[itBuilding];
            if (building.type === typeProduct || typeof typeProduct === "undefined" || typeProduct == "" || typeProduct == null) {
                building.functional = true;
                if (typeof building.production.conditions !== "undefined"){
                    for ( let itCondition = 0 ; itCondition < building.production.conditions.length ; itCondition++){
                        building.functional = building.functional && this.checkCondition(building.production.conditions[itCondition]);
                    }
                }

                if (typeof building.production.require !== "undefined" && building.functional) {
                    for (let itProd = 0 ; itProd < building.production.require.length ; itProd++) {
                        let removeRes = this.removeRessource(building.production.require[itProd].name, building.production.require[itProd].quantity, building.production.require[itProd].planetRessource, true);
                        if (removeRes != building.production.require[itProd].quantity) {
                            building.functional = false;
                            break;
                        }
                    }
                    if (building.functional) {
                        for (let itProd = 0 ; itProd < building.production.require.length ; itProd++) {
                            this.removeRessource(building.production.require[itProd].name, building.production.require[itProd].quantity, building.production.require[itProd].planetRessource, false);
                        }
                    }
                }
                if (building.functional) {
                    this.addRessource(building.production.product, building.production.to, building.production.type, building.production.quantity);
                }
            }
        }
    },

    run: function (speedTick) {
        this.produce();
        
    },

    showBuildings: function () {
        let buildingCount = {};
        for (var i = 0 ; i < this.buildings.length ; i++) {
            if (typeof buildingCount[this.buildings[i].name] === "undefined") {
                buildingCount[this.buildings[i].name] = { "building": this.buildings[i], "count": 1 };
            } else {
                buildingCount[this.buildings[i].name].count += 1;
            }
        }

        for (let elt in buildingCount) {
            let table = document.getElementById(buildingCount[elt].building.type + "Buildings");
            let nbRows = table.rows.length;
            let found = null;
            for (let i = 0 ; i < nbRows ; i++) {
                if (table.rows[i].cells[0].innerHTML == buildingCount[elt].building.name) {
                    found = table.rows[i];
                    break;
                }
            }

            if (found == null) {
                let row = table.insertRow(nbRows);
                let cell1 = row.insertCell(0);
                cell1.innerHTML = buildingCount[elt].building.name;
                let cell2 = row.insertCell(1);
                cell2.innerHTML = buildingCount[elt].count;
                let cell3 = row.insertCell(2);
                cell3.innerHTML = buildingCount[elt].building.functional ? "Enable" : "Disable";
                let cell4 = row.insertCell(3);
                cell4.innerHTML = buildingCount[elt].building.production.quantity;
            } else {
                found.cells[1].innerHTML = buildingCount[elt].count;
                found.cells[2].innerHTML = buildingCount[elt].building.functional ? "Enable" : "Disable";
                found.cells[3].innerHTML = buildingCount[elt].building.production.quantity
            }
        }
    },

    recalculatePercent: function () {
        for (let i = 0 ; i < this.ressources.length ; i++) {
            this.ressources[i].percent = (this.ressources[i].quantity) / (100 * this.size * aos.volumeRessources[this.ressources[i].type]) * 100;
        }
    },

    updatePies: function () {
        aos.game.pies.forEach(function (pie, i) {
            pie.content.forEach(function (res, j) {
                const label = res.label;
                this.ressources.forEach(function (resource, i) {
                    if (resource.name === label) {
                        res.value = resource.quantity;
                    }
                }, this);
            }, this);
            pie.update();
        }, this);
    },

    updateBars: function () {
        aos.game.resourceBars.forEach(function (bar, i) {
            const label = bar.name;
            bar.quantity = 0;
            this.ressourcesStored.forEach(function (resource, i) {
                if (resource.name === label) {
                    bar.quantity = resource.quantity;
                }
            }, this);
            bar.update();
        }, this);
    },

    showStats: function () {
        this.showBuildings();
        this.updatePies();
        this.updateBars();
    },

    setupEvents: function () {
        window.addEventListener('gameplayTick', function (e) {
            this.run(1);
        }.bind(this), false);
    },

};
