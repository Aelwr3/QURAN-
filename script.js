const searchInput = document.getElementById('searchInput');
const micButton = document.getElementById('micButton');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loader = document.getElementById('loader');

// دالة البحث المحسنة
async function searchVerses() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('الرجاء إدخال نص للبحث');
        return;
    }

    showLoading();
    resultsDiv.innerHTML = '';

    try {
        // استخدام CORS Proxy
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `${proxy}https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=ar`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.search?.results?.length > 0) {
            data.search.results.forEach(verse => {
                const verseElement = document.createElement('div');
                verseElement.className = 'verse-card';
                verseElement.innerHTML = `
                    <h3>سورة ${verse.verse_key.split(':')[0]} - الآية ${verse.verse_key.split(':')[1]}</h3>
                    <p>${verse.text}</p>
                `;
                resultsDiv.appendChild(verseElement);
            });
        } else {
            resultsDiv.innerHTML = '<div class="verse-card">لم يتم العثور على نتائج</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<div class="verse-card">حدث خطأ في الاتصال</div>';
    } finally {
        hideLoading();
    }
}

// التعرف على الصوت
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        searchVerses();
    };
}

// الأحداث
micButton.addEventListener('click', () => {
    if (recognition) recognition.start();
});

searchBtn.addEventListener('click', searchVerses);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchVerses();
});

function showLoading() {
    loader.style.display = 'block';
}

function hideLoading() {
    loader.style.display = 'none';
}
