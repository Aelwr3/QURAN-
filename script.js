// العناصر الرئيسية
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const micButton = document.getElementById('micButton');
const resultsDiv = document.getElementById('results');
const loader = document.getElementById('loader');

// تهيئة التعرف على الصوت
let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        searchVerses();
    };

    recognition.onerror = (event) => {
        console.error('حدث خطأ:', event.error);
        showError('تعذر التعرف على الصوت!');
    };
}

// الأحداث
searchBtn.addEventListener('click', searchVerses);
micButton.addEventListener('click', toggleRecording);
searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && searchVerses());

async function searchVerses() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('الرجاء إدخال نص للبحث');
        return;
    }

    showLoading();
    clearResults();

    try {
        const response = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=ar`);
        const data = await response.json();

        if (!data.search?.results?.length) {
            showError('لم يتم العثور على نتائج');
            return;
        }

        displayResults(data.search.results);
    } catch (error) {
        showError('حدث خطأ في الاتصال');
    } finally {
        hideLoading();
    }
}

function toggleRecording() {
    if (!recognition) {
        showError('المتصفح غير مدعوم');
        return;
    }

    isRecording = !isRecording;
    micButton.style.background = isRecording ? '#c0392b' : '#e74c3c';
    
    isRecording ? recognition.start() : recognition.stop();
}

function displayResults(verses) {
    resultsDiv.innerHTML = verses.map(verse => `
        <div class="verse-card">
            <div class="verse-header">
                <span class="surah-name">سورة ${verse.verse_key.split(':')[0]}</span>
                <span class="verse-number">الآية ${verse.verse_key.split(':')[1]}</span>
            </div>
            <p class="verse-text">${verse.text}</p>
        </div>
    `).join('');
}

function showLoading() {
    loader.classList.add('active');
}

function hideLoading() {
    loader.classList.remove('active');
}

function clearResults() {
    resultsDiv.innerHTML = '';
}

function showError(message) {
    resultsDiv.innerHTML = `
        <div class="verse-card" style="color: #e74c3c; text-align: center">
            ${message}
        </div>
    `;
}
