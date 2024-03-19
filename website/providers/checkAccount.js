"use client";

import { clearUser } from "@/redux/slice/pushSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

export const CheckAccount = ({ children }) => {
    const account = useAccount();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.push.user);
    if (account.address && user && user.account !== account.address) {
        dispatch(clearUser());
    }
    return <>{children}</>;
};
