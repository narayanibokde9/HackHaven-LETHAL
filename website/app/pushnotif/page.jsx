"use client";
import useEthersSigner from "@/hooks/useEthersSigner";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useAccount } from "wagmi";

const createChannel = async (user) => {
	const response = await user.channel.create({
		name: "Test Channel",
		description: "Test Description",
		icon: "data:image/png;base64,iVBOR...",
		url: "https://staging.push.org",
	});
	console.log("created", response);
	return response;
};

const profileInfo = async (user) => {
	const response = await user.profile.info();
	console.log("profile", response);
	return response;
};

const channelInfo = async (user) => {
	const res = await user.channel.info();
	console.log("channel info", res);
	return res;
};

const subscribeChannel = async (user, channelAddress) => {
	const response = await user.notification.subscribe(
		`eip155:11155111:${channelAddress}`
	);
	console.log("subsribed", response);
	return response;
};

const unSubscribeChannel = async (user, channelAddress) => {
	const unsubscribeResponse = await user.notification.unsubscribe(
		`eip155:11155111:${channelAddress}`
	);
	console.log("unsub", unsubscribeResponse);
	return unsubscribeResponse;
};

const fetchNotifications = async (user) => {
	// userAlice.notification.list(type, {options?})
	const inboxNotifications = await user.notification.list("INBOX");
	console.log("fetch notifs", inboxNotifications);
	return inboxNotifications;
};

const sendNotification = async (user) => {
	const sendNotifRes = await user.channel.send(["*"], {
		notification: { title: "test", body: "test" },
	});
	console.log("sent", sendNotifRes)
	return sendNotifRes;
};

function page() {
	const account = useAccount();
	const signer = useEthersSigner({ chainId: account.chainId });
	// const user = useSelector((state) => state.push.user);
	const [user, setUser] = useState(null);
	console.log("user", user);
	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				if (!signer || !account) return;

				if (!user) {
					const newUser = await PushAPI.initialize(signer, {
						env: CONSTANTS.ENV.STAGING,
					});
					setUser(newUser);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, [account, signer, user]);

	return (
		<div>
			<button
				onClick={async () => {
					const res = await createChannel(user);
				}}
			>
				Create Channel
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await profileInfo(user);
				}}
			>
				Get profile info
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await channelInfo(user);
				}}
			>
				Get channel info
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await subscribeChannel(
						user,
						"0xe53aa078E1af37E9c9f3AeFDC652bBDd98c8e51D"
					);
				}}
			>
				Subscribe channel
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await unSubscribeChannel(
						user,
						"0xe53aa078E1af37E9c9f3AeFDC652bBDd98c8e51D"
					);
				}}
			>
				Unsubscribe channel
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await fetchNotifications(
						user,
						"0xe53aa078E1af37E9c9f3AeFDC652bBDd98c8e51D"
					);
				}}
			>
				Fetch Notifs
			</button>
			<br />
			<button
				onClick={async () => {
					const res = await sendNotification(
						user
					);
				}}
			>
				Send Notifs
			</button>
		</div>
	);
}

export default page;
