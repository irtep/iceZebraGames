import { wmTerrain1 } from '../constants/constants';

// draw a grid to warmachine field
export const drawWMfield = (kanv, xLines, yLines, team1, team2, ball) => {
  const baseSize = 15;
  const grid_size = 25.4 / 1.25;
  const canvas = document.getElementById(kanv);
  const ctx = canvas.getContext("2d");
  const canvas_width = canvas.width;
  const canvas_height = canvas.height;
  const num_lines_x = Math.floor(xLines);
  const num_lines_y = Math.floor(yLines);

  // call clear
  ctx.clearRect(0, 0, canvas_width, canvas_height);

  // draw the terrain
  wmTerrain1.forEach((item, i) => {
//    console.log('item: ', item);
    if (item.form === 'square') {
      ctx.beginPath();
      ctx.fillStyle = item.color;
      ctx.rect(item.x, item.y, item.w, item.h);
      ctx.fill();
      ctx.closePath();
    }
    if (item.form === 'circle') {
      ctx.beginPath();
      ctx.fillStyle = item.color;
      ctx.arc(item.x, item.y, item.s, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  });

  // Draw grid lines along X-axis
  for(let i = 0; i <= num_lines_x; i++) {
    ctx.beginPath();
    if (i === 8 || i === 37) { // depo zonet 7 ja 10 inchiin
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 3;
    }
    else if (i === 1 || i === xLines) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = "#e9e9e9";
      ctx.lineWidth = 1;
    }
    if (i === num_lines_x) {
      ctx.moveTo(20, grid_size*i);
      ctx.lineTo(canvas_width, grid_size*i);
    }
    else {
      ctx.moveTo(20, grid_size*i);
      ctx.lineTo(canvas_width, grid_size*i+0.5);
    }
      ctx.stroke();
    }

    // Draw grid lines along Y-axis
    for (let i = 0; i <= num_lines_y; i++) {
      ctx.beginPath(); /*
      if ( i === 14 || i === 1 || i === 27 ) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
      } else {*/
        ctx.strokeStyle = "#e9e9e9";
        ctx.lineWidth = 1;
      //}
      if(i === num_lines_y) {
        ctx.moveTo(grid_size*i, 20);
        ctx.lineTo(grid_size*i, canvas_height);
      }
      else {
        ctx.moveTo(grid_size*i, 20);
        ctx.lineTo(grid_size*i, canvas_height);
        ctx.fillStyle = 'red';
        ctx.fillText (i, grid_size*i, 20);
        ctx.fill();
      }
      ctx.stroke();
    }

    // draw objectives:
      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.arc(200, 490, 20, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.arc(490, 490, 20, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.arc(800, 490, 20, 0, 2 * Math.PI);
      ctx.stroke();

    // draw endZones
    /*
    ctx.beginPath();
    ctx.fillStyle = "navy";
    ctx.rect(35, 35, grid_size, grid_size * xLines - 35);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "darkRed";
    ctx.rect(35 * yLines - 35, 35, grid_size, grid_size * xLines - 35);
    ctx.fill();

    // draw center circle
    ctx.beginPath();
    ctx.strokeStyle = "rgb(190,190,190)";
    ctx.arc(490, 300, 50, 0, 2 * Math.PI);
    ctx.stroke();
*/
/*
    // draw the ball
    if (ball !== undefined) {
      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.arc(ball.x, ball.y, 20, 0, 2 * Math.PI);
      ctx.stroke();
    }
*/
    //draw teams
    if (team1 !== undefined) {
      //console.log('drawing teams');
      team1.forEach((item, i) => {
        //console.log('first guy: ', item.x, item.y);
        ctx.beginPath();
        ctx.fillStyle = "rgb(190,190,190)";
        ctx.arc(item.x, item.y, baseSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = 'red';
        ctx.font = '12px Times New Roman';
        ctx.fillStyle = 'silver';
        ctx.fillText(item.name, item.x - 30, item.y - 10);
        ctx.fillStyle = 'white';
        ctx.fillText(item.status, item.x - 20, item.y);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      team2.forEach((item, i) => {
        //console.log('first guy: ', item.x, item.y);
        ctx.beginPath();
        ctx.fillStyle = "rgb(70,70,70)";
        ctx.arc(item.x, item.y, baseSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = 'blue';
        ctx.font = '12px Times New Roman';
        ctx.fillStyle = 'silver';
        ctx.fillText(item.name, item.x - 30, item.y - 10);
        ctx.fillStyle = 'white';
        ctx.fillText(item.status, item.x - 20, item.y);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });
    } else {
      console.log('team1 undefined');
    }
}
