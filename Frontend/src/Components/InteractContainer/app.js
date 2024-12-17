import { Component } from "react";

import "./app.css";

class InteractContainer extends Component {
  state = { imageSelected: "", imageAdded: false };

  onSelectFile = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      console.log(reader);
      reader.onloadend = () => {
        this.setState({ imageSelected: reader.result, imageAdded: true });
      };

      reader.readAsDataURL(file);
    }
  };

  render() {
    const { imageAdded, imageSelected } = this.state;
    //    console.log(imageSelected)
    //   const url="http://localhost:3000/Screenshot (11).png"
    return (
      <div className="interact-container">
        <ul className="interact-ul-container">
          <div>
            <li className="interact-li">
              <input
                className="add-image-buttons"
                width={100}
                height={200}
                onChange={this.onSelectFile}
                type="file"
                id="image-add"
                name="file"
              />
            </li>
            {/* <div class="custom-file-upload">
                            <label for="file-input">Add image</label>
                            <input type="file" id="file-input" name="file"  onChange={this.onSelectFile}  />
                        </div> */}
          </div>
        </ul>

        {
          <div>
            {imageAdded && (
              <img src={imageSelected} alt="photo_from_user" width={100} />
            )}
          </div>
        }
      </div>
    );
  }
}

export default InteractContainer;
