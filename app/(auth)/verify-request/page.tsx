import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerfiyRequst(){
    return(
        <Card>
            <CardHeader>
              <CardTitle>Please check your email</CardTitle>  
              <CardDescription>We have sent a verfication email code to your email address. Please open the email and the paste the code below </CardDescription>
            </CardHeader>
        </Card>
    )
}