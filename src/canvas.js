import React, {useRef, useEffect, useState} from 'react'
import seedrandom from 'seedrandom'
import crypto from 'crypto'

const Canvas = props => {
    // initializes ref
    const canvasRef = useRef(null)
    const linkRef = useRef(null)
    const [id,setId] = useState(crypto.randomBytes(5).toString('hex'))

    seedrandom(id,{global:true})

    const getRandomInt = (max) => {
        return Math.ceil(Math.random() * Math.ceil(max));
    }
    
    // draw function!
    const draw = (startX, startY, len, angle, branchThickness, initialThickness, baseBranch,color) => {
        const ctx = canvasRef.current.getContext('2d')

        // constants 
        const radius = branchThickness/2
        const coralColor = `rgb(${color.red},${color.green},${color.blue})`
        const side = getRandomInt(3)
        const end = getRandomInt(3)
        // randomly generates angles at which branches protrude
        const ang1 = getRandomInt(30) + 20
        const ang2 = getRandomInt(30) + 20

        
        //rounds the starts of base branches
        if (baseBranch) {
            ctx.beginPath()
            ctx.save();
            ctx.fillStyle = coralColor
            
            ctx.translate(startX, startY);
            ctx.rotate(angle * Math.PI/180);
    
            ctx.arc(0,0,radius,0,Math.PI,false)
            ctx.fill()
    
            ctx.restore()
        }
    
        // draw branch, draws curved branches at the base (for red corals) and straight ones at the top
        ctx.beginPath()
        ctx.save();
        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI/180);
        ctx.moveTo(0, 0);
        if (color.red === 247) {
            if (branchThickness < 0.80*initialThickness) {
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

        // sets up terminating condition
        const terminate = color.red === 247 ? initialThickness/2 : initialThickness * 0.78
    
        // stops generating if end === 3 and branch is less than terminate px thick
        if (end > 2) {
            if(branchThickness < terminate) {
                // makes ends rounded
                ctx.restore();
                ctx.beginPath()
                ctx.save();
                if (color.red === 247) {
                    ctx.fillStyle = '#f5d5e6'
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
    
        // always shops generating if branch thickness is less than terminate-3
        if(branchThickness < terminate-3) {
    
            // draws light pink circles on the ends
            ctx.restore();
            ctx.beginPath()
            ctx.save();
            if (color.red === 247) {
                ctx.fillStyle = '#f5d5e6'
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
        const newLen =  color.red === 247 ? len*0.5 : len*0.93
        const newThickness = color.red === 247 ? branchThickness*0.8 : branchThickness*0.8

        const newBaseBranch = false
    
        // randomizes if the branches formed are left, right, or both
        if (side === 0) {
            draw(0, -len, newLen, -ang2, newThickness, initialThickness, newBaseBranch, color);
        } else if (side === 1) {
            draw(0, -len, newLen, ang1, newThickness, initialThickness, newBaseBranch, color);
        } else {
            draw(0, -len, newLen, -ang2, newThickness, initialThickness, newBaseBranch, color);
            draw(0, -len, newLen, ang1, newThickness, initialThickness, newBaseBranch, color);
        }    
    
        // draws a straight branch ALWAYS
        draw(0, -len, newLen, 0, newThickness, initialThickness, newBaseBranch, color);
        
        // restores context before next call
        ctx.restore();
    }

    // draws red coral
    function drawRed(x,y) {
        // makes it so that there are different color
        const color = {
            red: 247,
            green: 138,
            blue: 138,
        }

        // varies the size of the corals
        const numOfBranches = 3
        const thickness = getRandomInt(10) + 10
        var angle = -70

        for (let i = 0; i < numOfBranches; i++) {
            angle = angle+35
            draw(x,y, 5*thickness, angle, thickness, thickness, true, color)

        }

        //inputs: startX, startY, len, angle, branchThickness color
    }

    // draws yellow coral
    function drawYellow(x,y) {
        // makes it so that there are different colors
        const color = {
            red: 246,
            green: 207,
            blue: 100,
        }

        // varies the size of the corals
        const numOfBranches = 3
        const thickness = getRandomInt(4) + 8
        var angle = -100

        for (let i = 0; i < numOfBranches; i++) {
            angle = angle+50
            draw(x,y, 3.9*thickness, angle, thickness, thickness, true, color)

        }

    }

    let seed;
    
    // udpates seed as used types
    const handleChange = (e) => {
        seed = e.target.value;
    }

    // initiates re-render when seed is updated
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            setId(seed)
        }
    }

    

    // so that getContext isn't called until after component has mounted
    useEffect(() => {

        // makes it responsive and improves image quality
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const { width, height } = canvas.getBoundingClientRect()

        if (canvas.width !== width || canvas.height !== height) {
            const { devicePixelRatio:ratio=1 } = window
            const context = canvas.getContext('2d')
            canvas.width = width*ratio
            canvas.height = height*ratio
            context.scale(ratio, ratio)
        }

        // draws sand
        const sandHeight = getRandomInt(height/3) + height/3
        console.log(sandHeight)

        context.fillStyle = '#9acfd6';
        context.fillRect(0,sandHeight,width,height-sandHeight)

        //draws water
        context.fillStyle = '#1673c0';
        context.fillRect(0,0,width,sandHeight)

        // generates scenery
        const redToGenerate = getRandomInt(5) +2
        const yellowToGenerate = getRandomInt(5) +2
        for (let i = 0; i<redToGenerate; i++) {
            const x = getRandomInt(width) + canvas.getBoundingClientRect().left
            const y = getRandomInt(height-sandHeight) + sandHeight

            drawRed(x,y)
        }
        for (let i = 0; i<yellowToGenerate; i++) {
            const x = getRandomInt(width) + canvas.getBoundingClientRect().left
            const y = getRandomInt(height-sandHeight) + sandHeight

            drawYellow(x,y)
        }
    },[id])

    // lets user download image when download button is pressed
    function handleDownload() {
        const link = linkRef.current
        const canvas = canvasRef.current
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'coral.jpeg';
        
    }

    // generates a new picture
    function newPicture() {
        setId(crypto.randomBytes(5).toString('hex'))
    }

    return (
        <div>
            <canvas ref={canvasRef} id='responsive-canvas' className='coral-container'{...props}/>
            <div className='buttons'>
                <a href='' ref={linkRef} className="downloadButton" onClick={handleDownload}>download</a>
                <button onClick={newPicture}>new picture</button>
                <input
                    value={seed}
                    type='text'
                    onChange={handleChange}
                    placeholder="use a seed"
                    onKeyPress={handleEnter}
                    className='taskInput'
                ></input>
            </div>
            <p>seed for this picture: {id}</p>
        </div>
    )
}

export default Canvas