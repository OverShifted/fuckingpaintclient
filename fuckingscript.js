const socket = io(fuckingpaint_server_address);

socket.on("message", function (msg_json) {
  let msg = JSON.parse(msg_json);
  drawCircle(msg.pos[0], msg.pos[1], 10, "black");
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawCircle(centerX, centerY, radius, color) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

canvas.addEventListener("mousemove", (e) => {
  if (e.buttons) {
    // drawCircle(e.offsetX, e.offsetY, 10, "black");
    socket.send(
      JSON.stringify({
        pos: [e.offsetX, e.offsetY],

        final_point: false,
      }),
    );
  }
});
