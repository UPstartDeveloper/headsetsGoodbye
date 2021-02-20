---
sidebarDepth: 1
meta:
  - name: description
    content: Add face, hand, and pose tracking to your projects, create handsfree user experiences, and tap into our growing library of plugins and integrations ✨👌
next: /guide/
---

<div id="hero-video" style="position: relative">
  <h1 class="mb-0"><img alt="Handsfree.js" title="Handsfree.js" src="/branding/handsfree.png"></h1>
  <video muted loop autoplay src="/model-wall.mp4" style="width: 100%"></video>
</div>

<h3 style="padding-top: 2em">Build handsfree User Experiences and add face, hand, and pose tracking to your projects in a snap ✨👌</h3>
<p class="verticle-middle-children space-children text-center">
  <a href="https://github.com/midiblocks/handsfree"><img src="https://img.shields.io/github/stars/midiblocks/handsfree?style=social"></a>
  <a href="https://github.com/midiblocks/handsfree"><img src="https://img.shields.io/github/last-commit/handsfreejs/handsfree.svg"></a>
  <a href="https://github.com/midiblocks/handsfree"><img src="https://img.shields.io/github/tag/handsfreejs/handsfree.svg"></a>
  <a href="https://github.com/midiblocks/handsfree"><img src="https://img.shields.io/github/repo-size/handsfreejs/handsfree.svg"></a>
</p>

---

```js
// Enable Mediapipe's "Hands" model
const handsfree = new Handsfree({hands: true})
// Enable plugins tagged with "browser"
handsfree.enablePlugins('browser')
// Start tracking
handsfree.start()
```
<Window title="Demo: Scroll pages handsfree">
  <div class="row">
    <div class="col-6"><img src="https://media4.giphy.com/media/tQ1vFtoMWWpgdCoJJj/giphy.gif"></div>
    <div class="col-6">
      <h2>Scroll pages handsfree!</h2>
      <ul>
        <li>👌 Pinch your thumb and index to grab the page</li>
        <li>↕ While pinched, move hand up and down to scroll page</li>
      </ul>
      <HandsfreeToggle class="full-width handsfree-hide-when-started-without-hands" text-off="Scroll page with hands" text-on="Stop Hands" :opts="demoOpts" />
      <button class="handsfree-show-when-started-without-hands handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
      <button class="handsfree-show-when-started-without-hands handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Scroll page with hands</button>
    </div>
  </div>
</Window>

<blockquote>
  <div class="verticle-middle-children space-children text-center">
    <strong>Powered by</strong>
    <a href="https://www.tensorflow.org/js/"><img src='/branding/tensorflow.png' height=30></a>
    <a href="https://mediapipe.dev/"><img src='/branding/mediapipe.png' height=30></a>
    <a href="https://github.com/jeeliz/jeelizWeboji"><img src='/branding/jeeliz.png' height=30></a>
  </div>
  <hr style="margin: 20px auto">
  <div class="text-center">
    <strong>Special thanks to:</strong> <a href="https://studioforcreativeinquiry.org/">The STUDIO for Creative Inquiry</a>, <a href="https://glitch.com">Glitch.com</a>, <a href="https://research.google/teams/brain/pair/">Google PAIR</a>, and you!
  </div>
</blockquote>

