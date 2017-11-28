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
 * This class concerns the resource available on a planet (air, ground, crops...)
 *
 * @class
 */
aos.Resource = function () {
    /** @type {String} 
     * Air, Liquid, Ground
    */
    this.type = '';
    /** @type {String} */
    this.name = '';
    /** @type {number} */
    this.quantity = 0;
    /** @type {number} */
    this.percent = 0;

    this.htmlElement = null;
    this.svgCode = '';
    this.color = '';
};

aos.Resource.prototype = {

    construct: function (name) {
        for (let itResource = 0; itResource < aos.resources.length; itResource++) {
            let res = aos.resources[itResource];
            if (res.name === name) {
                this.name = name;
                this.type = res.type;
                this.svgCode = res.svgCode;
                break;
            }
        }
    },

    // Should be called only once !
    render: function (withIcon) {
        let code = '<div class="resourceBar">';

        if (withIcon) {
            code += '<div class="resourceIcon">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path d="M512 8C181 8 181 504 512 504" fill="#000" stroke="#444" stroke-width="16"></path>'
                + '</svg>';
            code += '</div>';

            code += '<div class="resourceIcon">';
            if (this.svgCode !== undefined) {
                const fullSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
                    + '<path d="M0 0h512v512H0z" fill="#000"></path>'
                    + '<g><path fill="{color}" d="'.replace('{color}', this.color)
                    + this.svgCode
                    + '"></path></g>'
                    + '<path d="M0 8h512M0 504h512" stroke="#444" stroke-width="16"></path>'
                    + '</svg>';
                code += fullSvgCode;
            } else {
                code += 'X'/*this.name*/;
            }
            code += '</div>';

            code += '<div class="resourceIcon">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path d="M0 8C331 8 331 504 0 504" fill="#000" stroke="#444" stroke-width="16"></path>'
                + '</svg>';
            code += '</div>';
        } else {
            code += '<div class="resourceIcon">';
            code += '</div>';
        }

        code += '<div class="resourceOuterBlock"><div></div>';
        let i = 0;
        for (i = 0; i < 5; i++) {
            code += '<div style="left:calc(50% + ' + (5 + i * 10) + 'px); animation-delay:' + (i * 0.25) + 's" class="blink"><svg width="8" height="8" viewBox="0 0 32 32"><path d="M 2 0 L 2 32 L 30 16 Z" stroke-width="2" stroke="#fff" fill="rgba(255,255,255,0.2)"></path></svg></div>';
        }
        for (i = 0; i < 5; i++) {
            code += '<div style="right:calc(50% + ' + (5 + i * 10) + 'px); animation-delay:' + (i * 0.25) + 's" class="blink"><svg width="8" height="8" viewBox="0 0 32 32"><path d="M 30 0 L 30 32 L 2 16 Z" stroke-width="2" stroke="#fff" fill="rgba(255,255,255,0.2)"></path></svg></div>';
        }
        code += '</div>';

        code += '</div>';
        this.htmlElement.innerHTML = code;
    },

    update: function () {
        //if (this.quantity === 0) {
        //    this.htmlElement.style.display = 'none';
        //} else {
        //    this.htmlElement.style.display = 'block';
        //}
        const percent = 100.0 * (Math.log(this.quantity + 1200.0) - 7) / 13.0;
        this.htmlElement.firstChild.lastChild.firstChild.style.width = '' + percent + '%';
        if (this.quantity === 0) {
            this.htmlElement.firstChild.lastChild.firstChild.style.width = '0';
        }
        [].forEach.call(this.htmlElement.firstChild.lastChild.childNodes, function (arrow, i) {
            if (i !== 0) {
                arrow.style.display = 'none';
            }
        });
    },

};
