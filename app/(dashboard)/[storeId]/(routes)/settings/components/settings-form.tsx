"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { store } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"

interface SettingFormProps {
    initialData: store
}

const formSchema = z.object({
    name: z.string().min(3)
})

type SettingFormValues = z.infer<typeof formSchema>

export const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()
    
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const descriptionOfDelete = 'Apakah Anda Yakin Ingin Menghapus Toko Ini !!!'

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: SettingFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success('Toko Berhasil Diubah')
        } catch (error) {
            toast.error('Cek Kembali Form Anda')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success('Toko Berhasil Dihapus')
        } catch (error) {
            toast.error('Cek Kembali Form Anda')
            console.log(error);
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} description={descriptionOfDelete}/>
            <div className="flex items-center justify-between">
                <Heading title="Toko" description="Atur Toko Anda" />
                <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama Toko" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} type="submit">Save</Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
        </>
    )
}