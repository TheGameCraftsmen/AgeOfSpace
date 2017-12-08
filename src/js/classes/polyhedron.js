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

        const fullSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
            + '<g><path fill="{color}" d="'.replace('{color}', '#888')
            + aos.buildings[0].svgCode
            + '"></path></g>'
            + '</svg>';
        const image = document.getElementById("resourceImg1");
        image.src = 'data:image/svg+xml,' + encodeURIComponent(fullSvgCode);

        if (tileCount === 8) {
            this.generateD8();
        } else if (tileCount === 12) {
            this.generateD12();
        } else {
            this.generateD20();
        }
    },

    tessellate: function (sourceTri) {
        const destTri = [];
        sourceTri.forEach(function (tri, idx) {
            // Triangles arrays: [vertex1, vertex2, vertex3, Z-buffer (distance to camera), parent triangle, isCenter, has01Border, has12Border, has20Border]
            const v0 = this.vertices[tri[0]];
            const v1 = this.vertices[tri[1]];
            const v2 = this.vertices[tri[2]];
            this.vertices.push(aos.Math.normalizeVector3([(v0[0] + v1[0]) * 0.5, (v0[1] + v1[1]) * 0.5, (v0[2] + v1[2]) * 0.5]).concat(0));
            this.vertices.push(aos.Math.normalizeVector3([(v1[0] + v2[0]) * 0.5, (v1[1] + v2[1]) * 0.5, (v1[2] + v2[2]) * 0.5]).concat(0));
            this.vertices.push(aos.Math.normalizeVector3([(v2[0] + v0[0]) * 0.5, (v2[1] + v0[1]) * 0.5, (v2[2] + v0[2]) * 0.5]).concat(0));
            destTri.push([tri[0], this.vertices.length - 3, this.vertices.length - 1, 0, tri[4], false, tri[6], false, tri[8]]);
            destTri.push([tri[1], this.vertices.length - 3, this.vertices.length - 2, 0, tri[4], false, tri[6], false, tri[7]]);
            destTri.push([tri[2], this.vertices.length - 2, this.vertices.length - 1, 0, tri[4], false, tri[7], false, tri[8]]);
            destTri.push([this.vertices.length - 3, this.vertices.length - 2, this.vertices.length - 1, 0, tri[4], tri[5], false, false, false]);
        }, this);
        return destTri;
    },

    applyPostGeneration: function () {
        this.vertices.forEach(function (v, idx) {
            this.vertices[idx] = aos.Math.normalizeVector3(v).concat(0);
        }, this);
        this.triangles.forEach(function (tri, idx) {
            this.triangles[idx] = tri.concat(0, idx, true, true, true, true);
        }, this);
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

        // Triangles arrays: [vertex1, vertex2, vertex3, average Zmodel, parent triangle, isCenter, has01Border, has12Border, has20Border]
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

        this.applyPostGeneration();
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

        this.applyPostGeneration();
        const intermediate = this.tessellate(this.triangles);
        //const intermediate2 = this.tessellate(intermediate);
        this.tessellatedTriangles = this.tessellate(intermediate);
        //this.tessellatedTriangles = this.tessellate(this.triangles);
    },

    generateD12: function () {
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
        this.vertices.forEach(function (v, idx) {
            this.vertices[idx] = aos.Math.normalizeVector3(v).concat(0);
        }, this);

        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(function (num) {
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(function (other) {
                if (other != num) {
                    icosahedron.forEach(function (ico1, idx1) {
                        if (ico1.indexOf(num) >= 0 && ico1.indexOf(other) >= 0) {
                            icosahedron.forEach(function (ico2, idx2) {
                                if (idx2 > idx1 && ico2.indexOf(num) >= 0 && ico2.indexOf(other) >= 0) {
                                    this.triangles.push([num, idx1 + 12, idx2 + 12, 0, num, false, false, true, false]);
                                }
                            }, this);
                        }
                    }, this);
                }
            }, this);
        }, this);

        //this.tessellatedTriangles = this.tessellate(this.triangles);
        //const intermediate = this.tessellate(this.triangles);
        //const intermediate2 = this.tessellate(intermediate);
        //this.tessellatedTriangles = this.tessellate(intermediate);
        this.tessellatedTriangles = this.tessellate(this.triangles);
    },

    animateAndRender: function () {
        const canvas = document.getElementById('planetModelCanvas');
        const ctx = canvas.getContext("2d");

        ctx.save();
        ctx.translate(250, 250);
        ctx.scale(250, 250);

        if (this.rotates) {
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
                // No rotation
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

        //let minZ = 10;
        //let maxZ = -10;
        //let avgZ = 0;
        const screenPoints = [];
        this.vertices.forEach(function (vec3) {
            const screenPoint = aos.Math.transformVector3(vec3, pvm);
            //minZ = Math.min(minZ, screenPoint[2]);
            //maxZ = Math.max(maxZ, screenPoint[2]);
            //avgZ += screenPoint[2];
            screenPoints.push(screenPoint);
            //const modelPoint = aos.Math.transformVector3(vec3, this.modelMatrix);
            //vec3[3] = (6 - modelPoint[2]) * (6 - modelPoint[2]) + (this.cameraXrotate - modelPoint[1]) * (this.cameraXrotate - modelPoint[1]);
        }, this);
        //document.getElementById('debug').innerHTML = '' + (avgZ / this.vertices.length);
        this.tessellatedTriangles.forEach(function (tri) {
            //tri[3] = this.vertices[tri[0]][3] + this.vertices[tri[1]][3] + this.vertices[tri[2]][3];
            tri[3] = screenPoints[tri[0]][2] + screenPoints[tri[1]][2] + screenPoints[tri[2]][2];
        }, this);
        this.tessellatedTriangles.sort(function (a, b) {
            return a[3] - b[3];
        });
        let selectedTriangle = -1;
        this.tessellatedTriangles.forEach(function (tri) {
            ctx.beginPath();
            ctx.moveTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
            ctx.lineTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
            ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
            ctx.closePath();
            if (!this.rotates && ctx.isPointInPath(this.mousePosition[0], this.mousePosition[1])) {
                selectedTriangle = tri[4];
            }
        }, this);
        //let triCount = 0;
        this.tessellatedTriangles.forEach(function (tri, idx) {
            //if (idx >= this.tessellatedTriangles.length * 0.5) {
            if (tri[3] > 4.08) {
                //triCount++;
                const parentTri = this.triangles[tri[4]];
                let triColor = 'rgb(' + (parentTri[1] * 20) + ', ' + (parentTri[0] * 20) + ', ' + (parentTri[2] * 20) + ')';
                triColor = tri[4] % 2 === 0 ? '#640' : '#00b';
                if (selectedTriangle === tri[4]) {
                    triColor = '#600';
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

                //ctx.strokeStyle = '#000';
                //ctx.lineWidth = 0.009; // 0.004 space units = 1 px on screen
                //if (tri[6]) {
                //    ctx.beginPath();
                //    ctx.moveTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                //    ctx.lineTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                //    ctx.stroke();
                //}
                //if (tri[7]) {
                //    ctx.beginPath();
                //    ctx.moveTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                //    ctx.lineTo(screenPoints[tri[1]][0], screenPoints[tri[1]][1]);
                //    ctx.stroke();
                //}
                //if (tri[8]) {
                //    ctx.beginPath();
                //    ctx.moveTo(screenPoints[tri[0]][0], screenPoints[tri[0]][1]);
                //    ctx.lineTo(screenPoints[tri[2]][0], screenPoints[tri[2]][1]);
                //    ctx.stroke();
                //}
            }
        }, this);
        //this.tessellatedTriangles.forEach(function (tri, idx) {
        //    if (idx >= this.tessellatedTriangles.length * 0.6) {
        //        if (tri[5]) { // isCenter
        //            const v1 = this.vertices[tri[0]];
        //            const v2 = this.vertices[tri[1]];
        //            const v3 = this.vertices[tri[2]];
        //            const v123 = [(v1[0] + v2[0] + v3[0]) / 3, (v1[1] + v2[1] + v3[1]) / 3, (v1[2] + v2[2] + v3[2]) / 3]; // We do NOT normalize here because we want the point to be at the center of the tri, not on the bounding sphere
        //            const screenPoint = aos.Math.transformVector3(v123, pvm);
        //            //if (tri[4] === 7) {
        //            if (true) {
        //                // Heron's formula
        //                const point0 = screenPoints[tri[0]];
        //                const point1 = screenPoints[tri[1]];
        //                const point2 = screenPoints[tri[2]];
        //                const da = Math.sqrt((point0[0] - point1[0]) * (point0[0] - point1[0]) + (point0[1] - point1[1]) * (point0[1] - point1[1]));
        //                const db = Math.sqrt((point2[0] - point1[0]) * (point2[0] - point1[0]) + (point2[1] - point1[1]) * (point2[1] - point1[1]));
        //                const dc = Math.sqrt((point0[0] - point2[0]) * (point0[0] - point2[0]) + (point0[1] - point2[1]) * (point0[1] - point2[1]));
        //                const heronP = 0.5 * (da + db + dc);
        //                const heronS = 0.03 + 1.6 * Math.sqrt(heronP * (heronP - da) * (heronP - db) * (heronP - dc));
        //                if (heronS > 0.04) {
        //                    const image = document.getElementById("resourceImg1");
        //                    ctx.drawImage(image, screenPoint[0] - heronS, screenPoint[1] - heronS, 2 * heronS, 2 * heronS);
        //                }
        //            }
        //        }
        //    }
        //}, this);

        //document.getElementById('debug').innerHTML = '' + triCount;
        ctx.restore();
    },

};