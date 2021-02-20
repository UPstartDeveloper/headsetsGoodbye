// @see https://vuepress.vuejs.org/guide/basic-config.html
const path = require('path')

/**
 * Setup a dynamic config, based on the --dest
 * - If --dest === build/extension then we'll use an extension config
 */
let disableAnalytics = false
disableAnalytics = process.argv.some(arg => arg === 'build/extension')
  || process.env.NODE_ENV !== 'production'

// Remove analytics if the flag is present
const plugins = {
  plausible: {domain: 'handsfree.js.org'}
}
if (disableAnalytics) {
  delete plugins.plausible
}

/**
 * Export our config
 */
module.exports = {
  dest: 'build/docs',

  // Meta
  title: 'Handsfree.js',
  description: 'Add face, hand, and pose tracking to your projects, create handsfree user experiences, and tap into our growing library of plugins and integrations ✨👌',
  head: [
    ['link', {rel: 'icon', href: '/favicon.png'}],

    ['meta', {property: 'og:type', content: 'website'}],
    ['meta', {property: 'og:url', content: 'https://handsfree.js.org/'}],
    ['meta', {property: 'og:image', content: 'https://i.imgur.com/A9g8rfp.jpg'}],
    ['meta', {property: 'og:title', content: 'Handsfree.js'}],
    ['meta', {property: 'og:description', content: 'Add face, hand, and pose tracking to your projects, create handsfree user experiences, and tap into our growing library of plugins and integrations ✨👌'}],
    
    ['meta', {property: 'twitter:card', content: 'summary_large_image'}],
    ['meta', {property: 'twitter:image', content: 'https://i.imgur.com/A9g8rfp.jpg'}],
    ['meta', {property: 'twitter:site', content: '@Midiblocks'}]
  ],

  alias: {
    styles: path.resolve(__dirname, './styles'),
    public: path.resolve(__dirname, './public')
  },

  plugins,

  configureWebpack: {
    resolve: {
      alias: {
        '@handsfree': path.resolve(__dirname, '../../src'),
        '@components': path.resolve(__dirname, './components')
      }
    }
  },

  thirdPartyComponents: {
    // @see https://github.com/HiYue/vuepress-component-font-awesome#generate-specified-icons-only
    fontAwesomeIcons: {
      regular: ['video'],
      solid: ['spinner', 'video', 'video-slash', 'crosshairs']
    }
  },
  
  globalUIComponents: [
    'Handsfree'
  ],
  
  themeConfig: {
    logo: '/branding/handsfree.png',
    lastUpdated: 'Last Updated',
    
    repo: 'midiblocks/handsfree',
    docsDir: 'docs',
    editLinks: true,
    
    sidebarDepth: 1,
    sidebar: [
      {
        title: '🏠 Home',
        collapsable: true,
        path: '/'
      },
      {
        title: '📦 Models',
        path: '/ref/model/',
        collapsable: true,
        children: [
          ['/ref/model/hands.md', '🖐 Hands (2D)'],
          ['/ref/model/handpose.md', '🖐 Handpose (3D)'],
          ['/ref/model/facemesh.md', '😏 FaceMesh'],
          ['/ref/model/pose.md', '🤸‍♀️ Pose'],
          ['/ref/model/weboji.md', '😉 Weboji'],
        ]
      },
      {
        title: '🖖 Create Gestures',
        collapsable: true,
        path: '/gesture/'
      },
      {
        title: '🎮 Examples',
        collapsable: true,
        path: '/example/',
        children: [
          {
            title: 'A-Frame',
            path: '/example/aframe/',
            collapsable: true,
            children: [
              ['/example/aframe/look-around-handsfree.md', '"Look around" handsdfree']
            ]
          }
        ]
      },
      {
        title: '📋 Guides',
        collapsable: true,
        path: '/guide/',
        children: [
          ['/guide/the-loop.md', '🔌 Plugins and the main loop'],
          ['/guide/updating-configs.md', '🎭 Updating and switching models'],
          // ['/guide/working-with-gestures/', '🖖 Working with gestures'],
          {
            title: '📰 Blogs & Articles',
            collapsable: false,
            path: '/guide/misc/',
            children: [
              ['/guide/misc/intro.md', 'Introducing Handsfree.js - Integrate hand, face, and pose gestures to your frontend']
            ]
          }
        ]
      },
      {
        title: '📚 Reference',
        path: '/ref/',
        collapsable: true,
        children: [
          {
            title: '⚡ Events',
            path: '/ref/event/',
            collapsable: true,
            children: [
              ['/ref/event/handsfree-data.md', 'handsfree-data'],
              ['/ref/event/handsfree-gotUserMedia.md', 'handsfree-gotUserMedia'],
              ['/ref/event/handsfree-init.md', 'handsfree-init'],
              ['/ref/event/handsfree-loading.md', 'handsfree-loading'],
              ['/ref/event/handsfree-modelError.md', 'handsfree-modelError'],
              ['/ref/event/handsfree-modelReady.md', 'handsfree-modelReady'],
            ]
          },
          {
            title: '💻 Methods',
            path: '/ref/method/',
            collapsable: true,
            children: [
              ['/ref/method/disablePlugins.md', '.disablePlugins()'],
              ['/ref/method/emit.md', '.emit()'],
              ['/ref/method/enablePlugins.md', '.enablePlugins()'],
              ['/ref/method/hideDebugger.md', '.hideDebugger()'],
              ['/ref/method/normalize.md', '.normalize()'],
              ['/ref/method/on.md', '.on()'],
              ['/ref/method/pause.md', '.pause()'],
              ['/ref/method/runPlugins.md', '.runPlugins()'],
              ['/ref/method/showDebugger.md', '.showDebugger()'],
              ['/ref/method/start.md', '.start()'],
              ['/ref/method/stop.md', '.stop()'],
              ['/ref/method/throttle.md', '.throttle()'],
              ['/ref/method/TweenMax.md', '.TweenMax()'],
              ['/ref/method/update.md', '.update()'],
              ['/ref/method/unpause.md', '.unpause()'],
              ['/ref/method/use.md', '.use()'],
              ['/ref/method/useGesture.md', '.useGesture()'],
            ]
          },
          {
            title: '🔌 Plugins',
            path: '/ref/plugin/',
            collapsable: true,
            children: [
              ['/ref/plugin/faceClick.md', 'faceClick'],
              ['/ref/plugin/facePointer.md', 'facePointer'],
              ['/ref/plugin/faceScroll.md', 'faceScroll'],
              ['/ref/plugin/palmPointers.md', 'palmPointers'],
              ['/ref/plugin/pinchers.md', 'pinchers'],
              ['/ref/plugin/pinchScroll.md', 'pinchScroll'],
            ]
          },
          {
            title: '🧬 Properties',
            path: '/ref/prop/',
            collapsable: true,
            children: [
              ['/ref/prop/config.md', '.config'],
              ['/ref/prop/data.md', '.data'],
              ['/ref/prop/debug.md', '.debug'],
              ['/ref/prop/id.md', '.id'],
              ['/ref/prop/isLooping.md', '.isLooping'],
              ['/ref/prop/model.md', '.model'],
              ['/ref/prop/plugin.md', '.plugin'],
              ['/ref/prop/taggedPlugins.md', '.taggedPlugins'],
              ['/ref/prop/version.md', '.version'],
            ]
          },
          {
            title: '🧰 Utilities',
            path: '/ref/util/',
            collapsable: true,
            children: [
              ['/ref/util/classes.md', '🎨 Classes']
            ]
          }
        ]
      },
      // {
      //   title: '🌐 Handsfree Browser Extension (in development)',
      //   collapsable: true,
      //   path: '/extension/'
      // },
      {
        title: '🤝 Community',
        collapsable: true,
        path: '/community/',
        children: [
          ['https://github.com/midiblocks/handsfree', 'GitHub'],
          ['https://discord.gg/JeevWjTEdu', 'Discord'],
          ['https://twitter.com/midiblocks', 'Twitter'],
          ['https://www.getrevue.co/profile/midiblocks', '📧 Newsletter']
        ]
      },
      {
        title: 'About',
        collapsable: true,
        path: '/about/'
      }
    ]
  },

  chainWebpack: config => {
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-plain-loader')
        .loader('pug-plain-loader')
        .end()
  },

  markdown: {
    extendMarkdown: md => {
      md.use(require('markdown-it-deflist'))
    }
  }
}