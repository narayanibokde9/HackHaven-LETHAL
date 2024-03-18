import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Navbar from "@/components/Navbar";

import { Providers } from "./providers";
import { PolybaseParent } from "./polybaseprovider";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang='en' data-theme='light'>
            <body className={inter.className}>
                <PolybaseParent>
                    <Providers>
                        <Navbar />
                        {children}
                        <Footer />
                    </Providers>
                </PolybaseParent>
            </body>
        </html>
    );
}
