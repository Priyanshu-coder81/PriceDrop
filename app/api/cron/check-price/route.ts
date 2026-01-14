import { sendPriceDropAlert } from "@/lib/email";
import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Price check endpoint is working" });
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const cronSecret = process.env.CRON_KEY;

        if(!cronSecret || authHeader !== `Bearer ${cronSecret}`){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing required environment variables for Supabase");
            }

        // use service role to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL ||"",
            process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        );

        const {data: products, error: prodcutError} = await supabase.from("products").select("*");

        if(prodcutError) throw prodcutError;

/* 
        Just for testing purposes

        const result = {
            total : products.length,
            updated: 0,
            failed: 0,
            priceChanges: 0,
            alertsSent: 0,
        }
 */
        for(const product of products){
            try {
                const productData = await scrapeProduct(product.url);

                if(!productData.currentPrice){
                    //result.failed++;
                    continue;
                }

                const newPrice = parseFloat((productData.currentPrice+""));
                const oldPrice = parseFloat(product.current_price);

                console.log(`Product: ${product.name}, Old Price: ${oldPrice}, New Price: ${newPrice}`);

                // Update product price in database
                const { error: updateError } = await supabase.from("products")
                .update({
                    current_price: newPrice,
                    name : productData.productName,
                    currency: productData.currencyCode || product.currency,
                    updated_at : new Date().toISOString(),
                })
                .eq("id", product.id);

                if (updateError) {
                    console.error(`Failed to update product ID ${product.id}:`, updateError);
                    throw updateError;
                }

                // update price history in database
                if (oldPrice !== newPrice) {
                    const { error: historyError } = await supabase.from("price_history").insert({
                        product_id: product.id,
                        price: newPrice,
                        currency: productData.currencyCode || product.currency,
                        checked_at: new Date().toISOString(),
                    });

                    if (historyError) {
                        console.error(`Failed to insert price history for product ID ${product.id}:`, historyError);
                        throw historyError; // or handle differently, but throwing will increment failed
                    }

                   // result.priceChanges++;
                }

                if(newPrice < oldPrice){
                    // Alert email
                    const { data : {user}} = await supabase.auth.admin.getUserById(product.user_id);
                

                if(user?.email){
                    // send alert email
                    const emailResult = await sendPriceDropAlert(user.email, product, oldPrice, newPrice);
                      if (emailResult?.success) {
                       // result.alertsSent++;
                    }
                }
            }
                //result.updated++;

                
            } catch (error) {
                console.error(`Failed to update product ID ${product.id}`, error);
              //  result.failed++;
            }
        }

        return NextResponse.json({ message: "Price check completed" }, { status: 200 });
        
    } catch (error) {
        console.error("Cron Job Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}