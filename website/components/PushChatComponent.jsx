// import {
// 	ChatView,
// 	ChatUIProvider,
// 	darkChatTheme,
// 	lightChatTheme,
// } from "@pushprotocol/uiweb";

export function PushChatComponent({ chat, signer, account }) {
	console.log(chat);
	console.log("hello");
	return (
		<>
			<div style={{ height: "75vh", margin: "20px auto" }}>
				{/* <ChatUIProvider signer={signer}>
					<ChatView
						chatId={chat.chatId}
						limit={10}
						isConnected={true}
						autoConnect={false}
						verificationFailModalPosition="RELATIVE"
					/>
				</ChatUIProvider> */}
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
