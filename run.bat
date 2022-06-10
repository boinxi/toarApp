"C:\Program Files\MongoDB\Server\5.0\bin\mongod" --dbpath "%cd%\data"
start chrome "http://localhost:8080/main.html"
cd ./server
CMD /C "npm" start