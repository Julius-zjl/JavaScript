/*ziye
******************************************************************************
固定ck版，可N个账号，无外部通知，BOX 设置为0 日常任务，设置为1 单开宝箱

github地址     https://github.com/ziye12/JavaScript
TG频道地址     https://t.me/ziyescript
TG交流群       https://t.me/joinchat/AAAAAE7XHm-q1-7Np-tF3g
boxjs链接      https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/ziye.boxjs.json
完整版         https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js

本人github地址     https://github.com/ziye12/JavaScript 
转载请备注个名字，谢谢

12.28 固定ck版,增加外部通知，默认12点以及23.40通知，解决宝箱翻倍问题，解决手机端运行异常问题
12.28 解决通知问题，notifyInterval     0为关闭通知，1为所有通知，2为12 23 点通知  ， 3为 6 12 18 23 点通知 
12.28 增加 无通知时打印通知
12.29 修复手机通知问题，增加外部推送开关


⚠️cookie获取方法：

进 https://m.q.qq.com/a/s/d3eacc70120b9a37e46bad408c0c4c2a  点我的   获取cookie

进一本书 看 10秒以下 然后退出，获取阅读时长cookie，看书一定不能超过10秒

可能某些页面会卡住，但是能获取到cookie，再注释cookie重写就行了！



⚠️宝箱奖励为20分钟一次，自己根据情况设置定时，建议设置11分钟一次

hostname=mqqapi.reader.qq.com
############## 圈x
#企鹅读书获取更新body
https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track url script-request-body https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js
#企鹅读书获取时长cookie
https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid? url script-request-header https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js

############## loon
#企鹅读书获取更新body
http-request https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js,requires-body=true, tag=企鹅读书获取更新body
#企鹅读书获取时长cookie
http-request https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid? script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, requires-header=true, tag=企鹅读书获取时长cookie

############## surge
#企鹅读书获取更新body
企鹅读书获取更新body = type=http-request,pattern=https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track,script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, 
#企鹅读书获取时长cookie
企鹅读书获取时长cookie = type=http-request,pattern=https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid?,script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, 



*/

const BOX = 1;//设置为0 日常任务，设置为1 单开宝箱

const jsname = '企鹅读书'
const $ = Env(jsname)
let task ,tz, kz,config = '';

console.log(`\n========= 脚本执行时间(TM)：${new Date(new Date().getTime() + 0 * 60 * 60 * 1000).toLocaleString('zh', {hour12: false})} =========\n`)
const notify = $.isNode() ? require("./sendNotify") : "";
const notifyttt = 1// 0为关闭外部推送，1为12 23 点外部推送
const notifyInterval = 2;// 0为关闭通知，1为所有通知，2为12 23 点通知  ， 3为 6 12 18 23 点通知 
const logs = 0;   //0为关闭日志，1为开启
const maxtime = 10//每日上传时长限制，默认20小时
const wktimess = 1200//周奖励领取标准，默认1200分钟
const CASH = 10;//提现金额 可设置0 1 2 10 30 50 100  设置0关闭

