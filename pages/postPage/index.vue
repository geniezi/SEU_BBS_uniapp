<template>

</template>

<script>
	export default {

		onLoad(options) {
			this.postId = decodeURIComponent(options.postId);
		    console.log(this.postId);
		}
		data() {
			return {
				show: false,
				isLiked: false,
				isDisliked:false,
				isCollected:false,
				likes:"",
				dislikes:'',
				collections:'',
				comments:'',
				postId:"",
				isLikedState: this.isLiked,
				isDislikedState: this.isDisliked,
				isCollectedState: this.isCollected,
				likeCount: this.likes,
				dislikeCount: this.dislikes,
				collectCount: this.collections,
				commentCount: this.comments,
				
				commentShow: false,
				commentContent: '',
				
			};
		},
		methods: {
			open() {
				// console.log('open');
			},
			};
		};
</script>

<style>
</style>