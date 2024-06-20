export default function AuthLayout({
    children,
}:{
    children:React.ReactNode
}){
    return (<header className="flex justify-center items-center h-screen">{children}</header>)
}