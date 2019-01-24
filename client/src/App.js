import React, { Component } from "react";
import PictureProofContract from "./contracts/PictureProof.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PictureProofContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PictureProofContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: instance,
        buffer: '',
        file: '',
        imagePreviewUrl: ''
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

  handlePictureUpload = (e) => {
    console.log('gulp');
  };

  // handlePictureChange = (e) => {
  //   e.preventDefault();
  //   let reader = new FileReader();
  //   let file = e.target.files[0];
  //   reader.onloadend = () => {
  //     this.setState({
  //       file: file,
        
  //       imagePreviewUrl: reader.result
  //     });
  //   }
  //   reader.readAsDataURL(file)
  // }

  handlePictureChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    debugger;
    let buffer_reader = new FileReader();
    let url_reader = new FileReader();
    buffer_reader.readAsArrayBuffer(file);
    url_reader.readAsDataURL(file);
    buffer_reader.onloadend = () => this.convertToBuffer(buffer_reader);
    url_reader.onloadend = () => this.saveImageUrl(url_reader);
  }

  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    this.setState({buffer})
  }

  saveImageUrl = reader => {
    this.setState({
      imagePreviewUrl: reader.result
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input className="fileInput"
            type="file"
            onChange={(e) => this.handlePictureChange(e)} />
          <button className="submitButton"
            type="submit"
            onClick={(e) => this.handlePictureUpload(e)}>Upload Image</button>
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>

      </div>
    );
  }
}

export default App;
