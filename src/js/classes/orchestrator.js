﻿/**
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

    this.mousePosition = { x: 0, y: 0 };
    this.isDragging = false;
    this.dragStart = null;
    this.dragEnd = null;

    this.pies = [];
    this.shipResourceBars = [];
    this.planetResourceBars = [];
    this.buildingButtons = [];

    this.transits = [];
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

        aos.resources.forEach(function (resource, i) {
            this.renderBar(document.getElementById('res' + i + 'Storage'), resource, i, true);
            this.renderBar(document.getElementById('res' + i + 'Ship'), resource, i, false);
        }, this);

        Object.keys(aos.buildingTemplates).forEach(function (key, i) {
            this.renderBuildingButton(document.getElementById('building' + i + 'Build'), key);
            const fullSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
                + '<path fill="{color}" d="'.replace('{color}', 'hsl(0, 0%, 80%)')
                + aos.buildingTemplates[key].svgCode
                + '"></path>'
                + '</svg>';
            const image = document.getElementById("resourceImg" + i);
            image.src = 'data:image/svg+xml,' + encodeURIComponent(fullSvgCode);
            const fullSvgCodeDisabled = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
                + '<path fill="{color}" d="'.replace('{color}', 'hsl(0, 80%, 50%)')
                + aos.buildingTemplates[key].svgCode
                + '"></path>'
                + '</svg>';
            const imageDisabled = document.getElementById("resourceDisabled" + i);
            imageDisabled.src = 'data:image/svg+xml,' + encodeURIComponent(fullSvgCodeDisabled);
        }, this);

    },

    renderPie: function (elem, txt, category) {
        const chart = new aos.PieChart();
        chart.htmlElement = elem;
        chart.innerText = txt;
        chart.content = [];
        aos.resources.forEach(function (resource, i) {
            if (resource.category === category) {
                chart.content.push({ label: resource.name, value: i + 1, color: resource.color });
            }
        }, this);
        chart.render();
        this.pies.push(chart);
        elem.addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = '' + txt + ' composition' + '<br><em>&nbsp;</em>';
            chart.setWantContextual(true);
        }.bind(this), false);
        elem.addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            chart.setWantContextual(false);
        }.bind(this), false);
    },

    renderBar: function (elem, res, idx, isStorage) {
        const bar = new aos.Resource();
        bar.htmlElement = elem;
        bar.name = res.name;
        bar.svgCode = res.svgCode;
        bar.color = res.color;
        bar.type = res.category;
        bar.contextualTip = res.contextualTip;
        bar.index = idx;
        bar.render(isStorage);
        if (isStorage) {
            this.planetResourceBars.push(bar);
            elem.firstChild.childNodes[0].addEventListener('click', function (e) {
                e.preventDefault();
                if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null && this.selectedStar.hasShip) {
                    if (this.selectedStar.selectedPlanet.storedResources[bar.index].quantity > 0) {
                        const transferAmount = Math.min(10000, this.selectedStar.selectedPlanet.storedResources[bar.index].quantity, this.selectedStar.ship.availableSpace());
                        this.selectedStar.selectedPlanet.storedResources[bar.index].quantity -= transferAmount;
                        this.selectedStar.ship.storedResources[bar.index].quantity += transferAmount;
                        this.emitEvent('requestUiSlowRefresh', {});
                    }
                }
            }.bind(this), false);
            elem.firstChild.childNodes[0].addEventListener('mouseover', function (e) {
                if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null && this.selectedStar.hasShip) {
                    if (this.selectedStar.selectedPlanet.storedResources[bar.index].quantity > 0) {
                        bar.setTooltipFlag(true, false, false);
                    }
                }
            }.bind(this), false);
            elem.firstChild.childNodes[0].addEventListener('mouseout', function (e) {
                bar.setTooltipFlag(false, false, false);
            }.bind(this), false);

            elem.firstChild.childNodes[3].addEventListener('click', function (e) {
                e.preventDefault();
                if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null && this.selectedStar.hasShip) {
                    if (this.selectedStar.ship.storedResources[bar.index].quantity > 0) {
                        const transferAmount = Math.min(10000, this.selectedStar.ship.storedResources[bar.index].quantity);
                        this.selectedStar.selectedPlanet.storedResources[bar.index].quantity += transferAmount;
                        this.selectedStar.ship.storedResources[bar.index].quantity -= transferAmount;
                        this.emitEvent('requestUiSlowRefresh', {});
                    }
                }
            }.bind(this), false);
            elem.firstChild.childNodes[3].addEventListener('mouseover', function (e) {
                if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null && this.selectedStar.hasShip) {
                    if (this.selectedStar.ship.storedResources[bar.index].quantity > 0) {
                        bar.setTooltipFlag(false, true, false);
                    }
                }
            }.bind(this), false);
            elem.firstChild.childNodes[3].addEventListener('mouseout', function (e) {
                bar.setTooltipFlag(false, false, false);
            }.bind(this), false);

            elem.firstChild.childNodes[7].addEventListener('click', function (e) {
                e.preventDefault();
                if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null) {
                    if (this.selectedStar.selectedPlanet.storedResources[bar.index].quantity > 0) {
                        const transferAmount = Math.min(10000, this.selectedStar.selectedPlanet.storedResources[bar.index].quantity);
                        this.selectedStar.selectedPlanet.storedResources[bar.index].quantity -= transferAmount;
                        this.selectedStar.selectedPlanet.resources[bar.index].quantity += transferAmount;
                        this.emitEvent('requestUiSlowRefresh', {});
                    }
                }
            }.bind(this), false);
            elem.firstChild.childNodes[7].addEventListener('mouseover', function (e) {
                if (this.selectedStar !== null && this.selectedStar.selectedPlanet !== null) {
                    if (this.selectedStar.selectedPlanet.storedResources[bar.index].quantity > 0) {
                        bar.setTooltipFlag(false, false, true);
                    }
                }
            }.bind(this), false);
            elem.firstChild.childNodes[7].addEventListener('mouseout', function (e) {
                bar.setTooltipFlag(false, false, false);
            }.bind(this), false);
        } else {
            this.shipResourceBars.push(bar);
        }
        elem.addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            bar.setWantContextual(true);
        }.bind(this), false);
        elem.addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            bar.setWantContextual(false);
        }.bind(this), false);
    },

    renderBuildingButton: function (elem, templateName) {
        const button = new aos.BuildingButton();
        button.buildingTemplate = templateName;
        button.htmlElement = elem;
        button.render();
        this.buildingButtons.push(button);
        elem.addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            button.setWantContextual(true);
        }.bind(this), false);
        elem.addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
            button.setWantContextual(false);
        }.bind(this), false);
        elem.addEventListener('click', function (e) {
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.onBuildingButtonClicked(button.buildingTemplate);
            }
        }.bind(this), false);
    },
    //#endregion

    setGameSpeed: function (newSpeed) { // expects newSpeed = 0, 1 or 2
        this.gameSpeedMultiplier = newSpeed === 2 ? 5 : newSpeed;
        document.getElementById('speed0').style.border = '';
        document.getElementById('speed1').style.border = '';
        document.getElementById('speed2').style.border = '';
        document.getElementById('speed' + newSpeed).style.border = '4px solid #f00';
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

    refreshGalaxyOverlay: function () {
        const galaxyCoordX = this.mousePosition.x;
        const galaxyCoordY = this.mousePosition.y;

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

        // Transit render
        this.transits.forEach(function (transit) {
            const lerpRatio = (this.gameTime - transit.startTick) / (transit.endTick - transit.startTick);
            const shipX = transit.from.x + lerpRatio * (transit.to.x - transit.from.x);
            const shipY = transit.from.y + lerpRatio * (transit.to.y - transit.from.y);

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#360';
            ctx.arc(600 + shipX, 450 + shipY, 5, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.setLineDash([2, 5]);
            ctx.moveTo(600 + transit.from.x, 450 + transit.from.y);
            ctx.lineTo(600 + transit.to.x, 450 + transit.to.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }, this);

        // End of transit operations (adding ship to target star)
        const endOfTransit = this.transits.filter(function (transit) {
            return transit.endTick <= this.gameTime;
        }, this);
        endOfTransit.forEach(function (transit) {
            transit.to.hasShip = true;
            transit.to.ship = transit;
            transit.from = null;
            transit.to = null;
        }, this);
        this.transits = this.transits.filter(function (transit) {
            return transit.endTick > this.gameTime;
        }, this);

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
    },

    setupEvents: function () {
        document.getElementById('galaxyOverlayCanvas').addEventListener('mousemove', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            const galaxyCoordX = e.offsetX * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 600;
            const galaxyCoordY = e.offsetY * 1200 / document.getElementById('galaxyOverlayCanvas').offsetWidth - 450;
            //document.getElementById('debug').innerHTML = '' + galaxyCoordX + '/' + galaxyCoordY + '/' + '<br/>';
            this.mousePosition.x = galaxyCoordX;
            this.mousePosition.y = galaxyCoordY;

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
                    this.dragStart = star;
                    if (star.hasShip) {
                        this.isDragging = true;
                    }
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
                if (dist < radius && this.dragStart === star) {
                    this.setSelectedStar(star);
                    this.isDragging = false;
                } else if (this.isDragging && this.dragEnd !== null && this.dragStart.hasShip) {
                    //document.getElementById('galaxyBlock').style.display = 'none';
                    //document.getElementById('shipBlock').style.display = 'block';
                    const shipInTransit = this.dragStart.ship;
                    shipInTransit.from = this.dragStart;
                    shipInTransit.to = this.dragEnd;
                    shipInTransit.startTick = this.gameTime;
                    const transitDistanceX = shipInTransit.from.x - shipInTransit.to.x;
                    const transitDistanceY = shipInTransit.from.y - shipInTransit.to.y;
                    const transitDistance = Math.sqrt(transitDistanceX * transitDistanceX + transitDistanceY * transitDistanceY);
                    shipInTransit.endTick = this.gameTime + transitDistance * 20;
                    this.transits.push(shipInTransit);
                    this.dragStart.hasShip = false;
                    this.dragStart.ship = null;
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
            e.preventDefault();
            this.setSelectedStar(null);
        }.bind(this), false);
        document.getElementById('closeShip').addEventListener('click', function (e) {
            e.preventDefault();
            this.setSelectedStar(null);
        }.bind(this), false);
        document.getElementById('speed0').addEventListener('click', function (e) {
            e.preventDefault();
            this.setGameSpeed(0);
        }.bind(this), false);
        document.getElementById('speed1').addEventListener('click', function (e) {
            e.preventDefault();
            this.setGameSpeed(1);
        }.bind(this), false);
        document.getElementById('speed2').addEventListener('click', function (e) {
            e.preventDefault();
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

        document.getElementById('planetModelCanvas').addEventListener('mouseover', function (e) {
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.renderModel.rotates = false;
                document.getElementById('contextualBlock').style.display = 'block';
                this.selectedStar.selectedPlanet.setWantPolyhedronContextual(true);
            }
        }.bind(this), false);
        document.getElementById('planetModelCanvas').addEventListener('mouseout', function (e) {
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.renderModel.rotates = true;
                document.getElementById('contextualBlock').style.display = 'none';
                this.selectedStar.selectedPlanet.setWantPolyhedronContextual(false);
            }
        }.bind(this), false);
        document.getElementById('planetModelCanvas').addEventListener('mousemove', function (e) {
            e.preventDefault();
            const x = e.offsetX * 500 / document.getElementById('planetModelCanvas').offsetWidth;
            const y = e.offsetY * 500 / document.getElementById('planetModelCanvas').offsetWidth;
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.renderModel.mousePosition = [x, y];
            }
        }.bind(this), false);
        document.getElementById('planetModelCanvas').addEventListener('click', function (e) {
            e.preventDefault();
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.renderModel.wantSelectedTile = true;
            }
        }.bind(this), false);

        document.getElementById('removeBuilding').addEventListener('mouseover', function (e) {
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = 'Destroy building' + '<br><em>' + '&nbsp;' + '</em>';
            document.getElementById('contextualTxt').innerHTML = '';
        }.bind(this), false);
        document.getElementById('removeBuilding').addEventListener('mouseout', function (e) {
            document.getElementById('contextualBlock').style.display = 'none';
        }.bind(this), false);
        document.getElementById('removeBuilding').addEventListener('click', function (e) {
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.onRemoveButtonClicked();
            }
        }.bind(this), false);

        window.setInterval(function () {
            this.emitEvent('requestUiFastRefresh', {});
        }.bind(this), 130);
        window.setInterval(function () {
            this.emitEvent('requestUiSlowRefresh', {});
        }.bind(this), 1100);

        window.addEventListener('requestUiFastRefresh', function (e) {
            document.getElementById('gameTime').textContent = (this.gameTime / 1000.0).toFixed(1);
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.showStatsFast();
            }
        }.bind(this), false);
        window.addEventListener('requestUiSlowRefresh', function (e) {
            if (this.selectedStar !== null) {
                this.selectedStar.selectedPlanet.showStats();
                this.selectedStar.showShip();
            }
        }.bind(this), false);
        window.addEventListener('animationTick', function (e) {
            if (this.selectedStar !== null) {
                const wantRefresh = this.selectedStar.selectedPlanet.renderModel.wantSelectedTile;
                this.selectedStar.animateLargeStar();
                this.selectedStar.selectedPlanet.animateModel();
                //this.selectedStar.animateShip();
                if (wantRefresh) {
                    this.emitEvent('requestUiSlowRefresh', {});
                }
            } else {
                this.refreshGalaxyOverlay();
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
