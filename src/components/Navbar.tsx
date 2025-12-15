import Link from "next/link";

interface NavbarProps {
    logout: () => void;
    user: {
        email: string,
    }
}

export default function Navbar({ logout, user }: NavbarProps) {

    return (
        <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div className="text-lg font-semibold dark:text-white">
                <Link href="/">MyApp</Link>
            </div>

            <ul className="flex items-center space-x-6 text-gray-700 dark:text-gray-200">

                {user && (
                    <li>
                        <Link
                            href="/dashboard"
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Dashboard
                        </Link>
                    </li>
                )}

                {!user && (
                    <>
                        <li>
                            <Link
                                href="/login"
                                className="hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/register"
                                className="hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Register
                            </Link>
                        </li>
                    </>
                )}

                {user && (
                    <li>
                        <button
                            onClick={logout}
                            className="hover:text-red-600 dark:hover:text-red-400"
                        >
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
