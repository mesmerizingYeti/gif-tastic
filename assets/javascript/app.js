document.querySelector('body').addEventListener('click', e => {
    // Add search button using text input
    if (e.target.id === 'add-btn') {
        e.preventDefault()
        document.querySelector('#btn-container').innerHTML += `<a class="button is-info search-btn">${document.querySelector('#add-input').value}</a>`
        document.querySelector('#add-input').value = ''
    }
    // Search for gifs using button name
    if (e.target.className === 'button is-info search-btn') {
        fetch(`https://api.giphy.com/v1/gifs/search?api_key=3SAWLXxeqLkPwaU2IUJhyQ6EAswy7DgM&q=${e.target.textContent}&limit=10&rating=pg-13`)
            .then (r => r.json())
            .then(({ data }) => {
                console.log(data)
                data.forEach(({ images }) => {
                    console.log(images)
                    document.querySelector('#gif-container').innerHTML += `
                        <img src="${images.original_still.url}" alt="${e.target.textContent}" class="gif" data-still="${images.original_still.url}" data-animated="${images.original.url}">
                    `
                })
            })
            .catch(e => console.error(e))
    }
    // Toggle gif animation
    if (e.target.className === 'gif') {
        e.target.src = e.target.src === e.target.dataset.still ? e.target.dataset.animated : e.target.dataset.still
    }

    
})