//在``里面填写，多账号换行
let qqreadbodyVal=`{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.32.5","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"53CBF73AE733CF270CD62D4F52AC0A9A","guid":1449378729,"session":"bjkvuse6qwdmqmjjjm8d12p1e7k376gf","scene":2016,"source":"wza0006wzb0004","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookLib2_bookList_bookClick_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"23406185","cid":"1"},"dis":1607478590982,"ext6":35,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"23406185","bookStatus":0,"bookPay":1,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"bookLib2_bookList_bookClick_C_0_23406185"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.32.5","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"992AE2748FCA46F4E61E6C53E6DA99CE","guid":2717294296,"session":"gd9spty4b60x585ogupvs3tk5k7d2p5f","scene":1005,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookLib2_bookList_bookClick_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"31685038","cid":"1"},"dis":1607482321929,"ext6":44,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"31685038","bookStatus":0,"bookPay":1,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"bookLib2_bookList_bookClick_C_2_31685038"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.32.5","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"D2A78C7F298B00789122202EDB571AFC","guid":731492518,"session":"0ygoi8p06j5r0oreu3mwmyuvpkuso7c4","scene":1005,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"321028","cid":"1"},"dis":1607482676368,"ext6":63,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"321028","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1005_321028"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.32.5","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"5FFD6BE376023D336E94E73EF767F034","guid":3092996392,"session":"e5xwtl0bbismqfzio5mhmilf4eyl5xmw","scene":1005,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"20706597","cid":"1"},"dis":1607484391042,"ext6":76,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"20706597","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1005_20706597"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.32.5","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"B6A0E394039D69E6DCA85885EC1F6420","guid":1476095443,"session":"r0sdspoko5zseqe0yddw8si5y2m8kwxy","scene":1005,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"20706597","cid":"1"},"dis":1607484565598,"ext6":41,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"20706597","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1005_20706597"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.33.3","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"DFBDDB2D573AC736432B642F5F1E5186","guid":935637944,"session":"0cvxqjd8gyiv9nbpuwx1k5av9n14ng9s","scene":1007,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"227516","cid":"1"},"dis":1607738228186,"ext6":87,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"227516","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1007_227516"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.33.3","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"BFC6033BB860E854D22A676F6BC59087","guid":2180142772,"session":"nvgxmcalhs76yczhrqibjuc1aznf0cnr","scene":1005,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"promoPopwin_close_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"304816","cid":"1"},"dis":1608018353907,"ext6":40,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"304816","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1005_304816"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.33.3","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"F6CD1D90AE8D411604B7F06218DBA154","guid":2489366874,"session":"ormjzqvby5po3f8ck4ot7z0zjs0c97uq","scene":1007,"source":"wza0001wzb0001","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"304816","cid":"1"},"dis":1608018716482,"ext6":61,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"304816","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1007_304816"}]}
{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.33.3","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"7C9ED0BF9B4142DB787C0177BE842E27","guid":2622802412,"session":"lti0em1i3yp4wrfu99gccmawre87ym92","scene":1005,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"promoPopwin_close_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"13629218","cid":"1"},"dis":1608018818419,"ext6":26,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"13629218","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1005_13629218"}]}
{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.3","mp_ver":"0.35.1","mpos_ver":"1.21.0","brand":"iPhone","model":"iPhone 11 Pro<iPhone12,3>","screenWidth":375,"screenHeight":812,"windowWidth":375,"windowHeight":729,"openid":"40958974E1542BF82BF8F859C83FA953","guid":846221802,"session":"cw1a9t50myu5xe9n4j93l2zrdmuws6c5","scene":1027,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"15776750","cid":"1"},"dis":1608219447849,"ext6":91,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"15776750","bookStatus":0,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1027_15776750"}]}`
let qqreadtimeurlVal=`https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=2016&refer=pages%2Fbook-category%2Findex&bid=23406185&readTime=4769&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A4769%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1005&refer=pages%2Fbook-category%2Findex&bid=31685038&readTime=4701&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A4701%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1005&refer=pages%2Findex%2Findex&bid=321028&readTime=3733&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A3733%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1005&refer=pages%2Findex%2Findex&bid=20706597&readTime=5024&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A5024%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1005&refer=pages%2Findex%2Findex&bid=20706597&readTime=5322&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A5322%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=pages%2Findex%2Findex&bid=227516&readTime=5078&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A5078%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1005&refer=pages%2Findex%2Findex&bid=304816&readTime=2960&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A2960%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=pages%2Findex%2Findex&bid=304816&readTime=4049&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A4049%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1005&refer=pages%2Findex%2Findex&bid=13629218&readTime=3715&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A3715%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1
 https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1027&refer=pages%2Findex%2Findex&bid=15776750&readTime=6737&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A6737%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1`
