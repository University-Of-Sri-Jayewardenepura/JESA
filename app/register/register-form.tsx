"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  gender: z.string().optional(),
  mobileNumber: z
    .string()
    .min(10, { message: "Mobile number should be 10 characters." }),
  university: z.string().optional(),
  faculty: z.string().optional(),
  degree: z.string().optional(),
  awards: z.string().optional(),
});



function RegisterForm() {
  const [degreeOptions, setDegreeOptions] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

function onSubmit(){
  console.log("Submitted");
}

// useEffect(() => {
//   if (form.getValues("faculty")) {
//     const facultyDegrees = facultiesDegrees[form.getValues("faculty")] || [];
//     setDegreeOptions(facultyDegrees);
//   }
// }, [form.getValues("faculty")]);

// function onSubmit(values: z.infer<typeof formSchema>) {
//   console.log(values);
// }
  
  return (
    <Form {...form}>
      {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Pruthivi Thejan" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="pruthivithejan@gmail.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
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
        name="mobileNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input placeholder="07XXXXXXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="registrationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number</FormLabel>
            <FormControl>
              <Input placeholder="TE110XXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="faculty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Faculty</FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Faculty</SelectLabel>
                    <SelectItem value="Faculty of Management Studies & Commerce">
                      Faculty of Management Studies & Commerce
                    </SelectItem>
                    <SelectItem value="Faculty of Applied Sciences">
                      Faculty of Applied Sciences
                    </SelectItem>
                    <SelectItem value="Faculty of Humanities & Social Sciences">
                      Faculty of Humanities & Social Sciences
                    </SelectItem>
                    <SelectItem value="Faculty of Allied Health Sciences">
                      Faculty of Allied Health Sciences
                    </SelectItem>
                    <SelectItem value="Faculty of Technology">
                      Faculty of Technology
                    </SelectItem>
                    <SelectItem value="Faculty of Engineering">
                      Faculty of Engineering
                    </SelectItem>
                    <SelectItem value="Faculty of Medical Sciences">
                      Faculty of Medical Sciences
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />

            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Academic Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Academic Year</SelectLabel>
                          {form.getValues("faculty") ===
                          "Faculty of Medical Sciences" ? (
                            <>
                              <SelectItem value="2nd Year">2nd Year</SelectItem>
                              <SelectItem value="3rd Year">3rd Year</SelectItem>
                              <SelectItem value="4th Year">4th Year</SelectItem>
                              <SelectItem value="5th Year">5th Year</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="2nd Year">2nd Year</SelectItem>
                              <SelectItem value="3rd Year">3rd Year</SelectItem>
                              <SelectItem value="4th Year">4th Year</SelectItem>
                            </>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="faculty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Faculty</FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Faculty</SelectLabel>
                    {/* Dynamically add faculty options here */}
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
        name="degree"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Degree</SelectLabel>
                    {degreeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
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

      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default RegisterForm;
