import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== 
    "undefined") {
        //We are in the browse and Metamask is running
        window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
    } else {
        //We are on the server *OR* the user is not running Metamask
        const provider = new Web3.providers.HttpProvider(
            "https://goerli.infura.io/v3/2eca7f0d5c494da1913edc74dffa5105"
          );
          web3 = new Web3(provider);         
    }
 
export default web3;