let qqreadtimeheaderVal=`{"ywsession":"bjkvuse6qwdmqmjjjm8d12p1e7k376gf","Cookie":"ywguid=1449378729;ywkey=ywHYmKB4g0sS;platform=ios;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=53CBF73AE733CF270CD62D4F52AC0A9A","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.32.5"}
{"ywsession":"gd9spty4b60x585ogupvs3tk5k7d2p5f","Cookie":"ywguid=2717294296;ywkey=ywQh3E25wKHX;platform=ios;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=992AE2748FCA46F4E61E6C53E6DA99CE","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.32.5"}
{"ywsession":"0ygoi8p06j5r0oreu3mwmyuvpkuso7c4","Cookie":"ywguid=731492518;ywkey=ywO4yvu2bQpx;platform=ios;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=D2A78C7F298B00789122202EDB571AFC","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.32.5"}
{"ywsession":"e5xwtl0bbismqfzio5mhmilf4eyl5xmw","Cookie":"ywguid=3092996392;ywkey=ywbLj2hJkVtv;platform=ios;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=5FFD6BE376023D336E94E73EF767F034","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.32.5"}
{"ywsession":"r0sdspoko5zseqe0yddw8si5y2m8kwxy","Cookie":"ywguid=1476095443;ywkey=ywmzMbAVsBei;platform=ios;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=B6A0E394039D69E6DCA85885EC1F6420","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.32.5"}
{"ywsession":"0cvxqjd8gyiv9nbpuwx1k5av9n14ng9s","Cookie":"ywguid=935637944;ywkey=ywb5dBFtGcNS;platform=ios;channel=mqqmina;mpVersion=0.33.3;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=DFBDDB2D573AC736432B642F5F1E5186","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.33.3/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.33.3"}
{"ywsession":"nvgxmcalhs76yczhrqibjuc1aznf0cnr","Cookie":"ywguid=2180142772;ywkey=ywa3FkBIMCpg;platform=ios;channel=mqqmina;mpVersion=0.33.3;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=BFC6033BB860E854D22A676F6BC59087","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.33.3/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.33.3"}
{"ywsession":"ormjzqvby5po3f8ck4ot7z0zjs0c97uq","Cookie":"ywguid=2489366874;ywkey=ywXvBIb7d7MA;platform=ios;channel=mqqmina;mpVersion=0.33.3;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=F6CD1D90AE8D411604B7F06218DBA154","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.33.3/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.33.3"}
{"ywsession":"lti0em1i3yp4wrfu99gccmawre87ym92","Cookie":"ywguid=2622802412;ywkey=ywjtd3BmwS6b;platform=ios;channel=mqqmina;mpVersion=0.33.3;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=7C9ED0BF9B4142DB787C0177BE842E27","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.33.3/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.33.3"}
{"ywsession":"cw1a9t50myu5xe9n4j93l2zrdmuws6c5","Cookie":"ywguid=846221802;ywkey=ywkpCtJFJvbC;platform=ios;channel=mqqmina;mpVersion=0.35.1;qq_ver=8.4.17;os_ver=iOS 14.3;mpos_ver=1.21.0;platform=ios;openid=40958974E1542BF82BF8F859C83FA953","Connection":"keep-alive","Content-Type":"application/json","Accept":"*/*","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1209 Darwin/20.2.0","Referer":"https://appservice.qq.com/1110657249/0.35.1/page-frame.html","Accept-Language":"zh-cn","Accept-Encoding":"gzip, deflate, br","mpversion":"0.35.1"}`


let QQ_READ_COOKIES = {  
  "qqreadbodyVal": qqreadbodyVal.split('\n'),
  "qqreadtimeurlVal": qqreadtimeurlVal.split('\n'),
"qqreadtimeheaderVal":qqreadtimeheaderVal.split('\n') 
}



!(async () => {

  await all();
  
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })



