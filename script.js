// Elementos del DOM
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const inputCounter = document.getElementById('input-counter');
const outputCounter = document.getElementById('output-counter');
const statusBadge = document.getElementById('status-badge');

const outputEmpty = document.getElementById('output-empty');
const outputContent = document.getElementById('output-content');

const methodSelect = document.getElementById('encryption-method');
const methodDescription = document.getElementById('method-description');
const optCaesar = document.getElementById('opt-caesar');
const optKey = document.getElementById('opt-key');
const caesarShift = document.getElementById('caesar-shift');
const secretKey = document.getElementById('secret-key');

const btnEncrypt = document.getElementById('btn-encrypt');
const btnDecrypt = document.getElementById('btn-decrypt');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const btnTransfer = document.getElementById('btn-transfer');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

let toastTimeout = null;

// Descripciones de cada método
const methodDescriptions = {
  vowels: 'Reglas: "e" ➔ "enter", "i" ➔ "imes", "a" ➔ "ai", "o" ➔ "ober", "u" ➔ "ufat".',
  caesar: 'Desplaza cada letra del alfabeto tantas posiciones como indiques.',
  key: 'Cifrado polialfabético usando una palabra clave secreta compartida.',
  base64: 'Codificación estándar de datos a cadena ASCII legible compatible con UTF-8.'
};

// ----------------------------------------------------
// Algoritmos de Cifrado y Descifrado
// ----------------------------------------------------

// 1. Sustitución de Vocales (Estilo Alura)
const vowelRules = [
  { raw: 'e', code: 'enter' },
  { raw: 'i', code: 'imes' },
  { raw: 'a', code: 'ai' },
  { raw: 'o', code: 'ober' },
  { raw: 'u', code: 'ufat' },
  { raw: 'E', code: 'Enter' },
  { raw: 'I', code: 'Imes' },
  { raw: 'A', code: 'Ai' },
  { raw: 'O', code: 'Ober' },
  { raw: 'U', code: 'Ufat' }
];

function encryptVowels(text) {
  let result = '';
  for (let char of text) {
    const found = vowelRules.find(r => r.raw === char);
    result += found ? found.code : char;
  }
  return result;
}

function decryptVowels(text) {
  let result = text;
  // Ordenar de mayor a menor longitud para evitar colisiones accidentales
  const sortedRules = [...vowelRules].sort((a, b) => b.code.length - a.code.length);
  for (let rule of sortedRules) {
    result = result.split(rule.code).join(rule.raw);
  }
  return result;
}

// 2. Cifrado César
function caesarCipher(text, shift, decrypt = false) {
  let s = parseInt(shift, 10);
  if (isNaN(s)) s = 3;
  if (decrypt) s = (26 - (s % 26)) % 26;

  return text.replace(/[a-zA-Z]/g, (char) => {
    const isUpper = char >= 'A' && char <= 'Z';
    const base = isUpper ? 65 : 97;
    const code = char.charCodeAt(0) - base;
    const shifted = (code + s) % 26;
    return String.fromCharCode(base + shifted);
  });
}

// 3. Cifrado con Clave Secreta (Vigenère)
function vigenereCipher(text, key, decrypt = false) {
  const cleanKey = (key || 'clave').replace(/[^a-zA-Z]/g, '');
  if (!cleanKey) {
    throw new Error('La clave debe contener al menos una letra (A-Z).');
  }

  let keyIndex = 0;
  return text.replace(/[a-zA-Z]/g, (char) => {
    const isUpper = char >= 'A' && char <= 'Z';
    const base = isUpper ? 65 : 97;
    const charCode = char.charCodeAt(0) - base;

    const keyChar = cleanKey[keyIndex % cleanKey.length].toUpperCase();
    const keyShift = keyChar.charCodeAt(0) - 65;
    keyIndex++;

    let newCode;
    if (decrypt) {
      newCode = (charCode - keyShift + 26) % 26;
    } else {
      newCode = (charCode + keyShift) % 26;
    }

    return String.fromCharCode(base + newCode);
  });
}

// 4. Base64 compatible con UTF-8
function utf8ToBase64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

