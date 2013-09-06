//jquery.fn.extend
(function(h) {
    h.fn.rssfeed = function(q, f, r) {        
		f = h.extend({
            limit: 10,
            header: !0,
            titletag: "h4",
            date: !0,
            content: !0,
            snippet: !0,
            media: !0,
            showerror: !0,
            errormsg: "",
            key: null,
            ssl: !1,
            linktarget: "_self"
        }, 
        f);
        return this.each(function(s, l) {
            var p = h(l),
            d = "";
            f.ssl && (d = "s");
            p.hasClass("rssFeed") || p.addClass("rssFeed");
            if (null == q) return ! 1;
            //  Google Feed API 提供在线XML转json服务，同时还支持callback
            d = "http" + d + "://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(q);
            null != f.limit && (d += "&num=" + f.limit); //用于返回指定数量的rssitems
            null != f.key && (d += "&key=" + f.key);
            h.getJSON(d + "&output=json_xml",
            function(b) {
                if (200 == b.responseStatus) {
                    var e = b.responseData,
                    b = f,
                    g = e.feed;
                    if (g) {
                        var a = "",
                        //整个内容
                        d = "odd";
                        if (b.media) {
                            var j = e.xmlString;
                            "Microsoft Internet Explorer" == navigator.appName ? (e = new ActiveXObject("Microsoft.XMLDOM"), e.async = "false", e.loadXML(j)) : e = (new DOMParser).parseFromString(j, "text/xml");
                            j = e.getElementsByTagName("item")
                        }

                        b.header && (a += '<div class="rssHeader"><a href="' + g.link + '" title="' + g.description + '">' + g.title + "</a></div>");
                        a += '<div class="rssBody"><ul>';

                        var pubdate, latestpubdate, currentdate, formatpubdate;
                        var link, title, cotent;

                        for (e = 0; e < g.entries.length; e++) {
                            c = g.entries[e],
                            i;
                            pubdate = Date.parse(c.publishedDate);
                            latestpubdate = Date.parse(g.entries[0].publishedDate);
                            currentdate = Date.parse(f.currentDATE); //-24*60*60*1000;
                            formatpubdate = new Date(pubdate).toString("yyyy-M-dd hh:mm:ss"));

                            //console.log(typeof(c.publishedDate));
                            //console.log("EEE, d MMM yyyy HH:mm:ss Z=="+c.publishedDate);
                            //console.log("Format=="+new Date());
                            //console.log("currentDATE="+f.currentDATE);

                            //console.log("date.js===" + new Date().toString("yyyy-M-dd hh:mm:ss"));
                            //console.log("date.js2===" + new Date(Date.parse("2006-12-17 12:55:54")).toString("yyyy-M-dd hh:mm:ss"));
                            //console.log("pubdate=" + pubdate);
                            //console.log("latestpubdate=" + latestpubdate);
                            //console.log("currentdate=" + currentdate);

                            c.publishedDate && (i = new Date(c.publishedDate), i = i.toLocaleDateString() + " " + i.toLocaleTimeString());
                            a += '<li class="rssRow ' + d + '"><' + b.titletag + '><a href="' + c.link + '" title="View this feed at ' + g.title + '">' + c.title + "</a></" + b.titletag + ">";
                            b.date && i && (a += "<div>" + i + "</div>");
                            b.content && (a += "<p>" + (b.snippet && "" != c.contentSnippet ? c.contentSnippet: c.content) + "</p>");

                            title = c.title;
                            link = c.link;
                            content = " <p>" + (b.snippet && "" != c.contentSnippet ? c.contentSnippet: c.content) + "</p>";

                            //db.transaction(function(transaction) {
                            //transaction.executeSql('INSERT INTO rssitems (title,link,description,pubdate,caturl,isread) VALUES ("' + title + '","' + link  + '","'+ content  +'","'+formatpubdate+'","'+q+'",0);', []);
                            //console.log('INSERT INTO rssitems (title,link,description,pubdate,caturl,isread) VALUES ("' + title + '","' + link  + '","'+content  +'","'+formatpubdate+'","'+q+'",0);');
                            //});

                            //alert(f.status);
                            //titleArr[e] = title;
                            //linkArr[e] = link;
                            //contentArr[e] = content;
                            //pubdateArr[e] = formatpubdate;

                            if (b.media && 0 < j.length) {
                                c = j[e].getElementsByTagName("enclosure");
                                if (0 < c.length) {
                                    for (var a = a + '<div class="rssMedia"><div>Media files</div><ul>',
                                    k = 0; k < c.length; k++) var m = c[k].getAttribute("url"),
                                    n = c[k].getAttribute("type"),
                                    o = c[k].getAttribute("length"),
                                    m = '<li><a href="' + m + '" title="Download this media">' + m.split("/").pop() + "</a> (" + n + ", ",
                                    n = Math.floor(Math.log(o) / Math.log(1024)),
                                    o = (o / Math.pow(1024, Math.floor(n))).toFixed(2) + " " + "bytes,kb,MB,GB,TB,PB".split(",")[n],
                                    a = a + (m + o + ")</li>");
                                    a += "</ul></div>"
                                }
                                a += "</li>"
                            }
                            d = "odd" == d ? "even": "odd"

                        } //end for loop

                        h(l).html(a + "</ul></div>");
                        h("a", l).attr("target", b.linktarget)
                    } //end if(g)
                    h.isFunction(r) && r.call(this, p)
                } // end if(responseStatus=200)
                else f.showerror && (g = "" != f.errormsg ? f.errormsg: b.responseDetails), h(l).html('<div class="rssError"><p>' + g + "</p></div>")
            })
        })
    }
})(jQuery);