const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'Android Emulator',
  'appium:app': '/path/to/your/app.apk',
  'appium:automationName': 'UiAutomator2',
  'appium:newCommandTimeout': 300,
  'appium:connectHardwareKeyboard': true,
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

describe('Add Transaction E2E Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await remote(wdOpts);
  });

  afterAll(async () => {
    await driver?.deleteSession();
  });

  beforeEach(async () => {
    // Reset app state before each test
    await driver.reset();
  });

  it('should add a new expense transaction successfully', async () => {
    // Navigate to Add Transaction tab
    const addTab = await driver.$('~Add');
    await addTab.waitForDisplayed({ timeout: 5000 });
    await addTab.click();

    // Fill in transaction details
    const descriptionInput = await driver.$('~description-input');
    await descriptionInput.waitForDisplayed({ timeout: 5000 });
    await descriptionInput.setValue('Test Grocery Shopping');

    const amountInput = await driver.$('~amount-input');
    await amountInput.setValue('75.50');

    // Select expense type (should be default)
    const expenseButton = await driver.$('~expense-button');
    await expenseButton.click();

    // Select Food category
    const foodCategory = await driver.$('~category-Food');
    await foodCategory.click();

    // Submit transaction
    const submitButton = await driver.$('~submit-button');
    await submitButton.click();

    // Verify success message
    const successAlert = await driver.$('android=new UiSelector().textContains("Success")');
    await successAlert.waitForDisplayed({ timeout: 5000 });
    
    // Dismiss success alert
    const okButton = await driver.$('android=new UiSelector().text("OK")');
    await okButton.click();

    // Navigate to transactions list
    const transactionsTab = await driver.$('~Transactions');
    await transactionsTab.click();

    // Verify transaction appears in list
    const transactionItem = await driver.$('android=new UiSelector().textContains("Test Grocery Shopping")');
    await transactionItem.waitForDisplayed({ timeout: 5000 });
    
    // Verify amount is displayed correctly
    const amountText = await driver.$('android=new UiSelector().textContains("-$75.50")');
    await expect(amountText).toBeDisplayed();
  });

  it('should validate required fields', async () => {
    // Navigate to Add Transaction tab
    const addTab = await driver.$('~Add');
    await addTab.click();

    // Try to submit without filling required fields
    const submitButton = await driver.$('~submit-button');
    await submitButton.click();

    // Verify error messages appear
    const descriptionError = await driver.$('android=new UiSelector().textContains("Description is required")');
    await expect(descriptionError).toBeDisplayed();
    
    const amountError = await driver.$('android=new UiSelector().textContains("Amount is required")');
    await expect(amountError).toBeDisplayed();
  });

  it('should add income transaction correctly', async () => {
    // Navigate to Add Transaction tab
    const addTab = await driver.$('~Add');
    await addTab.click();

    // Fill in income transaction
    const descriptionInput = await driver.$('~description-input');
    await descriptionInput.setValue('Salary Payment');

    const amountInput = await driver.$('~amount-input');
    await amountInput.setValue('3000.00');

    // Select income type
    const incomeButton = await driver.$('~income-button');
    await incomeButton.click();

    // Submit transaction
    const submitButton = await driver.$('~submit-button');
    await submitButton.click();

    // Dismiss success alert
    await driver.pause(1000);
    const okButton = await driver.$('android=new UiSelector().text("OK")');
    if (await okButton.isDisplayed()) {
      await okButton.click();
    }

    // Navigate to transactions and verify
    const transactionsTab = await driver.$('~Transactions');
    await transactionsTab.click();

    // Verify income transaction with + sign
    const incomeAmount = await driver.$('android=new UiSelector().textContains("+$3000.00")');
    await expect(incomeAmount).toBeDisplayed();
  });
});
