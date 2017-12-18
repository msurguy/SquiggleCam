let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */
mix.copy('src/index.html', 'dist/index.html' );

mix.js('src/app.js', 'dist/')
  .sass('src/app.scss', 'dist/');

mix.js('src/imageAnalyzer.js', 'dist/');

//mix.browserSync('webcam-example.dev');
const LiveReloadPlugin = require('webpack-livereload-plugin');
mix.webpackConfig({
  plugins: [
    new LiveReloadPlugin()
  ]
});

