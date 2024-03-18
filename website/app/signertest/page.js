"use client";

import React, { useState, useEffect } from "react";
import useEthersSigner from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";

function Page() {
    const account = useAccount();
    const result = useEthersSigner({ chainId: account.chainId });
    const handleClick = () => {
        console.log(result);
    };
    return (
        <>
            <div>TEST PAGE 2</div>
            <br />
            <button onClick={handleClick}>Click Me</button>
        </>
    );
}

export default Page;
