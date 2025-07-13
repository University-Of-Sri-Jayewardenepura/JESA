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

const formSchema = z.object({
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
  Award1: z.string().min(1, "Award is required."),
  Award2: z.string().min(1, "Award is required."),
  Award3: z.string().optional(), // BESA - Inter University Award (optional)
  TermsAndConditions: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

function InternalRegisterForm() {
  const router = useRouter();

  // Fix: Properly type the degree options with a union type
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
      TermsAndConditions: false,
    },
  });

  // Fix: Properly type the degree change handler
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
      // Check for duplicate awards between Award1 and Award2
      if (values.Award1 === values.Award2) {
        toast.error(
          "You cannot select the same award for Award 1 and Award 2!"
        );
        setIsSubmitting(false);
        return;
      }

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

  function getRelevantAwards(faculty: string): string[] {
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

    // General awards available to all internal students (excluding ALL BESA awards and BESA Inter University)
    const defaultAwards = Object.values(AWARDS).filter(
      (award) => !award.startsWith("BESA")
    );

    // Get faculty-specific BESA awards (only for the selected faculty)
    const facultySpecificAwards = facultyToBesaAwardsMap[faculty] || [];

    // Combine general awards with faculty-specific BESA awards
    return [...defaultAwards, ...facultySpecificAwards];
  }

  const relevantAwards = getRelevantAwards(form.watch("Faculty"));

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
                    onValueChange={field.onChange}
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

          {/* Award 1 - Required */}
          <FormField
            control={form.control}
            name="Award1"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Award 1</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Award" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Award</SelectLabel>
                        {relevantAwards.map((award, index) => (
                          <SelectItem
                            key={`award1-${award}-${index}`}
                            value={award}
                          >
                            {award}
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

          {/* Award 2 - Required */}
          <FormField
            control={form.control}
            name="Award2"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Award 2</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Award" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Award</SelectLabel>
                        {relevantAwards.map((award, index) => (
                          <SelectItem
                            key={`award2-${award}-${index}`}
                            value={award}
                          >
                            {award}
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

          {/* Award 3 - Optional BESA Inter University Award */}
          <FormField
            control={form.control}
            name="Award3"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === "BESA - Inter University Award"}
                      onCheckedChange={(checked) => {
                        field.onChange(
                          checked ? "BESA - Inter University Award" : ""
                        );
                      }}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="text-sm font-normal leading-relaxed">
                      Also apply for BESA - Inter University Award (Optional)
                    </FormLabel>
                    <FormDescription className="text-xs text-slate-400">
                      You can apply for this award in addition to your 2 main
                      awards
                    </FormDescription>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

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
