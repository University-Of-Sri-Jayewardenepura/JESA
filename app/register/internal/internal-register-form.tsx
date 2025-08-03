"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  AWARDS,
  ACADEMICYEAR,
  FACULTY,
  MGT_DEGREE,
  TECH_DEGREE,
  ALMED_DEGREE,
  APPL_DEGREE,
  HUM_DEGREE,
  MED_DEGREE,
  ENG_DEGREE,
  COMPUTING_DEGREE,
  DENTAL_SCIENCES_DEGREE,
  URBAN_AQUATIC_DEGREE,
} from "@/constants/form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    Name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    Gender: z.string().min(1, "Gender is required."),
    Email: z
      .string()
      .email({ message: "Invalid email address." })
      .min(1, "Email is required."),
    Whatsapp: z
      .string()
      .min(10, { message: "Mobile number should be 10 characters." }),
    University: z.string().min(1, "University is required."),
    UniversityRegisterId: z
      .string()
      .min(1, "University Registration Number is required."),
    AcademicYear: z.string().min(1, "Academic Year is required."),
    Faculty: z.string().min(1, "Faculty is required."),
    Degree: z.string().min(1, "Degree is required."),
    OtherDegree: z.string().optional(),
    Award1: z.string().optional(),
    Award2: z.string().optional(),
    Award3: z.boolean().optional(), // Changed to boolean for checkbox
    TermsAndConditions: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    (data) => {
      // At least one award must be selected (Award1, Award2, or Award3 checkbox)
      const awards = [data.Award1, data.Award2].filter(
        (award) => award && award.trim() !== ""
      );
      const besaInterUniversity = data.Award3; // checkbox value
      return awards.length >= 1 || besaInterUniversity;
    },
    {
      message: "At least one award must be selected",
      path: ["Award1"],
    }
  )
  .refine(
    (data) => {
      // Check for duplicate awards only for Award1 and Award2
      const awards = [data.Award1, data.Award2].filter(
        (award) => award && award.trim() !== ""
      );
      const uniqueAwards = new Set(awards);
      return uniqueAwards.size === awards.length;
    },
    {
      message: "You cannot select the same award multiple times",
      path: ["Award1"],
    }
  );

type FormData = z.infer<typeof formSchema>;

