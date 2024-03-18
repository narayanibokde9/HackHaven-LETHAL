"use client"
import { useEffect, useState } from "react";
import { CircularProgress, Backdrop } from "@mui/material";

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			});
	}, [url]);

	return { data, isLoading };
};

export default useFetch;
