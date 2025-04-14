describe("Login tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/login");
    });

    it('Login with correct username', () => {
        cy.get('input[id="loginNameOrEmail"]').type('TestAdmin');
        cy.get('input[id="loginPassword"]').type('admin');
    
        cy.get('button[id="loginButton"]').click();
    
        cy.get('p[id="popupMessage"]').should('contain', 'Sikeres bejelentkezés! Üdvözöllek az oldalon TestAdmin!');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
        cy.location('pathname').should('eq', '/');
    });

    it('Login with correct email', () => {
                cy.get('input[id="loginNameOrEmail"]').type('admin@testuser.com');
        cy.get('input[id="loginPassword"]').type('admin');
    
        cy.get('button[id="loginButton"]').click();
    
        cy.get('p[id="popupMessage"]').should('contain', 'Sikeres bejelentkezés! Üdvözöllek az oldalon TestAdmin!');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
        cy.location('pathname').should('eq', '/');
    });
})