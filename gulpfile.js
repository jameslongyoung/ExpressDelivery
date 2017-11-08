/**
 * Created by wx_swjtu on 2017/9/5.
 */
var gulp=require("gulp");
var less=require("gulp-less");
var concat=require("gulp-concat");
var minCss=require("gulp-minify-css");
var rename=require("gulp-rename");
var postcss=require("gulp-postcss");
var sourcemaps=require("gulp-sourcemaps");
var gulp = require("gulp");
var babel = require("gulp-babel");
var exec=require("child_process").exec;
var minifycss=require('gulp-minify-css');
uglify=require('gulp-uglify');


gulp.task('minifycss',function(){
    return gulp.src('public/stylesheets/*.css')      //设置css     //合并css文件到"order_query"
        .pipe(minifycss())                    //压缩文件
        .pipe(gulp.dest('public/styles'))            //输出文件目录
});

gulp.task('minifyjs',function(){
    return gulp.src('public/javascripts/*.js')
        .pipe(uglify())                    //压缩
        .pipe(gulp.dest('dist/js'))            //输出
});

gulp.task("lessCompiler",function () {
    gulp.src(['public/less/*.less'])
        .pipe(less())
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task("watchLess",function () {
    gulp.watch('public/less/*.less',['lessCompiler']);
});

gulp.task("auto",['lessCompiler','watchLess'],function () {
    console.log("Success");
});

gulp.task("webpack",[],function () {
    exec("webpack",function (err,stdout,stderr) {
        console.log(err,stdout);
    })
});

gulp.task('postcss', function () {
    postcss    = require('gulp-postcss');
    sourcemaps = require('gulp-sourcemaps');
    return gulp.src('public/stylesheets-v3/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss([ require('autoprefixer') ]) )
        .pipe( gulp.dest('public/stylesheets') );
});

gulp.task("babel", function () {
    return gulp.src("public/javascripts-es6/*.js")// ES6 源码存放的路径
        .pipe(babel())
        .pipe(gulp.dest("public/javascripts")); //转换成 ES5 存放的路径
});

var watcher=gulp.watch("/public/javascripts-es6/*.js",["babel"]);
watcher.on("change",function (event) {
    console.log(event);
})
