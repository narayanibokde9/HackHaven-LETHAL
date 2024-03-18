"use client"
import { PolybaseProvider } from "@polybase/react";
import { polybase } from "@/data/polybase/polybase";

export function PolybaseParent({ children }) {
    return <PolybaseProvider polybase={polybase}>{children}</PolybaseProvider>;
}
