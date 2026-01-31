import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Bell, CircleUserRound, Divide, Icon, LogIn, Rabbit, Shield, TrendingDown } from "lucide-react";


import Image from "next/image";
import { getProducts } from "./action";
import ProductCard from "@/components/ProductCard";

export default async function Home() {

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser()

  const product = user ? await getProducts() : []

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  return (
    <main className='min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50'>
      <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 w-full z-20'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <Image
              src={"/logo.png"}
              alt='logo'
              width={600}
              height={600}
              className='h-15 w-auto'
            ></Image>
          </div>

          <div className="font-semibold text-2xl hidden min-[550px]:flex gap-2 items-center font-heading">
            {user ? "Hello, " + user.user_metadata.name : "Hello, Guest"}
            <CircleUserRound />
          </div>

          <div>
            <AuthButton user={user} />
          </div>
        </div>
      </header>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[60%_40%]">
          <div className="text-start pt-12 " >
            <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Unlock Your Best Price!</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl ">

              <span className="block">Effortless price tracking across all online stores.</span>
              <span className="block">
                Catch the dip before it's gone. Real-time alerts for the savings you deserve.
              </span>


            </p>

            {/* Product Form */}
            <AddProductForm user={user}></AddProductForm>


            {/* Features */}

          </div>
          <div className="self-center flex justify-center relative">

            <img src="/model.png" alt="model Image" className="z-10" />
            <img src="/background.png" alt="backgound Image" className="absolute" />
          </div>
        </div>
      </section>

      {/* Features */}

      {product.length === 0 && (
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-0 pb-10">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100/50 hover:border-orange-200/50 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                  <Icon className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && product.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900"> Your Tracked Products</h3>

            <span className="text-sm text-gray-500">
              {product.length} {product.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className=" grid gap-6 md:grid-cols-2 items-start">
            {product.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Product List */}
      {user && product.length == 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Produts yet
            </h3>
            <p className="text-gray-600">
              Add your first produect to start tracking price drops!
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
