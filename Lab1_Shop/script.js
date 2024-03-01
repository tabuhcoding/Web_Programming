window.onload = function(){
    const fmenu1 = document.getElementById('fmenu1');
    fmenu1.preColor = fmenu1.style.backgroundColor;
    fmenu1.style.backgroundColor='yellow';

    const menu1 = document.getElementById('menu1');
    menu1.preColor = menu1.style.color;
    menu1.style.color='yellow';

    const menuElement = document.getElementsByName('menu');
    for(const con of menuElement){
        con.addEventListener('mouseover', function() {
            if(con.id[0]=='f'){
                con.preColor = con.style.backgroundColor;
                con.style.backgroundColor = 'yellow'; 
            }
            else{
                con.preColor = con.style.color;
                con.style.color = 'yellow';
            }
            con.style.cursor = 'pointer';
        });

        con.addEventListener('mouseout', function() {
            if(con.id[0]=='f'){
                con.style.backgroundColor = con.preColor; 
            }
            else{
                con.style.color = con.preColor;
            }
            con.style.cursor = 'auto'; 
        });
        con.addEventListener('click', function(){
            // alert('click');
            // alert(con.id);
            for(const res of menuElement){
                if(res.id==con.id){
                    if(res.id[0]=='f'){
                        res.preColor = res.style.backgroundColor;
                        res.style.backgroundColor = 'yellow'; 
                    }
                    else{
                        res.preColor = res.style.color;
                        res.style.color = 'yellow';
                    }
                    continue;
                }
                if (res.id.length!=con.id.length && res.id[res.id.length-1]==con.id[con.id.length-1]){
                    if(res.id[0]=='f'){
                        res.preColor = res.style.backgroundColor;
                        res.style.backgroundColor = 'yellow'; 
                    }
                    else{
                        res.preColor = res.style.color;
                        res.style.color = 'yellow';
                    }
                    continue;
                }
                if(res.id[0]=='f'){
                    res.style.backgroundColor = ''; 
                }
                else{
                    res.style.color = '';
                }

            }
        })
    }

    var productList = document.getElementsByClassName('product');
    for(const productNode of productList){
        moveProduct(productNode);
    }

    var newsList = document.getElementsByClassName("switchButton");
    for(const newsListNode of newsList){
        moveNews(newsListNode);
    }
}

function openNews(e){
    let newNode = e.parentNode;
    // alert(newNode.id[3]);
    let dataNode = document.getElementById("data"+newNode.id[3]);
    if(dataNode.style.display == "none"){
        dataNode.style.display = 'block';
        newNode.classList.add('opened');
        newNode.classList.remove('closed');
        e.innerText='\u2193';
    }
    else{
        dataNode.style.display = "none";
        newNode.classList.remove('opened');
        newNode.classList.add('closed');
        e.innerText=String.fromCharCode(9658);
    }
}

