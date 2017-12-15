var aos = aos || {};

aos.population =
[
    //{
    //    "name": "bacteria",
    //    "population": 1000,
    //    "food": [{ "name": "oxocarbon", "quantity": 500, "planetResource": true }],
    //    "yield": [{ "name": "oxygen", "quantity": 1000, "to": "planet" }],
    //    "survival": [{ "name": "fresh water", "quantity": 300, "planetResource": true }],
    //    "growth": [{ "name": "luminosity", "quantity": 70, "planetResource": true }]
    //},
    {
        "name": "bacteria",
        "environment": [
            { "group": "water", "minQuantity": 10000 },
            { "resource": "toxic waste", "maxPercent": 10 }],
        "isPhotosynthetic": true,
        "food": [
            { "resource": "oxocarbon", "ratio": 0.99, "limit": 0.9 },
            { "resource": "toxic waste", "ratio": 0.01, "limit": 0.1 }],
        "yield": [
            { "resource": "oxygen", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1.03 }],
        "growthFactor2": [
            { "attribute": "irradiance" },
            { "constant": 0.01 }],
        "habitatSize1": [
            { "group": "water" },
            { "constant": 0.1 }],
        "habitatSize2": [
            { "attribute": "oceanTilesCount" },
            { "constant": 10000 }],
        "habitatSize3": [
            { "attribute": "incubatorCount" },
            { "constant": 100000 }],
    }
];