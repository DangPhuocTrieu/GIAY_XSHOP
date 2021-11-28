
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const shoesBox = $('.shoes');
const imageBig = $('.shoes__left-image img');
const discount = $('.shoes__left-discount');
const title = $('.shoes__content-title');
const desc = $('.shoes__content-desc');
const price = $('.shoes__content-price');
const listImage = $$('.shoes__content-image');

const cartItems = $('.header__act-total');

const listSize = $$('.shoes__content-number div');
const buyBtn = $('.shoes__content-buy');

const commentBtn = $('.shoes__form-button');
const stars = $('.shoes__feedback-stars');

const contentInput = $('.shoes__form-content-input');
const nameInput = $('.shoes__form-name-input');
const emailInput = $('.shoes__form-email-input');

const contentMess = contentInput.nextElementSibling.nextElementSibling;
const nameMess = nameInput.nextElementSibling.nextElementSibling;
const emailMess = emailInput.nextElementSibling.nextElementSibling;

const listComment = $('.shoes__comment-list');
const totalCommentUnder = $('.shoes__comment-total');
const totalCommentBelow = $('.shoes__comment-quantity-number');
const firstCommentMessage = $('.shoes__comment-first');

const addBtns = $$('.shoes__content-add-icon');

const leftNavigate = $('.fa-long-arrow-alt-left');
const rightNavigate = $('.fa-long-arrow-alt-right');
 
let cart = [];
let comments = [];

class UI {
    displayShoes() {
        let shoes = Storage.getShoes(); 
        
        imageBig.src = shoes.image;
        discount.innerHTML = `Giảm ${shoes.discount}%`;    
        title.innerText = shoes.title;
        desc.innerText = shoes.description;
        price.innerHTML = this.formatVND(shoes.price);
        listImage[0].src = shoes.image;
        listImage[1].src = shoes.imageSmall_1;
        listImage[2].src = shoes.imageSmall_2;
    }

    formatVND(price) {
        return price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
    }

    // số lượng sản phẩm trong giỏ hàng
    updateCartItems() {
        let cart = Storage.getCart();
        let total = 0;

        cart.forEach(item => {
            total += item.amount;
        })

        cartItems.innerText = total;
    }

    // hàm xử lý khi click vào các 
    clickImage() {
        listImage.forEach(image => {
            image.addEventListener('click', (e) => {
               let removeActive = document.querySelector('.image_actived');
               if(removeActive) {
                   removeActive.classList.remove('image_actived');
               }

                imageBig.src = image.src;
                image.classList.add('image_actived');
            })
        })
    }

    // hàm xử lý khi click vào input size
    selectSize() {
        listSize.forEach(size => {
            size.addEventListener('click', (e) => {
                var itemRemove = document.querySelector('.size_actived');
                if(itemRemove) {
                    itemRemove.classList.remove('size_actived');
                }

                e.target.classList.add('size_actived');
            })
        })
    }


    // khi click vào buy button
    buyShoes() {
        buyBtn.addEventListener('click', (e) => {
            let size = parseInt($('.size_actived').innerText);
            
            let cart = Storage.getCart();
            let shoesAdd = {...Storage.getShoes(), size: size};

            let item = cart.find(shoes => shoes.id === shoesAdd.id && shoes.size === shoesAdd.size);

            if(item) {
                item.amount += 1;
                Storage.saveCart(cart);
            }
            else {
                shoesAdd = {...shoesAdd, amount: 1}; 
                cart = [...cart, shoesAdd];
                Storage.saveCart(cart);
            }
        })
    }


    // hàm xử lý khi click vào star
    handleClickStar() {
        stars.addEventListener('click', (e) => {
            const removeStar = $$('.star-actived');
            if(removeStar) {
                removeStar.forEach(star => {
                    star.classList.remove('star-actived');
                })
            }
            
            let star = e.target;
            star.classList.add('star-actived');
            
            while(star.previousElementSibling) {
                star = star.previousElementSibling;
                star.classList.add('star-actived');
            }

            const removeValue = $$('[data-select]');
            if(removeValue) {
                removeValue.forEach(value => {
                    value.removeAttribute('data-select');
                })
            }

            e.target.setAttribute('data-select', e.target.dataset.value);
        })
    }

    // hàm xóa giá trị của star đã chọn trước đó, xóa message validate
    deleteMessage(check) {
        if(check) {
            const removeValue = $('[data-select]');
            if(removeValue) {
                removeValue.removeAttribute('data-select');
            } 
        }

        stars.onclick = (e) => {
            const starsParent = e.target.closest('.shoes__feedback-stars');
            starsParent.nextElementSibling.innerText = '';
        }

        const inputs = $$('input');

        inputs.forEach(input => {
            input.oninput = () => {
                input.nextElementSibling.nextElementSibling.innerText = '';
            }
        })
    }
    
    // hàm validate form 
    validateForm() {
        const star = $('[data-select]');
        const starMess = $('.shoes__feedback').querySelector('.shoes__form-message');
        let flag = 0;

        // validate star value
        if(star) {
            var valueStar = star.dataset.select;
            starMess.innerText = '';
        }
        else {
            starMess.innerText = 'Vui lòng chọn đánh giá!';
        }

        // validate content input
        if(contentInput.value.trim() === '') {
            contentMess.innerText = 'Vui lòng nhập nhận xét!';
        }
        else {
            contentMess.innerText = '';
        }

        // validate name input
        if(nameInput.value.trim() === '') {
            nameMess.innerText = 'Vui lòng nhập tên!';
        }
        else {
            nameMess.innerText = '';
        }

        // validate email input
        if(emailInput.value.trim() === '') {
            emailMess.innerText = 'Vui lòng nhập email!';
        }
        else {
            emailMess.innerText = '';
        }
    }

