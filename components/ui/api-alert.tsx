'use client'

import { Copy, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Badge, BadgeProps } from "./badge"
import { Button } from "./button"
import toast from "react-hot-toast"

interface ApiAlertProps {
    title: string,
    description: string,
    variant: 'public' | 'admin'
}

const textMap: Record<ApiAlertProps['variant'], string> = {
    public: 'Public',
    admin: 'Admin'
}
const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
    public: 'secondary',
    admin: 'destructive'
}

export const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant = 'public' }) => {

    const onCopy = () => {
        navigator.clipboard.writeText(description)
        toast.success('API Copied')
    }
    return (
        <Alert>
            <AlertTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    {title}
                    <Badge variant={variantMap[variant]}>
                        {textMap[variant]}
                    </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={onCopy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center">
                <code className="flex rounded bg-muted px-[0.3rem] py-[0.2rem] font-mone text-xs lg:text-sm ">
                    {description}
                </code>
            </AlertDescription>
        </Alert>
    )
}
