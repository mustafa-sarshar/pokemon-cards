"use strict";

const pokemonRepository = (function () {
    // HTML Elements
    const pokemonListEl = document.querySelector(".pokemon-list");
    const modalContainerEl = document.querySelector(".modal-container");
    const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20";
    // Properties
    const colors = "0123456789abcde";   // without f
    const colorCodeLength = 6;
    const lumaThreshold = 100;
    const pokemonObjKeys = ["pokemonID", "pokemonName", "detailsUrl"];
    let pokemonList = [];

    window.addEventListener("keydown", (event) => {
        if (event.code === "Escape" && modalContainerEl.style.display !== "none") {
            // hideModal();
            hideModalBootstrap();
        }
    })
    modalContainerEl.addEventListener("click", (event) => {
        if (event.target === modalContainerEl)
            hideModal();
        hideModalBootstrap();
    });

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
    };

    function addListItem(pokemon) {
        const pokemonLiEl = document.createElement("li");
        const btnEl = document.createElement("button");
        const pokemonColor = randomColorPicker();
        // pokemonLiEl.classList.add("pokemon-list-item");
        $(pokemonLiEl).addClass(["pokemon-list-item", "group-list-item"]);
        if (pokemon.pokemonID % 2 === 0)
            // pokemonLiEl.classList.add("pokemon-list-item__transform-1");
            $(pokemonLiEl).addClass("pokemon-list-item__transform-1");
        else
            // pokemonLiEl.classList.add("pokemon-list-item__transform-2");
            $(pokemonLiEl).addClass("pokemon-list-item__transform-2");
        pokemonLiEl.style.borderColor = pokemonColor;
        pokemonLiEl.addEventListener("mouseover", () => pokemonLiEl.style.boxShadow = `1px 1px 10px ${pokemonColor}`);
        pokemonLiEl.addEventListener("mouseleave", () => pokemonLiEl.style.boxShadow = `1px 1px 10px ${pokemonColor}00`);  // box-shadow-color with 0% opacity

        // btnEl.classList.add("pokemon-list-item__btn");
        $(btnEl).addClass(["pokemon-list-item__btn", "btn"]);
        btnEl.dataToggle = "modal";
        btnEl.innerText = pokemon.pokemonName;
        btnEl.addEventListener("click", function (event) {
            showDetails(pokemon);
        });

        pokemonLiEl.appendChild(btnEl);
        pokemonListEl.appendChild(pokemonLiEl);
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
        loadDetails(pokemon).then(function () {
            // showModal(pokemon);
            showModalBootstrap(pokemon);
            console.log(pokemon)
        });
    }

    function showLoadingMessage(msg) {
        console.log(`Loading ${msg} started...`);
    }

    function hideLoadingMessage(msg, status="successfully") {
        console.log(`Loading ${msg} finished ${status}...`);
    }

    function showModal(pokemon) {
        // modalContainerEl.innerHTML = "";
        /* Create all HTML Elements */
        const modalWrapperEl = document.createElement("div");
        const modalCloseBtnEl = document.createElement("img");
        const clearfixEl = document.createElement("div");
        const modalIconEl = document.createElement("img");
        const modalTitle = document.createElement("p");
        const modalTextHeightEl = document.createElement("p");
        const modalTextWeightEl = document.createElement("p");
        const modalTextTypesEl = document.createElement("p");

        /* Initialize all HTML Elements */
        modalWrapperEl.classList.add("modal-wrapper");

        modalCloseBtnEl.classList.add("modal__closeBtn");
        modalCloseBtnEl.src = "./img/close_button_sign.png";
        modalCloseBtnEl.alt = "Close";
        modalCloseBtnEl.addEventListener("click", hideModal);

        clearfixEl.classList.add("clearfix");

        modalIconEl.classList.add("modal__icon")
        modalIconEl.src = pokemon.imageUrlFrontDefault;
        modalIconEl.alt = pokemon.pokemonName + " image";

        modalTitle.classList.add("modal__title");
        modalTitle.innerText = pokemon.pokemonName;

        modalTextHeightEl.classList.add("modal__text");
        modalTextHeightEl.innerText = `Height: ${pokemon.pokemonHeight/10}m`;

        modalTextWeightEl.classList.add("modal__text");
        modalTextWeightEl.innerText = `Weight: ${pokemon.pokemonWeight/10}kg`;

        modalTextTypesEl.classList.add("modal__text");
        modalTextTypesEl.innerText = `Type(s): ${getPokemonTypes(pokemon.pokemonTypes)}`;

        /* Add Child Elements to Modal Container */
        modalWrapperEl.appendChild(modalCloseBtnEl);
        modalWrapperEl.appendChild(clearfixEl);
        modalWrapperEl.appendChild(modalIconEl);
        modalWrapperEl.appendChild(modalTitle);
        modalWrapperEl.appendChild(modalTextHeightEl);
        modalWrapperEl.appendChild(modalTextWeightEl);
        modalWrapperEl.appendChild(modalTextTypesEl);
        modalContainerEl.appendChild(modalWrapperEl);

        /* Display the Container */
        modalContainerEl.style.display = "block";
    }

    function showModalBootstrap(pokemon) {
        const bsModalEl = $("#bs-modalPokemon");
        const bsModalBodyEl = $(".modal-body");
        const bsModalTitleEl = $(".modal-title");

        const txtNameEl = $(`<h1 id="bs-modalPokemonLabel">${pokemon.pokemonName}</h1>`);
        $(txtNameEl).addClass(["modal-title", "fs-5", "text-uppercase"])
        const imgFrontEl = $("<img class='modal-img' style='width:50%'>");
        imgFrontEl.attr("src", pokemon.imageUrlFrontDefault);
        const imgBackEl = $("<img class='modal-img' style='width:50%'>");
        imgBackEl.attr("src", pokemon.imageUrlBackDefault);

        const txtHeightEl = $(`<p>Height: <b>${pokemon.pokemonHeight / 10}m</b></p>`);
        $(txtHeightEl).addClass("text-center");
        const txtWeightEl = $(`<p>Weight: <b>${pokemon.pokemonWeight / 10}kg</b></p>`);
        $(txtWeightEl).addClass("text-center");
        const txtTypesEl = $(`<p>Types: <b>${getPokemonTypes(pokemon.pokemonTypes)}</b></p>`);
        $(txtTypesEl).addClass("text-center")

        bsModalTitleEl.empty();
        bsModalBodyEl.empty();

        bsModalTitleEl.append(txtNameEl);
        bsModalBodyEl.append(imgFrontEl);
        bsModalBodyEl.append(imgBackEl);
        bsModalBodyEl.append(txtHeightEl);
        bsModalBodyEl.append(txtWeightEl);
        bsModalBodyEl.append(txtTypesEl);
        
        /* Display the Container */
        modalContainerEl.style.display = "block";
        bsModalEl.modal("show");
    }

    function hideModal() {
        const bsModalEl = $("#bs-modalPokemon");
        bsModalEl.modal("hide");
        modalContainerEl.style.display = "none";
    }

    function hideModalBootstrap() {
        hideModal();
    }

    function getPokemonTypes(pokemonTypes) {
        let result = "";
        pokemonTypes.forEach((item) => {
            result += `${item.type.name.toUpperCase()}, `;
        })
        return result.slice(0, -2);
    }

    // Search a pokemon in the pokemonRepository
    function searchPokemonByName(pokemonName) {
        let msg = "";
        let pokemonFound = getAll().filter(pokemon => pokemon.pokemonName === pokemonName);
        if (pokemonFound.length > 0)
            msg = `Pokemon ${pokemonName} Exists. (n=${pokemonFound.length})`;
        else
            msg = `No Pokemon found with given Pokemon Name: ${pokemonName}`;
        console.log(msg);
        alert(msg);
    }

    function validatePokemonObject(obj, keyNames) {
        /* Source: https://www.designcise.com/web/tutorial/how-to-check-if-an-array-contains-all-elements-of-another-array-in-javascript  (accessed on 04.10.2022)*/
        keyNames.forEach(keyName => {
            if (Object.keys(obj).some(key => key === keyName) === false)
                throw new TypeError("The input object must include all required data. Required keys are: " + pokemonObjKeys);
        })
    };

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

function printArrayDetails(inputListPokemon) {
    inputListPokemon.forEach(pokemon => {
        pokemonRepository.addListItem(pokemon);
    });
}

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
printArrayDetails(pokemonRepository.getAll());

// pokemonRepository.searchPokemonByName("Fake Pokemon");
// pokemonRepository.searchPokemonByName("Rattata");