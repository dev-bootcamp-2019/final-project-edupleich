import React, { Component } from "react";
import PictureProofContract from "./contracts/PictureProof.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

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

  handleContractRegistry = async () => {
    const { accounts, contract, imagePreviewUrl } = this.state;
    const pictureHash = this.state.web3.utils.keccak256(imagePreviewUrl);
    try {
      const response = await contract.methods.registerHash(pictureHash).send({ from: accounts[0] });
      debugger;
      this.setState({
        isLoading: false,
        storageValue: response
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false
      })
    }
  };

  handlePictureUpload = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      isLoading: true,
    }, this.handleContractRegistry)
  }

  handlePictureChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let url_reader = new FileReader();
    url_reader.readAsDataURL(file);
    url_reader.onloadend = () => this.saveImageUrl(url_reader);
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
        <h1>PictureProof</h1>
        <p>by edupleich</p>
        <h2>Consensys Academy 2018-2019 Final Project</h2>
        <p>
          This dapp is a <strong>Proof-of-Existence</strong> for pictures. Upload an image and it will get registered in the contract.
        </p>
        {
          this.state.isLoading
            ? <div><p>...executing contract...</p></div>
            : <form onSubmit={(e) => this.handleSubmit(e)}>
                <input className="fileInput"
                  type="file"
                  onChange={(e) => this.handlePictureChange(e)} />
                <button className="submitButton"
                  type="submit"
                  onClick={(e) => this.handlePictureUpload(e)}>Upload Image</button>
            </form>
        }
        <div className="imgPreview">
          {$imagePreview}
        </div>

      </div>
    );
  }
}

export default App;
