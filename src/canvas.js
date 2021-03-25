import React, {useRef, useEffect, useState} from 'react'
import getPosition from './getPosition.js'

const Canvas = props => {

    const canvasRef = useRef(null)

    const [x, setX] = useState(150)
    const [y, setY] = useState(140)

    function getClickPosition(e) {
        const position = getPosition(e.currentTarget, e.clientX, e.clientY)
        const tempX = position.x -83
        const tempY = position.y -143
        setX(tempX);
        setY(tempY);    
    }

    // const draw = ctx => {
    //     // random


    //     ctx.fillStyle = '#ff5c85'
    //     ctx.beginPath()

    //     console.log(ctx.beginPath())
        
    //     for (let i=0; i<6;i++) {
    //         ctx.arc(x, y-(i*10), 10, 0, 2*Math.PI)
    //     }
    //     ctx.fill()
    // }

    const draw = (startX, startY, len, angle, branchThickness, likelihood, ctx) => {

        console.log('draw called')
        // console.log('inputs',startX, startY, len, angle, ctx, ctx.beginPath())

        const radius = branchThickness/2

        //draw circles at end
    

        ctx.beginPath()
        

        
        ctx.beginPath()
        ctx.save();
        
        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI/180);
        
        ctx.moveTo(0, 0);
        
        
        ctx.lineTo(0, -len);
        ctx.strokeStyle = "#ff5c85"
        ctx.lineWidth = branchThickness
        ctx.stroke();
        
        if(branchThickness < 10) {
        // makes ends rounded
          ctx.restore();
          ctx.beginPath()
          ctx.save();
          ctx.fillStyle = '#ff5c85'
          
          ctx.translate(startX, startY);
          ctx.rotate(angle * Math.PI/180);
  
          ctx.arc(0,0-len,radius,0,Math.PI,true)
          ctx.fill()
  
          ctx.restore()
          return;
        }

        // if (branchThickness === 20) {
        //     branchThickness = 15
        // } else {
        //     branchThickness = 0.8*branchThickness
        // }

        function getRandomInt(max) {
            return Math.ceil(Math.random() * Math.ceil(max));
        }

        const render = getRandomInt(likelihood)
        const side = getRandomInt(3)

        if (render > 5) {
            if (side === 0) {
                draw(0, -len, len*0.8, -30, branchThickness*0.8, likelihood*1.5,ctx);
            } else if (side === 1) {
                draw(0, -len, len*0.8, 30, branchThickness*0.8, likelihood*1.5, ctx);
            } else {
                draw(0, -len, len*0.8, -30, branchThickness*0.8, likelihood*1.5, ctx);
                draw(0, -len, len*0.8, 30, branchThickness*0.8, likelihood*1.5, ctx);
            }
            
        }
        
        draw(0, -len, len*0.8, 0, branchThickness*0.8, likelihood*1.5, ctx);
        
        
        ctx.restore();
    }

    

    // so that getContext isn't called until after component has mounted
    useEffect(() => {
        const canvas = canvasRef.current
        console.log(canvas, canvasRef)
        const context = canvas.getContext('2d')
        console.log('context',context)


        const { width, height } = canvas.getBoundingClientRect()

        if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        }


        draw(x,y, 100, 25, 20, 10, context)
        draw(x,y, 100, 0, 20, 10,context)
        draw(x,y, 100, -25, 20, 10, context)
        // draw(context)
    },[draw])

    console.log('rendered')

    return <canvas onClick={getClickPosition} ref={canvasRef} id='responsive-canvas' className='coral-container'{...props}/>
}

export default Canvas