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
    /** @type {aos.Resource} */
    this.resources = [];
    this.storedResources = [];
    /** @type {number} */
    this.landSize = 0;

    /** @type {aos.building} */
    this.buildings = [];
    /** @type {Array.<string>} */
    this.tiles = [];
    /** @type {number}*/
    this.luminosity = 70;

    this.renderModel = null;
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
     *         -- "storage"  : to add resource to stored resource by the player (metal, food, ...)
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
            storage = this.storedResources;
        }
        let resFound = null;

        for (let i = 0 ; i < storage.length && resFound == null ; i++) {
            if (storage[i].name == res) {
                resFound = storage[i];
            }
        }
        if (resFound == null) {

            resFound = new aos.Resource();
            resFound.construct(res);
            resFound.name = res;
            resFound.quantity = quant;
            storage.push(resFound);
        } else {
            resFound.quantity += quant;
        }
    },

    generate: function () {
        const rng = Math.random();
        if (rng < 0.25) {
            this.size = 8;
        } else if (rng < 0.5) {
            this.size = 12;
        } else if (rng < 0.75) {
            this.size = 20;
        } else {
            this.size = 60;
        }

        this.generateEarth();

        this.addResource('metal', 'storage', 20000);
        this.renderModel = new aos.Polyhedron();
        this.renderModel.initialize(this.size);
    },

    buildTiles: function () {
        const landTilesCount = Math.floor(this.size * this.landSize);
        const loop = new Array(this.size).join(' ').split(' ');
        loop.forEach(function (item, idx) {
            this.tiles.push({
                'rng': Math.random(),
                'isLand': idx < landTilesCount,
                'color': idx < landTilesCount ? '#860' : '#04b',
                'buildingName': ''
            });
        }, this);
        this.tiles.sort(function (a, b) {
            return a.rng - b.rng;
        });
    },

    generateRandom: function () {
        this.landSize = Math.random();
        this.buildTiles();
        this.generateAir();
        this.generateGround();
        this.generateLiquid();
    },

    generateEarth: function () {
        this.landSize = 0.30; // (percent)
        this.buildTiles();
        aos.resources.forEach(function (resource, i) {
            this.addResource(resource.name, 'storage', 0);
            this.addResource(resource.name, 'planet', 0);
        }, this);

        this.addResource('oxygen', 'planet', 210000);
        this.addResource('inert gases', 'planet', 790000);
        this.addResource('oxocarbon', 'planet', 400);
        this.addResource('acid cloud', 'planet', 0);
        this.addResource('salt water', 'planet', 9750000);
        this.addResource('fresh water', 'planet', 250000);
        this.addResource('toxic waste', 'planet', 0);
        this.addResource('mineral', 'planet', 9700000);
        this.addResource('metal', 'planet', 200000);
        this.addResource('fissile material', 'planet', 10000);
        this.addResource('ground pollution', 'planet', 1000);

        //this.addResource('bacteria', 'storage', 1000);
        this.addResource('flora', 'storage', 1000);
        this.addResource('fauna', 'storage', 1000);
        this.addResource('humans', 'storage', 1000);
        this.addResource('virus', 'storage', 1000);
        this.addResource('machines', 'storage', 1000);

    },

    addBuilding: function (name, location) {
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
            if (b.type === 'ship') {
                aos.game.selectedStar.hasShip = true;
                aos.game.selectedStar.ship = new aos.Ship();
                aos.game.selectedStar.ship.init();
                aos.game.selectedStar.ship.storedResources[7].quantity = 2000; // oxygen

            }
        }
        aos.game.emitEvent('requestUiSlowRefresh', {});
    },

    removeBuilding: function (name) {
        let findBuildingIndex = -1;
        for (let it = 0 ; it < this.buildings.length && findBuildingIndex == -1 ; it++) {
            if (this.buildings[it].name === name) {
                findBuildingIndex = it;
                if (this.buildings[it].type === 'ship') {
                    aos.game.selectedStar.hasShip = false;
                }

            }
        }
        this.buildings.splice(findBuildingIndex, 1);
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
            for (let itRes = 0 ; itRes < this.storedResources.length ; itRes++) {
                if (this.storedResources[itRes].name == name && this.storedResources[itRes].quantity >= quantity) {
                    qtyRemoved = quantity;
                    if (!isChecking) this.storedResources[itRes].quantity -= qtyRemoved;
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
        this.buildings.forEach(function (building, i) {

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
                for (let itProd = 0 ; itProd < building.produce.product.length ; itProd++) {
                    this.addResource(building.produce.product[itProd].name, building.produce.product[itProd].to, building.produce.product[itProd].quantity);
                }
            }
        }, this);
    },

    runPopulation: function () {
        for (let itPopulation = 0; itPopulation < this.storedResources.length; itPopulation++) {
            let popResource = this.storedResources[itPopulation];
            if (popResource.type == "population") {
                if (popResource.name === "bacteria") {
                    let oxoCarbonFound = null;
                    for (let itResource = 0 ; itResource < this.resources.length ; itResource++) {
                        let res = this.resources[itResource];
                        if (res.name === "oxocarbon" && res.quantity > 1000) {
                            oxoCarbonFound = res;
                            break;
                        }
                    }
                    if (oxoCarbonFound !== null) {
                        oxoCarbonFound.quantity = oxoCarbonFound.quantity > 1000 ? oxoCarbonFound.quantity - 1000 : 0;
                        this.addResource("oxygen", "planet", popResource.quantity * 0.1);
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
            for (let itLocation = 0 ; itLocation < building.location.length ; itLocation++) {
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
                if (found.cells[1].innerHTML == "") {
                    found.cells[1].innerHTML = 1;
                    found.cells[5].innerHTML = "-";
                } else {
                    found.cells[1].innerHTML = parseInt(found.cells[1].innerHTML) + 1
                }

                found.cells[2].innerHTML = this.buildings[elt].functional ? "Enable" : "Disable";
                found.cells[3].innerHTML = this.buildings[elt].produce.product[0].quantity;

            }

        }
    },

    updatePies: function () {
        aos.game.pies.forEach(function (pie, i) {
            pie.content.forEach(function (res, j) {
                const label = res.label;
                this.resources.forEach(function (resource, i) {
                    if (resource.name === label) {
                        res.value = resource.quantity;
                    }
                }, this);
            }, this);
            pie.update();
        }, this);
    },

    updateBars: function () {
        aos.game.planetResourceBars.forEach(function (bar, i) {
            bar.htmlElement.firstChild.childNodes[0].style = 'display: none';
            const label = bar.name;
            bar.quantity = 0;
            this.storedResources.forEach(function (resource, j) {
                if (resource.name === label) {
                    bar.quantity = resource.quantity;
                    if (resource.quantity > 0) {
                        bar.htmlElement.firstChild.childNodes[0].style = 'display: inline-block';
                    }
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

    animateModel: function () {
        this.renderModel.animateAndRender(this.tiles);
    }

};
