/**
 * @file Star class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * The Star class represents a stellar and planetary sytem. It contains one star and several planets.
 *
 * @class
 */
aos.Star = function () {
    // general data, relative to galaxy
    this.x = 0; // coordinates relative to the galaxy
    this.y = 0;
    this.isNotable = false;
    this.greekLetter = {};
    this.properName = {};
    this.constellation = {};

    // detail data for star (lore)
    this.luminosityClass = '?';
    this.spectralClass = '?';
    this.subSpectral = 0;
    this.temperature = 0;
    this.mass = 0;
    this.radius = 0;
    this.bolometricLuminosity = 0;
    this.color = { R: 0, G: 0, B: 0 };
    this.hasFlare = false;

    // technical private stuff, required for kruskal
    this.r = 0;
    this.group = 0;
    this.keep = true;

    //planet details
    /** @type {aos.Planet} */
    this.planets = [];
    this.selectedPlanet = null;
};

aos.Star.prototype = {

    generate: function () {
        // we only generate main sequence stars because they represent more than 90% of the galaxy
        // source: https://astronomy.stackexchange.com/questions/13165/what-is-the-frequency-distribution-for-luminosity-classes-in-the-milky-way-galax
        let classRatio;
        if (this.isNotable) {
            classRatio = 6.0 * Math.random(); // not squared because we want the highest possible variation, for gameplay reason
            // also blue stars are very unlikely to have planets but we keep them because they're awesome
        } else {
            classRatio = 7.0 * Math.random() * Math.random(); // squared because low energy stars are supposed to be more common in a real-world galaxy
        }
        for (let nbPlanets = 1 + Math.floor((10 - classRatio) * Math.random()) ; nbPlanets > 0 ; nbPlanets--) {
            this.planets.push(new aos.Planet());
        }
        this.planets.forEach(function (planet) {
            planet.generate();
        }, this);
        //#region Lore
        if (classRatio < 1.0) {
            // source: https://en.wikipedia.org/wiki/Stellar_classification#Modern_classification
            this.luminosityClass = 'V'; // main sequence
            this.spectralClass = 'M';
            this.temperature = 2000.0 + 1700.0 * classRatio; // unit is K
            this.mass = 2.0 + 7.0 * classRatio; // unit is 10^29 kg ; divide by 20 to get mass in M☉
            this.radius = 3.0 + 1.9 * classRatio; // unit is 10^8 m ; divide by 7 to get radius in R☉
            this.bolometricLuminosity = 20.0 + 300.0 * classRatio; // unit is 10^22 W ; divide by 4000 to get luminosity in L☉
            // source for color is black body radiation
            // see : https://en.wikipedia.org/wiki/File:Color_temperature_black_body_radiation_logarithmic_kelvins.svg
            const colorLeft = { R: 0xFF, G: 0x88, B: 0x0F }; // 2000 K
            const colorRight = { R: 0xFF, G: 0xC8, B: 0x90 }; // 3700 K
            this.color = { // lerp --> dirty but close enough
                R: Math.floor(colorLeft.R + classRatio * (colorRight.R - colorLeft.R)),
                G: Math.floor(colorLeft.G + classRatio * (colorRight.G - colorLeft.G)),
                B: Math.floor(colorLeft.B + classRatio * (colorRight.B - colorLeft.B))
            };
            this.subSpectral = Math.floor(10 * (1 - classRatio));
            if (Math.random() < 0.2) {
                this.hasFlare = true;
            }
        } else if (classRatio < 2.0) {
            classRatio -= 1.0;
            this.luminosityClass = 'V';
            this.spectralClass = 'K';
            this.temperature = 3700.0 + 1500.0 * classRatio;
            this.mass = 9.0 + 7.0 * classRatio;
            this.radius = 4.9 + 1.8 * classRatio;
            this.bolometricLuminosity = 320.0 + 2080.0 * classRatio;
            const colorLeft = { R: 0xFF, G: 0xC8, B: 0x90 }; // 3700 K
            const colorRight = { R: 0xFF, G: 0xE7, B: 0xD3 }; // 5200 K
            this.color = {
                R: Math.floor(colorLeft.R + classRatio * (colorRight.R - colorLeft.R)),
                G: Math.floor(colorLeft.G + classRatio * (colorRight.G - colorLeft.G)),
                B: Math.floor(colorLeft.B + classRatio * (colorRight.B - colorLeft.B))
            };
            this.subSpectral = Math.floor(10 * (1 - classRatio));
        } else if (classRatio < 3.0) {
            classRatio -= 2.0;
            this.luminosityClass = 'V';
            this.spectralClass = 'G';
            this.temperature = 5200.0 + 800.0 * classRatio;
            this.mass = 16.0 + 4.8 * classRatio;
            this.radius = 6.7 + 1.3 * classRatio;
            this.bolometricLuminosity = 2400.0 + 3600.0 * classRatio;
            const colorLeft = { R: 0xFF, G: 0xE7, B: 0xD3 }; // 5200 K
            const colorRight = { R: 0xFF, G: 0xF3, B: 0xEF }; // 6000 K
            this.color = {
                R: Math.floor(colorLeft.R + classRatio * (colorRight.R - colorLeft.R)),
                G: Math.floor(colorLeft.G + classRatio * (colorRight.G - colorLeft.G)),
                B: Math.floor(colorLeft.B + classRatio * (colorRight.B - colorLeft.B))
            };
            this.subSpectral = Math.floor(10 * (1 - classRatio));
        } else if (classRatio < 4.0) {
            classRatio -= 3.0;
            this.luminosityClass = 'V';
            this.spectralClass = 'F';
            this.temperature = 6000.0 + 1500.0 * classRatio;
            this.mass = 20.8 + 7.2 * classRatio;
            this.radius = 8.0 + 1.8 * classRatio;
            this.bolometricLuminosity = 6000.0 + 14000.0 * classRatio;
            const colorLeft = { R: 0xFF, G: 0xF3, B: 0xEF }; // 6000 K
            const colorRight = { R: 0xE9, G: 0xEC, B: 0xFF }; // 7500 K
            this.color = {
                R: Math.floor(colorLeft.R + classRatio * (colorRight.R - colorLeft.R)),
                G: Math.floor(colorLeft.G + classRatio * (colorRight.G - colorLeft.G)),
                B: Math.floor(colorLeft.B + classRatio * (colorRight.B - colorLeft.B))
            };
            this.subSpectral = Math.floor(10 * (1 - classRatio));
        } else if (classRatio < 5.0) {
            classRatio -= 4.0;
            this.luminosityClass = 'V';
            this.spectralClass = 'A';
            this.temperature = 7500.0 + 2500.0 * classRatio;
            this.mass = 28.0 + 14.0 * classRatio;
            this.radius = 9.8 + 2.8 * classRatio;
            this.bolometricLuminosity = 20000.0 + 80000.0 * classRatio;
            const colorLeft = { R: 0xE9, G: 0xEC, B: 0xFF }; // 7500 K
            const colorRight = { R: 0xC8, G: 0xD8, B: 0xFF }; // 10000 K
            this.color = {
                R: Math.floor(colorLeft.R + classRatio * (colorRight.R - colorLeft.R)),
                G: Math.floor(colorLeft.G + classRatio * (colorRight.G - colorLeft.G)),
                B: Math.floor(colorLeft.B + classRatio * (colorRight.B - colorLeft.B))
            };
            this.subSpectral = Math.floor(10 * (1 - classRatio));
        } else if (classRatio < 6.0) {
            classRatio -= 5.0;
            this.luminosityClass = 'IV';
            this.spectralClass = 'B';
            this.temperature = 10000.0 + 20000.0 * classRatio;
            this.mass = 42.0 + 278.0 * classRatio;
            this.radius = 12.6 + 33.6 * classRatio;
            this.bolometricLuminosity = 100000.0 + 120000000.0 * classRatio;
            const colorLeft = { R: 0xC8, G: 0xD8, B: 0xFF }; // 10000 K
            const colorRight = { R: 0x99, G: 0xBA, B: 0xFF }; // 30000 K
            this.color = {
                R: Math.floor(colorLeft.R + classRatio * (colorRight.R - colorLeft.R)),
                G: Math.floor(colorLeft.G + classRatio * (colorRight.G - colorLeft.G)),
                B: Math.floor(colorLeft.B + classRatio * (colorRight.B - colorLeft.B))
            };
            this.subSpectral = Math.floor(10 * (1 - classRatio));
        } else if (classRatio < 7.0) {
            classRatio -= 6.0;
            this.luminosityClass = 'III';
            this.spectralClass = 'O';
            this.temperature = 30000.0 + 20000.0 * classRatio;
            this.mass = 320.0 + 1360.0 * classRatio;
            this.radius = 46.2 + 28.7 * classRatio;
            this.bolometricLuminosity = 120000000.0 + 3528000000.0 * classRatio;
            const colorLeft = { R: 0x99, G: 0xBA, B: 0xFF }; // 30000 K
            const colorRight = { R: 0x92, G: 0xB5, B: 0xFF }; // 50000 K
            this.color = {
                R: Math.floor(colorLeft.R + classRatio * (colorRight.R - colorLeft.R)),
                G: Math.floor(colorLeft.G + classRatio * (colorRight.G - colorLeft.G)),
                B: Math.floor(colorLeft.B + classRatio * (colorRight.B - colorLeft.B))
            };
            this.subSpectral = Math.floor(10 * (1 - classRatio));
        }
        //#endregion
    },

    setSelectedPlanet: function () {
    },

    temp_renderPie: function (elem, txt) {
        elem.innerHTML = '';
        const chart = new aos.PieChart();
        chart.innerText = txt;
        chart.render(elem);
    },

    temp_renderBar: function (elem, txt) {
        elem.innerHTML = '';
        const bar = new aos.Ressource();
        bar.name = txt;
        bar.render(elem);
    },

    render: function () {
        document.getElementById('miniatureTabs').innerHTML = '';
        const planetImgs = [
            "./data/img/Desert_planet_resource.png",
            "./data/img/Planets7.png",
            "./data/img/Planets9.png",
            "./data/img/Planets13.png",
            "./data/img/Desert_planet_resource.png",
            "./data/img/Planets7.png",
            "./data/img/Planets9.png",
            "./data/img/Planets13.png",
            "./data/img/Desert_planet_resource.png",
            "./data/img/Planets7.png",
            "./data/img/Planets9.png",
            "./data/img/Planets13.png",
            "./data/img/Desert_planet_resource.png",
            "./data/img/Planets7.png",
            "./data/img/Planets9.png",
            "./data/img/Planets13.png",
        ];
        this.planets.forEach(function (planet, i) {
            document.getElementById('miniatureTabs').innerHTML +=
                '<li ' +
                'data-index="' + i + '" class="' + (i !== 0 ? 'in' : '') + 'active">' +
                '<img src=' + planetImgs[i] + ' width="64" height="64"></li>';
            // TODO: set specific css class for selected planet
            // TODO: attach click event. onclick --> call setSelectedPlanet
        }, this);
        this.temp_renderPie(document.getElementById('airPie'), 'Air');
        this.temp_renderPie(document.getElementById('oceanPie'), 'Ocean');
        this.temp_renderPie(document.getElementById('soilPie'), 'Soil');
        this.temp_renderBar(document.getElementById('humansPop'), 'Humans');
        this.temp_renderBar(document.getElementById('machinesPop'), 'Machines');
        this.temp_renderBar(document.getElementById('bacteriaPop'), 'Bacteria');
        this.temp_renderBar(document.getElementById('plantsPop'), 'Plants');
        this.temp_renderBar(document.getElementById('animalsPop'), 'Animals');
    },

};



