/**
 * @file Orchestrator class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * The orchestrator is responsible for initial instanciations and time management.
 * It also maintains an instance reference.
 *
 * @class
 */
aos.Orchestrator = function () {
    this.galaxy = {};
    this.selectedStar = null;
    this.gameSpeedMultiplier = 0; // can be 0 (pause), 1, or 5. Set by the controls in the bottom right corner of the screen
    this.gameTime = 0; // elapsed milliseconds since the start of the game. Grows faster if the speed is 5x
    this.lastGameplayTick = 0; // dispatches an update event every x milliseconds in game time (x = 1000?)
    this.lastAnimationFrame = 0; // time interval counter

    this.isDragging = false;
    this.dragStart = null;
    this.dragEnd = null;

    this.pies = [];
    this.resourceBars = [];
};

aos.Orchestrator.prototype = {

    start: function () {
        this.buildPlanetUi();
        this.galaxy = new aos.Galaxy();
        this.galaxy.generate();
        document.getElementById('starSystemBlock').style.display = 'none';
        document.getElementById('shipBlock').style.display = 'none';
        document.getElementById('contextualBlock').style.display = 'none';
        document.getElementById('contextualTxt').innerHTML = '';
        this.setupEvents();
        this.animationTick(0);
        this.setGameSpeed(1);
    },

    //#region Planet UI
    buildPlanetUi: function () {
        this.renderPie(document.getElementById('airPie'), 'Air', 'air');
        this.renderPie(document.getElementById('liquidPie'), 'Ocean', 'liquid');
        this.renderPie(document.getElementById('groundPie'), 'Soil', 'ground');

        this.renderBar(document.getElementById('humansPop'), 'Humans');
        this.renderBar(document.getElementById('machinesPop'), 'Machines');
        this.renderBar(document.getElementById('bacteriaPop'), 'Bacteria');
        this.renderBar(document.getElementById('plantsPop'), 'Plants');
        this.renderBar(document.getElementById('animalsPop'), 'Animals');

        let resourceGroup = 'air';
        aos.ressources.forEach(function (resource, i) {
            this.renderBar(document.getElementById('res' + i + 'Storage'), resource.name);
            if (resource.category !== resourceGroup) {
                document.getElementById('res' + i + 'Storage').style.marginTop = '10px';
                resourceGroup = resource.category;
            }
        }, this);

        aos.buildings.forEach(function (b, i) {
            const building = new aos.Building();
            building.construct(b.name);
            for (let itLocation = 0 ; itLocation < b.location.length; itLocation++){
              const table = document.getElementById(building.location[itLocation].name + "Buildings");
              const row = table.insertRow();
              const cell1 = row.insertCell();
              cell1.innerHTML = building.name;
              cell1.addEventListener('mouseover', function (e) {
                  building.renderContextual();
              }.bind(this), false);
              cell1.addEventListener('mouseout', function (e) {
                  document.getElementById('contextualTxt').innerHTML = "";
                  document.getElementById('contextualBlock').style.display = 'None';
              }.bind(this), false);
              const cell2 = row.insertCell();
              const cell3 = row.insertCell();
              const cell4 = row.insertCell();
              const cell5 = row.insertCell();
              cell5.innerHTML = "+";
              cell5.addEventListener('click', function (e) {
                  if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null) {
                      let planet = this.selectedStar.selectedPlanet;
                      planet.addBuilding(building.name,building.location[itLocation].name);
                  }
              }.bind(this), false);
            }
        }, this);
    },

    renderPie: function (elem, txt, category) {
        const chart = new aos.PieChart();
        chart.htmlElement = elem;
        chart.innerText = txt;
        chart.content = [];
        const colors = ['#600', '#660', '#060', '#066', '#006', '#606', '#600', '#660', '#060', '#066', '#006', '#606', '#600', '#660', '#060', '#066', '#006', '#606'];
        aos.ressources.forEach(function (resource, i) {
            if (resource.category === category) {
                chart.content.push({ label: resource.name, value: i + 1, color: colors[i] });
            }
        }, this);
        chart.render();
        this.pies.push(chart);
    },

    renderBar: function (elem, txt) {
        const bar = new aos.Ressource();
        bar.htmlElement = elem;
        bar.name = txt;
        bar.render();
        this.resourceBars.push(bar);
    },
    //#endregion

    setGameSpeed: function (newSpeed) { // expects newSpeed = 0, 1 or 2
        this.gameSpeedMultiplier = newSpeed === 2 ? 5 : newSpeed;
        document.getElementById('speed0').style.border = '';
        document.getElementById('speed1').style.border = '';
        document.getElementById('speed2').style.border = '';
        document.getElementById('speed' + newSpeed).style.border = '4px solid #f00';
    },

    updateBuildingsAdd: function () {

        if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null) {
            var buildingTypeCount = {'ground' : 0, 'water' : 0};
            for (let itBuilding = 0 ; itBuilding < this.selectedStar.selectedPlanet.buildings.length ; itBuilding ++){
                buildingTypeCount[this.selectedStar.selectedPlanet.buildings[itBuilding].builtOn] += 1;
            }
            var buildingMaxBuilding = {'ground' : Math.floor((this.selectedStar.selectedPlanet.size +10) * this.selectedStar.selectedPlanet.landSize/100), 'water' : Math.floor((this.selectedStar.selectedPlanet.size +10) * ((100-this.selectedStar.selectedPlanet.landSize)/100))}
            //console.log(this.selectedStar.selectedPlanet.landSize/100);
            //var maxBuildingGroundReached = ((this.selectedStar.selectedPlanet.size +10) - this.selectedStar.selectedPlanet.buildings.length) > 0 ? false : true;
            for (let i = 0 ; i < aos.buildings.length ; i++) {
                for(let itLocation =0 ; itLocation < aos.buildings[i].location.length ; itLocation ++){
                  let table = document.getElementById(aos.buildings[i].location[itLocation].name + "Buildings");

                  let nbRows = table.rows.length;
                  let found = null;
                  for (let itRow = 0 ; itRow < nbRows ; itRow++) {
                      if (table.rows[itRow].cells[0].innerHTML == aos.buildings[i].name) {
                          found = table.rows[itRow];
                          break;
                      }
                  }
                  if (found !== null) {
                      //if (!maxBuildingReached){
                    //console.log("@@@ " + aos.buildings[i].location[itLocation].name + "//" + buildingMaxBuilding[aos.buildings[i].location[itLocation].name] + "//" + buildingTypeCount[aos.buildings[i].location[itLocation].name])  
                    if (buildingMaxBuilding[aos.buildings[i].location[itLocation].name]> buildingTypeCount[aos.buildings[i].location[itLocation].name]){
                        var requireOk = true;
                        for (let itRequire = 0 ; itRequire < aos.buildings[i].constructionCost.length ; itRequire++) {

                            var qty = this.selectedStar.selectedPlanet.removeRessource(aos.buildings[i].constructionCost[itRequire].name, aos.buildings[i].constructionCost[itRequire].quantity, false, true);
                            if (qty != aos.buildings[i].constructionCost[itRequire].quantity) {
                                requireOk = false;
                            }
                        }
                        if (requireOk) {
                            found.cells[4].innerHTML = "build";
                        } else {
                            found.cells[4].innerHTML = "<font color='red'>No</font>";
                        }
                      }else {
                          found.cells[4].innerHTML = "<font color='red'>No</font>";
                      }
                   }
                }
            }
        }
    },

    setSelectedStar: function (star) {
        this.selectedStar = star;
        if (star === null) {
            document.getElementById('galaxyBlock').style.display = 'block';
            document.getElementById('starSystemBlock').style.display = 'none';
            document.getElementById('shipBlock').style.display = 'none';
            document.getElementById('contextualBlock').style.display = 'none';
        } else {
            document.getElementById('galaxyBlock').style.display = 'none';
            document.getElementById('starSystemBlock').style.display = 'block';
            document.getElementById('shipBlock').style.display = 'none';
            document.getElementById('contextualBlock').style.display = 'none';
            star.buildUi();
        }
    },

    setupEvents: function () {
        document.getElementById('galaxyOverlayCanvas').addEventListener('mousemove', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            const galaxyCoordX = e.offsetX * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 600;
            const galaxyCoordY = e.offsetY * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 450;
            //document.getElementById('debug').innerHTML = '' + galaxyCoordX + '/' + galaxyCoordY + '/' + '<br/>';
            document.getElementById('galaxyOverlayCanvas').style.cursor = 'default';
            document.getElementById('contextualBlock').style.display = 'none';

            const canvas = document.getElementById('galaxyOverlayCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 1200, 900);
            const constellationId = this.galaxy.getConstellationId(galaxyCoordX, galaxyCoordY);
            this.galaxy.constellations.forEach(function (c, i) {
                c.render(i === constellationId);
            });
            this.dragEnd = null;
            if (this.isDragging) {
                this.galaxy.stars.forEach(function (star) {
                    if (this.dragStart === star) {
                        const deltaX = star.x - galaxyCoordX;
                        const deltaY = star.y - galaxyCoordY;
                        const dist = deltaX * deltaX + deltaY * deltaY;
                        const radius = star.isNotable ? 225.0 : 100.0; // 15² , 10²
                        if (dist > radius) {
                            ctx.beginPath();
                            ctx.lineWidth = 2;
                            ctx.moveTo(600 + star.x, 450 + star.y);
                            let lineDrawn = false;
                            this.galaxy.stars.forEach(function (target) {
                                const deltaX1 = target.x - galaxyCoordX;
                                const deltaY1 = target.y - galaxyCoordY;
                                const dist1 = deltaX1 * deltaX1 + deltaY1 * deltaY1;
                                const radius1 = target.isNotable ? 225.0 : 100.0; // 15² , 10²
                                if (dist1 < radius1) {
                                    ctx.strokeStyle = '#066';
                                    ctx.lineTo(600 + target.x, 450 + target.y);
                                    lineDrawn = true;
                                    this.dragEnd = target;
                                }
                            }, this);
                            if (!lineDrawn) {
                                ctx.strokeStyle = '#600';
                                ctx.lineTo(600 + galaxyCoordX, 450 + galaxyCoordY);
                            }
                            ctx.stroke();
                        }
                    }
                }, this);
            }
            if (constellationId === 0) {
                //ctx.beginPath();
                //ctx.strokeStyle = '#600';
                //ctx.lineWidth = 2;
                //ctx.arc(600, 450, 100, 0, 2 * Math.PI);
                //ctx.stroke();
                document.getElementById('contextualBlock').style.display = 'block';
                document.getElementById('contextualTitle').innerHTML = 'Galactic Core' +
                    '<br><em>&nbsp;</em>';
                document.getElementById('contextualTxt').innerHTML = '';
                document.getElementById('contextualTxt').innerHTML +=
                    '<div>DANGER<br><br>Black hole<br><br>Don\'t come close !</div>';
            }
            else {
                document.getElementById('contextualBlock').style.display = 'block';
                document.getElementById('contextualTitle').innerHTML = '' + this.galaxy.constellations[constellationId].reference.name +
                    '<br><em>Constellation</em>';
                document.getElementById('contextualTxt').innerHTML = '';
                {
                    let radical = this.galaxy.constellations[constellationId].loreStarCount;
                    let power = 8;
                    while (radical > 10.0) {
                        radical /= 10.0;
                        power++;
                    }
                    document.getElementById('contextualTxt').innerHTML +=
                        '<dl><dt>' + 'Stars (total)' + '</dt><dd>' + radical.toFixed(1) + ' × 10<sup>' + power + '</sup></dd></dl>';
                }
                const constellationStars = this.galaxy.constellations[constellationId].stars;
                document.getElementById('contextualTxt').innerHTML +=
                    '<dl><dt>' + 'Notable stars' + '</dt><dd>' + constellationStars.length + '</dd></dl>';
                document.getElementById('contextualTxt').innerHTML +=
                    '<dl><dt>' + 'Stars with at least' + '</dt><dd>' + '</dd></dl>';
                document.getElementById('contextualTxt').innerHTML +=
                    '<dl><dt>' + 'one planet in the' + '</dt><dd>' + constellationStars.filter(function (star) {
                        return star.isNotable;
                    }).length + '</dd></dl>';
                document.getElementById('contextualTxt').innerHTML +=
                    '<dl><dt>' + 'habitable zone' + '</dt><dd>' + '</dd></dl>';
            }

            //document.getElementById('debug').innerHTML = '' + constellationId + '/' + '<br/>';

            this.galaxy.constellations[constellationId].stars.forEach(function (star) {
                const deltaX = star.x - galaxyCoordX;
                const deltaY = star.y - galaxyCoordY;
                const dist = deltaX * deltaX + deltaY * deltaY;
                const radius = star.isNotable ? 225.0 : 100.0; // 15² , 10²
                const label = star.isNotable ? 'Star' : 'Star';
                if (dist < radius) { // sqrt(dist) < 20.0
                    document.getElementById('galaxyOverlayCanvas').style.cursor = 'pointer';
                    document.getElementById('contextualBlock').style.display = 'block';
                    document.getElementById('contextualTitle').innerHTML = '' +
                        star.greekLetter.name.charAt(0).toUpperCase() + star.greekLetter.name.slice(1) + ' ' +
                        this.galaxy.constellations[constellationId].reference.gen +
                    '<br><em>' + label + '</em>';
                    document.getElementById('contextualTxt').innerHTML = '';
                    document.getElementById('contextualTxt').innerHTML +=
                        '<dl><dt>' + 'Proper name' + '</dt><dd>' + star.properName.name + '</dd></dl>';
                    document.getElementById('contextualTxt').innerHTML +=
                        '<dl><dt>' + 'Type' + '</dt><dd>' +
                        (star.spectralClass === 'M' ? 'Red dwarf' :
                        star.spectralClass === 'K' ? 'Orange dwarf' :
                        star.spectralClass === 'G' ? 'Yellow dwarf' :
                        star.spectralClass === 'F' ? 'Yellow-white dwarf' :
                        star.spectralClass === 'A' ? 'White main sequence' :
                        star.spectralClass === 'B' ? 'Blue subgiant' : 'Blue giant') + '</dd></dl>';
                    document.getElementById('contextualTxt').innerHTML +=
                        '<dl><dt>' + 'Spectral class' + '</dt><dd>' + star.spectralClass + star.subSpectral + '</dd></dl>';
                    document.getElementById('contextualTxt').innerHTML +=
                        '<dl><dt>' + 'Luminosity class' + '</dt><dd>' + star.luminosityClass + '</dd></dl>';
                    document.getElementById('contextualTxt').innerHTML +=
                        '<dl><dt>' + 'Surface temperature' + '</dt><dd>' + 100 * Math.floor(star.temperature / 100) + ' K</dd></dl>';
                    {
                        let radical = star.mass;
                        let power = 29;
                        while (radical > 10.0) {
                            radical /= 10.0;
                            power++;
                        }
                        document.getElementById('contextualTxt').innerHTML +=
                            '<dl><dt>' + 'Mass' + '</dt><dd>' + radical.toFixed(1) + ' × 10<sup>' + power + '</sup> kg</dd></dl>';
                    }
                    {
                        let radical = star.radius;
                        let power = 8;
                        while (radical > 10.0) {
                            radical /= 10.0;
                            power++;
                        }
                        document.getElementById('contextualTxt').innerHTML +=
                            '<dl><dt>' + 'Radius' + '</dt><dd>' + radical.toFixed(1) + ' × 10<sup>' + power + '</sup> m</dd></dl>';
                    }
                    {
                        let radical = star.bolometricLuminosity;
                        let power = 22;
                        while (radical > 10.0) {
                            radical /= 10.0;
                            power++;
                        }
                        document.getElementById('contextualTxt').innerHTML +=
                            '<dl><dt>' + 'Bolometric luminosity' + '</dt><dd>' + radical.toFixed(1) + ' × 10<sup>' + power + '</sup> W</dd></dl>';
                    }
                    {
                        const mbol = -2.5 * Math.log(star.bolometricLuminosity / 4000.0) * Math.LOG10E + 5;
                        document.getElementById('contextualTxt').innerHTML +=
                            '<dl><dt>' + 'Absolute magnitude' + '</dt><dd>' + mbol.toFixed(1) + '</dd></dl>';
                    }
                }
                //document.getElementById('debug').innerHTML += dist + '<br/>';
            }, this);
        }.bind(this), false);

        document.getElementById('galaxyOverlayCanvas').addEventListener('mousedown', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            const galaxyCoordX = e.offsetX * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 600;
            const galaxyCoordY = e.offsetY * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 450;

            this.setSelectedStar(null);
            this.galaxy.stars.forEach(function (star) {
                const deltaX = star.x - galaxyCoordX;
                const deltaY = star.y - galaxyCoordY;
                const dist = deltaX * deltaX + deltaY * deltaY;
                const radius = star.isNotable ? 225.0 : 100.0; // 15² , 10²
                if (dist < radius) {
                    this.isDragging = true;
                    this.dragStart = star;
                }
            }, this);
        }.bind(this), false);

        document.getElementById('galaxyOverlayCanvas').addEventListener('mouseup', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            const galaxyCoordX = e.offsetX * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 600;
            const galaxyCoordY = e.offsetY * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 450;

            this.setSelectedStar(null);
            this.galaxy.stars.forEach(function (star) {
                const deltaX = star.x - galaxyCoordX;
                const deltaY = star.y - galaxyCoordY;
                const dist = deltaX * deltaX + deltaY * deltaY;
                const radius = star.isNotable ? 225.0 : 100.0; // 15² , 10²
                if (dist < radius && this.isDragging && this.dragStart === star) {
                    this.setSelectedStar(star);
                    this.isDragging = false;
                } else if (this.dragEnd !== null) {
                    document.getElementById('galaxyBlock').style.display = 'none';
                    document.getElementById('shipBlock').style.display = 'block';
                }
            }, this);
            this.isDragging = false;
        }.bind(this), false);

        document.getElementById('galaxyOverlayCanvas').addEventListener('mouseleave', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            document.getElementById('contextualTxt').innerHTML = '';
            this.isDragging = false;
        }.bind(this), false);

        document.getElementById('closeStarSystem').addEventListener('click', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            this.setSelectedStar(null);
        }.bind(this), false);
        document.getElementById('closeShip').addEventListener('click', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            this.setSelectedStar(null);
        }.bind(this), false);
        document.getElementById('speed0').addEventListener('click', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            this.setGameSpeed(0);
        }.bind(this), false);
        document.getElementById('speed1').addEventListener('click', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            this.setGameSpeed(1);
        }.bind(this), false);
        document.getElementById('speed2').addEventListener('click', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            this.setGameSpeed(2);
        }.bind(this), false);

        //#region Speed buttons help
        document.getElementById('speed0').addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = 'Speed control' + '<br><em>Pause</em>';
            document.getElementById('contextualTxt').innerHTML = '<div>Pauses the game</div>';
        }.bind(this), false);
        document.getElementById('speed0').addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            document.getElementById('contextualTxt').innerHTML = '';
        }.bind(this), false);
        document.getElementById('speed1').addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = 'Speed control' + '<br><em>Normal speed</em>';
            document.getElementById('contextualTxt').innerHTML = '<div>Runs the game at normal speed<br><br>1 second in real life = 1 tick in game</div>';
        }.bind(this), false);
        document.getElementById('speed1').addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            document.getElementById('contextualTxt').innerHTML = '';
        }.bind(this), false);
        document.getElementById('speed2').addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = 'Speed control' + '<br><em>Fast speed</em>';
            document.getElementById('contextualTxt').innerHTML = '<div>Runs the game at fast speed<br>(5 times the normal speed)<br><br>1 second in real life = 5 ticks in game</div>';
        }.bind(this), false);
        document.getElementById('speed2').addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            document.getElementById('contextualTxt').innerHTML = '';
        }.bind(this), false);
        //#endregion

        //#region Pies help
        document.getElementById('airPie').addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = 'Air composition' + '<br><em>&nbsp;</em>';
            this.pies[0].setWantContextual(true);
        }.bind(this), false);
        document.getElementById('airPie').addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            this.pies[0].setWantContextual(false);
        }.bind(this), false);
        document.getElementById('liquidPie').addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = 'Ocean composition' + '<br><em>&nbsp;</em>';
            this.pies[1].setWantContextual(true);
        }.bind(this), false);
        document.getElementById('liquidPie').addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            this.pies[1].setWantContextual(false);
        }.bind(this), false);
        document.getElementById('groundPie').addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = 'Soil composition' + '<br><em>&nbsp;</em>';
            this.pies[2].setWantContextual(true);
        }.bind(this), false);
        document.getElementById('groundPie').addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            this.pies[2].setWantContextual(false);
        }.bind(this), false);
        //#endregion

        document.getElementById('miniatureTabs').addEventListener('click', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            let clickedElem = e.target;
            while (clickedElem.tagName.toUpperCase() !== 'LI' && clickedElem.tagName.toUpperCase() !== 'BODY') {
                clickedElem = clickedElem.parentElement;
            }
            if (clickedElem.tagName.toUpperCase() === 'LI') {
                this.selectedStar.setSelectedPlanetIndex(+clickedElem.dataset.index);
            }
        }.bind(this), false);


        //window.addEventListener('resize', function (e) {
        //    document.getElementById('debug').innerHTML = 'x';
        //    document.getElementById('debug').innerHTML += window.getComputedStyle(document.body, null).width + '/';
        //    document.getElementById('debug').innerHTML += window.getComputedStyle(document.body, null).height
        //}.bind(this), false);

        window.setInterval(function () {
            this.emitEvent('requestUiFastRefresh', {});
        }.bind(this), 130);
        window.setInterval(function () {
            this.emitEvent('requestUiSlowRefresh', {});
        }.bind(this), 1100);

        window.addEventListener('requestUiFastRefresh', function (e) {
            document.getElementById('gameTime').innerHTML = (this.gameTime / 1000.0).toFixed(1);
            //document.getElementById('debug').innerHTML = JSON.stringify(this.pies[0].content);
        }.bind(this), false);
        window.addEventListener('requestUiSlowRefresh', function (e) {
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.showStats();
                this.updateBuildingsAdd();
            }
        }.bind(this), false);

    },

    emitEvent: function (type, payload) {
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, false, false, payload);
        window.dispatchEvent(event);
    },

    animationTick: function (timestamp) {
        this.emitEvent('animationTick', { ts: timestamp, speed: this.gameSpeedMultiplier });
        this.gameTime += (timestamp - this.lastAnimationFrame) * this.gameSpeedMultiplier;
        this.lastAnimationFrame = timestamp;
        if (this.gameTime / 1000.0 > this.lastGameplayTick) {
            this.lastGameplayTick += 1;
            this.emitEvent('gameplayTick', { tick: this.lastGameplayTick });
        }
        window.requestAnimationFrame(this.animationTick.bind(this));
    },

};

aos.game = new aos.Orchestrator();
window.onload = function () {
    aos.game.start();
};
