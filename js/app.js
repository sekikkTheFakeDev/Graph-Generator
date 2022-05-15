var elements = []
var option = ""

document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement

    //graph or pie picker
    var graph = document.getElementById("optgraph")
    var pie = document.getElementById("optpie")


    if (target.id == "optgraph") {
        pie.checked = false
        option = "chart"
        document.getElementsByClassName("og")[0].style.background = "var(--navylight)"
    }

    if (target.id == "optpie") {
        graph.checked = false;
        option = "graph"
        document.getElementsByClassName("op")[0].style.background = "var(--navylight)"
    }
    
    if (pie.checked == false) {
        document.getElementsByClassName("op")[0].style.background = "var(--navy)"
    }

    if (graph.checked == false) {
        document.getElementsByClassName("og")[0].style.background = "var(--navy)"
    }




    //add new item
    if (target.id == "plusadd") {
        var item_html = `
            <div class="itemholder">
                <div class="item">
                    <div class="x"><i class="fa-solid fa-xmark"></i></div>
                    <input type="text" class="name" placeholder="Name">
                    <input type="number" class="value" placeholder="Value">
                    <input type="color" class="colorp">
                </div>
            </div>
        `

        document.getElementsByClassName("itemsholder")[0].insertAdjacentHTML("beforeend", item_html)
    }

    //remove item
    if (target.classList.contains("x")) {
        target.parentNode.parentNode.remove()
    }

    //generate
    if (target.id == "generatebtn") {
        
        if (option == "") {
            return
        }
        
        document.getElementsByClassName("names")[0].innerHTML = ""

        
        
        elements = []
        
        var items = document.getElementsByClassName("item")

        for (var item of items) {
            let name = item.children[1].value
            let value = item.children[2].value
            let color = item.children[3].value

            elements.push({"name": name, "value": value, "color": color})
        }

        var graph = new Graph(elements, document.getElementsByClassName("graph")[0], option)
        graph.getDivisions()

        let arr = graph.divisions.reverse()
        
        for (let i = 0;i<graph.divisions.length;i++) {
            let children = document.getElementsByClassName("values")[0].children

            if (children[i].classList.contains("valueg")) {
                children[i].textContent = arr[i]
            }

        }

        let names = document.getElementsByClassName("names")[0]
        console.log(elements)
        for (let elem of elements) {
            let div = document.createElement("div")
            div.classList.add("nameg")
            console.log(elem)
            div.style.color = elem["color"]
            div.innerHTML  = elem["name"]

            names.appendChild(div)
        }

        names.style.gridTemplateColumns = `repeat(${elements.length}, 1fr)`
        

        graph.divisions.reverse()

        for (let el of document.getElementsByClassName("graphlines")) {
            el.parentNode.removeChild(el)
        }

        graph.makeLines()
    }




}, false);






class Graph{
    constructor(elements, box, option) {
        this.elements = elements

        this.divisions = [0]
        this.values = []
        this.points = []
        this.coordinates = []
        this.option = option

        this.box = box
    }

    getDivisions() {

        this.divisions = [0]

        for (let element of elements) {
            this.values.push(element["value"])
        }

        let max = Math.max.apply(Math, this.values);


        for (let i = 0; i < 6; i++) {
            let n = parseFloat((max * (1+i)/6).toFixed(2))

            this.divisions.push(n)

        }
    }

    makeLines() {

        var rowheight = this.box.clientHeight/6;
        var columnheight = this.box.clientWidth/this.elements.length
        var minval = Math.min.apply(Math, this.divisions.slice(1, this.divisions.length));

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.classList.add("graphlines")
    

        for (let i=0;i<this.values.length;i++) {
            let value = this.values[i]
            if (this.divisions.includes(1)) {
                var y = rowheight*this.divisions.indexOf(1)*value
                this.coordinates.push({"value": value, "y": this.box.clientHeight-y, "x": columnheight*(i+1)-(columnheight/2)})
            }
            else {
                var y = (rowheight/minval)*value
                this.coordinates.push({"value": value, "y": this.box.clientHeight-y, "x": columnheight*(i+1)-(columnheight/2)})
            }
        }
        if (option == "chart") {
            for (let coordinate of this.coordinates) {
                var px = coordinate["x"]
                var py = coordinate["y"]
    
                var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
        
                line.setAttribute("points", `${px},${py} ${px}, ${this.box.clientHeight}`)
                let ind = this.coordinates.indexOf(coordinate)
                line.setAttribute("style", `fill:none;stroke:${this.elements[ind]["color"]};stroke-width:${(30-this.elements.length*1.5 < 1) ? 1 : 30-this.elements.length*1.5}`)
                svg.appendChild(line)
            }
            let g = document.getElementsByClassName("graph")
            g[0].insertBefore(svg, g[0].children[0])
    
        }
        else {
            var lastcoord = `0,${this.box.clientHeight}`
            var lastcol = ""
            for (let coordinate of this.coordinates) {
                var px = coordinate["x"]
                var py = coordinate["y"]

                var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
        
                line.setAttribute("points", `${lastcoord} ${px}, ${py}`)
                let ind = this.coordinates.indexOf(coordinate)
                line.setAttribute("style", `fill:none;stroke:${this.elements[ind]["color"]};stroke-width:5`)
                lastcol = this.elements[ind]["color"]
                lastcoord = `${px}, ${py}`
                svg.appendChild(line)
            }

            var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
            line.setAttribute("points", `${lastcoord} ${this.box.clientWidth}, ${this.box.clientHeight}`)
            line.setAttribute("style", `fill:none;stroke:${lastcol};stroke-width:5`)
            svg.appendChild(line)
            let g = document.getElementsByClassName("graph")
            g[0].insertBefore(svg, g[0].children[0])

        }
    }

}