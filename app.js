//DOM OBJECT

const rightContainer = document.querySelector(".right-container");
const listItems = rightContainer.querySelectorAll(".list-item");
const prevButton = rightContainer.querySelector(".left-button");
const nextButton = rightContainer.querySelector(".right-button");
const headerDesc = document.querySelector(".screen__header");
const pokeWeight = document.querySelector(".poke-weight");
const pokeHeight = document.querySelector(".poke-height");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const mainScreen = document.querySelector(".main-screen");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeName = headerDesc.querySelector(".poke-name");
const pokeId = headerDesc.querySelector(".poke-id");
const pokedexBoxA = document.querySelector(".left-container__top-section");
const pokedexBoxB = document.querySelector(".left-container__main-section");
const pokedexBoxC = document.querySelector(".left-container__right");
const pokedexBoxD = document.querySelectorAll(".left-container__hinge");
const padCell = document.querySelector(".controllers__d-pad");
const right = padCell.querySelector("div:nth-child(4)");
const left = padCell.querySelector("div:nth-child(2)");
const up = padCell.querySelector("div:first-child");
const down = padCell.querySelector("div:last-child");
const buttonA = document.querySelector(".buttons__button:last-child");
const buttonB = document.querySelector(".buttons__button:first-child");

// VARIABLES AND CONSTANTS 
let old_active = null;
let new_active;
let backImage, frontImage, weight, height, typeA, typeB;
let previousUrl = null;
let nextUrl = null;
let pokemonName;
let pokemonId;
let goldenPokedex = false;
let shinyMod = false;
let konamiTestKeyboard = [];
let konamiTestMouse = [];
let konamiCodeGold = ["ArrowRight", "a", "ArrowUp", "ArrowLeft", "b", "ArrowLeft", "a", "ArrowDown"];
let KonamiCodeShiny = ["ArrowDown", "a", "ArrowLeft", "b", "ArrowLeft", "ArrowUp", "a", "ArrowRight"];
let compte = 0;
let config = {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
};

//FUNCTIONS

function capitalize (string) {
    return string[0].toUpperCase() + string.substr(1);
}

