/**
 * @file PieChart class. Part of the "Age of Space" project.
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
 * Use it to render a pie chart, based on an array of resources
 *
 * @class
 */
aos.PieChart = function () {
    // expected elements inside this array:
    // {label:'xx', value:123.0, color:'#fff'}
    this.content = [];
    this.innerText = '';
    this.htmlElement = null;
    this.wantContextual = false;
};

aos.PieChart.prototype = {

    render: function () {
        const total = this.calcRatio();
        let svgCode = '<svg width="150" height="150" viewBox="-19 -19 38 38"><g transform="rotate(-90)">';
        this.content.forEach(function (chartSlice) {
            svgCode += '<circle cx="0" cy="0" r="15.9154943092" fill="transparent" stroke="' + chartSlice.color
                + '" stroke-width="6" stroke-dasharray="0 ' + (chartSlice.offset / total) + ' ' + (chartSlice.value / total) + ' 100"></circle>';
        }, this);
        svgCode += '</g><text font-size="0.4em" text-anchor="middle" x="0" y="0" fill="#ccc" transform="translate(0 1)">' + this.innerText + '</text>';
        svgCode += '</svg>';
        this.htmlElement.innerHTML = svgCode;
    },

    update: function () {
        const total = this.calcRatio();
        this.content.forEach(function (chartSlice, i) {
            this.htmlElement.firstChild.firstChild.childNodes[i].setAttribute('stroke-dasharray', '0 ' + (chartSlice.offset / total) + ' ' + (chartSlice.value / total) + ' 100');
        }, this);
        if (this.wantContextual) {
            this.renderContextual();
        }
    },

    calcRatio: function () {
        let total = 0;
        this.content.forEach(function (chartSlice) {
            chartSlice.offset = total;
            total += chartSlice.value;
        }, this);
        if (total === 0) {
            total = 1; // Prevent division by 0 later
        }
        total /= 100.0;
        return total;
    },

    setWantContextual: function (want) {
        this.wantContextual = want;
        this.renderContextual();
    },

    renderContextual: function () {
        if (this.wantContextual) {
            const total = this.calcRatio();
            let contextualTxt = '<div><table><tr><th>Resource</th><th>Quantity</th><th>Percent</th></tr>';
            this.content.forEach(function (res, i) {
                contextualTxt += '<tr><td style="background-color:' + res.color + '">' + res.label + '</td><td>' + res.value + '</td><td>' + (res.value / total).toFixed(1) + '%</td></tr>';
            }, this);
            contextualTxt += '</table></div>';
            document.getElementById('contextualTxt').innerHTML = contextualTxt;
        } else {
        }
    },

};
