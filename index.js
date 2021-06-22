const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const SHOW_URL = BASE_URL + '/api/v1/users/:id'
const USER_PER_PAGE = 15

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const users = []
let filteredUsers = []

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
            <button class="btn btn-outline-success w-50 btn-sm btn-add-friend ml-1" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = userInfo
}
// page
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users

  const starIndex = (page - 1) * USER_PER_PAGE
  return data.slice(starIndex, starIndex + USER_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if(event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  randerUser(getUsersByPage(page))
})

axios.get(INDEX_URL).then(response => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUser(getUsersByPage(1))
})
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

// add to friend
function addToFriend(id) {
  const list = JSON.parse(localStorage.getItem('Friend')) || []
  const user = users.find(user => user.id === id)

  if (list.some((user => user.id === id))) {
    return alert('此用戶已是好友')
  }

  list.push(user)
  console.log(list)

  localStorage.setItem('Friend', JSON.stringify(list))
}

dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-modal')) {
    userModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-friend')) {
    addToFriend(Number(event.target.dataset.id))
  }
})
//

// set search bar
searchForm.addEventListener('submit', event => {
  // let browser wont relaod
  event.preventDefault()
  const username = searchInput.value.trim().toLowerCase()
  

  // check which user's name matches input(username) 
  filteredUsers = users.filter(user => user.name.toLowerCase().includes(username))

  if (filteredUsers.length === 0) {
    return alert('Cannot find user')
  }

  renderPaginator(filteredUsers.length)
  renderUser(getUsersByPage(1))
})
// 
