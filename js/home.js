
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const shoesList = $('.product__list');
const cartItems = $('.header__act-total');

const searchIcon = $('.search-btn');
const searchBtn = $('.header__act-search-button');
const searchForm = $('.header__act-search-form');
const searchInput = $('.header__act-search-input');

class Shoeses {
    async getShoeses() {
        let response = await fetch('https://giay-xshop-api.herokuapp.com/shoeses');
        let shoeses = await response.json();

        shoeses = shoeses.map(shoes => {
            const {id, title, description, discount, price} = shoes;
            const {image, imageSmall_1, imageSmall_2} = shoes.images;

            return {id, title, description, discount, price, image, imageSmall_1, imageSmall_2}
        })

        return shoeses;
    }
}

class UI {
    render(shoes) {
        return `
            <div class="product__list-item" data-id="${shoes.id}">
                <a href="./details.html" class="product__list-top">
                    <img src="${shoes.image}" alt="" class="product__list-image">
                    <span class="product__list-discount">Giảm ${shoes.discount}%</span>
                </a>
                <div class="product__list-imgSmall">
                    <img class="product__list-small" src="${shoes.image}" alt="">
                    <img class="product__list-small" src="${shoes.imageSmall_1}" alt="">
                    <img class="product__list-small"  src="${shoes.imageSmall_2}" alt="">
                </div>
                <a href="./details.html" class="product__list-name">${shoes.title}</a>
                <span class="product__list-price">${this.formatVND(shoes.price)}</span>
            </div>
        `
    }

    displayShoeses(shoeses) {
        var html = '';
        shoeses.forEach(shoes => {
            html += this.render(shoes);
        })

        shoesList.innerHTML = html;
    }

    formatVND(price) {
        return price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
    }

    hoverImage() {
        var images = $$('.product__list-image');

        images.forEach(image => {
            const imagesSmall = image.parentElement.parentElement.querySelectorAll('.product__list-small');
            
            imagesSmall.forEach(imgSmall => {
                imgSmall.addEventListener('mouseover', (e) => {
                    image.src = e.target.src;
                })
            })
        })
    }

    clickShoes() {
        shoesList.addEventListener('click', (e) => {
            if(e.target.classList.contains('product__list-image') || e.target.classList.contains('product__list-name')) {
                var id;
                if(e.target.classList.contains('product__list-image')) {
                    id = e.target.parentElement.parentElement.dataset.id;
                }
                else {
                    id = e.target.parentElement.dataset.id;
                }
                
                const shoeses = Storage.getShoeses();
                const shoes = shoeses.find(shoes => shoes.id == id);

                Storage.saveClickShoes(shoes);
            }
        })
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

    clickFormSearch() {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = '';
            searchForm.classList.toggle('actived');
        })

        document.addEventListener('click', (e) => {
            if(e.target !== searchIcon && e.target !== searchInput) {
                searchForm.classList.remove('actived');
            }
        })

        searchInput.addEventListener('click', (e) => {
            e.preventDefault();
        })

        searchInput.value = '';
    }

    handleSearch() {
        let shoeses = Storage.getShoeses();
        let searchResult;

        searchInput.addEventListener('input', (e) => {
            let value = e.target.value;

            searchResult = shoeses.filter(item => {
                return item.title.includes(value);
            })

            if(searchResult.length > 0) {
                let html = searchResult.map(shoes => {
                    return this.render(shoes);
                })

                shoesList.innerHTML = html.join(' ');
            }
            else {
                shoesList.innerHTML = `<p class="none-search">Không có sản phẩm nào phù hợp với kết quả cần tìm</p>`;
            }
        })
    }

}

class Storage {
    static saveShoeses(shoeses) {
        localStorage.setItem('shoeses', JSON.stringify(shoeses));
    }

    static getShoeses() {
        return JSON.parse(localStorage.getItem('shoeses'));
    }
    static saveClickShoes(shoes) {
        return localStorage.setItem('shoesClick', JSON.stringify(shoes));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    const shoeses = new Shoeses();
    const ui = new UI();

    shoeses.getShoeses().then(shoeses => {
        ui.displayShoeses(shoeses);
        Storage.saveShoeses(shoeses);
    }).then(() => {
        ui.hoverImage();
        ui.clickShoes();
        ui.updateCartItems();

        ui.clickFormSearch();
        ui.handleSearch();
    });
})

