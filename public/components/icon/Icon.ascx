<section class="style-guide--section">
	<h2 class="style-guide--section-header" data-style-guide-icon='fa fa-font-awesome'>
		Icons
	</h2>

	<p class="lead">
		Accordions are great ways to display a lot of information that is related, but has clear points of seperation. Follow the steps below to add an accordion to any HTML/Text module.
	</p>
	<ol>
		<li>Hover over the <code><i class="fa fa-pencil" aria-hidden='true'></i><span class="sr-only">pencil icon</span></code> and select <code>Edit Content</code></li>
		<li>At the bottom of the WYSIWYG, click on the tab that says <code>HTML</code></li>
		<li>Copy/Paste the code in the markup section below where you want into your HTML/Text module</li>
		<li>Change the filler text to say whatever you want</li>
		<li>Save</li>
	</ol>

	<p>You can change the speed in which the accordion opens and closes by altering the value of the <code>data-animation-speed</code> which is in miliseconds I.E., 300 = 0.3 seconds.</p>

	<p>By default if you open one accordion, the others will close. You can change setting <code>data-allow-multiple="true"</code></p>

	<p>If you want the accordion that was just opened to transition to the top of the page, add <code>data-snap-to-top="true"</code>. By default, it will scroll againt the document body, but you can specify a target via <code>data-snap-top-to="#IdOfContainer"</code>.Additionaly, you can specify the offset between the top of the accordion and top of the container with <code>data-top-offset="150"</code> (the default is 30).</p>

	<h3 class='style-guide--sub-header'>Default Accordion Style</h3>
	<div class="row">
		<div class="col-xs-12 col-sm-7">
			<h3>Markup</h3>
<pre>
<code>&lt;section data-function="accordion" data-animation-speed="300"&gt;</code>
	<code>&lt;button role="tab" type="button" aria-expanded="true"&gt;</code>
		<span>Accordion Part 1</span>
	<code>&lt;/button&gt;</code>
	<code>&lt;div role="tabpanel" aria-hidden="false"&gt;</code>
		<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.</span>
	<code>&lt;/div&gt;</code>

	<code>&lt;button role="tab" type="button" aria-expanded="false"&gt;</code>
		<span>Accordion Part 2</span>
	<code>&lt;/button&gt;</code>
	<code>&lt;div role="tabpanel" aria-hidden="true"&gt;</code>
		<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.</span>
	<code>&lt;/div&gt;</code>

	<code>&lt;button role="tab" type="button" aria-expanded="false"&gt;</code>
		<span>Accordion Part 3</span>
	<code>&lt;/button&gt;</code>
	<code>&lt;div role="tabpanel" aria-hidden="true"&gt;</code>
		<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.</span>
	<code>&lt;/div&gt;</code>
<code>&lt;/section&gt;</code>
</pre>
		</div>
		<div class="col-xs-12 col-sm-5">
			<h3>Result</h3>
			<section data-function="accordion" data-animation-speed="300">
				<button role="tab" type="button" aria-expanded="true">
					Accordion Part 1
				</button>
				<div role="tabpanel" aria-hidden="false">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.
				</div>

				<button role="tab" type="button" aria-expanded="false">
					Accordion Part 2
				</button>
				<div role="tabpanel" aria-hidden="true">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.
				</div>

				<button role="tab" type="button" aria-expanded="false">
					Accordion Part 3
				</button>
				<div role="tabpanel" aria-hidden="true">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores quod ex ad, in iure deleniti minus sequi inventore assumenda eius alias laboriosam voluptas similique hic. Amet deleniti recusandae, quas quidem.
				</div>
			</section>
		</div>
	</div>
</section>
<script src="https://cdn.jsdelivr.net/clipboard.js/1.5.12/clipboard.min.js"></script>