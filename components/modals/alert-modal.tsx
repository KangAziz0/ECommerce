"use client"

import { useEffect, useState } from "react"
import Modal from "../ui/modal"
import { Button } from "../ui/button"

interface AlertModalProps{
    isOpen:boolean,
    onClose:()=>void
    onConfirm:()=>void,
    loading:boolean,
    description:string
}

export const AlertModal: React.FC<AlertModalProps> = ({isOpen,onClose,onConfirm,loading,description}) => {
    const [isMounted,setIsMounted] = useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    return (
        <Modal title="Konfirmasi" description={description} isOpen={isOpen} onClose={onClose}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" disabled={loading} onClick={onClose}>Batal</Button>
                <Button variant="destructive" disabled={loading} onClick={onConfirm}>Lanjutkan</Button>
            </div>
        </Modal>
    )
}
