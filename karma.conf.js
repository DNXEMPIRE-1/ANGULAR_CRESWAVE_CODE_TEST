module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-sourcemap-loader"),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage/"),
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      sourcemap: true,
      sourcemapMiddleware: (options) => {
        const sourcemapPath = path.join(__dirname, "..", "src", "app");
        options.prefix = "";
        options.sources.forEach((source, i) => {
          options.sources[i] = source.replace(
            /^webpack:\/\/\/src\//,
            "../src/app/"
          );
        });
        return (req, res, next) => {
          if (req.url.startsWith("/base/src/app/")) {
            req.url = req.url.replace(/^\/base\/src\/app\//, "");
            return middleware(options)(req, res, next);
          } else if (req.url.startsWith("/base/node_modules/")) {
            req.url = req.url.replace(/^\/base\/node_modules\//, "");
            return middleware(options)(req, res, next);
          } else if (req.url.endsWith(".js.map")) {
            req.url = req.url.replace(/^\/base\//, "/");
            return middleware(options)(req, res, next);
          }
          next();
        };
      },
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
  });
};
