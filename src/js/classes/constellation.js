/**
 * @file Constellation class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * Sub-class of Galaxy. Only technical.
 *
 * @class
 */
aos.Constellation = function () {
    /** @type {number} */
    this.reference = {};
    this.starCoordinates = [];
    this.edges = [];
    this.kruskalEdges = [];
};

aos.Constellation.prototype = {

    computeEdges: function () {
        this.starCoordinates.forEach(function (star, i) {
            this.starCoordinates.forEach(function (otherStar, j) {
                if (j > i) {
                    const deltaX = star.x - otherStar.x;
                    const deltaY = star.y - otherStar.y;
                    const dist = deltaX * deltaX + deltaY * deltaY;
                    this.edges.push({ i: i, j: j, dist: dist });
                }
            }, this);
        }, this);
        this.edges.sort(function (a, b) {
            return a.dist - b.dist;
        });
    },

    kruskal: function () {
        const edgesSave = this.edges.slice();
        let groupCount = this.starCoordinates.length;
        while (groupCount > 1) {
            if (this.edges.length === 0) {
                debugger;
            }
            const edge = this.edges.shift();
            if (this.starCoordinates[edge.i].group !== this.starCoordinates[edge.j].group) {
                groupCount--;
                this.kruskalEdges.push(edge);
                const newGroup = this.starCoordinates[edge.i].group;
                const oldGroup = this.starCoordinates[edge.j].group;
                this.starCoordinates.forEach(function (star) {
                    if (star.group === oldGroup) {
                        star.group = newGroup;
                    }
                }, this);
            }
        }
        this.edges = edgesSave;
    },

    render: function (highlight) {
        const canvas = document.getElementById('starOverlay');
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = highlight ? '#446' : '#333';
        ctx.lineWidth = 1;
        this.kruskalEdges.forEach(function (edge) {
            const v1 = this.starCoordinates[edge.i];
            const v2 = this.starCoordinates[edge.j];
            ctx.beginPath();
            ctx.moveTo(600 + v1.x, 450 + v1.y);
            ctx.lineTo(600 + v2.x, 450 + v2.y);
            ctx.stroke();
        }, this);

        if (highlight) {
            this.starCoordinates.forEach(function (star) {
                ctx.beginPath();
                if (star.notable) {
                    ctx.strokeStyle = '#0a2';
                    ctx.lineWidth = 2;
                    ctx.arc(600 + star.x, 450 + star.y, 20, 0, 2 * Math.PI);
                } else {
                    ctx.strokeStyle = '#800';
                    ctx.lineWidth = 2;
                    ctx.arc(600 + star.x, 450 + star.y, 10, 0, 2 * Math.PI);
                }
                ctx.stroke();
            });
        }

        ctx.fillStyle = '#fff';
        const pointSize = 2.0;
        this.starCoordinates.forEach(function (star) {
            ctx.fillRect(star.x + 600.0 - pointSize / 2.0, star.y + 450.0 - pointSize / 2.0, pointSize, pointSize);
        });

    },


}