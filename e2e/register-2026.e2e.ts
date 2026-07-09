import { test, expect, Page } from "@playwright/test";

// Helper to generate unique identifiers to prevent test collisions in parallel execution
const generateUniqueNIC = () => `${Math.floor(100000000 + Math.random() * 900000000)}V`;
const generateUniquePhone = () => `77${Math.floor(1000000 + Math.random() * 9000000)}`;
const generateUniqueEmail = (prefix: string) => `${prefix}${Date.now()}@example.com`;
const generateUniqueUSJEmail = () => `${Math.floor(100000 + Math.random() * 900000)}@fot.sjp.ac.lk`;

// Helper to bypass the swipe component and force submit
const bypassSwipeAndSubmit = async (page: Page) => {
  // Find the hidden bypass button and force click it
  await page.getByTestId("e2e-submit-bypass").click({ force: true });
};

test.describe("JESA 2026 Registration Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register/2026");
  });

  test("Scenario 1: Complete Internal USJ Student Submission", async ({ page }) => {
    // Step 0: Landing
    await page.getByText("internal student", { exact: false }).click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 1: Personal Info
    await expect(page.locator("h2").filter({ hasText: "Personal Information" })).toBeVisible();
    await page.getByPlaceholder("Enter your display name").fill("Test Internal User");
    await page.getByPlaceholder("000000000V or 000000000000").fill(generateUniqueNIC());
    await page.getByRole("combobox").first().selectOption("male");
    await page.getByPlaceholder("Enter your email address").fill(generateUniqueEmail("internal"));
    await page.getByPlaceholder("7X XXX XXXX").first().fill(generateUniquePhone());
    await page.getByPlaceholder("7X XXX XXXX").nth(1).fill(generateUniquePhone());
    await page.getByRole("button", { name: /Continue/i }).click();

    // Debug: check for validation errors
    const errors = await page.locator(".text-red-500").allTextContents();
    if (errors.length > 0) {
      console.log("VALIDATION ERRORS:", errors);
    }
    try {
      await expect(page.locator("h2").filter({ hasText: "Academic Information" })).toBeVisible({ timeout: 5000 });
    } catch (e) {
      console.log("HTML DUMP:", await page.content());
      throw e;
    }
    // Faculty is internal select
    await page.getByRole("combobox").first().selectOption("FOT"); // Faculty of Technology
    await page.getByPlaceholder("123456").first().fill("123456"); // Reg number
    await page.getByPlaceholder("username").fill(`${Math.floor(100000 + Math.random() * 900000)}`); // FOT email prefix
    await page.getByRole("combobox").nth(1).selectOption("year-3"); // Academic Year
    await page.getByRole("combobox").nth(2).selectOption("Bachelor of ICT (Hons)"); // Degree
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 3: Award Selection
    await expect(page.locator("h2").filter({ hasText: "Award Selection" })).toBeVisible();
    await page.locator("label").filter({ hasText: "Best Innovator Award" }).click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 4: Award Questions (Conditional for Innovator)
    await expect(page.locator("h2").filter({ hasText: "Award Questions" })).toBeVisible();
    await page.getByRole("combobox").first().selectOption("Technology");
    await page.locator("label").filter({ hasText: "I declare that my innovation is more than 75% completed" }).click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 5: Declaration
    await expect(page.locator("h2").filter({ hasText: "Declaration" })).toBeVisible();
    await page.locator("label").filter({ hasText: "I confirm all provided information is true." }).click();
    await page.locator("label").filter({ hasText: "I agree that false information will result in disqualification." }).click();
    await page.locator("label").filter({ hasText: "I agree that not attending physical interview" }).click();
    await page.locator("label").filter({ hasText: "I permit the organizing committee to verify" }).click();
    await page.locator("label").filter({ hasText: "I consent to the use of my name" }).click();
    
    // Submit using bypass
    await bypassSwipeAndSubmit(page);

    // Wait for success page navigation
    await page.waitForURL("**/register/success");
    await expect(page.locator("text=Application Submitted Successfully")).toBeVisible();
  });

  test("Scenario 2: Complete External Student Submission", async ({ page }) => {
    // Step 0: Landing
    await page.getByText("external student", { exact: false }).click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 1: Personal Info
    await page.getByPlaceholder("Enter your display name").fill("Test External User");
    await page.getByPlaceholder("000000000V or 000000000000").fill(generateUniqueNIC());
    await page.getByRole("combobox").first().selectOption("female");
    await page.getByPlaceholder("Enter your email address").fill(generateUniqueEmail("external"));
    await page.getByPlaceholder("7X XXX XXXX").first().fill(generateUniquePhone());
    await page.getByPlaceholder("7X XXX XXXX").nth(1).fill(generateUniquePhone());
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 2: Academic Info (External forms are text inputs mostly)
    await page.getByPlaceholder("Enter your faculty name").fill("Science");
    await page.getByRole("combobox").first().selectOption("University of Colombo");
    await page.getByPlaceholder("Enter your registration number").fill("2021/SC/123");
    await page.getByPlaceholder("Enter your university email").fill("sci123@cmb.ac.lk");
    await page.getByRole("combobox").nth(1).selectOption("year-4");
    await page.getByPlaceholder("Enter your degree name").fill("BSc Computer Science");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 3: Award Selection (External can only see limited awards)
    await page.locator("label").filter({ hasText: "Best Innovator Award" }).click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 4: Award Questions
    await page.getByRole("combobox").first().selectOption("Other");
    await page.getByPlaceholder("Enter your industry").fill("Biotechnology");
    await page.locator("label").filter({ hasText: "I declare that my innovation is more than 75% completed" }).click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 5: Declaration
    const checkboxes = page.locator('input[type="checkbox"]');
    for (let i = 0; i < await checkboxes.count(); i++) {
      await checkboxes.nth(i).click({ force: true });
    }
    
    // Submit using bypass
    await bypassSwipeAndSubmit(page);
    await page.waitForURL("**/register/success");
  });

  test("Scenario 3: Validation Error on Duplicate Submission", async ({ page }) => {
    const sharedNIC = generateUniqueNIC();
    const sharedWhatsapp = "770000000";
    const sharedEmail = generateUniqueUSJEmail();

    // --- Submitting FIRST application ---
    await page.getByText("internal student", { exact: false }).click();
    await page.getByRole("button", { name: /Continue/i }).click();
    
    await page.getByPlaceholder("Enter your display name").fill("User One");
    await page.getByPlaceholder("000000000V or 000000000000").fill(sharedNIC);
    await page.getByRole("combobox").first().selectOption("male");
    await page.getByPlaceholder("Enter your email address").fill("one@example.com");
    await page.getByPlaceholder("7X XXX XXXX").first().fill(sharedWhatsapp);
    await page.getByPlaceholder("7X XXX XXXX").nth(1).fill(sharedWhatsapp);
    await page.getByRole("button", { name: /Continue/i }).click();

    await page.getByRole("combobox").first().selectOption("FOT");
    await page.getByPlaceholder("123456").first().fill("111111");
    // Extract local part of shared email for input
    const localEmail = sharedEmail.split('@')[0];
    await page.getByPlaceholder("username").fill(localEmail);
    await page.getByRole("combobox").nth(1).selectOption("year-1");
    await page.getByRole("combobox").nth(2).selectOption("Bachelor of ICT (Hons)");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Need to pick at least one award not conditional for faster path
    await page.locator("label").filter({ hasText: "Best Team Player Award" }).click();
    await page.getByRole("button", { name: /Continue/i }).click(); // Skip to declaration

    const checkboxes1 = page.locator('input[type="checkbox"]');
    for (let i = 0; i < await checkboxes1.count(); i++) {
      await checkboxes1.nth(i).click({ force: true });
    }
    
    await bypassSwipeAndSubmit(page);
    await page.waitForURL("**/register/success");

    // --- Submitting SECOND application with SAME Data ---
    await page.goto("/register/2026");
    await page.getByText("internal student", { exact: false }).click();
    await page.getByRole("button", { name: /Continue/i }).click();
    
    await page.getByPlaceholder("Enter your display name").fill("User Two");
    await page.getByPlaceholder("000000000V or 000000000000").fill(sharedNIC); // DUPLICATE!
    await page.getByRole("combobox").first().selectOption("female");
    await page.getByPlaceholder("Enter your email address").fill("two@example.com");
    await page.getByPlaceholder("7X XXX XXXX").first().fill(sharedWhatsapp); // DUPLICATE!
    await page.getByPlaceholder("7X XXX XXXX").nth(1).fill(sharedWhatsapp);
    await page.getByRole("button", { name: /Continue/i }).click();

    await page.getByRole("combobox").first().selectOption("FOT");
    await page.getByPlaceholder("123456").first().fill("222222");
    await page.getByPlaceholder("username").fill(localEmail); // DUPLICATE!
    await page.getByRole("combobox").nth(1).selectOption("year-2");
    await page.getByRole("combobox").nth(2).selectOption("Bachelor of ICT (Hons)");
    await page.getByRole("button", { name: /Continue/i }).click();

    await page.locator("label").filter({ hasText: "Best Team Player Award" }).click();
    await page.getByRole("button", { name: /Continue/i }).click(); 

    const checkboxes2 = page.locator('input[type="checkbox"]');
    for (let i = 0; i < await checkboxes2.count(); i++) {
      await checkboxes2.nth(i).click({ force: true });
    }
    
    await bypassSwipeAndSubmit(page);
    
    // Check for the error toast
    await expect(page.locator("text=Submission Failed")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=An application with the same NIC and WhatsApp Number and University Email already exists")).toBeVisible();
  });

  test("Scenario 4: Award Limits (Internal max 3, 2 main + BESA)", async ({ page }) => {
    await page.getByText("internal student", { exact: false }).click();
    await page.getByRole("button", { name: /Continue/i }).click();
    
    await page.getByPlaceholder("Enter your display name").fill("Limit Tester");
    await page.getByPlaceholder("000000000V or 000000000000").fill(generateUniqueNIC());
    await page.getByRole("combobox").first().selectOption("male");
    await page.getByPlaceholder("Enter your email address").fill(generateUniqueEmail("limit"));
    await page.getByPlaceholder("7X XXX XXXX").first().fill(generateUniquePhone());
    await page.getByPlaceholder("7X XXX XXXX").nth(1).fill(generateUniquePhone());
    await page.getByRole("button", { name: /Continue/i }).click();

    await page.getByRole("combobox").first().selectOption("FOT");
    await page.getByPlaceholder("123456").first().fill("999999");
    await page.getByPlaceholder("username").fill(`${Math.floor(100000 + Math.random() * 900000)}`);
    await page.getByRole("combobox").nth(1).selectOption("year-3");
    await page.getByRole("combobox").nth(2).selectOption("Bachelor of ICT (Hons)");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Select 2 main awards
    await page.locator("label").filter({ hasText: "Best Leader Award" }).click();
    await page.locator("label").filter({ hasText: "Best Team Player Award" }).click();

    // Try to select a 3rd main award -> Should be disabled or ignored
    const thirdAward = page.locator("label").filter({ hasText: "Best Communicator Award" });
    await thirdAward.click();
    
    // We expect it NOT to be checked
    const thirdAwardCheckbox = page.locator('input[id="best-communicator"]');
    await expect(thirdAwardCheckbox).not.toBeChecked();

    // But BESA Inter University can still be selected
    await page.locator("label").filter({ hasText: "BESA – Inter University Award" }).click();
    const besaCheckbox = page.locator('input[id="besa-inter-university"]');
    await expect(besaCheckbox).toBeChecked();
  });
});
