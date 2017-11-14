let stories = [...document.querySelectorAll('.top-story')].map(story => {
    let title = story.querySelector('.top-story__content').innerText.trim();
    let link = story.href;
    let image = story.querySelector('.top-story__image').dataset.imageRecipe.replace('$recipe', '944x531');
    let category = story.querySelector('.top-story__attr').innerText;

    return { title, link, image, category };
})

function init() {
    console.log('starting...')

    let i = 0;
    let wrapper = document.createElement('div');
    wrapper.id = 'bbbcwrapper';
    document.body.append(wrapper);

    const recognition = new webkitSpeechRecognition;
    recognition.lang = "en-GB";

    recognition.addEventListener('result', (e) => {
        let result = e.results[0][0].transcript;

        console.log(result);

        if (matches(result, ['morning'])) {
            window.speechSynthesis.cancel();
            render(stories[0]);
            let utterance = new SpeechSynthesisUtterance("Hello Bristol!");
            window.speechSynthesis.speak(utterance);
            return;
        }

        if (matches(result, ['bye'])) {
            window.speechSynthesis.cancel();
            return wrapper.innerHTML = '';
        }

        if (matches(result, ['next'])) {
            i = (i + 1) % stories.length;
            render(stories[i]);
            return;
        }

        if (matches(result, ['previous', 'back', 'bag', 'Meg'])) {
            i--;
            if (i < 0) i = i % stories.length + stories.length;
            render(stories[i]);
            return;
        }

        if (matches(result, ['stop'])) {
            document.querySelector('.js-subtitles').innerText = '';

            window.speechSynthesis.cancel();
            return;
        }

        // if (matches(result, ['pause', 'Paul'])) {
        //     $('.js-subtitles').marquee({ speed: 0 })

        //     window.speechSynthesis.pause();
        //     return;
        // }

        // if (matches(result, ['resume'])) {
        //     $('.js-subtitles').marquee({ speed: 250 })

        //     window.speechSynthesis.resume();
        //     return;
        // }

        if (matches(result, ['read', 'Reed', 'reeds', 'weed'])) {
            window.speechSynthesis.cancel();

            parse(stories[i].link)
                .then(text => {
                    document.querySelector('.js-subtitles').innerText = text;
                    $('.js-subtitles').marquee({ speed: 200 });

                    let utterance = new SpeechSynthesisUtterance(text);
                    window.speechSynthesis.speak(utterance);
                })
            return;
        }
    });

    recognition.addEventListener('end', recognition.start);
    recognition.start();
}

function parse(url) {
    return fetch('https://bbc.dev/index.php?query='+btoa(url))
        .then(r => r.text())
}

function render(story) {
    let wrapper = document.querySelector('#bbbcwrapper');

    wrapper.innerHTML = `<div id="bbbc">
        <div class="left">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUVDNzU0RjNDMTZGMTFFN0E4NjRFOUExRkI0OERGQkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUVDNzU0RjRDMTZGMTFFN0E4NjRFOUExRkI0OERGQkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRUM3NTRGMUMxNkYxMUU3QTg2NEU5QTFGQjQ4REZCRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxRUM3NTRGMkMxNkYxMUU3QTg2NEU5QTFGQjQ4REZCRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmC9fUUAAA2ySURBVHja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" alt="" />
        </div>
        <div class="wrapper">
            <h1>${story.title}</h1>
            <img src="${story.image}">
            <p class="js-subtitles"></p>
        </div>
        <div class="right">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUVDNzU0RUZDMTZGMTFFN0E4NjRFOUExRkI0OERGQkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUVDNzU0RjBDMTZGMTFFN0E4NjRFOUExRkI0OERGQkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRUM3NTRFREMxNkYxMUU3QTg2NEU5QTFGQjQ4REZCRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxRUM3NTRFRUMxNkYxMUU3QTg2NEU5QTFGQjQ4REZCRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuukXXIAAAy8SURBVHja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" alt="" />
        </div>
    </div>`;
}

function matches(result, words) {
    words = words.map(w => w.toLowerCase());

    for (let i = 0; i < words.length; i++) {
        if (result.toLowerCase().includes(words[i])) {
            return true;
        }
    }

    return false;
}

window.onbeforeunload = function(e) {
    window.speechSynthesis.cancel();
};

setTimeout(function () {
    init()
}, 500);
