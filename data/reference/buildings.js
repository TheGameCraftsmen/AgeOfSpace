var aos = aos || {};

aos.buildings = [
        {
            "type" : "mine",
            "name" : "metal Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "metal",
                "product" : [{"name":"metal","quantity" : 1000,"to" : "storage"},
                             {"name":"oxocarbon","quantity" : 100,"to" : "storage"}],
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "metal", "quantity" : 1000, "planetRessource" : true}
                ]
            },
            "storage" : 10000,
            "location" : [{"name":"ground"}]
        },
        {
            "type" : "mine",
            "name" : "coal Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "material",
                "product" : [{"name": "carbon","quantity" : 1000,"to" : "storage"},
                            {"name": "oxocarbon","quantity" : 1000,"to" : "planet"}],
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "carbon", "quantity" : 500, "planetRessource" : true}
                ]
            },
            "storage" : 10000,
            "location" : [{"name":"ground"}]
        },
        {
            "type" : "mine",
            "name" : "oil Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "material",
                "product" : [{"name":"oil","quantity" : 1000,"to" : "storage"}],
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "oil", "quantity" : 500, "planetRessource" : true}
                ]
            },
            "storage" : 10000,
            "location" : [{"name":"water"}]
        },
        {
            "type" : "mine",
            "name" : "fissile material Mine",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 500
                    }
                ]
            },
            "produce" : {
                "type" : "material",
                "product" : [{"name" : "fissile material","quantity" : 1000,"to" : "storage"}],
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                    {"name" : "fissile material", "quantity" : 50, "planetRessource" : true}
                ]
            },
            "storage" : 10000,
            "location" : [{"name":"ground"}]
        },
        {
            "type" : "habitation",
            "name" : "house",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "population",
                "product" : [{"name" : "humans","quantity" : 100,"to" : "storage"},
                            {"name":"oxocarbon","quantity" : 500,"to" : "planet"}],
                "require" : [
                    {"name" : "energy", "quantity" : 50, "planetRessource" : false, "remove" : true},
                    {"name" : "metal", "quantity" : 100, "planetRessource" : true , "remove" : true}
                ],
                "conditions" : [
                    {"name" : "oxygen", "percent" : 70, "planetRessource" : true}
                ]
            },
            "storage" : 10000,
            "location" : [{"name":"ground"}]
        },
        {
            "type" : "habitation",
            "name" : "floating house",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 500
                    }
                ]
            },
            "produce" : {
                "type" : "population",
                "product" : [{"name":"humans","quantity" : 50,"to" : "storage"},
                             {"name":"oxocarbon","quantity" : 300,"to" : "storage"}],
                "require" : [
                    {"name" : "energy", "quantity" : 200, "planetRessource" : false, "remove" : true},
                    {"name" : "metal", "quantity" : 100, "planetRessource" : true , "remove" : true}
                ],
                "conditions" : [
                    {"name" : "oxygen", "percent" : 70, "planetRessource" : true}
                ]
            },
            "storage" : 10000,
            "location" : [{"name":"water"}]
        },
        {
            "type" : "plant",
            "name" : "solar plant",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 100
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : [{"name":"energy","quantity" : 50}]
            },
            "storage" : 10000,
            "location" : [{"name":"ground"},{"name":"water"}]
        },
        {
            "type" : "plant",
            "name" : "coal plant",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 300
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : [{"name":"energy","quantity" : 100}],
                "require" : [
                    { "name" : "carbon", "quantity" : "500"}
                ]
            },
            "storage" : 10000,
            "location" :[{"name":"ground"}]
        },
        {
            "type" : "plant",
            "name" : "oil plant",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 500
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : [{"name" : "energy","quantity" : 100},
                            {"name":"oxocarbon","quantity" : 500,"to" : "storage"}],
                "require" : [
                    { "name" : "oil", "quantity" : "400"}
                ]
            },
            "storage" : 10000,
            "location" :[{"name":"ground"}]
        },
        {
            "type" : "plant",
            "name" : "nuclear plant",
            "require" : {
                "space" : 10,
                "materials" : [
                    {
                        "name" :"metal",
                        "quantity" : 500
                    }
                ]
            },
            "produce" : {
                "type" : "energy",
                "product" : [{"name":"energy","quantity" : 200}],
                "require" : [
                    { "name" : "fissile material", "quantity" : "300"}
                ]
            },
            "storage" : 10000,
            "location" :[{"name":"ground"}]
        },
        {
            "type" : "epurateur",
            "name" : "CO2 epuration",
            "require" : {
                "space" :10,
                "materials":[{"name" : "metal","quantity":50}]
            },
            "produce" : {
                "type" : "air",
                "product" : [{"name":"oxygen","quantity" : 300,"to" : "planet"}],
                "require" : [
                                {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                                {"name" : "oxocarbon", "quantity" : 50, "planetRessource" : true}
                            ]
            },
            "location" :[{"name":"ground"},{"name":"water"}]
        },
        {
            "type" : "farm",
            "name" : "crops farm",
            "require" : {
                "space" :10,
                "materials":[{"name" : "metal","quantity":50}]
            },
            "produce" : {
                "type" : "air",
                "product" : [{"name":"plants","quantity" : 100,"to" : "planet"},
                            {"name":"oxygen","quantity" : 300,"to" : "planet"}],
                "require" : [
                                {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                                {"name" : "oxocarbon", "quantity" : 10, "planetRessource" : true}
                            ]
            },
            "location" :[{"name":"ground"}]
        },
        {
            "type" : "epurateur",
            "name" : "inert gaz epuration",
            "require" : {
                "space" :10,
                "materials":[{"name" : "metal","quantity":50}]
            },
            "produce" : {
                "type" : "air",
                "product" : [{"name":"oxygen","quantity" : 100,"to" : "planet"}],
                "require" : [
                                {"name" : "energy", "quantity" : 50, "planetRessource" : false},
                                {"name" : "inert gases", "quantity" : 50, "planetRessource" : true},
                                {"name" : "fissile material", "quantity" : 50, "planetRessource" : false}
                            ]
            },
            "location" :[{"name":"water"}]
        }
    ]
;
