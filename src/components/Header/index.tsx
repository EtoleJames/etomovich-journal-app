"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

interface MenuItem {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: MenuItem[];
}

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Mobile navbar toggle state.
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => setSticky(window.scrollY >= 80);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Logout handler.
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  // Recursive function to render menu items with nested submenus.
  const renderMenu = (items: MenuItem[], level = 0) => {
    return (
      <ul
        className={
          level === 0
            ? "flex flex-col lg:flex-row lg:space-x-12"
            : "absolute left-0 top-full hidden min-w-[200px] bg-white p-4 shadow-lg group-hover:block"
        }
      >
        {items.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          return (
            <li key={item.id} className="relative group">
              {item.path ? (
                <Link
                  href={item.path}
                  target={item.newTab ? "_blank" : "_self"}
                  className={`block py-2 px-4 text-base lg:px-0 lg:py-6 ${
                    pathname === item.path
                      ? "text-primary dark:text-white"
                      : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                  }`}
                >
                  {item.title}
                </Link>
              ) : (
                <div className="flex items-center justify-between cursor-pointer py-2 px-4 lg:px-0 lg:py-6">
                  <span className="text-dark dark:text-white/70 group-hover:text-primary">
                    {item.title}
                  </span>
                  {hasSubmenu && (
                    <span className="pl-3">
                      <svg width="25" height="24" viewBox="0 0 25 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              )}
              {hasSubmenu && (
                <div className="absolute left-0 top-full hidden group-hover:block">
                  {renderMenu(item.submenu!, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-8"}`}
              >
                <Image
                  src="/images/logo/logo.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[-8px] -rotate-45" : ""
                    }`}
                  />
                </button>
                {status === 'authenticated' ? (
                  <nav
                  id="navbarCollapse"
                  className={`navbar ${
                    navbarOpen ? "block" : "hidden"
                  } lg:block absolute right-0 z-30 w-[250px] rounded border border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100`}
                >
                  {renderMenu(menuData)}
                </nav>
                ) : (<></>)}
                
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                {status === "loading" ? null : (
                  <>
                    {!session ? (
                      <>
                        <Link
                          href="/sign-in"
                          className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                        >
                          Register
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-red-400 px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                      >
                        Logout
                      </button>
                    )}
                  </>
                )}
                <div>
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
