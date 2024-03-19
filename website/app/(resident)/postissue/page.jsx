"use client";
import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { setUser } from "@/redux/slice/pushSlice";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { initUser } from "@/functions/initUser";

function PostIssue() {
    const [issueTitle, setIssueTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const user = useSelector((state) => state.push.user);
    console.log(user);
    const dispatch = useDispatch();

    const account = useAccount();
    const signer = useEthersSigner({ chainId: account.chainId });

    const createGroup = async (user, groupName, groupDescription) => {
        if (!user || !user.chat) {
            console.error("User or chat object is null or undefined");
            return null; // Handle the error condition appropriately
        }
        const groupImage = "data:image/png;base64,iVBORw0K...";

        const newGroup = await user.chat.group.create(groupName, {
            description: groupDescription,
            image: groupImage,
            members: [],
            admins: [],
            private: false,
            rules: {
                entry: { conditions: [] },
                chat: { conditions: [] },
            },
        });
        console.log(newGroup);
        return newGroup;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Issue Title:", issueTitle);
        console.log("Tags:", tags);
        console.log("Description:", description);
        console.log("Selected File:", selectedFile);
        createGroup(user, issueTitle, description);
    };

    return (
        <div className='flex justify-center items-center'>
            <div className='hero min-h-screen bg-base-200'>
                <div className='hero-content flex-col lg:flex-row-reverse'>
                    <div className='text-center lg:text-left ml-4'>
                        <h1 className='text-5xl font-bold'>
                            Issue a Grievance
                        </h1>
                        <p className='py-6'>
                            Provident cupiditate voluptatem et in. Quaerat
                            fugiat ut assumenda excepturi exercitationem quasi.
                            In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        {useAccount().isConnected && (
                            <>
                                
                                <div className='w-full shadow-2xl bg-base-100'>
                                    <form
                                        className='card-body'
                                        onSubmit={handleSubmit}
                                    >
                                        <div className='flex flex-col gap-4 p-16'>
                                            <label className='input input-bordered flex items-center gap-2'>
                                                Issue Title
                                                <input
                                                    type='text'
                                                    className='grow'
                                                    placeholder='My Grievance'
                                                    value={issueTitle}
                                                    onChange={(e) => {
                                                        setIssueTitle(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </label>
                                            <div>
                                                <TagsInput
                                                    value={tags}
                                                    onChange={setTags}
                                                    name='Tags'
                                                    placeHolder='Enter relevant Tags'
                                                />
                                            </div>
                                            <div className=''>
                                                <textarea
                                                    placeholder='Elaborate'
                                                    className='textarea textarea-bordered textarea-lg w-full'
                                                    value={description}
                                                    onChange={(event) =>
                                                        setDescription(
                                                            event.target.value
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                            <input
                                                type='file'
                                                className='file-input file-input-bordered file-input-info w-full max-w-xs'
                                                onChange={handleFileChange}
                                            />
                                            <div className='form-control mt-6'>
                                                <button
                                                    type='submit'
                                                    className='btn btn-info'
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostIssue;
