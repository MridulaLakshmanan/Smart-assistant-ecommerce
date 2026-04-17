/**
 * SmartCart AI - Cart & Checkout Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Step Navigation Logic
  let currentStep = 1;
  const maxSteps = 4;

  const btnNext = document.querySelectorAll('.btn-next-step');
  const btnPrev = document.querySelectorAll('.btn-prev-step');

  btnNext.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Basic validation mock
      if (currentStep === 1) {
        const addr = document.getElementById('shipping-address').value;
        if (!addr) {
          showToast('Please enter a shipping address.', 'error');
          return;
        }
      }
      if (currentStep < maxSteps) {
        currentStep++;
        updateCheckoutView();
      } else {
        // Final Submission
        showToast('Order Placed Successfully!', 'success');
        document.getElementById('step-4').innerHTML = `
          <div style="text-align: center; padding: 40px 0;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" style="margin: 0 auto 20px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h2>Order Confirmed!</h2>
            <p style="color: var(--color-text-muted); margin-bottom: 24px;">Your order #ORD-843920 is being processed.</p>
            <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">Track Order</button>
            <button class="btn btn-secondary mt-4" style="margin-left: 8px;" onclick="window.location.href='index.html'">Continue Shopping</button>
          </div>
        `;
        document.getElementById('checkout-sidebar-actions').style.display = 'none';

        // Update Step Indicators
        document.querySelectorAll('.step-indicator').forEach(ind => {
          ind.classList.add('completed');
          ind.classList.remove('active');
        });
      }
    });
  });

  btnPrev.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateCheckoutView();
      }
    });
  });

  function updateCheckoutView() {
    // Hide all panels
    document.querySelectorAll('.checkout-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    // Show active panel
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Update Step Indicators
    document.querySelectorAll('.step-indicator').forEach(ind => {
      const step = parseInt(ind.getAttribute('data-step'));
      if (step < currentStep) {
        ind.classList.add('completed');
        ind.classList.remove('active');
      } else if (step === currentStep) {
        ind.classList.add('active');
        ind.classList.remove('completed');
      } else {
        ind.classList.remove('completed');
        ind.classList.remove('active');
      }
    });

    // Update Sidebar Button Text
    const sidebarBtn = document.getElementById('sidebar-main-btn');
    if (sidebarBtn) {
      if (currentStep === 1) sidebarBtn.textContent = 'Continue to Shipping';
      if (currentStep === 2) sidebarBtn.textContent = 'Continue to Payment';
      if (currentStep === 3) sidebarBtn.textContent = 'Place Order';
      if (currentStep === 4) sidebarBtn.textContent = 'Track Order'; // Usually hidden
    }
  }

  // Radio Card Selector
  const radioCards = document.querySelectorAll('.radio-card');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.parentElement;
      parent.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Quantity Control & Removal Setup
  window.removeItem = function (element) {
    const item = element.closest('.cart-item');
    if (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(-10px)';
      item.style.transition = 'all 0.3s ease';
      setTimeout(() => item.remove(), 300);
      showToast('Item removed from cart', 'warning');
    }
  }
});
