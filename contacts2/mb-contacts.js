let contacts = []

$(document).ready(function() {

    $('.insert-link').on('click', function(e) {
        e.preventDefault()
        onInsertLinkClicked()
    })
    
    $('.search-link').on('click', function(e) {
        e.preventDefault()
        onSearchLinkClicked()
    })
    
    $('.showall-link').on('click', function(e) {
        e.preventDefault()
        onShowallLinkClicked()
    })

    $('#btn').on('click', function() {    
        
        insertContact({
            firstname: $('#firstname').val().trim(),
            lastname: $('#lastname').val().trim(),
            phoneNumber: $('#phoneNumber').val().trim()
        })
    })

    var debounceTimeout = null

    $('#searchInput').on('input', function() {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => getContactByPhoneNumber(this.value.trim()), 1500)
    })
    
})

function onInsertLinkClicked() {
    onBeforeSend()
    hideSearch()
    
    $('.insert-contact-form').removeClass('hidden')

}

function onSearchLinkClicked() {
    onBeforeSend()
    hideInsert()

    $('.search-wrapper').removeClass('hidden')
}

function onShowallLinkClicked() {
    onBeforeSend()
    hideSearch()
    hideInsert()
    
    if (!contacts.length) { 
        showError()
    } else {
        showAllContacts()
    }       
}


function showAllContacts() {
    buildContacts(contacts)
}



/**
 * Syncs the view with the model when a contact is inserted.
 * @param {Object} contact              the mobile contact to be inserted 
 * @param {String} contact.firstname    the first name of the mobile contact 
 * @param {String} contact.lastname     the last name of the mobile contact
 * @param {String} contact.phoneNumber  the phone number of the mobile contact
 * 
 * @returns {undefined}  transfers the control back to the caller
 *                       when input is empty empty
 */
function insertContact(contact) {
    hideAddContactError()
    resetFields()

    if ((!contact.firstname) || (!contact.lastname) || (!contact.phoneNumber)) {
        // show message
        return
    }
    
    // Forward to CRUD Service
    if (addToContacts(contact)) {
        onAddContactSuccess()
    } else {
        onAddContactError()
    }
}


function hideAddContactError() {
    $('.outer').find('.found-identical').remove()
}

function resetFields() {
    $('#firstname').val('')
    $('#lastname').val('')
    $('#phoneNumber').val('')
}

function onAddContactSuccess() {
    buildContacts(contacts)
}

function onAddContactError() {
    $('body > .found-identical').clone().removeClass('hidden').appendTo('.outer')   
}

/**
 * 
 * @param {String} phoneNumber - the phone number to search for 
 * @returns {undefined} returns to calling function when phone number is empty
 */
function getContactByPhoneNumber(phoneNumber) {
    onBeforeSend()
    $('#searchInput').val('')
    //$('#searchInput').attr('placeholder', 'Εισάγετε ένα νέο τηλέφωνο')  

    if (!phoneNumber) {
        showError()
        return
    }
    fetchContact(phoneNumber)
}

function onBeforeSend() {
    hideTable()
    hideError()
    hideAddContactError()
}

function fetchContact(phoneNumber) {
    let results = contacts.filter((contact) => contact.phoneNumber === phoneNumber)
    handleResults(results)
}

/**
 * 
 * @param {Array} results   the results provided by the search service 
 */
function handleResults(results) {
    if (!results.length) { 
        showError()
    } else {
        buildContacts(results)
    }       
}


/**
 * Assigns results to UI Elements
 * @param {Array} results   the results provided by the handler 
 */
function buildContacts(results) {
    hideTable()
    
    let outTable = `
        <tr>
            <th>Όνομα</th>
            <th>Επώνυμο</th>
            <th>Τηλέφωνο</th>
            <th>Delete<th>
        </tr>
    `

    for (let contact of results) {
        outTable += '<tr>'
        
        for (key of Object.keys(contact)) {
            outTable += `<td>${contact[key]}</td>`
        }
        
        let $deleteLink = $('<a>')
        $deleteLink.html('Delete')
        $deleteLink.attr('href', '#')
        $deleteLink.attr('onclick', `deleteContact(${JSON.stringify(contact)})`)    
        outTable += `<td>${$deleteLink.prop('outerHTML')}<td>` 
        outTable += '</tr>'
    }

        showTable(outTable)
}


/**
 * Deletes a mobile contact
 * @param {Object} contact  The mobile contact to delete 
 */
function deleteContact(contact) {
    if (!contact) {
        return
    }

    if (confirm('Are you sure?')) {
        deleteFromContacts(contact)
    }
    
    buildContacts(contacts)
}



function showTable(tableString) {
    let $cloned = $('body > .contacts-table').clone()
    $cloned.html(tableString)
    $cloned.appendTo($('.outer'))
}


function hideTable() {
    $('.outer').find('.contacts-table').remove()
}


function hideSearch() {
    $('.search-wrapper').addClass('hidden')
}

function hideInsert() {
    $('.insert-contact-form').addClass('hidden')
}


function showError() {
    $('body > .not-found').clone().removeClass('hidden').appendTo('.outer')
}

function hideError() {
    $('.outer').find('.not-found').remove()
}



/**
 * Adds a mobile contact.
 * @param {Object} contact - The mobile contact to be inserted
 * @param {string} contact.firstname - The first name of the contact
 * @param {string} contact.lastname - The lastname name of the contact 
 * @param {string} contact.phoneNumber - The phone number of the contact 
 */
function addToContacts(contact) {
    let foundContacts = contacts.filter((c) => c.phoneNumber === contact.phoneNumber)
    
    if (!foundContacts.length) {
        contacts.push(contact)
        return true;
    } else {
        return false;
    }   
}

/**
 * Deletes a mobile contact.
 * @param {Object} contact      The contact to be deleted 
 * @returns {Object}            The delete dcontact or empty object 
 */
function deleteFromContacts(contact) {
    let found = contacts.filter((item) => item.phoneNumber === contact.phoneNumber)
  
    if (found.length) {
        contacts = contacts.filter((item) => item.phoneNumber != contact.phoneNumber)
        return contact
    } else {
        return {}
    }
}
