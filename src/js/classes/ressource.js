/**
 * @file Resssource class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * This class concerns the ressource available on a planet (air, ground, crops...)
 *
 * @class
 */
aos.Ressource = function () {
    /** @type {String} 
     * Air, Ground, metal
    */
    this.type = "";
    /** @type {String} */
    this.name = "";
    /** @type {number} */
    this.quantity = 0;
    /** @type {number} */
    this.percent = 0;
};

aos.Ressource.prototype = {

    render: function (htmlElement) {
        let code = '<div class="resourceBar"><div>' + this.name + '</div><div><div></div>';
        let i = 0;
        for (i = 0; i < 5; i++) {
            code += '<div style="left:calc(50% + ' + (5 + i * 10) + 'px); animation-delay:' + (i * 0.25) + 's" class="blink"><svg width="8" height="8" viewBox="0 0 32 32"><path d="M 2 0 L 2 32 L 30 16 Z" stroke-width="2" stroke="#fff" fill="rgba(255,255,255,0.2)"></path></svg></div>';
        }
        for (i = 0; i < 5; i++) {
            code += '<div style="right:calc(50% + ' + (5 + i * 10) + 'px); animation-delay:' + (i * 0.25) + 's" class="blink"><svg width="8" height="8" viewBox="0 0 32 32"><path d="M 30 0 L 30 32 L 2 16 Z" stroke-width="2" stroke="#fff" fill="rgba(255,255,255,0.2)"></path></svg></div>';
        }
        code += '</div></div>';
        htmlElement.innerHTML += code;
    },

};
