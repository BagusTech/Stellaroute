<section class="style-guide--section">
	<h2 class="style-guide--section-header" data-style-guide-icon='fa fa-cubes'>
		Tabs
	</h2>

	<!-- NEED ACTUAL CONTENT HERE BEFORE IT GOES OUT
	<div class="row">
		<div class="col-xs-12 col-sm-4">
			<h4>Best Practices <i class='fa fa-question-circle' aria-hidden="true"></i></h4>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur explicabo architecto consectetur modi. Sunt, distinctio illum voluptatem nihil, quam, aspernatur animi id doloremque delectus possimus modi quibusdam consectetur magni est.
			</p>
		</div>
		<div class="col-xs-12 col-sm-4">
			<h4>Best Practices <i class='fa fa-question-circle' aria-hidden="true"></i></h4>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur explicabo architecto consectetur modi. Sunt, distinctio illum voluptatem nihil, quam, aspernatur animi id doloremque delectus possimus modi quibusdam consectetur magni est.
			</p>
		</div>
		<div class="col-xs-12 col-sm-4">
			<h4>Best Practices <i class='fa fa-question-circle' aria-hidden="true"></i></h4>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur explicabo architecto consectetur modi. Sunt, distinctio illum voluptatem nihil, quam, aspernatur animi id doloremque delectus possimus modi quibusdam consectetur magni est.
			</p>
		</div>
	</div> -->

	<p class="lead">
		Tabs are great ways to display a lot of information that is related, but has clear points of seperation. Follow the steps below to add tabs to any HTML/Text module.
	</p>
	<ol>
		<li>Hover over the <code><i class="fa fa-pencil" aria-hidden='true'></i><span class="sr-only">pencil icon</span></code> and select <code>Edit Content</code></li>
		<li>At the bottom of the WYSIWYG, click on the tab that says <code>HTML</code></li>
		<li>Copy/Paste the code in the "Markup" section below where you want into your HTML/Text module</li>
		<li>Change the filler text to say whatever you want</li>
		<li>Save</li>
	</ol>

	<p>You can change the speed in which the tabs transition by altering the value of the <code>data-animation-speed</code> which is in miliseconds I.E., 300 = 0.3 seconds.</p>

	<h3 class='style-guide--sub-header'>Default</h3>
	<div class="row">
		<div class="col-xs-12 col-sm-7">
<pre>
<code class="style-guide--code">&lt;section data-function="tabs" data-animation-speed="300"&gt;
	&lt;button role="tab" type="button" aria-expanded="true"&gt;
		<span>Tab 1</span>
	&lt;/button&gt;
	&lt;div role="tabpanel" aria-hidden="false"&gt;
		<span>Tab 1 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.</span>
	&lt;/div&gt;

	&lt;button role="tab" type="button" aria-expanded="false"&gt;
		<span>Tab 2</span>
	&lt;/button&gt;
	&lt;div role="tabpanel" aria-hidden="true"&gt;
		<span>Tab 2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.</span>
	&lt;/div&gt;

	&lt;button role="tab" type="button" aria-expanded="false"&gt;
		<span>Tab 3</span>
	&lt;/button&gt;
	&lt;div role="tabpanel" aria-hidden="true"&gt;
		<span>Tab 3 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.</span>
	&lt;/div&gt;
&lt;/section&gt;<button data-function="copy" type="button"><i class="fa fa-clone"></i></button></code>
</pre>
		</div>
		<div class="col-xs-12 col-sm-5 pt-Sm">
			<section data-function="tabs" data-animation-speed="300">
				<button role="tab" type="button" aria-expanded="true">
					Tab 1
				</button>
				<div role="tabpanel" aria-hidden="false">
					Tab 1 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.
				</div>

				<button role="tab" type="button" aria-expanded="false">
					Tab 2
				</button>
				<div role="tabpanel" aria-hidden="true">
					Tab 2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.
				</div>

				<button role="tab" type="button" aria-expanded="false">
					Tab 3
				</button>
				<div role="tabpanel" aria-hidden="true">
					Tab 3 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.
				</div>
			</section>
		</div>
	</div>
</section>