function highlightProduct(e){
    if(!e.checked){
        e.checked=true;
        e.lastColor = e.style.backgroundColor;
        e.style.backgroundColor = "orange";
    }else{
        e.checked=false;
        e.style.backgroundColor = e.lastColor;
    }
}
function moveButton(e){
    const items = document.getElementsByClassName("product");
    var shopList = document.getElementById("shopItems");
    var buyList = document.getElementById("buyItems");
    for(let i=items.length-1; i>=0;i--){
        if(items[i].checked==true){
            items[i].checked=false;
            items[i].style.backgroundColor = items[i].lastColor;
            if(e=='buy'){
                buyList.appendChild(items[i]);
            }
            else{
                shopList.appendChild(items[i]);
            }
            
            // i--;
        }
    }
}
function moveAll(e){
    // const items = document.getElementsByClassName("product");
    var shopList = document.getElementById("shopItems");
    var buyList = document.getElementById("buyItems");
    // for(let checkedItem of items){
    //     if(e=='buy'){
    //         shopList.removeChild(checkedItem);
    //         buyList.appendChild(checkedItem);
    //     }
    //     else{
    //         buyList.removeChild(checkedItem);
    //         shopList.appendChild(checkedItem);
    //     }
    //     if(checkedItem==true){
    //         checkedItem.checked=false;
    //         checkedItem.style.backgroundColor = checkedItem.lastColor;
    //     }
    // }
    // shopList.removeChild(items);
    // buyList.appendChild(items);
    if(e=='buy'){
        while(shopList.firstChild){
            if(shopList.firstChild.checked==true){
                shopList.firstChild.checked=false;
                shopList.firstChild.style.backgroundColor = shopList.firstChild.lastColor;
            }
            buyList.appendChild(shopList.firstChild);
        }
    }
    else{
        while(buyList.firstChild){
            if(buyList.firstChild.checked==true){
                buyList.firstChild.checked=false;
                buyList.firstChild.style.backgroundColor = buyList.firstChild.lastColor;
            }
            shopList.appendChild(buyList.firstChild);
        }
    }
}
function deleteAll(){
    var tb = document.getElementById("listCustomer");
    var rows = tb.getElementsByTagName('tr');
    var row = document.getElementsByName("row-table");
    // alert(row[0]);
    for(let i = rows.length-1; i>0;i--){
        // rows[i].style.backgroundColor = 'green';
        // alert("HI");
        tb.deleteRow(i);
    }
    // tb.deleteRow(2);
    // rows[1].style.backgroundColor = 'green';
}
function addRegist(){
    let ch = checkRegist();
    if(ch==true){
        const table = document.getElementById("listCustomer");
        const newRow = table.insertRow();

        const cellName = newRow.insertCell();
        var name = document.getElementById("name");
        cellName.textContent=name.value;

        const cellSex = newRow.insertCell();
        var sex = document.getElementsByName("sex");
        for(const con of sex){
            if(con.checked==true){
                cellSex.textContent=con.value;
            }
        }
        
        const cellAddress = newRow.insertCell();
        var address = document.getElementById("address");
        cellAddress.textContent=address.value;

        const cellDate = newRow.insertCell();
        var date = document.getElementById("date");
        cellDate.textContent=date.value;

        const cellProduct = newRow.insertCell();
        var listPro = document.getElementById("buyItems").getElementsByClassName("product");
        var stringPro = "";
        for(const con of listPro){
            // stringPro += 
            var pro = con.getElementsByClassName("nameProduct");
            for(const conPro of pro){
                var namePro = conPro.textContent;
            }
            stringPro+=namePro;
            stringPro+="; ";
        }
        cellProduct.textContent=stringPro;
    }
}
function checkRegist(){
    let ch = true;
    var name = document.getElementById("name");
    if(!name.value){
        name.classList.add('error');
        var message = document.getElementById("name-message");
        message.innerText = "*Họ và tên chưa được điền";
        ch=false;
    }
    else if(checkStringAtLeastTwoWords(name.value)){
        name.classList.add('error');
        var message = document.getElementById("name-message");
        message.innerText = "*Họ và tên chưa hợp lệ";
        ch=false;
    }
    else{
        name.classList.remove('error');
        var message = document.getElementById("name-message");
        message.innerText = "";
    }

    var address = document.getElementById("address");
    if(!address.value){
        address.classList.add('error');
        var message = document.getElementById("address-message");
        message.innerText = "*Địa chỉ chưa được điền";
        ch=false;

    }
    else if(checkStringAtLeastTwoWords(name.value)){
        address.classList.add('error');
        var message = document.getElementById("address-message");
        ch=false;
        message.innerText = "*Địa chỉ chưa hợp lệ";
    }
    else{
        address.classList.remove('error');
        var message = document.getElementById("address-message");
        message.innerText = "";
    }

    var phone = document.getElementById("phone");
    if(!phone.value)
    {
        phone.classList.add('error');
        var message = document.getElementById("phone-message");
        ch=false;
        message.innerText = "*Số điện thoại chưa được điền";
    }
    else if(checkPhone(phone.value)==false){
        phone.classList.add('error');
        var message = document.getElementById("phone-message");
        ch=false;
        message.innerText = "*Số điện thoại chưa hợp lệ";
    }
    else{
        phone.classList.remove('error');
        var message = document.getElementById("phone-message");
        message.innerText = "";
    }

    var date = document.getElementById("date");
    if(!date.value)
    {
        date.classList.add('error');
        var message = document.getElementById("date-message");
        ch=false;
        message.innerText = "*Ngày giao hàng chưa được điền";
    }
    else if(checkDate(date.value)==false){
        date.classList.add('error');
        var message = document.getElementById("date-message");
        ch=false;
        message.innerText = "*Ngày chưa hợp lệ";
    }
    else{
        date.classList.remove('error');
        var message = document.getElementById("date-message");
        message.innerText = "";
    }

    var mail = document.getElementById("mail");
    if(!mail.value)
    {
        mail.classList.add('error');
        var message = document.getElementById("mail-message");
        ch=false;
        message.innerText = "*Email chưa được điền";
    }
    else if(checkMail(mail.value)==false){
        mail.classList.add('error');
        var message = document.getElementById("mail-message");
        ch=false;
        message.innerText = "*Email chưa hợp lệ";
    }
    else{
        mail.classList.remove('error');
        var message = document.getElementById("mail-message");
        message.innerText = "";
    }

    var sex = document.getElementsByName("sex");
    if(checkSex(sex)==false){
        mail.classList.add('error');
        var message = document.getElementById("sex-message");
        ch=false;
        message.innerText = "*Chưa chọn giới tính";
    }
    else{
        mail.classList.remove('error');
        var message = document.getElementById("sex-message");
        message.innerText = "";
    }

    var cart = document.getElementById("buyItems");
    var cartNode = cart.getElementsByClassName("product");
    // alert(cartNode.length);
    // cart.childNodes
    // alert(cartNode);
    if(cartNode.length==0){
        cart.classList.add('error');
        var message = document.getElementById("list-message");
        ch=false;
        // alert('hi');
        message.innerText = "*Chưa chọn sản phẩm";
    }
    else{
        cart.classList.remove('error');
        var message = document.getElementById("list-message");
        message.innerText = "";
    }
    return ch;
}
function checkPhone(phone){
    let ch = /^0[0-9]{9}$/;
    return ch.test(phone);
}
function checkStringAtLeastTwoWords(str){
    let ch = /\b\w+\b/g;
    let matches = str.match(ch);
    return matches && matches.length >= 2;
}
function checkDate(date){
    // alert(date);
    const inp = new Date(date);
    const cur = new Date();
    // alert(cur);
    return cur>=inp;
}
function checkSex(sex){
    let ch=false;
    for(const con of sex){
        if(con.checked==true){
            ch=true;
            break;
        }
    }
    return ch;
}
function checkMail(mail) {
    const ch = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return ch.test(mail);
}

