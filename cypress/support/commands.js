// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('selectProductsFromFixture', (fixturePath, fixtureKey) => {
  cy.get('.inventory_item_name').then(($names) => {
    // Obtém a lista atual de nomes de produtos
    const productNames = Cypress._.map($names, 'innerText')

    // Itera sobre cada produto
    Cypress._.each(productNames, (name, index) => {
      cy.get('#inventory_container .inventory_item_name')
        .eq(index)
        .then(($el) => {
          const productToBeSelected = $el.text().trim()

          // Carrega o fixture e verifica se o produto deve ser selecionado
          cy.fixture(fixturePath).then((produtos) => {
            const selecionarProduto = produtos[fixtureKey].some(
              (produto) => produto.product === productToBeSelected
            )

            // Se o produto estiver na lista do fixture, clica no botão
            if (selecionarProduto) {
              cy.get('#inventory_container .btn_inventory').eq(index).click()
            }
          })
        })
    })
  })
})

Cypress.Commands.add('verifyProductListFieldsAtCart', (productsList, cartList) => {
  //substituir " " espaçamentos por "_" e colocar todas as letras como minusculas
  cy.get('.cart_list .inventory_item_name').each(($item) => {
    cy.wrap($item)
      .invoke('text')
      .then((text) => {
        const titulo = text.trim().replace(/\s+/g, '_').toLowerCase();
        //verifica campos 
        cy.fixture(productsList).then((product) => {
          cy.wrap($item).should('have.text', product[titulo].productName)
          const $parent = $item.parents('.cart_item');
          cy.wrap($parent).find('.inventory_item_desc').should('have.text', product[titulo].description)
          cy.wrap($parent).find('.inventory_item_price').should('have.text', "$" + product[titulo].price)
          //verify button
          cy.fixture(cartList).then((cartItem) => {
            cy.wrap($parent).find('.cart_button').should('have.text', cartItem.button_RemoveFromCart)
          })
        })
      })
  })
})

Cypress.Commands.add('verifyProductListFieldsAtCheckoutPage', (productsList) => {
  //substituir " " espaçamentos por "_" e colocar todas as letras como minusculas
  cy.get('.cart_list .inventory_item_name').each(($item) => {
    cy.wrap($item)
      .invoke('text')
      .then((text) => {
        const titulo = text.trim().replace(/\s+/g, '_').toLowerCase();
        //verifica campos 
        cy.fixture(productsList).then((product) => {
          cy.wrap($item).should('have.text', product[titulo].productName)
          const $parent = $item.parents('.cart_item');
          cy.wrap($parent).find('.inventory_item_desc').should('have.text', product[titulo].description)
          cy.wrap($parent).find('.inventory_item_price').should('have.text', "$" + product[titulo].price)
        })
      })
  })
})

Cypress.Commands.add('totalSumOfProductValues', (productsList) => {
  //substituir " " espaçamentos por "_" e colocar todas as letras como minusculas
  cy.get('.cart_list .inventory_item_name').each(($item) => {
    cy.wrap($item)
      .invoke('text')
      .then((text) => {
        const titulo = text.trim().replace(/\s+/g, '_').toLowerCase();
        const $parent = $item.parents('.cart_item');
        cy.wrap($parent).find('.inventory_item_price').invoke('text').then((valorProduto) => {
          const valorNumerico = parseFloat(valorProduto.trim().replace('$', ''))
          
          //armazenando em uma variavel global para nao perder valores
          const valorAtual = Cypress.env('totalPrecoItens');
          const novoTotal = valorAtual + valorNumerico;
          Cypress.env('totalPrecoItens', novoTotal); // Atualiza a variável de ambiente com novo valor
        })
      })
  }).then(() => {
    // verifica somatorio dos valores dos elementos
    const valorFinal = Cypress.env('totalPrecoItens');
    cy.get('[data-test="subtotal-label"]').should('contain', valorFinal)
    // obtendo valor de tax
    cy.get('[data-test="tax-label"]')
          .invoke('text')
          .then((tax) => {
            const taxa =  parseFloat( tax.match(/\d+\.?\d*/)[0] )
            var valorCompra = taxa + valorFinal
            //verificando valor total é o esperado ValorProdutos + tax
            cy.get('[data-test="total-label"]').should('contain', valorCompra.toFixed(2))
          })
  })
})