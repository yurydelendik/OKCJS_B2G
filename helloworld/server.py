import SimpleHTTPServer
import SocketServer
SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map['.webapp'] = 'application/x-web-app-manifest+json'
httpd = SocketServer.TCPServer(("", 9999), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.serve_forever()
