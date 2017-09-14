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
    this.constellationBoundaries = [];
    this.constellations = [];
    this.stars = [];
};

aos.Galaxy.prototype = {

    generate: function () {
        // naming (E0, E5, Sa, Sb, Sc) comes from Hubble sequence
        // see https://en.wikipedia.org/wiki/Hubble_sequence
        // and https://en.wikipedia.org/wiki/Galaxy#Types_and_morphology
        // we do not generate barred sprirals (SBx), lenticulars (S0) and irregulars
        const galaxyType = Math.random();
        if (galaxyType < 0.12) {
            this.generateE0(); // 12% chance
        } else if (galaxyType < 0.20) {
            this.generateE5(); // 8% chance
        } else if (galaxyType < 0.55) {
            this.generateSa(); // 35% chance
        } else if (galaxyType < 0.80) {
            this.generateSb(); // 25% chance
        } else {
            this.generateSc(); // 20% chance
        }
        this.computeConstellationBoundaries();
        //this.drawConstellationBoundaries();
        this.createConstellations();
    },

    generateE0: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        this.generateWithPhase(0.0, totalStarCount, 1024, 0.0, 0.0, 100);
    },

    generateE5: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        this.generateWithPhase(0.0, totalStarCount, 0.2 + 0.5 * Math.random(), 0.0, 0.0, 100);
    },

    generateSa: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        const phaseMax = 1.0 + 7.0 * Math.random();
        const mirror = Math.random() < 0.5 ? -1.0 : 1.0;
        this.generateWithPhase(-Math.PI / 2.0 * phaseMax * mirror, totalStarCount, 0.2 + 0.5 * Math.random(), phaseMax, mirror, 100);
    },

    generateSb: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        const hRatio = 0.3 + 0.5 * Math.random();
        const phaseRandomness = 0.1 + 0.2 * Math.random();
        const phaseMax = 2.0 + 2.0 * Math.random()
        const mirror = Math.random() < 0.5 ? -1.0 : 1.0;
        this.generateWithPhase(0, totalStarCount * (1 - hRatio), phaseRandomness, phaseMax, mirror, 50);
        this.generateWithPhase(Math.PI / 2.0, totalStarCount * hRatio, phaseRandomness, phaseMax, mirror, 50);
    },

    generateSc: function () {
        const totalStarCount = 13000 + 7000 * Math.random();
        const hRatio = 0.1 + 0.3 * Math.random();
        const phaseRandomness = 0.05 + 0.05 * Math.random();
        const phaseMax = 2.0 + 2.0 * Math.random()
        const mirror = Math.random() < 0.5 ? -1.0 : 1.0;
        this.generateWithPhase(0, totalStarCount * (0.5 - hRatio), phaseRandomness, phaseMax, mirror, 25);
        this.generateWithPhase(Math.PI / 2.0, totalStarCount * hRatio, phaseRandomness, phaseMax, mirror, 25);
        this.generateWithPhase(Math.PI / 4.0, totalStarCount * 0.25, phaseRandomness, phaseMax, mirror, 25);
        this.generateWithPhase(Math.PI * 3.0 / 4.0, totalStarCount * 0.25, phaseRandomness, phaseMax, mirror, 25);
    },

    generateWithPhase: function (phaseOrigin, starAmount, phaseRandomness, phaseMax, mirror, pushToStar) {
        // generation algorithm is based on
        // https://en.wikipedia.org/wiki/Density_wave_theory
        // with added randomness
        const canvas = document.getElementById('ellipse');
        const ctx = canvas.getContext('2d');

        for (let i = starAmount; i >= 0; i--) {
            // ellipse with parameters
            // a = 2; b = 1; e² = 1 - 1/4 = 3/4;
            const dist = 360.0 * Math.random();
            const angle = 2 * Math.PI * Math.random();
            const phase = phaseOrigin + dist / 720.0 * phaseMax * Math.PI * mirror;
            const theta = angle + phase + (0.5 - Math.random()) * phaseRandomness;
            const r = dist * Math.sqrt(1.0 / (1.0 - 0.75 * Math.cos(angle) * Math.cos(angle)));
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
                // TODO : better coloring
                //if (angle > 3.0 && angle < 3.28) {
                //    ctx.fillStyle = '#f00';
                //    pointSize = 4.0;
                //}
                if (i < pushToStar && x > -580 && x < 580 && y > -430 && y < 430 && r > 100) {
                    const myStar = new aos.Star();
                    myStar.x = x;
                    myStar.y = y;
                    myStar.r = r;
                    myStar.group = Math.random() + this.stars.length + 1;
                    myStar.keep = true;
                    myStar.isNotable = false;
                    myStar.greekLetter = '?';
                    this.stars.push(myStar);
                }
                ctx.fillRect(x + 600.0 - pointSize / 2.0, y + 450.0 - pointSize / 2.0, pointSize, pointSize);
            }
        }
    },

    filterCenterAndTooClose: function (sourceCoordinates, strict, keepCount) {
        const minDist = strict ? 6400 : 625; // 80² , 25²
        const filteredStar = sourceCoordinates.filter(function (star) {
            return star.r > 100.0;
        });
        filteredStar.forEach(function (star, i) {
            if (star.keep) {
                filteredStar.forEach(function (otherStar, j) {
                    if (j > i) {
                        const deltaX = star.x - otherStar.x;
                        const deltaY = star.y - otherStar.y;
                        const dist = deltaX * deltaX + deltaY * deltaY;
                        if (dist < minDist) { // sqrt(dist) < 80.0
                            otherStar.keep = false;
                        }
                    }
                });
            }
        });
        const filteredStar2 = filteredStar.filter(function (star) {
            return star.keep;
        });
        return filteredStar2.filter(function (star, i) {
            return i < keepCount;
        });
    },

    computeConstellationBoundaries: function () {
        // 3 random angles around the galaxy center, separated by 120°
        const theta0 = 2.0 * Math.PI * Math.random();
        const theta1 = theta0 + 2.0 * Math.PI / 3.0;
        const theta2 = theta1 + 2.0 * Math.PI / 3.0;

        // convert radial coordinates to cartesian
        const coreRadius = 1.0 + 99.0 * Math.random();
        const x0 = coreRadius * Math.cos(theta0);
        const y0 = coreRadius * Math.sin(theta0);
        const x1 = coreRadius * Math.cos(theta1);
        const y1 = coreRadius * Math.sin(theta1);
        const x2 = coreRadius * Math.cos(theta2);
        const y2 = coreRadius * Math.sin(theta2);

        // line equations
        const a0 = (y1 - y0) / (x1 - x0);
        const b0 = y0 - a0 * x0;
        const a1 = (y2 - y1) / (x2 - x1);
        const b1 = y1 - a1 * x1;
        const a2 = (y0 - y2) / (x0 - x2);
        const b2 = y2 - a2 * x2;
        this.constellationBoundaries.push({ a: a0, b: b0 });
        this.constellationBoundaries.push({ a: a1, b: b1 });
        this.constellationBoundaries.push({ a: a2, b: b2 });
    },

    drawConstellationBoundaries: function () {
        const a0 = this.constellationBoundaries[0].a;
        const b0 = this.constellationBoundaries[0].b;
        const a1 = this.constellationBoundaries[1].a;
        const b1 = this.constellationBoundaries[1].b;
        const a2 = this.constellationBoundaries[2].a;
        const b2 = this.constellationBoundaries[2].b;

        const y0neg = a0 * (-600.0) + b0;
        const y0pos = a0 * (600.0) + b0;
        const y1neg = a1 * (-600.0) + b1;
        const y1pos = a1 * (600.0) + b1;
        const y2neg = a2 * (-600.0) + b2;
        const y2pos = a2 * (600.0) + b2;

        const canvas = document.getElementById('starOverlay');
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, 450 + y0neg);
        ctx.lineTo(1200, 450 + y0pos);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 450 + y1neg);
        ctx.lineTo(1200, 450 + y1pos);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 450 + y2neg);
        ctx.lineTo(1200, 450 + y2pos);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(600, 450, 50, 0, 2 * Math.PI);
        ctx.stroke();
    },

    createConstellations: function () {
        let i;
        for (i = 0; i < 7; i++) {
            const tmp = new aos.Constellation();
            this.constellations.push(tmp);
        }
        const notableStars = this.filterCenterAndTooClose(this.stars, true, 15);
        notableStars.forEach(function (star) {
            star.isNotable = true;
            const constellationId = this.getConstellationId(star.x, star.y);
            this.constellations[constellationId].stars.push(star);
        }, this);
        this.stars.forEach(function (star) {
            if (!star.isNotable) {
                const constellationId = this.getConstellationId(star.x, star.y);
                this.constellations[constellationId].stars.push(star);
            }
        }, this);
        this.constellations.forEach(function (c, i) {
            //document.getElementById('stats').innerHTML += '' + i + '/' + JSON.stringify(c.stars.length) + '<br/>';
            const filteredConstellation = this.filterCenterAndTooClose(c.stars, false, 16);
            c.stars = filteredConstellation;
            while (c.stars.length < 6 && i != 0) {
                const x = -590.0 + 1180.0 * Math.random();
                const y = -420.0 + 840.0 * Math.random();
                if (this.getConstellationId(x, y) === i) {
                    const myStar = new aos.Star();
                    myStar.x = x;
                    myStar.y = y;
                    myStar.r = Math.sqrt(x * x + y * y);
                    myStar.group = Math.random() + c.stars.length + 1000;
                    myStar.keep = true;
                    myStar.isNotable = false;
                    myStar.greekLetter = '?';
                    c.stars.push(myStar);
                    const filteredConstellation2 = this.filterCenterAndTooClose(c.stars, false, 16);
                    c.stars = filteredConstellation2;
                }
            }
        }, this);
        const constellationReference = [
{ id: 1, name: 'Andromeda', abbr: 'And', gen: 'Andromedae' },
{ id: 2, name: 'Antlia', abbr: 'Ant', gen: 'Antliae' },
{ id: 3, name: 'Apus', abbr: 'Aps', gen: 'Apodis' },
{ id: 4, name: 'Aquarius', abbr: 'Aqr', gen: 'Aquarii' },
{ id: 5, name: 'Aquila', abbr: 'Aql', gen: 'Aquilae' },
{ id: 6, name: 'Ara', abbr: 'Ara', gen: 'Arae' },
{ id: 7, name: 'Aries', abbr: 'Ari', gen: 'Arietis' },
{ id: 8, name: 'Auriga', abbr: 'Aur', gen: 'Aurigae' },
{ id: 9, name: 'Bootes', abbr: 'Boo', gen: 'Bootis' },
{ id: 10, name: 'Caelum', abbr: 'Cae', gen: 'Caeli' },
{ id: 11, name: 'Camelopardalis', abbr: 'Cam', gen: 'Camelopardalis' },
{ id: 12, name: 'Cancer', abbr: 'Cnc', gen: 'Cancri' },
{ id: 13, name: 'Canes Venatici', abbr: 'CVn', gen: 'Canun Venaticorum' },
{ id: 14, name: 'Canis Major', abbr: 'CMa', gen: 'Canis Majoris' },
{ id: 15, name: 'Canis Minor', abbr: 'CMi', gen: 'Canis Minoris' },
{ id: 16, name: 'Capricornus', abbr: 'Cap', gen: 'Capricorni' },
{ id: 17, name: 'Carina', abbr: 'Car', gen: 'Carinae' },
{ id: 18, name: 'Cassiopeia', abbr: 'Cas', gen: 'Cassiopeiae' },
{ id: 19, name: 'Centaurus', abbr: 'Cen', gen: 'Centauri' },
{ id: 20, name: 'Cepheus', abbr: 'Cep', gen: 'Cephei' },
{ id: 21, name: 'Cetus', abbr: 'Cet', gen: 'Ceti' },
{ id: 22, name: 'Chamaleon', abbr: 'Cha', gen: 'Chamaleontis' },
{ id: 23, name: 'Circinus', abbr: 'Cir', gen: 'Circini' },
{ id: 24, name: 'Columba', abbr: 'Col', gen: 'Columbae' },
{ id: 25, name: 'Coma Berenices', abbr: 'Com', gen: 'Comae Berenices' },
{ id: 26, name: 'Corona Australis', abbr: 'CrA', gen: 'Coronae Australis' },
{ id: 27, name: 'Corona Borealis', abbr: 'CrB', gen: 'Coronae Borealis' },
{ id: 28, name: 'Corvus', abbr: 'Crv', gen: 'Corvi' },
{ id: 29, name: 'Crater', abbr: 'Crt', gen: 'Crateris' },
{ id: 30, name: 'Crux', abbr: 'Cru', gen: 'Crucis' },
{ id: 31, name: 'Cygnus', abbr: 'Cyg', gen: 'Cygni' },
{ id: 32, name: 'Delphinus', abbr: 'Del', gen: 'Delphini' },
{ id: 33, name: 'Dorado', abbr: 'Dor', gen: 'Doradus' },
{ id: 34, name: 'Draco', abbr: 'Dra', gen: 'Draconis' },
{ id: 35, name: 'Equuleus', abbr: 'Equ', gen: 'Equulei' },
{ id: 36, name: 'Eridanus', abbr: 'Eri', gen: 'Eridani' },
{ id: 37, name: 'Fornax', abbr: 'For', gen: 'Fornacis' },
{ id: 38, name: 'Gemini', abbr: 'Gem', gen: 'Geminorum' },
{ id: 39, name: 'Grus', abbr: 'Gru', gen: 'Gruis' },
{ id: 40, name: 'Hercules', abbr: 'Her', gen: 'Herculis' },
{ id: 41, name: 'Horologium', abbr: 'Hor', gen: 'Horologii' },
{ id: 42, name: 'Hydra', abbr: 'Hya', gen: 'Hydrae' },
{ id: 43, name: 'Hydrus', abbr: 'Hyi', gen: 'Hydri' },
{ id: 44, name: 'Indus', abbr: 'Ind', gen: 'Indi' },
{ id: 45, name: 'Lacerta', abbr: 'Lac', gen: 'Lacertae' },
{ id: 46, name: 'Leo', abbr: 'Leo', gen: 'Leonis' },
{ id: 47, name: 'Leo Minor', abbr: 'LMi', gen: 'Leonis Minoris' },
{ id: 48, name: 'Lepus', abbr: 'Lep', gen: 'Leporis' },
{ id: 49, name: 'Libra', abbr: 'Lib', gen: 'Librae' },
{ id: 50, name: 'Lupus', abbr: 'Lup', gen: 'Lupi' },
{ id: 51, name: 'Lynx', abbr: 'Lyn', gen: 'Lyncis' },
{ id: 52, name: 'Lyra', abbr: 'Lyr', gen: 'Lyrae' },
{ id: 53, name: 'Mensa', abbr: 'Men', gen: 'Mensae' },
{ id: 54, name: 'Microscopium', abbr: 'Mic', gen: 'Microscopii' },
{ id: 55, name: 'Monoceros', abbr: 'Mon', gen: 'Monocerotis' },
{ id: 56, name: 'Musca', abbr: 'Mus', gen: 'Muscae' },
{ id: 57, name: 'Norma', abbr: 'Nor', gen: 'Normae' },
{ id: 58, name: 'Octans', abbr: 'Oct', gen: 'Octantis' },
{ id: 59, name: 'Ophiucus', abbr: 'Oph', gen: 'Ophiuchi' },
{ id: 60, name: 'Orion', abbr: 'Ori', gen: 'Orionis' },
{ id: 61, name: 'Pavo', abbr: 'Pav', gen: 'Pavonis' },
{ id: 62, name: 'Pegasus', abbr: 'Peg', gen: 'Pegasi' },
{ id: 63, name: 'Perseus', abbr: 'Per', gen: 'Persei' },
{ id: 64, name: 'Phoenix', abbr: 'Phe', gen: 'Phoenicis' },
{ id: 65, name: 'Pictor', abbr: 'Pic', gen: 'Pictoris' },
{ id: 66, name: 'Pisces', abbr: 'Psc', gen: 'Piscium' },
{ id: 67, name: 'Pisces Austrinus', abbr: 'PsA', gen: 'Pisces Austrini' },
{ id: 68, name: 'Puppis', abbr: 'Pup', gen: 'Puppis' },
{ id: 69, name: 'Pyxis', abbr: 'Pyx', gen: 'Pyxidis' },
{ id: 70, name: 'Reticulum', abbr: 'Ret', gen: 'Reticuli' },
{ id: 71, name: 'Sagitta', abbr: 'Sge', gen: 'Sagittae' },
{ id: 72, name: 'Sagittarius', abbr: 'Sgr', gen: 'Sagittarii' },
{ id: 73, name: 'Scorpius', abbr: 'Sco', gen: 'Scorpii' },
{ id: 74, name: 'Sculptor', abbr: 'Scl', gen: 'Sculptoris' },
{ id: 75, name: 'Scutum', abbr: 'Sct', gen: 'Scuti' },
{ id: 76, name: 'Serpens', abbr: 'Ser', gen: 'Serpentis' },
{ id: 77, name: 'Sextans', abbr: 'Sex', gen: 'Sextantis' },
{ id: 78, name: 'Taurus', abbr: 'Tau', gen: 'Tauri' },
{ id: 79, name: 'Telescopium', abbr: 'Tel', gen: 'Telescopii' },
{ id: 80, name: 'Triangulum', abbr: 'Tri', gen: 'Trianguli' },
{ id: 81, name: 'Triangulum Australe', abbr: 'TrA', gen: 'Trianguli Australis' },
{ id: 82, name: 'Tucana', abbr: 'Tuc', gen: 'Tucanae' },
{ id: 83, name: 'Ursa Major', abbr: 'UMa', gen: 'Ursae Majoris' },
{ id: 84, name: 'Ursa Minor', abbr: 'UMi', gen: 'Ursae Minoris' },
{ id: 85, name: 'Vela', abbr: 'Vel', gen: 'Velorum' },
{ id: 86, name: 'Virgo', abbr: 'Vir', gen: 'Virginis' },
{ id: 87, name: 'Volans', abbr: 'Vol', gen: 'Volantis' },
{ id: 88, name: 'Vulpecula', abbr: 'Vul', gen: 'Vulpeculae' }
        ];
        const greekLetters = [
{ id: 1, maj: 'Α', min: 'α', name: 'alpha' },
{ id: 2, maj: 'Β', min: 'β', name: 'bêta' },
{ id: 3, maj: 'Γ', min: 'γ', name: 'gamma' },
{ id: 4, maj: 'Δ', min: 'δ', name: 'delta' },
{ id: 5, maj: 'Ε', min: 'ε', name: 'epsilon' },
{ id: 6, maj: 'Ζ', min: 'ζ', name: 'zêta' },
{ id: 7, maj: 'Η', min: 'η', name: 'êta' },
{ id: 8, maj: 'Θ', min: 'θ', name: 'thêta' },
{ id: 9, maj: 'Ι', min: 'ι', name: 'iota' },
{ id: 10, maj: 'Κ', min: 'κ', name: 'kappa' },
{ id: 11, maj: 'Λ', min: 'λ', name: 'lambda' },
{ id: 12, maj: 'Μ', min: 'μ', name: 'mu' },
{ id: 13, maj: 'Ν', min: 'ν', name: 'nu' },
{ id: 14, maj: 'Ξ', min: 'ξ', name: 'ksi/xi' },
{ id: 15, maj: 'Ο', min: 'ο', name: 'omicron' },
{ id: 16, maj: 'Π', min: 'π', name: 'pi' },
{ id: 17, maj: 'Ρ', min: 'ρ', name: 'rhô' },
{ id: 18, maj: 'Σ', min: 'σ', name: 'sigma' },
{ id: 19, maj: 'Τ', min: 'τ', name: 'tau' },
{ id: 20, maj: 'Υ', min: 'υ', name: 'upsilon' },
{ id: 21, maj: 'Φ', min: 'ϕ', name: 'phi' },
{ id: 22, maj: 'Χ', min: 'χ', name: 'khi/chi' },
{ id: 23, maj: 'Ψ', min: 'ψ', name: 'psi' },
{ id: 24, maj: 'Ω', min: 'ω', name: 'oméga' },
        ];
        constellationReference.forEach(function (c) {
            c.rng = Math.random();
        }, this);
        constellationReference.sort(function (a, b) {
            return a.rng - b.rng;
        });
        this.constellations.forEach(function (c, i) {
            //document.getElementById('stats').innerHTML += '' + i + '/' + JSON.stringify(c.stars.length) + '<br/>';
            c.reference = constellationReference[i];
            c.computeEdges();
            c.kruskal();
            c.stars.forEach(function (star) {
                star.group = Math.random();
            }, this);
            const sortedStars = c.stars.slice()
            sortedStars.sort(function (a, b) {
                return a.group - b.group;
            });
            sortedStars.forEach(function (star, i) {
                //star.greek = greekLetters[i].name.charAt(0).toUpperCase() + greekLetters[i].name.slice(1);
                star.greek = greekLetters[i];
            }, this);
            c.render(false);
        }, this);
    },

    getConstellationId: function (x, y) {
        if (x * x + y * y < 10000.0) {
            return 0;
        } else {
            const a0 = this.constellationBoundaries[0].a;
            const b0 = this.constellationBoundaries[0].b;
            const a1 = this.constellationBoundaries[1].a;
            const b1 = this.constellationBoundaries[1].b;
            const a2 = this.constellationBoundaries[2].a;
            const b2 = this.constellationBoundaries[2].b;

            // i want ([0,0] === false) for all relativeX
            let relative0 = (y > a0 * x + b0);
            if (b0 < 0) relative0 = !relative0;
            let relative1 = (y > a1 * x + b1);
            if (b1 < 0) relative1 = !relative1;
            let relative2 = (y > a2 * x + b2);
            if (b2 < 0) relative2 = !relative2;

            let zone = 0;
            if (relative0) {
                zone += 1;
            }
            if (relative1) {
                zone += 2;
            }
            if (relative2) {
                zone += 4;
            }
            return zone;
        }
    },

    setupEvents: function () {
        const instance = this;
        document.getElementById('starOverlay').addEventListener('mousemove', function (e) {
            e.preventDefault(); // usually, keeping the left mouse button down triggers a text selection or a drag & drop.
            const galaxyCoordX = e.offsetX * 1200 / document.getElementById('starOverlay').offsetWidth - 600;
            const galaxyCoordY = e.offsetY * 1200 / document.getElementById('starOverlay').offsetWidth - 450;
            //document.getElementById('stats').innerHTML = '' + galaxyCoordX + '/' + galaxyCoordY + '/' + '<br/>';
            document.getElementById('starOverlay').style.cursor = 'default';
            document.getElementById('starSystemBlock').style.display = 'none';

            const canvas = document.getElementById('starOverlay');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 1200, 900);
            const constellationId = instance.getConstellationId(galaxyCoordX, galaxyCoordY);
            instance.constellations.forEach(function (c, i) {
                c.render(i === constellationId);
            });
            if (constellationId === 0) {
                ctx.beginPath();
                ctx.strokeStyle = '#c00';
                ctx.lineWidth = 2;
                ctx.arc(600, 450, 50, 0, 2 * Math.PI);
                ctx.stroke();
                document.getElementById('starSystemBlock').style.display = 'block';
                document.getElementById('starSystemName').innerHTML = 'Galactic Core' +
                    '<br><em>Special area</em>';
            }
            else {
                document.getElementById('starSystemBlock').style.display = 'block';
                document.getElementById('starSystemName').innerHTML = '' + instance.constellations[constellationId].reference.name +
                    '<br><em>Constellation</em>';
            }

            //document.getElementById('stats').innerHTML = '' + constellationId + '/' + '<br/>';

            instance.constellations[constellationId].stars.forEach(function (star) {
                const deltaX = star.x - galaxyCoordX;
                const deltaY = star.y - galaxyCoordY;
                const dist = deltaX * deltaX + deltaY * deltaY;
                const radius = star.isNotable ? 225.0 : 100.0; // 15² , 10²
                const label = star.isNotable ? 'Notable star' : 'Star';
                if (dist < radius) { // sqrt(dist) < 20.0
                    document.getElementById('starOverlay').style.cursor = 'pointer';
                    document.getElementById('starSystemBlock').style.display = 'block';
                    document.getElementById('starSystemName').innerHTML = '' +
                        star.greek.name.charAt(0).toUpperCase() + star.greek.name.slice(1) + ' ' +
                        instance.constellations[constellationId].reference.gen +
                    '<br><em>' + label + '</em>';
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
    window.requestAnimationFrame(function () {
        document.getElementById('starSystemBlock').style.display = 'none';
    });
};