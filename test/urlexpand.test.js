/*!
 * urlexpand - test/urlexpand.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var urlexpand = require('../');
var should = require('should');
var http = require('http');

var server = http.createServer(function (req, res) {
  if (req.url === '/error') {
    return res.destroy();
  }
  if (req.url === '/redirect_to_error') {
    res.writeHead(302, {
      Location: '/error'
    });
    return res.end();
  }
  if (req.url === '/notitle') {
    return res.end('<html><body></body></html>');
  }
  if (req.url === '/timeout') {
    return;
  }
});


describe('urlexpand.test.js', function () {

  var serverURL = 'http://127.0.0.1:'
  before(function (done) {
    server.listen(0, function () {
      serverURL += server.address().port;
      done();
    });
  });

  it('should expand http://t.cn/zlpFyQ7 to http://www.infoq.com/cn/news/2012/09/rails-40 with 1 redirect count',
  function (done) {
    urlexpand('http://t.cn/zlpFyQ7', function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', 'http://www.infoq.com/cn/news/2012/09/rails-40');
      data.should.have.property('count', 1);
      data.should.have.property('title', '即将来临的Rails 4.0将放弃Ruby 1.8支持，改进后台任务、缓存等多项内容');
      data.should.have.property('tracks').with.length(2);
      data.tracks[0].should.have.property('statusCode', 302);
      data.tracks[0].should.have.property('url', 'http://t.cn/zlpFyQ7');
      data.tracks[1].should.have.property('statusCode', 200);
      data.tracks[1].should.have.property('url', 'http://www.infoq.com/cn/news/2012/09/rails-40');
      done();
    });
  });

  it('should expand and get gbk title', function (done) {
    urlexpand('http://t.cn/zl0x0IL', function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', 'http://baike.baidu.com/view/6627415.htm');
      data.should.have.property('count', 1);
      data.should.have.property('title', '淘宝指数_百度百科');
      data.should.have.property('tracks').with.length(2);
      data.tracks[0].should.have.property('statusCode', 302);
      data.tracks[0].should.have.property('url', 'http://t.cn/zl0x0IL');
      data.tracks[1].should.have.property('statusCode', 200);
      data.tracks[1].should.have.property('url', 'http://baike.baidu.com/view/6627415.htm');
      done();
    });
  });

  it('should redirect 2, get the last url and title', function (done) {
    urlexpand('http://163.fm/K8dK4c8', function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', 'http://www.geekpark.net/read/view/164281');
      data.should.have.property('count', 2);
      data.should.have.property('title', '七大国内“生产力”社区网站 | 极客公园');
      data.should.have.property('tracks').with.length(3);
      data.tracks[0].should.have.property('statusCode', 302);
      data.tracks[0].should.have.property('url', 'http://163.fm/K8dK4c8');
      data.tracks[1].should.have.property('statusCode', 302);
      data.tracks[1].should.have.property('url', 'http://t.cn/zlVT0Af');
      data.tracks[2].should.have.property('statusCode', 200);
      data.tracks[2].should.have.property('url', 'http://www.geekpark.net/read/view/164281');
      done();
    });
  });

  it('should only redirect once and get the last url but no title', function (done) {
    urlexpand('http://url.cn/8pBPLK', { redirects: 1 }, function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', 'http://instagram.com/p/QhLtWhB_A1/');
      data.should.have.property('count', 2);
      data.should.not.have.property('title');
      data.should.have.property('tracks').with.length(2);
      data.tracks[0].should.have.property('headers').with.be.a('object');
      data.tracks[0].should.have.property('statusCode', 302);
      data.tracks[0].should.have.property('url', 'http://url.cn/8pBPLK');
      data.tracks[1].should.have.property('statusCode', 301);
      data.tracks[1].should.have.property('url', 'http://instagr.am/p/QhLtWhB_A1/');
      done();
    });
  });

  it('should get the url and title with no redirect', function (done) {
    urlexpand('http://www.taobao.com/', function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', 'http://www.taobao.com/');
      data.should.have.property('count', 0);
      data.should.have.property('title', '淘宝网 - 淘！我喜欢');
      data.should.have.property('tracks').with.length(1);
      data.tracks[0].should.have.property('headers').with.be.a('object');
      data.tracks[0].should.have.property('statusCode', 200);
      data.tracks[0].should.have.property('url', 'http://www.taobao.com/');
      done();
    });
  });

  it('should only get the url with no redirect', function (done) {
    urlexpand('http://www.taobao.com/', { title: false }, function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', 'http://www.taobao.com/');
      data.should.have.property('count', 0);
      data.should.not.have.property('title');
      data.should.have.property('tracks').with.length(1);
      data.tracks[0].should.have.property('headers').with.be.a('object');
      data.tracks[0].should.have.property('statusCode', 200);
      data.tracks[0].should.have.property('url', 'http://www.taobao.com/');
      done();
    });
  });

  it('should handle https as well', function (done) {
    urlexpand('https://t.co/DltTy9tA', function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', 'https://github.com/visionmedia/better-assert');
      data.should.have.property('count', 1);
      data.should.have.property('title', 'visionmedia/better-assert · GitHub');
      data.should.have.property('tracks').with.length(2);
      done();
    });
  });

  it('should return no title', function (done) {
    urlexpand(serverURL + '/notitle', function (err, data) {
      should.not.exist(err);
      should.exist(data);
      data.should.have.property('url', serverURL + '/notitle');
      data.should.have.property('count', 0);
      data.should.have.property('title', null);
      done();
    });
  });

  it('should return error when request /error', function (done) {
    urlexpand(serverURL + '/error', function (err, data) {
      should.exist(err);
      should.exist(data);
      data.should.have.property('url', serverURL + '/error');
      data.should.have.property('count', 0);
      data.should.not.have.property('title');
      data.should.have.property('tracks').with.length(1);
      data.tracks[0].should.have.property('error', 'socket hang up');
      done();
    });
  });

  it('should return error when request /redirect_to_error', function (done) {
    urlexpand(serverURL + '/redirect_to_error', function (err, data) {
      should.exist(err);
      should.exist(data);
      data.should.have.property('url', serverURL + '/error');
      data.should.have.property('count', 1);
      data.should.not.have.property('title');
      data.should.have.property('tracks').with.length(2);
      data.tracks[0].should.have.property('statusCode', 302);
      data.tracks[0].should.have.property('url', serverURL + '/redirect_to_error');
      data.tracks[1].should.have.property('error', 'socket hang up');
      done();
    });
  });

  it('should return timeout error when request /timeout', function (done) {
    urlexpand(serverURL + '/timeout', { timeout: 500 }, function (err, data) {
      should.exist(err);
      should.exist(data);
      data.should.have.property('url', serverURL + '/timeout');
      data.should.have.property('count', 0);
      data.should.not.have.property('title');
      data.should.have.property('tracks').with.length(1);
      data.tracks[0].should.have.property('error', 'request timeout');
      done();
    });
  });

});