import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ShieldX } from "lucide-react"
export default function NotAdminRoute(){

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                        <ShieldX className="size-16 text-destructive"/>
                    </div>

                    <CardTitle className="text-2xl">Access Restricted</CardTitle>
                    <CardDescription className="max-w-md">Opps! Sorry you are not an admin, you cannot create courses or lessons. </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}