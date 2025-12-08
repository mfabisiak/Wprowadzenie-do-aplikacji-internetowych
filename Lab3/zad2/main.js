document.getElementById('generateBtn').addEventListener('click', generatePassword);

function generatePassword() {
    const minLen = parseInt(document.getElementById('minLength').value);
    const maxLen = parseInt(document.getElementById('maxLength').value);
    const useUpper = document.getElementById('uppercase').checked;
    const useSpecial = document.getElementById('specialChars').checked;

    if (minLen > maxLen) {
        alert('Minimalna długość nie może być większa niż maksymalna.');
        return;
    }

    const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase;
    if (useUpper) chars += uppercase;
    if (useSpecial) chars += special;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    alert('Wygenerowane hasło: ' + password);
}
