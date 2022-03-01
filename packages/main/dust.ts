import defaultConfig from './template/device.json'
import Store from 'electron-store'
import { regist } from './requestServer'
import { RequestType } from '../types'
import { dialog } from 'electron'

const DUST_CONFIG_STORE_KEY = 'COAL_DUST'

const dustStore = new Store()

// dustStore.delete(DUST_CONFIG_STORE_KEY)


const oldDustConf = dustStore.get(DUST_CONFIG_STORE_KEY) 

if (!oldDustConf) {
  dustStore.set(DUST_CONFIG_STORE_KEY, defaultConfig)
}

regist(RequestType.EXPORT_CONFIG_FILE, (e: any) => {
  console.log('e1')
  // const d = new Date()
  // dialog.showSaveDialog({
  //   title: `粉尘信号管理系统配置文件.${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.json`
  // })

  const conf = dustStore.get(DUST_CONFIG_STORE_KEY)
  return e.reply({ status: 200, message: '', data: conf })
})

regist(RequestType.IMPORT_CONFIG_FILE, (e: any, json: any) => {
  const conf = dustStore.set(DUST_CONFIG_STORE_KEY, json)
  return e.reply({ status: 200, message: '', data: conf })
})

regist(RequestType.RESET_CONFIG_FILE, (e: any) => {
  const conf = dustStore.set(DUST_CONFIG_STORE_KEY, defaultConfig)
  return e.reply({ status: 200, message: '', data: conf })
})


