describe("Recipe tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/login");
                cy.get('input[id="loginNameOrEmail"]').type('admin@testuser.com');
        cy.get('input[id="loginPassword"]').type('admin');
        cy.get('button[id="loginButton"]').click();
        cy.location('pathname').should('eq', '/');

        cy.get('a[id="myRecipesMenuOption"]').click({force: true});
        cy.location('pathname').should('eq', '/my-recipes');
    });

    it('Upload draft recipe', () => {
        cy.get('button[id="uploadRecipeButton"]').click();
        cy.location('pathname').should('eq', '/upload-recipe');

        cy.get('input[id="recipeName"]').type('Test Draft Recipe');
        cy.get('input[id="recipePrepTimeHour"]').clear().type('1');
        cy.get('input[id="recipePrepTimeMinute"]').type('30');

        cy.get('button[id="AddIngredientButton"]').click();

        cy.get('select[id="recipeIngredient0"]').select(0);
        cy.get('input[id="recipeMeasureAmount0').type('1');
        cy.get('select[id="recipeMeasure0"]').select(2);

        cy.get('button[id="AddIngredientButton"]').click();

        cy.get('select[id="recipeIngredient1"]').select(1);
        cy.get('input[id="recipeMeasureAmount1"]').type('2');
        cy.get('select[id="recipeMeasure1"]').select(2);
        
        cy.get('textarea[id="recipeDescription"]').type('This is a test recipe.');

        cy.get('input[id="recipeImage"]').selectFile('cypress/fixtures/testRecipeImage.jpg', {force: true});

        cy.get('button[id="newDraftRecipeButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Recept sikeresen feltöltve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.location('pathname').should('eq', '/my-recipes');
        cy.contains('Test Draft Recipe').should('be.visible');
    });

    it('Upload waiting recipe', () => {
        cy.get('button[id="uploadRecipeButton"]').click();
        cy.location('pathname').should('eq', '/upload-recipe');

        cy.get('input[id="recipeName"]').type('Test Waiting Recipe');
        cy.get('input[id="recipePrepTimeHour"]').clear().type('1');
        cy.get('input[id="recipePrepTimeMinute"]').type('30');

        cy.get('button[id="AddIngredientButton"]').click();

        cy.get('select[id="recipeIngredient0"]').select(0);
        cy.get('input[id="recipeMeasureAmount0').clear().type('1');
        cy.get('select[id="recipeMeasure0"]').select(2);

        cy.get('textarea[id="recipeDescription"]').type('This is a test recipe.');

        cy.get('input[id="recipeImage"]').selectFile('cypress/fixtures/testRecipeImage.jpg', {force: true});

        cy.get('button[id="newWaitingRecipeButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Recept sikeresen feltöltve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.location('pathname').should('eq', '/my-recipes');
        cy.contains('Test Waiting Recipe').should('be.visible');
    });

    it('Cancel recipe upload', () => {
        cy.get('button[id="uploadRecipeButton"]').click();
        cy.location('pathname').should('eq', '/upload-recipe');

        cy.get('button[id="cancelEditOrUploadButton"]').click();

        cy.get('button[id="confirmButton"]').click();
    });

    it('Edit recipe', () => {
        cy.contains('Test Draft Recipe').should('be.visible').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));

        cy.get('button[id="editRecipeButton"]').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/edit-recipe'));

        cy.get('input[id="recipeName"]').clear().type('Edited Test Draft Recipe');

        cy.get('select[id="recipeIngredient1"]').select(2);
        cy.get('input[id="recipeMeasureAmount1"]').clear().type('2');
        cy.get('select[id="recipeMeasure1"]').select(2);

        cy.get('button[id="newDraftRecipeButton"]').click();
        cy.get('p[id="popupMessage"]').should('contain', 'Recept sikeresen módosítva');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.location('pathname').should('eq', '/my-recipes');

        cy.contains('Edited Test Draft Recipe').should('be.visible');
    });

    it('Cancel recipe edit', () => {
        cy.contains('Test Draft Recipe').should('be.visible').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));

        cy.get('button[id="editRecipeButton"]').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/edit-recipe'));

        cy.get('button[id="cancelEditOrUploadButton"]').click();

        cy.get('button[id="confirmButton"]').click();

        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));
    });

    it('Delete recipe', () => {
        cy.contains('Test Waiting Recipe').should('be.visible').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));

        cy.get('button[id="deleteRecipeButton"]').click();

        cy.get('button[id="confirmButton"]').click();

        cy.get('p[id="popupMessage"]').should('contain', 'Recept sikeresen törölve');
        cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-green-600').and('have.class', 'bg-green-100').and('have.class', 'text-green-600');

        cy.location('pathname').should('eq', '/my-recipes');
    });

    
    it('Cancel recipe deletion', () => {
        cy.contains('Edited Test Draft Recipe').should('be.visible').click();
        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));

        cy.get('button[id="deleteRecipeButton"]').click();

        cy.get('button[id="cancelButton"]').click();

        cy.location('pathname').should('satisfy', (pathname : any) => pathname.startsWith('/recipe'));
    });
});