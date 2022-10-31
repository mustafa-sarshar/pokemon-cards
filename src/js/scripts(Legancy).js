const pokemonContainerEl = document.querySelector(".pokemon-container");
let pokemonWebAddress = "https://pokedex.org/"  // Example (ID=1): https://pokedex.org/#/pokemon/1

let lstPokemon = [
    {
        pokemonID: 1,
        pokemonName: "Bulbasaur",
        pokemonHeight: 0.7,
        pokemonWeight: 6.9,
        pokemonTypes: ["Grass", "Poison"],
        pokemonAbilities: ["Chlorophyll", "Overgrow"]
    },
    {
        pokemonID: 10,
        pokemonName: "Caterpie",
        pokemonHeight: 0.3,
        pokemonWeight: 2.9,
        pokemonTypes: ["Bug"],
        pokemonAbilities: ["Shield-dust", "Run-away"]
    },
    {
        pokemonID: 19,
        pokemonName: "Rattata",
        pokemonHeight: 0.3,
        pokemonWeight: 3.5,
        pokemonTypes: ["Normal"],
        pokemonAbilities: ["Run-away", "Hustle", "Guts"]
    },
    {
        pokemonID: 28,
        pokemonName: "Sandslash",
        pokemonHeight: 1,
        pokemonWeight: 29.5,
        pokemonTypes: ["Ground"],
        pokemonAbilities: ["Sand-veil", "Sand-rush"]
    },
    {
        pokemonID: 37,
        pokemonName: "Vulpix",
        pokemonHeight: 0.6,
        pokemonWeight: 9.9,
        pokemonTypes: ["Fire"],
        pokemonAbilities: ["Flash-fire", "Drought"]
    },
    {
        pokemonID: 46,
        pokemonName: "Paras",
        pokemonHeight: 0.3,
        pokemonWeight: 5.4,
        pokemonTypes: ["Grass", "Bug"],
        pokemonAbilities: ["Damp", "Effect-spore", "Dry-skin"]
    },
    {
        pokemonID: 55,
        pokemonName: "Golduck",
        pokemonHeight: 1.7,
        pokemonWeight: 76.6,
        pokemonTypes: ["Water"],
        pokemonAbilities: ["Damp", "Cloud-nine", "Swift-swim"]
    },
    {
        pokemonID: 64,
        pokemonName: "Kadabra",
        pokemonHeight: 1.3,
        pokemonWeight: 56.5,
        pokemonTypes: ["Psychic"],
        pokemonAbilities: ["Damp", "Cloud-nine", "Swift-swim"]
    }
];

/*
function printPokemon(inputListPokemon) {
    inputListPokemon.forEach(pokemon => {
        document.write(
            `<i>Name:</i> <b>${pokemon.pokemonName}</b>, <i>Height:</i> <b>${pokemon.pokemonHeight}</b> m, <i>Weight:</i> <b>${pokemon.pokemonWeight}</b> kg, <i>Types:</i> <b>${pokemon.pokemonTypes}</b>, <i>Abilities:</i> <b>${pokemon.pokemonAbilities}</b> <sub><a href="https://pokedex.org/#/pokemon/${pokemon.pokemonID}" target="_blank" rel="noopener noreferrer">more info</a></sub><br>`
        );
    });
}
*/
/*
function printPokemonUsingForLoop(inputListPokemon) {
    
    for (let i = 0; i < inputListPokemon.length; i++) {
        let pokemonSizeFeedback = "";
        if (inputListPokemon[i].pokemonHeight > 1.5) {
            pokemonSizeFeedback = "Wow! That's BIG";
        }
        
        pokemonContainerEl.innerHTML += `
            <div class="pokemon-item">
                <div class="pokemon-item__title">
                    ${inputListPokemon[i].pokemonName}
                </div>
                <div class="pokemon-item__info">
                    <i>Height:</i> <b>${inputListPokemon[i].pokemonHeight}</b> m<br>
                    <i>Weight:</i> <b>${inputListPokemon[i].pokemonWeight}</b> kg<br>
                    <i>Types:</i> <b>${inputListPokemon[i].pokemonTypes}</b><br>
                    <i>Abilities:</i> <b>${inputListPokemon[i].pokemonAbilities}</b><br>
                </div>
                <div class="pokemon-item__size-feedback">
                    ${pokemonSizeFeedback}
                </div>
                <div class="pokemon-item__link">
                    <a href="https://pokedex.org/#/pokemon/${inputListPokemon[i].pokemonID}" target="_blank" rel="noopener noreferrer" class="pokemon-item__link-item">more info</a>
                </div>
            </div>
        `;
    }
}
*/
function printPokemonUsingForLoop(inputListPokemon) {
    
    document.write("<ul class='pokemon-list'>");
    for (let i = 0; i < inputListPokemon.length; i++) {
        let pokemonSizeFeedback = "";
        if (inputListPokemon[i].pokemonHeight > 1.5) {
            pokemonSizeFeedback = "Wow! That's BIG";
        }
        document.write(
            `
            <li class='pokemon-list-item'>
                <span class='pokemon-list-item__name'><b>${inputListPokemon[i].pokemonName}</b></span><br>
                <i>Height:</i> <b>${inputListPokemon[i].pokemonHeight}</b> m<br>
                <i>Weight:</i> <b>${inputListPokemon[i].pokemonWeight}</b> kg<br>
                <i>Types:</i> <b>${inputListPokemon[i].pokemonTypes}</b><br>
                <i>Abilities:</i> <b>${inputListPokemon[i].pokemonAbilities}</b><br>
                
            `
        );
        if (pokemonSizeFeedback) {
            document.write(
                `
                <span class='pokemon-list-item__size-feedback'>
                    <b>${pokemonSizeFeedback}</b>
                </span><br>
                `
            );
        }
        document.write(
            `
            <a href="https://pokedex.org/#/pokemon/${inputListPokemon[i].pokemonID}" target="_blank" rel="noopener noreferrer" class="pokemon-list-item__link">more info</a>
            </li>
            `
        );
    }
    document.write("</ul>");
}

document.onload(
    printPokemonUsingForLoop(lstPokemon)
)
    