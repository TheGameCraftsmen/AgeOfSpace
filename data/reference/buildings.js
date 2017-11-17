var aos = aos || {};

aos.buildings = [
    {
        "type": "mine",
        "name": "metal Mine",
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
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": false
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
        "name": "coal Mine",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "type": "material",
            "product": [
                {
                    "name": "carbon",
                    "quantity": 1000,
                    "to": "storage"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 1000,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": false
                },
                {
                    "name": "carbon",
                    "quantity": 500,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "mine",
        "name": "oil Mine",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 100
            }
        ],
        "produce": {
            "type": "material",
            "product": [
                {
                    "name": "oil",
                    "quantity": 1000,
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": false
                },
                {
                    "name": "oil",
                    "quantity": 500,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "water" }]
    },
    {
        "type": "mine",
        "name": "fissile material Mine",
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
                    "planetResource": false
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
        "type": "mine",
        "name": "Oxygen Mine",
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
                    "name": "oxygen",
                    "quantity": 1000,
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": false
                },
                {
                    "name": "oxygen",
                    "quantity": 1000,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" },{ "name": "water" }]
    },
    {
        "type": "mine",
        "name": "Salt Mine",
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
                    "name": "salt",
                    "quantity": 1000,
                    "to": "storage"
                },
                {
                    "name": "potable water",
                    "quantity": 1000,
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": false
                },
                {
                    "name": "salt",
                    "quantity": 1000,
                    "planetResource": true
                },
                {
                    "name": "water",
                    "quantity": 1000,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" },{ "name": "water" }]
    },
    {
        "type": "Factory",
        "name": "Bacteria Factory",
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
                    "to": "storage"
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
        "name": "house",
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
                    "to": "storage"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 500,
                    "to": "local"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": false,
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
        "name": "floating house",
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
                    "to": "local"
                },
                {
                    "name": "oxocarbon",
                    "quantity": 300,
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 200,
                    "planetResource": false,
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
        "name": "solar plant",
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
                    "quantity": 50
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
        "name": "coal plant",
        "constructionCost": [
            {
                "name": "metal",
                "quantity": 300
            }
        ],
        "produce": {
            "type": "energy",
            "product": [
                {
                    "name": "energy",
                    "quantity": 100
                }
            ],
            "require": [
                {
                    "name": "carbon",
                    "quantity": "500"
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "plant",
        "name": "oil plant",
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
                    "quantity": 100
                },
                {
                    "name": "oxocarbon",
                    "quantity": 500,
                    "to": "storage"
                }
            ],
            "require": [
                {
                    "name": "oil",
                    "quantity": "400"
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "plant",
        "name": "nuclear plant",
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
                    "quantity": 200
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
                    "planetResource": false
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
        "name": "crops farm",
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
                    "planetResource": false
                },
                {
                    "name": "oxocarbon",
                    "quantity": 10,
                    "planetResource": true
                }
            ]
        },
        "location": [{ "name": "ground" }]
    },
    {
        "type": "epurateur",
        "name": "inert gaz epuration",
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
                    "quantity": 100,
                    "to": "planet"
                }
            ],
            "require": [
                {
                    "name": "energy",
                    "quantity": 50,
                    "planetResource": false
                },
                {
                    "name": "inert gases",
                    "quantity": 50,
                    "planetResource": true
                },
                {
                    "name": "fissile material",
                    "quantity": 50,
                    "planetResource": false
                }
            ]
        },
        "location": [{ "name": "water" }]
    }
];
