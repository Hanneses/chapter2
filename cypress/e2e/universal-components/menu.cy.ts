describe('header menu', () => {
  context('1280 resolution', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it('should show links chapters and events in top navigation', () => {
      cy.visit('/');
      cy.get('[data-cy=header-link-chapters]').should('be.visible');
      cy.get('[data-cy=header-link-events]').should('be.visible');
    });

    it('should show a link to the dashboard for an owner', () => {
      cy.login('foo@bar.com');
      cy.visit('/');
      cy.get('[data-cy=menu-button]').click();
      cy.get('[data-cy=menu-dashboard-link]').should('be.visible');
    });

    it('should show a link to the dashboard for an admin', () => {
      cy.login('admin@of.chapter.one');
      cy.visit('/');
      cy.get('[data-cy=menu-button]').click();
      cy.get('[data-cy=menu-dashboard-link]').should('be.visible');
    });

    it('should NOT show a link to the dashboard for a member', () => {
      cy.login('test@user.org');
      cy.visit('/');
      cy.get('[data-cy=menu-button]').click();
      cy.get('[data-cy=menu-dashboard-link]').should('not.exist');
    });
  });

  context('iphone resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should NOT show links chapters and events in top navigation', () => {
      cy.visit('/');
      cy.get('[data-cy=header-link-chapters]').should('not.exist');
      cy.get('[data-cy=header-link-events]').should('not.exist');
    });
  });
});
