import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StarRating  from './StarRating';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={6} onSetRating={()=>console.log(2)}/>
    <StarRating
      maxRating={2}
      color="red"
      className=""
      messages={["hello", "world"]}
      defaultRating={2}
    />
  </React.StrictMode>
);