function generatePokedex(url) {
  fetch(url, config)
    .then(function (res) {
      res
        .json()
        .then(function (data) {
          for (let i = 0; i < 20; i++) {
            pokemonName = data.results[i].name;
            let pokemonUrl = data.results[i].url;
            getid(pokemonUrl, pokemonName, i);
          }
          previousUrl = data.previous;
          nextUrl = data.next;
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getid(pokemonUrl, pokemonName, i) {
  fetch(pokemonUrl, config)
    .then(function (res) {
      res
        .json()
        .then(function (data) {
            pokemonId = data.id;
            listItems[i].textContent = `${pokemonId}. ${capitalize(pokemonName)} `;
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function checkPokemonInsideList (e) {
    if (!e.target) return;
    const listItem = e.target;
    if (!listItem.textContent) return;
    let pokemonInfoStr = listItem.textContent;
    showPokemon(pokemonInfoStr);
}

function showPokemon(pokemonInfoStr) {
    let pokemonInfo = pokemonInfoStr.split(".");
    let name = pokemonInfo[1].trim();
    let id = idShape(pokemonInfo[0]);
    pokeName.textContent = name;
    pokeId.textContent = id;
    mainScreen.classList.remove("hide");
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInfo[0]}`, config)
        .then(function (res) {
            res.json()
                .then(function (data) {
                weight = data.weight;
                height = data.height;
                typeA = data.types[0].type.name;
                if (data.types.length === 1) {
                    pokeTypeTwo.classList.add("hide");
                } else {
                    typeB = data.types[1].type.name;
                    if (pokeTypeTwo.classList.contains("hide")) {
                    pokeTypeTwo.classList.remove("hide");
                    }
                }

                if (shinyMod) {
                    if (data.sprites.back_shiny) {
                        backImage = data.sprites.back_shiny;
                    }
                    else if (data.sprites.back_shiny_female) {
                        backImage = data.sprites.back_shiny_female;
                    }
                    else {
                        backImage = data.sprites.back_default;
                    }
                }
                else {
                    backImage = data.sprites.back_default;
                }

                if (shinyMod) {
                    if (data.sprites.front_shiny) {
                        frontImage = data.sprites.front_shiny;
                    }
                    else if (data.sprites.front_shiny_female) {
                        frontImage = data.sprites.front_shiny_female;
                    }
                    else {
                        frontImage = data.sprites.front_default;
                    }
                }
                else {
                    frontImage = data.sprites.front_default;
                }

                pokeWeight.textContent = weight;
                pokeHeight.textContent = height;
                pokeTypeOne.textContent = typeA;
                pokeTypeTwo.textContent = typeB;
                mainScreen.className="main-screen";
                mainScreen.classList.add(`${typeA}`);
                pokeBackImage.src = backImage;
                pokeFrontImage.src = frontImage;
                })
                .catch(function (error) {
                console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        });
        
}

function idShape(id) {
    let shape = "#000";
    let idStr = id.toString();
    let finalID = shape.slice(0, 4 - idStr.length) + id;
    return finalID;
}

function previous() {
    if (previousUrl) {
        generatePokedex(previousUrl);
    }
}

function next() {
    if (nextUrl) {
        generatePokedex(nextUrl);
    }
}

function shinyModOn () {
    let name = pokeName.textContent.trim();
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, config)
    .then(function (res) {
      res
        .json()
        .then(function (data) {
            if (shinyMod) {
                if (data.sprites.back_shiny) {
                    backImage = data.sprites.back_shiny;
                }
                else if (data.sprites.back_shiny_female) {
                    backImage = data.sprites.back_shiny_female;
                }
                else {
                    backImage = data.sprites.back_default;
                }
            }
            else {
                backImage = data.sprites.back_default;
            }

            if (shinyMod) {
                if (data.sprites.front_shiny) {
                    frontImage = data.sprites.front_shiny;
                }
                else if (data.sprites.front_shiny_female) {
                    frontImage = data.sprites.front_shiny_female;
                }
                else {
                    frontImage = data.sprites.front_default;
                }
            }
            else {
                frontImage = data.sprites.front_default;
            }

            pokeBackImage.src = backImage;
            pokeFrontImage.src = frontImage;
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function goldPokedex (){
    if(goldenPokedex) {
        pokedexBoxA.classList.add("gold");
        pokedexBoxB.classList.add("gold");
        pokedexBoxC.classList.add("gold");
        pokedexBoxD[0].classList.add("gold");
        pokedexBoxD[1].classList.add("gold");
        rightContainer.classList.add("gold");
    }
}

function konamiCodeCheck (){
    window.addEventListener("keydown", function (e){
        if (konamiTestKeyboard.length < 8) {
            konamiTestKeyboard.push(e.key);
        }
        if (konamiTestKeyboard.length === 8) {
            konamiTestKeyboard.unshift();
            konamiTestKeyboard.push(e.key);
            let count = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === konamiCodeGold[i]) {
                    count ++;
                }
            }
            if (count === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                goldenPokedex = true;
                goldPokedex();
            }

            let countS = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === KonamiCodeShiny[i]) {
                    countS ++;
                }
            }
            if (countS === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                shinyMod = true;
                shinyModOn();
            }
        }
    })

    down.addEventListener("click", function (){
        let str = "ArrowDown";
        if (konamiTestMouse.length < 8) {
            konamiTestMouse.push(str);
        }
        if (konamiTestMouse.length === 8){
            konamiTestMouse.unshift();
            konamiTestMouse.push(str);
            let count = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestMouse[i] === konamiCodeGold[i]) {
                    count ++;
                }
            }
            if (count === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                goldenPokedex = true;
                goldPokedex();
            }

            let countS = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === KonamiCodeShiny[i]) {
                    countS ++;
                }
            }
            if (countS === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                shinyMod = true;
                shinyModOn();
            }
        }
    }) 

    up.addEventListener("click", function (){
        let str = "ArrowUp";
        if (konamiTestMouse.length < 8) {
            konamiTestMouse.push(str);
        }
        if (konamiTestMouse.length === 8){
            konamiTestMouse.unshift();
            konamiTestMouse.push(str);
            let count = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestMouse[i] === konamiCodeGold[i]) {
                    count ++;
                }
            }
            if (count === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                goldenPokedex = true;
                goldPokedex();
            }

            let countS = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === KonamiCodeShiny[i]) {
                    countS ++;
                }
            }
            if (countS === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                shinyMod = true;
                shinyModOn();
            }
        }
    }) 

    left.addEventListener("click", function (){
        let str = "ArrowLeft";
        if (konamiTestMouse.length < 8) {
            konamiTestMouse.push(str);
        }
        if (konamiTestMouse.length === 8){
            konamiTestMouse.unshift();
            konamiTestMouse.push(str);
            let count = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestMouse[i] === konamiCodeGold[i]) {
                    count ++;
                }
            }
            if (count === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                goldenPokedex = true;
                goldPokedex();
            }

            let countS = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === KonamiCodeShiny[i]) {
                    countS ++;
                }
            }
            if (countS === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                shinyMod = true;
                shinyModOn();
            }
        }
    }) 

    right.addEventListener("click", function (){
        let str = "ArrowRight";
        if (konamiTestMouse.length < 8) {
            konamiTestMouse.push(str);
        }
        if (konamiTestMouse.length === 8){
            konamiTestMouse.unshift();
            konamiTestMouse.push(str);
            let count = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestMouse[i] === konamiCodeGold[i]) {
                    count ++;
                }
            }
            if (count === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                goldenPokedex = true;
                goldPokedex();
            }

            let countS = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === KonamiCodeShiny[i]) {
                    countS ++;
                }
            }
            if (countS === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                shinyMod = true;
                shinyModOn();
            }
        }
    }) 

    buttonA.addEventListener("click", function (){
        let str = "a";
        if (konamiTestMouse.length < 8) {
            konamiTestMouse.push(str);
        }
        if (konamiTestMouse.length === 8){
            konamiTestMouse.unshift();
            konamiTestMouse.push(str);
            let count = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestMouse[i] === konamiCodeGold[i]) {
                    count ++;
                }
            }
            if (count === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                goldenPokedex = true;
                goldPokedex();
            }

            let countS = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === KonamiCodeShiny[i]) {
                    countS ++;
                }
            }
            if (countS === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                shinyMod = true;
                shinyModOn();
            }
        }
    }) 

    buttonB.addEventListener("click", function (){
        let str = "b";
        if (konamiTestMouse.length < 8) {
            konamiTestMouse.push(str);
        }
        if (konamiTestMouse.length === 8){
            konamiTestMouse.unshift();
            konamiTestMouse.push(str);
            let count = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestMouse[i] === konamiCodeGold[i]) {
                    count ++;
                }
            }
            if (count === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                goldenPokedex = true;
                goldPokedex();
            }

            let countS = 0;
            for (let i = 0; i < konamiCodeGold.length; i++) {
                if (konamiTestKeyboard[i] === KonamiCodeShiny[i]) {
                    countS ++;
                }
            }
            if (countS === 8) {
                alert ("Vous avez trouvé l'easter egg du golden Pokédex!")
                shinyMod = true;
                shinyModOn();
            }
        }
    })   
}

// EVENTS LISTENER

window.addEventListener("load", konamiCodeCheck);
prevButton.addEventListener("click", previous);
nextButton.addEventListener("click", next);
down.addEventListener("click", function (){
    switch(compte){
        case 9:
        case 19:
            break;
        default:
            compte ++;
            new_active = listItems[compte];
            if (old_active) {
               old_active.classList.remove("active")
             }
            new_active.classList.add("active");
            old_active = new_active;
            break;
    }
})

up.addEventListener("click", function (){
    switch(compte){
        case 0:
        case 10:
            break;
        default:
            compte --;
            new_active = listItems[compte];
            if (old_active) {
               old_active.classList.remove("active")
             }
            new_active.classList.add("active");
            old_active = new_active;
            break;
    }
})

left.addEventListener("click", function (){
    switch(compte){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            break;
        default:
            compte -= 10;
            new_active = listItems[compte];
            if (old_active) {
               old_active.classList.remove("active")
             }
            new_active.classList.add("active");
            old_active = new_active;
            break;
    }
})

right.addEventListener("click", function (){
    switch(compte){
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
            break;
        default:
            compte += 10;
            new_active = listItems[compte];
            if (old_active) {
               old_active.classList.remove("active")
             }
            new_active.classList.add("active");
            old_active = new_active;
            break;
    }
})

for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener("click", function (e) {
        compte = i;
        new_active = e.target;
       
        if (old_active) {
            old_active.classList.remove("active")
        }
        new_active.classList.add("active");
        old_active = new_active;
        checkPokemonInsideList(e);
    })
    buttonA.addEventListener("click", function (){
        new_active = listItems[compte];
        if (old_active) {
            old_active.classList.remove("active")
        }
        new_active.classList.add("active");
        old_active = new_active;
        showPokemon(listItems[compte].textContent);
    })
    buttonB.addEventListener("click", function () {
        mainScreen.classList.add("hide");
    })

}

// INITIALIZE POKEDEX

generatePokedex("https://pokeapi.co/api/v2/pokemon/");