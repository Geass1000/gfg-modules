const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject('tsconfig.json');

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


gulp.task("ts-comp", function () {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest("dist"));
});

gulp.task('watch', gulp.series('ts-comp', 'server', function(done) {
  gulp.watch(['./src/**/*.ts', './src/**/**/*.ts'], gulp.series('ts-comp', 'server'));
	done();
}));
