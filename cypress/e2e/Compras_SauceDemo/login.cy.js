beforeEach(() => {
    cy.visit('/')
  })

//verifica todos os campos da pagina de login  
it('Login Page - Verify if fields are being displayed', () => {
    cy.get('.login_logo').should('have.text', 'Swag Labs')
    cy.get('#user-name').should('have.attr', 'placeholder' , 'Username')
    cy.get('#password').should('have.attr', 'placeholder' , 'Password')
    cy.get('#login-button').should('have.value', 'Login')
})

//verifica se nao é possivel logar sem fornecer usuario e senha
it('Login Page - Verify if should not be possible to login without username and password', () => {
  cy.get('#login-button').click()
  cy.get('h3').filter('[data-test="error"]').should('have.text', 'Epic sadface: Username is required')
})

//verifica se nao é possivel logar fornecendo apenas nome de usuario
it('Login Page - Verify if should not be possible to login when type only login name', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.get('#login-button').click()
  cy.get('h3').filter('[data-test="error"]').should('have.text', 'Epic sadface: Password is required')
})

//verifica se nao é possivel logar fornecendo nome de usuario existente e password incorreto
it('Login Page - Verify if should not be possible to login when type existent login name and wrong password', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.get('#password').type('12345678')
  cy.get('#login-button').click()
  cy.get('h3').filter('[data-test="error"]').should('have.text', 'Epic sadface: Username and password do not match any user in this service')
})

//verifica se nao é possivel logar fornecendo nome de usuario inexistente e um password existente
it('Login Page - Verify if should not be possible to login when type not existent login name and one existent password', () => {
  cy.get('#user-name').type('TestUser1')
  cy.get('#password').type(Cypress.env('senha'))
  cy.get('#login-button').click()
  cy.get('h3').filter('[data-test="error"]').should('have.text', 'Epic sadface: Username and password do not match any user in this service')
})

//verifica se nao é possivel logar fornecendo nome de usuario existente acrescido de um caracter e um password existente
it('Login Page - Verify if should not be possible to login when type existent login name + one character and one existent password', () => {
  cy.get('#user-name').type(Cypress.env('usuario')+'a')
  cy.get('#password').type(Cypress.env('senha'))
  cy.get('#login-button').click()
  cy.get('h3').filter('[data-test="error"]').should('have.text', 'Epic sadface: Username and password do not match any user in this service')
})

//verifica se nao é possivel logar fornecendo nome de usuario existente acrescido de um caracter e um password existente
it('Login Page - Verify if should not be possible to login when type existent login name and one existent password + one character', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.get('#password').type(Cypress.env('senha') + '7')
  cy.get('#login-button').click()
  cy.get('h3').filter('[data-test="error"]').should('have.text', 'Epic sadface: Username and password do not match any user in this service')
})

//verifica se é possivel logar normalmente com usuario e senhas corretos
it('Login Page - Verify if should be possible to login', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.get('#password').type(Cypress.env('senha'))
  cy.get('#login-button').click()
  cy.get('.inventory_container').should('be.visible')
})

