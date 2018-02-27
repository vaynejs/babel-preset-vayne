const assign = require('object.assign')
// 默认配置
const defaultOptions = {
  targets: {
    browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
  },
  // 会加载vue jsx 写法
  enableVueJsx: false,
  // ng1 会加载装饰器插件
  enableNg1: false,
  // 启用会加载使用 babel-plugin-component 一般使用饿了么 三方组件用
  enableComponent: false,
  // 启用component 后的参数
  component: {
    style: true
  },
  // 启用单元测试
  enableTest: false
}

/**
 * vayne babel 预解析
 */
module.exports = function(context, options) {
  let opts = assign({}, defaultOptions, options || {})

  let plugins = [
    require('babel-plugin-transform-runtime'),
    require('babel-plugin-syntax-dynamic-import')
  ]

  // 需要安装 babel-plugin-syntax-jsx babel-plugin-transform-vue-jsx
  if (opts.enableVueJsx) {
    plugins.push(require('babel-plugin-transform-vue-jsx'))
  }

  // angular1 es6 使用装饰器
  if (opts.enableNg1) {
    plugins.push(require('babel-plugin-transform-decorators-legacy'))
  }

  // 启用 element 三方组件依赖加载
  if (opts.enableComponent) {
    if (!opts.component) {
      console.log('babel-plugin-component 使用babel 插件必须配置, 不然会有意向不到的错误。 ')
    }
    plugins.push([require('babel-plugin-component'), [
      'component', [opts.component]
    ]])
  }

  let paeset = {
    presets: [
      [require('babel-preset-env'), {
        modules: false,
        useBuiltIns: true,
        targets: opts.targets
      }],
      require('babel-preset-stage-2')
    ],
    comments: false,
    plugins: plugins
  }

  if (opts.enableTest) {
    paeset.env = {
      test: {
        presets: [
          require('babel-preset-env'),
          require('babel-preset-stage-2')
        ],
        plugins: [
          require('babel-plugin-istanbul')
        ]
      }
    }
  }

  return paeset
}
