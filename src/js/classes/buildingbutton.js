/**
 * @file BuildingButton class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * This is an utility class.
 * Use it to render an UI element (a button), based on a building reference from data/reference/buildings.js
 *
 * @class
 */
aos.BuildingButton = function () {
    this.buildingTemplate = '';
    this.itemCount = 0;
    this.htmlElement = null;
    this.wantContextual = false;
};

aos.BuildingButton.prototype = {

    render: function () {
        const fullSvgCode = '<div class="buildingButton">'
            + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
            + '<path d="M0 0h512v512H0z" fill="#000"></path>'
            + '<path fill="hsl(0, 0%, 80%)" d="'
            + aos.buildingTemplates[this.buildingTemplate].svgCode
            + '"></path>'
            + '</svg>'
            + '<div>0</div>'
            + '</div>';
        this.htmlElement.innerHTML = fullSvgCode;
    },

    update: function (counterDictionary) {
        this.htmlElement.firstChild.lastChild.textContent = (typeof counterDictionary[this.buildingTemplate] === 'undefined') ? '0' : counterDictionary[this.buildingTemplate];
        if (this.wantContextual) {
            this.renderContextual();
        }
    },

    setWantContextual: function (want) {
        this.wantContextual = want;
        this.renderContextual();
    },

    renderContextual: function () {
        if (this.wantContextual) {
            const template = aos.buildingTemplates[this.buildingTemplate];
            document.getElementById('contextualBlock').style.display = 'block';
            document.getElementById('contextualTitle').innerHTML = this.buildingTemplate + '<br><em>' + template.type + '</em>';
            const Ctxt = document.getElementById('contextualTxt');
            Ctxt.innerHTML = this.getBuildingContextual(this.buildingTemplate, true);
        } else {
        }
    },

    getBuildingContextual: function (buildingTemplateName, withConstruction) {
        const template = aos.buildingTemplates[buildingTemplateName];
        let ctext = '';
        if (withConstruction) {
            ctext += '<h3>Construction cost</h3>';
            ctext += '<table>';

            for (let i = 0; i < template.constructionCost.length; i++) {
                ctext += '<tr><td>' + template.constructionCost[i].name + '</td><td width="10px">:</td><td>' + template.constructionCost[i].quantity + '</td></tr>';
            }
            ctext += '</table><br>';
        }
        ctext += '<h3><b>Yield</h3>';
        ctext += '<table>';
        for (let itProd = 0 ; itProd < template.produce.product.length ; itProd++) {
            ctext += '<tr><td>' + template.produce.product[itProd].name + '</td><td width="10px">:</td><td>' + template.produce.product[itProd].quantity + '</td></tr>';
        }
        ctext += '</table><br>';
        ctext += '<h3>Running Condition</h3>';
        ctext += '<table>';
        if (typeof template.produce.require !== 'undefined') {
            for (let i = 0; i < template.produce.require.length; i++) {
                ctext += '<tr><td>' + template.produce.require[i].name + '</td><td width="10px">:</td><td>' + template.produce.require[i].quantity + '</td></tr>';
            }
        }
        ctext += '</table>';
        return ctext;
    }

};
