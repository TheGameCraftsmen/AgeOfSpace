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
    /** @type {string} */
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
    /** @type {aos.Polyhedron} */
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
            resFound.constructResource(res);
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
            const t = new aos.Tile();
            t.isLand = idx < landTilesCount;
            t.color = idx < landTilesCount ?
                'hsl(' + (40 + Math.floor(10 * Math.random())) + ', ' + (30 + Math.floor(30 * Math.random())) + '%, ' + (25 + Math.floor(10 * Math.random())) + '%)' :
                'hsl(' + (230 + Math.floor(20 * Math.random())) + ', ' + (60 + Math.floor(30 * Math.random())) + '%, ' + (25 + Math.floor(10 * Math.random())) + '%)';
            this.tiles.push(t);
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
        this.tiles.forEach(function (tile, i) {
            if (tile.buildingTemplate !== '') {
                tile.functional = true;
                const building = aos.buildingTemplates[tile.buildingTemplate];
                if (typeof building.produce.require !== 'undefined') {
                    building.produce.require.forEach(function (req, i) {
                        const removeRes = this.removeResource(req.name, req.quantity, req.planetResource, true);
                        if (removeRes !== req.quantity) {
                            tile.functional = false;
                        }
                    }, this);
                    if (tile.functional) {
                        building.produce.require.forEach(function (req, i) {
                            this.removeResource(req.name, req.quantity, req.planetResource, false);
                        }, this);
                    }
                }
                if (tile.functional) {
                    building.produce.product.forEach(function (prod, i) {
                        this.addResource(prod.name, prod.to, prod.quantity);
                    }, this);
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

    updateBuildingButtons: function () {
        const counterDictionary = {};
        this.tiles.forEach(function (tile, i) {
            if (tile.buildingTemplate !== '') {
                if (typeof counterDictionary[tile.buildingTemplate] === 'undefined') {
                    counterDictionary[tile.buildingTemplate] = 0;
                }
                counterDictionary[tile.buildingTemplate] += 1;
            }
        }, this);
        aos.game.buildingButtons.forEach(function (button, i) {
            button.update(counterDictionary);
        }, this);
        if (this.renderModel.selectedTile !== -1 && this.tiles[this.renderModel.selectedTile].buildingTemplate !== '') {
            document.getElementById('removeBuilding').style.display = 'inline-block';
        } else {
            document.getElementById('removeBuilding').style.display = 'none';
        }
    },

    showStats: function () {
        this.updatePies();
        this.updateBars();
        this.updateBuildingButtons();
    },

    setupEvents: function () {
        window.addEventListener('gameplayTick', function (e) {
            this.run();
        }.bind(this), false);
    },

    animateModel: function () {
        this.renderModel.animateAndRender(this.tiles);
    },

    onBuildingButtonClicked: function (templateName) {
        if (this.renderModel.selectedTile !== -1) {
            const tile = this.tiles[this.renderModel.selectedTile];
            const building = aos.buildingTemplates[templateName];
            if ((tile.isLand && building.buildOnLand) || (!tile.isLand && building.buildOnWater)) {
                let constructOk = true;
                building.constructionCost.forEach(function (cost, i) {
                    const qty = this.removeResource(cost.name, cost.quantity, false, true);
                    if (qty != cost.quantity) {
                        constructOk = false;
                    }
                }, this);
                if (constructOk) {
                    building.constructionCost.forEach(function (cost, i) {
                        this.removeResource(cost.name, cost.quantity, false, false);
                    }, this);
                    if (building.type === 'ship') {
                        aos.game.selectedStar.hasShip = true;
                        aos.game.selectedStar.ship = new aos.Ship();
                        aos.game.selectedStar.ship.init();
                        aos.game.selectedStar.ship.storedResources[7].quantity = 2000; // oxygen
                    } else {
                        tile.buildingTemplate = templateName;
                    }
                    this.renderModel.selectedTile = -1;
                    aos.game.emitEvent('requestUiSlowRefresh', {});
                }
            }
        }
    },

    onRemoveButtonClicked: function () {
        if (this.renderModel.selectedTile !== -1 && this.tiles[this.renderModel.selectedTile].buildingTemplate !== '') {
            this.tiles[this.renderModel.selectedTile].buildingTemplate = '';
            this.renderModel.selectedTile = -1;
            aos.game.emitEvent('requestUiSlowRefresh', {});
        }
    },

};
