# age-of-space

The purpose of this game is about age of space of humanity.
Some AI predicate the end of humanity if humanity stays on planet Earth.
Player must explore other solar systems to find new planet to inhabit.

Aim of the player is to reach a population of 1000 billions of humans to ensure the longevity of humanity.

## Game Mechanism

Game is around three majors mechanisms:

- Explore solar systems to find new planets to colonize
- Manage a planet to terraform, and make grow your population
- Manage exchange of ressources from planet to planet, to help planet to grow

## Explore solar systems

Player have a galaxy map, with several solar systems. This galaxy will be procedurally generate.

Player have two visions at this point:
* He can see the whole galaxy as a hundred lighting point. Each point are a solar systems
* He can zoom over a solar system to see the planets of the system (number of planet, alignment)

Player can choose to send a ship over a solar system to scan the different planet, to obtain information about it.

Player can determine if a planet can be inhabit or not, and the cost (ressources & time) to terraform it.
Information about terraformation are about similarity with Earth, toxicity, percentage of land,...

Player can obtain as information, availibility of ressources (iron, copper, water, ....).

Travel and study of a planet take an amount of time, depending of distance, planet size.

## Build and send a colonization ship

Player will build a colonization ship. It will choose the composition of the ship.
The ship will have X slots. Each slot can be occupy with:

- 100 000 colons
- a facility


Player can choose the best facilities to fit the best beginning depending of the nature of the planet.

## Manage your planet

First step of your colonization is the landing of a colon'ship.
It will deploy first habitation, firt facility.

### Healthing indicator

An indicator will be calculate automatically using different parameter.
If the indicator is negative, the population will decrease.
If the indicator is positive, the population will increase.

Indicator will take in account :

- quality of air
- available lands remaining
- ressources availibility
- ....

### Viability constraints

Constraints are about:

- Atmosphere's composition : more or less breathable to toxic air
- Ground's composition : possibility to plent seed, to make food
- availability of land

#### Atmosphere

The planets can have different type of atmosphere.
Depending of atmosphere, it is possible or not to transform to a pure breathable air.

If the air becomes breathable, all Earth's facilities can be build, and let the population growing to his maximum potential.

If the air remains toxic because too much changement to make, player must build specific building. Generally, player will inhabit such planet to mine some specific ressources, not to create a planet with a maximum of population.

#### Ground

Ground composition is about the capacity to make grow plants


### Clues about management

Player can investigate through population survey what happens to its population:
* Missing ressources
* Missing space
* Missing facilities (entertainment)


## Manage exchange
