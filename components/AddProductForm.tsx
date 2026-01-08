"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Loader2Icon } from "lucide-react";
import AuthButton from "./AuthButton";

const AddProductForm = ({user}:any)  => {
    const [url,setUrl] = useState("");
    const [loading, setLoading]  = useState(false);
  return (
    <>
    <form action="" className="w-full max-w-2xl mx-auto">
        <div className='flex flex-col sm:flex-row gap-2'>
            <Input
            type="url"
            value={url} 
            onChange={(e)=> setUrl(e.target.value)}
            placeholder="Place product URL"
            className="h-12 text-base"
            required
            disabled={loading}
            >
                
                </Input>

            <Button className="bg-primary/90 hover:bg-primary h-10 sm:h-12 px-8" size={"lg"}>
                {loading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding..
                    </>
                ): ("Track Price")}
            </Button>
        </div>
    </form>

    {/*  */}
    
    </>
  )
}

export default AddProductForm