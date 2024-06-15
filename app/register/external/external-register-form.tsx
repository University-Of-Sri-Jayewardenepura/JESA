"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { UNIVERSITY, ACADEMICYEAR } from "@/constants/form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  NIC: z.string().nonempty("NIC is required."),
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
  Faculty: z.string().nonempty("Faculty is required."),
  UniversityRegisterId: z
    .string()
    .nonempty("University Registration Number is required."),
  AcademicYear: z.string().nonempty("Academic Year is required."),
  Award: z.string().nonempty("Award is required.").default("Best Innovator"),
  WhichIndustry: z.string().nonempty("Industry information is required."),
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
    mode: "onChange",
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    //console.log(values);
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
      //console.log("API response", data);
      router.push("/register/success");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 md:w-96 sm:w-80 w-80"
      >
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
          name="NIC"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIC</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your NIC Number" {...field} />
              </FormControl>
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
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Faculty" {...field} />
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
          name="Award"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Your Award</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value="Best Innovator"
                  disabled={true}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Your Award" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Award</SelectLabel>
                      <SelectItem value="Best Innovator">
                        Best Innovator
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
          name="WhichIndustry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                To Which Industry is Your Innovation Related?
              </FormLabel>
              <FormControl>
                <Input placeholder="Your Answer" {...field} />
              </FormControl>
              <FormDescription>
                If there are multiple products relating to multiple industries,
                please mention all the industries.{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="TermsAndConditions"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input type="checkbox" {...field} required />
              </FormControl>
              <FormLabel>
                &nbsp; I confirm that the information above is accurate to the
                best of my knowledge and in accordance with the{" "}
                <Link href="/terms" className="underline">
                  terms and conditions.
                </Link>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
      <Toaster />
    </Form>
  );
}

export default ExternalRegisterForm;
