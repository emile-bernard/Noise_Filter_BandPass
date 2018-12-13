let noise;
let fft;
let filter;
let filterFreq;
let filterWidth;
let label = '';
let mouseControlledSpectrumCanvas;

function setup() {
    mouseControlledSpectrumCanvas = createCanvas(1010, 556);

    filter = new p5.BandPass();
    noise = new p5.Noise();

    noise.disconnect(); // Disconnect soundfile from master output...
    filter.process(noise); // ...and connect to filter so we'll only hear BandPass.
    noise.start();

    fft = new p5.FFT();
}

function draw() {
    noFill();
    background(30);

    // Map mouseX to a bandpass freq from the FFT spectrum range: 10Hz - 22050Hz
    filterFreq = map (mouseX, 0, width, 10, 22050);
    // Map mouseY to resonance/width
    filterWidth = map(mouseY, 0, height, 0, 90);
    // set filter parameters
    filter.set(filterFreq, filterWidth);

    //Test Filter Frequency
    if((0 <= filterFreq) && (filterFreq < 5512.5)) {
        fill('#00287c');
    } else if ((5512.5 <= filterFreq) && (filterFreq < 11025)) {
        fill('#0071dd');
    }
    else if ((11025 <= filterFreq) && (filterFreq < 16537.5)) {
        fill('#00b8dd');
    }
    else {
        fill('#52fff0');
    }

    drawSpectrum();
    drawLabel(filterFreq, filterWidth);
}

function drawSpectrum() {
    // Draw every value in the FFT spectrum analysis where
    // x = lowest (10Hz) to highest (22050Hz) frequencies,
    // h = energy / amplitude at that frequency
    let spectrum = fft.analyze();
    noStroke();
    for (let i = 0; i< spectrum.length; i++){
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width/spectrum.length, h);
    }
}

function drawLabel(filterFreq, filterWidth) {
    //Label background
    fill('#000000');
    rect(0, height-60, width-2, height) ;

    //Label text
    fill('#ffffff');
    textSize(28);
    text(label, 10, height - 20);
    let roundedFrequency = Math.round(filterFreq * 100) / 100;
    let roundedWidth = Math.round(filterWidth * 100) / 100;

    let freqLabel = 'Filter Frequency: ' + roundedFrequency + ' Hz  ';
    let widthLabel = 'Filter Width: ' + roundedWidth + ' resonance/width';
    label = freqLabel + widthLabel;
}
