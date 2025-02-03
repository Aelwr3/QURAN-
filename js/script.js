const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

// دالة البحث عن الآيات
async function searchVerses() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('الرجاء إدخال نص للبحث');
        return;
    }

    showLoading();
    resultsDiv.innerHTML = '';

    try {
        const response = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=ar`);
        const data = await response.json();

        if (data.search.results.length === 0) {
            resultsDiv.innerHTML = '<p class="no-results">😞 لم يتم العثور على نتائج.</p>';
            return;
        }

        data.search.results.forEach(result => {
            const verse = document.createElement('div');
            verse.className = 'verse-card';
            verse.innerHTML = `
                <h3>سورة ${result.verse_key.split(':')[0]} (الآية ${result.verse_key.split(':')[1]})</h3>
                <p>${result.text}</p>
            `;
            resultsDiv.appendChild(verse);
        });

    } catch (error) {
        resultsDiv.innerHTML = '<p class="error">⚠️ حدث خطأ في الاتصال بالخادم.</p>';
    } finally {
        hideLoading();
    }
}

// إظهار وإخفاء التحميل
function showLoading() {
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

// تفعيل البحث عند الضغط على Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchVerses();
});
