import { presetIcons, defineConfig } from 'unocss'

export const createConfig = () => {
  return defineConfig({
    presets: [
      // ...
      presetIcons({
        collections: {
          antDesign: () =>
            import('@iconify-json/ant-design').then((i) => i.icons as any)
        }
      })
    ]
  })
}

export default createConfig()