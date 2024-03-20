"use client";
import Image from "next/image";
import "./styles.css";
// import bgCard from "public/bg-pattern-card.svg";
// // import profilePic from "public/image-victor.jpg";
// import bgTop from "public/bg-pattern-top.svg";
// import bgBottom from "public/bg-pattern-bottom.svg";
/* Resident collection
.where("id","==",`${id}).get() */

import { Polybase } from "@polybase/client";
import { polybase } from "@/data/polybase/polybase";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function Home({ params }) {
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState();
	const id = params.id;
	const account = useAccount();
	async function fetchData() {
		if (account.connector) {
			usePolybaseSigner(account);
		}
		const profileReference = polybase.collection("Resident");
		try {
			const records = await profileReference.where("id", "==", `${id}`).get();
			// Array of records is available under the data property
			const { data } = records;
			setProfile(data[0].data);
			setLoading(false); // Once data is fetched, set loading to false
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false); // Set loading to false in case of error
		}
	}
	fetchData();
	console.log(profile);

	if (loading) {
		return (
			<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-200 bg-opacity-25 z-50">
				<span className="loading loading-dots loading-lg text-info"></span>
			</div>
		);
	}
	return (
		<div className="flex justify-center items-center bg-darkCyan min-h-screen">
			<div
				class="card bg-white w-96 overflow-hidden -mt-32
				rounded-lg shadow-lg flex flex-col"
			>
				<div class="card-image">
					<img
						src="https://images.pexels.com/photos/259915/pexels-photo-259915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
						alt="Image"
						class="w-full h-48 object-cover rounded-t-lg"
					/>
				</div>
				<div class="profile-image">
					<img
						src="https://media.geeksforgeeks.org/wp-content/uploads/20240226132217/w2.png"
						alt=""
						class="z-10 w-24 h-24 relative mx-auto -mt-16 
						block rounded-full border-4 border-white 
						transition-transform duration-400 
						transform hover:scale-110"
					/>
				</div>
				<div class="card-content text-center py-4">
					{profile && (
						<>
							<h3 class="text-xl font-semibold">{profile.name}</h3>
							<p class="text-sm text-justify px-4">
								{profile.age}
								{", "}
								{profile.location}
							</p>
							<p class="text-sm text-justify px-4">{profile.email}</p>
							<p class="text-sm text-justify px-4">Resident</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
