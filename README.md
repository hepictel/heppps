# hepPPS
HEPIC PPS Counter Stats Extraction for console and UDP loggers. Useful for measuring bottlenecking events into paStash or other tools. Useless for any other purpose.

### Install
```
sudo npm install -g heppps
```
### Usage w/ UDP output every minute
```
heppps --apiUrl 'http://127.0.0.1:80/api' \
  --apiUser myusername \
  --apiPass mypassword \
  --apiType local \
  --interval 60000 \
  --total true \
  --udp '127.0.0.1:1234'
```
#### Output
```
{ id: 0,
  gid: 10,
  group: 0,
  table: 'hepic_statistics_all',
  reporttime: 1523908440,
  countername: 'total_pps',
  tag1: '',
  value: 15.428572,
  attemps: 2,
  transaction: 'statistic' }
{ id: 0,
  gid: 10,
  group: 0,
  table: 'hepic_statistics_all',
  reporttime: 1523908440,
  countername: 'regs_pps',
  tag1: '',
  value: 6.3333335,
  attemps: 2,
  transaction: 'statistic' }
{ id: 0,
  gid: 10,
  group: 0,
  table: 'hepic_statistics_all',
  reporttime: 1523908440,
  countername: 'calls_pps',
  tag1: '',
  value: 8.666667,
  attemps: 2,
  transaction: 'statistic' }
```
### PaStash Recipe
```
input {
  udp {
    host => 127.0.0.1
    port => 1234
  }
}

filter {
  json_fields {}
}

output {
  influxdb {
    database => hepic
    host => localhost
    port => 8089
    protocol => udp
    metric_type => gauge
    metric_key => #{countername}
    metric_value => #{value}
  }
}
```

##### (C) QXIP BV, All rights reserved.