async function all() {
  console.log(`==========🔔共${QQ_READ_COOKIES.qqreadbodyVal.length}个${jsname}账号🔔=========\n`);
  for (let i = 0; i < QQ_READ_COOKIES.qqreadbodyVal.length; i++) {	  
	  nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);  
    daytime= new Date(new Date().toLocaleDateString()).getTime()- 8 * 60 * 60 * 1000; 
	
    qqreadbodyVal = QQ_READ_COOKIES.qqreadbodyVal[i];
	qqreadtimeurlVal = QQ_READ_COOKIES.qqreadtimeurlVal[i];   
    qqreadtimeheaderVal = QQ_READ_COOKIES.qqreadtimeheaderVal[i];    
    O=(`${jsname+(i + 1)}🔔`);
    tz= '';
	kz= '';	
	if (BOX == 0){
		
    await qqreadinfo();//用户名
    await qqreadtrack();//更新
	await qqreadconfig();//时长查询
	await qqreadwktime();//周时长查询
	if (config.data.pageParams.todayReadSeconds / 3600 <= maxtime) {
    await qqreadtime();// 上传时长
    }
	if (wktime.data.readTime >= wktimess && wktime.data.readTime <= 1250) {
	await qqreadpick();//领周时长奖励
	}	
    await qqreadtask();//任务列表
    if (task.data.taskList[0].doneFlag == 0) {
    await qqreaddayread();//阅读任务
     }	 	 
    if (task.data.taskList[1].doneFlag == 0&&config.data && config.data.pageParams.todayReadSeconds / 60 >= 1 ) {     
      await qqreadssr1();//阅读金币1	  
    }
	if (task.data.taskList[2].doneFlag == 0) {
      await qqreadsign();//金币签到
      await qqreadtake();//阅豆签到
    }	
    await $.wait(4000)	
	if (task.data.taskList[1].doneFlag == 0&&config.data && config.data.pageParams.todayReadSeconds / 60 >= 30 ) {
      await qqreadssr2();//阅读金币2
	  await $.wait(4000);
	  await qqreadssr3();//阅读金币3
    }
    if (nowTimes.getHours() >=23  && (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 59)) 
    {
    if (CASH>=1&&task.data.user.amount >= CASH*10000) {
      await qqreadwithdraw();//提现
      }		
      await qqreadtrans();//今日收益累计
    }	
    if (task.data.taskList[2].doneFlag == 0) {
      await qqreadsign2();}//签到翻倍    	
    if (task.data.taskList[3].doneFlag == 0) {
      await qqreadvideo();//视频奖励
    }
     }


     if (BOX == 1){
	
	if (nowTimes.getHours() === 0 && (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 59)) 
	{
    await qqreadtrack();//更新
  }
    await qqreadtask();//任务列表
    if (task.data&&task.data.taskList[0].doneFlag == 0) {
    await qqreaddayread();//阅读任务
     }
	 if (task.data&&task.data.treasureBox.timeInterval<=10000) {
      await $.wait(task.data.treasureBox.timeInterval)
      await qqreadbox();//宝箱
    }
    if (task.data&&task.data.treasureBox.timeInterval-600000<=10000) {
      await $.wait(task.data.treasureBox.timeInterval-600000)
      await qqreadbox2();//宝箱翻倍
	  }	
	}
	 
      await showmsg();//通知	
  }
}


function showmsg() {
  return new Promise(async resolve => {
    if (BOX==0){
if (notifyInterval!=1){
console.log(O+'\n'+tz);
}

if (notifyInterval==1){
 $.msg(O, "", tz);
}
if (notifyInterval==2&&(nowTimes.getHours() === 12 ||nowTimes.getHours() === 23)&& (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 10)){
 $.msg(O, "", tz);
}
if (notifyInterval==3&&(nowTimes.getHours() ===6||nowTimes.getHours() === 12||nowTimes.getHours() === 18||nowTimes.getHours() === 23)&& (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 10)){
 $.msg(O, "", tz);
}

 if (notifyttt == 1&&$.isNode()&&(nowTimes.getHours() === 12 ||nowTimes.getHours() === 23 )&& (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 10))
  await notify.sendNotify(O, tz);
    
 }
 if (BOX==1){
if (notifyInterval!=1){
console.log(O+'\n'+kz);
}

if (notifyInterval==1){
 $.msg(O, "", kz);
}
if (notifyInterval==2&&(nowTimes.getHours() === 12 ||nowTimes.getHours() === 23)&& (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 10)){
 $.msg(O, "", kz);
}
if (notifyInterval==3&&(nowTimes.getHours() ===6||nowTimes.getHours() === 12||nowTimes.getHours() === 18||nowTimes.getHours() === 23)&& (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 10)){
 $.msg(O, "", kz);
}

 if (notifyttt == 1&&$.isNode()&&(nowTimes.getHours() === 12 ||nowTimes.getHours() === 23 )&& (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 10))
  await notify.sendNotify(O, kz);
    
 }
    resolve()
  })
}


