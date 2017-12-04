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
    this.sizeRatio = 0;
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
    this.selectedPlanetIndex = 0;
    this.selectedPlanet = null;

    // ship
    this.hasShip = false;
    this.shipAngle = 0;
    this.ship = null;
};

aos.Star.prototype = {

    generate: function () {
        // we only generate main sequence stars because they represent more than 90% of the galaxy
        // source: https://astronomy.stackexchange.com/questions/13165/what-is-the-frequency-distribution-for-luminosity-classes-in-the-milky-way-galax
        if (this.isNotable) {
            this.sizeRatio = 6.0 * Math.random(); // not squared because we want the highest possible variation, for gameplay reason
            // also blue stars are very unlikely to have planets but we keep them because they're awesome
        } else {
            this.sizeRatio = 7.0 * Math.random() * Math.random(); // squared because low energy stars are supposed to be more common in a real-world galaxy
        }
        for (let nbPlanets = 1 + Math.floor((10 - this.sizeRatio) * Math.random()) ; nbPlanets > 0 ; nbPlanets--) {
            this.planets.push(new aos.Planet());
        }
        this.planets.forEach(function (planet) {
            planet.generate();
            planet.setupEvents();
        }, this);
        //#region Lore
        this.fillFromRatio(this.sizeRatio);
        //#endregion
        this.selectedPlanetIndex = 0;
        this.selectedPlanet = this.planets[0];
    },

    fillFromRatio: function (classRatio) {
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
    },

    setSelectedPlanetIndex: function (planetId) {
        this.selectedPlanetIndex = planetId;
        this.selectedPlanet = this.planets[planetId];
        [].forEach.call(document.getElementById('miniatureTabs').childNodes, function (li) {
            if (+li.dataset.index === planetId) {
                li.className = 'active';
            } else {
                li.className = 'inactive';
            }
        });
        aos.game.emitEvent('requestUiSlowRefresh', {});
    },

    buildUi: function () {
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
                'data-index="' + i + '" class="' + 'inactive">' +
                '<img src=' + planetImgs[i] + ' width="50" height="50"></li>';
        }, this);

        // see animateLargeStar for formula explanation
        const overflow = 120;
        const leftBorderMaxCosine = 300;
        const RMaxOuter = (leftBorderMaxCosine * leftBorderMaxCosine + overflow * overflow) / (2 * overflow);
        const ROuter = (this.sizeRatio + 3) / 10 * RMaxOuter - 20;
        const centerX = 100 - ROuter;

        let wrapperInnerTxt = "";
        let idx = 0;
        let wrapperWidth = 0;
        for (idx = 0; idx < 30; idx++) {
            wrapperWidth = idx * 10 > ROuter ? 0 : Math.sqrt(ROuter * ROuter - 100 * idx * idx) + centerX;
            wrapperInnerTxt = "<div style=\"width:" + wrapperWidth + "px\"></div>" + wrapperInnerTxt + "<div style=\"width:" + wrapperWidth + "px\"></div>";
        }
        wrapperInnerTxt = "<div></div>" + wrapperInnerTxt + "<div></div>";
        //wrapperInnerTxt += "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet?</p>";

        document.getElementById('starWrapperPlaceholder').appendChild(document.getElementById('storageBlock'));
        //document.getElementById('starWrapperBlock').innerHTML = wrapperInnerTxt;
        document.getElementById('starWrapperBlock').innerHTML = '';
        document.getElementById('starWrapperBlock').appendChild(document.getElementById('storageBlock'));

        this.setSelectedPlanetIndex(this.selectedPlanetIndex);
    },

    animateLargeStar: function () {
        const canvas = document.getElementById('largeStar');
        const ctx = canvas.getContext("2d");
        /*
          _____
         /    .\
        /     . \
        |   x . |
        \     . /
         \____./.
              . .
              | | 120 px

        R² = (R-120px)² + 300px²
        R² - (R² - 240R + 120²) = 300²
        240R = 300² + 120²
        
        */
        const overflow = 120;
        const leftBorderMaxCosine = 300;
        const RMaxOuter = (leftBorderMaxCosine * leftBorderMaxCosine + overflow * overflow) / (2 * overflow);
        const ROuter = (this.sizeRatio + 3) / 10 * RMaxOuter;
        const RInner = ROuter - 120;
        const centerX = 120 - ROuter;

        //ctx.clearRect(0, 0, 125, 600);

        //ctx.fillStyle = "#400";
        //ctx.beginPath();
        //ctx.arc(centerX, 300, ROuter, 0, 2 * Math.PI);
        //ctx.fill();

        //ctx.fillStyle = "#430";
        //ctx.beginPath();
        //ctx.arc(centerX, 300, RInner, 0, 2 * Math.PI);
        //ctx.fill();

        ctx.clearRect(0, 0, 125, 600);
        const gradient = ctx.createRadialGradient(centerX, 300, RInner, centerX, 300, ROuter);

        const leftSide = new aos.Star();
        leftSide.fillFromRatio(Math.max(this.sizeRatio - 1, 0));
        const colorLeft = leftSide.color;
        const rightSide = new aos.Star();
        rightSide.fillFromRatio(Math.min(this.sizeRatio + 0, 7));
        const colorRight = rightSide.color;

        gradient.addColorStop(0, 'rgba(' + colorRight.R + ', ' + colorRight.G + ', ' + colorRight.B + ', 1)');
        gradient.addColorStop(0.4, 'rgba(' + colorRight.R + ', ' + colorRight.G + ', ' + colorRight.B + ', 1)');
        gradient.addColorStop(0.7, 'rgba(' + colorLeft.R + ', ' + colorLeft.G + ', ' + colorLeft.B + ', 1)');
        gradient.addColorStop(0.72, 'rgba(' + colorLeft.R + ', ' + colorLeft.G + ', ' + colorLeft.B + ', 0.5)');
        gradient.addColorStop(1, 'rgba(' + colorLeft.R + ', ' + colorLeft.G + ', ' + colorLeft.B + ', 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 125, 600);
    },

    showShip: function () {
        if (this.hasShip) {
            document.getElementById('starWrapperBlock').style.display = 'block';
            document.getElementById('shipAnimation').style.display = 'block';
            document.getElementById('planetStorageColumn').className = 'sendToShipVisible';
            this.ship.updateBars();
        } else {
            document.getElementById('starWrapperBlock').style.display = 'none';
            document.getElementById('shipAnimation').style.display = 'none';
            document.getElementById('planetStorageColumn').className = 'sendToShipInvisible';
        }
    },

    animateShip: function () {
        // TODO
        if (this.hasShip) {
            this.shipAngle += 3;
            document.getElementById('shipAnimation').style.transform = 'rotate(' + this.shipAngle + 'deg)';
        }
    },


};



