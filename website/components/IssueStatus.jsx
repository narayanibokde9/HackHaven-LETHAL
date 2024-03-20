"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BiUpvote } from "react-icons/bi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import Image from "next/image";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";
import { useAccount } from "wagmi";
import { polybase } from "@/data/polybase/polybase";
import { TimelineItemComponent } from "./TimelineItemComponent";

const IssueStatus = ({ title, message, images, upvotes, id, tags }) => {
    const [voters, setVoters] = useState();
    const [fetchedVoters, setStatus] = useState(false);
    const [updates, setUpdates] = useState(false);

    const account = useAccount();
    if (account.connector) usePolybaseSigner(account);
    const issueReference = polybase.collection("Issue");
    const updateReference = polybase.collection("Update");

    const findVoters = async () => {
        const { data } = await issueReference.where("id", "==", `${id}`).get();
        setVoters(data[0].data.upvoters);
        setStatus(true);
    };
    findVoters();

    const increaseVote = async () => {
        try {
            if (fetchedVoters && !voters.includes(account.address)) {
                const record = await issueReference
                    .record(id)
                    .call("increaseVote", [account.address]);
                upvotes++;
            } else throw new Error("Already voted!");
        } catch (e) {
            console.log("Error upvoting", e);
        }
    };

    const findUpdates = async () => {
        const { data } = await updateReference
            .where("issueId", "==", `${id}`)
            .get();
        setUpdates(data);
        // console.log(data);
    };
    findUpdates();
    return (
        <div className='grid items-stretch grid-cols-2 gap-4 place-content-evenly'>
            <div className='col-span-2 self-stretch md:col-span-1 border'>
                <div className=' self-center max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
                    <div className='p-8 bg-white self-stretch'>
                        <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>
                            Grievance
                        </div>
                        <h2 className='mt-2 text-xl font-semibold text-gray-800'>
                            {title}
                        </h2>
                        <p className='mt-2 text-gray-600'>{message}</p>
                        {tags && (
                            <div className='mt-4 flex flex-wrap'>
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className='bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2'
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='mt-4 flex justify-between'>
                            <button
                                className='btn flex items-center'
                                onClick={increaseVote}
                            >
                                <BiUpvote className='h-6 w-6' />
                                <span>{upvotes}</span>
                                <span className='text-gray-600 pl-2 hidden sm:block'>
                                    Upvotes
                                </span>
                            </button>

                            <Link
                                href={`/chat/openchat/${id}`}
                                className='btn flex items-center'
                            >
                                <IoChatboxEllipsesOutline className='h-6 w-6' />
                                <div className='text-gray-600 pl-2 hidden sm:block'>
                                    Discuss here
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-2 md:col-span-1 border'>
                <div className='carousel w-full'>
                    {images &&
                        images.map((image, index) => (
                            <div key={index} className='carousel-item w-full'>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${image}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`}
                                    width={600}
                                    height={600}
                                    alt={title}
                                    priority
                                />
                            </div>
                        ))}
                </div>
            </div>
            {updates && (
                <div className='col-span-2 md:col-span-1 border p-8 bg-white shadow-xl'>
                    <h1 className='text-xl font-semibold text-gray-800'>
                        Current Status
                    </h1>
                    <ul className='timeline timeline-vertical lg:timeline-horizontal'>
                        {/* {console.log(updates[0])} */}
                        {updates.map((update) => {
                            console.log(update);
                            // <li>
                            //     <div className='timeline-start'>
                            //         {update.data.id}
                            //     </div>
                            //     {/* {console.log(update.data.id)} */}
                            //     <div className='timeline-middle'>
                            //         <svg
                            //             xmlns='http://www.w3.org/2000/svg'
                            //             viewBox='0 0 20 20'
                            //             fill='currentColor'
                            //             className='w-5 h-5'
                            //         >
                            //             <path
                            //                 fillRule='evenodd'
                            //                 d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
                            //                 clipRule='evenodd'
                            //             />
                            //         </svg>
                            //     </div>
                            //     <div className='timeline-end timeline-box'>
                            //         {update.data.message}
                            //     </div>
                            //     {/* {console.log(update.data.message)} */}
                            // </li>;
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default IssueStatus;
