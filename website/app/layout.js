import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Navbar from "@/components/Navbar";

import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { PolybaseParent } from "./polybaseprovider";
import Footer from "@/components/Footer";
import { CheckAccount } from "@/providers/checkAccount";

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang='en' data-theme='light'>
            <body className={inter.className}>
                <PolybaseParent>
                    <Providers>
                        <CheckAccount>
                            <Navbar />
                            {children}
                            <Footer />
                        </CheckAccount>
                    </Providers>
                </PolybaseParent>
            </body>
        </html>
    );
}
