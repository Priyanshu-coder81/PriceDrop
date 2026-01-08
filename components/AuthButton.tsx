"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import {AuthModel} from "./AuthModel"
import { signOut } from "@/app/action";

const AuthButton = ({user}:any ) => {
  const [showAuthModel, setShowAuthModel] = useState(false);

    if(user){
        return (
            <form action={signOut}>
                <Button variant="ghost" size={"sm"} type="submit" className=" gap-2">
                    <LogOut /> 
                    Sign Out
                </Button>
            </form>
        )
    }

  return <>

<Button variant="default" size="sm" className="bg-(--primary)/90 hover:bg-primary gap-2 text-white" 
onClick={() => setShowAuthModel(true)}
> <LogIn  className="w-4 h-4"/> Sign In</Button>

<AuthModel isOpen={showAuthModel}
onClose= {() => setShowAuthModel(false)}
></AuthModel>
</>
};

export default AuthButton;
