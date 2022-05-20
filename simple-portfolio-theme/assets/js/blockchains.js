
fetch('./assets/mocks/blockchains.json')
  .then(response => response.json())
  .then(data => {
    const listRef = document.querySelector('#blockchains-list');


    listRef.addEventListener('change', (e) => {
      console.log(e.target.value)

      const wallet = document.querySelector('input').value;
      const chain = e.target.value;
      const url = `https://deep-index.moralis.io/api/v2/${wallet}/nft?chain=${e.target.value}&format=decimal`;

      const API_KEY = 'XUnDBl1fLvCROuwpgxpB645C1VrrjGGwfUDz6NmdJNo97qUCftf3a8TU0DGIu6Yo';
      const options = {
        method: 'GET',
        headers: new Headers({ 'X-API-Key': API_KEY }),
    };
    
      fetch(url, options).then(response => response.json())
        .then(data => {
          const ulRef = document.querySelector('#nfts-list');

          const nfts = data.result;
      
          let listElements = '';
          let subListElements='';
          nfts.forEach((nft) => {
            const metadata = JSON.parse(nft.metadata);
            if (!metadata) return;

            Object.keys(metadata).map(key => {
              metadata[key]==null?"":

              subListElements+=`
                <div class="container">
                <h1>${nft.token_id}</h1>
                <div class="row">
                  <div class="col-sm">
                  ${metadata[key]==null?"":key}
                  </div>
                  <div class="col-sm">
                  ${
                    metadata[key]==null?"":
                             key.includes("image")?`<img width="50%" src="${metadata[key]}" />`:metadata[key]
                  }
                  </div>
                </div>
              </div>
              `;
              ;

             });


          });

          ulRef.innerHTML = subListElements
        })
    });

    const blockchains = data;
    
    let listElements = '';

    blockchains.forEach(b => {
        listElements += `<option value="${b.currentSymbol}">${b.currentSymbol}</option>`;
    });

    listRef.innerHTML = listElements;

    console.log(data)
  });