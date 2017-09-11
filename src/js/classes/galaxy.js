/**
 * @file Galaxy class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * The galaxy is the largest renderable game object. It contains stars that can be zoomed-in.
 *
 * @class
 */
aos.Galaxy = function () {
    /** @type {number} */
    this.size = 0;
    this.starCoordinates = [];
};

aos.Galaxy.prototype = {

    generate: function () {
        this.starCoordinates = [];
        const galaxyType = Math.random();
        if (galaxyType < 0.3) {
            this.generateE0();
        } else if (galaxyType < 0.65) {
            this.generateSa();
        } else {
            this.generateSb();
        }
        const canvas = document.getElementById('starOverlay');
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#0c0';
        ctx.lineWidth = 2;
        document.getElementById('stats').innerHTML += '' + this.starCoordinates.length + '<br/>';
        this.starCoordinates.forEach(function (star) {
            ctx.beginPath();
            ctx.arc(600 + star.x, 300 + star.y, 10, 0, 2 * Math.PI);
            ctx.stroke();
        });
    },

    generateE0: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        this.generateWithPhase(Math.random() - 0.5, totalStarCount, 0.2 + 0.5 * Math.random(), 0.0, 0.0, 16);
        //this.generateWithPhase(Math.PI / 4.0);
        //this.generateWithPhase(Math.PI * 3.0 / 4.0);
    },

    generateSa: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        this.generateWithPhase(Math.PI * Math.random(), totalStarCount, 0.2 + 0.5 * Math.random(), 1.0 + 7.0 * Math.random(), Math.random() < 0.5 ? -1.0 : 1.0, 16);
        //this.generateWithPhase(Math.PI / 4.0);
        //this.generateWithPhase(Math.PI * 3.0 / 4.0);
    },

    generateSb: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        const hRatio = 0.3 + 0.5 * Math.random();
        const phaseRandomness = 0.1 + 0.2 * Math.random();
        const phaseMax = 2.0 + 2.0 * Math.random()
        const mirror = Math.random() < 0.5 ? -1.0 : 1.0;
        this.generateWithPhase(0, totalStarCount * (1 - hRatio), phaseRandomness, phaseMax, mirror, 8);
        this.generateWithPhase(Math.PI / 2.0, totalStarCount * hRatio, phaseRandomness, phaseMax, mirror, 8);
        //this.generateWithPhase(Math.PI / 4.0);
        //this.generateWithPhase(Math.PI * 3.0 / 4.0);
    },

    generateWithPhase: function (phaseOrigin, starAmount, phaseRandomness, phaseMax, mirror, pushToStar) {
        const canvas = document.getElementById('ellipse');
        const ctx = canvas.getContext('2d');
        //let xmin = 1000;
        //let xmax = 0;
        //let ymin = 1000;
        //let ymax = 0;

        for (let i = starAmount; i >= 0; i--) {
            // a=2; b=1; e2 = 1 - 1/4 = 3/4
            const dist = 360.0 * Math.random();
            const angle = 2 * Math.PI * Math.random();
            const phase = phaseOrigin + dist / 720.0 * phaseMax * Math.PI * mirror;
            const theta = angle + phase + (0.5 - Math.random()) * phaseRandomness;
            const r = dist * Math.sqrt(1.0 / (1.0 - 0.75 * Math.cos(angle) * Math.cos(angle)))/* + dist / 20.0 * Math.random()*/;
            const x = r * Math.cos(theta);
            const y = 0.5 * r * Math.sin(theta);

            if (x > -600 && x < 600 && y > -300 && y < 300) {
                ctx.fillStyle =
                    dist < 30 ? '#fff' :
                    dist < 100 ? '#ffd' :
                    dist < 105 ? '#fdb' :
                    dist < 130 ? '#ffd' :
                    dist < 135 ? '#ddf' :
                    dist < 145 ? '#fcc' :
                    '#fff';
                let pointSize = 0.1 + (1.0 - dist / 720.0) * Math.random();
                if (i < pushToStar) {
                    this.starCoordinates.push({ x, y });
                    pointSize = 2.0;
                }
                ctx.fillRect(x + 600.0, y + 300.0, pointSize, pointSize);
            }
            //if (x < xmin) xmin = x;
            //if (x > xmax) xmax = x;
            //if (y < ymin) ymin = y;
            //if (y > ymax) ymax = y;
        }
        //document.getElementById('stats').innerHTML += '' + xmin + '/' + xmax + '/' + ymin + '/' + ymax + '<br/>';
    },

};

window.onload = function () {
    const instance = new aos.Galaxy();
    instance.generate();
};