"use client";

import {
	ArrowLeftStartOnRectangleIcon,
	ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slice/pushSlice";
import { useRouter } from "next/navigation";
import usePush from "@/hooks/usePush";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useConnectorClient } from "wagmi";
import { getWalletClient } from "@wagmi/core";

//config
import { http, createConfig } from "@wagmi/core";
import {
	mainnet,
	sepolia,
	polygon,
	polygonMumbai,
	arbitrum,
	zora,
} from "@wagmi/core/chains";
import useEthersSigner from "@/hooks/useEthersSigner";

// export const config = createConfig({
// 	chains: [sepolia, mainnet],
// 	transports: {
// 		[sepolia.id]: http(alchemyHttpUrl),
// 		[mainnet.id]: http(alchemyHttpUrl),
// 	},
// 	ssr: false,
// 	connectors: [
// 		walletConnect({
// 			projectId,
// 			showQrModal: false,
// 			metadata: metadata,
// 		}),
// 		injected({
// 			shimDisconnect: true,
// 		}),
// 	],
// });

export default function Home() {
	const { isConnected, connector, chainId } = useAccount();
	const { disconnect } = useDisconnect();
	const account = useAccount();
	// const [signer, setSigner] = useState();

	// const client = getWalletClient(config, { chainId });
	const signer = useEthersSigner({ chainId: account.chainId });
	console.log(signer);

	const dispatch = useDispatch();
	const router = useRouter();
	const { streamChat } = usePush();
	const stream = useSelector((state) => state.push.stream);

	useEffect(() => {
		const template = async () => {
			try {
				if (window.ethereum) {
					const { ethereum } = window;
					// const account = await ethereum.request({
					// 	method: "eth_requestAccounts",
					// });

					const provider = new ethers.BrowserProvider(ethereum);
					const signer = await provider.getSigner();
					setSigner(signer);
				} else {
					console.error("Please install MetaMask.");
				}
			} catch (error) {
				console.error("Error connecting to MetaMask:", error);
			}
		};
		template();
	}, []);

	return (
		<div className="h-screen w-screen flex items-center justify-center bg-black">
			<div className="w-[400px] border-[1px] border-white/30 rounded-3xl flex flex-col items-center p-5 pb-7">
				<ChatBubbleBottomCenterTextIcon className="h-20 w-20 text-white mb-2" />
				<h1 className="font-bold text-5xl">Quick3</h1>
				<h3>Messenger</h3>

				{useAccount().isConnected && (
					<>
						<Button
							className="w-full mt-10 rounded-2xl flex items-center justify-center"
							size="lg"
							onClick={async () => {
								const user = await PushAPI.initialize(signer, {
									env: CONSTANTS.ENV.STAGING,
								});
								if (user) {
									if (!user.readMode) {
										dispatch(setUser(user));
										streamChat(user);
										router.push("/dashboard");
									}
								}
							}}
						>
							Initiate Push{" "}
							<ChatBubbleBottomCenterTextIcon className="h-5 w-5 ml-1" />
						</Button>
						<Button
							className="w-full mt-5 rounded-2xl flex items-center justify-center"
							size="lg"
							onClick={() => {
								if (stream) stream.disconnect();
								disconnect();
							}}
						>
							Disconnect{" "}
							<ArrowLeftStartOnRectangleIcon className="h-5 w-5 ml-1 -mt-0.5" />
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
