describe("Logout tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/login");
        cy.get('input[id="loginNameOrEmail"]').type('cypresuser@testuser.com');
        cy.get('input[id="loginPassword"]').type('user');
        cy.get('button[id="loginButton"]').click();
        cy.location('pathname').should('eq', '/');
    });

    it('Logout - passed', () => {
        cy.get('a[id="logoutMenuOption"]').click();
        cy.get('p[id="popupMessage"]').should('contain', 'Sikeres kijelentkezés!');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
        cy.location('pathname').should('eq', '/login');
    });
});