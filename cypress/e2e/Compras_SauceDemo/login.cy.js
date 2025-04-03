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
  cy.fixture('login_data').then((loginData) =>  {
   cy.get('h3').filter('[data-test="error"]').should('have.text', loginData.error_messages.username_required_message)
  })
})

//verifica se nao é possivel logar fornecendo apenas nome de usuario
it('Login Page - Verify if should not be possible to login when type only login name', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.get('#login-button').click()
  cy.fixture('login_data').then((loginData) =>  {
    cy.get('h3').filter('[data-test="error"]').should('have.text', loginData.error_messages.password_required_message)
   })
})

//verifica se nao é possivel logar fornecendo nome de usuario existente e password incorreto
it('Login Page - Verify if should not be possible to login when type existent login name and wrong password', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.fixture('login_data').then((loginData) => {
    cy.get('#password').type(loginData.invalidUser.password)
    cy.get('#login-button').click()
    cy.get('h3').filter('[data-test="error"]').should('have.text', loginData.error_messages.wrong_credentials_message)
  })
})

//verifica se nao é possivel logar fornecendo nome de usuario inexistente e um password existente
it('Login Page - Verify if should not be possible to login when type not existent login name and one existent password', () => {
  cy.fixture('login_data').then((loginData) => {
    cy.get('#user-name').type(loginData.invalidUser.username)
    cy.get('#password').type(Cypress.env('senha'))
    cy.get('#login-button').click()
    cy.get('h3').filter('[data-test="error"]').should('have.text', loginData.error_messages.wrong_credentials_message)
  })
}) 
 


//verifica se nao é possivel logar fornecendo nome de usuario existente acrescido de um caracter e um password existente
it('Login Page - Verify if should not be possible to login when type existent login name + one character and one existent password', () => {
  cy.get('#user-name').type(Cypress.env('usuario')+'a')
  cy.get('#password').type(Cypress.env('senha'))
  cy.get('#login-button').click()
  cy.fixture('login_data').then((loginData) => {
    cy.get('h3').filter('[data-test="error"]').should('have.text', loginData.error_messages.wrong_credentials_message)
  })
})

//verifica se nao é possivel logar fornecendo nome de usuario existente acrescido de um caracter e um password existente
it('Login Page - Verify if should not be possible to login when type existent login name and one existent password + one character', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.get('#password').type(Cypress.env('senha') + '7')
  cy.get('#login-button').click()
  cy.fixture('login_data').then((loginData) => {
    cy.get('h3').filter('[data-test="error"]').should('have.text', loginData.error_messages.wrong_credentials_message)
  })
})

//verifica se é possivel logar normalmente com usuario e senhas corretos
it('Login Page - Verify if should be possible to login', () => {
  cy.get('#user-name').type(Cypress.env('usuario'))
  cy.get('#password').type(Cypress.env('senha'))
  cy.get('#login-button').click()
  cy.get('.inventory_container').should('be.visible')
})

