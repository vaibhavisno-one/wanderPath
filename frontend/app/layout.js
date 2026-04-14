import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "WanderPath",
  description: "WanderPath frontend"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/places">Places</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
