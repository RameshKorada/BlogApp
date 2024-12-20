import React, { useState } from "react";
import "./app.css";

const InteractContainer = () => {
  const [imageSelected, setImageSelected] = useState("");
  const [imageAdded, setImageAdded] = useState(false);

  const onSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageSelected(reader.result);
        setImageAdded(true);
      };

      reader.onerror = () => {
        console.error("Error reading file");
      };

      reader.readAsDataURL(file);
    } else {
      setImageSelected("");
      setImageAdded(false);
    }
  };

  return (
    <div className="interact-container">
      <ul className="interact-ul-container">
        <li className="interact-li">
          <label htmlFor="image-add" className="custom-file-label">
            Add Image
          </label>
          <input
            className="add-image-input"
            type="file"
            id="image-add"
            name="file"
            onChange={onSelectFile}
          />
        </li>
      </ul>

      {imageAdded && (
        <div className="image-preview-container">
          <img
            src={imageSelected}
            alt="Uploaded preview"
            className="image-preview"
            width={100}
          />
        </div>
      )}
    </div>
  );
};

export default InteractContainer;
