<section class="style-guide--section">
	<h2 class="style-guide--section-header" data-style-guide-icon='fa fa-arrows-v'>
		Custom Scrollbar
	</h2>

	<p class="lead">Create a custom scroll bar, giving you the flexibility to style the scroll bar.</p>
	<small><em>Note, the example is wrapped in a div to show a fixed height which isn't inherintly there.</em></small>

	<ol>
		<li>Hover over the <code><i class="fa fa-pencil" aria-hidden='true'></i><span class="sr-only">pencil icon</span></code> and select <code>Edit Content</code></li>
		<li>At the bottom of the WYSIWYG, click on the tab that says <code>HTML</code></li>
		<li>Copy/Paste the code in the markup section below where you want into your HTML/Text module</li>
		<li>Change the filler text to say whatever you want</li>
		<li>Save</li>
	</ol>

	<h3 class='style-guide--sub-header'>Example</h3>
	<div class="row">
		<div class="col-xs-12 col-sm-7">
<pre>
<code class="style-guide--code">&lt;div data-function="scroll"&gt;
	&lt;div data-scroll="content-wrapper"&gt;
		&lt;div data-scroll="content"&gt;
			Lorem ipsum...
		&lt;/div&gt;
	&lt;/div&gt;
	&lt;div data-scroll="scrollbar"&gt;
		&lt;button&gt;
		&lt;/button&gt;
	&lt;/div&gt;
&lt;/div&gt;<button data-function="copy" type="button"><i class="fa fa-clone" aria-hidden="true"></i></button>
</code>
</pre>
		</div>
		<div class="col-xs-12 col-sm-5 pt-Sm">
			<div style="height: 100px;">
				<div data-function="scroll">
					<div data-scroll="content-wrapper">
						<div data-scroll="content">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla sapiente, repellat esse aut delectus dolorem minima ad incidunt. Asperiores nemo quam mollitia omnis, nam cumque amet impedit nostrum et? Qui. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae debitis ut ab, corrupti ipsa, officiis veritatis expedita unde enim, eos sapiente totam necessitatibus provident dolorem cumque ducimus quos fuga rerum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid laudantium earum autem aliquam ex assumenda qui ut delectus, quidem voluptas ducimus cupiditate voluptate tempora dicta ipsa consectetur blanditiis quod possimus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam non suscipit, quis accusantium a cum necessitatibus deleniti aliquam culpa facere dolores ea maiores architecto error possimus ab, libero consequatur repudiandae! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque ab adipisci architecto aliquid dolorum maxime, eaque repellat. Illo pariatur necessitatibus excepturi atque suscipit eveniet dolorem, et voluptates voluptatibus temporibus molestias.
						</div>
					</div>
					<div data-scroll="scrollbar">
						<button>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>