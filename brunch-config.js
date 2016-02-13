exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^static\/js\/app/,
        "js/vendor.js": /^(static\/vendor)|(deps)|(bower_components)|(node_modules)/,
        'test/js/test.js': /^test(\/|\\)(?!vendor)/,
        'test/js/test-vendor.js': /^test(\/|\\)(?=vendor)/
      },

      // To change the order of concatenation of files, explicitly mention here
      // https://github.com/brunch/brunch/tree/master/docs#concatenation
      order: {
        after: [
          "static/vendor/js/mobservable-1.2.4.js",
          "static/vendor/js/mobservable-react-2.1.4.js"
        ]
      }
    },
    stylesheets: {
      joinTo: "css/app.css"
    },
    templates: {
      joinTo: "js/app.js"
    }
  },

  conventions: {
    // This option sets where we should place non-css and non-js assets in.
    // By default, we set this to "/web/static/assets". Files in this directory
    // will be copied to `paths.public`, which is "priv/static" by default.
    assets: /^(static\/assets)/
  },

  // Phoenix paths configuration
  paths: {
    // Dependencies and current project directories to watch
    watched: [
      "static",
      "test/static"
    ],

    // Where to compile files to
    public: "public"
  },

  // Configure your plugins
  plugins: {
    babel: {
      presets: ['es2015'],
      plugins: [
        "transform-react-jsx",
        "transform-react-display-name"
      ],
      // Do not use ES6 compiler in vendor code
      ignore: [/static\/vendor/],
      pattern: /\.(js|jsx)$/
    },
    postcss: {
        processors: [
          require('autoprefixer')(['last 8 versions']),
          require('lost')(),
        ]
    }
  },

  modules: {
    autoRequire: {
      "js/app.js": ["static/js/app/app"]
    }
  },

  npm: {
    enabled: true,
    // Whitelist the npm deps to be pulled in as front-end assets.
    // All other deps in package.json will be excluded from the bundle.
    whitelist: ["react", "react-dom"]
  }
};
