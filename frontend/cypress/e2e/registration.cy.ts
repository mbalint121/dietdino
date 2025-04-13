describe('Registration tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/registration')
  });

  it('Registration with correct values - passed', () => {
    cy.get('input[id="registrationName"]').type('RegistrationTest');
    cy.get('input[id="registrationEmail"]').type('madai.balint@gmail.com');
    cy.get('input[id="registrationPassword"]').type('registrationTestPassword123!');
    cy.get('input[id="registrationConfirmPassword"]').type('registrationTestPassword123!');

    cy.get('button[id="registrationButton"]').click();

    cy.get('p[id="popupMessage"]').should('contain', 'Megerősítő email elküldve');
    cy.get('p[id="popupMessage"]').parent().should('have.class', 'border-blue-600').and('have.class', 'bg-blue-100').and('have.class', 'text-blue-600');
    cy.location('pathname').should('eq', '/login');
  })
})