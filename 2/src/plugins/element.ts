// npm install element-plus --save
import ElementPlus from 'element-plus'
// npm i @element-plus/icons-vue
import 'element-plus/dist/index.css'
// npm install @element-plus/icons-vue
import * as ElIconModules from '@element-plus/icons-vue'

export default function loadComponent(app: any) {
  app.use(ElementPlus)
  for (const iconName in ElIconModules) {
    app.component(iconName, (ElIconModules as any)[iconName])
  }

}
