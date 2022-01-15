const serverUrl = "https://xf2slglmhlsr.usemoralis.com:2053/server";
const appId = "BJg5V4IlNGGMSohvAX0Oe0kmWLMfvALWdbNlzZFA";

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
      alert('New request created [ID]: ' + request.id);
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
  async function onlyNumberKey(evt) {        
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
    {
        return false;
    }
  }
  
  document.getElementById("btnLogin").onclick = login;
  document.getElementById("btnLogout").onclick = logOut;
  document.getElementById("btnRequest").onclick = request;