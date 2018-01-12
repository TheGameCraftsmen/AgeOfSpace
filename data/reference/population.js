var aos = aos || {};

aos.populations =
{
    "bacteria": {
        "spontaneousBirth": true,
        "environment": [
            { "group": "water", "minQuantity": 10000 },
            { "resource": "toxic waste", "maxPercent": 0.1 }],
        "naturalDecay": 0.999,
        "hostileDecay": 0.900,
        "foodIntake": 0.001,
        "food": [
            { "resource": "oxocarbon", "ratio": 0.99, "limit": 0.9 },
            { "resource": "toxic waste", "ratio": 0.01, "limit": 0.1 }],
        "yield": [
            { "resource": "oxygen", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1.01 }],
        "growthFactor2": [
            { "attribute": "irradiance" },
            { "constant": 0.001 }],
        "habitatSize1": [
            { "group": "water" },
            { "constant": 0.01 }],
        "habitatSize2": [
            { "attribute": "emptyOceanTilesCount" },
            { "constant": 10000 }],
        "habitatSize3": [
            { "attribute": "buildingCount", "buildingName": "Incubator" },
            { "constant": 100000 }],
    }
};