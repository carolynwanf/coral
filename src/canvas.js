import React, {useRef, useEffect, useState} from 'react'
// import draw from './draw'


const Canvas = props => {

    const canvasRef = useRef(null)

    const [x, setX] = useState(150)
    const [y, setY] = useState(140)

    function getClickPosition(e) {
        

        console.log(e.current)

        const tempX = e.clientX
        const tempY = e.clientY

        // initiates re-render so tree is drawn at new x,y
        setX(tempX);
        setY(tempY); 
        
        
        const offset = getRandomInt(40)

        const color = {
            red: 255,
            green: offset + 100,
            blue: offset + 100,
        }
        
        draw(tempX,tempY, 100, 40, 20, 10, color)
        draw(tempX,tempY, 100, 0, 20, 10, color)
        draw(tempX,tempY, 100, -40, 20, 10, color)
    }

    // random integer function
    const getRandomInt = (max) => {
        return Math.ceil(Math.random() * Math.ceil(max));
    }
    
    // draw function!
    const draw = (startX, startY, len, angle, branchThickness, likelihood, color) => {
        const ctx = canvasRef.current.getContext('2d')
        console.log('draw called')
    
        
    
        // constants 
        const radius = branchThickness/2
        const coralColor = `rgb(${color.red},${color.green},${color.blue})`
        const render = getRandomInt(likelihood)
        const side = getRandomInt(3)
        
    
        if (branchThickness === 20) {
            ctx.beginPath()
            ctx.save();
            ctx.fillStyle = coralColor
            
            ctx.translate(startX, startY);
            ctx.rotate(angle * Math.PI/180);
    
            ctx.arc(0,0,radius,0,Math.PI,false)
            ctx.fill()
    
            ctx.restore()
        }
        
        
    
        // draw branch, draws curved branches at the base and straight ones at the top
        ctx.beginPath()
        ctx.save();
        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI/180);
        ctx.moveTo(0, 0);
        if (branchThickness < 15) {
            ctx.lineTo(0, -len);
        } else {
            if(angle > 0) {
                ctx.bezierCurveTo(10, -len/2, 10, -len/2, 0, -len);
            } else {
                ctx.bezierCurveTo(-10, -len/2, -10, -len/2, 0, -len);
            }
        }
        ctx.strokeStyle = coralColor
        ctx.lineWidth = branchThickness
        ctx.stroke();
    
        ctx.restore()
    
        ctx.beginPath()
        ctx.save();
        ctx.fillStyle = coralColor
        
        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI/180);
    
        ctx.arc(0,0-(len*.95),radius,0,Math.PI,true)
        
        ctx.fill()
    
    
        const end = getRandomInt(3)
    
        // stops generating if end === 2 and branch is less than 10 px thick
        if (end > 1) {
            if(branchThickness < 10) {
                // makes ends rounded
                ctx.restore();
                ctx.beginPath()
                ctx.save();
                ctx.fillStyle = '#ffbac8'
                
                ctx.translate(startX, startY);
                ctx.rotate(angle * Math.PI/180);
    
                ctx.arc(0,0-(len*.95),radius,0,2*Math.PI,true)
                ctx.fill()
                ctx.restore();
                  return;
            }
    
        }
    
        // always shops generating if branch thickness is less than four
        if(branchThickness < 4) {
    
            // draws light pink circles on the ends
            ctx.restore();
            ctx.beginPath()
            ctx.save();
            ctx.fillStyle = '#ffbac8';
            ctx.translate(startX, startY);
            ctx.rotate(angle * Math.PI/180);
            ctx.arc(0,0-(len*.95),radius,0,Math.PI,true);
            ctx.fill();
            ctx.restore();
            return;
        }
    
        // randomly generates angles at which branches protrude
        const ang1 = getRandomInt(30) + 20
        const ang2 = getRandomInt(30) + 20
    
        // makes branches progressively shorter, change to make it look more tree-like!
        const newLen = len*0.5
    
        // randomizes if the branches formed are left, right, or both
        if (side === 0) {
            draw(0, -len, newLen, -ang2, branchThickness*0.8, likelihood*1.5, color);
        } else if (side === 1) {
            draw(0, -len, newLen, ang1, branchThickness*0.8, likelihood*1.5, color);
        } else {
            draw(0, -len, newLen, -ang2, branchThickness*0.8, likelihood*1.5, color);
            draw(0, -len, newLen, ang1, branchThickness*0.8, likelihood*1.5, color);
        }    
    
        // draws a straight branch ALWAYS
        draw(0, -len, len*0.6, 0, branchThickness*0.8, likelihood*1.5, color);
        
        // restores context before next call
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


        
        // draw(context)
    },[])

    console.log('rendered')

    return <canvas onClick={getClickPosition} ref={canvasRef} id='responsive-canvas' className='coral-container'{...props}/>
}

export default Canvas


// practice draw function
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