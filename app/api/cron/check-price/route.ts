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

        console.log(`Checking prices for ${products.length} products`);


        const result = {
            total : products.length,
            updated: 0,
            failed: 0,
            priceChanges: 0,
            alertsSent: 0,
        }

        for(const product of products){
            try {
                const productData = await scrapeProduct(product.url);

                if(!productData.currentPrice){
                    result.failed++;
                    continue;
                }

                const newPrice = parseFloat((productData.currentPrice+""));
                const oldPrice = parseFloat(product.current_price);

                console.log(`Product: ${product.name}, Old Price: ${oldPrice}, New Price: ${newPrice}`);

                // Update product price in database
                await supabase.from("products")
                .update({
                    current_price: newPrice,
                    name : productData.productName,
                    currency: productData.currencyCode || product.currency,
                    updated_at : new Date().toISOString(),
                })
                .eq("id", product.id);

                // update price history in database
                if(oldPrice !== newPrice){
                    await supabase.from("price_history").insert({
                        product_id: product.id,
                        price: newPrice,
                        currency: productData.currencyCode || product.currency,
                    });

                    result.priceChanges++;
                    console.log(`Price change detected for product ID ${product.id}: ${oldPrice} -> ${newPrice}`);
                }

                if(newPrice < oldPrice){
                    // Alert email
                    console.log("Sending price drop email")
                    const { data : {user}} = await supabase.auth.admin.getUserById(product.user_id);
                

                if(user?.email){
                    // send alert email
                    const emailResult = await sendPriceDropAlert(user.email, product, oldPrice, newPrice);
                      if (emailResult?.success) {
                        result.alertsSent++;
                    }
                }
            }
                result.updated++;

                
            } catch (error) {
                console.error(`Failed to update product ID ${product.id}`, error);
                result.failed++;
            }
        }

        return NextResponse.json({ message: "Price check completed", result });
        
    } catch (error) {
        console.error("Cron Job Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// curl.exe -X POST https://price-dropp.vercel.app/api/cron/check-price -H "Authorization: Bearer eb78f5c9630210425736d4e03eef434025c770b0d297b8ede4f2271565320976"
// curl.exe -X POST http://localhost:3000/api/cron/check-price -H "Authorization: Bearer eb78f5c9630210425736d4e03eef434025c770b0d297b8ede4f2271565320976"