## Installing
<TabPanel :tabs="tabs.installing">
<div data-panel="CDN">
<p><strong>Note:</strong> Some models are over 10Mb+ and may take a few seconds to load.</p>
<div class="language-html extra-class"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- Include Handsfree.js --&gt;</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>stylesheet<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://unpkg.com/handsfree@8.4.0/build/lib/assets/handsfree.css<span class="token punctuation">"</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://unpkg.com/handsfree@8.4.0/build/lib/handsfree.js<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
&nbsp;
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- Instantiate and start it --&gt;</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
    <span class="token keyword">const</span> handsfree <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Handsfree</span><span class="token punctuation">(</span><span class="token punctuation">{</span>hands<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
    handsfree<span class="token punctuation">.</span><span class="token function">enablePlugins</span><span class="token punctuation">(</span><span class="token string">'browser'</span><span class="token punctuation">)</span>
    handsfree<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
</code></pre></div>
</div>
<div data-panel="NPM" class="hidden">
<div class="language-bash extra-class"><pre class="language-bash"><code><span class="token comment"># From your projects root</span>
<span class="token function">npm</span> i handsfree
</code></pre></div>
<div class="language-js extra-class"><pre class="language-js"><code><span class="token comment">// Inside your app</span>
<span class="token keyword">import</span> Handsfree <span class="token keyword">from</span> <span class="token string">'handsfree'</span>
&nbsp;
<span class="token keyword">const</span> handsfree <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Handsfree</span><span class="token punctuation">(</span><span class="token punctuation">{</span>hands<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
handsfree<span class="token punctuation">.</span><span class="token function">enablePlugins</span><span class="token punctuation">(</span><span class="token string">'browser'</span><span class="token punctuation">)</span>
handsfree<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre></div>
<h3>Hosting the models yourself</h3>
<p>By default, and for simplicity, the above will load models from the <a href="https://unpkg.com/browse/handsfree@8.4.0/build/lib/assets">Unpkg CDN</a>. This can be very slow. To host the models yourself (and to use offline) you can eject the models from the npm package into your project's public folder:</p>
<div class="language-bash extra-class"><pre class="language-bash"><code><span class="token comment"># Move the models into your project's public directory</span>
<span class="token comment"># - change PUBLIC below to where you keep your project's assets</span>
&nbsp;
<span class="token comment"># ON WINDOWS</span>
xcopy /e node_modules<span class="token punctuation">\</span>handsfree<span class="token punctuation">\</span>build<span class="token punctuation">\</span>lib PUBLIC
<span class="token comment"># EVERYWHERE ELSE</span>
<span class="token function">cp</span> -r node_modules/handsfree/build/lib/* PUBLIC
</code></pre></div>
<div class="language-js extra-class"><pre class="language-js"><code><span class="token keyword">import</span> Handsfree <span class="token keyword">from</span> <span class="token string">'handsfree'</span>
&nbsp;
<span class="token keyword">const</span> handsfree <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Handsfree</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  hands<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token comment">// Set this to your where you moved the models into</span>
  assetsPath<span class="token operator">:</span> <span class="token string">'/PUBLIC/assets'</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
handsfree<span class="token punctuation">.</span><span class="token function">enablePlugins</span><span class="token punctuation">(</span><span class="token string">'browser'</span><span class="token punctuation">)</span>
handsfree<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre></div>
</div>
</TabPanel>

## Models
<ModelList />

## Quickstart Workflow

The following workflow demonstrates how to use all features of Handsfree.js. Check out the [Guides](/guides/) and [References](/ref/) to dive deeper, and feel free to post on the [Google Groups](https://groups.google.com/g/handsfreejs) or [Discord](https://discord.gg/JeevWjTEdu) if you get stuck!

```js
// Let's enable face tracking with the default Face Pointer
const handsfree = new Handsfree({weboji: true})
handsfree.enablePlugins('browser')

// Now let's start things up
handsfree.start()

// Let's create a plugin called "logger"
// - Plugins run on every frame and is how you "plug in" to the main loop
// - "this" context is the plugin itself. In this case, handsfree.plugin.logger
handsfree.use('logger', data => {
  console.log(data.weboji.morphs, data.weboji.rotation, data.weboji.pointer, data, this)
})

// Let's switch to hand tracking now. To demonstrate that you can do this live,
// let's create a plugin that switches to hand tracking when both eyebrows go up
handsfree.use('handTrackingSwitcher', ({weboji}) => {
  if (weboji.state.browsUp) {
    // Disable this plugin
    // Same as handsfree.plugin.handTrackingSwitcher.disable()
    this.disable()

    // Turn off face tracking and enable hand tracking
    handsfree.update({
      weboji: false,
      hands: true
    })
  }
})

// You can enable and disable any combination of models and plugins
handsfree.update({
  // Disable weboji which is currently running
  weboji: false,
  // Start the pose model
  pose: true,

  // This is also how you configure (or pre-configure) a bunch of plugins at once
  plugin: {
    fingerPointer: {enabled: false},
    faceScroll: {
      vertScroll: {
        scrollSpeed: 0.01
      }
    }
  }
})

// Disable all plugins
handsfree.disablePlugins()
// Enable only the plugins for making music (not actually implemented yet)
handsfree.enablePlugins('music')

// Overwrite our logger to display the original model APIs
handsfree.plugin.logger.onFrame = (data) => {
  console.log(handsfree.model.pose?.api, handsfree.model.weboji?.api, handsfree.model.pose?.api)
}
```
<!-- 
## Examples

<div class="row align-top">
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">I remixed <a href="https://twitter.com/notwaldorf?ref_src=twsrc%5Etfw">@notwaldorf</a>&#39;s Piano Genie so that you can jam out with your fingers through a webcam 🖐🎹🖐<br><br>Try it on <a href="https://twitter.com/glitch?ref_src=twsrc%5Etfw">@Glitch</a>: <a href="https://t.co/CvrOboC5tV">https://t.co/CvrOboC5tV</a><br><br>Or see the source: <a href="https://t.co/ffWG92OEm2">https://t.co/ffWG92OEm2</a><br><br>Remixed by simply using the &quot;Pincher Plugin&quot; of Handsfree.js! <a href="https://twitter.com/hashtag/MediaPipe?src=hash&amp;ref_src=twsrc%5Etfw">#MediaPipe</a> <a href="https://twitter.com/hashtag/MadeWithTFJS?src=hash&amp;ref_src=twsrc%5Etfw">#MadeWithTFJS</a> <a href="https://t.co/lblUgzNl7N">pic.twitter.com/lblUgzNl7N</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1359382512938541057?ref_src=twsrc%5Etfw">February 10, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Day 2 of <a href="https://twitter.com/hashtag/100DaysHandsfree?src=hash&amp;ref_src=twsrc%5Etfw">#100DaysHandsfree</a><br><br>On recommendation I&#39;ve started handsfree-ifying <a href="https://twitter.com/daviddotli?ref_src=twsrc%5Etfw">@daviddotli</a> Blob Opera 🎶 Only works with 1 pinch at a time but it works really well!<br><br>If you&#39;d like to see how I did it, it was just 39 smooth lines of JavaScript: <a href="https://t.co/ho39dwQiqB">https://t.co/ho39dwQiqB</a> <a href="https://t.co/qdoWZD1gJg">pic.twitter.com/qdoWZD1gJg</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1352434377871872006?ref_src=twsrc%5Etfw">January 22, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Been trying to figure out a way to safely sandbox webcam but also render it w/ green wireframes on top of pages<br><br>My solution was to run webcam in a headless Browser Background Script, render it + wireframes onto canvas, then use Picture in Picture API to &quot;pop it outside&quot; browser! <a href="https://t.co/dZDStQ6BFq">pic.twitter.com/dZDStQ6BFq</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1344466561222889472?ref_src=twsrc%5Etfw">December 31, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">I made Handsfree Jenga 🧱👌<br><br>It&#39;s kinda buggy still but this demos how to use Hand Pointers to interact w/ physics in a Three.js scene <a href="https://twitter.com/hashtag/MadeWithTFJS?src=hash&amp;ref_src=twsrc%5Etfw">#MadeWithTFJS</a><br><br>Try it: <a href="https://t.co/ACuamUga0r">https://t.co/ACuamUga0r</a><br>Handsfree.js hook: <a href="https://t.co/UybmDLnVFE">https://t.co/UybmDLnVFE</a><br>Docs: <a href="https://t.co/WpNd3kLp8r">https://t.co/WpNd3kLp8r</a> <a href="https://t.co/bEdi5Gm5z7">pic.twitter.com/bEdi5Gm5z7</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1334667133779755008?ref_src=twsrc%5Etfw">December 4, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">The Handsfree.js repo can itself be loaded as an unpacked Chrome Extensions: <a href="https://t.co/8RFl3yR0uA">https://t.co/8RFl3yR0uA</a><br><br>So if you&#39;d like to go that route, all the heavy work is already done for you. Additionally, with WebSockets and Robot.js, you can control your desktop too! <a href="https://t.co/m7Xunc0pfq">pic.twitter.com/m7Xunc0pfq</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1357799020521902080?ref_src=twsrc%5Etfw">February 5, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">This newer rewrite does less out the box but will be way more extensible<br><br>You can use it with Robot.js or other desktop automation libraries to control your desktop/devices. Here&#39;s an older demo of that (will share code to this soon) <a href="https://t.co/ShoAwHGGHu">pic.twitter.com/ShoAwHGGHu</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1326763862457274368?ref_src=twsrc%5Etfw">November 12, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Here&#39;s a 30sec video w positioning &amp; smoothing<br><br>On the right is my Chrome Dev Tools opened to the <a href="https://twitter.com/hashtag/WebXR?src=hash&amp;ref_src=twsrc%5Etfw">#WebXR</a> tab that comes with the Mozilla Emulator Extension with the new Handsfree button 🖐👀🖐<br><br>Thanks to <a href="https://twitter.com/i0nif?ref_src=twsrc%5Etfw">@i0nif</a> for the enthusiastic idea &amp; vision! Repo + docs + more after holidays <a href="https://t.co/rdV9MIjUBk">pic.twitter.com/rdV9MIjUBk</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1342356735814553600?ref_src=twsrc%5Etfw">December 25, 2020</a></blockquote>
  </div>
  <div class="col-6">
    <Window title="Flappy Pose" :maximize="true">
      <section>
        <div>
          <router-link to="/ref/plugin/pinchScroll/"><img alt="Person playing Flappy Bird by flapping their arms. Flappy Bird is a game where you must flap the birds wings to fly or dodge barriers" src="https://media3.giphy.com/media/gUHHKdnuOW4OGOXcrI/giphy.gif"></router-link>
        </div>
        <p>In this game, the goal is to flap your arms to get the bird to fly around dodging obstacles. Made with an older version of Handsfree, but the API is very similar!</p>
        <div>
          <ul>
            <li><a href="https://flappy-pose.glitch.me/">Try it on Glitch</a></li>
            <li><a href="https://glitch.com/edit/#!/flappy-pose?path=src%2Fflap.js%3A32%3A4">See the source</a></li>
          </ul>
        </div>
      </section>
    </Window>
  </div>
</div> -->


<!-- Code -->
<script>
export default {
  data () {
    return {
      demoOpts: {
        autostart: true,
        
        weboji: false,
        hands: true,
        facemesh: false,
        pose: false,
        handpose: false,

        plugin: {
          pinchScroll: {enabled: true},
          palmPointers: {enabled: true}
        }
      },

      tabs: {
        installing: ['CDN', 'NPM']
      }
    }
  },


  // Render tweets
  mounted () {
    // const $script = document.createElement('script')
    // $script.src = 'https://platform.twitter.com/widgets.js'
    // document.body.appendChild($script)
  },

  methods: {
    /**
     * Start the page with our preset options
     */
    startDemo () {
      this.$root.handsfree.update(this.demoOpts)
    }
  }
}
</script>


<style>
  #hero-video {
    margin-bottom: 1em;
  }
  #hero-video h1 {
    position: absolute;
    top: 50%;
    transform: translateY(-75%);
    padding: 3%  20% 2% 20%;
    background: rgba(34,34,34, 25%);
    background: linear-gradient(90deg, rgba(34,34,34,0) 0%, rgba(34,34,34,1) 40%, rgba(34,34,34,1) 50%, rgba(34,34,34,1) 60%, rgba(34,34,34,0) 100%)
  }
</style>