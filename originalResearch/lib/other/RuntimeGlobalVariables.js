var startTime; // Start time of Runtime Clock

var endTime; // End time of Runtime Clock

var time; // Total time elapsed (startTime - ednTime)

var gif = new GIF({
  workers: 3,
  quality: 1
});

gif.setOption("debug", true);

function downloadBlob(name, blob) {
  console.log("WE IN");
  var link = document.createElement('a');
  link.download = name;
  link.href = URL.createObjectURL(blob);
  // Firefox needs the element to be live for some reason.
  document.body.appendChild(link);
  link.click();
  setTimeout(function() {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  });
}

gif.on('finished', function(blob) {
  downloadBlob('download.gif', blob);
});

// gif.setOption("width", 600);
// gif.setOption("height", 600);
