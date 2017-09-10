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
};

aos.Galaxy.prototype = {

    generate: function () {
        const galaxyType = Math.random();
        if (galaxyType < 0.3) {
            this.generateE0();
        } else if (galaxyType < 0.65) {
            this.generateSa();
        } else {
            this.generateSb();
        }
    },

    generateE0: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        this.generateWithPhase(0, totalStarCount, 0.2 + 0.5 * Math.random(), 0.0);
        //this.generateWithPhase(Math.PI / 4.0);
        //this.generateWithPhase(Math.PI * 3.0 / 4.0);
    },

    generateSa: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        this.generateWithPhase(Math.PI * Math.random(), totalStarCount, 0.2 + 0.5 * Math.random(), 1.0 + 7.0 * Math.random());
        //this.generateWithPhase(Math.PI / 4.0);
        //this.generateWithPhase(Math.PI * 3.0 / 4.0);
    },

    generateSb: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        const hRatio = 0.3 + 0.5 * Math.random();
        const phaseRandomness = 0.1 + 0.2 * Math.random();
        const phaseMax = 2.0 + 2.0 * Math.random()
        this.generateWithPhase(0, totalStarCount * (1 - hRatio), phaseRandomness, phaseMax);
        this.generateWithPhase(Math.PI / 2.0, totalStarCount * hRatio, phaseRandomness, phaseMax);
        //this.generateWithPhase(Math.PI / 4.0);
        //this.generateWithPhase(Math.PI * 3.0 / 4.0);
    },

    generateWithPhase: function (phaseOrigin, starAmount, phaseRandomness, phaseMax) {
        const canvas = document.getElementById('ellipse');
        const ctx = canvas.getContext('2d');

        for (let i = starAmount; i >= 0; i--) {
            // a=2; b=1; e2 = 1 - 1/4 = 3/4
            const dist = 180.0 * Math.random();
            const angle = 2 * Math.PI * Math.random();
            const phase = phaseOrigin + dist / 360.0 * phaseMax * Math.PI;
            const theta = angle + phase + Math.random() * phaseRandomness;
            const r = dist * Math.sqrt(1.0 / (1.0 - 0.75 * Math.cos(angle) * Math.cos(angle)))/* + dist / 20.0 * Math.random()*/;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            ctx.fillStyle = dist < 60 ? '#ffd' :
                dist < 62 ? '#fdb' :
                dist < 70 ? '#ffd' :
                dist < 73 ? '#ddf' :
                dist < 78 ? '#fcc' :
                '#fff';
            const pointSize = 0.1 + (1.0 - dist / 180.0) * Math.random();
            ctx.fillRect(x + 400.0, y + 400.0, pointSize, pointSize);
        }
    },

};

window.onload = function () {
    const instance = new aos.Galaxy();
    instance.generate();
};
