<template>
	<section class="home-page">
		<router-link class="boards-btn" to="/board">start here</router-link>
		<header>
			<div class="hero-container">
				<lottie-player
					src="https://assets7.lottiefiles.com/packages/lf20_atgjqorh.json"
					background="#FFF1F1"
					speed="1"
					style="width: 100%; height: 700px"
					loop
					autoplay
				></lottie-player>
			</div>
		</header>
		<main class="main-container flex f-col">
			<article class="home-page-card flex">
				<div>
					<img src="@/assets/imgs/home-page1.jpg" alt="" />
				</div>
				<div class="flex f-col f-center">
					<h2>some meaningful words</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Ipsum, ipsa eos, accusamus, earum eligendi
						doloremque maiores eaque quae nulla consequuntur commodi
						dolor placeat nostrum beatae sequi quia aliquid ullam
						laboriosam.
					</p>
				</div>
			</article>
			<article class="home-page-card flex">
				<div class="flex f-col f-center">
					<h2>some meaningful words</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Ipsum, ipsa eos, accusamus, earum eligendi
						doloremque maiores eaque quae nulla consequuntur commodi
						dolor placeat nostrum beatae sequi quia aliquid ullam
						laboriosam.
					</p>
				</div>
				<div>
					<img src="@/assets/animations/home-page2.gif" alt="" />
				</div>
			</article>
			<article class="home-page-card flex">
				<div>
					<img src="@/assets/imgs/home-page2.jpg" alt="" />
				</div>
				<div class="flex f-col f-center">
					<h2>some meaningful words</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Ipsum, ipsa eos, accusamus, earum eligendi
						doloremque maiores eaque quae nulla consequuntur commodi
						dolor placeat nostrum beatae sequi quia aliquid ullam
						laboriosam.
					</p>
				</div>
			</article>
		</main>
	</section>
</template>

<script>


</script>