// 更新
function qqreadtrack() {
  return new Promise((resolve, reject) => {
    const body = qqreadbodyVal.replace(new RegExp(/"dis":[0-9]{13}/), `"dis":${new Date().getTime()}`)
    const toqqreadtrackurl = {
      url: "https://mqqapi.reader.qq.com/log/v4/mqq/track",
      headers: JSON.parse(qqreadtimeheaderVal),
      body: body,
      timeout: 60000,
    };
    $.post(toqqreadtrackurl, (error, response, data) => {
      if (logs) $.log(`${O}, 更新: ${data}`);
      let track = JSON.parse(data);	  
      tz += `【数据更新】:更新${track.msg}\n`;
      kz += `【数据更新】:更新${track.msg}\n`;	  
      resolve();
    });
  });
}
// 用户名
function qqreadinfo() {
  return new Promise((resolve, reject) => {
    const toqqreadinfourl = {
      url: "https://mqqapi.reader.qq.com/mqq/user/init",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadinfourl, (error, response, data) => {
      if (logs) $.log(`${O}, 用户名: ${data}`);
      let info = JSON.parse(data);
      tz += `\n========== 【${info.data.user.nickName}】 ==========\n`;
	  kz += `\n========== 【${info.data.user.nickName}】 ==========\n`;
      resolve();
    });
  });
}
// 任务列表
function qqreadtask() {
  return new Promise((resolve, reject) => {
    const toqqreadtaskurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/page?fromGuid=",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadtaskurl, (error, response, data) => {
      if (logs) $.log(`${O}, 任务列表: ${data}`);
      task = JSON.parse(data);
      
      tz +=
          `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
          `【第${task.data.invite.issue}期】:时间${task.data.invite.dayRange}\n` +
          ` 已邀请${task.data.invite.inviteCount}人，再邀请${task.data.invite.nextInviteConfig.count}人获得${task.data.invite.nextInviteConfig.amount}金币\n` +
          `【${task.data.taskList[0].title}】:${task.data.taskList[0].amount}金币,${task.data.taskList[0].actionText}\n` +
          `【${task.data.taskList[1].title}】:${task.data.taskList[1].amount}金币,${task.data.taskList[1].actionText}\n` +
          `【${task.data.taskList[2].title}】:${task.data.taskList[2].amount}金币,${task.data.taskList[2].actionText}\n` +
          `【${task.data.taskList[3].title}】:${task.data.taskList[3].amount}金币,${task.data.taskList[3].actionText}\n` +
          `【宝箱任务${task.data.treasureBox.count + 1}】:${
              task.data.treasureBox.tipText
          }\n` +
          `【${task.data.fans.title}】:${task.data.fans.fansCount}个好友,${task.data.fans.todayAmount}金币\n`;
		  
		  kz +=
          `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
          `【宝箱任务${task.data.treasureBox.count + 1}】:${
            task.data.treasureBox.timeInterval/1000
        }秒后领取\n` +
          `【已开宝箱】:${task.data.treasureBox.count}个\n`;
      resolve();
    });
  });
}
// 每日阅读
function qqreaddayread() {
  return new Promise((resolve, reject) => {
    const toqqreaddayreadurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/read_book",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreaddayreadurl, (error, response, data) => {
      if (logs) $.log(`${O}, 每日阅读: ${data}`);
      let dayread = JSON.parse(data);
      if (dayread.code == 0) {
        tz += `【每日阅读】:获得${dayread.data.amount}金币\n`;
        kz += `【每日阅读】:获得${dayread.data.amount}金币\n`;
      }
      resolve();
    });
  });
}
// 金币签到
function qqreadsign() {
  return new Promise((resolve, reject) => {
    const toqqreadsignurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/clock_in/page",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadsignurl, (error, response, data) => {
      if (logs) $.log(`${O}, 金币签到: ${data}`);
      sign = JSON.parse(data);
      if (sign.data.videoDoneFlag) {
        tz += `【金币签到】:获得${sign.data.todayAmount}金币\n`;
		kz += `【金币签到】:获得${sign.data.todayAmount}金币\n`;
      }
      resolve();
    });
  });
}
// 金币签到翻倍
function qqreadsign2() {
  return new Promise((resolve, reject) => {
    const toqqreadsign2url = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/clock_in_video",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadsign2url, (error, response, data) => {
      if (logs) $.log(`${O}, 金币签到翻倍: ${data}`);
      let sign2 = JSON.parse(data);
      if (sign2.code == 0) {
        tz += `【签到翻倍】:获得${sign2.data.amount}金币\n`;
		kz += `【签到翻倍】:获得${sign2.data.amount}金币\n`;
      }
      resolve();
    });
  });
}
// 视频奖励
function qqreadvideo() {
  return new Promise((resolve, reject) => {
    const toqqreadvideourl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/watch_video",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadvideourl, (error, response, data) => {
      if (logs) $.log(`${O}, 视频奖励: ${data}`);
      let video = JSON.parse(data);
      if (video.code == 0) {
        tz += `【视频奖励】:获得${video.data.amount}金币\n`;
		kz += `【视频奖励】:获得${video.data.amount}金币\n`;
      }
      resolve();
    });
  });
}
// 阅读金币1
function qqreadssr1() {
  return new Promise((resolve, reject) => {
    const toqqreadssr1url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=30`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    
      $.get(toqqreadssr1url, (error, response, data) => {
        if (logs) $.log(`${O}, 金币奖励1: ${data}`);
        let ssr1 = JSON.parse(data);
        if (ssr1.data.amount > 0){
          tz += `【阅读金币1】获得${ssr1.data.amount}金币\n`;
      kz += `【阅读金币1】获得${ssr1.data.amount}金币\n`;
    }
      });
    
    resolve();
  });
}
// 阅读金币2
function qqreadssr2() {
  return new Promise((resolve, reject) => {
    const toqqreadssr2url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=300`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    
      $.get(toqqreadssr2url, (error, response, data) => {
        if (logs) $.log(`${O}, 金币奖励2: ${data}`);
        ssr2 = JSON.parse(data);
        if (ssr2.data.amount > 0){
      tz += `【阅读金币2】获得${ssr2.data.amount}金币\n`;
      kz += `【阅读金币2】获得${ssr2.data.amount}金币\n`;
    }
      });
    
    resolve();
  });
}
// 阅读金币3
function qqreadssr3() {
  return new Promise((resolve, reject) => {
    const toqqreadssr3url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=1800`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    
      $.get(toqqreadssr3url, (error, response, data) => {
        if (logs) $.log(`${O}, 金币奖励3: ${data}`);
        let ssr3 = JSON.parse(data);
        if (ssr3.data.amount > 0){
          tz += `【阅读金币3】获得${ssr3.data.amount}金币\n`;
		  kz += `【阅读金币3】获得${ssr3.data.amount}金币\n`;
}
      });
    
    resolve();
  });
}
// 阅豆签到
function qqreadtake() {
  return new Promise((resolve, reject) => {
    const toqqreadtakeurl = {
      url: "https://mqqapi.reader.qq.com/mqq/sign_in/user",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.post(toqqreadtakeurl, (error, response, data) => {
      if (logs) $.log(`${O}, 阅豆签到: ${data}`);
      let take = JSON.parse(data);
      if (take.data.takeTicket > 0) {
        tz += `【阅豆签到】:获得${take.data.takeTicket}豆\n`;
		kz += `【阅豆签到】:获得${take.data.takeTicket}豆\n`;
      }
      resolve();
    });
  });
}
// 阅读时长任务
function qqreadconfig() {
  return new Promise((resolve, reject) => {
    const toqqreadconfigurl = {
      url:
          "https://mqqapi.reader.qq.com/mqq/page/config?router=%2Fpages%2Fbook-read%2Findex&options=",
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadconfigurl, (error, response, data) => {
      if (logs) $.log(`${O}, 阅读时长查询: ${data}`);
      config = JSON.parse(data);
      if (config.code == 0){
        tz += `【时长查询】:今日阅读${(
            config.data.pageParams.todayReadSeconds / 60
        ).toFixed(0)}分钟\n`;
		kz += `【时长查询】:今日阅读${(
            config.data.pageParams.todayReadSeconds / 60
        ).toFixed(0)}分钟\n`;
}
				
      resolve();
    });
  });
}
// 阅读时长
function qqreadtime() {
  return new Promise((resolve, reject) => {
	  do TIME = Math.floor(Math.random()*35);
        while( TIME < 25 )	  
    const toqqreadtimeurl = {
      url: qqreadtimeurlVal.replace(/readTime=/g, `readTime=${TIME}`),
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadtimeurl, (error, response, data) => {
      if (logs) $.log(`${O}, 阅读时长: ${data}`);
      let time = JSON.parse(data);
      if (time.code == 0){
	  tz += `【阅读时长】:上传${(TIME/6).toFixed(1)}分钟\n`;
	  kz += `【阅读时长】:上传${(TIME/6).toFixed(1)}分钟\n`;
}
      resolve();
    });
  });
}
// 宝箱奖励
function qqreadbox() {
  return new Promise((resolve, reject) => {
    const toqqreadboxurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadboxurl, (error, response, data) => {
      if (logs) $.log(`${O}, 宝箱奖励: ${data}`);
      let box = JSON.parse(data);
      if (box.code==0){
        tz += `【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`;
		kz += `【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`;
}
      
      resolve();
    });
  });
}
// 宝箱奖励翻倍
function qqreadbox2() {
  return new Promise((resolve, reject) => {
    const toqqreadbox2url = {
      url:
          "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box_video",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadbox2url, (error, response, data) => {
      if (logs) $.log(`${O}, 宝箱奖励翻倍: ${data}`);
      let box2 = JSON.parse(data);
      if (box2.code == 0) {
        tz += `【宝箱翻倍】:获得${box2.data.amount}金币\n`;
		kz += `【宝箱翻倍】:获得${box2.data.amount}金币\n`;
      }
      resolve();
    });
  });
}
// 本周阅读时长
function qqreadwktime() {
  return new Promise((resolve, reject) => {
    const toqqreadwktimeurl = {
      url: `https://mqqapi.reader.qq.com/mqq/v1/bookShelfInit`,
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadwktimeurl, (error, response, data) => {
      if (logs) $.log(`${O}, 本周阅读时长: ${data}`);
      wktime = JSON.parse(data);
      if (wktime.code == 0){
        tz += `【本周阅读时长】:${wktime.data.readTime}分钟\n`;
		kz += `【本周阅读时长】:${wktime.data.readTime}分钟\n`;
}
      resolve();
    });
  });
}
// 本周阅读时长奖励任务
function qqreadpick() {
  return new Promise((resolve, reject) => {
    const toqqreadpickurl = {
      url: `https://mqqapi.reader.qq.com/mqq/pickPackageInit`,
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    
      $.get(toqqreadpickurl, (error, response, data) => {
        if (logs) $.log(`${O},周阅读时长奖励任务: ${data}`);
        let pick = JSON.parse(data);{
        if (pick.data[7].isPick == true) 
        tz += "【周时长奖励】:已全部领取\n";
        kz += "【周时长奖励】:已全部领取\n";
      }
        
        for (let i = 0; i < pick.data.length; i++) {
          setTimeout(() => {
            const pickid = pick.data[i].readTime;
            const Packageid = [
              "10",
              "10",
              "20",
              "30",
              "50",
              "80",
              "100",
              "120",
            ];
            const toqqreadPackageurl = {
              url: `https://mqqapi.reader.qq.com/mqq/pickPackage?readTime=${pickid}`,
              headers: JSON.parse(qqreadtimeheaderVal),
              timeout: 60000,
            };
            $.get(toqqreadPackageurl, (error, response, data) => {
              if (logs) $.log(`${O}, 领周阅读时长奖励: ${data}`);
              Package = JSON.parse(data);
              if (Package.code == 0){
                tz += `【周时长奖励${i + 1}】:领取${Packageid[i]}阅豆\n`;
                kz += `【周时长奖励${i + 1}】:领取${Packageid[i]}阅豆\n`;
              }
            });
          }, i * 100);
        }
      });
      resolve();
    
    resolve();
  });
}
//提现
function qqreadwithdraw() {
  return new Promise((resolve, reject) => {
    const toqqreadwithdrawurl = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/withdraw?amount=${CASH*10000}`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.post(toqqreadwithdrawurl, (error, response, data) => {
      if (logs) $.log(`${O}, 提现: ${data}`);
      let withdraw = JSON.parse(data);
      if (withdraw.data.code == 0){
        tz += `【现金提现】:成功提现${CASH}元\n`;
		kz += `【现金提现】:成功提现${CASH}元\n`;
      }
      resolve();
    });
  });
}
// 金币统计
function qqreadtrans() {
  return new Promise((resolve, reject) => {  
for(var y=1;y<9;y++){
   let day=0;
    const toqqreadtransurl = { 
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/trans/list?pn="+y, 
      headers: JSON.parse(qqreadtimeheaderVal), 
      timeout: 60000, 
    };
    $.get(toqqreadtransurl, (error, response, data) => {
      if (logs) $.log(`${O}, 今日收益: ${data}`);
      trans = JSON.parse(data);
    for(var i=0;i<20;i++){
if(trans.data.list[i].createTime>=daytime)
  day+=trans.data.list[i].amount;
    }
tz+="【今日收益】:获得"+day+'\n'
kz+="【今日收益】:获得"+day+'\n'
resolve();
      });
     }
      
  });
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
