let favorites = []
let timeout = false

const setupFavorites = _ => {
    if (localStorage.getItem('favorite-gifs')) {
        JSON.parse(localStorage.getItem('favorite-gifs')).forEach(x => {
            favorites.push(x)
        })
    } else {
        localStorage.setItem('favorite-gifs', JSON.stringify([]))
    }
    
    favorites.forEach(({ dataset, alt }) => {
        document.querySelector('#gif-container').innerHTML = `
            <div class="column is-one-third bounceIn delay-5s slower">
                <div class="card">
                    <div class="card-image">
                        <figure class="image">
                            <img src="${dataset.still}" alt="${alt}" class="gif" data-still="${dataset.still}" data-animated="${dataset.animated}">
                            <span class="icon favorite">
                                <i class="fas fa-star"></i>
                            </span>
                        </figure>
                    </div>
                </div>
            </div>` + document.querySelector('#gif-container').innerHTML
    })
}

document.querySelector('body').addEventListener('click', e => {
    // Add search button using text input
    if (e.target.id === 'add-btn') {
        e.preventDefault()
        document.querySelector('#btn-container').innerHTML += `<a class="button search-btn">${document.querySelector('#add-input').value}</a>`
        document.querySelector('#add-input').value = ''
    }
    // Search for gifs using button name
    if (e.target.className === 'button search-btn') {
        fetch(`https://api.giphy.com/v1/gifs/search?api_key=3SAWLXxeqLkPwaU2IUJhyQ6EAswy7DgM&q=${e.target.textContent}&limit=10&rating=PG`)
            .then(r => r.json())
            .then(({ data }) => {
                console.log(data)
                data.forEach(({ title, images }) => {
                    console.log(images)
                    document.querySelector('#gif-container').innerHTML = `
                    <div class="column is-one-third bounceIn delay-5s slower">
                        <div class="card">
                            <div class="card-image">
                                <figure class="image">
                                    <img src="${images.original_still.url}" alt="${e.target.textContent}" class="gif" data-still="${images.original_still.url}" data-animated="${images.original.url}">
                                    <span class="icon favorite">
                                        <i class="far fa-star"></i>
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

    if (e.target.className === 'far fa-star' && !timeout) {
        favorites.push({
            dataset: e.target.parentNode.parentNode.children[0].dataset,
            alt: e.target.parentNode.parentNode.children[0].alt
        })
        localStorage.setItem('favorite-gifs', JSON.stringify(favorites))
        e.target.className = 'fas fa-star'
        timeout = true
        setTimeout(_ => {
            timeout = false
        }, 100)
    }
    
    if (e.target.className === 'fas fa-star' && !timeout) {
        favorites.splice(favorites.indexOf({
            dataset: e.target.parentNode.parentNode.children[0].dataset,
            alt: e.target.parentNode.parentNode.children[0].alt
        }), 1)
        localStorage.setItem('favorite-gifs', JSON.stringify(favorites))
        e.target.className = 'far fa-star'
        timeout = true
        setTimeout(_ => {
            timeout = false
        }, 100)
    }
})

setupFavorites()
