(function(exports) {



  //////////////////////////////////////
  ////  INPUT
  //////////////////////////////////////

  //// MOUSE ///////////////////////////

  exports.mouseX = 0;
  exports.mouseY = 0;
  exports.pmouseX = 0;
  exports.pmouseY = 0;
  exports.mouseButton = 0;
  exports.touchX = 0;
  exports.touchY = 0;
  var pMousePressed = false;
  
  /*
  // Another possibility: mouseX, mouseY, etc. are properties with a getter
  // that returns the relative coordinates depending on the current element.
  // I think is overkill and might screw up things in unexpected ways in other
  // parts of pjs.
  Object.defineProperty(exports, "mouseX", {
    get: function() {
      var bounds = PVariables.curElement.elt.getBoundingClientRect();
      return absMouseX - bounds.left;
    },
    set: undefined
  });
  */

  exports.isMousePressed = function() {
    return pMousePressed;
  };
  function pUpdateMouseCoords(e) {
    pmouseX = exports.mouseX;
    pmouseY = exports.mouseY;
    exports.mouseX = e.pageX;  // - parseInt(PVariables.curElement.elt.style.left, 10);
    exports.mouseY = e.pageY;  // - parseInt(PVariables.curElement.elt.style.top, 10);
    
    for (var n = 0; n < PVariables.sketchCanvases.length; n++) {
      var s = PVariables.sketches[n];
      var c = PVariables.sketchCanvases[n];
      var bounds = c.elt.getBoundingClientRect();
      s.pmouseX = s.mouseX;
      s.pmouseY = s.mouseY;
      s.mouseX = mouseX - bounds.left;
      s.mouseY = mouseY - bounds.top;
    }
    
    // console.log(mouseX+' '+mouseY);
    // console.log('mx = '+mouseX+' my = '+mouseY);
  }
  function pSetMouseButton(e) {
   exports.mouseButton = exports.LEFT;
    if (e.button == 1) {
      exports.mouseButton = exports.CENTER;
    } else if (e.button == 2) {
      exports.mouseButton = exports.RIGHT;
    }
    for (var i = 0; i < PVariables.sketches.length; i++) {
      var s = PVariables.sketches[i];
      if (e.button == 1) {
        s.mouseButton = exports.CENTER;
      } else if (e.button == 2) {
        s.mouseButton = exports.RIGHT;
      }      
    } 
  }
  function pSetTouchPoints(e) {
    exports.touchX = e.changedTouches[0].pageX;
    exports.touchY = e.changedTouches[0].pageY;
    exports.touches = [];
    for (var n = 0; n < PVariables.sketchCanvases.length; n++) {
      PVariables.sketches[n].touches = [];
    }    
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      exports.touches[i] = {x: ct.pageX, y: ct.pageY};
      for (var m = 0; m < PVariables.sketchCanvases.length; n++) {
        var s = PVariables.sketches[m];
        var c = PVariables.sketchCanvases[m];
        var bounds = c.elt.getBoundingClientRect(); 
        s.touches[i] = {x: ct.pageX - bounds.left, y: ct.pageY - bounds.top};
      }              
    }
  }

  //// KEYBOARD ////////////////////////

  exports.key = '';
  exports.keyCode = 0; 
  var pKeyPressed = false;

  exports.isKeyPressed = function() {
    return pKeyPressed;
  };
  function pSetupInput() {
    document.body.onmousemove = function(e){
      pUpdateMouseCoords(e);
      if (!pMousePressed && typeof mouseMoved === 'function')
        mouseMoved(e);
      if (pMousePressed && typeof mouseDragged === 'function')
        mouseDragged(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (!pMousePressed && typeof s.mouseMoved === 'function')
          s.mouseMoved(e);
        if (pMousePressed && typeof s.mouseDragged === 'function')
          s.mouseDragged(e);          
      }        
    };
    document.body.onmousedown = function(e) {
      pMousePressed = true;
      pSetMouseButton(e);
      if (typeof mousePressed === 'function')
        mousePressed(e);        
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mousePressed === 'function')
          s.mousePressed(e);
      } 
    };
    document.body.onmouseup = function(e) {
      pMousePressed = false;
      if (typeof mouseReleased === 'function')
        mouseReleased(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseReleased === 'function')
          s.mouseReleased(e);
      }        
    };
    document.body.onmouseclick = function(e) {
      if (typeof mouseClicked === 'function')
        mouseClicked(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseClicked === 'function')
          s.mouseClicked(e);
      }
    };
    document.body.onmousewheel = function(e) {
      if (typeof mouseWheel === 'function')
        mouseWheel(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseWheel === 'function')
          s.mouseWheel(e);
      }     
    };
    document.body.onkeydown = function(e) {
      pKeyPressed = true;
      exports.keyCode = e.keyCode;
      exports.key = String.fromCharCode(e.keyCode);
      if (typeof keyPressed === 'function')
        keyPressed(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyPressed === 'function')
          s.keyPressed(e);
      }
    };
    document.body.onkeyup = function(e) {
      pKeyPressed = false;
      if (typeof keyReleased === 'function')
        keyReleased(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyReleased === 'function')
          s.keyReleased(e);
      }  
    };
    document.body.onkeypress = function(e) {
      if (typeof keyTyped === 'function')
        keyTyped(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyTyped === 'function')
          s.keyTyped(e);
      }        
    };
    document.body.ontouchstart = function(e) {
      pSetTouchPoints(e);
      if(typeof touchStarted === 'function')
        touchStarted(e);
      var m = typeof touchMoved === 'function';         
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchStarted === 'function')
          s.touchStarted(e);
        m |= typeof s.touchMoved === 'function';         
      }        
      if(m) {
        e.preventDefault();
      }
    };
    document.body.ontouchmove = function(e) {
      pSetTouchPoints(e);
      if(typeof touchMoved === 'function')
        touchMoved(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchMoved === 'function')
          s.touchMoved(e);
      }        
    };
    document.body.ontouchend = function(e) {
      pSetTouchPoints(e);
      if(typeof touchEnded === 'function')
        touchEnded(e);
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchEnded === 'function')
          s.touchEnded(e);
      }            
    };
  }

  //// FILES ///////////////////////////

  //BufferedReader
  exports.createInput = function() {
    // TODO
  };
  exports.createReader = function() {
    // TODO
  };
  exports.loadBytes = function() {
    // TODO
  };
  exports.loadJSON = function(file, callback) {
    var req = new XMLHttpRequest();  
    req.overrideMimeType('application/json');  
    req.open('GET', 'data/'+file);  
    req.onreadystatechange = function () {
      if(req.readyState === 4) {
        if(req.status === 200 || req.status === 0) {
          if (typeof callback !== 'undefined') callback();
          return JSON.parse(req.responseText);
        }
      }
    };
    req.send(null);
  };
  exports.loadStrings = function(file, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', 'data/'+file, true);
    req.onreadystatechange = function () {
      if(req.readyState === 4) {
        if(req.status === 200 || req.status === 0) {
          if (typeof callback !== 'undefined') callback();
          return req.responseText.match(/[^\r\n]+/g);
        }
      }
    };
    req.send(null);
  };
  exports.loadTable = function () {
    // TODO
  };
  /*exports.loadXML = function() {
    var req = new XMLHttpRequest();  
    req.overrideMimeType('application/json');  
    req.overrideMimeType('text/xml');
    req.open('GET', 'data/'+file, false);  
    req.onreadystatechange = function () {
      if(req.readyState === 4) {
        if(req.status === 200 || req.status == 0) {
          console.log(JSON.parse(req.responseXML));
          return JSON.parse(req.responseXML);
        }
      }
    }
    req.send(null);
  }*/
  exports.open = function() {
    // TODO
  };
  exports.parseXML = function() {
    // TODO
  };
  exports.saveTable = function() {
    // TODO
  };
  exports.selectFolder = function() {
    // TODO
  };
  exports.selectInput = function() {
    // TODO
  };

  //// TIME & DATE /////////////////////

  exports.day = function() {
    return new Date().getDate();
  };
  exports.hour = function() {
    return new Date().getHours();
  };
  exports.minute = function() {
    return new Date().getMinutes();
  };
  exports.millis = function() {
    return new Date().getTime() - PVariables.startTime;
  };
  exports.month = function() {
    return new Date().getMonth();
  };
  exports.second = function() {
    return new Date().getSeconds();
  };
  exports.year = function() {
    return new Date().getFullYear();
  };

  //////////////////////////////////////
  ////  OUTPUT
  //////////////////////////////////////

  //// TEXT AREA ///////////////////////
  exports.print = console.log.bind(console);
  exports.println = console.log.bind(console);

  //// IMAGE ///////////////////////////

  exports.save = function() {
    window.open(PVariables.curElement.elt.toDataURL('image/png'));
  };

  //// FILES ///////////////////////////

  exports.pWriters = [];
  exports.beginRaw = function() {
    // TODO
  };
  exports.beginRecord = function() {
    // TODO
  };
  exports.createOutput = function() {
    // TODO
  };
  exports.createWriter  = function(name) {
    if (pWriters.indexOf(name) == -1) { // check it doesn't already exist
      pWriters.name = new PrintWriter(name);
    }
  };
  exports.endRaw = function() {
    // TODO
  };
  exports.endRecord  = function() {
    // TODO
  };
  exports.PrintWriter = function(name) {
     this.name = name;
     this.content = '';
     this.print = function(data) { this.content += data; };
     this.println = function(data) { this.content += data + '\n'; };
     this.flush = function() { this.content = ''; };
     this.close = function() { writeFile(this.content); };
  };
  exports.saveBytes = function() {
    // TODO
  };
  exports.saveJSONArray = function() {
    // TODO
  };
  exports.saveJSONObject = function() {
    // TODO
  };
  exports.saveStream = function() {
    // TODO
  };
  exports.saveStrings = function(list) {
    writeFile(list.join('\n'));
  };
  exports.saveXML = function() {
    // TODO
  };
  exports.selectOutput = function() {
    // TODO
  };
  exports.writeFile = function(content) {
    exports.open('data:text/json;charset=utf-8,' + escape(content), 'download'); 
  };

  //////////////////////////////////////
  //// TRANSFORM
  //////////////////////////////////////

  exports.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
    PVariables.curElement.context.transform(n00, n01, n02, n10, n11, n12);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [n00, n01, n02, n10, n11, n12]);
  };
  exports.popMatrix = function() { 
    PVariables.curElement.context.restore(); 
    PVariables.matrices.pop();
  };
  exports.printMatrix = function() {
    console.log(PVariables.matrices[PVariables.matrices.length-1]);
  };
  exports.pushMatrix = function() { 
    PVariables.curElement.context.save(); 
    PVariables.matrices.push([1,0,0,1,0,0]);
  };
  exports.resetMatrix = function() { 
    PVariables.curElement.context.setTransform();
    PVariables.matrices[PVariables.matrices.length-1] = [1,0,0,1,0,0]; 
  };
  exports.rotate = function(r) { 
    PVariables.curElement.context.rotate(r); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    var c = Math.cos(r);
    var s = Math.sin(r);
    var m11 = m[0] * c + m[2] * s;
    var m12 = m[1] * c + m[3] * s;
    var m21 = m[0] * -s + m[2] * c;
    var m22 = m[1] * -s + m[3] * c;
    m[0] = m11;
    m[1] = m12;
    m[2] = m21;
    m[3] = m22;
  };
  exports.scale = function() {
    var x = 1.0, y = 1.0;
    if (arguments.length == 1) {
      x = y = arguments[0];
    } else {
      x = arguments[0];
      y = arguments[1];
    }
    PVariables.curElement.context.scale(x, y); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m[0] *= x;
    m[1] *= x;
    m[2] *= y;
    m[3] *= y;
  };
  exports.shearX = function(angle) {
    PVariables.curElement.context.transform(1, 0, tan(angle), 1, 0, 0);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [1, 0, tan(angle), 1, 0, 0]);
  };
  exports.shearY = function(angle) {
    PVariables.curElement.context.transform(1, tan(angle), 0, 1, 0, 0);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [1, tan(angle), 0, 1, 0, 0]);
  };
  exports.translate = function(x, y) { 
    PVariables.curElement.context.translate(x, y); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m[4] += m[0] * x + m[2] * y;
    m[5] += m[1] * x + m[3] * y;
  };

  //////////////////////////////////////
  ////  COLOR
  //////////////////////////////////////

  //// SETTING /////////////////////////

  exports.background = function() { 
    var c = getNormalizedColor(arguments);
    // save out the fill
    var curFill = PVariables.curElement.context.fillStyle;
    // create background rect
    PVariables.curElement.context.fillStyle = getCSSRGBAColor(c);
    PVariables.curElement.context.fillRect(0, 0, width, height);
    // reset fill
    PVariables.curElement.context.fillStyle = curFill;
  };
  exports.clear = function() {
    PVariables.curElement.context.clearRect(0, 0, width, height);
  };
  exports.colorMode = function(mode) {
    if (mode == exports.RGB || mode == exports.HSB)
      PVariables.colorMode = mode; 
  };
  exports.fill = function() {
    var c = getNormalizedColor(arguments);
    PVariables.curElement.context.fillStyle = getCSSRGBAColor(c);
  };
  exports.noFill = function() {
    PVariables.curElement.context.fillStyle = 'rgba(0,0,0,0)';
  };
  exports.noStroke = function() {
    PVariables.curElement.context.strokeStyle = 'rgba(0,0,0,0)';
  };
  exports.stroke = function() {
    var c = getNormalizedColor(arguments);
    PVariables.curElement.context.strokeStyle = getCSSRGBAColor(c);
  };

  //// CREATING & READING //////////////

  exports.alpha = function(rgb) {
    if (rgb.length > 3) return rgb[3];
    else return 255;
  };
  exports.blue = function(rgb) { 
    if (rgb.length > 2) return rgb[2];
    else return 0;
  };
  exports.brightness = function(hsv) {
    if (rgb.length > 2) return rgb[2];
    else return 0;
  };
  exports.color = function() {
    return getNormalizedColor(arguments);
  };
  exports.green = function(rgb) { 
    if (rgb.length > 2) return rgb[1];
    else return 0;
  };
  exports.hue = function(hsv) { 
    if (rgb.length > 2) return rgb[0];
    else return 0;
  };
  exports.lerpColor = function(c1, c2, amt) {
    var c = [];
    for (var i=0; i<c1.length; i++) {
      c.push(lerp(c1[i], c2[i], amt));
    }
    return c;
  };
  exports.red = function(rgb) { 
    if (rgb.length > 2) return rgb[0];
    else return 0;
  };
  exports.saturation = function(hsv) { 
    if (hsv.length > 2) return hsv[1];
    else return 0;
  };

  //////////////////////////////////////
  ////  IMAGE
  //////////////////////////////////////

  //// PIMAGE //////////////////////////

  exports.createImage = function(w, h, format) {
    return new PImage(w, h);
  }; //pend format?
  exports.loadImage = function(path, callback) { 

    var pimg = new PImage();
    pimg.sourceImage = new Image();

    pimg.sourceImage.onload = function() {
      pimg.width = pimg.sourceImage.width;
      pimg.height = pimg.sourceImage.height;

      // draw to canvas to get image data
      var canvas = document.createElement('canvas');
      var ctx=canvas.getContext("2d");
      canvas.width=pimg.width;
      canvas.height=pimg.height;
      ctx.drawImage(pimg.sourceImage, 0, 0);
      // note: this only works with local files!
      pimg.imageData = ctx.getImageData(0, 0, pimg.width, pimg.height);

    };

    pimg.sourceImage.src = path; 
    return pimg;
  };


  function PImage(w, h) {
    this.width = w || 1;
    this.height = h || 1;
    this.imageData = PVariables.curElement.context.createImageData(this.width, this.height); 
    for (var i = 3, len = this.imageData.length; i < len; i += 4) {
      this.imageData[i] = 255;
    }
    this.pixels = [];
  }
  PImage.prototype.loadPixels = function() { 
    this.pixels = [];
    var data = this.imageData.data;
    for (var i=0; i<data.length; i+=4) {
      this.pixels.push([data[i], data[i+1], data[i+2], data[i+3]]);
    }
  };
  /*PImage.prototype.updatePixels = function() {
    this.sourceImage.getContext('2d').putImageData(this.imageData, 0, 0);
  };*/
  PImage.prototype.resize = function() {
    // TODO
  };
  PImage.prototype.get = function(x, y, w, h) {
    var wp = w ? w : 1;
    var hp = h ? h : 1;
    var vals = [];
    for (var j=y; j<y+hp; j++) {
      for (var i=x; i<x+wp; i++) {
        vals.push(this.pixels[j*this.width+i]);
      }
    }
  };
  PImage.prototype.set = function(x, y, val) {
    var ind = y*this.width+x;
    if (typeof val.image == 'undefined') {
      if (ind < this.pixels.length) {
        this.pixels[ind] = val;
      }
    } else {
      // TODO: copy image pixels
    }
  };
  /*PImage.prototype.mask = function(m) {
    // Masks part of an image with another image as an alpha channel
    var op = PVariables.curElement.context.globalCompositeOperation;
    PVariables.curElement.context.drawImage(m.image, 0, 0);
    PVariables.curElement.context.globalCompositeOperation = 'source-atop';
    PVariables.curElement.context.drawImage(this.image, 0, 0);
    PVariables.curElement.context.globalCompositeOperation = op;
  };*/
  PImage.prototype.filter = function() {
    // TODO
    // Converts the image to grayscale or black and white
  };
  PImage.prototype.copy = function() {
    // TODO
    // Copies the entire image
  };
  PImage.prototype.blend = function() {
    // TODO
    // Copies a pixel or rectangle of pixels using different blending modes
  };
  PImage.prototype.save = function() {
    // TODO
    // Saves the image to a TIFF, TARGA, PNG, or JPEG file*/
  };
  exports.PImage = PImage;

  //// LOADING & DISPLAYING //////////////////

  exports.image = function() { 
    var vals;
    if (arguments.length < 5) {
      vals = pModeAdjust(arguments[1], arguments[2], arguments[0].width, arguments[0].height, PVariables.imageMode);
    } else {
      vals = pModeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], PVariables.imageMode);
    }
    console.log(arguments[0]);
    PVariables.curElement.context.drawImage(arguments[0].sourceImage, vals.x, vals.y, vals.w, vals.h);
  };

  exports.imageMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.CENTER) PVariables.imageMode = m;
  };

  function getPixels(img) {
    var c = document.createElement('canvas');
    c.width = img.width; 
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img);
    return ctx.getImageData(0,0,c.width,c.height);
  }
  //// PIXELS ////////////////////////////////

  exports.pixels = [];
  exports.blend = function() {
    // TODO
  };
  exports.copy = function() {
    // TODO
  };
  exports.filter = function() {
    // TODO
  };
  exports.get = function(x, y) {
    var pix = PVariables.curElement.context.getImageData(0, 0, width, height).data;
    /*if (typeof w !== 'undefined' && typeof h !== 'undefined') {
      var region = [];
      for (var j=0; j<h; j++) {
        for (var i=0; i<w; i++) {
          region[i*w+j] = pix[(y+j)*width+(x+i)]; 
        }
      }
      return region;
    }*/
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        var offset = 4*y*width+4*x;
        var c = [pix[offset], pix[offset+1], pix[offset+2], pix[offset+3]];
        return c;
      } else {
        return [0, 0, 0, 255];
      }
    } else {
      return [0, 0, 0, 255];
    }
  };
  exports.loadPixels = function() { 
    var a = PVariables.curElement.context.getImageData(0, 0, width, height).data;
    pixels = [];
    for (var i=0; i < a.length; i+=4) {
      pixels.push([a[i], a[i+1], a[i+2], a[i+3]]); // each pixels entry: [r, g, b, a]
    }
  };
  exports.set = function() {
    // TODO
  };
  exports.updatePixels = function() {
    /*if (typeof pixels !== 'undefined') {
      var imgd = PVariables.curElement.context.getImageData(x, y, width, height);
      imgd = pixels;
      context.putImageData(imgd, 0, 0);
    }*/
  };

  //////////////////////////////////////
  ////  TYPOGRAPHY
  //////////////////////////////////////

  //// LOADING & DISPLAYING ////////////
  /*
    text(str, x, y)
    text(str, x1, y1, x2, y2)
  */
  exports.text = function() {
    PVariables.curElement.context.font=PVariables.textStyle+' '+PVariables.textSize+'px '+PVariables.textFont;
    if (arguments.length == 3) {
      PVariables.curElement.context.fillText(arguments[0], arguments[1], arguments[2]);
      PVariables.curElement.context.strokeText(arguments[0], arguments[1], arguments[2]);
    } else if (arguments.length == 5) {
      var words = arguments[0].split(' ');
      var line = '';
      var vals = pModeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], PVariables.rectMode);
      vals.y += PVariables.textLeading;
      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = PVariables.curElement.context.measureText(testLine);
        var testWidth = metrics.width;
        if (vals.y > vals.h) {
          break;
        }
        else if (testWidth > vals.w && n > 0) {
          PVariables.curElement.context.fillText(line, vals.x, vals.y);
          PVariables.curElement.context.strokeText(lin, vals.x, vals.y);
          line = words[n] + ' ';
          vals.y += PVariables.textLeading;
        }
        else {
          line = testLine;
        }
      }
      if (vals.y <= vals.h) {
        PVariables.curElement.context.fillText(line, vals.x, vals.y);
        PVariables.curElement.context.strokeText(line, vals.x, vals.y);
      }
    }
  };

  //// ATTRIBUTES //////////////////////
  exports.NORMAL = 'normal', exports.ITALIC = 'italic', exports.BOLD = 'bold';
  exports.textAlign = function(a) {
    if (a == exports.LEFT || a == exports.RIGHT || a == exports.CENTER) PVariables.curElement.context.textAlign = a;
  };
  exports.textFont = function(str) {
    PVariables.textFont = str; //pend temp?
  };
  exports.textHeight = function(s) {
    return PVariables.curElement.context.measureText(s).height;
  };
  exports.textLeading = function(l) {
    PVariables.textLeading = l;
  };
  exports.textSize = function(s) {
    PVariables.textSize = s;
  };
  exports.textStyle = function(s) {
    if (s == exports.NORMAL || s == exports.ITALIC || s == exports.BOLD) {
      PVariables.textStyle = s;
    }
  };
  exports.textWidth = function(s) {
    return PVariables.curElement.context.measureText(s).width;
  };


  //////////////////////////////////////
  ////  MATH
  //////////////////////////////////////

  //// CALCULATION /////////////////////
  /** @module Math */
  /** returns abs value */
  exports.abs = function(n) { return Math.abs(n); };
  exports.ceil = function(n) { return Math.ceil(n); };
  exports.constrain = function(n, l, h) { return max(min(n, h), l); };
  exports.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  };
  exports.exp = function(n) { return Math.exp(n); };
  exports.floor = function(n) { return Math.floor(n); };
  exports.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };
  exports.log = function(n) { return Math.log(n); };
  exports.mag = function(x, y) { return Math.sqrt(x*x+y*y); };
  exports.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };
  exports.max = function(a, b) { return Math.max(a, b); };
  exports.min = function(a, b) { return Math.min(a, b); };
  exports.norm = function(n, start, stop) { return map(n, start, stop, 0, 1); };
  exports.pow = function(n, e) { return Math.pow(n, e); };
  exports.round = function(n) { return Math.round(n); };
  exports.sq = function(n) { return n*n; };
  exports.sqrt = function(n) { return Math.sqrt(n); };

  //// TRIGONOMETRY ////////////////////

  exports.acos = function(x) { return Math.acos(x); };
  exports.asin = function(x) { return Math.asin(x); };
  exports.atan = function(x) { return Math.atan(x); };
  exports.atan2 = function(y, x) { return Math.atan2(y, x); };
  exports.cos = function(x) { return Math.cos(x); };
  exports.degrees = function(x) { return 360.0*x/(2*Math.PI); };
  exports.radians = function(x) { return 2*Math.PI*x/360.0; };
  exports.sin = function(x) { return Math.sin(x); };
  exports.tan = function(x) { return Math.tan(x); };

  //// RANDOM //////////////////////////

  exports.random = function(x, y) {
    // might want to use this kind of check instead:
    // if (arguments.length === 0) {
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      return (y-x)*Math.random()+x;
    } else if (typeof x !== 'undefined') { 
      return x*Math.random();
    } else {
      return Math.random();
    }
  };

  //////////////////////////////////////
  ////
  ////  CONSTANTS
  ////
  //////////////////////////////////////

  exports.HALF_PI = Math.PI*0.5;
  exports.PI = Math.PI;
  exports.QUARTER_PI = Math.PI*0.25;
  exports.TAU = Math.PI*2.0;
  exports.TWO_PI = Math.PI*2.0;

  exports.CORNER = 'corner', CORNERS = 'corners', exports.RADIUS = 'radius';
  exports.RIGHT = 'right', exports.LEFT = 'left', exports.CENTER = 'center';
  exports.POINTS = 'points', exports.LINES = 'lines', exports.TRIANGLES = 'triangles', exports.TRIANGLE_FAN = 'triangles_fan',
  exports.TRIANGLE_STRIP = 'triangles_strip', exports.QUADS = 'quads', exports.QUAD_STRIP = 'quad_strip';
  exports.CLOSE = 'close';
  exports.OPEN = 'open', exports.CHORD = 'chord', exports.PIE = 'pie';
  exports.SQUARE = 'butt', exports.ROUND = 'round', exports.PROJECT = 'square'; // PEND: careful this is counterintuitive
  exports.BEVEL = 'bevel', exports.MITER = 'miter';
  exports.RGB = 'rgb', exports.HSB = 'hsb';
  exports.AUTO = 'auto';
  exports.CROSS = 'crosshair', exports.HAND = 'pointer', exports.MOVE = 'move', exports.TEXT = 'text', exports.WAIT = 'wait';


  //////////////////////////////////////
  ////
  //// EXTENSIONS
  ////
  //////////////////////////////////////

  //// MISC ////////////////////////////

  //// PVector  ////////////////////////

  function PVector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  PVector.prototype.set = function (x, y, z) {
    if (x instanceof PVector) { return this.set(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };

  PVector.prototype.get = function () {
    return new PVector(this.x, this.y, this.z);
  };

  PVector.prototype.add = function (x, y, z) {
    if (x instanceof PVector) { return this.add(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.add(x[0], x[1], x[2]); }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  PVector.prototype.sub = function (x, y, z) {
    if (x instanceof PVector) { return this.sub(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.sub(x[0], x[1], x[2]); }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  };

  PVector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

  PVector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this; 
  };

  PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  PVector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  PVector.prototype.dot = function (x, y, z) {
    if (x instanceof PVector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  PVector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new PVector(x, y, z);
  };

  PVector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  PVector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  PVector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq)); //normalize it
      this.mult(l);
    }
    return this;
  };

  PVector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  PVector.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
  };

  PVector.prototype.rotate2D = function (a) {
    var newHeading = this.heading() + a;
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  PVector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof PVector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  };

  PVector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods

  PVector.random2D = function () {
    //TODO:
  };

  PVector.random3D = function () {
    //TODO:
  };

  PVector.add = function (v1, v2) {
    return v1.get().add(v2);
  };

  PVector.sub = function (v1, v2) {
    return v1.get().sub(v2);
  };

  PVector.mult = function (v, n) {
    return v.get().mult(n);
  };

  PVector.div = function (v, n) {
    return v.get().div(n);
  };

  PVector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  PVector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  PVector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  PVector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  PVector.angleBetween = function (v1, v2) {
    return Math.acos((v1.dot(v2))/(v1.mag() * v2.mag()));
   
  };

  exports.PVector = PVector;

  //// PElement ////////////////////////

  function PElement(elt) {
    this.elt = elt;
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
    this.elt.style.position = 'absolute';
    this.x = 0;
    this.y = 0;
    this.elt.style.left = this.x+ 'px';
    this.elt.style.top = this.y+ 'px';
    if (elt instanceof HTMLCanvasElement) {
      this.context = elt.getContext('2d');
    }
  }
  PElement.prototype.html = function(html) {
    this.elt.innerHTML = html;
  };
  PElement.prototype.position = function(x, y) {
    this.x = x;
    this.y = y;
    this.elt.style.left = x+'px';
    this.elt.style.top = y+'px';
  };
  PElement.prototype.size = function(w, h) {
    var aW = w, aH = h;
    if (aW != AUTO || aH != AUTO) {
      if (aW == AUTO) aW = h * this.elt.width / this.elt.height;
      else if (aH == AUTO) aH = w * this.elt.height / this.elt.width;
      if (this.elt instanceof HTMLCanvasElement) { // set diff for cnv vs normal div
        this.elt.setAttribute('width', aW);
        this.elt.setAttribute('height', aH);
      } else {
        this.elt.style.width = aW;
        this.elt.style.height = aH;
      }
      this.width = this.elt.offsetWidth;
      this.height = this.elt.offsetHeight;
      if (PVariables.curElement.elt == this.elt) {
        width = this.elt.offsetWidth;
        height = this.elt.offsetHeight;
      }
    }
  };
  PElement.prototype.style = function(s) {
    this.elt.style.cssText += s;
  };
  PElement.prototype.id = function(id) {
    this.elt.id = id;
  };
  PElement.prototype.class = function(c) {
    this.elt.className = c;
  };
  PElement.prototype.show = function() {
    this.elt.style.display = 'block';
  };
  PElement.prototype.hide = function() {
    this.elt.style.display = 'none';
  };
  PElement.prototype.mousePressed = function(fxn) {
    var _this = this; this.elt.addEventListener('click', function(e){fxn(e, _this);}, false);
  }; // pend false?
  PElement.prototype.mouseOver = function(fxn) {
    var _this = this; this.elt.addEventListener('mouseover', function(e){fxn(e, _this);}, false);
  };
  PElement.prototype.mouseOut = function(fxn) {
    var _this = this; this.elt.addEventListener('mouseout', function(e){fxn(e, _this);}, false);
  };
  exports.PElement = PElement;

  //// CREATE //////////////////////////

  exports.createGraphics = function(w, h, isDefault, targetID) {
    //console.log('create canvas');
    var c = document.createElement('canvas');
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    if (isDefault) {
      c.id = 'defaultCanvas';
      document.body.appendChild(c);      
    } else { // remove the default canvas if new one is created
      var defaultCanvas = document.getElementById('defaultCanvas');
      if (defaultCanvas) {
        defaultCanvas.parentNode.removeChild(defaultCanvas);
      }
      if (targetID) {
        target = document.getElementById(targetID);
        if (target) target.appendChild(c);    
        else document.body.appendChild(c);
      } else {
        document.body.appendChild(c);
      } 
    }

    var cnv =  new PElement(c);
    context(cnv);
    pApplyDefaults();
    pSetupInput();

    return cnv;
  };
  exports.createHTML = function(html) {
    var elt = document.createElement('div');
    elt.innerHTML = html;
    document.body.appendChild(elt);
    c =  new PElement(elt);
    context(c);
    return c;
  };
  exports.createHTMLImage = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    c =  new PElement(elt);
    context(c);
    return c;
  };

  //// CONTEXT /////////////////////////

  exports.context = function(e) {
    var obj;
    if (typeof e == 'string' || e instanceof String) {
      var elt = document.getElementById(e);
      obj = elt ? new PElement(elt) : null;
    } else obj = e;
    //console.log(obj)
    if (typeof obj !== 'undefined') {
      PVariables.curElement = obj;
      width = obj.elt.offsetWidth;
      height = obj.elt.offsetHeight;
      //console.log(width, height)
      if (typeof PVariables.curElement.context !== 'undefined') PVariables.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
      
      if (-1 < PVariables.curSketchIndex && PVariables.sketchCanvases.length <= PVariables.curSketchIndex) {
        PVariables.sketchCanvases[PVariables.curSketchIndex] = PVariables.curElement;
      }
    }
  };

  //// ACCESS //////////////////////////
  exports.find = function(e) {
    var res = document.getElementById(e);
    if (res) return [new PElement(res)];
    else {
      res = document.getElementsByClassName(e);
      if (res) {
        var arr = [];
        for(var i = 0, resl = res.length; i != resl; arr.push(new PElement(res[i++])));
        return arr;
      }  
    }
    return [];
  }

  //////////////////////////////////////
  ////
  //// CORE PJS STUFF
  //// 
  //////////////////////////////////////


  exports.sketch = function(s) {
    PVariables.sketches[PVariables.sketches.length] = s;
    s.mouseX = 0;
    s.mouseY = 0;
    s.pmouseX = 0;
    s.pmouseY = 0;
    s.mouseButton = 0;
    s.touchX = 0;
    s.touchY = 0;
    if (typeof s.setup === 'function') {
      PVariables.curSketchIndex = PVariables.sketches.length - 1;
      s.setup();
      PVariables.curSketchIndex = -1;
    } else console.log("sketch must include a setup function");
  };
  
  exports.onload = function() {
    pCreate();
  };
  function pCreate() {
    exports.createGraphics(800, 600, true); // default canvas
    PVariables.startTime = new Date().getTime();
    if (typeof setup === 'function' || PVariables.sketches.length > 0) {
      if (typeof setup === 'function') setup();
    } else console.log("sketch must include a setup function");
    PVariables.updateInterval = setInterval(pUpdate, 1000/frameRate);
    pDraw();
  }
  function pApplyDefaults() {
    PVariables.curElement.context.fillStyle = '#FFFFFF';
    PVariables.curElement.context.strokeStyle = '#000000';
    PVariables.curElement.context.lineCap=exports.ROUND;
  }
  function pUpdate() {
    frameCount++;
  }
  function pDraw() {
    if (PVariables.loop) {
      setTimeout(function() {
        requestDraw(pDraw);
      }, 1000 / frameRate);
    }
    // call draw
    if (typeof draw === 'function') draw();
    for (var i = 0; i < PVariables.sketches.length; i++) {
      var s = PVariables.sketches[i];
      if (typeof s.draw === 'function') {
        PVariables.curSketchIndex = i;
        pushStyle();
        s.draw();
        popStyle();    
        PVariables.curSketchIndex = -1;    
      }      
    }
    PVariables.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
  }
  function pModeAdjust(a, b, c, d, mode) {
    if (mode == exports.CORNER) {
      return { x: a, y: b, w: c, h: d };
    } else if (mode == exports.CORNERS) {
      return { x: a, y: b, w: c-a, h: d-b };
    } else if (mode == exports.RADIUS) {
      return { x: a-c, y: b-d, w: 2*c, h: 2*d };
    } else if (mode == exports.CENTER) {
      return { x: a-c*0.5, y: b-d*0.5, w: c, h: d };
    }
  }
  function pMultiplyMatrix(m1, m2) {
    var result = [];
    for(var j = 0; j < m2.length; j++) {
      result[j] = [];
      for(var k = 0; k < m1[0].length; k++) {
        var sum = 0;
        for(var i = 0; i < m1.length; i++) {
          sum += m1[i][k] * m2[j][i];
        }
        result[j].push(sum);
      }
    }
    return result;
  }

  //////////////////////////////////////
  ////
  //// MISC HELPER FXNS
  ////
  //////////////////////////////////////

  /**
  * getNormalizedColor For a number of different inputs,
  *                    returns a color formatted as [r, g, b, a]
  *
  * @param {'array-like' object} args An 'array-like' object that
  *                                   represents a list of arguments
  *                                  
  * @return {Array} returns a color formatted as [r, g, b, a]
  *                 input        ==> output
  *                 g            ==> [g, g, g, 255]
  *                 g,a          ==> [g, g, g, a]
  *                 r, g, b      ==> [r, g, b, 255]
  *                 r, g, b, a   ==> [r, g, b, a]
  *                 [g]          ==> [g, g, g, 255]
  *                 [g, a]       ==> [g, g, g, a]
  *                 [r, g, b]    ==> [r, g, b, 255]
  *                 [r, g, b, a] ==> [r, g, b, a]
  */
  function getNormalizedColor(args) {
    var r, g, b, a, rgba;
    var _args = typeof args[0].length === 'number' ? args[0] : args;
    if (_args.length >= 3) {
      r = _args[0];
      g = _args[1];
      b = _args[2];
      a = typeof _args[3] === 'number' ? _args[3] : 255;
    } else {
      r = g = b = _args[0];
      a = typeof _args[1] === 'number' ? _args[1] : 255;
    }
    if (PVariables.colorMode == exports.HSB) {
      rgba = hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  }

  /**
  * getCSSRGBAColor For a number of different inputs,
  *                 returns a CSS rgba color string: 'rgba(r, g, b, a)'
  *
  * @param {Array} An [r, g, b [, a]] color array
  *                                  
  * @return {String} a CSS rgba color string: 'rgba(r, g, b, a)'
  */
  function getCSSRGBAColor(arr) {
    var a = arr.map(function(val) {
      return Math.floor(val);
    });
    var alpha = a[3] ? (a[3]/255.0) : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  }

  function rgb2hsv(r,g,b) {
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;
    //remove spaces from input RGB values, convert to int
    r = parseInt( (''+r).replace(/\s/g,''),10 ); 
    g = parseInt( (''+g).replace(/\s/g,''),10 ); 
    b = parseInt( (''+b).replace(/\s/g,''),10 ); 
    if ( r===null || g===null || b===null ||
        isNaN(r) || isNaN(g)|| isNaN(b) ) {
      alert ('Please enter numeric RGB values!');
      return;
    }
    if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
      alert ('RGB values must be in the range 0 to 255.');
      return;
    }
    r=r/255; g=g/255; b=b/255;
    var minRGB = Math.min(r,Math.min(g,b));
    var maxRGB = Math.max(r,Math.max(g,b));
    // Black-gray-white
    if (minRGB==maxRGB) {
      computedV = minRGB;
      return [0,0,computedV];
    }
    // Colors other than black-gray-white:
    var d = (r===minRGB) ? g-b : ((b===minRGB) ? r-g : b-r);
    var h = (r===minRGB) ? 3 : ((b===minRGB) ? 1 : 5);
    computedH = 60*(h - d/(maxRGB - minRGB));
    computedS = (maxRGB - minRGB)/maxRGB;
    computedV = maxRGB;
    return [computedH,computedS,computedV];
  }

  function hsv2rgb(h,s,v) {
    // Adapted from http://www.easyrgb.com/math.html
    // hsv values = 0 - 1, rgb values = 0 - 255
    var r, g, b;
    var RGB = [];
    if(s===0){
      RGB = [Math.round(v*255), Math.round(v*255), Math.round(v*255)]; 
    }else{
      // h must be < 1
      var var_h = h * 6;
      if (var_h==6) var_h = 0;
      //Or ... var_i = floor( var_h )
      var var_i = Math.floor( var_h );
      var var_1 = v*(1-s);
      var var_2 = v*(1-s*(var_h-var_i));
      var var_3 = v*(1-s*(1-(var_h-var_i)));
      if(var_i===0){ 
        var_r = v; 
        var_g = var_3; 
        var_b = var_1;
      }else if(var_i==1){ 
        var_r = var_2;
        var_g = v;
        var_b = var_1;
      }else if(var_i==2){
        var_r = var_1;
        var_g = v;
        var_b = var_3;
      }else if(var_i==3){
        var_r = var_1;
        var_g = var_2;
        var_b = v;
      }else if (var_i==4){
        var_r = var_3;
        var_g = var_1;
        var_b = v;
      }else{ 
        var_r = v;
        var_g = var_1;
        var_b = var_2;
      }
      RGB= [Math.round(var_r * 255), Math.round(var_g * 255), Math.round(var_b * 255)];
    }
    return RGB;  
  }

}(window));

