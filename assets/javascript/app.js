document.getElementById('add-btn').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('#btn-container').innerHTML += `<a class="button is-info search-btn">${document.querySelector('#add-input').value}</a>`
    document.querySelector('#add-input').value = ''
})
