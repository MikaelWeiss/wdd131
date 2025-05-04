const darkModeToggle = document.getElementById('dark-mode-toggle');

function changeTheme() {
  if (darkModeToggle.value === 'dark') {
    document.body.classList.add('dark');
    document.querySelector('img').src = 'byui-logo_white.png';
  } else {
    document.body.classList.remove('dark');
    document.querySelector('img').src = 'byui-logo.webp';
  }
}

darkModeToggle.addEventListener('change', changeTheme);
