describe('SMS Functionality', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
  });

  it('should send SMS successfully', () => {
    cy.get('[data-testid="recipient-input"]').type('+8613812345678');
    cy.get('[data-testid="message-input"]').type('Test message');
    cy.get('[data-testid="send-button"]').click();
    cy.contains('短信发送成功').should('be.visible');
  });

  it('should show SMS history', () => {
    cy.get('[data-testid="history-tab"]').click();
    cy.get('[data-testid="sms-history"]').should('be.visible');
  });

  it('should filter SMS history', () => {
    cy.get('[data-testid="history-tab"]').click();
    cy.get('[data-testid="search-input"]').type('13812345678');
    cy.get('[data-testid="sms-history"]').should('contain', '+8613812345678');
  });
});