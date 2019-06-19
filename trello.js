const token = "8f2518cb8058983b911e8e72fe08412c1a6849f7ebace798e23e59a2ee6eb8ae";
const key = "6668897ab81223587d6c1a4e78ae38d0";
const linkOfApi = `https://api.trello.com/1/lists/5cf8b1506ed12e0a7718bde6/cards?key=${key}&token=${token}`;

const getCardId = link => {
  return fetch(link)
    .then(response => response.json())
    .then(jsonOutput =>
      jsonOutput.map(item => {
        // console.log(item.name);
        return item.id;
      })
    );
};

// console.log(getCardId(linkOfApi));

const getCheckListId = link => {
  return getCardId(link).then(out =>
    out.map(item => {
      return fetch(
        `https://api.trello.com/1/cards/${item}/checklists?key=${key}&token=${token}`
      )
        .then(response => response.json())
        .then(out => {
        //   console.log(out);
          return out.map(item => item.id);
        });
    })
  );
};


const getCheckListItemId = link => {
    return getCheckListId(link)
        .then((out)=>  out.map((promiseItem)=>promiseItem.then((id)=>
            fetch(`https://api.trello.com/1/checklists/${id}/checkItems?fields=idchecklist,id,name,state&key=${key}&token=${token}`)
            .then((response)=>response.json())
            .then((output)=>output.map((item)=>console.log(item.name)))
                )))
}
getCheckListItemId(linkOfApi);
