# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: registration-form.e2e.ts >> Step 1 – Personal Info Validation >> validates email format
- Location: e2e/registration-form.e2e.ts:139:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="example.com"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - paragraph [ref=e6]:
        - text: JESA 2025 Digital Magazine is Out |
        - link "Get the Magazine" [ref=e7] [cursor=pointer]:
          - /url: /magazine
          - text: Get the Magazine
          - img [ref=e8]
      - navigation [ref=e10]:
        - link "JESA 2026 JESA" [ref=e11] [cursor=pointer]:
          - /url: /
          - img "JESA 2026" [ref=e12]
          - generic [ref=e13]: JESA
        - list [ref=e14]:
          - listitem [ref=e15]:
            - link "Awards" [ref=e16] [cursor=pointer]:
              - /url: /awards
          - listitem [ref=e17]:
            - link "Hall of Fame" [ref=e18] [cursor=pointer]:
              - /url: /hall-of-fame
          - listitem [ref=e19]:
            - link "Magazine" [ref=e20] [cursor=pointer]:
              - /url: /magazine
        - generic [ref=e21]:
          - link "Terms & Conditions" [ref=e22] [cursor=pointer]:
            - /url: /terms
          - link "Get the Magazine" [ref=e23] [cursor=pointer]:
            - /url: /magazine
    - generic [ref=e28]:
      - complementary [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]:
            - paragraph [ref=e32]: JESA 2026
            - heading "Awards Application" [level=1] [ref=e33]
          - navigation [ref=e34]:
            - button "1 Personal Information Step 1" [ref=e35]:
              - generic [ref=e36]: "1"
              - generic [ref=e37]:
                - generic [ref=e38]: Personal Information
                - generic [ref=e39]: Step 1
            - button "2 Academic Information Step 2" [disabled] [ref=e40]:
              - generic [ref=e41]: "2"
              - generic [ref=e42]:
                - generic [ref=e43]: Academic Information
                - generic [ref=e44]: Step 2
            - button "3 Award Selection Step 3" [disabled] [ref=e45]:
              - generic [ref=e46]: "3"
              - generic [ref=e47]:
                - generic [ref=e48]: Award Selection
                - generic [ref=e49]: Step 3
            - button "4 Declaration Step 4" [disabled] [ref=e50]:
              - generic [ref=e51]: "4"
              - generic [ref=e52]:
                - generic [ref=e53]: Declaration
                - generic [ref=e54]: Step 4
          - generic [ref=e56]:
            - generic [ref=e57]: Progress
            - generic [ref=e58]: 1 of 4
      - main [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63]:
            - heading "Personal Information" [level=2] [ref=e64]
            - paragraph [ref=e65]: Step 1
          - generic [ref=e66]:
            - generic [ref=e67]:
              - generic [ref=e68]:
                - text: Public Display Name
                - generic [ref=e69]: "*"
              - textbox "Enter your display name" [ref=e70]
            - generic [ref=e71]:
              - generic [ref=e72]:
                - text: NIC
                - generic [ref=e73]: "*"
              - textbox "000000000V or 000000000000" [ref=e74]
            - generic [ref=e75]:
              - generic [ref=e76]:
                - text: Gender
                - generic [ref=e77]: "*"
              - combobox [ref=e78] [cursor=pointer]:
                - option "Select gender" [selected]
                - option "Male"
                - option "Female"
                - option "Other"
                - option "Prefer not to say"
            - generic [ref=e79]:
              - generic [ref=e80]:
                - text: Email Address
                - generic [ref=e81]: "*"
              - textbox "Enter your email address" [ref=e82]
            - generic [ref=e83]:
              - generic [ref=e84]:
                - text: WhatsApp Number
                - generic [ref=e85]: "*"
              - generic [ref=e86]:
                - generic [ref=e87]: "+94"
                - textbox "7X XXX XXXX" [ref=e88]
            - generic [ref=e89]:
              - generic [ref=e90]:
                - text: Mobile Number
                - generic [ref=e91]: "*"
              - generic [ref=e92]:
                - generic [ref=e93]: "+94"
                - textbox "7X XXX XXXX" [ref=e94]
          - generic [ref=e95]:
            - button "← Back" [ref=e96]
            - button "Continue →" [ref=e97]
    - generic [ref=e98]:
      - separator [ref=e99]
      - generic [ref=e100]:
        - generic [ref=e101]:
          - generic [ref=e102]:
            - link "JESA 2026 JESA" [ref=e103] [cursor=pointer]:
              - /url: /
              - img "JESA 2026" [ref=e104]
              - generic [ref=e105]: JESA
            - generic [ref=e106]:
              - img "USJP Logo"
              - img "CSDS Logo"
            - paragraph [ref=e107]:
              - text: Career Skills Development Society • 2025/2026
              - text: in collaboration with Career Guidance Unit of
              - text: University of Sri Jayewardenepura Contacts
          - generic [ref=e108]:
            - generic [ref=e109]:
              - heading "Contacts" [level=2] [ref=e110]
              - list [ref=e111]:
                - listitem [ref=e112]:
                  - link "Muhammed Yusuf" [ref=e113] [cursor=pointer]:
                    - /url: https://www.linkedin.com/in/muhammed-yusuf/
                  - link "+94 77 185 7567" [ref=e114] [cursor=pointer]:
                    - /url: tel:+94 77 185 7567
                - listitem [ref=e115]:
                  - link "Thinul Hettiarachchi" [ref=e116] [cursor=pointer]:
                    - /url: https://www.linkedin.com/in/thinul-hettiarachchi/
                  - link "+94 78 436 9394" [ref=e117] [cursor=pointer]:
                    - /url: tel:+94 78 436 9394
            - generic [ref=e118]:
              - heading "Show" [level=2] [ref=e119]
              - list [ref=e120]:
                - listitem [ref=e121]:
                  - link "Awards" [ref=e122] [cursor=pointer]:
                    - /url: /awards
                - listitem [ref=e123]:
                  - link "Magazine" [ref=e124] [cursor=pointer]:
                    - /url: /magazine
                - listitem [ref=e125]:
                  - link "Hall of Fame" [ref=e126] [cursor=pointer]:
                    - /url: /hall-of-fame
                - listitem [ref=e127]:
                  - link "Terms & Conditions" [ref=e128] [cursor=pointer]:
                    - /url: /terms
        - generic [ref=e129]:
          - generic [ref=e130]:
            - text: Copyright © 2026
            - link "CDSD" [ref=e131] [cursor=pointer]:
              - /url: /
            - text: . All Rights Reserved.
          - generic [ref=e132]:
            - link "LinkedIn" [ref=e133] [cursor=pointer]:
              - /url: https://www.linkedin.com/showcase/jesa-csds/
              - img [ref=e134]
              - generic [ref=e138]: LinkedIn
            - link "Facebook" [ref=e139] [cursor=pointer]:
              - /url: https://facebook.com/jesa.csds
              - img [ref=e140]
              - generic [ref=e142]: Facebook
            - link "Instagram" [ref=e143] [cursor=pointer]:
              - /url: https://www.instagram.com/jesa.csds
              - img [ref=e144]
              - generic [ref=e147]: Instagram
  - button "Open Next.js Dev Tools" [ref=e153] [cursor=pointer]:
    - img [ref=e154]
  - alert [ref=e157]
```

# Test source

```ts
  42  |   await yearSelect.selectOption(overrides.academicYear ?? "year-3");
  43  |   // Degree
  44  |   await page.locator('input[placeholder*="degree"]').first().fill(overrides.degree ?? "Computer Science");
  45  |   await page.getByRole("button", { name: /Continue/i }).click();
  46  | }
  47  | 
  48  | async function selectAwards(page: Page, awards: string[]) {
  49  |   for (const award of awards) {
  50  |     await page.getByRole("checkbox", { name: new RegExp(award, "i") }).check();
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
> 142 |     await page.locator('input[placeholder*="example.com"]').fill("not-an-email");
      |                                                             ^ Error: locator.fill: Test timeout of 60000ms exceeded.
  143 |     await page.getByRole("button", { name: /Continue/i }).click();
  144 |     await expect(page.getByText(/valid email/i)).toBeVisible();
  145 |   });
  146 | 
  147 |   test("validates wrong Sri Lankan phone", async ({ page }) => {
  148 |     await goToForm(page);
  149 |     await selectInternal(page);
  150 |     const phoneInputs = page.locator('input[placeholder*="XX XXX XXXX"]');
  151 |     await phoneInputs.nth(0).fill("123");
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
```