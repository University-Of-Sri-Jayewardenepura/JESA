# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: registration-form.e2e.ts >> Step 1 – Personal Info Validation >> validates wrong Sri Lankan phone
- Location: e2e/registration-form.e2e.ts:147:7

# Error details

```
Error: locator.fill: Target page, context or browser has been closed
Call log:
  - waiting for locator('input[placeholder*="XX XXX XXXX"]').first()

```

# Test source

```ts
  51  |   }
  52  |   await page.getByRole("button", { name: /Continue/i }).click();
  53  | }
  54  | 
  55  | async function fillBestInnovator(page: Page) {
  56  |   await page.locator("select").first().selectOption("Technology");
  57  |   await page.getByRole("checkbox", { name: /75/i }).check();
  58  |   await page.getByRole("button", { name: /Continue/i }).click();
  59  | }
  60  | 
  61  | async function fillBestCSR(page: Page) {
  62  |   await page.locator('input[placeholder*="advisor name"]').fill("Dr. Smith");
  63  |   await page.locator('input[placeholder*="advisor email"]').fill("advisor@club.com");
  64  |   await page.locator('input[placeholder*="member name"]').fill("Alice Member");
  65  | 
  66  |   const phoneInputs = page.locator('input[placeholder*="XX XXX XXXX"]');
  67  |   await phoneInputs.nth(0).fill("771111111");
  68  | 
  69  |   await page.locator('input[placeholder*="president name"]').fill("Bob President");
  70  |   await page.locator('input[placeholder*="president whatsapp"]').fill("772222222");
  71  |   await page.locator('input[placeholder*="president email"]').fill("president@club.com");
  72  | }
  73  | 
  74  | async function checkAllDeclarations(page: Page) {
  75  |   const checkboxes = page.getByRole("checkbox");
  76  |   const count = await checkboxes.count();
  77  |   for (let i = 0; i < count; i++) {
  78  |     await checkboxes.nth(i).check();
  79  |   }
  80  | }
  81  | 
  82  | // ── Tests ───────────────────────────────────────────────
  83  | 
  84  | test.describe("Step 0 – Applicant Type", () => {
  85  |   test("renders both options and next is disabled until selection", async ({ page }) => {
  86  |     await goToForm(page);
  87  |     await expect(page.getByText(/internal student/i)).toBeVisible();
  88  |     await expect(page.getByText(/external student/i)).toBeVisible();
  89  |     await expect(page.getByRole("button", { name: /Continue/i })).toBeDisabled();
  90  |     await selectInternal(page);
  91  |     await expect(page.getByText(/personal information/i)).toBeVisible();
  92  |   });
  93  | 
  94  |   test("can go back from step 1 to restart", async ({ page }) => {
  95  |     await goToForm(page);
  96  |     await selectInternal(page);
  97  |     await page.getByText(/← Back/i).click();
  98  |     await expect(page.getByText(/select applicant type/i)).toBeVisible();
  99  |   });
  100 | });
  101 | 
  102 | test.describe("Step 1 – Personal Info Validation", () => {
  103 |   test("shows required field errors when empty", async ({ page }) => {
  104 |     await goToForm(page);
  105 |     await selectInternal(page);
  106 |     await page.getByRole("button", { name: /Continue/i }).click();
  107 |     await expect(page.getByText(/name is required/i)).toBeVisible();
  108 |     await expect(page.getByText(/NIC is required/i)).toBeVisible();
  109 |     await expect(page.getByText(/gender is required/i)).toBeVisible();
  110 |     await expect(page.getByText(/email is required/i)).toBeVisible();
  111 |     await expect(page.getByText(/WhatsApp number is required/i)).toBeVisible();
  112 |     await expect(page.getByText(/mobile number is required/i)).toBeVisible();
  113 |   });
  114 | 
  115 |   test("shows format errors for invalid NIC", async ({ page }) => {
  116 |     await goToForm(page);
  117 |     await selectInternal(page);
  118 |     await page.locator('input[placeholder*="000000000V"]').fill("abc");
  119 |     await page.getByRole("button", { name: /Continue/i }).click();
  120 |     await expect(page.getByText(/NIC must be 9 digits/i)).toBeVisible();
  121 |   });
  122 | 
  123 |   test("accepts old NIC format 9+V", async ({ page }) => {
  124 |     await goToForm(page);
  125 |     await selectInternal(page);
  126 |     await page.locator('input[placeholder*="000000000V"]').fill("992503149V");
  127 |     const val = await page.locator('input[placeholder*="000000000V"]').inputValue();
  128 |     // NIC field auto-uppercases
  129 |     expect(val).toBe("992503149V");
  130 |   });
  131 | 
  132 |   test("accepts new NIC format 12 digits", async ({ page }) => {
  133 |     await goToForm(page);
  134 |     await selectInternal(page);
  135 |     await page.locator('input[placeholder*="000000000V"]').fill("200301503249");
  136 |     // Should not show error after clicking continue (with other fields filled)
  137 |   });
  138 | 
  139 |   test("validates email format", async ({ page }) => {
  140 |     await goToForm(page);
  141 |     await selectInternal(page);
  142 |     await page.locator('input[placeholder*="example.com"]').fill("not-an-email");
  143 |     await page.getByRole("button", { name: /Continue/i }).click();
  144 |     await expect(page.getByText(/valid email/i)).toBeVisible();
  145 |   });
  146 | 
  147 |   test("validates wrong Sri Lankan phone", async ({ page }) => {
  148 |     await goToForm(page);
  149 |     await selectInternal(page);
  150 |     const phoneInputs = page.locator('input[placeholder*="XX XXX XXXX"]');
> 151 |     await phoneInputs.nth(0).fill("123");
      |                              ^ Error: locator.fill: Target page, context or browser has been closed
  152 |     await page.getByRole("button", { name: /Continue/i }).click();
  153 |     await expect(page.getByText(/valid Sri Lankan/i)).toBeVisible();
  154 |   });
  155 | });
  156 | 
  157 | test.describe("Step 2 – Academic Info", () => {
  158 |   test("shows graduation year dropdown for recent graduates", async ({ page }) => {
  159 |     await goToForm(page);
  160 |     await selectInternal(page);
  161 |     await fillPersonalInfo(page);
  162 | 
  163 |     // Select recent graduate
  164 |     await page.locator("select").nth(1).selectOption("recent-graduate");
  165 |     await expect(page.getByText(/graduation year/i)).toBeVisible();
  166 |     await expect(page.locator("select").last()).toBeVisible();
  167 | 
  168 |     // Switch back to year-3, graduation year should hide
  169 |     await page.locator("select").nth(1).selectOption("year-3");
  170 |     await expect(page.getByText(/graduation year/i)).not.toBeVisible();
  171 |   });
  172 | 
  173 |   test("requires graduation year for recent graduates", async ({ page }) => {
  174 |     await goToForm(page);
  175 |     await selectInternal(page);
  176 |     await fillPersonalInfo(page);
  177 | 
  178 |     await page.locator("select").nth(1).selectOption("recent-graduate");
  179 |     await page.locator('input[placeholder*="registration number"]').fill("REG12345");
  180 |     await page.locator('input[placeholder*="@"]').fill("john@fot.sjp.ac.lk");
  181 |     await page.locator('input[placeholder*="degree"]').first().fill("CS");
  182 |     await page.getByRole("button", { name: /Continue/i }).click();
  183 |     await expect(page.getByText(/graduation year is required/i)).toBeVisible();
  184 |   });
  185 | 
  186 |   test("rejects graduation year outside 2023–2026", async ({ page }) => {
  187 |     await goToForm(page);
  188 |     await selectInternal(page);
  189 |     await fillPersonalInfo(page);
  190 | 
  191 |     await page.locator("select").nth(1).selectOption("recent-graduate");
  192 |     await page.locator("select").last().selectOption("2022");
  193 |     await page.locator('input[placeholder*="registration number"]').fill("REG12345");
  194 |     await page.locator('input[placeholder*="@"]').fill("john@fot.sjp.ac.lk");
  195 |     await page.locator('input[placeholder*="degree"]').first().fill("CS");
  196 |     await page.getByRole("button", { name: /Continue/i }).click();
  197 |     await expect(page.getByText(/must be between 2023 and 2026/i)).toBeVisible();
  198 |   });
  199 | });
  200 | 
  201 | test.describe("Step 3 – Award Selection Rules", () => {
  202 |   test("internal USJ can select up to 3 awards", async ({ page }) => {
  203 |     await goToForm(page);
  204 |     await selectInternal(page);
  205 |     await fillPersonalInfo(page);
  206 |     await fillAcademicInfoInternal(page);
  207 | 
  208 |     // Select 3 awards
  209 |     const awards = ["Best Leader", "Best Team Player", "Best Innovator"];
  210 |     for (const award of awards) {
  211 |       await page.getByRole("checkbox", { name: new RegExp(award, "i") }).check();
  212 |     }
  213 |     // Try a 4th – should be disabled
  214 |     const fourthAward = page.getByRole("checkbox", { name: /Best Creative Designer/i });
  215 |     await expect(fourthAward).toBeDisabled();
  216 |     await page.getByRole("button", { name: /Continue/i }).click();
  217 |   });
  218 | 
  219 |   test("external can only select Best Innovator and BESA Inter University", async ({ page }) => {
  220 |     await goToForm(page);
  221 |     await selectExternal(page);
  222 | 
  223 |     // Fill step 1 with external data
  224 |     await page.locator('input[placeholder*="display name"]').fill("Jane External");
  225 |     await page.locator('input[placeholder*="000000000V"]').fill("200301503249");
  226 |     await page.locator('input[type="radio"]').first().click({ force: true });
  227 |     await page.locator('input[placeholder*="example.com"]').fill("jane@ext.lk");
  228 |     const phoneInputs = page.locator('input[placeholder*="XX XXX XXXX"]');
  229 |     await phoneInputs.nth(0).fill("771234567");
  230 |     await phoneInputs.nth(1).fill("771234568");
  231 |     await page.getByRole("button", { name: /Continue/i }).click();
  232 | 
  233 |     // Fill academic for external (non-USJ)
  234 |     await page.locator("select").first().selectOption("University of Colombo");
  235 |     await page.locator('input[placeholder*="registration number"]').fill("EXT12345");
  236 |     await page.locator('input[placeholder*="@"]').fill("jane@cmb.ac.lk");
  237 |     await page.locator("select").nth(1).selectOption("year-3");
  238 |     await page.locator('input[placeholder*="degree"]').first().fill("Maths");
  239 |     await page.getByRole("button", { name: /Continue/i }).click();
  240 | 
  241 |     // Check that Best Leader is disabled
  242 |     await expect(page.getByRole("checkbox", { name: /Best Leader/i })).toBeDisabled();
  243 |     await expect(page.getByRole("checkbox", { name: /Best Innovator/i })).toBeEnabled();
  244 |     await expect(page.getByRole("checkbox", { name: /BESA Inter University/i })).toBeEnabled();
  245 | 
  246 |     // Select both allowed
  247 |     await page.getByRole("checkbox", { name: /Best Innovator/i }).check();
  248 |     await page.getByRole("checkbox", { name: /BESA Inter University/i }).check();
  249 |     await page.getByRole("button", { name: /Continue/i }).click();
  250 |   });
  251 | 
```