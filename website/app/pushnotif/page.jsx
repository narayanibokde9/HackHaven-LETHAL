"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const createChannel = async (user) => {
	const response = await user.channel.create({
		name: "Test Channel",
		description: "Test Description",
		icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
		url: "https://push.org",
	});
	return response;
};

function page() {
	const user = useSelector((state) => state.push.user);
	console.log("hello", user);

	return (
		<div>
			<button
				onClick={async () => {
					const res = await createChannel(user);
				}}
			>
				Create Channel
			</button>
		</div>
	);
}

export default page;
