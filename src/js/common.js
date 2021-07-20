const form = document.querySelector('.formWithValidation')
const validateBtn = form.querySelector('.validateBtn')
const from = form.querySelector('.from')
const password = form.querySelector('.password')
const passwordConfirmation = form.querySelector('.passwordConfirmation')
const where = form.querySelector('.where')
const message = form.querySelector('.message')
const fields = form.querySelectorAll('.field')

form.addEventListener('submit', submitForm)

const generateError = text => {
    const error = document.createElement('div')

    error.className = 'error'
    error.style.color = 'red'
    error.innerHTML = text

    return error
}

const removeValidation = () => {
    const errors = form.querySelectorAll('.error')

    Array.from(errors).forEach(error => {
        error.remove()
    })
}

const checkFieldsPresence = () => {
    Array.from(fields).forEach(item => {
        const error = generateError('Cannot be blank')

        item.parentElement.insertBefore(error, item)
    })
}

const checkPasswordMatch = () => {
    if (password.value !== passwordConfirmation.value) {
        const error = generateError('Password doesnt match')

        password.parentElement.insertBefore(error, password)
    }
}

function submitForm(e) {
    e.preventDefault()

    removeValidation()

    checkFieldsPresence()

    checkPasswordMatch()
}