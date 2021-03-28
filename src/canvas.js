import React, {useRef, useEffect, useState} from 'react'
// import draw from './draw'

var seed = ''

var seeds = []

const Canvas = props => {
    // initializes ref
    const canvasRef = useRef(null)

   
    
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
        const side = getRandomInt(3)
        const end = getRandomInt(3)
        // randomly generates angles at which branches protrude
        const ang1 = getRandomInt(30) + 20
        const ang2 = getRandomInt(30) + 20

        seed = seed + side + end + ang1 + ang2
        
    
        if (branchThickness === 20 || branchThickness === 18) {
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
        if (color.red === 255) {
            if (branchThickness < 15) {
                ctx.lineTo(0, -len);
            } else {
                if(angle > 0) {
                    ctx.bezierCurveTo(15, -len/2, 10, -len/2, 0, -len);
                } else {
                    ctx.bezierCurveTo(-15, -len/2, -10, -len/2, 0, -len);
                }
            } 
        } else {
            ctx.lineTo(0, -len);
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
        ctx.arc(0,0-(len*.95),radius,0,Math.PI,true);
        ctx.fill()
    
    
        
        const terminate = color.red === 255 ? 10 : 14
    
        // stops generating if end === 2 and branch is less than terminate px thick
        if (end > 2) {
            if(branchThickness < terminate) {
                // makes ends rounded
                ctx.restore();
                ctx.beginPath()
                ctx.save();
                if (color.red === 255) {
                    ctx.fillStyle = '#ffbac8'
                } else {
                    ctx.fillStyle = '#fffce3'
                }
                ctx.translate(startX, startY);
                ctx.rotate(angle * Math.PI/180);
    
                ctx.arc(0,0-(len*.95),radius,0,2*Math.PI,true)
                ctx.fill()
                ctx.restore();
                return;
            }
    
        }
    
        // always shops generating if branch thickness is less than terminate-5
        if(branchThickness < terminate-5) {
    
            // draws light pink circles on the ends
            ctx.restore();
            ctx.beginPath()
            ctx.save();
            if (color.red === 255) {
                ctx.fillStyle = '#ffbac8'
            } else {
                ctx.fillStyle = '#fffce3'
            }
            ctx.translate(startX, startY);
            ctx.rotate(angle * Math.PI/180);
            ctx.arc(0,0-(len*.95),radius,0,Math.PI,true);
            ctx.fill();
            ctx.restore();
            return;
        }
    
        
    
        // makes branches progressively shorter, change to make it look more tree-like!
        const newLen =  color.red === 255 ? len*0.5 : len*0.93
        const newThickness = color.red === 255 ? branchThickness*0.8 : branchThickness*0.8
    
        // randomizes if the branches formed are left, right, or both
        console.log(side)
        if (side === 0) {
            draw(0, -len, newLen, -ang2, newThickness, likelihood*1.5, color);
        } else if (side === 1) {
            draw(0, -len, newLen, ang1, newThickness, likelihood*1.5, color);
        } else {
            draw(0, -len, newLen, -ang2, newThickness, likelihood*1.5, color);
            draw(0, -len, newLen, ang1, newThickness, likelihood*1.5, color);
        }    
    
        // draws a straight branch ALWAYS
        draw(0, -len, len*0.6, 0, branchThickness*0.8, likelihood*1.5, color);
        
        // restores context before next call
        ctx.restore();
    }

    // initializes 
    const [whatToDraw, setWhatToDraw] = useState('redCoral')

    //draws red coral
    function drawRed(x,y) {
        // makes it so that there are different colors
        const offset = getRandomInt(40)

        const color = {
            red: 255,
            green: offset + 100,
            blue: offset + 100,
        }

        draw(x,y, 100, 40, 20, 10, color)
        draw(x,y, 100, 0, 20, 10, color)
        draw(x,y, 100, -40, 20, 10, color)
    }

    // draws yellow coral
    function drawYellow(x,y) {
        // makes it so that there are different colors
        const color = {
            red: 222,
            green: getRandomInt(10) + 190,
            blue: getRandomInt(130),
        }

        draw(x,y, 70, 50, 18, 10, color)
        draw(x,y, 70, 0, 18, 10, color)
        draw(x,y, 70, -50, 18, 10, color)

    }

    // gets position and draws at position
    function getClickPosition(e) {
        console.log(e.currentTarget.getBoundingClientRect().left)

        const distFromLeft = e.currentTarget.getBoundingClientRect().left
        const distFromTop = e.currentTarget.getBoundingClientRect().top

        const x = e.clientX - distFromLeft
        const y = e.clientY - distFromTop

       if (whatToDraw === 'redCoral') {
           drawRed(x,y)
       } else if (whatToDraw === 'yellowCoral') {
           drawYellow(x,y)
       }

        seeds.push(seed)
        seed=''
        console.log(seeds)

    }

    //
    function handleSwitch(e) {
        setWhatToDraw(e.target.id)
    }
    

    // so that getContext isn't called until after component has mounted
    useEffect(() => {

        // makes it responsive
        const canvas = canvasRef.current
        console.log(canvas, canvasRef)
        const context = canvas.getContext('2d')
        console.log('context',context)

        const { width, height } = canvas.getBoundingClientRect()

        if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        }
    },[])

    console.log('rendered')

    return (
        <div>
            <canvas onClick={getClickPosition} ref={canvasRef} id='responsive-canvas' className='coral-container'{...props}/>
            <div className='buttons'>
                <button onClick={handleSwitch} id='redCoral'>Red Coral</button> 
                <button onClick={handleSwitch} id='yellowCoral'>Yellow Coral</button>
                {/* <button>Fish</button> */}
            </div>
        </div>
    )
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