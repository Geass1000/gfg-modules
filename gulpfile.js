const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const del = require("del");

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean:dist', function () {
  return del('./dist/*', { force: true });
});

const lintConfig = {
  configuration: "./tslint.json",
  formatter: "verbose",
};
const lintReportConfig = {
  emitError: false,
  summarizeFailureOutput: true,
  reportLimit: 10,
};

gulp.task('tslint:dev', function () {
  return gulp.src('./src/**/*.ts')
    .pipe(tslint(lintConfig))
    .pipe(tslint.report(lintReportConfig));
});


const spawn = require('child_process').spawn;
let node;

gulp.task('server', function(done) {
  if (node) node.kill();
  node = spawn('node', ['./dist/index.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
	done();
});
process.on('exit', function() {
  if (node) node.kill();
});


gulp.task('build:move-jts', gulp.series(function () {
  return gulp.src(['./src/**/*.js', './src/**/*.d.ts'])
    .pipe(gulp.dest('./dist'));
}));

gulp.task('build', gulp.series(function () {
  return gulp.src('./src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('./dist'));
}, 'build:move-jts'));

gulp.task('build:dev', gulp.series('tslint:dev', 'build'));

gulp.task('watch', gulp.series('clean:dist', 'build:dev', 'server', function(done) {
  gulp.watch(['./src/**/*.ts', './src/**/*.js'], gulp.series('build:dev', 'server'));
	done();
}));
