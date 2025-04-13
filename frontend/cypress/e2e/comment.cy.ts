describe("Comment tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/login");
        cy.get('input[id="loginNameOrEmail"]').type('cypresuser@testuser.com');
        cy.get('input[id="loginPassword"]').type('user');
        cy.get('button[id="loginButton"]').click();
        cy.location('pathname').should('eq', '/');

        cy.get('a[id="recipesMenuOption"]').click({force: true});
        cy.location('pathname').should('eq', '/recipes');

        cy.contains('Elfogadott Recept').should('be.visible').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));
    });

    it('Add new comment', () => {
        cy.get('textarea[id="commentText"]').type('Test comment for recipe');
        cy.get('button[id="addCommentButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Komment sikeresen feltöltve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.contains('Test comment for recipe').should('be.visible');
    });

    it('Edit comment', () => {
        cy.get('button[id="editCommentButton"]').first().click();
        cy.get('textarea[id="commentTextarea"]').clear().type('Edited test comment for recipe');
        cy.get('button[id="confirmEditButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Sikeres szerkesztés');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.contains('Edited test comment for recipe').should('be.visible');
    });

    it('Cancel comment edit', () => {
        cy.get('button[id="editCommentButton"]').first().click();
        cy.get('textarea[id="commentTextarea"]').clear().type('Edited test comment for recipe that will be cancelled');

        cy.get('button[id="cancelEditButton"]').click();

        cy.contains('Edited test comment for recipe').should('be.visible');
    });

    it('Delete comment', () => {
        cy.get('button[id="deleteCommentButton"]').first().click();
        cy.get('button[id="confirmButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Komment sikeresen törölve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.contains('Edited test comment for recipe').should('not.exist');
    });
});