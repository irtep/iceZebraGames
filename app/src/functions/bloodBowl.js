
// draw a grid to football field
export const drawBBfield = (kanv, xLines, yLines) => {
  const grid_size = 35;
  const canvas = document.getElementById(kanv);
  const ctx = canvas.getContext("2d");
  const canvas_width = canvas.width;
  const canvas_height = canvas.height;
  const num_lines_x = Math.floor(xLines);
  const num_lines_y = Math.floor(yLines);

  // call clear

  // Draw grid lines along X-axis
  for(let i = 0; i <= num_lines_x; i++) {
    ctx.beginPath();
    if (i === 5 || i === 12) {
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
      ctx.beginPath();
      if ( i === 14 || i === 1 || i === 27 ) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = "#e9e9e9";
        ctx.lineWidth = 1;
      }
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

    // draw endZones
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
}

// draw football players, clear and field need to always call before this
export const drawPlayers = (kanv, team1, team2) => {
  const baseSize = 30;
  const canvas = document.getElementById(kanv);
  const ctx = canvas.getContext("2d");

  team1
  // draw center circle
  ctx.beginPath();
  ctx.strokeStyle = "rgb(190,190,190)";
  ctx.arc(490, 300, 50, 0, 2 * Math.PI);
  ctx.stroke();
}
