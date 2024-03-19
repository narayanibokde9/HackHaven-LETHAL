export const uploadFile = async (fileToUpload) => {
    try {
        const data = new FormData();
        data.append("file", fileToUpload);
        const pinataMetadata = JSON.stringify({ name: fileToUpload.name });
        data.append("pinataMetadata", pinataMetadata);
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });
        data.append("pinataOptions", pinataOptions);
        const res = await fetch("/api/files", {
            method: "POST",
            body: data,
        });
        const resData = await res.json();
        return resData.IpfsHash;
    } catch (e) {
        console.log(e);
        alert("Trouble uploading file");
    }
};