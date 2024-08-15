const socket = io(fuckingpaint_server_address);

socket.emit("login", "{}");

var users = {};
var prevPos = null;
var prevButtons = 0;

socket.on("message", function (msg) {
  let [x, y] = msg.pos;
  if (msg.type == "add_brush_point") {
    // drawCircle(x, y, 10, "#" + msg.user.color);
    drawLine(msg.prevPos, msg.pos, 10, "#" + msg.user.color);
  } else if (msg.type == "mouse_cursor") {
    drawCircle(x, y, 3, "red");

    let cursor = document.getElementById("cursor");
    let radius = cursor.getBoundingClientRect().width / 2;
    cursor.style.left = (x - radius).toString() + "px";
    cursor.style.top = (y - radius).toString() + "px";
  }
});

socket.on("login", function (msg_json) {
  console.log(msg_json);
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawCircle(centerX, centerY, radius, color) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(prevPos, pos, width, color) {
  ctx.beginPath();
  ctx.moveTo(prevPos[0], prevPos[1]);
  ctx.lineTo(pos[0], pos[1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

canvas.addEventListener("mousemove", (e) => {
  let pos = [e.offsetX, e.offsetY];

  if (e.buttons) {
    socket.send({
      type: "add_brush_point",
      pos: pos,
      prevPos: prevButtons && prevPos ? prevPos : pos,
      final_point: false,
    });

    prevPos = pos.slice();
  } else {
    socket.send({
      type: "mouse_cursor",
      pos: pos,
    });
  }

  prevButtons = e.buttons;
});
