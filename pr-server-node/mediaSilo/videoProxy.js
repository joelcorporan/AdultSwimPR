/*
 * MIT License
 *
 * Copyright (c) 2016 MediaSilo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

exports.getProxy = function(credentials, assetId, response) {

    var http = require("https");

    var options = {
        "method": "GET",
        "hostname": "api.mediasilo.com",
        "port": null,
        "path": "/v3/assets/" + assetId + "/proxy.m3u8",
        "headers": {
            "mediasilohostcontext": process.env.hostname,
            "authorization": "Basic " + credentials
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("error", function (error) {
            if (error) {
                response.status(500);
                response.send('Error validating');
            }
        });

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);

            response.header('content-type', 'application/x-mpegurl; charset=utf-8');
            response.send(body);
        });
    });

    req.end();
}