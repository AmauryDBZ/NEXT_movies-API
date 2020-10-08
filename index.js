const submitBtn = document.getElementById('button');

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let search = document.getElementById('search').value;
  let apikey = '';

  fetch(`http://www.omdbapi.com/?s=${search}&apikey=${apikey}`, {method: 'get'})
    .then((data) => data.json())
    .then((data) => manipulateData(data))
    .catch((error) => console.error('error : ' + error))
})

function manipulateData(data) {
  let target = document.getElementById('movies');
  target.innerHTML = '';
  data['Search'].forEach((movie) => {
    let name = movie.Title;
    let year = movie.Year;
    let image = movie.Poster;
    let type = movie.type;
    let id = movie.imdbID;

    target.innerHTML += `
      <!-- movie card -->
      <div class="col-lg-4 col-md-6 col-sm-6 card-fade-in">
        <div>
          <img src="${image}" class="card-img-top" alt="${name} image">
          <div class="card-body">
            <strong class="card-title">${name}</strong>
            <p class="card-text">${year}</p>
            <button onclick="dataForModal('${id}')" class="btn btn-outline-primary" data-toggle="modal" data-target="#movieModal">See more</button>
          </div>
        </div>
      </div>
    `;
  });
  createObserver();
};

function dataForModal(movieId) {
  fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${apikey}`, {method: 'get'})
    .then((data) => data.json())
    .then((data) => displayModal(data))
    .catch((error) => console.error('error : ' + error))
}

function displayModal(moviedata) {
  console.log(moviedata);
  let name = moviedata.Title;
  let year = moviedata.Year;
  let image = moviedata.Poster;
  let type = moviedata.type;
  let plot = moviedata.Plot;
  let genre = moviedata.genre;
  let actors = moviedata.actors;

  let modal = document.getElementById('movieModal');
  modal.innerHTML = `
    <!-- Modal -->
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">${name}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4">
              <img src="${image}" class="card-img-top" alt="${name} image">
            </div>
            <div class="col-md-8">
              <p>${plot}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" id="modalClose" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
    </div>
  `;
};

function createObserver() {
  const allCards = document.querySelectorAll('.card-fade-in');
  console.log(allCards);

  const options = {
    root: null,
    threshold: 0.5,
    rootMargin: '-100px'
  };

  const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach((entry) => {
      console.log(entry.target);
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classlist.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  allCards.forEach((card) => {
    observer.observe(card);
  });
}
