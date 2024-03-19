import { polybase } from "@/data/polybase/polybase";
import usePolybaseSigner from "@/hooks/usePolybaseSigner";

export default async function(account,data){
    console.log(account);
    console.log(process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE);
    // assign public key to polybase
    usePolybaseSigner(account);
    const residentReference = polybase.collection("Resident");
    const recordData = await residentReference.create(data);
    console.log(recordData);
    return recordData;
}