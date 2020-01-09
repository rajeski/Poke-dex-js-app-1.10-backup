var pokemonRepository = (() => {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  /** Glen's notes: 
   * With JQuery to access an element in an HTML page we can use a class or id. Using the
   * '$' allows us to use JQuery to modify the element. We can add or remove classes or we can
   * animate it in various ways.
   *
   * The values below (variables) are directly linked to HTML elements in your 'index.html'.
   * We can now access them using JQuery. We are using their class to specify which element we want
   * to assign to each value. The class allows us to be specific with which <div> we want to modify
   */
 
  var $overlay = $('.overlay'); // <div class="overlay"> ... </div>
  var $modalContainer = $(".modal"); // <div class='modal'> ... </div>
  var $pokemonName = $(".pokeman-name") // <h1 class="pokemon-name"></h1>
  var $pokemonImg = $(".pokemon-img"); // <img class="pokemon-img" src="" alt="">
  var $pokemonHeight = $(".pokemon-height"); // <p class="height"> ... </p>
  var $pokemonWeight = $(".pokemon-weight"); // <p class="weight"> ... </p>
  var $pokemonTypes = $(".pokemon-types"); // <p class=type"> ... </p> 
 
  function loadList() {
    return $.ajax(apiUrl)
      .then(function (json) {

        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
     
        });
      }).catch(function (e) {
        console.error(e);
      });
  }
 
  function add(item) {
    repository.push(item);
  }
 
  function loadDetails(item) {
    var url = item.detailsUrl;
    return fetch(url)
      .then(res => res.json())
      .then(details => {
        console.log('jSON', details);
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = [];
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
      }).catch(err => console.log(err))
  }
 
  function addListItem(pokemon) {
    var $pokemonList = $(".pokemon-list"); // Assign the <ul class="pokemon-list"> to a variable
    var $listItem = $("<li>"); // Create a HTML <li> element
    var $button = $(<button type="button" class="col-md-6 text-center" data-toggle="modal" data-target="#pokemon-modal"></button>);
    // Create a <button> element and add the pokemon's name to the button
    $pokemonList.append($listItem); // Append the <li> element to the <ul>
    $listItem.append($button); // Append the <button to the <li> previously appended
    $button.on('click', function (event) { // Finally, add a click event to each button
      showDetails(pokemon); // The click will run the showDetails function on 'click'
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item)
      .then(() => {
        // then we add the pokemon to the HTML using the JQuery variables we set above
        $modalContainer.addClass("modal-visible");
        $overlay.addClass("overlay-visible");
        $modalContainer.removeClass("modal");
        $pokemonName.text(item.name);
        $pokemonImg.attr("src", item.imageUrl);
        $pokemonHeight.text(item.height);
        $pokemonWeight.text(item.weight);
        $pokemonTypes.text(item.types);
      });
  }
 
  function hideDetails() {
    $modalContainer.removeClass("modal-visible");
    $overlay.removeClass("overlay-visible");
    $modalContainer.addClass("modal");
    $pokemonName.text('');
    $pokemonImg.attr("src", '');
    $pokemonHeight.text('');
    $pokemonWeight.text('');
  }
  $(".modal-close").on("click", () => {
    hideDetails();
  });
 
  $(document).keyup(function (event) {
    console.log('PRSSES', event);
    if (event.key === 'Escape' && $modalContainer.hasClass('modal-visible')) {
      hideDetails();
    }
  });
 
  $overlay.on('click', (e) => {
    var target = e.target;
    console.log(target);
    if (target === $overlay) {
      hideDetails();
    }
  });
 
  function getAll() {
    return repository;
  }

  return {
    loadList,
    loadDetails,
    addListItem,
    hideDetails,
    getAll
  };
})();

pokemonRepository.loadList()
  .then(() => {
    pokemonRepository.getAll().forEach(pokemon => {
      pokemonRepository.addListItem(pokemon);
    })
  });