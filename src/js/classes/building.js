/**
 * @file Building class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * Building are built on Planet. They are about terraforming, or exploiting ressources.
 *
 * @class
 */
aos.Building = function () {
    /** @type {string} */
    this.type = "";
    /** @type {string} */
    this.name = "";
    /** @type  */
    this.require = {};
    /**  */
    this.produce = {};
    /** @type {number} */
    this.storage = 0;
    /** @type {boolean} */
    this.functional = true;
    /** @type {string} */
    this.builtOn = "";
};

aos.Building.prototype = {
    construct: function (name) {
        for (let i = 0; i < aos.buildings.length; i++) {
            if (aos.buildings[i].name == name) {
                this.name = name;
                this.type = aos.buildings[i].type;
                this.require = aos.buildings[i].require;
                this.produce = aos.buildings[i].produce;
                this.storage = aos.buildings[i].storage;
                this.location = aos.buildings[i].location;
            }
        }
    },

    renderContextual: function () {
        document.getElementById('contextualBlock').style.display = 'block';
        document.getElementById('contextualTitle').innerHTML = this.name + '<br><em>' + this.type + '</em>';
        var Ctxt = document.getElementById('contextualTxt');
        var ctext = "<h3>Construction cost</h3>"
        ctext += "<table>";

        ctext += "<tr><td>space</Td><td width='10px'>:</Td><td>" + this.require.space + "</td></tr>";
        ctext += "<tr><td colspan='3' align='center'>Materials</Td></tr>";
        for (let i = 0; i < this.require.materials.length; i++) {
            ctext += "<tr><td>" + this.require.materials[i].type + "</Td><td width='10px'>:</Td><td>" + this.require.materials[i].quantity + "</td></tr>";
        }
        ctext += "</table><br>";

        ctext += "<h3><b>Yield</h3>";
        ctext += "<table>";
        for(let itProd=0 ; itProd < this.produce.product.length ; itProd ++){
            ctext += "<tr><td>" + this.produce.product[itProd].name + "</Td><td width='10px'>:</Td><td>" + this.produce.product[itProd].quantity + "</td></tr>";
        }
        ctext += "</table><br>";
        ctext += "<h3>Running Condition</h3>";
        ctext += "<table>";
        if (typeof this.produce.require !== "undefined") {
            for (let i = 0; i < this.produce.require.length; i++) {
                ctext += "<tr><td>" + this.produce.require[i].name + "</td><td width='10px'>:</Td><td>" + this.produce.require[i].quantity + "</td></tr>";
            }
        }
        if (typeof this.produce.conditions !== "undefined") {
            for (let i = 0; i < this.produce.conditions.length; i++) {
                if (typeof this.produce.conditions[i].quantity !== "undefined") {
                    ctext += "<tr><td>" + this.produce.conditions[i].name + "</Td><td width='10px'>:</Td><td>" + this.produce.conditions[i].quantity + "</td></tr>";
                } else {
                    ctext += "<tr><td>" + this.produce.conditions[i].name + "</Td><td width='10px'>:</Td><td>" + this.produce.conditions[i].percent + " %</td></tr>";
                }
            }

        }
        ctext += "</table>";
        Ctxt.innerHTML = ctext;
    },


};
