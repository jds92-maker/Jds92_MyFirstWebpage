console.log("--- SCRIPT START ---");

document.addEventListener('DOMContentLoaded', () => {
    console.log("1. DOM Fully Loaded");
    
    // 1. BASKET INITIALISATION 
    let basket = JSON.parse(localStorage.getItem('bearboy_basket')) || [];
    console.log("2. Basket loaded:", basket);

    // 2. UPDATE NAV COUNTER 
    const basketCountDisplay = document.getElementById('basket-count');
    function updateBasketCount() {
        const totalItems = basket.reduce((total, item) => total + item.quantity, 0);
        if (basketCountDisplay) {
            basketCountDisplay.textContent = totalItems;
        }
    }
    updateBasketCount();

    // 3. ADD TO BASKET LOGIC 
    const addToBasketButtons = document.querySelectorAll('.add-to-basket-btn');
    console.log("3. Buttons found on this page:", addToBasketButtons.length);

    addToBasketButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Stops the button from accidentally refreshing the page
            console.log("4. BUTTON CLICK DETECTED!");
            
            const btn = event.currentTarget; // Guarantees we grab the button, not text inside it
            console.log("5. Button Dataset Found:", btn.dataset);

            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                quantity: 1
            };
            
            console.log("6. Product details parsed:", product);

            const existingItem = basket.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                basket.push(product);
            }

            localStorage.setItem('bearboy_basket', JSON.stringify(basket));
            updateBasketCount();
            console.log("7. Basket saved to storage!");

            const originalText = btn.textContent;
            btn.textContent = 'Added to Basket!';
            btn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = ''; 
            }, 1500);
        });
    });

    // 4. BASKET PAGE LOGIC 
    const basketContainer = document.getElementById('basket-item-container');
    const basketSubtotal = document.getElementById('basket-subtotal');
    const basketTotal = document.getElementById('basket-total');
    
    function renderBasket() {
        if (!basketContainer) return; 
        basketContainer.innerHTML = ''; 
        let total = 0;

        if (basket.length === 0) {
            basketContainer.innerHTML = '<p class="empty-cart-message">Your basket is currently empty. Go grab some heat!</p>';
            if (basketSubtotal) basketSubtotal.textContent = '£0.00';
            if (basketTotal) basketTotal.textContent = '£0.00';
            return;
        }

        basket.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.classList.add('basket-item'); 
            itemElement.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>£${item.price.toFixed(2)}</p>
                </div>
                <div class="item-controls">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            basketContainer.appendChild(itemElement);
        });

        if (basketSubtotal) basketSubtotal.textContent = `£${total.toFixed(2)}`;
        if (basketTotal) basketTotal.textContent = `£${total.toFixed(2)}`;
        attachBasketEvents();
    }

    function attachBasketEvents() {
        const plusBtns = document.querySelectorAll('.plus');
        const minusBtns = document.querySelectorAll('.minus');
        const removeBtns = document.querySelectorAll('.remove-btn');

        plusBtns.forEach(btn => btn.addEventListener('click', (e) => {
            basket[e.currentTarget.dataset.index].quantity += 1;
            updateAndRender();
        }));

        minusBtns.forEach(btn => btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            if (basket[index].quantity > 1) {
                basket[index].quantity -= 1;
            } else {
                basket.splice(index, 1);
            }
            updateAndRender();
        }));

        removeBtns.forEach(btn => btn.addEventListener('click', (e) => {
            basket.splice(e.currentTarget.dataset.index, 1);
            updateAndRender();
        }));
    }

    function updateAndRender() {
        localStorage.setItem('bearboy_basket', JSON.stringify(basket));
        updateBasketCount();
        renderBasket();
    }
    renderBasket();

    // 5. CHECKOUT BUTTON LOGIC 
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Check if the basket is already empty
            if (basket.length === 0) {
                alert("Your basket is empty! Go add some BearBoy heat before checking out.");
                return;
            }

            // Simulate a successful purchase
            alert("Thank you for your order! Your BearBoy clothing is being processed.");
            
            // Clear the basket array
            basket = [];
            
            // Clear localStorage
            localStorage.removeItem('bearboy_basket');
            
            // Re-render the page to show the empty state and updated navigation
            updateBasketCount();
            renderBasket();
        });
    }

    // 6. CONTACT FORM VALIDATION 
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let isValid = true;
            
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const messageError = document.getElementById('message-error');
            const successMsg = document.getElementById('form-success-msg');

            if (nameError) nameError.textContent = '';
            if (emailError) emailError.textContent = '';
            if (messageError) messageError.textContent = '';
            if (successMsg) successMsg.style.display = 'none';

            if (nameField && nameField.value.trim() === '') {
                if (nameError) nameError.textContent = 'Please enter your full name.';
                isValid = false;
            }
            if (emailField && (emailField.value.trim() === '' || !emailField.value.includes('@'))) {
                if (emailError) emailError.textContent = 'Please enter a valid email address.';
                isValid = false;
            }
            if (messageField && messageField.value.trim() === '') {
                if (messageError) messageError.textContent = 'Please enter a message.';
                isValid = false;
            }
            
            if (isValid) {
                if (successMsg) successMsg.style.display = 'block';
                contactForm.reset(); 
            }
        });
    }
});