var aos = aos || {};

aos.buildings = [
    {
        "type": "mine",
        "name": "Metal mine",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "type": "metal",
            "product": [
                {
                    "name": "metal",
                    "quantity": 1000,
                    "to": "storage"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 100,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "metal",
                    "quantity": 1000,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "mine",
        "name": "Fissile Material mine",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "type": "material",
            "product": [
                {
                    "name": "fissile material",
                    "quantity": 1000,
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "fissile material",
                    "quantity": 50,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "Factory",
        "name": "Bacteria factory",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "type": "material",
            "product": [
                {
                    "name": "bacteria",
                    "quantity": 1000,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "water",
                    "quantity": 1000,
                    "planetResource": true
                },
                {
                    "name": "mineral",
                    "quantity": 1000,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "water" }]
    }
    ,
    {
        "type": "habitation",
        "name": "House",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "type": "population",
            "product": [
                {
                    "name": "humans",
                    "quantity": 100,
                    "to": "planet"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 500,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                    ,
                    "remove": true
                },
                {
                    "name": "metal",
                    "quantity": 100,
                    "planetResource": true,
                    "remove": true
                }
            ],
            "conditions": [
                {
                    "name": "oxygen",
                    "percent": 70,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "habitation",
        "name": "Floating house",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "type": "population",
            "product": [
                {
                    "name": "humans",
                    "quantity": 50,
                    "to": "planet"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 300,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 200,
                    "planetResource": true,
                    "remove": true
                },
                {
                    "name": "metal",
                    "quantity": 100,
                    "planetResource": true,
                    "remove": true
                }
            ],
            "conditions": [
                {
                    "name": "oxygen",
                    "percent": 70,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "water" }]
    },
    {
        "type": "plant",
        "name": "Solar plant",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "type": "energy",
            "product": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "to": "planet"
                }
            ]
        },
        "location": [
            { "name": "ground" },
            { "name": "water" }
        ]
    },
    {
        "type": "plant",
        "name": "Nuclear plant",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 500
            }
        ],
        "produce": {
            "type": "energy",
            "product": [
                {
                    "name": "energy",
                    "quantity": 200,
                    "to" : "planet"
                }
            ],
            "require": [
                {
                    "name": "fissile material",
                    "quantity": "300"
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "epurateur",
        "name": "CO2 epuration",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 50
            }
        ],
        "produce": {
            "type": "air",
            "product": [
                {
                    "name": "oxygen",
                    "quantity": 300,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "oxocarbon",
                    "quantity": 50,
                    "planetResource": true
                }
            ]
        },
        "location": [
            { "name": "ground" },
            { "name": "water" }
        ]
    },
    {
        "type": "farm",
        "name": "Crops farm",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 50
            }
        ],
        "produce": {
            "type": "air",
            "product": [
                {
                    "name": "plants",
                    "quantity": 100,
                    "to": "planet"
                },
                {
                    "name": "oxygen",
                    "quantity": 300,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "oxocarbon",
                    "quantity": 10,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    }
];
