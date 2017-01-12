
;(function(util){

	var template = 
		`<ul class="sliders">
			<li class="slider"></li>
			<li class="slider"></li>
			<li class="slider"></li>
		</ul>`;

	class Slider{

		constructor(opts){
			Object.assign(this, opts);
			this.container = this.container || document.body;
			this.pages = this.imgs || [];
	
			this.pageIndex = 0;
			this.offsetAll = 0;
			this.sliderIndex = 1;

			this.sliderWrap = util.html2node(template);
			this.sliders = Array.from(this.sliderWrap.querySelectorAll('.slider'));

			this.init();
			this.nav(0);
		}

		init(){
			this.container.appendChild(this.sliderWrap);
			this._initTogs();
		}

		_addActive(elm){
			var siblings = Array.from(elm.parentNode.children);
			siblings.forEach( item => item.classList.remove('z-active') );
			elm.classList.add('z-active');
		}
		_initTogs(){
			let togsContainer = document.createElement('ul'),
				togs = [];

				togsContainer.className = 'togs';
				for(let i = 0; i < this.pages.length; i++){
					let tog = document.createElement('li');
					tog.addEventListener('click', this.nav.bind(this, i));
					togs.push(tog);
					togsContainer.appendChild(tog);
				}
				// togsContainer.addEventListener('click', e => {
				// 	var elm = e.target;
				// 	this._addActive(elm);
				// })	
			this.on('togStateChange', function(index){
				togs.forEach((tog, i) => {
					if(i === index){
						tog.classList.add('z-active');
					} else {
						if(tog.classList.contains('z-active')){
							tog.classList.remove('z-active');
						}
					}
				})
			})

			this.container.appendChild(togsContainer);	
		}

		pre(){
			this._step(-1);
		}

		next(){
			this._step(1);
		}

		_step(index){
			this.pageIndex += Number(index);
			this.offsetAll += Number(index);
			this.sliderIndex += Number(index);
			this.sliderWrap.style.transitionDuration = '.5s';
			this._calculated();
		}

		nav(index){
			this.pageIndex = index;
			this.sliderIndex = this.sliderIndex;
			this.offsetAll = index;
			this.sliderWrap.style.transitionDuration = '0s';
			this._calculated();
		}

		_normalizeIndex(index, len){
			return (index + len) % len;
		}

		_calculated(){
			const sliders = this.sliders,
				sliderWrap = this.sliderWrap,
				pageIndex = this.pageIndex = this._normalizeIndex(this.pageIndex, this.pages.length),
				sliderIndex = this.sliderIndex = this._normalizeIndex(this.sliderIndex, sliders.length);

			const preSliderIndex = this._normalizeIndex(sliderIndex - 1, sliders.length),
				nextSliderIndex = this._normalizeIndex(sliderIndex + 1, sliders.length);

			sliders[preSliderIndex].style.left = (this.offsetAll - 1) * 100 + '%';
			sliders[sliderIndex].style.left = this.offsetAll * 100 + '%';
			sliders[nextSliderIndex].style.left = (this.offsetAll + 1) * 100 + '%';

			sliderWrap.style.transform = 'translateX(' + (-this.offsetAll) * 100 + '%' + ') translateZ(0)';

			this._setImgs(pageIndex, sliderIndex);
			this.emit('togStateChange', pageIndex);


		}

		_setImgs(pageIndex, sliderIndex){
			for(var i = -1; i < this.sliders.length - 1; i++){
				var slider = this.sliders[this._normalizeIndex(sliderIndex + i, this.sliders.length)],
					img = slider.querySelector('img');
				if(!img){
					img = document.createElement('img');
					slider.appendChild(img);
				}
				let src = this.pages[this._normalizeIndex(pageIndex + i, this.pages.length)];
				if(img.src != src){
					img.src = src;
				}
				
			}
		}

	}

	util.extend(Slider.prototype, util.emitter);


	window.Slider = Slider;

})(util);