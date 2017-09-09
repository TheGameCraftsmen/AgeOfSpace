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
        this.generateWithPhase(0);
        this.generateWithPhase(Math.PI / 2.0);
    },

    generateWithPhase(delta) {
        const canvas = document.getElementById('ellipse');
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < 2000; i++) {
            // a=2; b=1; e2 = 1 - 1/4 = 3/4
            const dist = 180.0 * Math.random();
            const angle = 2 * Math.PI * Math.random();
            const phase = delta + dist / 180.0 * Math.PI;
            const theta = angle + phase;
            const r = dist * Math.sqrt(1.0 / (1.0 - 0.75 * Math.cos(angle) * Math.cos(angle)));
            const x = r * Math.cos(theta) + 2 * Math.random();
            const y = r * Math.sin(theta) + 2 * Math.random();

            ctx.fillStyle = '#cee';
            ctx.fillRect(x + 500.0, y + 500.0, 1.0, 1.0);
        }
    },

};

window.onload = function () {
    const instance = new aos.Galaxy();
    instance.generate();
}
