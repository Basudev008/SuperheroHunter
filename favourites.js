var myLocalStorage = window.localStorage;
var mySessionStorage = window.sessionStorage;

const supermanList = document.querySelector(".superman-list");

// parse favourites array from local storage
var superHeroArray = JSON.parse(myLocalStorage.getItem("favourites"));
if (superHeroArray == null) {
  superHeroArray = JSON.parse(mySessionStorage.getItem("favourites"));
}

const privateKey = "ea4f058f612d212db5b39008fb16628d27feddd9";
const publicKey = "733cf07fb5580c774570e2a74cec5659";
const ts = Date.now().toString();

var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

// if favourites has no superhero, display below message
if (superHeroArray.length == 0) {
  supermanList.innerHTML =
    "<div style='color:white ; font-size: 2rem'>No Favourites Selected. Go to Home!!!</div>";
}

// iterate over superHero array and display each superhero
for (let i = 0; i < superHeroArray.length; i++) {
  var supermanComponent = document.createElement("div");
  supermanComponent.className = "superman-card";
  console.log(superHeroArray[i]);
  displayFavourite(superHeroArray[i]);
}

async function displayFavourite(id) {
  var superHero = [];
  await fetch(
    `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    .then((data) => {
      superHero = data.data.results[0];
      var supermanComponent = document.createElement("div");
      supermanComponent.className = "superman-card";
      supermanComponent.innerHTML = `
        <img src='${superHero.thumbnail.path}.${superHero.thumbnail.extension}' class='hero-pic'></img>
        <div class='superhero-info'>
          <h4>${superHero.name}</h4>
          <div>
            <button class='fav-btn${superHero.id} fav-btn'>Remove From Favourite</button>  
              <button class='more-info${superHero.id} more-info'>More Info</button> 
          </div>
        </div>`;

      supermanList.appendChild(supermanComponent);

      // more info button
      var infoBtn = document.querySelector(`.more-info${superHero.id}`);
      infoBtn.addEventListener("click", () => {
        addIdToStorage(superHero.id);
      });

      var favBtn = document.querySelector(`.fav-btn${superHero.id}`);
      favBtn.addEventListener("click", () =>
        // remove from favourite
        removeFromFavourite(favBtn, superHero.id)
      );
    });
}

function removeFromFavourite(favBtn, id) {
  var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));
  if (favouritesArray == null) {
    favouritesArray = JSON.parse(mySessionStorage.getItem("favourites"));
  }
  var favBtn = document.querySelector(`.fav-btn${id}`);
  favouritesArray.splice(favouritesArray.indexOf(id), 1);

  // remove the component from list
  favBtn.parentElement.parentElement.parentElement.remove();

  // update the local storage
  myLocalStorage.setItem("favourites", JSON.stringify(favouritesArray));
  mySessionStorage.setItem("favourites", JSON.stringify(favouritesArray));
}

function addIdToStorage(id) {
  myLocalStorage.setItem("superHeroId", id);
  mySessionStorage.setItem("superHeroId", id);
  window.location.assign("superheroInfo.html");
}
