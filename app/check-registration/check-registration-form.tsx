"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    Whatsapp: z.string().refine((value) => /^7\d{0,8}$/.test(value), {
        message: "Please enter WhatsApp number without the 0.",
    }),
})


interface User {
    Name: string;
    Whatsapp: string;
    Email: string;
    RegNo: string;
}

interface ResponseData {
    user: User[];
}

export default function CheckRegistrationForm() {
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
       Whatsapp: "",
    },
});

async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        const response = await fetch('/api/getregno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result: ResponseData = await response.json();
            setResponseData(result);
            
        } else {
            console.error('Error:', response.status);
            setResponseData(null);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="flex items-center space-x-2">
            <FormField
            control={form.control}
            name="Whatsapp"
            render={({ field }) => (
                <FormItem className="w-full">
                <FormControl>
                    <Input placeholder="7XXXXXXXX" {...field} maxLength={9}  />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Submit</Button>
        </div>
        {responseData && (
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20">
                <div className="mx-auto max-w-3xl space-y-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent sm:text-4xl">{responseData.user[0].Name}</h2>
                    <p className="text-muted-foreground">WhatsApp Number: +94 {responseData.user[0].Whatsapp}</p>
                </div>
                <div className="rounded-lg bg-card p-6 text-card-foreground">
                    <div className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Registration Details</h3>
                        <p className="text-sm text-muted-foreground">Email: {responseData.user[0].Email}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Awards Applied For</h3>
                        <ul className="space-y-2">
                        {responseData.user.map((item: any, index: any) => (
                        <li className="flex items-center justify-between" key={index}>
                            <div>
                            {item.RegNo.startsWith('TP') && 'Best Team Player'}
                            {item.RegNo.startsWith('BL') && 'Best Leader'}
                            {item.RegNo.startsWith('BC') && 'Best Communicator'}
                            {item.RegNo.startsWith('CD') && 'Best Creative Designer'}
                            {item.RegNo.startsWith('YE') && 'Best Young Entrepreneur'}
                            {item.RegNo.startsWith('BI') && 'Best Innovator'}
                            {item.RegNo.startsWith('CSR') && 'Best CSR'}
                            {item.RegNo.startsWith('FMSC') && 'BESA - FMSC'}
                            {item.RegNo.startsWith('FHSS') && 'BESA - FHSS'}
                            {item.RegNo.startsWith('FAS') && 'BESA - FAS'}
                            {item.RegNo.startsWith('FOT') && 'BESA - FOT'}
                            {item.RegNo.startsWith('FAHS') && 'BESA - FAHS'}
                            {item.RegNo.startsWith('FOE') && 'BESA - FOE'}
                            {item.RegNo.startsWith('FMS') && !item.RegNo.startsWith('FMSC') && 'BESA - FMS'}
                            {!item.RegNo.startsWith('TP') &&
                            !item.RegNo.startsWith('BL') &&
                            !item.RegNo.startsWith('BC') &&
                            !item.RegNo.startsWith('CD') &&
                            !item.RegNo.startsWith('YE') &&
                            !item.RegNo.startsWith('BI') &&
                            !item.RegNo.startsWith('CSR') &&
                            !item.RegNo.startsWith('FMSC') &&
                            !item.RegNo.startsWith('FHSS') &&
                            !item.RegNo.startsWith('FAS') &&
                            !item.RegNo.startsWith('FOT') &&
                            !item.RegNo.startsWith('FAHS') &&
                            !item.RegNo.startsWith('FOE') &&
                            !item.RegNo.startsWith('FMS') && 'Unknown Award'}
                            </div>
                            <div className="text-sm text-muted-foreground">{item.RegNo}</div>
                        </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                </div>
                </div>
            </div>
      )}
      </form>
    </Form>
  )
}