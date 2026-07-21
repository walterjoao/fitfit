// Proxy local para testar https://socialbridge.ancoia.com no preview browser (só aceita localhost)
const http = require('http');
const https = require('https');
const REMOTE = 'socialbridge.ancoia.com';
const LOCAL = 'http://localhost:8123';

http.createServer((req, res) => {
    const headers = { ...req.headers, host: REMOTE, 'accept-encoding': 'identity' };
    headers.origin = 'https://' + REMOTE;
    headers.referer = 'https://' + REMOTE + req.url;
    const opt = { hostname: REMOTE, port: 443, path: req.url, method: req.method, headers };
    const p = https.request(opt, (r) => {
        const h = { ...r.headers };
        if (h.location) h.location = h.location.replace(new RegExp('https://' + REMOTE, 'g'), LOCAL);
        if (h['set-cookie']) {
            h['set-cookie'] = h['set-cookie'].map(c => c
                .replace(/;\s*[Ss]ecure/g, '')
                .replace(/;\s*[Dd]omain=[^;]*/g, '')
                .replace(/[Ss]ame[Ss]ite=None/g, 'SameSite=Lax'));
        }
        const ct = h['content-type'] || '';
        if (/text|json|javascript/.test(ct)) {
            let body = '';
            r.setEncoding('utf8');
            r.on('data', d => body += d);
            r.on('end', () => {
                body = body.split('https://' + REMOTE).join(LOCAL)
                           .split('https:\\/\\/' + REMOTE).join(LOCAL.replace('://', ':\\/\\/'));
                delete h['content-length'];
                res.writeHead(r.statusCode, h);
                res.end(body);
            });
        } else {
            res.writeHead(r.statusCode, h);
            r.pipe(res);
        }
    });
    p.on('error', (e) => { res.writeHead(502); res.end('proxy error: ' + e.message); });
    req.pipe(p);
}).listen(8123, () => console.log('proxy on :8123'));
