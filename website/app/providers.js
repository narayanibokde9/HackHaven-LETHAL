"use client";

import * as React from "react";
import {
	RainbowKitProvider,
	getDefaultWallets,
	getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import {
	argentWallet,
	trustWallet,
	ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
	arbitrum,
	base,
	mainnet,
	optimism,
	polygon,
	polygonMumbai,
	sepolia,
	zora,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

import { store } from "@/redux/store";
import { Provider } from "react-redux";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
	appName: "RainbowKit demo",
	projectId: "YOUR_PROJECT_ID",
	wallets: [
		...wallets,
		{
			groupName: "Other",
			wallets: [argentWallet, trustWallet, ledgerWallet],
		},
	],
	chains: [
		mainnet,
		polygon,
		optimism,
		arbitrum,
		base,
		zora,
		...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
			? [sepolia, polygonMumbai]
			: []),
	],
	ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }) {
	return (
		<Provider store={store}>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitProvider>{children}</RainbowKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</Provider>
	);
}
