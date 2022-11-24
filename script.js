let userList = []
let dataList = []
let allUser
let mainTable
let calculateTable
let users
let payers
let Money
let Reason
let AddForm
let AddButton
let Noti
let data = [];
let user = [];
let payer = 0;
let money = 0;
let reason = "";

const dataURI = "https://nextjs-mongo-eta.vercel.app/api/spent"
const userURI = "https://nextjs-mongo-eta.vercel.app/api/user"

const getDataList = () => {
    fetch(dataURI)
    .then(res => res.json())
    .then((res) => {
        dataList = res.data
    })
    .then(() => {
        loadUser()
        loadTable()
        getDomElement()
        calculate()
    })
}

const getUserList = () => {
    fetch(userURI)
    .then(res => res.json())
    .then((res)=>{
        userList = res.data
        getDataList()
    })
    .then((() => {
        loadUser()
        loadTable()
        getDomElement()
    }))
    .catch(error => console.log(error))
}
getUserList()

const payerChosen = document.getElementById("payer-chosen");
const userChosen = document.getElementById("user-chosen");
const headTable = document.getElementById("head-table");
const headDetail = document.getElementById("detail-head");


const loadUser = () => {
    headTable.innerHTML = "<th scope='col'></th>"
    headDetail.innerHTML = "<th scope='col'>Ngày</th>"
    payerChosen.innerHTML = ""
    userChosen.innerHTML = ""
    userList.map((item) => {
        payerChosen.innerHTML += `
            <button type="button" class="payer btn btn-outline-danger mr-3">${item.name}</button>
        `
        userChosen.innerHTML += `
            <button type="button" class="user btn btn-outline-success mr-3">${item.name}</button>
        `
        headTable.innerHTML += `
            <th scope="col">${item.name}</th>
        `
        headDetail.innerHTML += `
            <th scope="col">${item.name}</th>
        `
    })
    headTable.innerHTML += '<th scope="col">Tổng</th>'
    headDetail.innerHTML += 
    `<th scope="col">Tổng</th>
    <th scope="col">Người Chi</th>
    <th scope="col">Lý Do</th>
    <th scope="col">Xoá</th>`
}

const getDomElement = function() {
    allUser = document.getElementById("all-user");
    mainTable = document.getElementById("mainTable");
    calculateTable = document.getElementById("calculateTable");
    users = document.querySelectorAll(".user");
    payers = document.querySelectorAll(".payer");
    Money = document.getElementById("money");
    Reason = document.getElementById("reason");
    AddForm = document.getElementById("addForm");
    AddButton = document.getElementById("addButton");
    Noti = document.getElementById("noti");
    users.forEach((item, index) => {
        item.addEventListener('click', ()=>{
            if (item.classList.contains("active")){
                item.classList.remove("active");
                let temp = user.indexOf(index+1);
                user.splice(temp, 1);
                allUser.classList.remove("active")
            }
            else {
                item.classList.add("active");
                user.push(index+1);
                if (isAllActive()){
                    allUser.classList.add("active")
                }
            }
        })
        
    })
    
    payers.forEach((item, index) => {
        item.addEventListener('click', () => {
            payers.forEach(item2 => {
                item2.classList.remove("active");
            })
            item.classList.add("active");
            payer = index+1;
        })
    })
}
getDomElement()

const loadTable = function() {
    let namePayer = "";
    mainTable.innerHTML = "";
    for (let i = 0; i < dataList.length; i++){
        namePayer = userList.filter(item => item.id == dataList[i].payer)[0]?.name
        let everyMoney = Math.round(((dataList[i].money / dataList[i].user.length) * 100)) / 100;
        
        mainTable.innerHTML += `
            <tr id="row-${i}">
                <th scope="row">${dataList[i].created_time.slice(0,10)}</th>
                <td>${(dataList[i].user.includes(1))?everyMoney:""}</td>
                <td>${(dataList[i].user.includes(2))?everyMoney:""}</td>
                <td>${(dataList[i].user.includes(3))?everyMoney:""}</td>
                <td>${(dataList[i].user.includes(4))?everyMoney:""}</td>
                <td>${(dataList[i].user.includes(5))?everyMoney:""}</td>
                <td>${dataList[i].money}</td>
                <td>${namePayer}</td>
                <td>${dataList[i].reason}</td>
                <td><button type="button" onclick=deleteRow(${i}) class="btn btn-danger">Xoá</button></td>
            </tr>
        `
    }
}

