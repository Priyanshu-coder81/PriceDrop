import { ProductData } from '@/types/interfaces';
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

export const scrapeProduct= async (url: string) => {
    try {
        const result = await firecrawl.scrape(url,{
            formats : [
                {
                    type : 'json',
                    schema : {
          type: "object",
          properties: {
            productName: { type: "string" },
            currentPrice: { type: "number" },
            currencyCode: { type: "string" },
            productImageUrl: { type: "string" },
          },
          required: ["productName", "currentPrice"],
        },
                    prompt:"Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, INR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available,"

                }
            ]
        });

        const extracedData = result.json as ProductData;

        if(!extracedData || !extracedData.productName || !extracedData.currentPrice){
            throw new Error("No data extracted from URL");
        }

        return extracedData;

    } catch (error : any) {
        console.error("Firecrawl scrape error:", error);
        throw new Error(`Failed to scrape product data" ${error.message}`);
    }
}