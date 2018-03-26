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
    /** @type {String} */
    this.contextualTip = '';
    /** @type {number} */
    this.quantity = 0;
    /** @type {number} */
    this.percent = 0;

    this.htmlElement = null;
    this.index = 0;
    this.wantContextual = false;
    this.flagToShip = false;
    this.flagToStorage = false;
    this.flagToPlanet = false;
};

aos.Resource.prototype = {

    constructResource: function (name) {
        for (let itResource = 0; itResource < aos.resources.length; itResource++) {
            let res = aos.resources[itResource];
            if (res.name === name) {
                this.name = name;
                this.type = res.category;
                break;
            }
        }
    },

    // Should be called only once !
    render: function (withIcon) {
        let code = '<div class="resourceBar">';

        if (withIcon) {
            // left arrow
            code += '<div class="resourceIcon onTop">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path class="sendToShipArrow" d="M448 128l0 256l-128 -128z" fill="#888"></path>'
                + '</svg>';
            code += '</div>';
            // left rounded border
            code += '<div class="resourceIcon">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path d="M512 8C181 8 181 504 512 504" fill="#000" stroke="#444" stroke-width="16"></path>'
                + '</svg>';
            code += '</div>';

            // main resource icon (svg image)
            code += '<div class="resourceIcon">';
            const fullSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
                + '<path d="M0 0h512v512H0z" fill="#000"></path>'
                + '<path fill="{color}" d="'.replace('{color}', aos.resources[this.index].color)
                + aos.resources[this.index].svgCode
                + '"></path>'
                + '<path d="M0 8h512M0 504h512" stroke="#444" stroke-width="16"></path>'
                + '</svg>';
            code += fullSvgCode;
            code += '</div>';

            // right arrow
            code += '<div class="resourceIcon onTop">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path class="sendToShipArrow" d="M64 128l0 256l128 -128z" fill="#888"></path>'
                + '</svg>';
            code += '</div>';
            // right rounded border
            code += '<div class="resourceIcon">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path d="M0 8C331 8 331 504 0 504" fill="#000" stroke="#444" stroke-width="16"></path>'
                + '</svg>';
            code += '</div>';


        } else {
            code += '<div class=""></div>';
            code += '<div class=""></div>';
            code += '<div class=""></div>';
            code += '<div class=""></div>';
            code += '<div class="resourceIcon"></div>';
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

        if (withIcon && this.type !== 'population' && this.type !== 'Energy' && this.name !== 'Ground pollution' && this.name !== 'Toxic waste' && this.name !== 'Acid cloud') {
            code += '<div class="resourceIcon halfWidthIcon"></div>';
            code += '<div class="resourceIcon onTop">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path d="M212 128l0 256l128 -128z" fill="#888"></path>'
                + '</svg>';
            code += '</div>';
            code += '<div class="resourceIcon">';
            code += '<svg viewBox="0 0 512 512">'
                + '<path d="M256 8C-75 8 -75 504 256 504" fill="#000" stroke="#444" stroke-width="16"></path>'
                + '<path d="M256 8C587 8 587 504 256 504" fill="#000" stroke="#444" stroke-width="16"></path>'
                + '</svg>';
            code += '</div>';
        } else {
            code += '<div class=""></div>';
            code += '<div class=""></div>';
            code += '<div class=""></div>';
        }

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
        this.htmlElement.firstChild.childNodes[5].firstChild.style.width = '' + percent + '%';
        if (this.quantity === 0) {
            this.htmlElement.firstChild.childNodes[5].firstChild.style.width = '0';
        }
        [].forEach.call(this.htmlElement.firstChild.childNodes[5].childNodes, function (arrow, i) {
            if (i !== 0) {
                arrow.style.display = 'none';
            }
        });
        if (this.wantContextual) {
            this.renderContextual();
        }
    },

    setWantContextual: function (want) {
        this.wantContextual = want;
        this.renderContextual();
    },

    setTooltipFlag: function (toShip, toStorage, toPlanet, transferAmount) {
        this.flagToShip = toShip;
        this.flagToStorage = toStorage;
        this.flagToPlanet = toPlanet;
        this.renderContextual();
    },

    renderContextual: function () {
        if (this.wantContextual) {
            document.getElementById('contextualTitle').innerHTML =
                ''
                + this.name
                + '<br><em>'
                    + (this.type === 'population' ? 'Population' : ('Resource (' + this.type + ')'))
                + '</em>';
            let newContextualTxt = '';            
            if (aos.game.selectedStar !== null && aos.game.selectedStar.selectedPlanet !== null && aos.game.selectedStar.hasShip) {
                newContextualTxt +=
                    '<dl><dt>'
                    + (this.type === 'population' ? 'Count (ship)' : 'On ship')
                    + '</dt><dd>'
                    + Math.floor(aos.game.selectedStar.ship.storedResources[this.index].quantity)
                    + '</dd></dl>';
            }
            if (aos.game.selectedStar !== null && aos.game.selectedStar.selectedPlanet !== null) {
                newContextualTxt +=
                    '<dl><dt>'
                    + (this.type === 'population' ? 'Count (planet)' : 'In storage')
                    + '</dt><dd>'
                    + Math.floor(aos.game.selectedStar.selectedPlanet.storedResources[this.index].quantity)
                    + '</dd></dl>';
            }
            if (aos.game.selectedStar !== null && aos.game.selectedStar.selectedPlanet !== null && this.type !== 'population') {
                newContextualTxt +=
                    '<dl><dt>'
                    + 'On planet'
                    + '</dt><dd>'
                    + Math.floor(aos.game.selectedStar.selectedPlanet.resources[this.index].quantity)
                    + '</dd></dl>';
            }
            if (this.flagToShip) {
                newContextualTxt += '<br/><br/><br/><span class=\'tooltipSendTo\'>Click to send from storage to ship.</span>';
            } else if (this.flagToStorage) {
                newContextualTxt += '<br/><br/><br/><span class=\'tooltipSendTo\'>Click to send from ship to storage.</span>';
            } else if (this.flagToPlanet) {
                newContextualTxt += '<br/><br/><br/><span class=\'tooltipSendTo\'>Click to send from storage to planet.</span>';
            } else {
                newContextualTxt +=
                    '<br/><br/><br/>'
                    + this.contextualTip;
            }
            document.getElementById('contextualTxt').innerHTML = newContextualTxt;
        } else {
        }

    },

};