const calculate = async function(){
    calculateTable.innerHTML = "";
    let totalSpends = {};
    let totalUses = {};
    let totalRefund = {};
    userList.forEach(item => {
        totalSpends[item.id] = 0
        totalUses[item.id] = 0
        totalRefund[item.id] = 0
    })
    
    let totalSpend = 0;
    let totalUse = 0;

    dataList.forEach(item => {
        let everyMoney = Math.round(((item.money / item.user.length) * 100)) / 100;
        totalSpend += item.money;
        totalSpends[item.payer] += item.money;
        item.user.forEach(item2 => {
            totalUses[item2] += everyMoney;
        })
    })

    for (let i in totalUses) {
        totalUse += totalUses[i];
    }

    for (let i in totalSpends) {
        totalSpends[i] = Math.round(totalSpends[i]);
    }

    userList.map(item => {
        totalRefund[item.id] = totalSpends[item.id] - totalUses[item.id]
    })

    let spendRows = ""
    let useRows = ""
    let refundRows = ""
    userList.map(item => {
        spendRows += `
            <td>${totalSpends[item.id]}</td>
        `
        useRows += `
            <td>${Math.round(totalUses[item.id])}</td>
        `
        refundRows += `
            <td>${Math.round(totalRefund[item.id])}</td>
        `

    })

    calculateTable.innerHTML += `
    <tr>
        <th scope="row">Chi</th>
        ${spendRows}
        <td>${totalSpend}</td>
    </tr>
    <tr>
        <th scope="row">Tiêu</th>
        ${useRows}
        <td>${totalUse}</td>
    </tr>
    <tr>
        <th scope="row">Nhận Lại</th>
        ${refundRows}
        <td></td>
    </tr>
    `
}

loadTable();
calculate();

const addData = function(data){
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(dataURI, options)
        .then(res => {
            res.json();
        })
        .catch(error => console.log(error))
}

const deleteData = function(id){
    let options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    };
    fetch(dataURI, options)
        .then(res => {
            
        })
        .catch(error => console.log(error))
}

const isAllActive = () => {
    for (let item of users){
        if (!item.classList.contains("active")) {
            return false
        }
    }
    return true
}

AddButton.addEventListener('click', ()=>{
    AddForm.classList.toggle("active");
})

const deleteRow = function(index){
    deleteData(dataList[index].id);
    dataList.splice(index,1);
    loadTable();
    calculate();
}

Money.onchange = () => {
    money = Money.value - 0;
}

Reason.onchange = () => {
    reason = Reason.value;
}

const addNew = function(){
    if (payer == 0){
        Noti.classList.add("active");
        Noti.innerText = "CHƯA CÓ NGƯỜI TRẢ TIỀN KÌA BẠN ƠI!";
        return;
    }
    else if (money == 0 || money == "") {
        Noti.classList.add("active");
        Noti.innerText = "XÀI HẾT NHIÊU TIỀN BA!";
        return;
    }
    else if (!user[0]){
        Noti.classList.add("active");
        Noti.innerText = "CHI TIỀN CHO AI XÀI MÁ!";
        return;
    }
    Noti.classList.remove("active");
    let id = dataList.length > 0 ? dataList[dataList.length - 1].id + 1 : 1
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let created_time = day + "/" + month + "/" + year;
    let temp = {
        id,
        payer,
        money,
        user,
        reason,
        created_time,
    }
    dataList.push(temp);
    addData(temp);
    Money.value = "";
    Reason.value = "";
    payers.forEach(item => {
        item.classList.remove("active");
    })
    users.forEach(item => {
        item.classList.remove("active");
    })
    allUser.classList.remove("active");
    user = [];
    payer = 0;
    money = 0;
    reason = "";
    loadTable();
    calculate();
}

const deleteAll = document.getElementById("deleteAll");
deleteAll.addEventListener('click', ()=>{
    let pass = prompt("Nhập Password để xoá!", "");
    if (pass == "confirm"){
        dataList.forEach(item => {
            dataList = [];
            deleteData(item.id);
            loadTable();
            calculate();
        })
    }
    else {
        alert("Mật khẩu là 'confirm' bro!");
    }
})

allUser.addEventListener('click', () => {
    if (!isAllActive()){
        users.forEach(item => {
            item.classList.add("active")
        })
        allUser.classList.add("active")
        user = [1,2,3,4,5]
    } else {
        users.forEach(item => {
            item.classList.remove("active")
        })
        allUser.classList.remove("active")
        user = []
    }
    
})

const addUser = function(name){
    let id = userList[userList.length - 1].id + 1
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id, name})
    };
    fetch(userURI, options)
        .then(res => {
            res.json();
        })
        .catch(error => console.log(error))
}

const submitNewUser = document.getElementById("submit-new-user");
const newUserName = document.getElementById("new-user-name");

submitNewUser.addEventListener('click', () => {
    let newName = newUserName.value.trim();
    if (newName == "") {
        alert("Vui lòng nhập tên!");
    } else {
        addUser(newName)
    }
    loadTable()
    calculate()
})






