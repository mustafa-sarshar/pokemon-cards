"use strict";

const pokemonRepository = (function () {
    // HTML Elements
    const pokemonListEl = $(".pokemon-list");
    const modalContainerEl = $(".modal-container");
    const bsModalEl = $("#bs-modalPokemon");
    const btnSearchPokemonEl = $("#btn-search-pokemon");
    const txtSearchPokemonEl = $("#txt-search-pokemon");
    const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=100";
    // Properties
    const colors = "0123456789abcde";   // without f
    const colorCodeLength = 6;
    const pokemonObjKeys = ["pokemonID", "pokemonName", "detailsUrl"];
    let pokemonList = [];

    $(window).on("keydown", function (event) {
        if (event.code === "Escape" && modalContainerEl.css("display") !== "none")
            hideModalBootstrap();
    })

    bsModalEl.on("hidden.bs.modal", function () {
        hideModalBootstrap();
    })

    btnSearchPokemonEl.on("click", function () {
        const pokemonFound = searchPokemonByName(txtSearchPokemonEl.val().toLowerCase());
        if (pokemonFound)
            showDetails(pokemonFound);
        else
            showDetails();
    })

    txtSearchPokemonEl.on("input", function () {
        const pokemonFound = txtSearchPokemonEl.val().toLowerCase();
        if (pokemonFound)
            liveFilter(pokemonFound);
    })

    function liveFilter(pokemonNameToFilter) {
        console.log(pokemonNameToFilter);
        pokemonListEl.empty();
        pokemonList.forEach(function (pokemon) {
            let pokemonToAdd = pokemon.pokemonName.includes(pokemonNameToFilter);
            if (pokemonToAdd)
                pokemonRepository.addListItem(pokemon);
        });
    }

    function loadList() {
        showLoadingMessage("list data");
        return fetch(apiUrl).then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item, idx) {
                let pokemon = {
                    pokemonID: idx,
                    pokemonName: item.name,
                    detailsUrl: item.url
                };
                addPokemon(pokemon);
            });
            hideLoadingMessage("list data");
        }).catch(function (err) {
            console.error(err);
            hideLoadingMessage("list data", "unsuccessfully");
        });
    }

    function addPokemon(pokemon) {
        if (typeof pokemon === "object") {
            // Check If an The Object Contains All Keys of Pokemon Object
            validatePokemonObject(pokemon, pokemonObjKeys);
            pokemonList.push(pokemon);
        } else
            throw new TypeError("This function accepts only a 'pokemon' object as input!!!");
    }

    function addListItem(pokemon) {
        const pokemonLiEl = $("<li></li>");
        const btnEl = $("<button></button>");
        const pokemonColor = randomColorPicker();
        pokemonLiEl.addClass(["pokemon-list-item", "group-list-item"]);
        if (pokemon.pokemonID % 2 === 0)
            pokemonLiEl.addClass("pokemon-list-item__transform-1");
        else
            pokemonLiEl.addClass("pokemon-list-item__transform-2");
        pokemonLiEl.css("border-color", pokemonColor);
        pokemonLiEl.on("mouseover", function () {
            pokemonLiEl.css("box-shadow", `1px 1px 10px ${pokemonColor}`)
        });
        pokemonLiEl.on("mouseleave", function () {
            pokemonLiEl.css("box-shadow", `1px 1px 10px ${pokemonColor}00`)
        });  // box-shadow-color with 0% opacity

        btnEl.addClass(["pokemon-list-item__btn", "btn"]);
        btnEl.attr("data-toggle", "modal");
        btnEl.text(pokemon.pokemonName);
        btnEl.on("click", function () {
            showDetails(pokemon);
        });

        pokemonLiEl.append(btnEl);
        pokemonListEl.append(pokemonLiEl);
    }

    function loadDetails(item) {
        showLoadingMessage(`pokemon '${item.pokemonName}'`);
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then(function (details) {
            // Now we add the details to the item
            item.imageUrlFrontDefault = details.sprites.front_default;
            item.imageUrlBackDefault = details.sprites.back_default;
            item.pokemonHeight = details.height;
            item.pokemonWeight = details.weight;
            item.pokemonTypes = details.types;
            hideLoadingMessage(`pokemon '${item.pokemonName}'`);
        }).catch(function (err) {
            console.error(err);
            hideLoadingMessage(`pokemon '${item.pokemonName}'`, "unsuccessfully");
        });
    }

    function showDetails(pokemon) {
        if (pokemon) {
            loadDetails(pokemon).then(function () {
                showModalBootstrap(pokemon);
                console.log(pokemon)
            });
        } else {
            showModalBootstrap();
        }
    }

    function showLoadingMessage(msg) {
        console.log(`Loading ${msg} started...`);
    }

    function hideLoadingMessage(msg, status="successfully") {
        console.log(`Loading ${msg} finished ${status}...`);
    }

    function showModalBootstrap(pokemon) {
        const bsModalBodyEl = $(".modal-body");
        const bsModalTitleEl = $(".modal-title");

        if (pokemon) {
            const txtNameEl = $(`<h1 id="bs-modalPokemonLabel"></h1>`);
            txtNameEl.text(pokemon.pokemonName)
            txtNameEl.addClass(["modal-title", "fs-5", "text-uppercase"]);
            const imgFrontEl = $("<img>");
            imgFrontEl.addClass(["modal-img", "modal__icon"]);
            imgFrontEl.attr("src", pokemon.imageUrlFrontDefault);
            const imgBackEl = $("<img>");
            imgBackEl.addClass(["modal-img", "modal__icon"]);
            imgBackEl.attr("src", pokemon.imageUrlBackDefault);

            const lstInfoEl = $("<ul></ul>");
            lstInfoEl.addClass("list-group");

            const lstInfoItemHeightEl = $("<li></li>");
            lstInfoItemHeightEl.addClass(["list-group-item", "text-center"]);
            lstInfoItemHeightEl.html(`Height: <b>${pokemon.pokemonHeight / 10}m</b>`);
            lstInfoEl.append(lstInfoItemHeightEl);

            const lstInfoItemWeightEl = $("<li></li>");
            lstInfoItemWeightEl.addClass(["list-group-item", "text-center"]);
            lstInfoItemWeightEl.html(`Weight: <b>${pokemon.pokemonWeight / 10}kg</b>`);
            lstInfoEl.append(lstInfoItemWeightEl);

            const lstInfoItemTypesEl = $("<li></li>");
            lstInfoItemTypesEl.addClass(["list-group-item", "text-center"]);
            lstInfoItemTypesEl.html(`Type(s): <b>${getPokemonTypes(pokemon.pokemonTypes)}</b>`);
            lstInfoEl.append(lstInfoItemTypesEl);

            bsModalTitleEl.empty();
            bsModalBodyEl.empty();

            bsModalTitleEl.append(txtNameEl);
            bsModalBodyEl.append(imgFrontEl);
            bsModalBodyEl.append(imgBackEl);
            bsModalBodyEl.append(lstInfoEl);
        } else {
            console.log("nothing");
            const txtTitleEl = $(`<h1 id="bs-modalPokemonLabel"></h1>`);
            txtTitleEl.text("Nothing Found");
            txtTitleEl.addClass(["modal-title", "text-danger"]);

            const txtMessageEl = $(`<h2 id="bs-modalPokemonLabel"></h2>`);
            txtMessageEl.text("Please try again!");
            txtMessageEl.addClass(["text-center", "text-info"]);

            bsModalTitleEl.empty();
            bsModalBodyEl.empty();

            bsModalTitleEl.append(txtTitleEl);
            bsModalBodyEl.append(txtMessageEl);
        }

        /* Display the Container */
        modalContainerEl.css("display", "block");
        bsModalEl.modal("show");
    }

    function hideModalBootstrap() {
        bsModalEl.modal("hide");
        modalContainerEl.css("display", "none");
    }

    function getPokemonTypes(pokemonTypes) {
        let result = "";
        pokemonTypes.forEach(function (item) {
            result += `${item.type.name.toUpperCase()}, `;
        })
        return result.slice(0, -2);
    }

    

    // Search a pokemon in the pokemonRepository
    function searchPokemonByName(pokemonName) {
        let msg = "";
        let pokemonFound = getAll().filter(pokemon => pokemon.pokemonName.includes(pokemonName));
        if (pokemonFound.length > 0)
            msg = `Pokemon ${pokemonName} Exists. (n=${pokemonFound.length})`;
        else
            msg = `No Pokemon found with given Pokemon Name: ${pokemonName}`;
        // console.log(msg);
        console.log("Result", pokemonFound);
        return pokemonFound[0];
    }

    function validatePokemonObject(obj, keyNames) {
        /* Source: https://www.designcise.com/web/tutorial/how-to-check-if-an-array-contains-all-elements-of-another-array-in-javascript  (accessed on 04.10.2022)*/
        keyNames.forEach(function (keyName) {
            if (Object.keys(obj).some(key => key === keyName) === false)
                throw new TypeError("The input object must include all required data. Required keys are: " + pokemonObjKeys);
        })
    }

    function randomColorPicker() {
        let colorCode = "#";
        for (let i=0; i<colorCodeLength; i++) {
            colorCode += colors[Math.floor(Math.random() * colors.length)];
        }
        return colorCode;
    }

    function getAll() {
        return pokemonList;
    }

    return {
        addPokemon: addPokemon,
        getAll: getAll,
        loadList: loadList,
        addListItem: addListItem,
        loadDetails: loadDetails,
        searchPokemonByName: searchPokemonByName
    };
})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});