function base64ToUtf8(str) {
  try {
    const raw = atob(str.trim());
    return decodeURIComponent(
      Array.prototype.map.call(raw, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
  } catch (e) {
    throw new Error('El texto no es un Base64 válido para decodificar.');
  }
}

// ----------------------------------------------------
// Controlador Principal de Transformación
// ----------------------------------------------------
function processText(mode) {
  const text = inputText.value;

  if (!text.trim()) {
    showToast('⚠️ Por favor ingresa algún texto primero.');
    inputText.focus();
    return;
  }

  const method = methodSelect.value;
  let result = '';

  try {
    if (mode === 'encrypt') {
      switch (method) {
        case 'vowels':
          result = encryptVowels(text);
          break;
        case 'caesar':
          result = caesarCipher(text, caesarShift.value, false);
          break;
        case 'key':
          result = vigenereCipher(text, secretKey.value, false);
          break;
        case 'base64':
          result = utf8ToBase64(text);
          break;
      }
      setResult(result, 'Texto encriptado');
      showToast('🔒 ¡Texto encriptado con éxito!');
    } else {
      switch (method) {
        case 'vowels':
          result = decryptVowels(text);
          break;
        case 'caesar':
          result = caesarCipher(text, caesarShift.value, true);
          break;
        case 'key':
          result = vigenereCipher(text, secretKey.value, true);
          break;
        case 'base64':
          result = base64ToUtf8(text);
          break;
      }
      setResult(result, 'Texto desencriptado');
      showToast('🔓 ¡Texto desencriptado con éxito!');
    }
  } catch (error) {
    showToast(`⚠️ ${error.message}`);
  }
}

function setResult(text, statusLabel) {
  outputText.value = text;
  outputCounter.textContent = text.length;

  outputEmpty.style.display = 'none';
  outputContent.style.display = 'flex';

  statusBadge.textContent = statusLabel;
  statusBadge.classList.add('active');
}

function clearAll() {
  inputText.value = '';
  outputText.value = '';
  inputCounter.textContent = '0';
  outputCounter.textContent = '0';

  outputContent.style.display = 'none';
  outputEmpty.style.display = 'flex';

  statusBadge.textContent = 'Esperando texto';
  statusBadge.classList.remove('active');
  inputText.focus();
}

function showToast(message) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ----------------------------------------------------
// Event Listeners
// ----------------------------------------------------

// Contador en tiempo real para entrada
inputText.addEventListener('input', () => {
  inputCounter.textContent = inputText.value.length;
});

// Cambio de método de encriptación
methodSelect.addEventListener('change', () => {
  const method = methodSelect.value;
  methodDescription.textContent = methodDescriptions[method] || '';

  optCaesar.style.display = method === 'caesar' ? 'flex' : 'none';
  optKey.style.display = method === 'key' ? 'flex' : 'none';
});

// Botones de acción
btnEncrypt.addEventListener('click', () => processText('encrypt'));
btnDecrypt.addEventListener('click', () => processText('decrypt'));
btnClear.addEventListener('click', clearAll);

// Copiar al portapapeles
btnCopy.addEventListener('click', async () => {
  if (!outputText.value) return;

  try {
    await navigator.clipboard.writeText(outputText.value);
    showToast('📋 ¡Texto copiado al portapapeles!');
  } catch (err) {
    // Fallback para navegadores antiguos
    outputText.select();
    document.execCommand('copy');
    showToast('📋 ¡Texto copiado al portapapeles!');
  }
});

// Transferir resultado a la entrada (viceversa)
btnTransfer.addEventListener('click', () => {
  if (!outputText.value) return;
  inputText.value = outputText.value;
  inputCounter.textContent = inputText.value.length;
  showToast('🔄 Texto transferido a la entrada');
  inputText.focus();
});

// ----------------------------------------------------
// Gestión de Tema Claro / Oscuro
// ----------------------------------------------------
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeLabel) themeLabel.textContent = 'Modo Oscuro';
    if (themeToggle) themeToggle.setAttribute('title', 'Cambiar a modo oscuro');
    localStorage.setItem('cryptotext-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeLabel) themeLabel.textContent = 'Modo Claro';
    if (themeToggle) themeToggle.setAttribute('title', 'Cambiar a modo claro');
    localStorage.setItem('cryptotext-theme', 'dark');
  }
}

function toggleTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
  showToast(isLight ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado');
}

function initTheme() {
  const savedTheme = localStorage.getItem('cryptotext-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Si no hay preferencia guardada, verificar preferencia del sistema (por defecto oscuro)
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// Inicializar tema al cargar la página
initTheme();

