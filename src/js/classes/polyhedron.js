/**
 * @file Polyhedron class. Part of the "Age of Space" project.
 * @author github.com/azziliz
 * @author github.com/thyshimrod
 * {@link https://github.com/The-game-craftmen/age-of-space/ Project page}
 * @license MIT
 */

'use strict';
var aos = aos || {};
//debugger;

/**
 * This class is used to render a planet with a polyhedron.
 *
 * @class
 */
aos.Polyhedron = function () {
    this.vertices = [];
    this.triangles = [];
    this.areaCenter = [];
    this.tessellatedTriangles = [];
    this.modelMatrix = null;
    this.frustumMatrix = null;
    this.cameraMatrix = null;
    this.rotateY1 = null;
    this.rotateY1r = null;
    this.rotates = true;
    this.hoveredTriangle = -1;
    this.mousePosition = [0, 0];
    this.cameraXrotate = 0;

    this.wantSelectedTile = false;
    this.selectedTile = -1;
};


aos.Polyhedron.prototype = {

    initialize: function (tileCount) {
        // ---
        // All matrix use the OpenGL / WebGL ordering of elements ("column major")
        // see : https://en.wikipedia.org/wiki/Row-_and_column-major_order
        // ---

        // model matrix start with identity
        // we'll rotate that matrix along the Y axis later, to simulate planetary revolution
        this.modelMatrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
        ];

        // frustum matrix is an orthogonal projection
        // see : http://www.songho.ca/opengl/gl_projectionmatrix.html
        // this matrix never changes
        const right = 0.2;
        const top = 0.2;
        const near = 1;
        const far = 100;
        const nf = 1 / (near - far);
        this.frustumMatrix = [
            near / right, 0, 0, 0,
            0, near / top, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ];

        // http://www.songho.ca/opengl/gl_camera.html#lookat
        // per openGL doc, the camera starts in (0, 0, 0), is oriented along the Z axis, and is looking into the direction of negative Z
        // to maintain a "lookAt" (0, 0, 0) we have to rotate it first along the X axis, then translate it backwards along the (new) Z axis
        // rotation is 0 during init, we just translate
        const tx = 0;
        const ty = 0;
        const tz = 6;
        this.cameraMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
        this.cameraXrotate = 0;

        // these constants are used for planetary revolution along its polar axis (always Y, in the model space)
        const cos1 = Math.cos(Math.PI / 400);
        const sin1 = Math.sin(Math.PI / 400);
        this.rotateY1 = [
            cos1, 0, -sin1, 0,
            0, 1, 0, 0,
            sin1, 0, cos1, 0,
            0, 0, 0, 1
        ];
        this.rotateY1r = [
            cos1, 0, sin1, 0,
            0, 1, 0, 0,
            -sin1, 0, cos1, 0,
            0, 0, 0, 1
        ];

        if (tileCount === 8) {
            this.generateD8();
        } else if (tileCount === 12) {
            this.generateD12();
        } else if (tileCount === 20) {
            this.generateD20();
        } else {
            this.generateD60();
        }
    },

    tessellate: function (sourceTri) {
        const destTri = [];
        sourceTri.forEach(function (tri, idx) {
            // Triangles arrays: [vertex1, vertex2, vertex3, Z-buffer (distance to camera), parent tile index]
            const v0 = this.vertices[tri[0]];
            const v1 = this.vertices[tri[1]];
            const v2 = this.vertices[tri[2]];
            this.vertices.push(aos.Math.normalizeVector3([(v0[0] + v1[0]) * 0.5, (v0[1] + v1[1]) * 0.5, (v0[2] + v1[2]) * 0.5]).concat(0));
            this.vertices.push(aos.Math.normalizeVector3([(v1[0] + v2[0]) * 0.5, (v1[1] + v2[1]) * 0.5, (v1[2] + v2[2]) * 0.5]).concat(0));
            this.vertices.push(aos.Math.normalizeVector3([(v2[0] + v0[0]) * 0.5, (v2[1] + v0[1]) * 0.5, (v2[2] + v0[2]) * 0.5]).concat(0));
            destTri.push([tri[0], this.vertices.length - 3, this.vertices.length - 1, 0, tri[4]]);
            destTri.push([tri[1], this.vertices.length - 3, this.vertices.length - 2, 0, tri[4]]);
            destTri.push([tri[2], this.vertices.length - 2, this.vertices.length - 1, 0, tri[4]]);
            destTri.push([this.vertices.length - 3, this.vertices.length - 2, this.vertices.length - 1, 0, tri[4]]);
        }, this);
        return destTri;
    },

    generateD20: function () {
        const invphi = 2 / (1 + Math.sqrt(5));

        // Vertices coordinates: [Xworld, Yworld, Zworld, Zmodel]
        // Zmodel is re-calculated for each frame during render
        // source for coordinates is: https://en.wikipedia.org/wiki/Platonic_solid#Cartesian_coordinates
        this.vertices.push([1, invphi, 0]);    // 0
        this.vertices.push([1, -invphi, 0]);    // 1
        this.vertices.push([-1, invphi, 0]);    // 2
        this.vertices.push([-1, -invphi, 0]);    // 3
        this.vertices.push([0, 1, invphi]);    // 4
        this.vertices.push([0, 1, -invphi]);    // 5
        this.vertices.push([0, -1, invphi]);    // 6
        this.vertices.push([0, -1, -invphi]);    // 7
        this.vertices.push([invphi, 0, 1]);    // 8
        this.vertices.push([-invphi, 0, 1]);    // 9
        this.vertices.push([invphi, 0, -1]);    // 10
        this.vertices.push([-invphi, 0, -1]);    // 11

        // Triangles arrays: [vertex1, vertex2, vertex3, Z-buffer (distance to camera), parent tile index]
        // This array should not be sorted
        this.triangles.push([4, 5, 0]);
        this.triangles.push([4, 5, 2]);
        this.triangles.push([6, 7, 1]);
        this.triangles.push([6, 7, 3]);
        this.triangles.push([0, 1, 8]);
        this.triangles.push([0, 1, 10]);
        this.triangles.push([2, 3, 9]);
        this.triangles.push([2, 3, 11]);
        this.triangles.push([8, 9, 4]);
        this.triangles.push([8, 9, 6]);
        this.triangles.push([10, 11, 5]);
        this.triangles.push([10, 11, 7]);
        this.triangles.push([0, 4, 8]); // +++
        this.triangles.push([0, 5, 10]); // ++-
        this.triangles.push([1, 6, 8]); // +-+
        this.triangles.push([1, 7, 10]); // +--
        this.triangles.push([2, 4, 9]); // -++
        this.triangles.push([2, 5, 11]); // -+-
        this.triangles.push([3, 6, 9]); // --+
        this.triangles.push([3, 7, 11]); // ---
        this.triangles.forEach(function (tri, idx) {
            this.triangles[idx] = tri.concat(0, idx);
        }, this);

        this.triangles.forEach(function (tri, idx) {
            const v1 = this.vertices[tri[0]];
            const v2 = this.vertices[tri[1]];
            const v3 = this.vertices[tri[2]];
            this.vertices.push([(v1[0] + v2[0] + v3[0]) / 3, (v1[1] + v2[1] + v3[1]) / 3, (v1[2] + v2[2] + v3[2]) / 3]);
            this.areaCenter.push(this.vertices.length - 1);
        }, this);
        this.vertices.forEach(function (v, idx) {
            this.vertices[idx] = aos.Math.normalizeVector3(v).concat(0);
        }, this);

        //const intermediate = this.tessellate(this.triangles);
        //const intermediate2 = this.tessellate(intermediate);
        //this.tessellatedTriangles = this.tessellate(intermediate);
        this.tessellatedTriangles = this.tessellate(this.triangles);
    },

    generateD8: function () {
        this.vertices.push([1, 0, 0]);    // 0
        this.vertices.push([-1, 0, 0]);    // 1
        this.vertices.push([0, 1, 0]);    // 2
        this.vertices.push([0, -1, 0]);    // 3
        this.vertices.push([0, 0, 1]);    // 4
        this.vertices.push([0, 0, -1]);    // 5

        this.triangles.push([0, 2, 4]);
        this.triangles.push([0, 2, 5]);
        this.triangles.push([0, 3, 4]);
        this.triangles.push([0, 3, 5]);
        this.triangles.push([1, 2, 4]);
        this.triangles.push([1, 2, 5]);
        this.triangles.push([1, 3, 4]);
        this.triangles.push([1, 3, 5]);
        this.triangles.forEach(function (tri, idx) {
            this.triangles[idx] = tri.concat(0, idx);
        }, this);

        this.triangles.forEach(function (tri, idx) {
            const v1 = this.vertices[tri[0]];
            const v2 = this.vertices[tri[1]];
            const v3 = this.vertices[tri[2]];
            this.vertices.push([(v1[0] + v2[0] + v3[0]) / 3, (v1[1] + v2[1] + v3[1]) / 3, (v1[2] + v2[2] + v3[2]) / 3]);
            this.areaCenter.push(this.vertices.length - 1);
        }, this);
        this.vertices.forEach(function (v, idx) {
            this.vertices[idx] = aos.Math.normalizeVector3(v).concat(0);
        }, this);

        const intermediate = this.tessellate(this.triangles);
        //const intermediate2 = this.tessellate(intermediate);
        this.tessellatedTriangles = this.tessellate(intermediate);
        //this.tessellatedTriangles = this.tessellate(this.triangles);
    },

    generateDodecaKleetope: function () {
        const invphi = 2 / (1 + Math.sqrt(5));
        this.vertices.push([1, invphi, 0]);    // 0
        this.vertices.push([1, -invphi, 0]);    // 1
        this.vertices.push([-1, invphi, 0]);    // 2
        this.vertices.push([-1, -invphi, 0]);    // 3
        this.vertices.push([0, 1, invphi]);    // 4
        this.vertices.push([0, 1, -invphi]);    // 5
        this.vertices.push([0, -1, invphi]);    // 6
        this.vertices.push([0, -1, -invphi]);    // 7
        this.vertices.push([invphi, 0, 1]);    // 8
        this.vertices.push([-invphi, 0, 1]);    // 9
        this.vertices.push([invphi, 0, -1]);    // 10
        this.vertices.push([-invphi, 0, -1]);    // 11

        const icosahedron = [];
        icosahedron.push([4, 5, 0]); // 12
        icosahedron.push([4, 5, 2]); // 13
        icosahedron.push([6, 7, 1]); // 14
        icosahedron.push([6, 7, 3]); // 15
        icosahedron.push([0, 1, 8]); // 16
        icosahedron.push([0, 1, 10]); // 17
        icosahedron.push([2, 3, 9]); // 18
        icosahedron.push([2, 3, 11]); // 19
        icosahedron.push([8, 9, 4]); // 20
        icosahedron.push([8, 9, 6]); // 21
        icosahedron.push([10, 11, 5]); // 22
        icosahedron.push([10, 11, 7]); // 23
        icosahedron.push([0, 4, 8]); // 24
        icosahedron.push([0, 5, 10]); // 25
        icosahedron.push([1, 6, 8]); // 26
        icosahedron.push([1, 7, 10]); // 27
        icosahedron.push([2, 4, 9]); // 28
        icosahedron.push([2, 5, 11]); // 29
        icosahedron.push([3, 6, 9]); // 30
        icosahedron.push([3, 7, 11]); // 31
        icosahedron.forEach(function (tri, idx) {
            const v1 = this.vertices[tri[0]];
            const v2 = this.vertices[tri[1]];
            const v3 = this.vertices[tri[2]];
            this.vertices.push([(v1[0] + v2[0] + v3[0]) / 3, (v1[1] + v2[1] + v3[1]) / 3, (v1[2] + v2[2] + v3[2]) / 3]);
        }, this);

        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(function (num) {
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(function (other) {
                if (other != num) {
                    icosahedron.forEach(function (ico1, idx1) {
                        if (ico1.indexOf(num) >= 0 && ico1.indexOf(other) >= 0) {
                            icosahedron.forEach(function (ico2, idx2) {
                                if (idx2 > idx1 && ico2.indexOf(num) >= 0 && ico2.indexOf(other) >= 0) {
                                    this.triangles.push([num, idx1 + 12, idx2 + 12, 0, num]);
                                }
                            }, this);
                        }
                    }, this);
                }
            }, this);
        }, this);
    },

    generateD12: function () {
        this.generateDodecaKleetope();
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(function (num) {
            this.areaCenter.push(num);
        }, this);
        this.vertices.forEach(function (v, idx) {
            this.vertices[idx] = aos.Math.normalizeVector3(v).concat(0);
        }, this);
        this.tessellatedTriangles = this.tessellate(this.triangles);
    },

    generateD60: function () {
        this.generateDodecaKleetope();
        this.vertices.forEach(function (v, idx) {
            this.vertices[idx] = aos.Math.normalizeVector3(v);
        }, this);
        this.triangles.forEach(function (tri, idx) {
            this.triangles[idx][4] = idx;
            const v1 = this.vertices[tri[0]];
            const v2 = this.vertices[tri[1]];
            const v3 = this.vertices[tri[2]];
            this.vertices.push([(v1[0] + v2[0] + v3[0]) / 3, (v1[1] + v2[1] + v3[1]) / 3, (v1[2] + v2[2] + v3[2]) / 3]);
            this.areaCenter.push(this.vertices.length - 1);
        }, this);
        this.vertices.forEach(function (v, idx) {
            this.vertices[idx] = aos.Math.normalizeVector3(v).concat(0);
        }, this);
        this.tessellatedTriangles = this.tessellate(this.triangles);
    },

    animateAndRender: function (tiles) {
        const canvas = document.getElementById('planetModelCanvas');
        const ctx = canvas.getContext("2d");

        ctx.save();
        ctx.translate(250, 250);
        ctx.scale(250, 250);

        if (this.rotates && this.selectedTile === -1) {
            const newModel = aos.Math.multiply4x4(this.rotateY1, this.modelMatrix);
            this.modelMatrix = newModel;
            if (this.cameraXrotate !== 0) {
                this.cameraXrotate *= 0.9;
                if (Math.abs(this.cameraXrotate) < 0.01) {
                    this.cameraXrotate = 0;
                    this.cameraMatrix = [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 6, 1
                    ];
                }
            }
        }
        else {
            if (this.mousePosition[0] < 80) {
                const newModel1 = aos.Math.multiply4x4(this.rotateY1, this.modelMatrix);
                const newModel2 = aos.Math.multiply4x4(this.rotateY1, newModel1);
                const newModel3 = aos.Math.multiply4x4(this.rotateY1, newModel2);
                const newModel4 = aos.Math.multiply4x4(this.rotateY1, newModel3);
                this.modelMatrix = newModel4;
            } else if (this.mousePosition[0] < 160) {
                const newModel1 = aos.Math.multiply4x4(this.rotateY1, this.modelMatrix);
                const newModel2 = aos.Math.multiply4x4(this.rotateY1, newModel1);
                this.modelMatrix = newModel2;
            } else if (this.mousePosition[0] < 340) {

            } else if (this.mousePosition[0] < 420) {
                const newModel1 = aos.Math.multiply4x4(this.rotateY1r, this.modelMatrix);
                const newModel2 = aos.Math.multiply4x4(this.rotateY1r, newModel1);
                this.modelMatrix = newModel2;
            } else {
                const newModel1 = aos.Math.multiply4x4(this.rotateY1r, this.modelMatrix);
                const newModel2 = aos.Math.multiply4x4(this.rotateY1r, newModel1);
                const newModel3 = aos.Math.multiply4x4(this.rotateY1r, newModel2);
                const newModel4 = aos.Math.multiply4x4(this.rotateY1r, newModel3);
                this.modelMatrix = newModel4;
            }
            const yWish = (this.mousePosition[1] - 250) / 60;
            this.cameraXrotate = 0.9 * this.cameraXrotate + 0.1 * yWish; // LERP
        }
        // rotate along X axis
        if (this.cameraXrotate !== 0) {
            const cos10 = Math.cos(Math.atan2(this.cameraXrotate, 6));
            const sin10 = Math.sin(Math.atan2(this.cameraXrotate, 6));
            this.cameraMatrix = aos.Math.multiply4x4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 6, 1
            ], [
                1, 0, 0, 0,
                0, cos10, sin10, 0,
                0, -sin10, cos10, 0,
                0, 0, 0, 1
            ]);
        }

        const vm = aos.Math.multiply4x4(this.cameraMatrix, this.modelMatrix);
        const pvm = aos.Math.multiply4x4(this.frustumMatrix, vm);

        ctx.clearRect(-1, -1, 2, 2);

        const screenPoints = [];
        this.vertices.forEach(function (vec3) {
            const screenPoint = aos.Math.transformVector3(vec3, pvm);
            screenPoints.push(screenPoint);
        }, this);
        if (this.selectedTile !== -1 && this.rotates) { 
            const screenPoint = screenPoints[this.areaCenter[this.selectedTile]];
            if (screenPoint[2] > 1.36) {
                this.mousePosition[0] = screenPoint[0] * 2500 + 250;
                this.mousePosition[1] = screenPoint[1] * 250 + 250;
            } else {
                this.mousePosition[0] = 0;
                this.mousePosition[1] = 250;
            }
        }

        //document.getElementById('debug').innerHTML = '' + (avgZ / this.vertices.length);
        this.tessellatedTriangles.forEach(function (tri) {
            tri[3] = screenPoints[tri[0]][2] + screenPoints[tri[1]][2] + screenPoints[tri[2]][2];
        }, this);
        this.tessellatedTriangles.sort(function (a, b) {
            return a[3] - b[3];
        });
        let hoverTriangle = -1;
        this.tessellatedTriangles.forEach(function (tri) {
            if (tri[3] > 4.08) {
                ctx.beginPath();
                ctx.moveTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                ctx.lineTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                ctx.closePath();
                if (!this.rotates && ctx.isPointInPath(this.mousePosition[0], this.mousePosition[1])) {
                    hoverTriangle = tri[4];
                    if (this.wantSelectedTile && this.selectedTile === tri[4]) {
                        this.selectedTile = -1;
                        this.wantSelectedTile = false;
                    } else if (this.wantSelectedTile) {
                        this.selectedTile = tri[4];
                        this.wantSelectedTile = false;
                    }
                }
            }
        }, this);
        //let triCount = 0;
        this.tessellatedTriangles.forEach(function (tri, idx) {
            //if (idx >= this.tessellatedTriangles.length * 0.5) {
            if (tri[3] > 4.08) {
                //triCount++;
                const parentTri = this.triangles[tri[4]];
                let triColor = tiles[tri[4]].color;
                if (this.selectedTile === tri[4]) {
                    triColor = 'hsl(350, 80%, 20%)';
                } else if (hoverTriangle === tri[4]) {
                    triColor = '#404';
                }
                ctx.beginPath();
                ctx.fillStyle = triColor;
                ctx.strokeStyle = triColor;
                ctx.lineWidth = 0.003;
                ctx.moveTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                ctx.lineTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                ctx.closePath();
                ctx.fill();
                // we have to stroke because:
                // https://stackoverflow.com/questions/19319963/how-to-avoid-seams-between-filled-areas-in-canvas
                ctx.stroke();
            }
        }, this);
        this.areaCenter.forEach(function (vertidx, idx) {
            const template = tiles[idx].buildingTemplate;
            if (template !== '') {
                const screenPoint = screenPoints[vertidx];
                if (screenPoint[2] > 1.37) {
                    const imgSize = 0.08 + 2.0 * (screenPoint[2] - 1.36);
                    const image = document.getElementById('resource' + (tiles[idx].functional ? 'Img' : 'Disabled') + aos.buildingTemplates[template].index);
                    ctx.drawImage(image, screenPoint[0] - imgSize, screenPoint[1] - imgSize, 2 * imgSize, 2 * imgSize);
                }
            }
        }, this);

        //document.getElementById('debug').innerHTML = '' + triCount;
        ctx.restore();
    },

};