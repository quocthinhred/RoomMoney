
let data = [];
let user = [];
let payer = 0;
let money = 0;
let reason = "";
let dataAPI = "https://my-json-vercel.vercel.app/data"


const mainTable = document.getElementById("mainTable");
const calculateTable = document.getElementById("calculateTable");
const users = document.querySelectorAll(".user");
const payers = document.querySelectorAll(".payer");
const Money = document.getElementById("money");
const Reason = document.getElementById("reason");
const AddForm = document.getElementById("addForm");
const AddButton = document.getElementById("addButton");
const Noti = document.getElementById("noti");

const loadTable = function() {
    let namePayer = "";
    mainTable.innerHTML = "";
    for (let i = 0; i < data.length; i++){
    switch(data[i].payer){
        case 1: 
            namePayer = "Thịnh";
            break;
        case 2: 
            namePayer = "Đăng";
            break;
        case 3: 
            namePayer = "Danh";
            break;
        case 4: 
            namePayer = "Việt";
            break;
        case 5: 
            namePayer = "Bảo";
            break;
    }
    let everyMoney = Math.round(((data[i].money / data[i].user.length) * 100)) / 100;
    
    mainTable.innerHTML += `
        <tr id="row-${i}">
            <th scope="row">${data[i].date}</th>
            <td>${(data[i].user.includes(1))?everyMoney:""}</td>
            <td>${(data[i].user.includes(2))?everyMoney:""}</td>
            <td>${(data[i].user.includes(3))?everyMoney:""}</td>
            <td>${(data[i].user.includes(4))?everyMoney:""}</td>
            <td>${(data[i].user.includes(5))?everyMoney:""}</td>
            <td>${data[i].money}</td>
            <td>${namePayer}</td>
            <td>${data[i].reason}</td>
            <td><button type="button" onclick=deleteRow(${i}) class="btn btn-danger">Xoá</button></td>
        </tr>
    `
    }
}

const calculate = async function(){
    calculateTable.innerHTML = "";
    let totalSpends = [0,0,0,0,0];
    let totalUses = [0,0,0,0,0];
    let totalRefund = [0,0,0,0,0];
    let totalSpend = 0;
    let totalUse = 0;

    data.forEach(item => {
        let everyMoney = Math.round(((item.money / item.user.length) * 100)) / 100;
        totalSpend += item.money;
        totalSpends[item.payer-1] += item.money;
        item.user.forEach(item2 => {
            totalUses[item2-1] += everyMoney;
        })
    })

    for(let i = 0; i < 5; i++){
        totalUses[i] = Math.round(totalUses[i]);
        totalUse += totalUses[i];
    }

    for(let i = 0; i < 5; i++){
        totalRefund[i] = totalSpends[i] - totalUses[i];
    }

    for(let i = 0; i < 5; i++){
        totalSpends[i] = Math.round(totalSpends[i]);
    }

    calculateTable.innerHTML = `
    <tr>
        <th scope="row">Chi</th>
        <td>${totalSpends[0]}</td>
        <td>${totalSpends[1]}</td>
        <td>${totalSpends[2]}</td>
        <td>${totalSpends[3]}</td>
        <td>${totalSpends[4]}</td>
        <td>${totalSpend}</td>
    </tr>
    <tr>
        <th scope="row">Tiêu</th>
        <td>${Math.round(totalUses[0])}</td>
        <td>${Math.round(totalUses[1])}</td>
        <td>${Math.round(totalUses[2])}</td>
        <td>${Math.round(totalUses[3])}</td>
        <td>${Math.round(totalUses[4])}</td>
        <td>${totalUse}</td>
    </tr>
    <tr>
        <th scope="row">Nhận Lại</th>
        <td>${Math.round(totalRefund[0])}</td>
        <td>${Math.round(totalRefund[1])}</td>
        <td>${Math.round(totalRefund[2])}</td>
        <td>${Math.round(totalRefund[3])}</td>
        <td>${Math.round(totalRefund[4])}</td>
        <td></td>
    </tr>
    `
}

loadTable();
calculate();

const getData = function(){
    fetch(dataAPI)
        .then(res => res.json())
        .then((res)=>{
            data = res;
        })
        .then(()=>{
            loadTable();
            calculate();
        })
        .catch(error => console.log(error))
}

const addData = function(data){
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(dataAPI, options)
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
        }
    };
    fetch(dataAPI + '/' + id, options)
        .then(res => {
            res.json();
        })
        .catch(error => console.log(error))
}

getData(dataAPI);

AddButton.addEventListener('click', ()=>{
    AddForm.classList.toggle("active");
})

const deleteRow = function(index){
    deleteData(data[index].id);
    data.splice(index,1);
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
    let id = 1;
    if (data.length > 0){
        id = (data[data.length-1].id + 1)
    }
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let date = day + "/" + month + "/" + year;
    let temp = {
        id,
        payer,
        money,
        user,
        date,
        reason
    }
    data.push(temp);
    addData(temp);
    Money.value = "";
    Reason.value = "";
    payers.forEach(item => {
        item.classList.remove("active");
    })
    users.forEach(item => {
        item.classList.remove("active");
    })
    user = [];
    payer = 0;
    money = 0;
    reason = "";
    loadTable();
    calculate();
}




users.forEach((item, index) => {
    item.addEventListener('click', ()=>{
        if (item.classList.contains("active")){
            item.classList.remove("active");
            let temp = user.indexOf(index+1);
            user.splice(temp, 1);
        }
        else {
            item.classList.add("active");
            user.push(index+1);
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



const deleteAll = document.getElementById("deleteAll");
deleteAll.addEventListener('click', ()=>{
    let pass = prompt("Nhập Password để xoá!", "");
    if (pass == "confirm"){
        let i;
        for (i in document.querySelectorAll("tr > td > button")){
            document.querySelectorAll("tr > td > button")[0].click();
        }
    }
    else {
        alert("Mật khẩu là 'confirm' bro!");
    }
})





