const serverUrl = "https://xf2slglmhlsr.usemoralis.com:2053/server";
const appId = "BJg5V4IlNGGMSohvAX0Oe0kmWLMfvALWdbNlzZFA";
const _contractAddress="0x8cFc75FeF3194872FaB7364959FC69D207a22aC9";
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
    alert("Hello");
    const Request = Moralis.Object.extend("Request");
    const query = new Moralis.Query(Request);
    query.equalTo("status", "ReadyToLend");
    const results = await query.find();
    console.log(results);
    alert("Successfully retrieved " + results.length);
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
        element.innerHTML +='<div class="col"> <div class="card shadow-sm"> <img width="100%" height="100%" alt="NFT" src="https://gateway.pinata.cloud/ipfs/QmbFyeWzoTkSdXgtQCkxWFLvq6TBRgqNb5cE6aQHV5mWJz?preview=1"/> <div class="card-body"> <p class="card-text">' + discordUser+'</p><p class="card-text">' + "Money Requested: $" + moneyRequested +' USD</p><p class="card-text">' + "NFT Value: $" +nftAmountPerNFT.toFixed(0) +' USD</p><div class="d-flex justify-content-between align-items-center"> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="mint(\'' +  "" + '\',\''+ ""+"\'," + "" +' )">Mint</button> </div></div></div></div>';
      }
    }
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