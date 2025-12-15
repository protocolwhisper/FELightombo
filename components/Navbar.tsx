import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
      <div className="flex items-center gap-2">
        <Image 
          src="/tombo2.png" 
          alt="Lightombo Logo" 
          width={32} 
          height={32} 
          className="rounded-full object-cover"
        />
        <span className="text-xl font-bold text-white tracking-tighter">Lightombo</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="#" className="hover:text-white transition-colors">Products</Link>
        <Link href="#" className="hover:text-white transition-colors">About Lightombo</Link>
        <Link href="#" className="hover:text-white transition-colors">Use Cases</Link>
        <Link href="#" className="hover:text-white transition-colors">Blog</Link>
        <Link href="#" className="hover:text-white transition-colors">Docs</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="#" className="text-sm font-medium text-white hover:text-gray-300 hidden sm:block">
          Log In
        </Link>
        <Link href="#" className="bg-white text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}



