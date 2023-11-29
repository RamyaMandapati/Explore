import axios from "axios";
export const uploadImages = async (selectedFiles) => {
  const urls = [];
  for (let i = 0; i < selectedFiles.length; i++) {
    const formData = new FormData();
    formData.append("file", selectedFiles[i]);
    formData.append("upload_preset", "thrryyss");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dylqg3itm/image/upload",
      formData
    );
    urls.push(response.data.secure_url);
  }
  return urls;
};
