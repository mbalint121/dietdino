describe("Like tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/login");
                cy.get('input[id="loginNameOrEmail"]').type('admin@testuser.com');
        cy.get('input[id="loginPassword"]').type('admin');
        cy.get('button[id="loginButton"]').click();
        cy.location('pathname').should('eq', '/');

        cy.get('a[id="recipesMenuOption"]').click({force: true});
        cy.location('pathname').should('eq', '/recipes');

        cy.contains('Palacsinta').should('be.visible').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));
    });

    it('Like recipe', () => {
        cy.get('button[id="likeButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Recept sikeresen kedvelve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
    });

    it('Unlike recipe', () => {
        cy.get('button[id="likeButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Kedvelés sikeresen eltávolítva');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
    });
});