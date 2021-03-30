import './App.css';
import Canvas from './canvas'
function App() {

  function draw() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');

      ctx.fillStyle = 'rgb(200, 0, 0)';
      ctx.fillRect(10, 10, 50, 50);

      ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
      ctx.fillRect(30, 30, 50, 50);
    }
  }

  return (
    <div className="App">
      <h1>Coral Reef Generator</h1>
      <body onLoad={draw}>
        <Canvas/>
      </body>
      
    </div>
  );
}

export default App;
