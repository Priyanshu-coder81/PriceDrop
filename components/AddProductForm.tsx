"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Search } from "lucide-react";
import { AuthModel } from "./AuthModel";
import { addProduct } from "@/app/action";
import { toast } from "sonner";

const AddProductForm = ({ user }: any) => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAuthModel, setShowAuthModel] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setShowAuthModel(true);
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("url", url);

        const result = await addProduct(formData);

        if (result.error) {
            toast.error(result.error);
        }
        else {
            toast.success(result.message || "Product added successfully");
            setUrl("");
        }

        setLoading(false);

    }
    return (
        <>
            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                <div className='relative'>
                    <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste Product URL"
                        className="w-full pl-6 pr-14 h-16 rounded-full border-2 border-orange-100 bg-white shadow-[0_0_20px_rgba(251,146,60,0.15)] focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:border-orange-200 transition-all text-lg placeholder:text-gray-400"
                        required
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-transparent hover:bg-orange-50 text-orange-400 hover:text-orange-600 p-0"
                        variant="ghost"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (<Search className="h-6 w-6" />)}
                    </Button>
                </div>
            </form>

            {/*  Auth Model */}
            <AuthModel isOpen={showAuthModel}
                onClose={() => setShowAuthModel(false)}
            ></AuthModel>



        </>
    )
}

export default AddProductForm