const serverUrl = "https://xf2slglmhlsr.usemoralis.com:2053/server";
const appId = "BJg5V4IlNGGMSohvAX0Oe0kmWLMfvALWdbNlzZFA";
const pinataImage="https://gateway.pinata.cloud/ipfs/QmbFyeWzoTkSdXgtQCkxWFLvq6TBRgqNb5cE6aQHV5mWJz?preview=1";
const dfhAddress="0x29a1093636a87810DF3Cb79FCB8C76cC4d80e00c";
const nftPortKey="9a4f05ce-7b62-41b4-b85d-ece09114bb17";
Moralis.start({ serverUrl, appId });

async function login() {
    let user = Moralis.User.current();
  
    if (!user) {
      user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          localStorage.setItem("moralisUser", user.get("username"));
          localStorage.setItem("moralisAddress", user.get("ethAddress"));
          console.log(":)");

        })
        .catch(function (error) {
          console(error);
        });
    }
  }
async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
  }

  async function request() {
    let txtFullName=document.getElementById('txtFullName').value;
    let txtReasons=document.getElementById('txtReasons').value;
    let txtDiscordUser=document.getElementById('txtDiscordUser').value;
    let txtAmountUSD=document.getElementById('txtAmountUSD').value;

    let moralisUser = localStorage.getItem("moralisUser");
    let moralisAddress = localStorage.getItem("moralisAddress");
    const Request = Moralis.Object.extend("Request");
    const request = new Request();
    request.set("username", moralisUser);
    request.set("address", moralisAddress);
    request.set("fullName", txtFullName);
    request.set("reason",txtReasons);
    request.set("discordUser", txtDiscordUser);
    request.set("moneyRequested", txtAmountUSD);
    request.set("status", "Reviewing");
    request.set("debtTerm", 360);
    request.save()
    .then((request) => {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + request.id);
      document.getElementById('txtFullName').value="";
      document.getElementById('txtReasons').value="";
      document.getElementById('txtAmountUSD').value=0;
      document.getElementById('txtDiscordUser').value="";
    }, (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Moralis.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    });

  }

  async function readData()
  {
    const Request = Moralis.Object.extend("Request");
    const query = new Moralis.Query(Request);
    query.equalTo("status", "ReadyToLend");
    const results = await query.find();
    console.log(results);
    // Do something with the returned Moralis.Object values
    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      let id= object.id ;
      let fullName= object.get('fullName');
      console.log(fullName);
      let reason= object.get('reason');
      let discordUser= object.get('discordUser');
      let moneyRequested= object.get('moneyRequested');
      let debtTerm= object.get('debtTerm');
      let nftAmountPerNFT = moneyRequested /12;
      for ( let nftCounter=0; nftCounter<12; nftCounter++)
      {
        let element = document.getElementById('iterative');
        element.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src="https://gateway.pinata.cloud/ipfs/QmbFyeWzoTkSdXgtQCkxWFLvq6TBRgqNb5cE6aQHV5mWJz?preview=1"/> <div class="card-body"> <p class="card-text">' + discordUser+'</p><p class="card-text">' + "Money Requested: $" + moneyRequested +' USD</p><p class="card-text">' + "NFT Value: $" +nftAmountPerNFT.toFixed(0) +' USD</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="mint(\'' +  discordUser + '\',\''+ nftAmountPerNFT.toFixed(0) + '\',\''+ fullName+"\'," + debtTerm +')">Mint</button> </div></div></div></div>';
      }
    }
  }

  async function mint(discordUser,nftAmountPerNFT ,fullName,debtTerm){
    //const metadata =await uploadMetadataToIPFS(discordUser,nftAmountPerNFT ,fullName,debtTerm);
    //console.log(metadata);
    const metadata=await uploadMetadataToIPFS(discordUser,nftAmountPerNFT ,fullName,debtTerm);
    console.log(metadata);
    const data= await mintNFT(metadata,"0x29a1093636a87810DF3Cb79FCB8C76cC4d80e00c","0x8B4A8EEC90198d44709599Ded620236885e5059B");
    console.log(data);
    alert("Please go to open sea to sell the NFT")
  }

  async function createContract(){
    alert("Contract creation");
    const response = await fetch("https://api.nftport.xyz/v0/contracts", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": nftPortKey
      },
      "body": "{\"chain\":\"polygon\",\"name\":\"Web3Stars\",\"metadata_updatable\":true,\"symbol\":\"DFH\",\"owner_address\":\"0x29a1093636a87810DF3Cb79FCB8C76cC4d80e00c\"}"
    });
    const data = await response.json();
    
    console.log(data);
    contractTable(data.name,data.symbol,data.owner_adress,data.transaction_hash,data.transaction_external_url);
    alert("Contract created");
  }
  async function uploadMetadataToIPFS(discordUser,nftAmountPerNFT ,fullName,debtTerm)
  {
    alert("Uploading metadata to IPFS...");
    const response =await fetch("https://api.nftport.xyz/v0/metadata", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": nftPortKey
      },
      "body": "{\"name\":\"DFH\",\"description\":\"Financing people's education is how societies improves.\",\"file_url\":\"https://gateway.pinata.cloud/ipfs/QmbFyeWzoTkSdXgtQCkxWFLvq6TBRgqNb5cE6aQHV5mWJz?preview=1\",\"attributes\":[{\"trait_type\":\"userDiscord\",\"value\":\""+ discordUser+"\"},{\"trait_type\":\"suggestedPrice\",\"value\":"+ nftAmountPerNFT+"},{\"trait_type\":\"fullName\",\"value\":\""+fullName+"\"},{\"trait_type\":\"debtTermDays\",\"value\":"+ debtTerm+"}]}"
    })
    const data = await response.json();
    alert("Uploading Ended");
    return data.metadata_uri;

  }

  async function mintNFT(metadataUri,minToThisAddress,contract_address){
    alert("Minting NFT...");
    console.log(metadataUri);
    let body =  "{\"chain\":\"polygon\",\"contract_address\":\""+contract_address +"\",\"metadata_uri\":\""+ metadataUri+"\",\"mint_to_address\":\""+minToThisAddress+"\"}";
    console.log(body);
    const response = await fetch("https://api.nftport.xyz/v0/mints/customizable", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "0a108b59-a733-49ff-bc04-6381a941af88"
      },
      "body":body
    })
    const data = await response.json();
    alert("Minting Ended...");
    return data;
   
  }

  async function contractTable(nftName,nftSymbol,owner_adress,transaction_hash,transaction_external_url) {

    let moralisUser = localStorage.getItem("moralisUser");
    let moralisAddress = localStorage.getItem("moralisAddress");
    const Contract= Moralis.Object.extend("Contract");
    const contract= new Contract();
    contract.set("username", moralisUser);
    contract.set("address", moralisAddress);
    contract.set("owner_address", owner_adress);
    contract.set("transaction_hash",transaction_hash);
    contract.set("transaction_external_url",transaction_external_url);
    contract.set("nftName", nftName);
    contract.set("nftSymbol", nftSymbol);

    contract.save()
    .then((request) => {
      // Execute any logic that should take place after the object is saved.
      console.log("Contract OK");
    }, (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Moralis.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    });

  }


  async function onlyNumberKey(evt) {        
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
    {
        return false;
    }
  }

  window.onload = function() {
    readData();
  };
  
  document.getElementById("btnLogin").onclick = login;
  document.getElementById("btnLogout").onclick = logOut;
  document.getElementById("btnCreateContract").onclick = createContract;