    // xóa dữ liệu các ô input sau khi submit
    deleteValue() {
        const starsActive = $$('.star-actived');
        starsActive.forEach(star => {
            star.classList.remove('star-actived');
        })

        contentInput.value = '';
        nameInput.value = '';
        emailInput.value = '';
    }

    // hàm xử lý thêm comment sau khi đã nhập dữ liệu đầy đủ
    addComment() {
        if($('[data-select]') && contentInput.value !== '' && nameInput.value !== '' && emailInput.value !== '') {
            const star = $('[data-select]').dataset.select;
            const content = contentInput.value;
            const name = nameInput.value;
            const email = contentInput.value;

            const id = Storage.getShoes().id;

            let comment = {
                id_shoes: id,
                name: name,
                content: content,
                email: email,
                star: star
            }
            

            comments = Storage.getComments();
            comments = [...comments, comment];


           Storage.saveComments(comments);
           this.setValueComment();
           this.displayComments();
           this.deleteValue();

           return true;
        }
    }

    // hàm hiển thị tất cả các comment của sản phẩm đó
    displayComments() {
        let id = Storage.getShoes().id;
        let commentsStore = Storage.getComments();
        
        let comments = commentsStore.filter(comment => comment.id_shoes === id);

        if(comments) {
            let html = comments.map(comment => {
                return `
                    <div class="shoes__comment-item">
                        <div class="shoes__comment-info">
                            <h4 class="shoes__comment-name">${comment.name}</h4>
                            <div class="shoes__comment-stars">
                                ${this.displayStars(comment)}
                            </div>
                        </div>
                        <div class="shoes__left-content">${comment.content}</div>
                    </div>
                `
            })

            listComment.innerHTML = html.join("");
        }
    }

    // hàm tính tổng số lượt comment
    setValueComment() {
        let id = Storage.getShoes().id;
        let commentsStore = Storage.getComments();
        let comments = commentsStore.filter(comment => comment.id_shoes === id);

        if(comments.length > 0 ) {
            firstCommentMessage.innerHTML = '';
        }
        else {
            $('.shoes__comment-product').innerText = Storage.getShoes().title;
        }
        
        totalCommentUnder.innerText = comments.length;
        totalCommentBelow.innerText = comments.length;

    }

    // hàm xử lý hiển thị số sao tương ứng với giá trị đã chọn
    displayStars(comment) {
        let value = parseInt(comment.star);
        // console.log(value);

        if(value === 1) {
            return `
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
            `
        }
        else if(value === 2) {
            return `
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
            `
        }
        else if(value === 3) {
            return `
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
            `
        }
        else if(value === 4) {
            return `
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
            `
        }
        else {
            return `
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
                <ion-icon class="shoes__comment-star" name="star"></ion-icon>
            `
        }

    }

    handleComment() {
        commentBtn.addEventListener('click', (e) => {
            this.validateForm();
            const result = this.addComment();
            this.deleteMessage(result);
        })
    }

    clickExtend() {
        addBtns.forEach(addBtn => {
            addBtn.onclick = (e) => {
                let addBtn = e.target;
    
                if(addBtn.name === 'add-outline') {
                    addBtn.name = 'remove-outline';
                }   
                else {
                    addBtn.name = 'add-outline';
                }
    
                addBtn.parentElement.parentElement.querySelector('.shoes__content-add-list').classList.toggle('open-actived');
            }
        })
    }

    handleRediect() {
        leftNavigate.addEventListener('click', (e) => {
            let id = Storage.getShoes().id;
            let shoeses = Storage.getAllShoes();

            if(id > 1) { 
                Storage.setShoes(shoeses[id - 2]);
            }
            else {
                Storage.setShoes(shoeses[shoeses.length - 1]);
            }
        })

        rightNavigate.addEventListener('click', (e) => {
            let id = Storage.getShoes().id;
            let shoeses = Storage.getAllShoes();

            if(id < shoeses.length) {  
                Storage.setShoes(shoeses[id]);
            }
            else {
                Storage.setShoes(shoeses[0]);
            }
        })
    }
}

class Storage {
    static getShoes() {
        return JSON.parse(localStorage.getItem('shoesClick'));
    }

    static setShoes(shoes) {
        localStorage.setItem('shoesClick', JSON.stringify(shoes));
    }

    static getAllShoes() {
        return JSON.parse(localStorage.getItem('shoeses'));
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart() {
        return JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    }

    static saveComments(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    } 

    static getComments() {
        return JSON.parse(localStorage.getItem('comments')) ? JSON.parse(localStorage.getItem('comments')) : [];
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    const ui = new UI();

    ui.displayShoes();
    ui.updateCartItems();
    ui.clickImage();
    ui.selectSize();
    ui.buyShoes();
    ui.handleClickStar();
    ui.handleComment();
    ui.displayComments();
    ui.setValueComment();
    ui.clickExtend();
    ui.handleRediect();
})












