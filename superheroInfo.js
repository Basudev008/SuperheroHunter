export function superheroInfo() {
  const myLocalStorage = window.localStorage;

  const privateKey = "ea4f058f612d212db5b39008fb16628d27feddd9";
  const publicKey = "733cf07fb5580c774570e2a74cec5659";
  const ts = Date.now().toString();

  var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  const superheroInfo = document.querySelector(".superhero");

  var id = myLocalStorage.getItem("superHeroId");
  var superHero = [];

  // fetch details based on superheroId stored in the local storage
  fetch(
    `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    .then((data) => {
      superHero = data.data.results[0];
      console.log(data.data.results);

      superheroInfo.innerHTML = `<div class='top-row'><img src='${superHero.thumbnail.path}.${superHero.thumbnail.extension}' class='hero-pic'></img>
    <div class='superhero-info'>
      <h4>${superHero.name}</h4>
      <div>
        <button class='fav-btn${superHero.id} fav-btn info'>Add to Favourite</button>  
      </div>
    </div></div>
    <div class='extended-info'>
        <div class='comics'><h4>Comics</h4><ul></ul></div>
        <div class='events'><h4>Events</h4><ul></ul></div>
        <div class='series'><h4>Series</h4><ul></ul></div>
        <div class='stories'><h4>Stories</h4><ul></ul></div>
        <div class='urls'><h4>Urls</h4><ul></ul></div>
    <div>`;

      var comicsInfo = document.querySelector(".comics ul");
      for (let i = 0; i < superHero.comics.items.length; i++) {
        const listElement = document.createElement("li");
        listElement.innerHTML = `${superHero.comics.items[i].name}`;
        comicsInfo.appendChild(listElement);
      }

      var comicsInfo = document.querySelector(".events ul");
      for (let i = 0; i < superHero.events.items.length; i++) {
        const listElement = document.createElement("li");
        listElement.innerHTML = `${superHero.events.items[i].name}`;
        comicsInfo.appendChild(listElement);
      }

      var comicsInfo = document.querySelector(".series ul");
      for (let i = 0; i < superHero.series.items.length; i++) {
        const listElement = document.createElement("li");
        listElement.innerHTML = `${superHero.series.items[i].name}`;
        comicsInfo.appendChild(listElement);
      }

      var comicsInfo = document.querySelector(".stories ul");
      for (let i = 0; i < superHero.stories.items.length; i++) {
        const listElement = document.createElement("li");
        listElement.innerHTML = `${superHero.stories.items[i].name}`;
        comicsInfo.appendChild(listElement);
      }

      var comicsInfo = document.querySelector(".urls ul");
      for (let i = 0; i < superHero.urls.length; i++) {
        const listElement = document.createElement("li");
        listElement.innerHTML = `${superHero.urls[i].type} : ${superHero.urls[i].url}`;
        comicsInfo.appendChild(listElement);
      }

      var favBtn = document.querySelector(`.fav-btn${superHero.id}`);

      var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));

      if (favouritesArray) {
        if (!favouritesArray.includes(superHero.id)) {
          favBtn.innerHTML = "<span>Add to favourite</span>";
        } else {
          favBtn.innerHTML = "<span>Favourite</span>";
        }
      }

      favBtn.addEventListener("click", () =>
        addToFavourite(favBtn, superHero.id)
      );
    });

  // addToFavourite function same as index.js
  function addToFavourite(favBtn, id) {
    var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));
    var favBtn = document.querySelector(`.fav-btn${id}`);
    if (favouritesArray) {
      if (favouritesArray.includes(id)) {
        favBtn.innerText = "Add to favourite";
        favouritesArray.splice(favouritesArray.indexOf(id), 1);
      } else {
        favBtn.innerText = "Favourite";
        favouritesArray.push(id);
      }
    } else {
      var array = [];
      array.push(id);
      favouritesArray = array;
    }

    myLocalStorage.setItem("favourites", JSON.stringify(favouritesArray));
  }
}
