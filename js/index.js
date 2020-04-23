var Dot = /** @class */ (function () {
    function Dot() {
    }
    return Dot;
}());
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.Init = function () {
        Main.canvas = document.getElementById("canvas");
        Main.ctx = Main.canvas.getContext("2d");
        Main.canvas.width = window.innerWidth;
        Main.canvas.height = window.innerHeight;
        window.onresize = function () {
            Main.canvas.width = window.innerWidth;
            Main.canvas.height = window.innerHeight;
            Main.InsertDots();
        };
    };
    Main.Draw = function () {
        Main.InsertDots();
        Main.DrawFrame();
        Main.AnimateSiteNameText();
    };
    Main.AnimateSiteNameText = function () {
        var siteName = "belchior.dev";
        var span = document.getElementById('siteName').getElementsByClassName('text')[0];
        var i = 0;
        var intervalHandler = setInterval(function () {
            span.innerText += siteName[i];
            i++;
            if (i >= siteName.length) {
                clearInterval(intervalHandler);
            }
        }, 83);
    };
    Main.DrawFrame = function () {
        var ctx = Main.ctx;
        var radius = 2;
        // Limpar canvas
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, Main.canvas.width, Main.canvas.height);
        ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
        ctx.strokeStyle = "rgba(0, 255, 127, 0.2)";
        Main.dots.forEach(function (d) {
            if (d.x < 0 || d.x > Main.canvas.width) {
                if (d.x < 0)
                    d.x = 0;
                if (d.x > Main.canvas.width)
                    d.x = Main.canvas.width;
                d.dx *= -1;
            }
            if (d.y < 0 || d.y > Main.canvas.height) {
                if (d.y < 0)
                    d.y = 0;
                if (d.y > Main.canvas.height)
                    d.y = Main.canvas.height;
                d.dy *= -1;
            }
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            Main.GetNeighboringConnections(d).forEach(function (c) {
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(c.x, c.y);
                ctx.stroke();
            });
            d.x += d.dx;
            d.y += d.dy;
        });
        requestAnimationFrame(Main.DrawFrame);
    };
    Main.InsertDots = function () {
        var idealDotCount = (Main.canvas.width * Main.canvas.height) / 5000;
        if (Main.dots.length < idealDotCount) {
            var speed = 2;
            var qtyDotsToInsert = idealDotCount - Main.dots.length;
            for (var i = 0; i < qtyDotsToInsert; i++) {
                var angle = Math.random() * 2 * Math.PI;
                Main.dots.push({
                    x: Math.random() * Main.canvas.width,
                    y: Math.random() * Main.canvas.height,
                    dx: speed * Math.cos(angle),
                    dy: speed * Math.sin(angle)
                });
            }
        }
        else if (Main.dots.length > idealDotCount) {
            Main.dots.splice(0, Main.dots.length - idealDotCount);
        }
    };
    Main.GetNeighboringConnections = function (dot) {
        var otherDots = Main.dots.filter(function (d) { return d != dot; });
        var dists = otherDots.map(function (d) { return Math.sqrt(Math.pow(d.x - dot.x, 2) + Math.pow(d.y - dot.y, 2)); });
        var neighbors = otherDots.filter(function (v, idx) { return dists[idx] < 100; });
        if (neighbors.length == 0) {
            var minDist = Math.min.apply(null, dists);
            neighbors.push(otherDots[dists.indexOf(minDist)]);
        }
        return neighbors;
    };
    Main.dots = [];
    return Main;
}());
window.onload = function () {
    Main.Init();
    Main.Draw();
};
//# sourceMappingURL=index.js.map