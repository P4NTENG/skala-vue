import { Camera, Geometry, Mesh, Program, Renderer, Transform } from 'ogl'

export class InspiraShaderToy {
  program = null
  mesh = null
  animationFrameId = 0
  removeEventListeners = []

  // Timing
  isPlaying = false
  firstDrawTime = 0
  prevDrawTime = 0
  targetFPS = 60
  frameInterval = 1000 / 60
  lastFrameTime = 0

  // Callback

  // Uniforms
  iFrame = 0
  iMouse = { x: 0, y: 0, clickX: 0, clickY: 0 }
  hsv = { hue: 0, saturation: 1, brightness: 1 }
  _mouseMode = 'click'
  _mouseSensitivity = 1.0
  _mouseDamping = 0.9

  _speed = 1
  _pixelRatio = 1

  // Shader source
  shaderSource = ''

  vertexShader = `#version 300 es
    #ifdef GL_ES
    precision highp float;
    precision highp int;
    #endif
    in vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
  `

  fragmentShaderHeader = `#version 300 es
    #ifdef GL_ES
    precision highp float;
    precision highp int;
    #endif
    
    uniform vec3      iResolution;     // viewport resolution (in pixels)
    uniform float     iTime;           // shader playback time (in seconds)
    uniform float     iTimeDelta;      // render time (in seconds)
    uniform float     iFrameRate;      // shader frame rate
    uniform int       iFrame;          // shader playback frame
    uniform vec4      iMouse;          // mouse pixel coords. xy: current, zw: click
    uniform vec4      iDate;           // (year, month, day, unixtime in seconds)
    uniform vec3      iHSV;            // HSV controls (hue, saturation, brightness)
    uniform float     iSpeed;          // speed multiplier
    
    out vec4 fragColor;
    
    // HSV to RGB conversion
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    // RGB to HSV conversion
    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    
    // Apply HSV adjustments
    vec3 applyHSV(vec3 color, vec3 hsvAdjust) {
        vec3 hsv = rgb2hsv(color);
        hsv.x = fract(hsv.x + hsvAdjust.x / 360.0);
        hsv.y = clamp(hsv.y * hsvAdjust.y, 0.0, 1.0);
        hsv.z = clamp(hsv.z * hsvAdjust.z, 0.0, 1.0);
        return hsv2rgb(hsv);
    }
    
    void mainImage(out vec4 c, in vec2 f);
    
    void main() {
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
        mainImage(color, gl_FragCoord.xy);
        
        // Apply HSV adjustments if not default
        if (iHSV.x != 0.0 || iHSV.y != 1.0 || iHSV.z != 1.0) {
            color.rgb = applyHSV(color.rgb, iHSV);
        }
        
        fragColor = color;
    }
  `

