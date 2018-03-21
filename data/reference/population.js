var aos = aos || {};

aos.populations =
{
    "Bacteria": {
        "spontaneousBirth": true,
        "environment": [
            { "group": "Water", "minQuantity": 10000 },
            { "resource": "Toxic waste", "maxPercent": 0.1 }],
        "naturalDecay": 0.999,
        "hostileDecay": 0.900,
        "foodIntake": 0.001,
        "food": [
            { "resource": "Oxocarbon", "ratio": 0.99, "limit": 0.9 },
            { "resource": "Toxic waste", "ratio": 0.01, "limit": 0.1 }],
        "yield": [
            { "resource": "Oxygen", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1.01 }],
        "growthFactor2": [
            { "attribute": "irradiance" },
            { "constant": 0.001 }],
        "habitatSize1": [
            { "group": "Water" },
            { "constant": 0.01 }],
        "habitatSize2": [
            { "attribute": "emptyOceanTilesCount" },
            { "constant": 10000 }],
        "habitatSize3": [
            { "attribute": "buildingCount", "buildingName": "Incubator" },
            { "constant": 100000 }],
        "habitatSize4": [],
    },
    "Plants": {
        "spontaneousBirth": false,
        "environment": [
            { "group": "Water", "minQuantity": 10000 },
            { "resource": "Oxygen", "minQuantity": 1000 },
            { "resource": "Mineral", "minPercent": 0.5 },
            { "resource": "Toxic waste", "maxPercent": 0.1 },
            { "resource": "Acid cloud", "maxPercent": 0.1 },
            { "resource": "Ground pollution", "maxPercent": 0.1 }],
        "naturalDecay": 0.999,
        "hostileDecay": 0.900,
        "foodIntake": 0.001,
        "food": [
            { "resource": "Oxocarbon", "ratio": 0.99, "limit": 0.9 },
            { "resource": "Toxic waste", "ratio": 0.01, "limit": 0.1 }],
        "yield": [
            { "resource": "Oxygen", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1.005 }],
        "growthFactor2": [
            { "attribute": "irradiance" },
            { "constant": 0.001 }],
        "habitatSize1": [
            { "group": "Water" },
            { "constant": 0.005 }],
        "habitatSize2": [
            { "resource": "Mineral" },
            { "constant": 0.005 }],
        "habitatSize3": [
            { "attribute": "emptyTilesCount" },
            { "constant": 5000 }],
        "habitatSize4": [
            { "attribute": "buildingCount", "buildingName": "Greenhouse" },
            { "constant": 25000 }],
    },
    "Animals": {
        "spontaneousBirth": false,
        "environment": [
            { "group": "Water", "minQuantity": 10000 },
            { "resource": "Oxygen", "minQuantity": 1000 },
            { "resource": "Toxic waste", "maxPercent": 0.1 },
            { "resource": "Acid cloud", "maxPercent": 0.1 },
            { "resource": "Ground pollution", "maxPercent": 0.1 }],
        "naturalDecay": 0.999,
        "hostileDecay": 0.900,
        "foodIntake": 0.001,
        "food": [
            { "population": "Plants", "ratio": 0.45, "limit": 0.1 },
            { "population": "Animals", "ratio": 0.05, "limit": 0.1 },
            { "resource": "Oxygen", "ratio": 0.50, "limit": 0.1 }],
        "yield": [
            { "resource": "Oxocarbon", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1 }],
        "growthFactor2": [
            { "attribute": "availableFoodRatio" },
            { "constant": 0.04 }],
        "habitatSize1": [
            { "group": "Water" },
            { "constant": 0.005 }],
        "habitatSize2": [],
        "habitatSize3": [
            { "attribute": "emptyTilesCount" },
            { "constant": 5000 }],
        "habitatSize4": [
            { "attribute": "buildingCount", "buildingName": "Greenhouse" },
            { "constant": 25000 }],
    },
    "Humans": {
        "spontaneousBirth": false,
        "environment": [
            { "group": "Water", "minQuantity": 10000 },
            { "resource": "Oxygen", "minQuantity": 20000 },
            { "resource": "Toxic waste", "maxPercent": 0.1 },
            { "resource": "Acid cloud", "maxPercent": 0.1 },
            { "resource": "Ground pollution", "maxPercent": 0.1 }],
        "naturalDecay": 0.999,
        "hostileDecay": 0.900,
        "foodIntake": 0.001,
        "food": [
            { "population": "Plants", "ratio": 0.30, "limit": 0.1 },
            { "population": "Animals", "ratio": 0.20, "limit": 0.1 },
            { "resource": "Oxygen", "ratio": 0.50, "limit": 0.1 }],
        "yield": [
            { "resource": "Oxocarbon", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1 }],
        "growthFactor2": [
            { "attribute": "availableFoodRatio" },
            { "constant": 0.03 }],
        "habitatSize1": [],
        "habitatSize2": [],
        "habitatSize3": [
            { "attribute": "emptyLandTilesCount" },
            { "constant": 10000 }],
        "habitatSize4": [
            { "attribute": "buildingCount", "buildingName": "Geodesic Dome" },
            { "constant": 100000 }],
    },
    "Machines": {
        "spontaneousBirth": false,
        "environment": [
            { "resource": "Metal", "minQuantity": 20000 }],
        "naturalDecay": 0.999,
        "hostileDecay": 0.900,
        "foodIntake": 0.001,
        "food": [
            { "resource": "Metal", "ratio": 1, "limit": 0.1 }],
        "yield": [
            { "resource": "Ground pollution", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1.01 }],
        "growthFactor2": [
            { "attribute": "availableFoodRatio" },
            { "constant": 0.0 }],
        "habitatSize1": [],
        "habitatSize2": [],
        "habitatSize3": [
            { "constant": 10000 }],
        "habitatSize4": [
            { "attribute": "buildingCount", "buildingName": "Motherboard" },
            { "constant": 100000 }],
    },
    "Viruses": {
        "spontaneousBirth": true,
        "environment": [],
        "naturalDecay": 0.998,
        "hostileDecay": 0.900,
        "foodIntake": 0.002,
        "food": [
            { "resource": "Acid cloud", "ratio": 0.40, "limit": 0.1 },
            { "resource": "Toxic waste", "ratio": 0.30, "limit": 0.1 },
            { "resource": "Ground pollution", "ratio": 0.30, "limit": 0.1 }],
        "yield": [
            { "resource": "Acid cloud", "ratio": 1 }],
        "growthFactor1": [
            { "constant": 1 }],
        "growthFactor2": [
            { "attribute": "availableFoodRatio" },
            { "constant": 0.004 }],
        "habitatSize1": [
            { "constant": 300000 }],
        "habitatSize2": [],
        "habitatSize3": [],
        "habitatSize4": [],
    }
};