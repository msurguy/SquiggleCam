<template>
  <div id="app">
    <div class="wrapper">
      <div class="container">
        <aside id="panel">
          <div class="header">
            <!--<button class="btn btn-primary btn-circle"><i class="fa fa-angle-left"></i></button>-->
            <h2>SquiggleCam</h2>
			<locale-chooser @selected="onLocaleSelected"></locale-chooser>
          </div>

          <div class="accordion">
            <div class="option">
            <input type="checkbox" id="toggle2" class="toggle" />
            <label class="title" for="toggle2">{{$t('PaperSettings')}}</label>

            <div class="content">
              <div class="paper-chooser">
                <div class="button-group stretch">
                  <label>{{$t('color')}}</label>
                  <button v-bind:class="{ active: settings.black === false }" class="btn" @click="settings.black = false">{{$t('white')}}</button>
                  <button class="btn" v-bind:class="{ active: settings.black === true }" @click="settings.black = true">{{$t('black')}}</button>
                </div>
              </div>

              <div class="slider">
                  <span class="metric">
                    {{widthInCM}}cm
                  </span>
                  <span class="label">
                    {{$t('width')}}
                  </span>
                <input type="range" min="200" max="500" v-model="settings.width">
                <div class="output">{{ settings.width }}</div>
              </div>

              <div class="slider">
                  <span class="metric">
                    {{widthInCM}}cm
                  </span>
                  <span class="label">
                    {{$t('height')}}
                  </span>
                <input type="range" min="200" max="500" v-model="settings.height">
                <div class="output">{{ settings.height }}</div>
              </div>
            </div>
          </div>

            <div class="option">
              <input type="checkbox" checked id="toggle1" class="toggle" />
              <label class="title" for="toggle1">
                {{$t('ImageSelection')}}
              </label>
              <div class="content">
                <div class="image-inputs">
                  <image-chooser @selected="onInputSelected"></image-chooser>

                  <div class="image-upload" v-if="this.inputType === 'upload'">
                    <croppa
                      v-model="cropper"
                      :width="settings.width/2"
                      :height="settings.height/2"
                      :preventWhiteSpace="false"
                      :quality="2"
                      placeholder-color="#000"
                      :remove-button-size="22"
                      :placeholder-font-size="24"
                      remove-button-color="black"
                      canvas-color="#FFFFFF"
                    ></croppa>
                    <button class="btn btn-primary btn-block" style="display:block;" @click="uploadCroppedImage">{{$t('UseImage')}}</button>
                  </div>

                  <div class="image-webcam" v-if="this.inputType === 'webcam'">
                    <div class="video-controls">
                      <select v-model="webcam.camera">
                        <option>{{$t('SelectDevice')}}</option>
                        <option v-for="device in webcam.devices"
                                :key="device.deviceId"
                                :value="device.deviceId">{{ device.label }}</option>
                      </select>
                      <button v-if="webcam.streaming"
                              type="button"
                              class="btn btn-sm"
                              @click="onStop"><svg width="12" height="12"><rect width="12" height="12" style="fill:rgb(255,0,0)" />
                      </svg></button>
                      <button type="button"
                              class="btn btn-sm"
                              v-if="!webcam.streaming"
                              @click="onStart">{{$t('Start')}}</button>
                    </div>

                    <webcam ref="webcam"
                            :device-id="webcam.deviceId"
                            :width="settings.width"
                            :height="settings.height"
                            @started="onStarted"
                            @stopped="onStopped"
                            @error="onError"
                            @cameras="onCameras"
                            @camera-change="onCameraChange" />

                    <button type="button"
                            class="btn btn-record"
                            v-if="webcam.streaming"
                            @click="onCapture">
                      <svg height="48" width="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="23" stroke="white" stroke-width="1" fill="#D41616" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>


            <div class="option">
              <input type="checkbox" id="toggle3" class="toggle" />
              <label class="title" for="toggle3">{{$t('ImageAdjustments')}}</label>
              <div class="content">
                <div class="slider">
                  <span class="label">
                    {{$t('Brightness')}}
                  </span>
                  <input type="range" min="-100" max="100" v-model="settings.brightness">
                  <div class="output">{{ settings.brightness }}</div>
                </div>

                <div class="slider">
                  <span class="label">
                    {{$t('Contrast')}}
                  </span>
                  <input type="range" min="-100" max="100"  v-model="settings.contrast">
                  <div class="output">{{ settings.contrast }}</div>
                </div>

                <div class="slider">
                  <span class="label">
                    {{$t('MinBrightness')}}
                  </span>
                  <input type="range" min="0" max="255" v-model="settings.minBrightness">
                  <div class="output">{{ settings.minBrightness }}</div>
                </div>

                <div class="slider">
                  <span class="label">
                    {{$t('MaxBrightness')}}
                  </span>
                  <input type="range" min="0" max="255" v-model="settings.maxBrightness">
                  <div class="output">{{ settings.maxBrightness }}</div>
                </div>

              </div>
            </div>

            <div class="option">
              <input type="checkbox" id="toggle4" class="toggle" />
              <label class="title" for="toggle4">{{$t('SquiggleSettings')}}</label>
              <div class="content">
			  
				<div class="button-group stretch">
				  <label>{{$t('ConnectEnds')}}</label>
				  <button v-bind:class="{ active: settings.connectEnds === false }" class="btn" @click="settings.connectEnds = false">{{$t('Disable')}}</button>
				  <button class="btn" v-bind:class="{ active: settings.connectEnds === true }" @click="settings.connectEnds = true">{{$t('Enable')}}</button>
				</div>
				
				<div class="button-group stretch">
				  <label>{{$t('Tranparent')}}</label>
				  <button v-bind:class="{ active: settings.transparent === false }" class="btn" @click="settings.transparent = false">{{$t('Disable')}}</button>
				  <button class="btn" v-bind:class="{ active: settings.transparent === true }" @click="settings.transparent = true">{{$t('Enable')}}</button>
				</div>
							  
				<div class="button-group stretch">
				  <label>{{$t('LinesOrientationH')}}</label>
				  <button class="btn" v-bind:class="{ active: settings.LinesOrientationH === true }" @click="settings.LinesOrientationH = true">{{$t('Horizontal')}}</button>
				  <button v-bind:class="{ active: settings.LinesOrientationH === false }" class="btn" @click="settings.LinesOrientationH = false">{{$t('Vertical')}}</button>
				</div>
							  
                <div class="slider">
                  <span class="label">
                    {{$t('Frequency')}}
                  </span>
                  <input type="range" min="5" max="256" v-model="settings.frequency">
                  <div class="output">{{ settings.frequency }}</div>
                </div>
                <div class="slider">
                  <span class="label">
                    {{$t('LineCount')}}
                  </span>
                  <input type="range" min="10" max="200" v-model="settings.lineCount">
                  <div class="output">{{ settings.lineCount }}</div>
                </div>
                <div class="slider">
                  <span class="label">
                    {{$t('Amplitude')}}
                  </span>
                  <input type="range" min="0.00" max="20" step="0.01" v-model="settings.amplitude">
                  <div class="output">{{ settings.amplitude }}</div>
                </div>

                <div class="slider">
                  <span class="label">
                    {{$t('Sampling')}}
                  </span>
                  <input type="range" min="0.5" max="3" step="0.1" v-model="settings.spacing">
                  <div class="output">{{ settings.spacing }}</div>
                </div>

                <div class="slider">
                  <span class="label">
                    {{$t('LineWidth')}}
                  </span>
                  <input type="range" min="1" max="10" step="1" v-model="settings.strokeWidth">
                  <div class="output">{{ settings.strokeWidth }}</div>
                </div>

				<div class="button-group stretch">
				  <label>{{$t('Algorithm')}}</label>
				  <button v-bind:class="{ active: settings.SquiggleDrawMode === false }" class="btn" @click="settings.SquiggleDrawMode = false">SquiggleCam</button>
				  <button class="btn" v-bind:class="{ active: settings.SquiggleDrawMode === true }" @click="settings.SquiggleDrawMode = true">SquiggleDraw</button>
				</div>
				
              </div>
            </div>
          </div>

          <div class="section-title">
            {{$t('Download')}}
          </div>
          <div class="actions">
            <button class="btn btn-block" @click="downloadSVG">
              SVG
            </button>
          </div>

          <div class="credits">
            <p>
              Project by <a target="_blank" href="http://twitter.com/msurguy">@msurguy</a> (<span class="fa fa-github"></span><a target="_blank" href="http://github.com/msurguy/SquiggleCam">Source</a>)
              <br>Based upon
              <a target="_blank" href="https://github.com/gwygonik/SquiggleDraw">SquiggleDraw</a>
			  <br>Modified by
			  <a target="_blank" href="https://gsyan888.blogspot.com/">gsyan</a> (<span class="fa fa-github"></span><a target="_blank" href="http://github.com/gsyan888/SquiggleCam">Source</a>)
            </p>
          </div>

        </aside>
        <main>
          <div v-if="canvasData" class="svg-container" ref="container">
            <svg-chart ref="svgResult" :black="settings.black" :lines="lines" :width="settings.width" :height="settings.height" :strokeWidth="settings.strokeWidth"></svg-chart>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import ImageChooser from './components/ImageChooser'
  import WebCam from './components/WebCam'
  import svgChart from './components/svgChart';
  import localeChooser from './components/localeChooser';

  export default {
    name: 'App',
    components: {
	  localeChooser:localeChooser,
      imageChooser: ImageChooser,
      webcam: WebCam,
      svgChart: svgChart
    },
    data() {
      return {
        cropper: {},
        dataUrl: '',
        lines: [],
        inputType: "upload",
        settings: {
          black: false,
		  transparent: false,
		  connectEnds: false,
		  LinesOrientationH: true,
		  SquiggleDrawMode: false,
		  strokeWidth: 5,
          frequency: 150,
          amplitude: 1,
          lineCount: 50,
          brightness: 0,
          contrast: 0,
          minBrightness: 0,
          maxBrightness: 255,
          spacing: 1,
          width: 500,
          height: 500
        },
        canvasData: null,
        webcam: {
          img: null,
          camera: null,
          deviceId: null,
          device: null,
          devices: [],
          streaming: false
        },
      };
    },

    watch: {
      'webcam.camera': function(id) {
        this.webcam.deviceId = id;
      },
      'webcam.devices': function() {
        // Once we have a list select the first one
        let first = this.webcam.devices[0];
        if (first) {
          this.webcam.camera = first.deviceId;
          this.webcam.deviceId = first.deviceId;
        }
      },
      'settings.frequency': function(){
        this.processImage();
      },
      'settings.spacing': function(){
        this.processImage();
      },
      'settings.lineCount': function(){
        this.processImage();
      },
      'settings.amplitude': function(){
        this.processImage();
      },
      'settings.minBrightness': function(){
        this.processImage();
      },
      'settings.maxBrightness': function(){
        this.processImage();
      },
      'settings.brightness': function(){
        this.processImage();
      },
      'settings.contrast': function(){
        this.processImage();
      },
      'settings.black': function(){
        this.processImage();
      },	  
      'settings.strokeWidth': function(){
        this.processImage();
      },	  	  
      'settings.connectEnds': function(){
        this.processImage();
      },	  
      'settings.transparent': function(){
        this.processImage();
      },	  	  	  
      'settings.LinesOrientationH': function(){
        this.processImage();
      },	  	  
      'settings.SquiggleDrawMode': function(){
        this.processImage();
      },	  
      'canvasData': function(){
        this.processImage();
      }
    },
    computed: {
      widthInCM(){
        return Math.round(10*this.settings.width / 38)/10;
      },
      heightInCM(){
        return Math.round(10*this.settings.height / 38)/10;
      }
    },
    methods: {
      downloadSVG(){
        const svgDoctype = '<?xml version="1.0" standalone="no"?>'
          + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

        // serialize our SVG XML to a string.
        const svgString = (new XMLSerializer()).serializeToString(this.$refs.svgResult.$el);
        const blob = new Blob([svgDoctype + svgString], {type: 'image/svg+xml;charset=utf-8'});

        /* This portion of script saves the file to local filesystem as a download */
        const svgUrl = URL.createObjectURL(blob);
		const settingsString = (this.settings.frequency + "-" + this.settings.lineCount + "-" + this.settings.amplitude + "-" + this.settings.spacing + "-" + this.settings.strokeWidth).replace(/\./g,"_"); //filename postfix with settings
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "squiggleCam_" + settingsString + "_" + Date.now() + ".svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      uploadCroppedImage() {		
        this.cropper.generateBlob((blob) => {
          let canvas = document.createElement("canvas");
          canvas.width = this.settings.width;
          canvas.height = this.settings.height;

          const ctx = canvas.getContext('2d');
          let img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            this.canvasData = ctx.getImageData(0, 0, this.settings.width, this.settings.height);
          };

          img.src = URL.createObjectURL(blob);
        //}, 'image/jpeg', 1)
		}, 'image/png', 1)
      },
      processImage() {
        this.$worker.run((data) => {
          // Gather all necessary data from the main thread
          let config = data.config;
// context.getImageData(0, 0, config.WIDTH, config.HEIGHT);
          const imagePixels = data.image;
          const width = parseInt(config.width);
          const height = parseInt(config.height);
          const contrast = parseInt(config.contrast);
          const brightness = parseInt(config.brightness);
          const lineCount = parseInt(config.lineCount);
          const minBrightness = parseInt(config.minBrightness);
          const maxBrightness = parseInt(config.maxBrightness);
          const spacing = parseFloat(config.spacing);
          const black = config.black;
		  
		  //added by gsyan
		  const transparent = config.transparent; 
		  const connectEnds = config.connectEnds;
		  const strokeWidth = config.strokeWidth;
		  const SquiggleDrawMode = config.SquiggleDrawMode;
		  const xsmooth = config.frequency;
		  const LinesOrientationH = config.LinesOrientationH;
		  
// Create some defaults for squiggle-point array
          let squiggleData = [];
          let r = 5;
          let a = 0;
          let b;
          let z;
		  
		  //added by gsyan 
		  let alpha;
		  let xLeft = 0;
		  let xRight;
		  let xMax;
		  let lineTotal=0;
		  let isOdd;
		  let previousLinePoints;
		  let lastX;
		  let df;
		  let deltaPhase;
          let deltaX;
		  let deltaAmpl;
		  let vertexCount;
		  let integerPart;
		  let deltaX_truncate;
          let xPerVertex;
          let amplPerVertex;		  
		  let phase = 0.0;
          let lastPhase = 0; // accumulated phase at previous vertex
		  let lastAmpl = 0; // amplitude at previous vertex		  
		  let squiggleWidth = (LinesOrientationH ? width : height);
		  let squiggleHeight = (LinesOrientationH ? height : width );
		  
          let currentLine = []; // create empty array for storing x,y coordinate pairs
          let currentVerticalPixelIndex = 0;
          let currentHorizontalPixelIndex = 0;
          let contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast)); // This was established through experiments
		  let horizontalLineSpacing = Math.floor(squiggleHeight / lineCount); // Number of pixels to advance in vertical direction

		  //added by gsyan
		  let minPhaseIncr = 10 * Math.PI* 2 / (squiggleWidth / spacing);
		  let maxPhaseIncr =  Math.PI* 2 * spacing / strokeWidth;

// Iterate line by line (top line to bottom line) in increments of horizontalLineSpacing
          //let tmpCounter = 0;
          for (let y = 0; y < squiggleHeight; y+= horizontalLineSpacing) {
			phase = 0.0;
			lastPhase = 0;
			lastAmpl = 0;
			
            a = 0;
            currentLine = [];
			
            currentVerticalPixelIndex = y*width;  // Because Image Pixel array is of length width * height,
                                                  // starting pixel for each line will be this
			//find the edge of line
			xLeft = 0;
			xRight = Math.floor((squiggleWidth-1-xLeft)/spacing)*spacing;			
			if( transparent ) {
				//find the left edge of x
				//for (let x = 0; x < width; x += spacing ) {
				for (let x = 0; x < squiggleWidth; x++ ) {
					if(LinesOrientationH) {
						currentHorizontalPixelIndex = Math.floor(x + currentVerticalPixelIndex); // Get array position of current pixel
					} else {
						currentHorizontalPixelIndex = Math.floor(y + x*width);
					}
					//alpha = imagePixels.data[4*currentHorizontalPixelIndex+3]; 
					b = imagePixels.data[4*currentHorizontalPixelIndex]+imagePixels.data[4*currentHorizontalPixelIndex+1]+imagePixels.data[4*currentHorizontalPixelIndex+2];
					if( b < 255*3 ) {
						break;
					}
					xLeft = x;
				}
				
				//find the right edge of x
				xMax = Math.floor((squiggleWidth-1-xLeft)/spacing)*spacing+xLeft;
				xRight = xMax;
				//for (let x = xMax; x>=xLeft; x -= spacing ) {
				for (let x = squiggleWidth-1; x>=xLeft; x-- ) {
					if(LinesOrientationH) {
						currentHorizontalPixelIndex = Math.floor(x + currentVerticalPixelIndex); // Get array position of current pixel
					} else {
						currentHorizontalPixelIndex = Math.floor(y + x*width);
					}
					
					//alpha = imagePixels.data[4*currentHorizontalPixelIndex+3]; 
					b = imagePixels.data[4*currentHorizontalPixelIndex]+imagePixels.data[4*currentHorizontalPixelIndex+1]+imagePixels.data[4*currentHorizontalPixelIndex+2];
					if( b < 255*3 ) {
						break;
					}
					xRight = x;
				}
			}
			
            //currentLine.push([0, y]); // Start the line
			if(xRight > xLeft) {
				isOdd = (lineTotal%2 == 0);
				if(isOdd) {
					if(lineTotal>0 && connectEnds) {
						previousLinePoints = squiggleData[squiggleData.length-1];
						currentLine.push(previousLinePoints[previousLinePoints.length-1]); //connect previous line
					}
					if(LinesOrientationH) {
						currentLine.push([xLeft, y]); // Horizontal start the line //modified by gsyan
					} else {
						currentLine.push([y, xLeft]); // Vertical start the line //modified by gsyan
					}
				} else {
					if(connectEnds) {
					   previousLinePoints = squiggleData[squiggleData.length-1];
					   currentLine.push(previousLinePoints[previousLinePoints.length-1]); //connect previous line
					}
					if(LinesOrientationH) {
						currentLine.push([xRight, y]); // Horizontal Start the line	//modified by gsyan
					} else {
						currentLine.push([y, xRight]); // Vertical Start the line	//modified by gsyan
					}
				}
				
				let isBeginDraw = true;
				
				// Loop through pixels from left to right within the current line, advancing by increments of config.SPACING
				//console.log(config.spacing, width);
				//for (let x = spacing; x < width; x += spacing ) {
				for (let xx = xLeft; xx <=xRight; xx += spacing ) {
					
					if(isOdd) {
						x = xx;  //odd lines: x in ascending order
						if(xx==xLeft) {	//the first point of line
							//lastX = x; //initial lastX of a line
							lastX = xLeft;
						}
					} else {
						x = xRight-(xx-xLeft);  //even lines: x in descending order
						if(xx==xLeft) {	//the first point of line
							//lastX = x; //initial lastX of a line
							lastX = xRight;
						}
					}
					
					if(LinesOrientationH) {
						currentHorizontalPixelIndex = Math.floor(x + currentVerticalPixelIndex); // Get array position of current pixel
					} else {
						currentHorizontalPixelIndex = Math.floor(y + x*width);
					}

					// skip transparent points when transparent enabled
					// disable this function when connectEnds enabled
					if( transparent && !connectEnds ) {
						b = imagePixels.data[4*currentHorizontalPixelIndex]+imagePixels.data[4*currentHorizontalPixelIndex+1]+imagePixels.data[4*currentHorizontalPixelIndex+2];
						if( b >= 255*3 ) { //find transparent color
							isBeginDraw = false;
							lastX = x;
							if(currentLine.length > 0) {
								squiggleData.push(currentLine);
								currentLine = [];
							}													
						} else {
							if(!isBeginDraw) {
								isBeginDraw = true;
							}
						}								
					}
					
					if(isBeginDraw) {
						// When there is contrast adjustment, the calculations of brightness values are a bit different
						if (contrast !== 0) {
							// Determine how bright a pixel is, from 0 to 255 by summing three channels (R,G,B) multiplied by some coefficients
							b = (0.2125 * ((contrastFactor * (imagePixels.data[4 * currentHorizontalPixelIndex] - 128) + 128 )
								+ brightness)) + (0.7154 * ((contrastFactor * (imagePixels.data[4 * (currentHorizontalPixelIndex + 1)] - 128) + 128)
								+ brightness)) + (0.0721 * ((contrastFactor*(imagePixels.data[4*(currentHorizontalPixelIndex+2)]-128)+128) + brightness));
						} else {
							b = (0.2125 * (imagePixels.data[4*currentHorizontalPixelIndex] + brightness)) + (0.7154 * (imagePixels.data[4*(currentHorizontalPixelIndex + 1)]+ brightness)) + (0.0721 * (imagePixels.data[4*(currentHorizontalPixelIndex + 2)] + brightness));
						}

						if (black) {
							b = Math.min(255-minBrightness,255-b);    // Set minimum line curvature to value set by the user
							z = Math.max(maxBrightness-b,0);  // Set maximum line curvature to value set by the user
						} else {
							b = Math.max(minBrightness,b);    // Set minimum line curvature to value set by the user
							z = Math.max(maxBrightness-b,0);  // Set maximum line curvature to value set by the user
						}

						// The magic of the script, determines how high / low the squiggle goes
						r = config.amplitude * z / lineCount;

						a += z / config.frequency;
					  
						if( SquiggleDrawMode ) {
							df = z/xsmooth;
							if (df < minPhaseIncr)
								df = minPhaseIncr;
							 
							if (df > maxPhaseIncr)
								df = maxPhaseIncr;

							phase += df;  // xsmooth: Frequency

							deltaX = x - lastX; // Distance between image sample location x and previous vertex

							deltaAmpl = r - lastAmpl;

							deltaPhase = phase - lastPhase; // Change in phase since last *vertex*
						  
							if( deltaPhase > Math.PI*0.5 && (y+horizontalLineSpacing) < height ) {
								vertexCount = Math.floor( deltaPhase / Math.PI*0.5); //  Add this many vertices

								integerPart = ((vertexCount * Math.PI*0.5) / deltaPhase);

								deltaX_truncate = deltaX * integerPart;

								xPerVertex =  deltaX_truncate / vertexCount;
								amplPerVertex = (integerPart * deltaAmpl) / vertexCount;

								// Add the vertices:
								for (let i = 0; i < vertexCount; i = i+1) {
									lastX = lastX + xPerVertex;
									lastPhase = lastPhase + Math.PI*0.5;
									lastAmpl = lastAmpl + amplPerVertex;
									
									if(LinesOrientationH) {
										currentLine.push([lastX, (y+Math.sin(lastPhase)*lastAmpl)]);
									} else {
										currentLine.push([(y+Math.sin(lastPhase)*lastAmpl), lastX]);
									}
								}
							}
						} else {
							if(LinesOrientationH) {
								currentLine.push([x,y + Math.sin(a)*r]);
							} else {
								currentLine.push([y + Math.sin(a)*r, x]);
							}						
						}
					}
				} 
				//currentLine.push([config.width, y]);
				
				lineTotal = lineTotal+1;
				//add the last point
				if(LinesOrientationH) {
					if(isOdd) {
					   currentLine.push([xRight, y]);
					} else {
					   currentLine.push([xLeft, y]);
					}
				} else {
					if(isOdd) {
					   currentLine.push([y, xRight]);
					} else {
					   currentLine.push([y, xLeft]);
					}
				}
				if(currentLine.length > 0) {
					squiggleData.push(currentLine);
				}
			}
          }
		  
		  //when connectEnds enable , concat all lines vertex to one array
		  if(connectEnds) {
			let connectEndsData = [];
			for(let i=0; i<squiggleData.length; i++) {
				connectEndsData = connectEndsData.concat(squiggleData[i]);
			}
			squiggleData = [ connectEndsData ];
		  }
		  
          return squiggleData;
        }, [{
          config: Object.assign({}, this.settings),
          image: this.canvasData
        }])
          .then(result => {
            this.lines = [];
            result.forEach( line => {
              this.lines.push({values: line});
            })
          })
          .catch(e => {
            console.error(e)
          })
      },
      onCapture() {
        this.webcam.img = this.$refs.webcam.capture();
        this.canvasData = this.$refs.webcam.getCanvasRaw();
      },
      onStarted(stream) {
        this.webcam.streaming = true;
      },
      onStopped(stream) {
        this.webcam.streaming = false;
      },
      onStop() {
        this.$refs.webcam.stop();
      },
      onStart() {
        this.$refs.webcam.start();
      },
      onError(error) {
        console.log("On Error Event", error);
      },
      onCameras(cameras) {
        this.webcam.devices = cameras;
        console.log("On Cameras Event", cameras);
      },
      onCameraChange(deviceId) {
        this.webcam.deviceId = deviceId;
        this.webcam.camera = deviceId;
      },
      onInputSelected(type) {
        this.inputType = type;
      },
	  onLocaleSelected(lang) {
		//console.log(lang);
		//console.log(this.i18n);
		//this.i18n.locale = lang;
	  }
    }
  }
</script>

<style lang="scss">
  @import './styles/index.scss';
</style>
