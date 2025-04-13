describe("Profile tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/login");
        cy.get('input[id="loginNameOrEmail"]').type('cypresuser@testuser.com');
        cy.get('input[id="loginPassword"]').type('user');
        cy.get('button[id="loginButton"]').click();
        cy.location('pathname').should('eq', '/');

        cy.get('a[id="profileMenuOption"]').click();
        cy.location('pathname').should('eq', '/profile');
    });

    it('Profile edit - passed', () => {
        cy.get('button[id="editProfileButton"]').click();
        cy.get('input[id="username"]').clear().type('EditedTestUser');

        cy.get('button[id="saveEditButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Felhasználó sikeresen frissítve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
    });

    it('Cancel profile edit - passed', () => {
        cy.get('button[id="editProfileButton"]').click();
        cy.get('input[id="username"]').clear().type('EditedTestUser');
        cy.get('button[id="cancelEditButton"]').click();
    });

    it('Cancel profile deletion - passed', () => {
        cy.get('button[id="deleteProfileButton"]').click();

        cy.get('button[id="cancelButton"]').click();
    });
    
    it('Profile deletion - passed', () => {
        cy.get('button[id="deleteProfileButton"]').click();

        cy.get('button[id="confirmButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Felhasználó sikeresen törölve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
        cy.location('pathname').should('eq', '/login');
    });
});