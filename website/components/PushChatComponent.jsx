import {
	ChatView,
	ChatUIProvider,
	darkChatTheme,
	lightChatTheme,
} from "@pushprotocol/uiweb";

export function PushChatComponent({ chat, signer, account }) {
	console.log("hello1", chat);
	// console.log("hello");
	return (
		<>
			<div style={{ height: "75vh", margin: "20px auto" }}>
				<ChatUIProvider signer={signer}>
					<ChatView
						chatId={chat.chatId}
						// chatId="4ac5ab85c9c3d57adbdf2dba79357e56b2f9ef0256befe750d9f93af78d2ca68"
						limit={10}
						isConnected={true}
						autoConnect={false}
						verificationFailModalPosition="RELATIVE"
					/>
				</ChatUIProvider>
			</div>
		</>
	);
}

// export function PushChatComponent({ chat, signer, account }) {
// 	console.log(chat, "Chat");
// 	return (
// 		<div
// 			style={{
// 				height: "75vh",
// 				margin: "20px auto",
// 				background: "black",
// 				borderRadius: "40px",
// 			}}
// 		>
// 			<ChatUIProvider theme={lightChatTheme} signer={signer}>
// 				<ChatView
// 					chatId="9"
// 					limit={10}
// 					isConnected={true}
// 					verificationFailModalPosition="RELATIVE"
// 				/>
// 			</ChatUIProvider>
// 		</div>
// 	);
// }
