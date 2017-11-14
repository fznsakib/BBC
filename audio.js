
// appends an audio element to playback and download recording
function createAudioElement(blobUrl) {
    const downloadEl = document.createElement('a');
    downloadEl.style = 'display: block';
    downloadEl.innerHTML = 'download';
    downloadEl.download = 'audio.webm';
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/webm';
    audioEl.appendChild(sourceEl);
    document.body.appendChild(audioEl);
    document.body.appendChild(downloadEl);
}

// request permission to access audio stream
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    // store streaming data chunks in array
    const chunks = [];
    // create media recorder instance to initialize recording
    const recorder = new MediaRecorder(stream);
    // function to be called when data is received
    recorder.ondataavailable = e => {
      // add stream data to chunks
      chunks.push(e.data);
      // if recorder is 'inactive' then recording has finished
      if (recorder.state == 'inactive') {
          const blob = new Blob(chunks, { type: 'audio/webm' });

        var formData = new FormData();
        formData.append('query', blob);

        function xhr(url, data, callback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    callback(request.responseText);
                }
            };
            request.open('POST', url);
            request.send(data);
        }

         xhr('https://bbc.dev/index.php', formData, function (fName) {
            console.log(fName)
        });
      }
    };
    // start recording with 1 second time between receiving 'ondataavailable' events

    console.log('start');
    recorder.start(1000);
    // setTimeout to stop recording after 4 seconds
    setTimeout(() => {
        console.log('end');
        // this will trigger one final 'ondataavailable' event and set recorder state to 'inactive'
        recorder.stop();
    }, 4000);
  }).catch(console.error);
