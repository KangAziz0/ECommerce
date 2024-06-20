"use client"

import * as z from "zod"
import axios from "axios"
import { useModalStore } from "@/hooks/use-store-modal"
import Modal from "../ui/modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import toast from "react-hot-toast"


const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const [loading, setLoading] = useState(false)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/stores', values)
            toast.success('Berhasil Membuat Toko')
        } catch (error) {
            toast.error('Gagal Coba Lagi')
        }finally{
            setLoading(false)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });

    const storeModal = useModalStore();
    return (
        <Modal title="Store" description="Store Description" isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
            <div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name Toko" {...field} disabled={loading}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="mt-5 space-x-2 flex justify-end">
                                <Button variant="outline" onClick={storeModal.onClose} disabled={loading}>Cancel</Button>
                                <Button type="submit" disabled={loading}>Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}