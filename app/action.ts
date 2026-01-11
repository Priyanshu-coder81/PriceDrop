"use server";

import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut(){
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/");
    redirect("/");
}


export async function addProduct(formData : FormData){
    const url = formData.get("url")?.toString();

    if(!url){
        return {error: "Product URL is required" };
    }

    try {
        const supabase = await createClient();
        const {data : {user}} = await supabase.auth.getUser();

        if(!user){
            return { error: "User not authenticated"};
    } 
    const productData = await scrapeProduct(url);

    if(!productData.productName || !productData.currentPrice) {
        console.log(productData, "product data");
        return { error: "Failed to extract product data from the URL"};
    }

    const newPrice = parseFloat(productData.currentPrice.toString());

    const currency = productData.currencyCode || "INR";

    const {data : existingProduct} = await supabase.from("products")
    .select("id, current_price")
    .eq("user_id", user.id)
    .eq("url", url)
    .single();

    const isUpdate = !!existingProduct;

    // update product(insert or update based on user_id or url)
    const {data: product,error} = await supabase.from("products").upsert({
        user_id: user.id,
        url,
        name:productData.productName,
        current_price: newPrice,
        currency,
        image_url: productData.productImageUrl || null,
        updated_at: new Date().toISOString(),
    },
    {
        onConflict: "user_id,url",
        ignoreDuplicates: false,
    }
    )
    .select()
    .single();

    if(error){
        console.error("Supabase upsert error:", error);
        return { error: "Failed to add/update product in the database"};
    }

    const shouldAddPriceHistory = !isUpdate || (existingProduct && existingProduct.current_price !== newPrice);

    if(shouldAddPriceHistory){
        await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency:currency,
        });
    }

    revalidatePath("/");


    return {
        sucess: true,
        product,
        message: isUpdate? "Product updated with latest price" : "Product added Successfully"
    }
}
    
    catch (error: any) {
        console.error("Add product error:", error);
        return { error: error.message || "Failed to add product"};
    }
}


export async function deleteProduct(productId: number){

    try {
        const supabase = await createClient();

        const {error} = await supabase.from("products")
        .delete()
        .eq("id", productId);

        if(error){ throw error;}

        revalidatePath("/");

        return { success: true };

    } catch (error : any) {
        return {error: error.message || "Failed to delete product"}
    }
}

export async function getProducts(){
    try {
        const supabase = await createClient();
    
        const {data, error} = await supabase.from("products")
        .select("*")
        .order("created_at", {ascending: false});
    
        if(error) throw error;
    
        return data || [];
    } catch (error) {
        console.error("Get products error:", error);
        return [];
    }
}

export async function getPriceHistory(productId: number){
    try {
        const supabase = await createClient();

        const {data, error} = await supabase.from("price_history")
        .select("*")
        .eq("product_id", productId)
            .order("checked_at", {ascending: true});
        
        if(error) throw error;

        return data || [];

    } catch (error) {
        console.error("Get price history error:", error);
        return [];
    }
}


