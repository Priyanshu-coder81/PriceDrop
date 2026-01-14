"use client"

import { deleteProduct } from "@/app/action";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, ExternalLink, Trash } from "lucide-react";
import Link from "next/link";
import PriceChart from "./PriceChart";

const ProductCard = ({product} : any) => {
    const [showChart, setShowChart] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async() =>{
        if(!confirm("Are you sure you want to delete this product?")){
            return;
        }

        setDeleting(true);
       const result =  await deleteProduct(product.id);

       if(result.error){
        toast.error(result.error);
       }else{
        toast.success("Product deleted successfully");

       }

       setDeleting(false);
    }

  return (
    <Card className="hover:shadow-lg transition-shadow w-full mx-auto ">
  <CardHeader className="pb-3">
    <div className="flex gap-4">
        {product.image_url && (
            <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-md border" />
            )
        }
        <div className="flex-1 min-w-0">
            <h3 className=" font-semibold text-gray-900 line-clamp-2 mb-2">
                {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{product.currency} {product.current_price}</span>
            </div>
        </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-2">
        <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => setShowChart(!showChart)}
        className="gap-1">
            {showChart ? (
                <>
                <ChevronUp className="w-4 h-4"  />
                Hide Chart
                </>
            ) : (
                <>
                <ChevronDown className="w-4 h-4" />
                Show Chart
                </>
            )}
        </Button>

        <Button 
        variant={"outline"}
        size={"sm"} asChild className="gap-1"
        >
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
                View Product
            </Link>
        </Button>

        <Button 
        variant={"ghost"}
        size={"sm"}
        onClick={handleDelete}
        disabled={deleting}
        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red=50"
        >
            <Trash className="w-4 h-4" />
            Remove
        </Button>
    </div>
  </CardContent>
  {showChart && 
  <CardFooter className="pt-0">
    <PriceChart productId ={product.id} />
  </CardFooter>}
</Card>
  )
}

export default ProductCard