## 传感器信号采集系统

RS485 To TCP


## 温湿度传感器 TH10S-B RS485 通讯协议

1. 所有通讯回路都应遵照主/从方式。依照这种方式，数据可以在一个主站(如：PC)和多个子站之间传递。任何一次通讯都不能从子站开始。
2. 信息传输方式为异步方式，字节格式为起始位1位，数据位8位，停止位1位，无校验。 
3. 符合MODUBS RTU 协议标准。
4. 默认波特率为9600，地址为1。


### 主站发送


``` js

{
  signal: 'ws' | 'com',
  url: 'host:port' | 'COMX',
  protocol: 'rs485',
  unit: 'some display string',
  readInterval: 5000,
  readCommand: '03000000024C0B',
  ratio: 0.1,
  offset: 0,
  clients: [
    {
      name: '设备1温度',
      address: 1,
      bit: 1
    },{
      name: '设备1湿度',
      address: 1,
      bit: 2
    },
  ]
}

```

