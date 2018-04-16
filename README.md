# heppps
HEPIC PPS Counter Stats Extraction for console and UDP loggers. Useful for measuring bottlenecking events into paStash or other tools.

### Install
```
sudo npm install -g heppps
```
### Usage w/ UDP output every minute
```
heppps --apiUrl 'http://127.0.0.1:80/api' --apiUser myusername --apiPass mypassword --interval 60000 --total true --udp '127.0.0.1:1234'
```

##### (C) QXIP BV, All rights reserved.
