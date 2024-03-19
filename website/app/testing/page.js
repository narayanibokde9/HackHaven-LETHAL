"use client";

import { uploadFile } from "@/functions/uploadFile";
import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {
    const [files, setFiles] = useState([]);
    const [cids, setCids] = useState([]);
    const [uploading, setUploading] = useState(false);
    console.log(cids);

    const inputFile = useRef(null);
    const handleChange = async (e) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);
        for (let i = 0; i < selectedFiles.length; i++) {
            setUploading(true);
            const newCid = await uploadFile(selectedFiles[i]);
            setCids((prev) => [...prev, newCid]);
            setUploading(false);
        }
    };

    return (
        <main className='w-full min-h-screen m-auto flex flex-col justify-center items-center'>
            <input
                type='file'
                id='file'
                ref={inputFile}
                onChange={handleChange}
                accept='image/*' // Restricts selection to only image files
                multiple // Allows multiple files to be selected
            />
            <button
                disabled={uploading}
                onClick={() => inputFile.current.click()}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {cids.map(
                (cid, index) => (
                    console.log(
                        `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`
                    ),
                    (
                        <Image
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`}
                            onLoad={() => console.log("Image loaded")}
                            width={500}
                            height={500}
                            alt={`Image from IPFS`}
                            priority
                        />
                    )
                )
            )}
        </main>
    );
}
