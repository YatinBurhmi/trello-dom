const token =
  "8f2518cb8058983b911e8e72fe08412c1a6849f7ebace798e23e59a2ee6eb8ae";
const key = "6668897ab81223587d6c1a4e78ae38d0";
const linkOfApi = `https://api.trello.com/1/lists/5cf8b1506ed12e0a7718bde6/cards?key=${key}&token=${token}`;

const getCardId = async link => {
  const data = await fetch(link);
  const response = await data.json();
  let cardIdArr = response.map(item => item.id);
  return cardIdArr;
};

const getCheckListItems = async link => {
  const cardIdArr = await getCardId(link);
  const dataOfCheckItems = cardIdArr.map(async item => {
    const checkListData = await fetch(
      `https://api.trello.com/1/cards/${item}/checklists?checkItems=all&checkItem_fields=name%2Cstate&filter=all&fields=idCard%2C&key=${key}&token=${token}`,
      { method: "GET" }
    );
    const response = await checkListData.json();
    return response;
    // console.log(response)
    // display(response[0]);
  });
  return Promise.all(dataOfCheckItems);
};

async function display(link) {
  let objArr = await getCheckListItems(link)
  // console.log(objArr);
  objArr.map((obj)=>{
    // console.log(obj[0])
    let cardId = obj[0].idCard;
    obj[0].checkItems.forEach(element => {
      let liHtml = `<li>
                  <input type="checkbox" id ="checkbox-id"card-id = ${cardId} item-id=${
        element.id
      } ${element.state === "complete" ? "checked" : null}>
                  <span class=${element.state} id="checkItemSpanId">${
        element.name
      }</span>
                  <button id= "delete" card-id = ${cardId} item-id=${
        element.id
      }>X</button></li>`;
      $("#checkItems").append(liHtml);
    });
  })
}
// display(linkOfApi)

async function deleteItems() {
  let cardId = $(this).attr("card-id");
  let itemId = $(this).attr("item-id");
  console.log(itemId);
  let response = await fetch(
    `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?key=${key}&token=${token}`,
    { method: "DELETE" }
  );
  // response = await response.json();
  if (response.status === 200) {
    $(this)
      .parent()
      .remove();
  }
}

async function updateItems() {
  let cardId = $(this).attr("card-id");
  let itemId = $(this).attr("item-id");
  let state = this.checked ? "complete" : "incomplete";

  let response = await fetch(
    `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${state}&key=${key}&token=${token}`,
    { method: "PUT" }
  );
  if (response.status === 200) {
      $(this).next().toggleClass("complete")
  }
}

async function addItems(){
  let inputVal = $('#input-text').val();
  $('#input-text').val('')   
  let cardId = "5d0dc61a3c90de474567b4ab";
  let response = await fetch(`https://api.trello.com/1/checklists/5d0dc620cbf6162feaa636a6/checkItems?name=${inputVal}&key=${key}&token=${token}`,{method:"POST"});
  let element = await response.json(); 
  if(response.status === 200){
   let liHtml = `<li>
                <input type="checkbox" id ="checkbox-id"card-id = ${cardId} item-id=${
      element.id
    } ${element.state === "complete" ? "checked" : null}>
                <span class=${element.state} id="checkItemSpanId">${
      element.name
    }</span>
                <button id= "delete" card-id = ${cardId} item-id=${
      element.id
    }>X</button></li>`;
    $("#checkItems").append(liHtml);
  } 
  // console.log(data);
}

async function runProject(link){
  await display(link);
  await getCheckListItems(link);
}

runProject(linkOfApi)

$("#checkItems").on("click", "#delete", deleteItems);
$("#checkItems").on("click", "#checkbox-id", updateItems);
$("#input-form").on("click", "#submit", addItems)
