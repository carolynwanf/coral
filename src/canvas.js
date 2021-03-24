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

    const draw = (startX, startY, len, angle, ctx) => {

        console.log('draw called')
        // console.log('inputs',startX, startY, len, angle, ctx, ctx.beginPath())
        ctx.beginPath()
        ctx.save();
        
        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI/180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);
        ctx.strokeStyle = "#ff5c85"
        ctx.stroke();
        
        if(len < 10) {
          ctx.restore();
          return;
        }
        
        draw(0, -len, len*0.8, -30, ctx);
        draw(0, -len, len*0.8, 30, ctx);
        
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


        draw(x,y, 35, 15, context)
        draw(x,y, 35, 0, context)
        draw(x,y, 35, -15, context)
        // draw(context)
    },[draw])

    console.log('rendered')

    return <canvas onClick={getClickPosition} ref={canvasRef} id='responsive-canvas' className='coral-container'{...props}/>
}

export default Canvas