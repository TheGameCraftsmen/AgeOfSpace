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
        this.createConstellations(); // This function calls star.generate recursively
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
        const canvas = document.getElementById('galaxyStarsCanvas');
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
                //if (mirror !== 0 && angle > phaseOrigin - 0.1 && angle < phaseOrigin + 0.1) {
                //    ctx.fillStyle = '#aaf';
                //}
                //if (dist > 200 & dist < 210) {
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

        const canvas = document.getElementById('galaxyOverlayCanvas');
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
            //document.getElementById('debug').innerHTML += '' + i + '/' + JSON.stringify(c.stars.length) + '<br/>';
            const filteredConstellation = this.filterCenterAndTooClose(c.stars, false, 16);
            c.stars = filteredConstellation;
            const desiredStarCount = 4.0 + 3.0 * Math.random();
            while (c.stars.length < desiredStarCount && i != 0) {
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
{ id: 2, maj: 'Β', min: 'β', name: 'beta' },
{ id: 3, maj: 'Γ', min: 'γ', name: 'gamma' },
{ id: 4, maj: 'Δ', min: 'δ', name: 'delta' },
{ id: 5, maj: 'Ε', min: 'ε', name: 'epsilon' },
{ id: 6, maj: 'Ζ', min: 'ζ', name: 'zeta' },
{ id: 7, maj: 'Η', min: 'η', name: 'eta' },
{ id: 8, maj: 'Θ', min: 'θ', name: 'theta' },
{ id: 9, maj: 'Ι', min: 'ι', name: 'iota' },
{ id: 10, maj: 'Κ', min: 'κ', name: 'kappa' },
{ id: 11, maj: 'Λ', min: 'λ', name: 'lambda' },
{ id: 12, maj: 'Μ', min: 'μ', name: 'mu' },
{ id: 13, maj: 'Ν', min: 'ν', name: 'nu' },
{ id: 14, maj: 'Ξ', min: 'ξ', name: 'xi' },
{ id: 15, maj: 'Ο', min: 'ο', name: 'omicron' },
{ id: 16, maj: 'Π', min: 'π', name: 'pi' },
{ id: 17, maj: 'Ρ', min: 'ρ', name: 'rho' },
{ id: 18, maj: 'Σ', min: 'σ', name: 'sigma' },
{ id: 19, maj: 'Τ', min: 'τ', name: 'tau' },
{ id: 20, maj: 'Υ', min: 'υ', name: 'upsilon' },
{ id: 21, maj: 'Φ', min: 'ϕ', name: 'phi' },
{ id: 22, maj: 'Χ', min: 'χ', name: 'chi' },
{ id: 23, maj: 'Ψ', min: 'ψ', name: 'psi' },
{ id: 24, maj: 'Ω', min: 'ω', name: 'omega' },
        ];
        const properName = [
{ id: 1, name: 'Acamar' },
{ id: 2, name: 'Achernar' },
{ id: 3, name: 'Acrux' },
{ id: 4, name: 'Acubens' },
{ id: 5, name: 'Adhara' },
{ id: 6, name: 'Al Kaprah' },
{ id: 7, name: 'Al Nair' },
{ id: 8, name: 'Al Niyat' },
{ id: 9, name: 'Al Suhail' },
{ id: 10, name: 'Albaldah' },
{ id: 11, name: 'Albireo' },
{ id: 12, name: 'Alchiba' },
{ id: 13, name: 'Alcor' },
{ id: 14, name: 'Alcyone' },
{ id: 15, name: 'Aldebaran' },
{ id: 16, name: 'Alderamin' },
{ id: 17, name: 'Aldhafera' },
{ id: 18, name: 'Alfirk' },
{ id: 19, name: 'Algedi' },
{ id: 20, name: 'Algenib' },
{ id: 21, name: 'Algieba' },
{ id: 22, name: 'Algiebba' },
{ id: 23, name: 'Algol' },
{ id: 24, name: 'Algorab' },
{ id: 25, name: 'Alhena' },
{ id: 26, name: 'Alioth' },
{ id: 27, name: 'Alkaid' },
{ id: 28, name: 'Alkalurops' },
{ id: 29, name: 'Almaaz' },
{ id: 30, name: 'Almach' },
{ id: 31, name: 'Alnasl' },
{ id: 32, name: 'Alnilam' },
{ id: 33, name: 'Alnitak' },
{ id: 34, name: 'Alphard' },
{ id: 35, name: 'Alphecca' },
{ id: 36, name: 'Alpheratz' },
{ id: 37, name: 'Alrakis' },
{ id: 38, name: 'Alrescha' },
{ id: 39, name: 'Alshain' },
{ id: 40, name: 'Altair' },
{ id: 41, name: 'Altais' },
{ id: 42, name: 'Altarf' },
{ id: 43, name: 'Alterf' },
{ id: 44, name: 'Althalimain' },
{ id: 45, name: 'Aludra' },
{ id: 46, name: 'Alula' },
{ id: 47, name: 'Alzirr' },
{ id: 48, name: 'Ancha' },
{ id: 49, name: 'Ankaa' },
{ id: 50, name: 'Antares' },
{ id: 51, name: 'Arcturus' },
{ id: 52, name: 'Arkab' },
{ id: 53, name: 'Arneb' },
{ id: 54, name: 'Ascella' },
{ id: 55, name: 'Asmidiske' },
{ id: 56, name: 'Aspidiske' },
{ id: 57, name: 'Atik' },
{ id: 58, name: 'Atlas' },
{ id: 59, name: 'Atria' },
{ id: 60, name: 'Auva' },
{ id: 61, name: 'Avior' },
{ id: 62, name: 'Azha' },
{ id: 63, name: 'Baham' },
{ id: 64, name: 'Baten Kaitos' },
{ id: 65, name: 'Beid' },
{ id: 66, name: 'Bellatrix' },
{ id: 67, name: 'Betelgeuse' },
{ id: 68, name: 'Botein' },
{ id: 69, name: 'Canopus' },
{ id: 70, name: 'Capella' },
{ id: 71, name: 'Caph' },
{ id: 72, name: 'Castor' },
{ id: 73, name: 'Cebalrai' },
{ id: 74, name: 'Celaeno' },
{ id: 75, name: 'Chara' },
{ id: 76, name: 'Chertan' },
{ id: 77, name: 'Cor Caroli' },
{ id: 78, name: 'Cursa' },
{ id: 79, name: 'Dabih' },
{ id: 80, name: 'Deneb' },
{ id: 81, name: 'Denebola' },
{ id: 82, name: 'Diadem' },
{ id: 83, name: 'Dschubba' },
{ id: 84, name: 'Dubhe' },
{ id: 85, name: 'Edasich' },
{ id: 86, name: 'Electra' },
{ id: 87, name: 'Elnath' },
{ id: 88, name: 'Eltanin' },
{ id: 89, name: 'Enif' },
{ id: 90, name: 'Er Rai' },
{ id: 91, name: 'Erakis' },
{ id: 92, name: 'Fomalhaut' },
{ id: 93, name: 'Furud' },
{ id: 94, name: 'Gacrux' },
{ id: 95, name: 'Giausar' },
{ id: 96, name: 'Gienah' },
{ id: 97, name: 'Girtab' },
{ id: 98, name: 'Gomeisa' },
{ id: 99, name: 'Graffias' },
{ id: 100, name: 'Grumium' },
{ id: 101, name: 'Hadar' },
{ id: 102, name: 'Hamal' },
{ id: 103, name: 'Han' },
{ id: 104, name: 'Hassaleh' },
{ id: 105, name: 'Heze' },
{ id: 106, name: 'Homam' },
{ id: 107, name: 'Izar' },
{ id: 108, name: 'Jabbah' },
{ id: 109, name: 'Kaffalijidhma' },
{ id: 110, name: 'Keid' },
{ id: 111, name: 'Kitalpha' },
{ id: 112, name: 'Kochab' },
{ id: 113, name: 'Kornephoros' },
{ id: 114, name: 'Kraz' },
{ id: 115, name: 'Kurhah' },
{ id: 116, name: 'Lesath' },
{ id: 117, name: 'Maia' },
{ id: 118, name: 'Marfik' },
{ id: 119, name: 'Markab' },
{ id: 120, name: 'Matar' },
{ id: 121, name: 'Mebsuta' },
{ id: 122, name: 'Megrez' },
{ id: 123, name: 'Meissa' },
{ id: 124, name: 'Mekbuda' },
{ id: 125, name: 'Menkalinan' },
{ id: 126, name: 'Menkar' },
{ id: 127, name: 'Menkent' },
{ id: 128, name: 'Menkib' },
{ id: 129, name: 'Merak' },
{ id: 130, name: 'Merope' },
{ id: 131, name: 'Mesarthim' },
{ id: 132, name: 'Miaplacidus' },
{ id: 133, name: 'Mimosa' },
{ id: 134, name: 'Minkar' },
{ id: 135, name: 'Mintaka' },
{ id: 136, name: 'Mira' },
{ id: 137, name: 'Mirach' },
{ id: 138, name: 'Mirfak' },
{ id: 139, name: 'Mirzam' },
{ id: 140, name: 'Mizar' },
{ id: 141, name: 'Muliphein' },
{ id: 142, name: 'Muphrid' },
{ id: 143, name: 'Muscida' },
{ id: 144, name: 'Nair al Saif' },
{ id: 145, name: 'Naos' },
{ id: 146, name: 'Nashira' },
{ id: 147, name: 'Nekkar' },
{ id: 148, name: 'Nihal' },
{ id: 149, name: 'Nodus' },
{ id: 150, name: 'Nunki' },
{ id: 151, name: 'Nusakan' },
{ id: 152, name: 'Ophiuchus' },
{ id: 153, name: 'Phaet' },
{ id: 154, name: 'Phecda' },
{ id: 155, name: 'Pherkad' },
{ id: 156, name: 'Pleione' },
{ id: 157, name: 'Polaris' },
{ id: 158, name: 'Pollux' },
{ id: 159, name: 'Porrima' },
{ id: 160, name: 'Procyon' },
{ id: 161, name: 'Propus' },
{ id: 162, name: 'Rasalas' },
{ id: 163, name: 'Rasalgethi' },
{ id: 164, name: 'Rasalhague' },
{ id: 165, name: 'Rasalmothallah' },
{ id: 166, name: 'Regulus' },
{ id: 167, name: 'Rigel' },
{ id: 168, name: 'Rotanev' },
{ id: 169, name: 'Ruchbah' },
{ id: 170, name: 'Rukbat' },
{ id: 171, name: 'Sabik' },
{ id: 172, name: 'Sadachbia' },
{ id: 173, name: 'Sadr' },
{ id: 174, name: 'Saiph' },
{ id: 175, name: 'Sargas' },
{ id: 176, name: 'Sarin' },
{ id: 177, name: 'Scheat' },
{ id: 178, name: 'Schedar' },
{ id: 179, name: 'Segin' },
{ id: 180, name: 'Seginus' },
{ id: 181, name: 'Shaula' },
{ id: 182, name: 'Sheliak' },
{ id: 183, name: 'Sheratan' },
{ id: 184, name: 'Sirius' },
{ id: 185, name: 'Skat' },
{ id: 186, name: 'Spica' },
{ id: 187, name: 'Sterope' },
{ id: 188, name: 'Sualocin' },
{ id: 189, name: 'Suhail al Muhlif' },
{ id: 190, name: 'Sulafat' },
{ id: 191, name: 'Syrma' },
{ id: 192, name: 'Talitha' },
{ id: 193, name: 'Tarazed' },
{ id: 194, name: 'Taygeta' },
{ id: 195, name: 'Tegmine' },
{ id: 196, name: 'Thuban' },
{ id: 197, name: 'Unukalhai' },
{ id: 198, name: 'Vega' },
{ id: 199, name: 'Vindemiatrix' },
{ id: 200, name: 'Wasat' },
{ id: 201, name: 'Wazn' },
{ id: 202, name: 'Wei' },
{ id: 203, name: 'Wesen' },
{ id: 204, name: 'Zaniah' },
{ id: 205, name: 'Zaurak' },
{ id: 206, name: 'Zavijava' },
{ id: 207, name: 'Zosma' },
{ id: 208, name: 'Zubenelakrab' },
{ id: 209, name: 'Zubenelgenubi' },
{ id: 210, name: 'Zubeneschamali' },
        ];

        constellationReference.forEach(function (c) {
            c.rng = Math.random();
        }, this);
        constellationReference.sort(function (a, b) {
            return a.rng - b.rng;
        });
        properName.forEach(function (c) {
            c.rng = Math.random();
        }, this);
        properName.sort(function (a, b) {
            return a.rng - b.rng;
        });
        this.stars = [];
        this.constellations.forEach(function (c, i) {
            c.reference = constellationReference[i];
            c.loreStarCount = Math.random() * Math.random() * 1000.0;
            c.computeEdges();
            c.kruskal();
            c.stars.forEach(function (star, starIdx) {
                star.group = Math.random();
                star.generate((starIdx === 0) && (i === 1));
                this.stars.push(star);
            }, this);
            const sortedStars = c.stars.slice()
            sortedStars.sort(function (a, b) {
                return a.group - b.group;
            });
            sortedStars.forEach(function (star, j) {
                star.greekLetter = greekLetters[j];
                //star.constellation = c; // circular structure prevents JSON.stringify :(
            }, this);
            c.render(false);
            //document.getElementById('debug').innerHTML += '' + i + '/' + JSON.stringify(c.stars.length) + '/' /*+ JSON.stringify(c.stars)*/ + '<br/>';
        }, this);
        this.stars.forEach(function (star, i) {
            star.properName = properName[i];
        }, this);
        //document.getElementById('debug').innerHTML +=
        //    '' + 'stars' + '/'
        //    + JSON.stringify(this.stars.length) + '/'
        //    + JSON.stringify(this.stars.filter(function (star) { return star.keep; }).length) + '/'
        //    + JSON.stringify(this.stars) + '<br/>';
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

    getStarById: function (id) {
        const ret = this.stars.filter(function (star) {
            return star.id === id;
        });
        return ret[0];
    },
};

