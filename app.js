let rightContainer = document.querySelector(".right-container");
let listItem = rightContainer.querySelectorAll(".list-item");
let prev_button = rightContainer.querySelector(".left-button");
let next_button = rightContainer.querySelector(".right-button");

let config_fetch = {
    method : "GET",
    header : {
        "Content-Type" : "application/json"
    }
};

function generatePokedex (url) {
    fetch (url, config_fetch)
    .then (function (res) {
        res.json()
        .then (function (data) {
            for (let i = 0; i < 20; i++){
                let pokemon_name = data.results[i].name;
                let pokemon_url = data.results[i].url;
                getid(pokemon_name, pokemon_url, i);
            }
            // if (data.previous !== null){
            //     prev_button.addEventListener("click", generatePokedex(data.previous))
            // }
            // if (data.next !== null){
            //     next_button.addEventListener("click", generatePokedex(data.next))
            // } 
        })
        .catch (function (error){
            console.log(error);
        })
    })
    .catch (function (error){
        console.log(error);
    })
}
function getid (pokemon_name, pokemon_url, i) {
    fetch (pokemon_url, config_fetch)
    .then (function (res) {
        res.json()
        .then (function (data) {
            let pokemon_id = data.id;
            listItem[i].textContent = `${pokemon_id} ${pokemon_name}`;
        })
        .catch (function (error){
            console.log(error);
        })
    })
    .catch (function (error){
        console.log(error);
    })
}

window.addEventListener("load", generatePokedex ("https://pokeapi.co/api/v2/pokemon/"));
