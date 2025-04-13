describe("Favorite tests", () => {
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

    it('Add recipe to favorites', () => {
        cy.get('button[id="favoriteButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Recept sikeresen a kedvencekhez adva');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.get('a[id="favoriteRecipesMenuOption"]').click({force: true});
        cy.location('pathname').should('eq', '/my-favorite-recipes');

        cy.contains('Elfogadott Recept').should('be.visible');
    });

    it('Remove recipe from favorites', () => {
        cy.get('button[id="favoriteButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Recept sikeresen eltávolítva a kedvencek közül');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.get('a[id="favoriteRecipesMenuOption"]').click({force: true});
        cy.location('pathname').should('eq', '/my-favorite-recipes');

        cy.contains('Nem találtunk recepteket').should('be.visible');
    });
});