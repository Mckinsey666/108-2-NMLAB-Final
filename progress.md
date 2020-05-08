# 108 - 2 NMLAB Final Project

## Frontend

### 登入
- 用那一串 hash 登入

### 書架
- preview files
    - Contract.GetRandom
- buy file:
    - Contract.BuyBooks

### 自己的頁面
- 書架
    - Contract.GetMyUpload
    - Contract.GetCollection
- 下載文章（自己跟別人的）：前端自己處理
- 上傳自己的文章
    - 選擇賣幾塊錢
    - preview
    - Contract.Upload

## Contract

### Struct 
- ```
    BookMeta = (
        filename: str, 
        main_ipfs_hash: str, 
        preview_ipfs_hash: str,
        price: uint, author: str
    )
  ```

### Methods

- Upload
    - input: BookMeta
    - output: 

- BuyBooks
    - input: (preview_ipfs_hash,)
    - output: (success,)

- GetMyUpload
    - input:
    - output: [BookMeta]

- GetCollection
    - input:
    - output: [BookMeta]
   
- GetRandom
    - input: (num: uint)
    - output: BookMeta - main_ipfs_hash
    
## Progress
- 5/12
    - 

## References
- react-box: https://github.com/truffle-box/react-box
- Metamask: https://metamask.io
- ipfs: https://www.npmjs.com/package/ipfs