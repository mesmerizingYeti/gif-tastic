let favorites = []
// Timeout to prevent favorite clicking bug
let timeout = false

const setupFavorites = _ => {
    // Check if local favorites exist
    if (localStorage.getItem('favorite-gifs')) {
        // Grab local favorites
        JSON.parse(localStorage.getItem('favorite-gifs')).forEach(x => {
            favorites.push(x)
        })
    } else {
        // Create empty local favorites
        localStorage.setItem('favorite-gifs', JSON.stringify([]))
    }
    // <i class="fas fa-star"></i>
    // Display favorites
    favorites.forEach(({ dataset, alt }) => {
        document.querySelector('#gif-container').innerHTML = `
            <div class="column is-one-third bounceIn delay-5s slower">
                <div class="card">
                    <div class="card-image">
                        <figure class="image">
                            <img src="${dataset.still}" alt="${alt}" class="gif" data-still="${dataset.still}" data-animated="${dataset.animated}">
                            <span class="icon favorite">
                                <img src="./assets/images/favorite-star.png" alt="fav" class="favorite-img" data-value="favorite">
                            </span>
                        </figure>
                    </div>
                </div>
            </div>` + document.querySelector('#gif-container').innerHTML
    })
}

document.querySelector('body').addEventListener('click', e => {
    // Add search button using text input
    if (e.target.id === 'add-btn'               // Button for form
    || e.target.className === 'fas fa-search'   // Search icon occasionally clicked
    || e.target.id === 'search-icon'            // Search icon container occasionally clicked
    && document.querySelector('#add-input').value) {
            e.preventDefault()
            // Add button
            document.querySelector('#btn-container').innerHTML += `<a class="button search-btn">${document.querySelector('#add-input').value}</a>`
            // Reset input to empty
            document.querySelector('#add-input').value = ''
    }
    // Fetch gifs using button name
    if (e.target.className === 'button search-btn') {
        fetch(`https://api.giphy.com/v1/gifs/search?api_key=3SAWLXxeqLkPwaU2IUJhyQ6EAswy7DgM&q=${e.target.textContent}&limit=10&rating=PG`)
            .then(r => r.json())
            .then(({ data }) => {
                data.forEach(({ title, images }) => {
                    // Display currently selected gif
                    document.querySelector('#gif-container').innerHTML = `
                    <div class="column is-one-third bounceIn delay-5s slower">
                        <div class="card">
                            <div class="card-image">
                                <figure class="image">
                                    <img src="${images.original_still.url}" alt="${e.target.textContent}" class="gif" data-still="${images.original_still.url}" data-animated="${images.original.url}">
                                    <span class="icon favorite">
                                    <img src="./assets/images/normal-star.png" alt="fav" class="favorite-img">
                                    </span>
                                </figure>
                            </div>
                        </div>
                    </div>` + document.querySelector('#gif-container').innerHTML
                })
            })
            .catch(e => console.error(e))
    }
    // Toggle gif animation
    if (e.target.className === 'gif') {
        e.target.src = e.target.src === e.target.dataset.still ? e.target.dataset.animated : e.target.dataset.still
    }
    // User toggles favorite status of gif
    if (e.target.className === 'favorite-img' && !timeout) {
        if (e.target.dataset.value) {
            // Remove gif from favorites
            // Find gif in favorites using url for still
            let index = 0
            favorites.forEach(({ dataset }, i) => {
                if (e.target.parentNode.parentNode.children[0].dataset.still === dataset.still) {
                    index = i
                }
            })
            // Remove gif from variable and localStorage
            favorites.splice(index, 1)
            localStorage.setItem('favorite-gifs', JSON.stringify(favorites))
            // Unmark gif as favorite and change icon
            e.target.removeAttribute('data-value')
            e.target.src = "./assets/images/normal-star.png"
            
        } else {
            // Add gif to favorites
            favorites.push({
                dataset: e.target.parentNode.parentNode.children[0].dataset,
                alt: e.target.parentNode.parentNode.children[0].alt
            })
            localStorage.setItem('favorite-gifs', JSON.stringify(favorites))
            // Mark gif as favorite and change icon
            e.target.dataset.value = 'favorite'
            e.target.src = "./assets/images/favorite-star.png"
        }
        // Timeout to prevent accidental double clicking
        timeout = true
        setTimeout(_ => {
            timeout = false
        }, 100)
    }
})

setupFavorites()
