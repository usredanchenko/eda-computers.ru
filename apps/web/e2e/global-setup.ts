import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Wait for the application to be ready
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Optional: Set up test data or authentication state
  // await page.evaluate(() => {
  //   localStorage.setItem('test-user', JSON.stringify({
  //     id: 1,
  //     email: 'test@example.com',
  //     role: 'USER'
  //   }));
  // });

  await browser.close();
}

export default globalSetup;

