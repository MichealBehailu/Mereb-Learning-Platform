"use client";


import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


const features : {title: string, description: string, icon: string}[] = [
    {
        title: 'Comprehensive Courses',
        description: 'Access a wide range of carefully curated courses designed by industry experts.',
        icon: '📚'
    },

    {
        title:'Interactive Learning',
        description:'Engage with interactive content, quizzes, and assignment to enhance your learning experience.',
        icon: '💻'
    },
    {
        title: 'Progress Tracking',
        description: 'Monitor your progress achievements with detailed analytics and personalized dashboards.',
        icon: '📊'
    },
    {
        title: 'Community',
        description: 'Connect with like-minded learners and share knowledge in our vibrant community.',
        icon: '👥'
    }
]

export default function Home() {

 

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8 ">
          <Badge variant={"outline"}>The Place To Learn About Computer</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your Learning Experience
          </h1>
          <p className=" max-w-[800px] text-muted-foreground text-center md:text-xl">
            Discover the power of personalized learning with our modern,
            interactive learning management system. Access high-quality courses
            anytime, anywhere
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Explore Courses
            </Link>

            {/* TODO: the sign in button below is going to be rendered even if it has a session so deal with it later */}

            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="text-4xl mb-4">
                            {feature.icon}
                        </div>
                        <CardTitle>{feature.title}</CardTitle>   
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent> 
                </Card>
              ))}
      </section>
    </>
  );
}

//TODO: check the logout page on the index page and navigate to the login page /login check if you can access the page
