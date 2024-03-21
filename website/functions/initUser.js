import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";

export const initUser = async (signer) => {
	const user = await PushAPI.initialize(signer, {
		env: CONSTANTS.ENV.STAGING,
	});
	const response = await user.info();
	console.log("initUser() ", response);
	return user;
};