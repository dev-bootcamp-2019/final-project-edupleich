import React, { Component } from "react";
import PictureProofContract from "./contracts/PictureProof.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    web3: null, accounts: null, contract: null,
    addr2search: null, isLoading: false, success: false,
    showUploadMode: true, error: false, picCount: 0
   };

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

  contractRegister = async () => {
    const { accounts, contract, imagePreviewUrl } = this.state;
    const pictureHash = this.state.web3.utils.keccak256(imagePreviewUrl);
    let success = false;
    let error = true;
    try {
      const response = await contract.methods.registerHash(pictureHash).send({ from: accounts[0] });
      if (response.events['Registration']) {
        success = true;
        error = false;
      }
      this.setState({
        isLoading: false,
        success,
        error
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
        error,
        success
      })
    }
  };

  contractRegistryLookUp = async () => {
    const { accounts, contract } = this.state;
    try {
      const response = await contract.methods.getRegistrationCount(accounts[0]).call();
      this.setState({
        isLoading: false,
        picCount: response,
        success: true,
        error: false
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
        error: true,
        success: false
      })
    }
  };

  handlePictureUpload = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      isLoading: true,
    }, this.contractRegister)
  }

  handlePictureChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let url_reader = new FileReader();
    url_reader.readAsDataURL(file);
    url_reader.onloadend = () => this.saveImageUrl(url_reader);
  }

  handleAddr2Change = e => {
    this.setState({addr2search: e.target.value});
  }

  handleAddr2LookUp = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      isLoading: true,
    }, this.contractRegistryLookUp)
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
    const { imagePreviewUrl, showUploadMode, success, isLoading, addr2search, picCount } = this.state;
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
        { (isLoading || success) ?
          <MsgComponent
            success={success}
            showUploadMode={showUploadMode}
            picCount={picCount}
            addr2search={addr2search}/> :
          <ActionForm
            handleAddr2Change={this.handleAddr2Change}
            handleAddr2LookUp={this.handleAddr2LookUp}
            handlePictureChange={this.handlePictureChange}
            handlePictureUpload={this.handlePictureUpload}
            showUploadMode={showUploadMode}/>
        }
        {showUploadMode && 
          <div className="imgPreview">
            {$imagePreview}
          </div>
        }
        <br />
        <button
          className="leftButton"
          onClick={() => this.setState({showUploadMode: !this.state.showUploadMode, success: false})}>
          {showUploadMode ?'check picture registration': 'upload picture'}
        </button>
        <br />
      </div>
    );
  }
}

export default App;

// static components
const ActionForm =  (props) => {
  if (props.showUploadMode) {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <input className="fileInput"
          type="file"
          onChange={(e) => props.handlePictureChange(e)} />
        <button className="submitButton"
          type="submit"
          onClick={(e) => props.handlePictureUpload(e)}>Upload Image</button>
      </form>
    );  
  } else {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <input className="fileInput"
          type="text"
          onChange={(e) => props.handleAddr2Change(e)} />
        <button className="submitButton"
          type="submit"
          onClick={(e) => props.handleAddr2LookUp(e)}>look up address</button>
      </form>
    );  
  }
};

const MsgComponent = (props) => {
  if (props.showUploadMode) {
    const msg = props.success ?
      'Picture succesfully registered!' :
      '...executing contract...'
    return (
      <div>
        <p>{msg}</p>
        {props.success &&
          <div><button className="submitButton">register another one</button></div>
        }
      </div>
    );
  } else {
    if (props.success) {
      return (
        <div className="imgPreview">
          <p>The address</p>
          <p><strong>{props.addr2search}</strong></p>
          <p> has registered:</p>
          <p>{props.picCount}</p>
          <p>{props.picCount == "1" ? 'picture' : 'pictures'}!</p>
        </div>
      );
    } else {
      return null;
    }
  }

  
}