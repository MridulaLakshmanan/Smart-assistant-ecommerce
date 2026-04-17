/**
 * SmartCart AI - Search & Filter Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnFilterToggle = document.getElementById('mobile-filter-btn');
  const filterSidebar = document.getElementById('filter-sidebar');
  const closeFilterBtn = document.getElementById('close-filter-btn');

  // Mobile Filter Sidebar Toggle
  if (btnFilterToggle && filterSidebar) {
    btnFilterToggle.addEventListener('click', () => {
      filterSidebar.classList.add('active');
    });
  }

  if (closeFilterBtn && filterSidebar) {
    closeFilterBtn.addEventListener('click', () => {
      filterSidebar.classList.remove('active');
    });
  }

  // Wishlist Toggle Logic
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // prevent navigation

      const svg = btn.querySelector('svg');
      const isFilled = svg.getAttribute('fill') === 'currentColor';

      if (isFilled) {
        svg.setAttribute('fill', 'none');
        btn.style.color = 'var(--color-text-muted)';
        if (typeof showToast === 'function') {
          showToast('Removed from wishlist', 'warning');
        }
      } else {
        svg.setAttribute('fill', 'currentColor');
        btn.style.color = 'var(--color-danger)';
        if (typeof showToast === 'function') {
          showToast('Added to wishlist!', 'success');
        }
      }
    });
  });

  // Filter group collapse/expand
  const filterTitles = document.querySelectorAll('.filter-group-title');
  filterTitles.forEach(title => {
    title.addEventListener('click', () => {
      const parent = title.parentElement;
      const list = parent.querySelector('.filter-list');
      const icon = title.querySelector('svg');

      if (list) {
        list.classList.toggle('hidden');
        if (list.classList.contains('hidden')) {
          icon.style.transform = 'rotate(-90deg)';
        } else {
          icon.style.transform = 'rotate(0deg)';
        }
      }
    });
  });
});
