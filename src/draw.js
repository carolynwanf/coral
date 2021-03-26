function getRandomInt(max) {
    return Math.ceil(Math.random() * Math.ceil(max));
}

const draw = (startX, startY, len, angle, branchThickness, likelihood, ctx) => {

    console.log('draw called')
    // console.log('inputs',startX, startY, len, angle, ctx, ctx.beginPath())

    

    // constants in order of use
    const radius = branchThickness/2
    const color = '#ff4f72'
    const render = getRandomInt(likelihood)
    const side = getRandomInt(3)
    

    if (branchThickness === 20) {
        ctx.beginPath()
        ctx.save();
        ctx.fillStyle = '#ff5c85'
        
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
    ctx.strokeStyle = color
    ctx.lineWidth = branchThickness
    ctx.stroke();

    ctx.restore()

    ctx.beginPath()
    ctx.save();
    ctx.fillStyle = color
    
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
        draw(0, -len, newLen, -ang2, branchThickness*0.8, likelihood*1.5,ctx);
    } else if (side === 1) {
        draw(0, -len, newLen, ang1, branchThickness*0.8, likelihood*1.5, ctx);
    } else {
        draw(0, -len, newLen, -ang2, branchThickness*0.8, likelihood*1.5, ctx);
        draw(0, -len, newLen, ang1, branchThickness*0.8, likelihood*1.5, ctx);
    }    

    // draws a straight branch ALWAYS
    draw(0, -len, len*0.6, 0, branchThickness*0.8, likelihood*1.5, ctx);
    
    // restores context before next call
    ctx.restore();
}

export default draw