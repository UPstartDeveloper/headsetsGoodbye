# The Handsfree Browser Extension

::: warning 🚨 This project is still in development
This Chrome Extension is open sourced at: [https://github.com/midiblocks/handsfree-browser](https://github.com/midiblocks/handsfree-browser)
:::

The Handsfree Browser Extension will be a [userscript manager](https://en.wikipedia.org/wiki/Userscript_manager) like [Tampermonkey](https://www.tampermonkey.net/) but for the purposes of handsfree-ifying websites, including emulating WebXR devices in the browser. Each page by default will get either [Face Pointers](/ref/plugin/facePointer/) or [Palm Pointers](/ref/plugin/palmPointers/), but can be extended for custom gestures as in this selection:

<div class="row align-top">
  <div class="col-6">
    <blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">This is just the start and only a general introduction.<br><br>Every week or so I&#39;ll be sharing new focused tutorials on a specific model and topic, with new demos, boilerplates, &amp; lessons learned<br><br>After ~3yrs I&#39;m excited to begin Phase 2 of my Master Plan of handsfree-ifying the web! <a href="https://t.co/SRXxv2ZQJx">pic.twitter.com/SRXxv2ZQJx</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1345438206074920962?ref_src=twsrc%5Etfw">January 2, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Emulating <a href="https://twitter.com/hashtag/WebXR?src=hash&amp;ref_src=twsrc%5Etfw">#WebXR</a> head and hand tracking at the same time handsfree with nothing but a browser!<br><br>On the left is the web page, on the right is Dev Tools. My head emulates the headset &amp; my hands emulate the controllers<br><br>Handsfree control of the entire 2D &amp; 3D web almost ready 🖐👀🖐 <a href="https://t.co/K8DimRbsWv">pic.twitter.com/K8DimRbsWv</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1350202172193996801?ref_src=twsrc%5Etfw">January 15, 2021</a></blockquote>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Some progress on handsfree-ifying <a href="https://twitter.com/noisedeck?ref_src=twsrc%5Etfw">@noisedeck</a> w the Handsfree Browser Extension<br><br>Each finger controls a different slider<br>- Right 👌 for Hues<br>- Right 🤘 for Loops<br>- Left 👌 for Brightness<br><br>It&#39;ll take a lot of practice &amp; debugging 😅 but idea is control visuals in step with music <a href="https://t.co/AjGvJ4es1W">pic.twitter.com/AjGvJ4es1W</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1351783205142028290?ref_src=twsrc%5Etfw">January 20, 2021</a></blockquote>
  </div>
</div>

## Handsfree WebXR

<div class="row align-top">
  <div class="col-6">
    <Window>
      <iframe src="https://player.vimeo.com/video/494884542" width="100%" height="240" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
      <p>A Chrome Extension that emulates WebXR hardware with computer vision, helping you work on your XR experiences handsfree!</p>
      <ul>
        <li><a href="https://github.com/midiblocks/handsfree-webxr">Get the code on GitHub</a></li>
        <li><a href="https://github.com/MIDIBlocks/handsfree-webxr/archive/dev.zip">Download the latest .zip</a></li>
        <li><a href="https://immersive-web.github.io/webxr-samples/tests/pointer-painter.html">Try it on the WebXR sample page</a></li>
      </ul>
    </Window>
  </div>
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Emulating <a href="https://twitter.com/hashtag/WebXR?src=hash&amp;ref_src=twsrc%5Etfw">#WebXR</a> head and hand tracking at the same time handsfree with nothing but a browser!<br><br>On the left is the web page, on the right is Dev Tools. My head emulates the headset &amp; my hands emulate the controllers<br><br>Handsfree control of the entire 2D &amp; 3D web almost ready 🖐👀🖐 <a href="https://t.co/K8DimRbsWv">pic.twitter.com/K8DimRbsWv</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1350202172193996801?ref_src=twsrc%5Etfw">January 15, 2021</a></blockquote>
  </div>
</div>

## #100DaysHandsfree

The goal of [#100DaysHandsfree](https://twitter.com/hashtag/100DaysHandsfree) is to implement Handsfree.js in as wide a range of sites, web games, and web apps as possible. Each day or so I'll be handsfree-ifying a different website, which you can track below:

<div class="row align-top">
  <div class="col-6">
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Going to start <a href="https://twitter.com/hashtag/100DaysHandsfree?src=hash&amp;ref_src=twsrc%5Etfw">#100DaysHandsfree</a>, where I handsfree-ify 1 website, game, or app everyday with the Handsfree Browser Extension<br><br>By the end of 100 days I hope to have developed a complete framework for using *anything* handsfree 🙌<br><br>Yesterday was Day 1 with <a href="https://t.co/VtZ6M4FrCw">https://t.co/VtZ6M4FrCw</a> <a href="https://t.co/ylMdYWoBWS">https://t.co/ylMdYWoBWS</a></p>&mdash; Oz Ramos (@MIDIBlocks) <a href="https://twitter.com/MIDIBlocks/status/1351987116335534080?ref_src=twsrc%5Etfw">January 20, 2021</a></blockquote>
  </div>
</div>

<script>
export default {
  mounted () {
    const $script = document.createElement('SCRIPT')
    $script.src = 'https://platform.twitter.com/widgets.js'
    document.body.appendChild($script)
  }
}
</script>