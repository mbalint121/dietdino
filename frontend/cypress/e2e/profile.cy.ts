describe("Profile tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/login");
                cy.get('input[id="loginNameOrEmail"]').type('admin@testuser.com');
        cy.get('input[id="loginPassword"]').type('admin');
        cy.get('button[id="loginButton"]').click();
        cy.location('pathname').should('eq', '/');

        cy.get('a[id="profileMenuOption"]').click();
        cy.location('pathname').should('eq', '/profile');
    });

    it('Profile edit', () => {
        cy.get('button[id="editProfileButton"]').click();
            
        cy.get('input[id="username"]').clear().type('EditedAdmin');
        
        cy.get('button[id="saveEditButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Felhasználó sikeresen módosítva');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.get('button[id="editProfileButton"]').click();

        cy.get('input[id="username"]').clear().type('TestAdmin');

        cy.get('button[id="saveEditButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Felhasználó sikeresen módosítva');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');
    });

    it('Cancel profile edit', () => {
        cy.get('button[id="editProfileButton"]').click();
        cy.get('input[id="username"]').clear().type('EditedAdmin');
        cy.get('button[id="cancelEditButton"]').click();
    });

    it('Cancel profile deletion', () => {
        cy.get('button[id="deleteProfileButton"]').click();

        cy.get('button[id="cancelButton"]').click();
    });
    
    it('Profile deletion', () => {
        cy.get('button[id="deleteProfileButton"]').click();

        cy.get('button[id="confirmButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Admin felhasználó nem törölheti önmagát');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-yellow-600').and('have.class', 'bg-yellow-100').and('have.class', 'text-yellow-600');
    });
});