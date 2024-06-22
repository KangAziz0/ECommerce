"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { banner } from "@prisma/client"
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
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"


interface BannerFormProps {
    initialData: banner | null
}

const formSchema = z.object({
    label: z.string().min(3),
    imageUrl: z.string().min(1)
})

type SettingFormValues = z.infer<typeof formSchema>

export const BannerForm: React.FC<BannerFormProps> = ({ initialData }) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Edit Banner' : 'Buat Banner'
    const description = initialData ? 'Edit Banner Toko' : 'Buat Banner Toko'
    const toastMessage = initialData ? 'Banner Berhasil di Edit' : 'Banner Berhasil Dibuat'
    const action = initialData ? 'Simpan Banner' : 'Buat Banner'


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: SettingFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/banners/${params.bannerId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/banners`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/banners`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Cek Kembali Form Anda')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}/banners/${params.bannerId}`)
            router.refresh()
            router.push(`/${params.storeId}/banners`)
            toast.success('Banner Berhasil Dihapus')
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
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {
                    initialData &&
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                }
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="label" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input placeholder="Label Banner" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload disabled={loading} onRemove={() => field.onChange("")} onChange={(url) => field.onChange(url)} value={field.value ? [field.value] : []} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}