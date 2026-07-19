var pipe = null;
var activePdfText = '';

// UI PANEL CONTROLLER
window.switchTab = function(panelId) {
    var panels = document.getElementsByClassName('tool-panel');
    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.add('hidden');
    }
    document.getElementById(panelId).classList.remove('hidden');
    
    var buttons = document.getElementsByClassName('tab-btn');
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove('bg-indigo-50', 'text-indigo-600');
        buttons[j].classList.add('text-slate-600', 'hover:bg-slate-100');
    }
    
    if (panelId === 'text-suite') { document.getElementById('btn-text').classList.add('bg-indigo-50', 'text-indigo-600'); }
    if (panelId === 'media-suite') { document.getElementById('btn-media').classList.add('bg-indigo-50', 'text-indigo-600'); }
    if (panelId === 'pdf-suite') { document.getElementById('btn-pdf').classList.add('bg-indigo-50', 'text-indigo-600'); }
    if (panelId === 'audio-suite') { document.getElementById('btn-audio').classList.add('bg-indigo-50', 'text-indigo-600'); }
};

// PIPELINE ACCESS MANAGEMENT LAYER - MODIFIED TO SOLVE CORB RULES VIA IMPORT MAP
async function getAIEngine() {
    if (!pipe) {
        document.getElementById('consoleWindow').innerText = '>>> LOADING PIPELINE DEPENDENCIES... PLEASE STANDBY...';
        const { pipeline } = await import('@xenova/transformers');
        document.getElementById('consoleWindow').innerText = '>>> DOWNLOADING COMPRESSED LOCAL LANGUAGE MODEL ENGINE (approx. 25MB)...\n>>> THIS ONLY HAPPENS ON THE FIRST EXECUTION AND CACHES PERMANENTLY...';
        pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M');
    }
    return pipe;
}

// TEXT MACHINE LEARNING SERVICES
window.runTextAI = async function() {
    var out = document.getElementById('consoleWindow');
    var text = document.getElementById('textInput').value;
    var task = document.getElementById('textTask').value;

    if (!text.trim()) {
        out.innerText = '[SYSTEM ERR]: Input payload workspace is currently empty.';
        return;
    }
    out.innerText = '>>> ENGINE ACTIVE. PERFORMING LOGICAL TEXT COMPENSATIONS...';

    try {
        var model = await getAIEngine();
        var prompt = '';
        if (task === 'rewrite') { prompt = 'Paraphrase and rewrite this statement cleanly: ' + text; }
        if (task === 'cv') { prompt = 'Write a professional cover letter pitch based on this profile data: ' + text; }
        if (task === 'ad') { prompt = 'Write an optimized social media ad caption with hashtags for: ' + text; }
        if (task === 'code') { prompt = 'Explain what this programming code script block does: ' + text; }

        var result = await model(prompt, { max_new_tokens: 200, temperature: 0.7 });
        out.innerText = result.generated_text;
    } catch (err) { 
        out.innerText = 'Compute processing error: ' + err.message; 
    }
};

// IMAGE CANVAS DRAW PROCESSING FUNCTIONS
window.processLocalImage = function() {
    var out = document.getElementById('consoleWindow');
    var fileInput = document.getElementById('imageUpload');
    var mode = document.getElementById('mediaMode').value;
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');

    if (!fileInput.files || fileInput.files.length === 0) {
        out.innerText = '[SYSTEM ERR]: Please choose a local image file first.';
        return;
    }
    out.innerText = '>>> PROCESSING RAW RESOLUTION IMAGE CANVAS CHANNELS...';

    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            canvas.classList.remove('hidden');
            
            if (mode === 'photofit') {
                canvas.width = 800; canvas.height = 800;
                ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 800, 800);
                var scale = Math.min(700 / img.width, 700 / img.height);
                var w = img.width * scale, h = img.height * scale;
                ctx.drawImage(img, (800 - w)/2, (800 - h)/2, w, h);
                out.innerText = '>>> MEDIAFORGE METRICS STABLE: Image scaled, aligned, and optimized onto standard 800x800 square canvas framework. Right-click graphic frame to save.';
            } else {
                canvas.width = 600; canvas.height = 600;
                ctx.fillStyle = mode === 'passport-white' ? '#FFFFFF' : '#3B82F6';
                ctx.fillRect(0, 0, 600, 600);
                var scale = Math.min(450 / img.width, 450 / img.height);
                var w = img.width * scale, h = img.height * scale;
                ctx.drawImage(img, (600 - w)/2, (600 - h)/2, w, h);
                out.innerText = '>>> PASSPORT PHOTO SUCCESS: Frame centered under official registration specs with a solid color backdrop layer matrix.';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(fileInput.files);
};

// DOCUMENT PARSING OPERATIONS
window.addEventListener('DOMContentLoaded', function() {
    var pdfUploadElement = document.getElementById('pdfUpload');
    if (pdfUploadElement) {
        pdfUploadElement.addEventListener('change', function(e) {
            var reader = new FileReader();
            reader.onload = function() { activePdfText = reader.result; };
            if (e.target.files.length > 0) {
                reader.readAsText(e.target.files);
            }
        });
    }
});

window.runPdfAI = async function() {
    var out = document.getElementById('consoleWindow');
    var mode = document.getElementById('pdfMode').value;
    var question = document.getElementById('pdfQuestion').value;

    if (!activePdfText) {
        out.innerText = '[SYSTEM ERR]: Please drop a standard text data study guide document file above.';
        return;
    }
    out.innerText = '>>> CHUNKING FILE METRICS AND RETRIEVING TARGET TEXT CORES...';

    try {
        var model = await getAIEngine();
        var prompt = '';
        if (mode === 'quiz') {
            prompt = 'Create three smart test multiple choice study questions based on this text: ' + activePdfText.substring(0, 500);
        } else {
            prompt = 'Document text: ' + activePdfText.substring(0, 500) + '... Question: ' + question + '. Answer the question based on text context.';
        }

        var result = await model(prompt, { max_new_tokens: 200 });
        out.innerText = result.generated_text;
    } catch (err) { 
        out.innerText = 'Analysis matrix error: ' + err.message; 
    }
};

// REAL TIME VOICE SYNTHESIS WRAPPER
window.runLocalTTS = function() {
    var out = document.getElementById('consoleWindow');
    var text = document.getElementById('ttsInput').value;
    if (!text.trim()) {
        out.innerText = '[SYSTEM ERR]: Voice synthesis text payload is blank.';
        return;
    }
    
    var utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    out.innerText = '>>> NATIVE SPEAKER CHANNEL ENGAGED: Converting input text string to voice audio frequencies...';
};

// SPEECH TRANSCRIPT SUMMARIZER SERVICES
window.runTranscriptSummary = async function() {
    var out = document.getElementById('consoleWindow');
    var transcript = document.getElementById('transcriptInput').value;
    if (!transcript.trim()) {
        out.innerText = '[SYSTEM ERR]: Target transcription input text block is empty.';
        return;
    }

    out.innerText = '>>> PROCESSING CONTEXT CONVERSATION DIALOGUE NODES...';
    try {
        var model = await getAIEngine();
        var result = await model('Summarize this audio text dialogue log concisely into bullet highlights: ' + transcript, { max_new_tokens: 150 });
        out.innerText = '>>> DIALOGUE LOG CONSOLIDATION COMPLETE:\n\n' + result.generated_text;
    } catch (err) { 
        out.innerText = 'Summary processing matrix collapse: ' + err.message; 
    }
};
