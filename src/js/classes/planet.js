﻿/**
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
    /** @type {aos.Resource} */
    this.resources = [];
    this.storage = [];
    /** @type {number} */
    this.landSize = 0;

    /** @type {aos.star} */
    this.star = null;
    
    /** @type {aos.building} */
    this.buildings = [];
};

aos.Planet.prototype = {
    /**
     * addResource : allow to add a resource to a storage on a planet
     *
     * This method allows :
     *         -- to pass argument resource an aos.resource (type & quantity are optional in this case)
     *         -- to pass argument resource as a string, type & quantity are mandatory in this case
     *
     * Argument to if passed define which store is concerned by the resource :
     *         -- "planet" : to add resource to planet (water, oxygen, ...)
     *         -- "local"  : to add resource to stored resource by the player (metal, food, ...)
     */
    addResource: function (resource, to, quantity) {
        let res = resource;
        let quant = quantity;
        if (typeof resource == "object") {
            res = resource.name;
            quant = resource.quantity;
        }
        let storage = null;
        if (to == "planet") {
            storage = this.resources;
        } else {
            storage = this.star.resourceShared;
        }
        let resFound = null;
        
        for (let i = 0 ; i < storage.length && resFound == null ; i++) {
            if (storage[i].name == res) {
                resFound = storage[i];
            }
        }
        if (resFound == null) {
            resFound = new aos.Resource();
            resFound.construct();
            resFound.name = res;
            resFound.quantity = quant;
            storage.push(resFound);
        } else {
            resFound.quantity += quant;
        }
    },
    

    generate: function () {
        this.size = Math.floor(Math.random() * 5 + 1);
        this.landSize = Math.floor(Math.random()*100);
        this.generateAir();
        this.generateGround();
        this.generateLiquid();

    },

    addBuilding: function (name,location) {
        let _location = location || "ground";
        let b = new aos.Building();
        b.construct(name);
        var constructOk = true;
        for (let i = 0; i < b.constructionCost.length; i++) {
            var qty = this.removeResource(b.constructionCost[i].name, b.constructionCost[i].quantity, false, true);
            if (qty != b.constructionCost[i].quantity) constructOk = false;
        }
        if (constructOk) {
            for (let i = 0; i < b.constructionCost.length; i++) {
                var qty = this.removeResource(b.constructionCost[i].name, b.constructionCost[i].quantity, false, false);
            }
            b.builtOn = _location;
            this.buildings.push(b);
        }
        aos.game.emitEvent('requestUiSlowRefresh', {});
    },

    removeBuilding: function(name){
        let findBuildingIndex = -1;
        for ( let it = 0 ; it < this.buildings.length && findBuildingIndex == -1 ; it ++){
            if (this.buildings[it].name == name){
                findBuildingIndex = it;
            }
        }
        this.buildings.splice(findBuildingIndex,1);
        aos.game.emitEvent('requestUiSlowRefresh', {});
    },

    generateAir: function () {
        var compositionPercent = 0;
        for (let i = 0 ; i < aos.resources.length ; i++) {
            if (aos.resources[i].category == "air") {
                let resource = new aos.Resource();
                resource.type = "air";
                resource.name = aos.resources[i].name;
                if (i == (aos.resources.length - 1)) {
                    resource.percent = 100 - compositionPercent;
                    resource.quantity = (100 - compositionPercent) * this.size * aos.volumeResources[resource.type];
                } else {
                    let itAirPrcent = Math.floor(Math.random() * (100 - compositionPercent))
                    resource.quantity = itAirPrcent * this.size * aos.volumeResources[resource.type];
                    resource.percent = itAirPrcent;
                    compositionPercent += itAirPrcent;
                }
                this.resources.push(resource);
            }
        }
    },

    generateLiquid: function () {
        var compositionPercent = 0;
        for (let i = 0 ; i < aos.resources.length ; i++) {
            if (aos.resources[i].category == "liquid") {
                let resource = new aos.Resource();
                resource.type = "liquid";
                resource.name = aos.resources[i].name;
                if (i == (aos.resources.length - 1)) {
                    resource.quantity = (100 - compositionPercent) * this.size * aos.volumeResources[resource.type];
                    resource.percent = (100 - compositionPercent) * this.size * aos.volumeResources[resource.type];
                } else {
                    let itPrcent = Math.floor(Math.random() * (100 - compositionPercent))
                    resource.quantity = itPrcent * this.size * aos.volumeResources[resource.type];
                    resource.percent = itPrcent;
                    compositionPercent += itPrcent;
                }
                this.resources.push(resource);
            }
        }
    },

    generateGround: function () {
        var compositionPercent = 0;
        for (let i = 0 ; i < aos.resources.length ; i++) {
            if (aos.resources[i].category == "ground") {
                let resource = new aos.Resource();
                resource.type = "ground";
                resource.name = aos.resources[i].name;
                if (i == (aos.resources.length - 1)) {
                    resource.percent = 100 - compositionPercent;
                    resource.quantity = resource.percent * this.size * aos.volumeResources[resource.type];
                    this.resources.push(resource);
                } else {
                    let itPrcent = Math.floor(Math.random() * (100 - compositionPercent))
                    resource.percent = itPrcent;
                    resource.quantity = itPrcent * this.size * aos.volumeResources[resource.type];
                    this.resources.push(resource);
                    compositionPercent += itPrcent;
                }
            }

        }
    },

    removeResource: function (name, quantity, planetResource, isChecking) {
        let qtyRemoved = 0;
        if (planetResource) {
            for (let itPlanetRes = 0 ; itPlanetRes < this.resources.length ; itPlanetRes++) {
                if (this.resources[itPlanetRes].name == name && this.resources[itPlanetRes].quantity >= quantity) {
                    if (!isChecking) this.resources[itPlanetRes].quantity -= quantity;
                    qtyRemoved = quantity;
                }
            }
        } else {
            for (let itRes = 0 ; itRes < this.star.resourceShared.length ; itRes++) {
                if (this.star.resourceShared[itRes].name == name && this.star.resourceShared[itRes].quantity >= quantity) {
                    qtyRemoved = quantity;
                    if (!isChecking) this.star.resourceShared[itRes].quantity -= qtyRemoved;
                }
            }
        }
        return qtyRemoved;
    },

    checkCondition: function (condition) {
        var result = true;
        if (condition.planetResource) {
            for (let itPlanetRes = 0 ; itPlanetRes < this.resources.length ; itPlanetRes++) {
                if (this.resources[itPlanetRes].name == condition.name) {
                    if (typeof condition.quantity === "undefined") {
                        result = this.resources[itPlanetRes].percent >= condition.percent;
                    } else {
                        result = this.resources[itPlanetRes].quantity >= condition.quantity;
                    }
                }
            }
        }

        return result;
    },

    produce: function () {
        for (let itBuilding = 0 ; itBuilding < this.buildings.length ; itBuilding++) {
            let building = this.buildings[itBuilding];
            building.functional = true;
            if (typeof building.produce.conditions !== "undefined") {
                for (let itCondition = 0 ; itCondition < building.produce.conditions.length ; itCondition++) {
                    building.functional = building.functional && this.checkCondition(building.produce.conditions[itCondition]);
                }
            }

            if (typeof building.produce.require !== "undefined" && building.functional) {
                for (let itProd = 0 ; itProd < building.produce.require.length ; itProd++) {
                    let removeRes = this.removeResource(building.produce.require[itProd].name, building.produce.require[itProd].quantity, building.produce.require[itProd].planetResource, true);
                    if (removeRes != building.produce.require[itProd].quantity) {
                        building.functional = false;
                        break;
                    }
                }
                if (building.functional) {
                    for (let itProd = 0 ; itProd < building.produce.require.length ; itProd++) {
                        this.removeResource(building.produce.require[itProd].name, building.produce.require[itProd].quantity, building.produce.require[itProd].planetResource, false);
                    }
                }
            }
            if (building.functional) {
                for(let itProd = 0 ; itProd < building.produce.product.length ; itProd ++ ){
                    this.addResource(building.produce.product[itProd].name, building.produce.product[itProd].to, building.produce.product[itProd].quantity);
                }
            }
        }
    },

    runPopulation: function(){
        for (let itPopulation = 0; itPopulation < this.resources.length; itPopulation++){
            let popResource = this.resources[itPopulation];
            if (popResource.type == "population"){
                if (popResource.name === "bacteria"){
                    let oxoCarbonFound = null;
                    for (let itResource= 0 ; itResource < this.resources.length ; itResource){
                        res = this.resources[itResource];
                        if (res.name === "oxocarbon" && res.quantity > 1000){
                            oxoCarbonFound = res;
                            break;
                        }
                    }
                    if (oxoCarbonFound !== null){
                        oxoCarbonFound.quantity = oxoCarbonFound.quantity > 1000 ? oxoCarbonFound.quantity - 1000 :0;
                        this.addResource("oxygen","planet",popResource.quantity*0.1);
                    }else{
                        popResource.quantity = popResource.quantity > 1000 ? popResource.quantity - 1000 :0;
                    }
                }
            }
        }
    },

    run: function () {
        this.produce();
        this.runPopulation();  
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

        aos.buildings.forEach(function (building, i) {
            for(let itLocation = 0 ; itLocation < building.location.length ; itLocation ++){
              const table = document.getElementById(building.location[itLocation].name + "Buildings");
              [].forEach.call(table.rows, function (row, i) {
                  if (i > 0) {
                      row.cells[1].innerHTML = "";
                      row.cells[2].innerHTML = "";
                      row.cells[3].innerHTML = "";
                      row.cells[5].innerHTML = "";
                  }
              });
            }
        }, this);

        for (let elt in this.buildings) {
              let table = document.getElementById(this.buildings[elt].builtOn + "Buildings");
              let nbRows = table.rows.length;
              let found = null;
              for (let i = 0 ; i < nbRows ; i++) {
                  if (table.rows[i].cells[0].innerHTML == this.buildings[elt].name) {
                      found = table.rows[i];
                      break;
                  }
              }
              if (found) {
                if (found.cells[1].innerHTML == ""){
                    found.cells[1].innerHTML = 1;
                    found.cells[5].innerHTML = "Destroy";
                }else{ 
                    found.cells[1].innerHTML = parseInt(found.cells[1].innerHTML)+1 
                }
                  
                  found.cells[2].innerHTML = this.buildings[elt].functional ? "Enable" : "Disable";
                  found.cells[3].innerHTML = this.buildings[elt].produce.product[0].quantity;
                  
              }
         
        }
    },

    updatePies: function () {
        aos.game.pies.forEach(function (pie, i) {
            if (pie.innerText !== "Planet"){
                pie.content.forEach(function (res, j) {
                    const label = res.label;
                    this.resources.forEach(function (resource, i) {
                        if (resource.name === label) {
                            res.value = resource.quantity;
                        }
                    }, this);
                }, this);
            }else{
                pie.content[0].value = this.landSize;
                pie.content[1].value = 100 - this.landSize;
            }
            
            pie.update();
        }, this);
    },

    updateBars: function () {
        aos.game.resourceBars.forEach(function (bar, i) {
            const label = bar.name;
            bar.quantity = 0;
            this.star.resourceShared.forEach(function (resource,i ){
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
            this.run();
        }.bind(this), false);
    },

};
