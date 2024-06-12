"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
} from "@/app/constants";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  Name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .nonempty("Name is required."),
  Gender: z.string().nonempty("Gender is required."),
  Email: z
    .string()
    .email({ message: "Invalid email address." })
    .nonempty("Email is required."),
  Whatsapp: z
    .string()
    .min(10, { message: "Mobile number should be 10 characters." })
    .nonempty("WhatsApp number is required."),
  University: z.string().nonempty("University is required."),
  UniversityRegisterId: z
    .string()
    .nonempty("University Registration Number is required."),
  AcademicYear: z.string().nonempty("Academic Year is required."),
  Faculty: z.string().nonempty("Faculty is required."),
  Degree: z.string().nonempty("Degree is required."),
  IsPastParticipant: z.boolean().default(false),
  Award1: z.string().nonempty("Award is required."),
  Award2: z.string().optional(),
  Award3: z.string().optional(),
});

function InternalRegisterForm() {
  const router = useRouter();

  type DegreeOptions =
    | MGT_DEGREE[]
    | APPL_DEGREE[]
    | HUM_DEGREE[]
    | ALMED_DEGREE[]
    | TECH_DEGREE[]
    | ENG_DEGREE[]
    | MED_DEGREE[];
  const [degreeOptions, setDegreeOptions] = useState<DegreeOptions>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const academicYear = Object.values(ACADEMICYEAR);

  const faculties = Object.values(FACULTY);

  function handleFacultyChange(selectedFaculty: string) {
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
      default:
        setDegreeOptions([]);
    }
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);

    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined)
    );
    console.log(cleanedValues);
    const response = await fetch(
      "http://localhost:3000/api/register/internal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = JSON.parse(errorText);
      const errorMessage = errorData.message;
      toast.error(errorMessage);
      setIsSubmitting(false);
    } else {
      const data = await response.json();
      console.log("API response", data);
      router.push("/register/success");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
        <FormField
          control={form.control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Name" {...field} />
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
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
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
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Email Here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input placeholder="07XXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="University"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
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
            <FormItem>
              <FormLabel>University Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="TE110XXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="AcademicYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Academic Year</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
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
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFacultyChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
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
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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

        <FormField
          control={form.control}
          name="IsPastParticipant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Are you a member of the JESA-2024 Organizing Committee ?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel> Select Answer</SelectLabel>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues("IsPastParticipant") === true ? (
          <>
            <FormField
              control={form.control}
              name="Award1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award 1</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Award" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Award</SelectLabel>
                          {Object.values(AWARDS).map((award, index) => (
                            <SelectItem key={index} value={award}>
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
            <FormField
              control={form.control}
              name="Award2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award 2</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Award" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Award</SelectLabel>
                          {Object.values(AWARDS).map((award, index) => (
                            <SelectItem key={index} value={award}>
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
            <FormField
              control={form.control}
              name="Award3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award 3</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Award" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Award</SelectLabel>
                          {Object.values(AWARDS).map((award, index) => (
                            <SelectItem key={index} value={award}>
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
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="Award1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award 1</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Award" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Award</SelectLabel>
                          {Object.values(AWARDS).map((award, index) => (
                            <SelectItem key={index} value={award}>
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
            <FormField
              control={form.control}
              name="Award2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award 2</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Award" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Award</SelectLabel>
                          {Object.values(AWARDS).map((award, index) => (
                            <SelectItem key={index} value={award}>
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
          </>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
      <Toaster />
    </Form>
  );
}

export default InternalRegisterForm;
