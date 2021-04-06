import React, { useEffect, useRef } from 'react';

function roundMinutes(date) {
    date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
    date.setMinutes(0, 0, 0);
    return date;
}

export default function Sparkline({width, height, data, up, interactive}){
    const canvas = useRef(null);
    const tip = useRef(null);
    let points = [];

	// This function could probably be optimized to account for data at the edge of the bounds.
    const drawLine = (data, up) => {
		let ctx = canvas.current.getContext('2d');
		let height = canvas.current.height, width = canvas.current.width;
		let max = Math.max(...data), min = Math.min(...data);
		let xstep = width/data.length;
		let x = 0, y = height;
		
		let hours = 168;
		
		if(interactive){
			let date = roundMinutes(new Date());
			date.setHours(date.getHours() - hours)

			points.push([{
				x: x, 
				y: y,
				price: data[0],
				date: date
			}])
			hours -= 12
		}

		if (window.devicePixelRatio) {
			canvas.current.width = canvas.current.width * window.devicePixelRatio;
			canvas.current.height = canvas.current.height * window.devicePixelRatio;
			canvas.current.style.width = (canvas.current.width / window.devicePixelRatio) + 'px';
			canvas.current.style.height = (canvas.current.height / window.devicePixelRatio) + 'px';
			canvas.current.style.display = 'inline-block';
			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		}
		ctx.clearRect(0, 0, width, height);
		ctx.beginPath();
		ctx.strokeStyle = up ? 'rgb(46, 174, 52)' : 'rgb(249, 103, 45)';
		ctx.moveTo(x, y);
		for (let i = 1; i < data.length; i++) {
			x = x + xstep;
			// normalize y height
			y = height - ((data[i] - min) /( max - min)*height)
			ctx.lineTo(x, y);

			if(interactive){
				let date = roundMinutes(new Date());
				date.setHours(date.getHours() - hours)
				hours -= 12;

				points.push({x: x, y: y, data: { 
					price: data[i], 
					time: date 
				}})
			}
		}
		ctx.stroke();

		if(interactive){
			points.forEach(point => {
				ctx.beginPath();
				ctx.fillStyle = up ? 'rgba(46, 174, 52, 0.8)' : 'rgba(249, 103, 45, 0.8)';
				ctx.arc(point.x, point.y, 5, 0, Math.PI*2);
				ctx.fill();
			})
		}
    }

	function mosPos(x, y) {
		let rect = canvas.current.getBoundingClientRect();
		return {
			x: x - rect.x,
			y: y - rect.y
		}
	  }

    const tooltip = (e) => {
		let mouse = mosPos(e.clientX, e.clientY);

		let tipCanvas = tip.current;
		let tipCtx = tipCanvas.getContext('2d');

		let hit = false;
		for (let i = 0; i < points.length; i++) {
			let point = points[i];
			let dx = Math.abs(mouse.x - point.x);
			let dy = Math.abs(mouse.y - point.y);

			if(dx + dy < 25){
				tipCanvas.style.display = 'block';
				tipCtx.font = '10px Lato'
				tipCanvas.style.left = (point.x) + "px";
				tipCanvas.style.top = (point.y + 15) + "px";
				tipCtx.fillStyle = "white";
				tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
				tipCtx.fillText('$' + point.data.price.toFixed(2), 5, 15);
				let date = new Date(point.data.time)
				let dateText = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getDate() + ', ' + date.getHours() + ':00'
				tipCtx.fillText(dateText, 5, 30);
				hit = true;
				break;
			}
		}
		if (!hit) { tipCanvas.style.display = 'none'; }
    }
    
    useEffect(() => {
        drawLine(data, up);
    }, [])

	// To-Do: Adding animation so on show/hide.
    return(
        <>
        <canvas onMouseMove={(e) => interactive && tooltip(e)} style={{background: interactive && 'rgb(38, 53, 67)', marginTop: interactive && '-4px', zIndex: '1'}} ref={canvas} width={width} height={height}>
            Your browser does not support the HTML5 canvas tag.
        </canvas>
		{interactive && <canvas style={{background: 'rgb(18, 29, 39)', display: 'none', zIndex: '2', position: 'absolute'}} ref={tip} width="75" height="40">
            Your browser does not support the HTML5 canvas tag.</canvas>}
        </>
    )
}