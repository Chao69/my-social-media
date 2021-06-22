const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const SHOW_URL = BASE_URL + '/api/v1/users/:id'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const users = JSON.parse(localStorage.getItem('Friend')) || []

// rander user list
function renderUser(data) {
  let userInfo = ''

  data.forEach(item => {
    userInfo += `
      <div class="card col-sm-2 p-0 mr-4 mb-2">
        <img src="${item.avatar}" class="card-img-top" alt="...">
        <div class="card-body d-flex justify-content-center flex-column p-2">
          <h5 class="d-flex justify-content-center">${item.name}</h5>
          <div class="d-flex justify-content-around">
            <button class="btn btn-outline-info w-50 btn-sm btn-show-modal mr-1" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
            <button class="btn btn-outline-danger w-50 btn-sm btn-remove-friend ml-1" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = userInfo
}

//

// click More btn show user modal
function userModal(id) {
  const modalTitle = document.querySelector('#user-modal-title')
  const modalBirthday = document.querySelector('#user-modal-birthday')
  const modalEmail = document.querySelector('#user-modal-email')
  const modalAge = document.querySelector('#user-modal-age')
  const modalGender = document.querySelector('#user-modal-gender')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data
    modalTitle.innerText = data.name + ' ' + data.surname
    modalBirthday.innerText = data.birthday
    modalEmail.innerText = data.email
    modalAge.innerText = data.age
    modalGender.innerText = data.gender
  })
}
// 

// remove to friend
function removeFriend (id) {
  const userIndex = users.findIndex(user => user.id === id)
  users.splice(userIndex, 1)
  localStorage.setItem('Friend', JSON.stringify(users))
  renderUser(users)
}


dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-modal')) {
    userModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-friend')) {
    removeFriend(Number(event.target.dataset.id))
  }
})
//

renderUser(users)