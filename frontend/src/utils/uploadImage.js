import { toast } from "react-toastify";
import summaryApi from ".";

const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mern_products");
    console.log("Clodinary api:", summaryApi.uploadImage.url);
    try {
        const response = await fetch(summaryApi.uploadImage.url, {
            method: summaryApi.uploadImage.method,
            body: formData
        })

        if (!response.ok) toast.error("request doesn't complete while uploading the image")

        const data = await response.json();
        if(data?.asset_id) toast.success("Image uploaded Successfully")
        return data;
    } catch (error) {
        toast.error("An error occurred while uploading the image");
        console.error("Error uploading image:", error);
    }
}

export default uploadImage