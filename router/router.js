// MinRouter没有使用，大家可以基于此进行改造
import MinRouter from '@/utils/MinRouter'

// 配置路由
const router = new MinRouter({
	routes: [{
			// 页面路径
			path: 'pages/index/index',
			// type必须是以下的值['navigateTo', 'switchTab', 'reLaunch', 'redirectTo']
			// 跳转方式(默认跳转方式)
			type: 'navigateTo',
			name: 'index'
		},
		{
			path: 'pages/my/index',
			name: 'my'
		},
		{
			path: 'pages/test/index',
			name: 'test'
		}
	]
})
router.beforeEach((to, from, next) => {
	if (from === 'pages/index/index' && to === 'pages/my/index') {
		// 不希望跳转就传false
		next(false)
		// 跳到指定页面
		// next('pages/test/index')
	}
})

export default router
