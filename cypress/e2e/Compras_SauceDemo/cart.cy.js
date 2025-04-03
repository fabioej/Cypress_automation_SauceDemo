describe('Teste Carrinho de compras', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.get('#user-name').type(Cypress.env('usuario'))
        cy.get('#password').type(Cypress.env('senha'))
        cy.get('#login-button').click()
        // ### PROCEEDING THE LOGIN BEFORE EACH TEST CASE ###
        // ### EFETUANDO O LOGIN ANTES DE CADA TEST CASE ###
      })

    // Seleciona produtos para o carrinho e garante que os dados do produto estao sendo preenchidos corretamente
    // e os elementos da tela estão sendo listados corretamente
    it('Cart Page - Populate the cart and verify fields', () => {
        cy.selectProductsFromFixture('productsList', 'select_3_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.verifyProductListFieldsAtCart('productsList','cart_data')
        //verifica se elementos da tela estão sendo listados
        cy.fixture('cart_data').then((product) =>  {
            cy.get('[data-test="title"]').should('have.text',product.cart_title)
            cy.get('.cart_list .cart_quantity_label').should('have.text',product.cart_label_qty)
            cy.get('.cart_list .cart_desc_label').should('have.text',product.cart_label_description)
            cy.get('.cart_footer .back').should('have.text',product.button_continueShopping)
            cy.get('.cart_footer .checkout_button').should('have.text',product.button_checkout)
        })
    })

    it('Cart Page - Populate the cart with 3 elements and verify fields', () => {
        cy.selectProductsFromFixture('productsList', 'select_3_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.verifyProductListFieldsAtCart('productsList','cart_data')
        //verifica se elementos da tela estão sendo listados
        cy.fixture('cart_data').then((product) =>  {
            cy.get('[data-test="title"]').should('have.text',product.cart_title)
            cy.get('.cart_list .cart_quantity_label').should('have.text',product.cart_label_qty)
            cy.get('.cart_list .cart_desc_label').should('have.text',product.cart_label_description)
            cy.get('.cart_footer .back').should('have.text',product.button_continueShopping)
            cy.get('.cart_footer .checkout_button').should('have.text',product.button_checkout)
        })
    })

    it('Cart Page - Populate the cart with 5 elements and verify fields', () => {
        cy.selectProductsFromFixture('productsList', 'select_5_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.verifyProductListFieldsAtCart('productsList','cart_data')
        //verifica se elementos da tela estão sendo listados
        cy.fixture('cart_data').then((product) =>  {
            cy.get('[data-test="title"]').should('have.text',product.cart_title)
            cy.get('.cart_list .cart_quantity_label').should('have.text',product.cart_label_qty)
            cy.get('.cart_list .cart_desc_label').should('have.text',product.cart_label_description)
            cy.get('.cart_footer .back').should('have.text',product.button_continueShopping)
            cy.get('.cart_footer .checkout_button').should('have.text',product.button_checkout)
        })
    })

    // seleciona elementos e verifica campos da tela de Checkout
    it('Cart Page - Select 5 elements and go to checkout page', () => {
        cy.selectProductsFromFixture('productsList', 'select_5_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.get('.cart_footer #checkout').click()
        cy.fixture('cart_data').then((cartItem) => {
            cy.get('[data-test="title"]').should('have.text', cartItem.title_AddressData)
            cy.get('#first-name').should('have.attr', 'placeholder', cartItem.form_FirstName)
            cy.get('#last-name').should('have.attr', 'placeholder', cartItem.form_LastName)
            cy.get('#postal-code').should('have.attr', 'placeholder', cartItem.form_zipCode)
            cy.get('#cancel').should('have.text', cartItem.button_Cancel)
            cy.get('#continue').should('have.value', cartItem.button_Continue)
        })
        
        //click cancel e verifique que volta a pagina com a lista de elementos do carrinho
        cy.get('#cancel').click()
        cy.fixture('cart_data').then((product) =>  {
            cy.get('[data-test="title"]').should('have.text',product.cart_title)
        })

    })

    // seleciona 5 elementos e avança ate a tela de checkout da compra e verifica os campos listados
    it('Cart Page - Select 5 elements and proceed with the purchase until checkout page and verify the fields', () => {
        cy.selectProductsFromFixture('productsList', 'select_5_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.get('.cart_footer #checkout').click()
        // fornecendo dados de envio e clicando em continuar
        cy.fixture('cart_data').then((cart) => {
            cy.get('#first-name').type(cart.nome)
            cy.get('#last-name').type(cart.sobrenome)
            cy.get('#postal-code').type(cart.cep)
            cy.get('#continue').click()
        })
        //verifica o conteudo dos elementos listados na tela de checkout
        cy.verifyProductListFieldsAtCheckoutPage('productsList')
        
        // *** verifica se elementos estao sendo listados como esperado e na sequencia esperada
        cy.fixture('cart_data').then((cartItem) => {
            
            //Verifica campos payment information ***
            cy.get('[data-test="payment-info-label"]')
                    .should('have.text',cartItem.payment_Info)
                    .next()
                    .should('contain',cartItem.payment_Data)
            
            //Verifica campos Shipping information
            cy.get('[data-test="shipping-info-label"]')
                    .should('have.text',cartItem.shipping_Info)
                    .next()
                    .should('contain',cartItem.shipping_Data)

            //Verifica campos Payment
            cy.get('[data-test="total-info-label"]')
                    .should('have.text',cartItem.price)
                    .next()
                    .should('contain',cartItem.itemTotal)
                    .next()
                    .should('contain',cartItem.tax)
        }) // *** END - Verifica campos payment information ***
        
        //verificar se valor Item Total é a soma dos itens
        Cypress.env('totalPrecoItens', 0)
        cy.totalSumOfProductValues('productsList')
        const novoValor = Cypress.env('totalPrecoItens');
        //verificar se valor Item Total é a soma dos itens + tax
    })

    // seleciona 3 elementos e avança ate a tela de checkout da compra e verifica os campos listados
    it('Cart Page - Select 3 elements and proceed with the purchase until checkout page and verify the fields', () => {
        cy.selectProductsFromFixture('productsList', 'select_3_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.get('.cart_footer #checkout').click()
        // fornecendo dados de envio e clicando em continuar
        cy.fixture('cart_data').then((cart) => {
            cy.get('#first-name').type(cart.nome)
            cy.get('#last-name').type(cart.sobrenome)
            cy.get('#postal-code').type(cart.cep)
            cy.get('#continue').click()
        })
        //verifica o conteudo dos elementos listados na tela de checkout
        cy.verifyProductListFieldsAtCheckoutPage('productsList')
        
        // *** verifica se elementos estao sendo listados como esperado e na sequencia esperada
        cy.fixture('cart_data').then((cartItem) => {
            
            //Verifica campos payment information ***
            cy.get('[data-test="payment-info-label"]')
                    .should('have.text',cartItem.payment_Info)
                    .next()
                    .should('contain',cartItem.payment_Data)
            
            //Verifica campos Shipping information
            cy.get('[data-test="shipping-info-label"]')
                    .should('have.text',cartItem.shipping_Info)
                    .next()
                    .should('contain',cartItem.shipping_Data)

            //Verifica campos Payment
            cy.get('[data-test="total-info-label"]')
                    .should('have.text',cartItem.price)
                    .next()
                    .should('contain',cartItem.itemTotal)
                    .next()
                    .should('contain',cartItem.tax)
        }) // *** END - Verifica campos payment information ***
        
        //verificar se valor Item Total é a soma dos itens
        Cypress.env('totalPrecoItens', 0)
        cy.totalSumOfProductValues('productsList')
        const novoValor = Cypress.env('totalPrecoItens');
        //verificar se valor Item Total é a soma dos itens + tax
    })

    // seleciona 1 elemento e avança ate a tela de checkout da compra e verifica os campos listados
    it('Cart Page - Select 1 element and proceed with the purchase until checkout page and verify the fields', () => {
        cy.selectProductsFromFixture('productsList', 'select_1_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.get('.cart_footer #checkout').click()
        // fornecendo dados de envio e clicando em continuar
        cy.fixture('cart_data').then((cart) => {
            cy.get('#first-name').type(cart.nome)
            cy.get('#last-name').type(cart.sobrenome)
            cy.get('#postal-code').type(cart.cep)
            cy.get('#continue').click()
        })
        //verifica o conteudo dos elementos listados na tela de checkout
        cy.verifyProductListFieldsAtCheckoutPage('productsList')
        
        // *** verifica se elementos estao sendo listados como esperado e na sequencia esperada
        cy.fixture('cart_data').then((cartItem) => {
            
            //Verifica campos payment information ***
            cy.get('[data-test="payment-info-label"]')
                    .should('have.text',cartItem.payment_Info)
                    .next()
                    .should('contain',cartItem.payment_Data)
            
            //Verifica campos Shipping information
            cy.get('[data-test="shipping-info-label"]')
                    .should('have.text',cartItem.shipping_Info)
                    .next()
                    .should('contain',cartItem.shipping_Data)

            //Verifica campos Payment
            cy.get('[data-test="total-info-label"]')
                    .should('have.text',cartItem.price)
                    .next()
                    .should('contain',cartItem.itemTotal)
                    .next()
                    .should('contain',cartItem.tax)
        }) // *** END - Verifica campos payment information ***
        
        //verificar se valor Item Total é a soma dos itens
        Cypress.env('totalPrecoItens', 0)
        cy.totalSumOfProductValues('productsList')
        const novoValor = Cypress.env('totalPrecoItens');
        //verificar se valor Item Total é a soma dos itens + tax
    })

    // seleciona 1 elemento, efetua a compra e verifica os campos de confirmacao
    it('Cart Page - Select 1 element and proceed with the purchase process', () => {
        cy.selectProductsFromFixture('productsList', 'select_1_products')
        cy.get('#shopping_cart_container .shopping_cart_link').click()
        cy.get('.cart_footer #checkout').click()
        // fornecendo dados de envio e clicando em continuar
        cy.fixture('cart_data').then((cart) => {
            cy.get('#first-name').type(cart.nome)
            cy.get('#last-name').type(cart.sobrenome)
            cy.get('#postal-code').type(cart.cep)
            cy.get('#continue').click()
        })
       
        
        // *** Clica para efetuar a compra (Finish)
        cy.get('#finish').click()

        //Verificar mensagem de confirmacao da compra
        cy.fixture('cart_data').then((cart) => {
            cy.get('[data-test="complete-header"]').should('have.text',cart.purchase_success_message)
            cy.get('[data-test="complete-text"]').should('have.text',cart.package_message)
            cy.get('[data-test="back-to-products"]').should('have.text',"Back Home")
        })
    })

        // seleciona 5 elemento, efetua a compra e verifica os campos de confirmacao
        it('Cart Page - Select 5 elements and proceed with the purchase process', () => {
            cy.selectProductsFromFixture('productsList', 'select_5_products')
            cy.get('#shopping_cart_container .shopping_cart_link').click()
            cy.get('.cart_footer #checkout').click()
            // fornecendo dados de envio e clicando em continuar
            cy.fixture('cart_data').then((cart) => {
                cy.get('#first-name').type(cart.nome)
                cy.get('#last-name').type(cart.sobrenome)
                cy.get('#postal-code').type(cart.cep)
                cy.get('#continue').click()
            })
           
            
            // *** Clica para efetuar a compra (Finish)
            cy.get('#finish').click()
    
            //Verificar mensagem de confirmacao da compra
            cy.fixture('cart_data').then((cart) => {
                cy.get('[data-test="complete-header"]').should('have.text',cart.purchase_success_message)
                cy.get('[data-test="complete-text"]').should('have.text',cart.package_message)
                cy.get('[data-test="back-to-products"]').should('have.text',"Back Home")
            })
        })

})