function InternalRegisterForm() {
  const router = useRouter();

  type DegreeOption = string;

  const [degreeOptions, setDegreeOptions] = useState<DegreeOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const academicYear = Object.values(ACADEMICYEAR);
  const faculties = Object.values(FACULTY);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      Name: "",
      Gender: "",
      Email: "",
      Whatsapp: "",
      University: "University of Sri Jayewardenepura",
      UniversityRegisterId: "",
      AcademicYear: "",
      Faculty: "",
      Degree: "",
      OtherDegree: "",
      Award1: "",
      Award2: "",
      Award3: false, // Changed to boolean default
      TermsAndConditions: false,
    },
  });

  const handleDegreeChange = (value: string) => {
    setSelectedDegree(value);
    setIsOtherSelected(value === "Other");
    form.setValue("Degree", value);
  };

  function handleFacultyChange(selectedFaculty: string) {
    // Reset degree when faculty changes
    setSelectedDegree("");
    setIsOtherSelected(false);
    form.setValue("Degree", "");

    // Logic to set degree options based on selected faculty
    switch (selectedFaculty) {
      case FACULTY.MANAGEMENT_STUDIES_AND_COMMERCE:
        setDegreeOptions(Object.values(MGT_DEGREE));
        break;
      case FACULTY.APPLIED_SCIENCES:
        setDegreeOptions(Object.values(APPL_DEGREE));
        break;
      case FACULTY.HUMANITIES_AND_SOCIAL_SCIENCES:
        setDegreeOptions(Object.values(HUM_DEGREE));
        break;
      case FACULTY.ALLIED_HEALTH_SCIENCES:
        setDegreeOptions(Object.values(ALMED_DEGREE));
        break;
      case FACULTY.TECHNOLOGY:
        setDegreeOptions(Object.values(TECH_DEGREE));
        break;
      case FACULTY.ENGINEERING:
        setDegreeOptions(Object.values(ENG_DEGREE));
        break;
      case FACULTY.MEDICAL_SCIENCE:
        setDegreeOptions(Object.values(MED_DEGREE));
        break;
      case FACULTY.COMPUTING:
        setDegreeOptions(Object.values(COMPUTING_DEGREE));
        break;
      case FACULTY.DENTAL_SCIENCES:
        setDegreeOptions(Object.values(DENTAL_SCIENCES_DEGREE));
        break;
      case FACULTY.URBAN_AQUATIC:
        setDegreeOptions(Object.values(URBAN_AQUATIC_DEGREE));
        break;
      default:
        setDegreeOptions([]);
    }
  }

  async function OnSubmit(values: FormData) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register/internal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Registration failed";
        toast.error(errorMessage);
      } else {
        const data = await response.json();
        toast.success("Registration successful!");
        router.push("/register/success");
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  function getRelevantAwards(faculty: string, academicYear: string): string[] {
    console.log("getRelevantAwards called with:", { faculty, academicYear }); // Debug log

    // If 5th year, they can ONLY apply for Best Innovator
    if (academicYear === "5th Year (19/20)") {
      console.log("Returning only Best Innovator for 5th year"); // Debug log
      return ["Best Innovator"];
    }

    const facultyToBesaAwardsMap: Record<string, string[]> = {
      "Faculty of Management Studies & Commerce": [
        AWARDS.BESA_MANAGEMENT_STUDIES_AND_COMMERCE,
      ],
      "Faculty of Applied Sciences": [AWARDS.BESA_APPLIED_SCIENCES],
      "Faculty of Humanities and Social Sciences": [
        AWARDS.BESA_HUMANITIES_AND_SOCIAL_SCIENCES,
      ],
      "Faculty of Allied Health Sciences": [AWARDS.BESA_ALLIED_HEALTH_SCIENCES],
      "Faculty of Technology": [AWARDS.BESA_TECHNOLOGY],
      "Faculty of Engineering": [AWARDS.BESA_ENGINEERING],
      "Faculty of Medical Science": [AWARDS.BESA_MEDICAL_SCIENCES],
      "Faculty of Dental Sciences": [AWARDS.BESA_DENTAL_SCIENCES],
      "Faculty of Urban & Aquatic Bio-resources": [AWARDS.BESA_URBAN_AQUATIC],
    };

    // For all other years, they can apply for ALL awards EXCEPT BESA Inter University (which is now a checkbox)
    let defaultAwards = Object.values(AWARDS).filter(
      (award) => !award.startsWith("BESA")
    );

    // Get faculty-specific BESA awards (only for the selected faculty)
    const facultySpecificAwards = facultyToBesaAwardsMap[faculty] || [];

    // Combine general awards with faculty-specific BESA awards (exclude BESA Inter University)
    const result = [...defaultAwards, ...facultySpecificAwards];
    console.log("Returning awards for non-5th year:", result); // Debug log
    return result;
  }

  const relevantAwards = getRelevantAwards(
    form.watch("Faculty"),
    form.watch("AcademicYear")
  );

  // Get currently selected awards to filter out from other dropdowns (only Award1 and Award2)
  const selectedAwards = [form.watch("Award1"), form.watch("Award2")].filter(
    (award) => award && award.trim() !== ""
  );

  // Function to get available awards for each dropdown (excluding already selected ones)
  const getAvailableAwards = (currentFieldValue: string) => {
    return relevantAwards.filter(
      (award) => !selectedAwards.includes(award) || award === currentFieldValue
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <h2 className="pb-8 bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text text-center font-title text-[32px] leading-[1.125] tracking-tight text-transparent md:text-[40px] lg:text-[48px]">
        Internal Registration
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(OnSubmit)}
          className="space-y-6 p-10 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50"
        >
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Name"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Gender"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Gender</SelectLabel>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Email Here"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Whatsapp"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="07XXXXXXXX"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="University"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>University</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "University of Sri Jayewardenepura"}
                    disabled={true}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select University</SelectLabel>
                        <SelectItem value="University of Sri Jayewardenepura">
                          University of Sri Jayewardenepura
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="UniversityRegisterId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>University Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="TE110XXX" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="AcademicYear"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Academic Year</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset awards when academic year changes
                      form.setValue("Award1", "");
                      form.setValue("Award2", "");
                      form.setValue("Award3", false);
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Academic Year</SelectLabel>
                        {academicYear.map((year, index) => (
                          <SelectItem key={index} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Faculty"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Faculty</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFacultyChange(value);
                      // Reset awards when faculty changes
                      form.setValue("Award1", "");
                      form.setValue("Award2", "");
                      form.setValue("Award3", false);
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Faculty</SelectLabel>
                        {faculties.map((faculty, index) => (
                          <SelectItem key={index} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {degreeOptions.length > 0 && (
            <FormField
              control={form.control}
              name="Degree"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleDegreeChange(value);
                      }}
                      value={selectedDegree}
                    >
                      <SelectTrigger className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        <SelectValue placeholder="Select Degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Degree</SelectLabel>
                          {degreeOptions.map((degree, index) => (
                            <SelectItem key={index} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isOtherSelected && (
            <FormField
              control={form.control}
              name="OtherDegree"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Enter Degree</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your degree"
                      {...field}
                      value={field.value || ""}
                      required={isOtherSelected}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Awards Section */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-slate-200">
              Awards (Select at least 1 award) *
              {form.watch("AcademicYear") === "5th Year (19/20)" && (
                <div className="text-xs text-slate-400 mt-1">
                  Note: 5th year students can only apply for "Best Innovator"
                  award
                </div>
              )}
            </div>

            {/* Award 1 - Optional but at least one award is required */}
            <FormField
              control={form.control}
              name="Award1"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Award 1 (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(
                          value === "CLEAR_SELECTION" ? "" : value
                        );
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Award (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Award</SelectLabel>
                          {field.value && (
                            <SelectItem value="CLEAR_SELECTION">
                              <span className="text-slate-400">
                                Clear selection
                              </span>
                            </SelectItem>
                          )}
                          {getAvailableAwards(field.value || "").map(
                            (award, index) => (
                              <SelectItem
                                key={`award1-${award}-${index}`}
                                value={award}
                              >
                                {award}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Award 2 - Optional */}
            <FormField
              control={form.control}
              name="Award2"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Award 2 (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(
                          value === "CLEAR_SELECTION" ? "" : value
                        );
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Award (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Award</SelectLabel>
                          {field.value && (
                            <SelectItem value="CLEAR_SELECTION">
                              <span className="text-slate-400">
                                Clear selection
                              </span>
                            </SelectItem>
                          )}
                          {getAvailableAwards(field.value || "").map(
                            (award, index) => (
                              <SelectItem
                                key={`award2-${award}-${index}`}
                                value={award}
                              >
                                {award}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BESA Inter University Award - Checkbox */}
            {form.watch("AcademicYear") !== "5th Year (19/20)" && (
              <FormField
                control={form.control}
                name="Award3"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="flex-1">
                        <FormLabel className="text-sm font-normal leading-relaxed">
                          BESA - Inter University Award
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="TermsAndConditions"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="text-sm font-normal leading-relaxed">
                      <span>
                        I confirm that the information above is accurate to the
                        best of my knowledge and in accordance with the&ensp;
                        <Link
                          href="/terms"
                          className="underline text-blue-400 hover:text-blue-300"
                        >
                          terms and conditions.
                        </Link>
                      </span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[8px] py-3 text-base font-medium"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>
        </form>
        <Toaster />
      </Form>
    </div>
  );
}

export default InternalRegisterForm;
