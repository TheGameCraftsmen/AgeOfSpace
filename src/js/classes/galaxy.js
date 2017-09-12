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
    this.edges = [];
    this.kruskalEdges = [];
};

aos.Galaxy.prototype = {

    generate: function () {
        this.starCoordinates = [];
        const galaxyType = Math.random();
        if (galaxyType < 0.2) {
            this.generateE0();
        } else if (galaxyType < 0.6) {
            this.generateSa();
        } else {
            this.generateSb();
        }
        this.filterCenterAndTooClose();
        this.computeEdges();
        this.kruskal();
        const canvas = document.getElementById('starOverlay');
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#590';
        ctx.lineWidth = 1;
        //this.kruskalEdges.forEach(function (edge) {
        //    const v1 = this.starCoordinates[edge.i];
        //    const v2 = this.starCoordinates[edge.j];
        //    ctx.beginPath();
        //    ctx.moveTo(600 + v1.x, 450 + v1.y);
        //    ctx.lineTo(600 + v2.x, 450 + v2.y);
        //    ctx.stroke();
        //}, this);
        ctx.strokeStyle = '#0c0';
        ctx.lineWidth = 2;
        this.starCoordinates.forEach(function (star) {
            ctx.beginPath();
            ctx.arc(601 + star.x, 451 + star.y, 10, 0, 2 * Math.PI);
            ctx.stroke();
        });
    },

    generateE0: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        this.generateWithPhase(0.0, totalStarCount, 0.2 + 0.5 * Math.random(), 0.0, 0.0, 16);
        //this.generateWithPhase(Math.PI / 4.0);
        //this.generateWithPhase(Math.PI * 3.0 / 4.0);
    },

    generateSa: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        const phaseMax = 1.0 + 7.0 * Math.random();
        const mirror = Math.random() < 0.5 ? -1.0 : 1.0;
        this.generateWithPhase(-Math.PI / 2.0 * phaseMax * mirror, totalStarCount, 0.2 + 0.5 * Math.random(), phaseMax, mirror, 16);
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
            const y = r * Math.sin(theta);

            if (x > -600 && x < 600 && y > -450 && y < 450) {
                ctx.fillStyle =
                    dist < 30 ? '#fff' :
                    dist < 100 ? '#ffd' :
                    dist < 120 ? '#fdb' :
                    dist < 180 ? '#ffd' :
                    dist < 200 ? '#ddf' :
                    dist < 230 ? '#fcc' :
                    '#fff';
                let pointSize = 0.1 + (1.0 - dist / 720.0) * Math.random();
                if (i < pushToStar) {
                    this.starCoordinates.push({ x: x, y: y, r: r, keep: true, group: this.starCoordinates.length });
                    pointSize = 2.0;
                }
                ctx.fillRect(x + 600.0, y + 450.0, pointSize, pointSize);
            }
            //if (x < xmin) xmin = x;
            //if (x > xmax) xmax = x;
            //if (y < ymin) ymin = y;
            //if (y > ymax) ymax = y;
        }
        //document.getElementById('stats').innerHTML += '' + xmin + '/' + xmax + '/' + ymin + '/' + ymax + '<br/>';
    },

    filterCenterAndTooClose: function () {
        const filteredStar = this.starCoordinates.filter(function (star) {
            return star.r > 30;
        });
        filteredStar.forEach(function (star, i) {
            if (star.keep) {
                filteredStar.forEach(function (otherStar, j) {
                    const deltaX = star.x - otherStar.x;
                    const deltaY = star.y - otherStar.y;
                    const dist = deltaX * deltaX + deltaY * deltaY;
                    if (j > i && dist < 6400) { // sqrt(dist) < 80.0
                        otherStar.keep = false;
                    }
                });
            }
        });
        this.starCoordinates = filteredStar.filter(function (star) {
            return star.keep;
        });
    },

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

    setupEvents: function () {
        const stars = this.starCoordinates;
        document.getElementById('starOverlay').addEventListener('mousemove', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            const galaxyCoordX = e.offsetX - 600;
            const galaxyCoordY = e.offsetY - 450;
            //document.getElementById('stats').innerHTML = '' + galaxyCoordX + '/' + galaxyCoordY + '/' + '<br/>';
            document.getElementById('starOverlay').style.cursor = 'default';
            document.getElementById('starSystemBlock').style.display = 'none';
            stars.forEach(function (star) {
                const deltaX = star.x - galaxyCoordX;
                const deltaY = star.y - galaxyCoordY;
                const dist = deltaX * deltaX + deltaY * deltaY;
                if (dist < 100) { // sqrt(dist) < 10.0
                    document.getElementById('starOverlay').style.cursor = 'pointer';
                    document.getElementById('starSystemBlock').style.display = 'block';
                    document.getElementById('starSystemName').innerHTML = 'Alpha Centauri';
                }
                //document.getElementById('stats').innerHTML += dist + '<br/>';
            });
        }, false);
    },

};

window.onload = function () {
    const instance = new aos.Galaxy();
    instance.generate();
    instance.setupEvents();
};