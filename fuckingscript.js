const socket = io(fuckingpaint_server_address);

socket.emit("login", "{}");

var users = {};

socket.on("message", function (msg) {
  let [x, y] = msg.pos;
  if (msg.type == "add_brush_point") {
    drawCircle(x, y, 10, "#" + msg.user.color);
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

canvas.addEventListener("mousemove", (e) => {
  socket.send({
    type: "mouse_cursor",
    pos: [e.offsetX, e.offsetY],
  });

  if (e.buttons) {
    socket.send({
      type: "add_brush_point",
      pos: [e.offsetX, e.offsetY],
      final_point: false,
    });
  }
});
