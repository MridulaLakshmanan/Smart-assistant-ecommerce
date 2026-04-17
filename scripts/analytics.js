/**
 * SmartCart AI - Analytics Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Animate mock bar chart heights on load
  const bars = document.querySelectorAll('.bar');

  // Set random realistic heights
  const heights = [35, 60, 45, 80, 50, 90, 65];

  bars.forEach((bar, index) => {
    // start at 0
    bar.style.height = '0%';

    // animate to target
    setTimeout(() => {
      bar.style.height = heights[index] + '%';

      // Add tooltip-like title
      bar.title = `${heights[index] * 12} Searches`;
    }, 300);
  });
});
