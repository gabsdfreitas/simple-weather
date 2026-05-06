// src/utils/bounce.ts
export function bounce(node: HTMLElement) {
  function handleClick() {
    // Remove class if it's already running to allow rapid re-clicking
    node.classList.remove('is-animating');
    
    // Force a browser reflow so the class removal registers
    void node.offsetWidth; 
    
    // Trigger animation
    node.classList.add('is-animating');
    
    // Remove class exactly when the 0.6s CSS animation completes
    setTimeout(() => {
      node.classList.remove('is-animating');
    }, 600);
  }

  node.addEventListener('click', handleClick);

  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    }
  };
}