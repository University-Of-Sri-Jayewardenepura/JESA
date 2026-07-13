import { beforeEach, describe, expect, it } from "bun:test";
import { applicationBusinessSchema } from "../schemas/applicationSchema";

// A mock in-memory database to simulate Firebase
class MockFirebaseDB {
	applications: Record<string, any> = {};
	unique_constraints: Record<string, { appId: string }> = {};

	clear() {
		this.applications = {};
		this.unique_constraints = {};
	}
}

const db = new MockFirebaseDB();

// A mocked version of the service function that interacts with our in-memory DB
async function mockCreateNewApplication(formData: any): Promise<string> {
	const result = applicationBusinessSchema.safeParse(formData);
	if (!result.success) {
		throw new Error("Schema Validation Failed");
	}

	const data = result.data;
	const appId = `mock-app-id-${Date.now()}`;

	const nic = data.personalInfo.nic;
	const whatsapp = data.personalInfo.whatsappNumber;
	const email = data.academicInfo.universityEmail;

	const nicRef = `nic_${nic}`;
	const waRef = `wa_${whatsapp}`;
	const emailRef = `email_${email}`;

	// Simulate Firebase transaction duplicate check
	const duplicateFields: string[] = [];
	if (db.unique_constraints[nicRef]) duplicateFields.push("NIC");
	if (db.unique_constraints[waRef]) duplicateFields.push("WhatsApp Number");
	if (db.unique_constraints[emailRef]) duplicateFields.push("University Email");

	if (duplicateFields.length > 0) {
		const fieldList = duplicateFields.join(" and ");
		throw new Error(
			`An application with the same ${fieldList} already exists. If you believe this is a mistake, please contact us.`,
		);
	}

	// Simulate setting documents
	db.applications[appId] = { applicationId: appId, ...data };
	db.unique_constraints[nicRef] = { appId };
	db.unique_constraints[waRef] = { appId };
	db.unique_constraints[emailRef] = { appId };

	return appId;
}

function getValidMockData(override: Partial<any> = {}) {
	return {
		applicantType: "internal",
		personalInfo: {
			publicDisplayName: "Jane Doe",
			nic: override.nic || "200012345678",
			gender: "female",
			email: "jane@example.com",
			whatsappNumber: override.whatsappNumber || "+94770000000",
			mobileNumber: "+94770000001",
		},
		academicInfo: {
			university: "University of Sri Jayewardenepura",
			universityRegistrationNumber: "TE123456",
			universityEmail: override.universityEmail || "jane123@fot.sjp.ac.lk",
			academicYear: "year-3",
			faculty: "FOT",
			degree: "Bachelor of ICT (Hons)",
		},
		awardSelection: {
			selectedAwards: ["best-leader"],
			hasConditionalAwards: false,
		},
		declaration: {
			confirmAccuracy: true,
			agreeDisqualification: true,
			agreePhysicalInterview: true,
			permitVerification: true,
			consentPublicity: true,
		},
	};
}

describe("Firebase Submission Simulator & Duplication Testing", () => {
	beforeEach(() => {
		db.clear();
	});

	it("Scenario 1: First time submission succeeds", async () => {
		const data = getValidMockData();
		const appId = await mockCreateNewApplication(data);
		expect(appId).toBeString();
		// Verify constraints are created
		expect(db.unique_constraints[`nic_${data.personalInfo.nic}`]).toBeDefined();
	});

	it("Scenario 2: Exact duplicate submission fails with exact duplicate fields", async () => {
		const data = getValidMockData();
		await mockCreateNewApplication(data);

		try {
			await mockCreateNewApplication(data);
			expect().fail("Should have thrown duplicate error");
		} catch (e: any) {
			expect(e.message).toContain(
				"NIC and WhatsApp Number and University Email already exists",
			);
		}
	});

	it("Scenario 3: Only NIC is duplicated", async () => {
		// User 1 submits
		await mockCreateNewApplication(getValidMockData());

		// User 2 tries to submit with same NIC but different WhatsApp and Email
		const data2 = getValidMockData({
			whatsappNumber: "+94711111111",
			universityEmail: "different@fot.sjp.ac.lk",
		});

		try {
			await mockCreateNewApplication(data2);
			expect().fail("Should have thrown duplicate error");
		} catch (e: any) {
			expect(e.message).toContain(
				"An application with the same NIC already exists",
			);
		}
	});

	it("Scenario 4: The 'Ghost' Document (User deleted Application but forgot constraints)", async () => {
		// 1. User submits successfully
		const data = getValidMockData();
		const appId = await mockCreateNewApplication(data);

		// 2. User goes to Firebase Console and manually deletes ONLY the application document
		delete db.applications[appId];

		// NOTE: The unique_constraints documents are still in the database!
		// db.unique_constraints[`nic_...`] still exists!

		// 3. User tries to submit the exact same data again
		try {
			await mockCreateNewApplication(data);
			expect().fail(
				"Should have thrown duplicate error even though app document is deleted",
			);
		} catch (e: any) {
			expect(e.message).toContain("already exists");
		}
	});

	it("Scenario 5: Full proper manual deletion allows resubmission", async () => {
		// 1. User submits
		const data = getValidMockData();
		const appId = await mockCreateNewApplication(data);

		// 2. Database Admin properly deletes BOTH the application AND the constraint documents
		delete db.applications[appId];
		delete db.unique_constraints[`nic_${data.personalInfo.nic}`];
		delete db.unique_constraints[`wa_${data.personalInfo.whatsappNumber}`];
		delete db.unique_constraints[`email_${data.academicInfo.universityEmail}`];

		// 3. User resubmits -> SUCCEEDS
		const newAppId = await mockCreateNewApplication(data);
		expect(newAppId).toBeString();
	});
});
