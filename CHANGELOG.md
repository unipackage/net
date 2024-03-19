

## [2.5.4](https://github.com/unipackage/net/compare/v2.5.3...v2.5.4) (2024-03-19)


### Bug Fixes

* 🐛 an array in the parameters of the send contract method ([8160248](https://github.com/unipackage/net/commit/816024803595176efefd8e2b70542fe595d91c8a)), closes [#14](https://github.com/unipackage/net/issues/14)

## [2.5.3](https://github.com/unipackage/net/compare/v2.5.2...v2.5.3) (2024-01-17)


### Bug Fixes

* 🐛 complete error info for call and send ([fa13fff](https://github.com/unipackage/net/commit/fa13fff0778f369150f5230261490184eae4ee89)), closes [#21](https://github.com/unipackage/net/issues/21)

## [2.5.2](https://github.com/unipackage/net/compare/v2.5.1...v2.5.2) (2024-01-05)


### Bug Fixes

* 🐛 return complete error information ([4865e7d](https://github.com/unipackage/net/commit/4865e7ddcc787b3c087958a56f465599ab7dda2e)), closes [#18](https://github.com/unipackage/net/issues/18)

## [2.5.1](https://github.com/unipackage/net/compare/v2.5.0...v2.5.1) (2023-12-28)


### Bug Fixes

* 🐛 ethers result ([050a803](https://github.com/unipackage/net/commit/050a8032c5208577816960e1226db486bf6f145f)), closes [#17](https://github.com/unipackage/net/issues/17)

# [2.5.0](https://github.com/unipackage/net/compare/v2.4.0...v2.5.0) (2023-12-28)


### Features

* 🎸 txinput decode result always use object ([5b3d70e](https://github.com/unipackage/net/commit/5b3d70e7a289c2b3807bf6b63b497e546e6f1c8f))

# [2.4.0](https://github.com/unipackage/net/compare/v2.2.2...v2.4.0) (2023-12-27)


### Bug Fixes

* 🐛 version no ([51e5e1b](https://github.com/unipackage/net/commit/51e5e1b1b47a97d007bd4d555fc9664678e104da))


### Features

* 🎸 decodeTxInputToEvmInput return params with object(abi) ([5cafda7](https://github.com/unipackage/net/commit/5cafda7b4042429a05db68393b49e797454747e8)), closes [#15](https://github.com/unipackage/net/issues/15)

## [2.2.2](https://github.com/unipackage/net/compare/v2.2.1...v2.2.2) (2023-12-25)


### Bug Fixes

* 🐛 make sure the length is matched ([16d81b4](https://github.com/unipackage/net/commit/16d81b4b4d5eec9ea69120f0488a2295dc98dae3)), closes [#10](https://github.com/unipackage/net/issues/10)
* 🐛 set evm option is option ([ed91ee9](https://github.com/unipackage/net/commit/ed91ee9eb03302c9466611759ffa6295a12e29af)), closes [#12](https://github.com/unipackage/net/issues/12)

## [2.2.1](https://github.com/unipackage/net/compare/v2.2.0...v2.2.1) (2023-12-20)


### Bug Fixes

* 🐛 fixed web3wallet get function,and add comment ([3de163c](https://github.com/unipackage/net/commit/3de163c477f79fb7ba9b5411161892611a86db4f))

# [2.2.0](https://github.com/unipackage/net/compare/v2.1.0...v2.2.0) (2023-12-19)


### Features

* 🎸 add wallet function ([c1feb65](https://github.com/unipackage/net/commit/c1feb657476e32028e1a9fc335cd7f7b1bae088c))

# [2.1.0](https://github.com/unipackage/net/compare/v2.0.0...v2.1.0) (2023-12-18)


### Features

* 🎸 add getEvmEventArgs,getTransaction,getTransactionReceip ([709eb2a](https://github.com/unipackage/net/commit/709eb2ac0623138d31df4e6286292b3ce36274dc))
* 🎸 getEvmEventArgs return object insteads of array ([43090c4](https://github.com/unipackage/net/commit/43090c4f362070a66bec15107349486ffc249f2c))

# [2.0.0](https://github.com/unipackage/net/compare/v1.1.1...v2.0.0) (2023-12-18)


### Features

* 🎸 move withMethod to utils packag ([6109855](https://github.com/unipackage/net/commit/6109855061a920710fc743efccae4f433f39b087))
* 🎸 return call with object ([b2de8d0](https://github.com/unipackage/net/commit/b2de8d0ec22a1b99c1b9b5b69f2d1809deed5ecf))


### BREAKING CHANGES

* 🧨 move withMethod to utils packag
* 🧨 return call with object instead of array

## [1.1.1](https://github.com/unipackage/net/compare/v1.1.0...v1.1.1) (2023-12-15)


### Bug Fixes

* 🐛 did not wait for TransactionReceipt of ether engine ([6612738](https://github.com/unipackage/net/commit/661273888e1b4f3bc0b54ef40d5118081c7bb42c))
* 🐛 function send of ether engine ([6d32d7e](https://github.com/unipackage/net/commit/6d32d7e550b4399e028ee03064e4afdea95774fa)), closes [#8](https://github.com/unipackage/net/issues/8)

# [1.1.0](https://github.com/unipackage/net/compare/v1.0.7...v1.1.0) (2023-12-14)


### Bug Fixes

* 🐛 update tsconfig for mapping ([5e63200](https://github.com/unipackage/net/commit/5e63200299e884b32c76c3f212fec964d58123dd))


### Features

* 🎸 split I into I and IEngine and update test ([801f4ff](https://github.com/unipackage/net/commit/801f4ff60556a56a2a4b70378e1e4990efefaf90))

## [1.0.7](https://github.com/unipackage/net/compare/v1.0.5...v1.0.7) (2023-12-11)


### Bug Fixes

* 🐛 version no ([108dccb](https://github.com/unipackage/net/commit/108dccbf72822b73522595105a1158311a83b038))

## [1.0.5](https://github.com/unipackage/net/compare/v1.0.4...v1.0.5) (2023-12-11)

## [1.0.4](https://github.com/unipackage/net/compare/v1.0.3...v1.0.4) (2023-12-11)

## [1.0.3](https://github.com/unipackage/net/compare/v1.0.1...v1.0.3) (2023-12-11)

## [1.0.1](https://github.com/unipackage/net/compare/v1.0.0...v1.0.1) (2023-12-10)


### Bug Fixes

* 🐛 EvmInput params type change to any[] ([d18822b](https://github.com/unipackage/net/commit/d18822b2b04eb8fc06a36e94536d2ec8074b2598))

# [1.0.0](https://github.com/unipackage/net/compare/v0.3.2...v1.0.0) (2023-12-10)


### Bug Fixes

* 🐛 decodeTxinput in ethers ([0e11bd4](https://github.com/unipackage/net/commit/0e11bd461c36402f26a5571fdc54db510c5352fd))


### BREAKING CHANGES

* 🧨 decodeTxInput change to decodeTxinputToEvmInput

## [0.3.2](https://github.com/unipackage/net/compare/v0.3.1...v0.3.2) (2023-12-10)


### Bug Fixes

* 🐛 window is unnormal ([c2e2d7a](https://github.com/unipackage/net/commit/c2e2d7ab5edd1c144ec67944509a9b036c0f2719))

## [0.3.1](https://github.com/unipackage/net/compare/v0.3.0...v0.3.1) (2023-12-10)

# [0.3.0](https://github.com/unipackage/net/compare/v0.2.1...v0.3.0) (2023-12-10)


### Features

* 🎸 test feat and version no ([355fffc](https://github.com/unipackage/net/commit/355fffc650ec9da5893001f0850912509e101967))

## [0.2.1](https://github.com/unipackage/net/compare/v0.2.0...v0.2.1) (2023-12-10)

# [0.2.0](https://github.com/unipackage/net/compare/v0.1.19...v0.2.0) (2023-12-10)


### Bug Fixes

* 🐛 .release-it config ([80e996e](https://github.com/unipackage/net/commit/80e996e7cae39d7d5e8846b49ba4cee596c99525))


### Features

* 🎸 add npm run commit function ([dd6506d](https://github.com/unipackage/net/commit/dd6506d6c4a536bb7675ae3926a2fb3d8ae32ff0))

## [0.1.19](https://github.com/unipackage/net/compare/v0.1.18...v0.1.19) (2023-12-10)

## [0.1.18](https://github.com/unipackage/net/compare/v0.1.9...v0.1.18) (2023-12-10)
