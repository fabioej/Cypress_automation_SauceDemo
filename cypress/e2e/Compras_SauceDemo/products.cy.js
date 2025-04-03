describe('Teste de Produtos', () => {

beforeEach(() => {
    cy.visit('/')
    cy.get('#user-name').type(Cypress.env('usuario'))
    cy.get('#password').type(Cypress.env('senha'))
    cy.get('#login-button').click()
    // ### PROCEEDING THE LOGIN BEFORE EACH TEST CASE ###
    // ### EFETUANDO O LOGIN ANTES DE CADA TEST CASE ###
  })

//verifica todos os campos da pagina de login estao de acordo com o portifolio esperado
it('Product Page - Verify if expected inventory fields for standard user are being displayed', () => {
  
  //substituir " " espaçamentos por "_" e colocar todas as letras como minusculas
  cy.get('.inventory_list .inventory_item').each(($item) => {
    const titulo = $item.find('.inventory_item_name').text().trim().replace(/\s+/g, '_').toLowerCase()
    cy.log("title: ", titulo)
    //verificar se valores dos campos estao de acordo com o item listado
    cy.fixture('productsList').then((product) =>  {
      cy.wrap($item).find('.inventory_item_desc').should('have.text',product[titulo].description)
      cy.wrap($item).find('.inventory_item_price').should('have.text',"$" + product[titulo].price)
      //verify button
      cy.wrap($item).find('button.btn_inventory').should('have.text', product.button_AddToCart)
     })
  })
})

//verificar se pagina detalhada de cada produto esta de acordo com o documento de portifolio
it('Product Page - Verify if detailed pages of each product are according with expected inventory information', () => {
    //Obtendo todos os elementos presentes na tela
    cy.get('.inventory_item_name').then(($names) => {
      const productNames = Cypress._.map($names, 'innerText');

      Cypress._.each(productNames, (name, index) => {
        const titulo = name.trim().replace(/\s+/g, '_').toLowerCase()
        
        cy.get('.inventory_item_name').eq(index).click()

        //  verifica se produtos estao de acordo com o descrito no portifolio 
        cy.fixture('productsList').then((products) => {
          cy.get('.inventory_details_name').should('have.text', products[titulo].productName)
          cy.get('.inventory_details_desc').should('have.text', products[titulo].description)
          cy.get('.inventory_details_price').should('contain', products[titulo].price)
        });
        //  Verificar se botao voltar existe e voltar para a pagina com toda a lista dos produtos
        cy.get('#back-to-products').should('be.visible').click();
        cy.get('.inventory_list').should('be.visible');
        cy.get('.inventory_item_name').should('have.length', productNames.length)
      })
    })
  })

//verifica o filtro crescente dos produtos da pagina
it('Product Page - Filter - Verify the ascending filter function', () => {
    //Obtendo todos os elementos presentes na tela
    cy.get('.inventory_item_name').then(($names) => {
      //obtem atual lista de elementos e organiza na ordem crescente
      const productNames = Cypress._.map($names, 'innerText');
      const ascendingList =  Cypress._.sortBy(productNames)

      //seleciona filtro em ordem crescente , neste caso valor 'az'
      cy.get('.header_secondary_container .product_sort_container').select('az')

      Cypress._.each(ascendingList, (name, index) => {
        cy.log('Product Name: ', name )
        cy.log('Index: ', index+1 )
        cy.get('#inventory_container .inventory_item_name').eq(index).should('have.text',name)
      })
    })
  })

//verifica o filtro decrescente dos produtos da pagina
it('Product Page - Filter - Verify the ascending filter function', () => {
  //Obtendo todos os elementos presentes na tela
  cy.get('.inventory_item_name').then(($names) => {
    //obtem atual lista de elementos e organiza na ordem decrescente
    const productNames = Cypress._.map($names, 'innerText');
    const descendingList =  Cypress._.sortBy(productNames).reverse()

    //seleciona filtro em ordem crescente , neste caso valor 'az'
    cy.get('.header_secondary_container .product_sort_container').select('za')

    Cypress._.each(descendingList, (name, index) => {
      cy.log('Product Name: ', name )
      cy.log('Index: ', index+1 )
      cy.get('#inventory_container .inventory_item_name').eq(index).should('have.text',name)
    })
  })
})

//verifica o filtro de Preço do mais barato para o mais caro
it('Product Page - Filter - Sort by low price to high', () => {
  //Obtendo todos os elementos presentes na tela
  cy.get('.inventory_list .inventory_item_price').then(($prices) => {
    //obtem atual lista de precos e organiza na ordem crescente
    const productPrices = Cypress._.map($prices, 'innerText');
    //convertendo a float e removendo cifrao $
    const numericPrices = productPrices.map(p => parseFloat(p.replace('$', '')));
    
    const ascendingPrices =  Cypress._.sortBy(numericPrices)

    //seleciona filtro em ordem crescente , neste caso valor 'az'
    cy.get('.header_secondary_container .product_sort_container').select('lohi')

    Cypress._.each(ascendingPrices, (price, index) => {
      cy.log('Product Name: ', price )
      cy.log('Index: ', index+1 )
      cy.get('#inventory_container .inventory_item_price').eq(index).should('contain',price)
    })
  })
})

//verifica o filtro de Preço do mais caro para o mais barato
it('Product Page - Filter - Sort by high price to low', () => {
  //Obtendo todos os elementos presentes na tela
  cy.get('.inventory_list .inventory_item_price').then(($prices) => {
    //obtem atual lista de precos e organiza na ordem crescente
    const productPrices = Cypress._.map($prices, 'innerText');
    //convertendo a float e removendo cifrao $
    const numericPrices = productPrices.map(p => parseFloat(p.replace('$', '')));
    
    const descendingPrices =  Cypress._.sortBy(numericPrices).reverse()

    //seleciona filtro em ordem crescente , neste caso valor 'az'
    cy.get('.header_secondary_container .product_sort_container').select('hilo')

    Cypress._.each(descendingPrices, (price, index) => {
      cy.log('Product Name: ', price )
      cy.log('Index: ', index+1 )
      cy.get('#inventory_container .inventory_item_price').eq(index).should('contain',price)
    })
  })
})

//verificar que carrinho atualiza valores ao selecionar items e remover itens
it('Product Page - Verify selected products number at cart icon indication', () => {
  //Obtendo todos os elementos presentes na tela
  cy.get('.inventory_item_name').then(($names) => {
    //obtem atual lista de elementos e organiza na ordem decrescente
    const productNames = Cypress._.map($names, 'innerText');

    //verificar que não tem elementos no carrinho
    cy.get('a.shopping_cart_link .shopping_cart_badge').should('not.exist')
    var count = 0;
    
    // ### Verifica valores ao acrescentar itens ao carrinho ###
    Cypress._.each(productNames, (name, index) => {
      cy.get('#inventory_container .inventory_item_name').eq(index).then(($el) => {
        const productToBeSelected = $el.text();

        cy.fixture('productsList').then((produtos) => {
          const selecionarProduto = produtos.select_3_products
                                    .some(produto => produto.product === productToBeSelected )
          if(selecionarProduto) {
            count += 1;
            cy.get('#inventory_container .btn_inventory').eq(index).click()
            cy.get('a.shopping_cart_link .shopping_cart_badge').should('have.text', count)
          }
        })
      })  
    })

    // ### Verifica valores ao remover itens ao carrinho ###
    Cypress._.each(productNames, (name, index) => {
      cy.get('#inventory_container .inventory_item_name').eq(index).then(($el) => {
        const productToBeSelected = $el.text();

        cy.fixture('productsList').then((produtos) => {
          const selecionarProduto = produtos.select_3_products
                                    .some(produto => produto.product === productToBeSelected )
          if(selecionarProduto) {
            count -= 1;
            cy.get('#inventory_container .btn_inventory').eq(index).click()
            if(count > 0){
              cy.get('a.shopping_cart_link .shopping_cart_badge').should('have.text', count)
            }
            else{
              cy.get('a.shopping_cart_link .shopping_cart_badge').should('not.exist')
            }
          }
        })
      })  
    })
  })
})

//verifica todos os campos da pagina de login estao de acordo com o portifolio esperado
it('Product Page - Verify if expected inventory fields for standard user are being displayed', () => {
  
  //substituir " " espaçamentos por "_" e colocar todas as letras como minusculas
  cy.get('.inventory_list .inventory_item').each(($item) => {
    const titulo = $item.find('.inventory_item_name').text().trim().replace(/\s+/g, '_').toLowerCase()
    cy.log("title: ", titulo)
    //verificar se valores dos campos estao de acordo com o item listado
    cy.fixture('productsList').then((product) =>  {
      cy.wrap($item).find('.inventory_item_desc').should('have.text',product[titulo].description)
      cy.wrap($item).find('.inventory_item_price').should('have.text',"$" + product[titulo].price)
      //verify button
      cy.wrap($item).find('button.btn_inventory').should('have.text', product.button_AddToCart)
     })
  })
})


})// ### END -  describe('Teste de Produtos'

 