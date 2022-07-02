const contacts = []


const btn = document.querySelector('#btn')
const insertLink = document.querySelector('.insert-link')
const searchLink = document.querySelector('.search-link')
const showallLink = document.querySelector('.showall-link')
const insertContactForm = document.querySelector('.insert-contact-form')
const searchInput = document.querySelector('#searchInput')
const searchWrapper = document.querySelector('.search-wrapper')
const contactsTable = document.querySelector('.contacts-table')
const outer = document.querySelector('.outer')
const firstname = document.querySelector('#firstname')
const lastname = document.querySelector('#lastname')
const phoneNumber = document.querySelector('#phoneNumber')
const notFound = document.querySelector('.not-found')

var debounceTimeout = null

searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => getContactByPhoneNumber(this.value.trim()), 1500)
})


btn.addEventListener('click', function(e) {
    e.preventDefault()
    handleInsertContact()
})

insertLink.addEventListener('click', function(e) {
    e.preventDefault()
    onInsertLinkClicked()
})

searchLink.addEventListener('click', function(e) {
    e.preventDefault()
    onSearchLinkClicked()
})

showallLink.addEventListener('click', function(e) {
    e.preventDefault()
    onShowallLinkClicked()
})



function getContactByPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
        return
    }

    let index = fetchContact(phoneNumber)
    if (index === -1) {
        hideTable()
        hideError()
        showError()
        searchInput.value = ''
        //searchInput.setAttribute('placeholder', 'Πληκτρολογήστε ένα τηλέφωνο')
        return
    }

    let tableString = `
        <tr>
            <th>Όνομα</th>
            <th>Επώνυμο</th>
            <th>Τηλέφωνο</th>
            <th>Delete</th>
        </tr>
    `

    tableString += "<tr><td>" + contacts[index]['firstname'] + "</td>"
                    + "<td>" + contacts[index]['lastname'] + "</td>"
                    + "<td>" + contacts[index]['phoneNumber'] + "</td>"
                    + `<td><a href='#' onClick='handleDeleteContact(${index})'>Delete</a></td></tr>`

    hideTable()
    showTable(tableString)
}

function showTable(tableString) {
    let cloned = document.querySelector('.contacts-table').cloneNode(true)
    cloned.innerHTML = tableString
    document.querySelector('.outer').append(cloned)
}

function hideTable() {
    if (outer.querySelector('.contacts-table')) outer.querySelector('.contacts-table').remove()
    
}


function fetchContact(phoneNumber) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].phoneNumber === phoneNumber) {
            return i
        }
    }

    return -1
}


function onInsertLinkClicked() {
    hideSearch()
    hideTable()
    hideError()
    insertContactForm.classList.remove('hidden')
}

function onSearchLinkClicked() {
    hideInsert()
    hideTable()
    hideError()
    searchWrapper.classList.remove('hidden')
}

function onShowallLinkClicked() {
    hideSearch()
    hideInsert()
    hideTable()
    hideError()
    constructOutputTable()
}

function hideSearch() {
    searchWrapper.classList.add('hidden')
}


function hideInsert() {
    insertContactForm.classList.add('hidden')
}


function handleInsertContact() {
    let inputFirstname = firstname.value.trim()
    let inputLastname = lastname.value.trim()
    let inputPhoneNumber = phoneNumber.value.trim()

    if ((!inputFirstname) || (!inputLastname) || (!inputPhoneNumber)) {
        return
    }

    let contact = {firstname: inputFirstname, lastname: inputLastname, phoneNumber: inputPhoneNumber}

    insertContact(contact)

    constructOutputTable()
    initFields()
}

function initFields() {
    firstname.value = ''
    lastname.value = ''
    phoneNumber.value = ''
}

function constructOutputTable() {
    let tableString = `
        <tr>
            <th>Όνομα</th>
            <th>Επώνυμο</th>
            <th>Τηλέφωνο</th>
            <th>Delete</th>
        </tr>
    `

    for (let i = 0; i < contacts.length; i++) {
        tableString += "<tr><td>" + contacts[i]['firstname'] + "</td>"
                    + "<td>" + contacts[i]['lastname'] + "</td>"
                    + "<td>" + contacts[i]['phoneNumber'] + "</td>"
                    + `<td><a href='#' onClick='handleDeleteContact(${i})'>Delete</a></td></tr>`
    }

    hideTable()

    if (contacts.length) {
        showTable(tableString)
    } else {
        showError()
    }
}

function handleDeleteContact(i) {
    if ((i < 0) || (i > contacts.length)) {
        return
    }

    deleteContact(i)
    constructOutputTable()
    searchInput.value = ''
    // placeholder
}

function showError() {
    let cloned = document.querySelector('body > .not-found').cloneNode(true)
    cloned.classList.remove('hidden')
    outer.append(cloned)
}

function hideError() {
    if (outer.querySelector('.not-found')) outer.querySelector('.not-found').remove()
}

function insertContact(contact) {
    contacts.push(contact)
}

function deleteContact(i) {
    contacts.splice(i, 1)
}