  constructor(container, mouseMode, fps, pixelRatio = 1) {
    this.container = container
    if (mouseMode) {
      this._mouseMode = mouseMode
    }
    if (fps) {
      this.setFrameRate(fps)
    }
    this.setPixelRatio(pixelRatio)

    // Create renderer with WebGL 2 context
    this.renderer = new Renderer({
      width: this.getSafeWidth(),
      height: this.getSafeHeight(),
      dpr: this._pixelRatio,
      alpha: true,
      depth: false,
      stencil: false,
      antialias: true,
      powerPreference: 'high-performance',
    })

    // Ensure WebGL 2 context
    if (!this.renderer.gl || !(this.renderer.gl instanceof WebGL2RenderingContext)) {
      throw new Error('WebGL 2 not supported')
    }

    // Append canvas to container
    this.container.appendChild(this.renderer.gl.canvas)

    // Setup camera (orthographic for full-screen quad)
    this.camera = new Camera(this.renderer.gl)
    this.camera.position.z = 1

    // Setup scene
    this.scene = new Transform()

    // Setup geometry (full-screen quad)
    this.geometry = new Geometry(this.renderer.gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1]),
      },
    })

    this.setup()
  }

  setup() {
    this.setupMouseEvents()
    this.setupResizeHandler()
  }

  getSafeWidth() {
    return Math.max(1, this.container.clientWidth)
  }

  getSafeHeight() {
    return Math.max(1, this.container.clientHeight)
  }

  getResolution() {
    const width = this.getSafeWidth()
    const height = this.getSafeHeight()
    const dpr = this._pixelRatio

    return [width * dpr, height * dpr, dpr]
  }

  updateProgramResolution() {
    if (this.program) {
      this.program.uniforms.iResolution.value = this.getResolution()
    }
  }

  resize() {
    const width = this.getSafeWidth()
    const height = this.getSafeHeight()
    const dpr = this._pixelRatio

    this.renderer.dpr = dpr
    this.renderer.setSize(width, height)
    this.renderer.setViewport(width * dpr, height * dpr)
    this.updateProgramResolution()
  }

  addEventListener(target, type, listener, options) {
    target.addEventListener(type, listener, options)
    this.removeEventListeners.push(() => {
      target.removeEventListener(type, listener, options)
    })
  }

  setupMouseEvents() {
    const canvas = this.renderer.gl.canvas
    let isMouseDown = false

    const getScaledMousePos = (event) => {
      const rect = canvas.getBoundingClientRect()
      const dpr = this._pixelRatio

      // Get mouse position relative to canvas
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Scale by DPR, apply sensitivity, and flip Y-axis
      return {
        x: x * dpr * this._mouseSensitivity,
        y: (canvas.height - y * dpr) * this._mouseSensitivity, // Flip Y to match GLSL coordinates
      }
    }

    const onMouseMove = (event) => {
      const mouseEvent = event
      const { x: newX, y: newY } = getScaledMousePos(mouseEvent)

      // Apply damping with configurable factor
      this.iMouse.x = this.iMouse.x * this._mouseDamping + newX * (1 - this._mouseDamping)
      this.iMouse.y = this.iMouse.y * this._mouseDamping + newY * (1 - this._mouseDamping)

      // Handle click coordinates based on mode
      if (this._mouseMode === 'hover' && !isMouseDown) {
        this.iMouse.clickX = this.iMouse.x
        this.iMouse.clickY = this.iMouse.y
      } else if (isMouseDown) {
        this.iMouse.clickX = newX
        this.iMouse.clickY = newY
      }
    }

    const onMouseDown = (event) => {
      const mouseEvent = event
      isMouseDown = true
      const { x: clickX, y: clickY } = getScaledMousePos(mouseEvent)

      if (this._mouseMode === 'click') {
        this.iMouse.clickX = clickX
        this.iMouse.clickY = clickY
      }
    }

    const stopPress = () => {
      isMouseDown = false
    }

    // Handle touch events for mobile
    const onTouchMove = (event) => {
      const touchEvent = event
      touchEvent.preventDefault()
      const touch = touchEvent.touches[0]
      if (!touch) return
      const { x: newX, y: newY } = getScaledMousePos(touch)

      this.iMouse.x = newX
      this.iMouse.y = newY

      if (this._mouseMode === 'hover') {
        this.iMouse.clickX = newX
        this.iMouse.clickY = newY
      }
    }

    const onTouchStart = (event) => {
      const touchEvent = event
      touchEvent.preventDefault()
      isMouseDown = true
      const touch = touchEvent.touches[0]
      if (!touch) return
      const { x: clickX, y: clickY } = getScaledMousePos(touch)

      if (this._mouseMode === 'click') {
        this.iMouse.clickX = clickX
        this.iMouse.clickY = clickY
      }
    }

    this.addEventListener(canvas, 'mousemove', onMouseMove)
    this.addEventListener(canvas, 'mousedown', onMouseDown)
    this.addEventListener(canvas, 'mouseup', stopPress)
    this.addEventListener(canvas, 'mouseleave', stopPress)
    this.addEventListener(window, 'mouseup', stopPress)
    this.addEventListener(canvas, 'touchmove', onTouchMove, { passive: false })
    this.addEventListener(canvas, 'touchstart', onTouchStart, {
      passive: false,
    })
    this.addEventListener(canvas, 'touchend', stopPress)
    this.addEventListener(canvas, 'touchcancel', stopPress)
  }

  setupResizeHandler() {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize()
    })

    this.resizeObserver.observe(this.container)
    this.resize()
  }

  compileProgram() {
    if (!this.shaderSource) return false

    const fullFragmentShader = this.fragmentShaderHeader + this.shaderSource

    try {
      const program = new Program(this.renderer.gl, {
        vertex: this.vertexShader,
        fragment: fullFragmentShader,
        uniforms: {
          iResolution: {
            value: this.getResolution(),
          },
          iTime: { value: 0 },
          iTimeDelta: { value: 0 },
          iFrameRate: { value: this.targetFPS },
          iFrame: { value: 0 },
          iMouse: { value: [0, 0, 0, 0] },
          iDate: { value: [0, 0, 0, 0] },
          iHSV: {
            value: [this.hsv.hue, this.hsv.saturation, this.hsv.brightness],
          },
          iSpeed: { value: this._speed },
        },
      })

      const mesh = new Mesh(this.renderer.gl, {
        geometry: this.geometry,
        program,
      })

      this.program?.remove()
      this.program = program
      this.mesh = mesh

      return true
    } catch (error) {
      console.error('Failed to compile shader:', error)
      return false
    }
  }

  draw() {
    if (!this.program || !this.mesh) {
      console.warn('Program or mesh not initialized')
      return
    }

    const now = this.isPlaying ? Date.now() : this.prevDrawTime
    const date = new Date(now)

    if (this.firstDrawTime === 0) {
      this.firstDrawTime = now
    }

    if (this.onDrawCallback) {
      this.onDrawCallback()
    }

    const iTimeDelta = (now - this.prevDrawTime) * 0.001 * this._speed
    const iTime = (now - this.firstDrawTime) * 0.001 * this._speed
    const iDate = [date.getFullYear(), date.getMonth(), date.getDate(), date.getTime() * 0.001]

    if (this.program && this.mesh) {
      // Update uniforms
      this.program.uniforms.iResolution.value = this.getResolution()
      this.program.uniforms.iTime.value = iTime
      this.program.uniforms.iTimeDelta.value = iTimeDelta
      this.program.uniforms.iFrameRate.value = this.targetFPS
      this.program.uniforms.iFrame.value = this.iFrame
      this.program.uniforms.iMouse.value = [
        this.iMouse.x,
        this.iMouse.y,
        this.iMouse.clickX,
        this.iMouse.clickY,
      ]
      this.program.uniforms.iDate.value = iDate
      this.program.uniforms.iHSV.value = [this.hsv.hue, this.hsv.saturation, this.hsv.brightness]
      this.program.uniforms.iSpeed.value = this._speed

      // Render
      this.renderer.render({ scene: this.mesh, camera: this.camera })
    }

    this.prevDrawTime = now
    this.iFrame++
  }

  animate = () => {
    this.animationFrameId = 0

    if (!this.isPlaying) return

    let shouldDraw = true

    if (this.targetFPS < 60) {
      const now = Date.now()
      const elapsed = now - this.lastFrameTime

      if (elapsed < this.frameInterval) {
        shouldDraw = false
      } else {
        this.lastFrameTime = now - (elapsed % this.frameInterval)
      }
    }

    if (shouldDraw) {
      this.draw()
    }

    this.animationFrameId = requestAnimationFrame(this.animate)
  }

  // Public methods
  setShader(config) {
    this.shaderSource = config.source
    const success = this.compileProgram()

    // If playing, trigger a redraw
    if (success && this.isPlaying) {
      this.draw()
    }

    return success
  }

  setHSV(hsv) {
    if (hsv.hue !== undefined) this.hsv.hue = hsv.hue
    if (hsv.saturation !== undefined) this.hsv.saturation = hsv.saturation
    if (hsv.brightness !== undefined) this.hsv.brightness = hsv.brightness

    // Update immediately if not playing
    if (!this.isPlaying && this.program && this.mesh) {
      this.draw()
    }
  }

  setHue(val) {
    this.hsv.hue = val

    // Update immediately if not playing
    if (!this.isPlaying && this.program && this.mesh) {
      this.draw()
    }
  }

  setSaturation(val) {
    this.hsv.saturation = val

    // Update immediately if not playing
    if (!this.isPlaying && this.program && this.mesh) {
      this.draw()
    }
  }

  setBrightness(val) {
    this.hsv.brightness = val

    // Update immediately if not playing
    if (!this.isPlaying && this.program && this.mesh) {
      this.draw()
    }
  }

  getHSV() {
    return { ...this.hsv }
  }
  // New speed methods
  setSpeed(val) {
    this._speed = Math.max(0, val)

    // Update immediately if not playing
    if (!this.isPlaying && this.program && this.mesh) {
      this.draw()
    }
  }

  getSpeed() {
    return this._speed
  }

  setFrameRate(fps) {
    this.targetFPS = Math.max(1, Math.min(60, fps))
    this.frameInterval = 1000 / this.targetFPS
  }

  getFrameRate() {
    return this.targetFPS
  }

  setPixelRatio(pixelRatio) {
    this._pixelRatio = Math.max(0.25, Math.min(2, pixelRatio))

    if (this.renderer) {
      this.resize()
      if (!this.isPlaying && this.program && this.mesh) {
        this.draw()
      }
    }
  }

  getPixelRatio() {
    return this._pixelRatio
  }

  setOnDraw(callback) {
    this.onDrawCallback = callback
  }

  time() {
    return (this.prevDrawTime - this.firstDrawTime) * 0.001 * this._speed
  }

  isPlayingState() {
    return this.isPlaying
  }

  reset() {
    const now = Date.now()
    this.firstDrawTime = now
    this.prevDrawTime = now
    this.lastFrameTime = now
    this.iFrame = 0
    this.draw()
  }

  pause() {
    this.isPlaying = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = 0
    }
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true
      const now = Date.now()
      const elapsed = this.prevDrawTime - this.firstDrawTime
      this.firstDrawTime = now - elapsed
      this.prevDrawTime = now
      this.lastFrameTime = now
      this.draw()
      this.animationFrameId = requestAnimationFrame(this.animate)
    }
  }

  dispose() {
    this.pause()
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    this.removeEventListeners.forEach((remove) => remove())
    this.removeEventListeners = []
    this.program?.remove()
    this.program = null
    this.mesh = null
    this.geometry.remove()

    if (this.renderer.gl.canvas.parentElement) {
      this.renderer.gl.canvas.parentElement.removeChild(this.renderer.gl.canvas)
    }
  }

  // Getters and Setters
  get mouseMode() {
    return this._mouseMode
  }

  set mouseMode(val) {
    this._mouseMode = val
  }
  get speed() {
    return this._speed
  }

  set speed(val) {
    this.setSpeed(val)
  }

  // New mouse sensitivity methods
  setMouseSensitivity(sensitivity) {
    this._mouseSensitivity = Math.max(0.1, Math.min(5.0, sensitivity)) // Clamp between 0.1 and 5.0
  }

  getMouseSensitivity() {
    return this._mouseSensitivity
  }

  // New mouse damping methods
  setMouseDamping(damping) {
    this._mouseDamping = Math.max(0, Math.min(0.99, damping)) // Clamp between 0 and 0.99
  }

  getMouseDamping() {
    return this._mouseDamping
  }
}
