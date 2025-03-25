import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* App Logo/Title */}
        <Link href="/">
          <p className="text-xl font-bold text-gray-800">Etomovich Journal</p>
        </Link>
        {/* Navigation / Sign In button */}
        <nav>
          <Link href="/signin">
            <p
              className={cn(
                "px-4 py-2 rounded-md font-medium",
                "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              )}
            >
              Sign In
            </p>
          </Link>
        </nav>
      </div>
    </header>
  );
}
