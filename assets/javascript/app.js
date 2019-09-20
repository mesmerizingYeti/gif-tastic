document.getElementById('add-btn').addEventListener('click', e => {
    e.preventDefault()
    console.log('inside add-btn click')
    let searchValue = document.getElementById('add-input').value
    console.log(searchValue)
    if (searchValue) {
        document.getElementById('btns-container').innerHTML += `<button class="search-btn" data-search="${searchValue}">${searchValue}</button>`
        document.getElementById('add-input').value = ''
    }
})

