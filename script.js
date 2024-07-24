let modalQt = 1;
let cart = [];
let modalKey = 0
//funçõa auxiliar para querySelector e querySelectorAll
const q = (el)=> document.querySelector(el);
const ql = (el)=> document.querySelectorAll(el);
//Listando as pizzas na página
pizzaJson.map((pizza, index) => {
    //criando um clone do model 
    let pizzaItem = q('.models .pizza-item').cloneNode(true);
    //mostrando os item das pizzas nos campos de cada clone
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    //definindo evento de click na pizza
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault(); //previne a pagina recarregar
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;        
        showWindow(key); //mostra a tela (modal)
    });
    q('.pizza-area').append(pizzaItem);
});
function showWindow(key) {
    modalQt = 1;
    //completando as informações
    q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    q('.pizzaBig img').src = pizzaJson[key].img;
    q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

    q('.pizzaInfo--size.selected').classList.remove('selected');

    ql('.pizzaInfo--size').forEach((size, sizeIndex)=>{
        if (sizeIndex == 2){
            size.classList.add('selected')
        }
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    q('.pizzaInfo--qt').innerHTML = modalQt;
    //exibição e animação
    q('.pizzaWindowArea').style.opacity = 0;
    q('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{
        q('.pizzaWindowArea').style.opacity = 1;
    },200);
}
function closeWindow() {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
        q('.pizzaWindowArea').style.display = 'none';
    });
}
//cancelar
ql('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeWindow);
});
// add - 
q('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1){ 
        modalQt--;
        q('.pizzaInfo--qt').innerHTML = modalQt;
        actualPrice = pizzaJson[modalKey].price * modalQt;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${actualPrice.toFixed(2)} `
    }
})
//add +
q('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    actualPrice = pizzaJson[modalKey].price * modalQt;
    q('.pizzaInfo--qt').innerHTML = modalQt;
    q('.pizzaInfo--actualPrice').innerHTML = `R$ ${actualPrice.toFixed(2)} `

});
//tamanho
ql('.pizzaInfo--size').forEach((size)=>{
    size.addEventListener('click', (e)=>{
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//add kart
q('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size; 
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });
    if (key > -1) {
        cart[key].qt += modalQt;
    }else {
        cart.push({
            identifier:identifier,
            id:pizzaJson[modalKey].id,
            size:size,
            qt:modalQt
        });
    }
    updateCart();
    closeWindow();
});
// carrinho mobile
q('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        q('aside').style.left = '0';
    }
});
q('.menu-closer').addEventListener('click', ()=>{
    q('aside').style.left = '100vw';
});
function updateCart() {
    //mobile
    q('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0) {
        q('aside').classList.add('show');//mostrando o aside (area do cart)
        q('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0; 
        let total = 0;
        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = q('.models .cart--item').cloneNode(true); //clonando o model de cart
            //transformando size em letras cart[i].size retornava antes 1 2 3 
            let pizzaSizeName; 
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                    pizzaSizeName = 'G';
                    break;
            }
            //completando as informaçãoes no carrinho 
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('img').src = pizzaItem.img;
            //botões + e - no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if (cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); //removendo o item
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            q('.cart').append(cartItem);     
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        //completando valores 
        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        q('aside').classList.remove('show');
        q('aside').style.left = '100vw';
    }
}