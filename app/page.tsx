import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className='min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50'>
      <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky z-10 top-0 w-full'>
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
              
          <div>
          <Button variant="default" size="sm" className="bg-[#E7A55E]/90 hover:bg-[#E7A55E] gap-2" > Sign In</Button>
          </div>
        </div>
      </header>
    </main>
  );
}
