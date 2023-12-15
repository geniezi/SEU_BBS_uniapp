<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		onLoad(router) {
		    // query.id 包含页面跳转过来时携带的参数
		    this.userId = router.userId;
			uni.$u.toast('跳转到'+this.userId+'页面');
		    //console.log(this.userId);
		    // 调接口
		  },
		data() {
			return {
				userId: '', // 路由传入
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
