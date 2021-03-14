

import http.server
import socketserver
import  os
from urllib.parse import urlparse
import random
import string
import cgi
import tasks 
import json
from celery.result import AsyncResult

PORT = 3000
INDEXFILE = 'fe/dist/index.html'
INDEXROOT= 'fe/dist/'

class MyHandler(http.server.SimpleHTTPRequestHandler):
    store_path= "./uploads/"
    def do_GET(self):
    # Parse query data to find out what was requested
        parsedParams = urlparse(self.path)
        if parsedParams.path == '/':
            self.path =INDEXFILE	
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        if parsedParams.path == '/getResult':
            idFromQuery=parsedParams.query[parsedParams.query.index('=')+1:] 
            res = AsyncResult(idFromQuery)
            data =""
            if(res.ready()):
                temp_val=res.get();
                data = {
                "path": temp_val,
                "status": "ready",
                }
            else:
                data = {
                "path": "",
                "status": "not_ready",
                }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json') 
            dataNew=data
            self.end_headers()
            self.wfile.write(json.dumps(dataNew, indent=2).encode('utf-8')) 
            return

         # See if the file requested exists
        if os.access('.' + os.sep + parsedParams.path, os.R_OK):
            # File exists, serve it up
            http.server.SimpleHTTPRequestHandler.do_GET(self);
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')  
            self.end_headers()
            with open(INDEXROOT+parsedParams.path, 'rb') as fin:
              self.copyfile(fin, self.wfile)

    def do_POST(self):
        
        ctype, pdict = cgi.parse_header(
            self.headers.get('content-type'))
        # boundary data needs to be encoded in a binary format
        content_length = int(self.headers['Content-Length'])
        
        form = cgi.FieldStorage(
        fp=self.rfile,
        headers=self.headers,
        environ={
            'REQUEST_METHOD': 'POST',
            'CONTENT_TYPE': self.headers['Content-Type'],
        })

        if ctype == 'multipart/form-data':
            letters = string.ascii_lowercase 
            image_name=''.join(random.choice(letters) for i in range(10))          
            with open(self.store_path+''.join(image_name)+'.png' , 'wb') as fh:
                fh.write(form.list[0].file.read())
            async_result=tasks.resize_image.delay(self.store_path,image_name,'.png')
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')  
            data = {
            "resultId": async_result.id,
            "status": async_result.status,
            }
            self.end_headers()
            self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

Handler = MyHandler

httpd = socketserver.TCPServer(("", PORT), Handler)

print ("serving at port", PORT)
httpd.serve_forever()