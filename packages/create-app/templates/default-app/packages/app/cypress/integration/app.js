describe('App', () => {
  it('should render the welcome page', () => {
    cy.visit('/');
    cy.contains('Welcome to Backstage');
    cy.contains('Getting Started');
    cy.contains('Quick Links');
  });
});