function moveProduct(obj){
    // var cloneElement = obj.cloneNode(true);
    //     cloneElement.style.position='absolute';
    //     cloneElement.style.minWidth=obj.offsetWidth + "px";
    //     // alert(obj.offsetWidth);
    //     cloneElement.style.left = obj.offsetLeft+"px";
    //     cloneElement.style.top = obj.offsetLeft+"px";
    // obj.onmouseover = function(e){
    //     obj.parentNode.appendChild(cloneElement);
    // }
    // obj.onmouseout = function(e){
    //     obj.parentNode.removeChild(cloneElement);
    // }
    obj.onmousedown = function (e){
        // alert(this.parentNode.scrollTop)
        let relativeWidth = this.offsetWidth + "px";
        // alert(this.offsetWidth);
        // this.style.maxWidth=relativeWidth;
        this.style.minWidth=relativeWidth;
        this.preLeft = this.style.left;
        this.preTop = this.style.top;
        // this.style.width = relativeWidth;
        this.style.left = getAbsoluteLeft(this)-this.parentNode.scrollLeft +"px";
        this.style.top = getAbsoluteTop(this)- this.parentNode.scrollTop + "px";
        this.isDown = true;
        this.style.position='absolute';

        this.oldX = e.clientX;
        this.oldY = e.clientY;
    }
    obj.onmousemove = function(e){
        if(this.isDown){
            let dx = e.clientX - this.oldX;
            let dy = e.clientY - this.oldY;
            
            this.style.left = parseInt(this.style.left)+ dx + "px";
            this.style.top = parseInt(this.style.top) + dy + "px";

            this.oldX = e.clientX;
            this.oldY = e.clientY;
        }
    }
    obj.onmouseup = function(e){
        this.isDown = false;
        if(this.parentNode.id=='shopItems'){
            var cartEle = document.getElementById('buyItems');
        }
        else{
            var cartEle = document.getElementById('shopItems');
        }
        cartEle.absTop = cartEle.offsetTop - window.scrollY;
        cartEle.absLeft = cartEle.offsetLeft - window.scrollX;
        cartEle.absBottom = cartEle.offsetTop + cartEle.offsetHeight - window.scrollY;
        cartEle.absRight = cartEle.offsetLeft + cartEle.offsetWidth - window.scrollX;
        // alert(cartEle.absBottom)
        if(e.clientX < cartEle.absRight
            && e.clientX > cartEle.absLeft
            && e.clientY > cartEle.absTop
            && e.clientY < cartEle.absBottom
            ){
                this.style.minWidth = 0;
                this.style.left = this.preLeft;
                this.style.top = this.preTop;
                this.style.position='relative';
                cartEle.appendChild(this);
            }
            else{
                this.style.minWidth = 0;
                this.style.left = this.preLeft;
                this.style.top = this.preTop;
                this.style.position='relative';
                highlightProduct(this);

            }
    }
}

function moveNews(obj){
    // obj.grand = obj.parentNode.parentNode;
    // var cloneElement = obj.grand.cloneNode(true);
    //     cloneElement.style.position='absolute';
    //     cloneElement.style.maxWidth=obj.grand.offsetWidth + "px";
    //     cloneElement.style.minWidth=obj.grand.offsetWidth + "px";
    //     // alert(obj.offsetWidth);
    //     cloneElement.style.left = getAbsoluteLeft(obj.grand)+"px";
    //     cloneElement.style.top = getAbsoluteTop(obj.grand)+"px";
    // obj.onmouseover = function(e){
    //     obj.grand.parentNode.appendChild(cloneElement);
    // }
    // obj.onmouseout = function(e){
    //     obj.grand.parentNode.removeChild(cloneElement);
    // }
    
}

function getAbsoluteLeft(element) {
    let left = element.offsetLeft;
    let top = element.offsetTop;
    let parentElement = element.offsetParent;

    while (parentElement !== null) {
        left += parentElement.offsetLeft;
        top += parentElement.offsetTop;
        parentElement = parentElement.offsetParent;
    }

    return left;
}

function getAbsoluteTop(element) {
    let left = element.offsetLeft;
    let top = element.offsetTop;
    let parentElement = element.offsetParent;

    while (parentElement !== null) {
        left += parentElement.offsetLeft;
        top += parentElement.offsetTop;
        parentElement = parentElement.offsetParent;
    }

    return top;
}