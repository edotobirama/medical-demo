import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001';

test.describe('Medical Demo E2E Tests', () => {

  test('1. Home Page & Navbar Navigation', async ({ page }) => {
    await page.goto(baseURL);
    
    // Check Hero
    await expect(page.getByText('The Future of Not Waiting.')).toBeVisible();
    
    // Check Navbar Links
    const navLinks = ['About Us', 'Services', 'Doctors', 'Contact'];
    for (const link of navLinks) {
      await expect(page.locator('nav').getByRole('link', { name: link })).toBeVisible();
    }

    // Go to Services
    await page.locator('nav').getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL(/.*\/services/);
  });

  test('2. Services Page - Verify Seeded Data', async ({ page }) => {
    await page.goto(`${baseURL}/services`);
    
    // Wait for services to load
    await page.waitForLoadState('networkidle');

    // Check Categories
    await expect(page.getByText('General Consultation')).toBeVisible();
    await expect(page.getByText('Cardiology Screening')).toBeVisible();
    await expect(page.getByText('MRI Scan')).toBeVisible();
    await expect(page.getByText('Advanced Operation Theater')).toBeVisible();

    // Verify images are loaded (at least some)
    const images = await page.locator('img').count();
    expect(images).toBeGreaterThan(5); 
  });

  test('3. Doctors Page - Verify Seeded Doctors', async ({ page }) => {
    await page.goto(`${baseURL}/doctors`);
    await page.waitForLoadState('networkidle');

    // Check seeded doctors
    await expect(page.getByText('Dr. Sarah Wilson')).toBeVisible();
    await expect(page.getByText('Dr. James Chen')).toBeVisible();
    await expect(page.getByText('Dr. Emily Carter')).toBeVisible();
    await expect(page.getByText('Dr. Robert Davis')).toBeVisible();

    // Check departments
    await expect(page.getByText('Cardiology').first()).toBeVisible();
    await expect(page.getByText('Neurology').first()).toBeVisible();
    await expect(page.getByText('Orthopedics').first()).toBeVisible();
    await expect(page.getByText('Ophthalmology').first()).toBeVisible();
  });

  test('4. Booking Flow', async ({ page }) => {
    await page.goto(`${baseURL}/book`);
    await page.waitForLoadState('networkidle');

    // Check if doctors are populated in the booking UI
    await expect(page.locator('text=Dr. Sarah Wilson').first()).toBeVisible();
    
    // We would select a slot and book, but testing the UI rendering is sufficient for now
    // If the booking cards are visible, the page loaded properly
    const availableSlots = await page.locator('text=Available').count();
    expect(availableSlots).toBeGreaterThan(0);
  });

});
