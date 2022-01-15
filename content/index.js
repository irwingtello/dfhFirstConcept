const serverUrl = "https://xf2slglmhlsr.usemoralis.com:2053/server";
const appId = "BJg5V4IlNGGMSohvAX0Oe0kmWLMfvALWdbNlzZFA";
const _contractAddress="0x8cFc75FeF3194872FaB7364959FC69D207a22aC9";
Moralis.start({ serverUrl, appId });

async function login() {
    let user = Moralis.User.current();
    
    if (!user) {
      user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
          console.log(user.get("username"));
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

  document.getElementById("btnLogin").onclick = login;
  document.getElementById("btnLogout").onclick = logOut;