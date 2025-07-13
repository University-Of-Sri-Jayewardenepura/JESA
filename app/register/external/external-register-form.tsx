"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { UNIVERSITY, ACADEMICYEAR, AWARDS } from "@/constants/form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
  NIC: z
    .string()
    .min(1, "NIC is required.")
    .refine(
      (value) => {
        // Check if it's a 12-digit number
        const twelveDigitPattern = /^\d{12}$/;
        // Check if it's a 9-digit number ending with 'V' or 'v'
        const nineDigitWithVPattern = /^\d{9}[Vv]$/;

        return (
          twelveDigitPattern.test(value) || nineDigitWithVPattern.test(value)
        );
      },
      {
        message:
          "NIC must be either a 12-digit number or a 9-digit number ending with 'V'",
      }
    ),
  Gender: z.string().min(1, "Gender is required."),
  Email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(1, "Email is required."),
  Whatsapp: z
    .string()
    .min(10, { message: "Mobile number should be 10 characters." }),
  University: z.string().min(1, "University is required."),
  Faculty: z.string().min(1, "Faculty is required."),
  UniversityRegisterId: z
    .string()
    .min(1, "University Registration Number is required."),
  AcademicYear: z.string().min(1, "Academic Year is required."),
  Award1: z.string().min(1, "Award is required."),
  Award2: z.string().optional(),
  WhichIndustry: z.string().optional(),
  TermsAndConditions: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

function ExternalRegisterForm() {
  const router = useRouter();
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const universityNames = Object.values(UNIVERSITY).filter(
    (universityName) => universityName !== "University of Sri Jayewardenepura"
  );

  const academicYear = Object.values(ACADEMICYEAR);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  // Watch Award1 and Award2 values to determine if industry question should show
  const award1 = form.watch("Award1");
  const award2 = form.watch("Award2");

  // Check if Best Innovator is selected in either award
  const isBestInnovatorSelected =
    award1 === AWARDS.BEST_INNOVATOR || award2 === AWARDS.BEST_INNOVATOR;

  // Add available awards for external students
  const availableAwards = [AWARDS.BEST_INNOVATOR, AWARDS.BESA_INTER_UNIVERSITY];

  async function OnSubmit(values: any) {
    setIsSubmitting(true);

    // If Best Innovator is not selected, remove WhichIndustry from submission
    if (!isBestInnovatorSelected) {
      delete values.WhichIndustry;
    }

    const response = await fetch("/api/register/external", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = JSON.parse(errorText);
      const errorMessage = errorData.message;
      toast.error(errorMessage);
      setIsSubmitting(false);
    } else {
      const data = await response.json();
      router.push("/register/success");
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <h2 className="pb-8 bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text text-center font-title text-[32px] leading-[1.125] tracking-tight text-transparent md:text-[40px] lg:text-[48px]">
        External Registration
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
            name="NIC"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>NIC</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your NIC Number"
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
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select University</SelectLabel>
                        {universityNames.map((universityName, index) => (
                          <SelectItem key={index} value={universityName}>
                            {universityName}
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
                  <Input
                    placeholder="Enter Your Faculty"
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
            name="Award1"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Award 1 (Required)</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Your Award" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Award</SelectLabel>
                        {availableAwards.map((award, index) => (
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
              <FormItem className="w-full">
                <FormLabel>Award 2 (Optional)</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Your Award" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Award</SelectLabel>
                        {availableAwards.map((award, index) => (
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

          {/* Only show industry question if Best Innovator is selected */}
          {isBestInnovatorSelected && (
            <FormField
              control={form.control}
              name="WhichIndustry"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    To Which Industry is Your Innovation Related?
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Answer"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    If there are multiple products relating to multiple
                    industries, please mention all the industries.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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

export default ExternalRegisterForm;
