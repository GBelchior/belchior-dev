class Dot {
    public x: number;
    public y: number;
    public dx: number;
    public dy: number;
}

class Main {
    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;

    private static dots: Dot[] = [];

    private constructor() { }

    static Init() {
        Main.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        Main.ctx = Main.canvas.getContext("2d");

        Main.canvas.width = window.innerWidth;
        Main.canvas.height = window.innerHeight;

        window.onresize = function () {
            Main.canvas.width = window.innerWidth;
            Main.canvas.height = window.innerHeight;

            Main.InsertDots();
        }
    }

    static Draw() {
        Main.InsertDots();
        Main.DrawFrame();
        
        Main.AnimateSiteNameText();
    }

    private static AnimateSiteNameText() {
        let siteName = "belchior.dev";
        let span = document.getElementById('siteName').getElementsByClassName('text')[0] as HTMLSpanElement;
        let i = 0;

        let intervalHandler = setInterval(() => {
            span.innerText += siteName[i];
            i++;

            if (i >= siteName.length) {
                clearInterval(intervalHandler);
            }
        }, 83)
    }

    private static DrawFrame() {
        let ctx = Main.ctx;
        let radius = 2;

        // Limpar canvas
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, Main.canvas.width, Main.canvas.height);

        ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
        ctx.strokeStyle = "rgba(0, 255, 127, 0.2)";

        Main.dots.forEach(d => {
            if (d.x < 0 || d.x > Main.canvas.width) {
                if (d.x < 0) d.x = 0;
                if (d.x > Main.canvas.width) d.x = Main.canvas.width;
                d.dx *= -1;
            }

            if (d.y < 0 || d.y > Main.canvas.height) {
                if (d.y < 0) d.y = 0;
                if (d.y > Main.canvas.height) d.y = Main.canvas.height;
                d.dy *= -1;
            }

            ctx.beginPath();
            ctx.arc(d.x, d.y, radius, 0, 2 * Math.PI);
            ctx.fill();

            Main.GetNeighboringConnections(d).forEach(c => {
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(c.x, c.y);
                ctx.stroke();
            });

            d.x += d.dx;
            d.y += d.dy;
        });

        requestAnimationFrame(Main.DrawFrame);
    }

    private static InsertDots() {
        let idealDotCount = (Main.canvas.width * Main.canvas.height) / 5000;

        if (Main.dots.length < idealDotCount) {
            let speed = 2;
            let qtyDotsToInsert = idealDotCount - Main.dots.length;
            for (let i = 0; i < qtyDotsToInsert; i++) {
                let angle = Math.random() * 2 * Math.PI;

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
    }

    private static GetNeighboringConnections(dot: Dot): Dot[] {
        let otherDots = Main.dots.filter(d => d != dot);

        let dists = otherDots.map(d => Math.sqrt(Math.pow(d.x - dot.x, 2) + Math.pow(d.y - dot.y, 2)));
        let neighbors = otherDots.filter((v, idx) => dists[idx] < 100);

        if (neighbors.length == 0) {
            let minDist = Math.min.apply(null, dists);
            neighbors.push(otherDots[dists.indexOf(minDist)]);
        }

        return neighbors;
    }
}

window.onload = function () {
    Main.Init();
    Main.Draw();
}
