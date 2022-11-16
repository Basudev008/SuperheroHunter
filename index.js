const searchBox = document.querySelector(".search-box");
const searchIcon = document.querySelector(".search-icon");
const supermanList = document.querySelector(".superman-list");
const searchList = document.querySelector(".search-list");

const privateKey = "ea4f058f612d212db5b39008fb16628d27feddd9";
const publicKey = "733cf07fb5580c774570e2a74cec5659";

const ts = Date.now().toString();
// using CryptoJS, a hash is created using timestamp, private and public key
var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

// variable initialized with local storage
var myLocalStorage = window.localStorage;

var superHeroArray = [];

// a get call to display 100 superheroes in the front page
fetch(
  `https://gateway.marvel.com:443/v1/public/characters?limit=100&ts=${ts}&apikey=${publicKey}&hash=${hash}`
)
  .then((response) => response.json())
  .then((data) => {
    // stored results into the superHeroArray
    superHeroArray = data.data.results;
    console.log(data.data.results);

    displaySupermanList();
  });

// function to display superheroes
displaySupermanList = () => {
  for (let i = 0; i < superHeroArray.length; i++) {
    var supermanComponent = document.createElement("div");
    supermanComponent.className = "superman-card";

    supermanComponent.innerHTML = `
    <img src='${superHeroArray[i].thumbnail.path}.${superHeroArray[i].thumbnail.extension}' class='hero-pic'></img>
    <div class='superhero-info'>
      <h4>${superHeroArray[i].name}</h4>
      <div>
        <button class='fav-btn${superHeroArray[i].id} fav-btn'>Add to Favourite</button>  
          <button class='more-info${superHeroArray[i].id} more-info'>More Info</button> 
      </div>
    </div>`;

    supermanList.appendChild(supermanComponent);

    // On clicking on more info button, we will store the id in local storage, and
    // using an api call, more information will be displayed
    var infoBtn = document.querySelector(`.more-info${superHeroArray[i].id}`);
    infoBtn.addEventListener("click", () => {
      addIdToStorage(superHeroArray[i].id);
    });

    var favBtn = document.querySelector(`.fav-btn${superHeroArray[i].id}`);
    var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));

    // if superhero is in favourite array, show Add to favourite, else Favourite
    if (!favouritesArray.includes(superHeroArray[i].id)) {
      favBtn.innerHTML = "<span>Add to favourite</span>";
    } else {
      favBtn.innerHTML = "<span>Favourite</span>";
    }

    // On clicking the favourite button, it toggles the superhero from the favourites list
    favBtn.addEventListener("click", () =>
      addToFavourite(favBtn, superHeroArray[i].id)
    );
  }
};

function addToFavourite(favBtn, id) {
  var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));
  var favBtn = document.querySelector(`.fav-btn${id}`);

  // if the superhero is already present, remove it
  // else push in the favourites array
  if (favouritesArray.includes(id)) {
    favBtn.innerText = "Add to favourite";
    console.log(favBtn);
    favouritesArray.splice(favouritesArray.indexOf(id), 1);
  } else {
    favBtn.innerText = "Favourite";
    console.log(favBtn);
    favouritesArray.push(id);
  }

  myLocalStorage.setItem("favourites", JSON.stringify(favouritesArray));
}

// function to add id of superhero clicked for more info
function addIdToStorage(id) {
  myLocalStorage.setItem("superHeroId", `${id}`);
  window.location.assign("superheroInfo.html");
  searchBox.value = "";
}

// search array to store results for the search box with limit = 5
var searchArray = [];

searchBox.addEventListener("keyup", () => searchSuperHero());
searchIcon.addEventListener("click", () => searchSuperHero());

function searchSuperHero() {
  var searchKey = searchBox.value;
  if (searchKey) {
    fetch(
      `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchKey}&limit=5&ts=${ts}&apikey=${publicKey}&hash=${hash}`
    )
      .then((response) => response.json())
      .then((data) => {
        searchArray = data.data.results;
        console.log(data.data.results);

        displaySearchList();
      });
  } else {
    searchList.innerHTML = "";
  }
}

// displaying the search list in similar fashion to the home list
displaySearchList = () => {
  searchList.innerHTML = "";

  for (let i = 0; i < searchArray.length; i++) {
    var supermanComponent = document.createElement("div");
    supermanComponent.className = "superman-card search-result";

    supermanComponent.innerHTML = `
    <img src='${searchArray[i].thumbnail.path}.${searchArray[i].thumbnail.extension}' class='hero-pic'></img>
    <div class='superhero-info'>
      <h4>${searchArray[i].name}</h4>
      <div class='search-button'>
        <button class='fav-btn${searchArray[i].id} fav-btn'>Add to Favourite</button>  
          <button class='more-info${searchArray[i].id} more-info'>More Info</button> 
      </div>
    </div>`;

    searchList.appendChild(supermanComponent);

    var infoBtn = document.querySelector(`.more-info${searchArray[i].id}`);
    infoBtn.addEventListener("click", () => {
      addIdToStorage(searchArray[i].id);
    });

    var favBtn = document.querySelector(`.fav-btn${searchArray[i].id}`);

    favBtn.addEventListener("click", (searchBox) => {
      addToFavourite(favBtn, searchArray[i].id);
      // After adding to favourite, empty the search box
      searchList.innerHTML = "";
    });
  }
};

// on clicking outside of search list, list disappears
document.addEventListener("click", (e) => {
  if (searchList.contains(e.target)) {
    e.stopPropagation();
  } else {
    searchList.innerHTML = "";
  }
});
