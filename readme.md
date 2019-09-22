### 非官方火币api sdk
# 安装
``` 
npm i -S huobi-sdk
```

```
const huobi = require("huobi-sdk");

huobi
  .getRestInstance(
    "access-key",
    "secret-key"
  )
  .setSocketProxy("socks://host:port")
  .commonSympols()
  .then(res => {
    console.log(res);
  });
```