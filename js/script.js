
// Cria o canvas
let canvas = document.getElementsByClassName("grafo")[1]
let ctx = canvas.getContext("2d")

//  Guarda todos os vertices
let graph = []

// Guarda as arestas
let edges = []

// * Funções para descobrir se o grafo é cíclico *
//criando objeto guardar os vertices do mesmo caminho
function createSubsets(graph){
	return{
	graph: graph,
	parents: [graph.length],
	}
}

//função que procura o vizinho inicial do vertice, que mostra se o vertice já pertence a algum subgrupo
function find(a,graph,parents){
	let i = graph.indexOf(a)
	console.log("O indice inicial")
	console.log(i + 1)
	//Aqui eu procuro pelo vizinho inicial, que possui o valor -1, ou seja que esta conectado a ele mesmo, enquanto os outros vertices se conectam a ele
	while(parents[i] !== -1){ 
		i = parents[i]
		console.log("O indice atual")
		console.log(i + 1)
		
	}	
		return i		
	/*if(parents[i] !== -1){ 
		console.log("O indice atual")
		console.log(parents[i] + 1)
		return parents[i]
	}else{
		console.log("O indice atual")
		console.log(i + 1)
		return i
	}*/
}
//Função que une os vertices ao menor vizinho inicial
function union(a,b,graph,parents){
	let rootA = find(a,graph,parents)
	let rootB = find(b,graph,parents)
	console.log("Estou unindo")
	
	console.log("Esses dois aqui são iguais ou diferentes:")
	console.log("A:",rootA + 1)
	console.log("B:",rootB + 1)
	
	
	if (rootA === rootB) return
	
		if(rootA < rootB){
			if (parents[rootB] != rootB){
				parents[rootB] = rootA
				console.log("Novo vizinho de B")
				console.log(parents[rootB] + 1)
			}
		} else {
			if (parents[rootA] != rootA){
				parents[rootA] = rootB
				console.log("Novo vizinho de A")
				console.log(parents[rootA] + 1)
			}
		}

}
//Função que verifica se estes vertices já estão conectados, se estiverem, os vizinhos iniciais são os mesmos
function connected(a,b,graph,parents){
	return find(a,graph,parents) === find(b,graph,parents)
}

// * Funções da fila de prioridade *
//Função para criar nova fila com prioridade
function newPriorityQueue(maxSize){
	return{
		maxSize: maxSize,
		container: []
	}	
}
// Criando novo elemento da fila
function newElement(data,priority){
	return{
		data: data,
		priority: priority
	}	
}
//Função para verificar se a fila esta vazia
function isEmpty(container){
	return container.length === 0
}
//Função para inserir aresta na fila
 function enqueue(data,priority,container){
	let currElem = newElement(data,priority)
	let addedFlag = false
	for (let i = 0; i < container.length; i++){
		if(currElem.priority <= container[i].priority){
			container.splice(i,0,currElem)
			addedFlag = true
			break
		}
	}
	if(!addedFlag){
		container.push(currElem)
	}
 }
//Função para remover aresta na fila
function dequeue(container){
	if(isEmpty(container)){
		return
	}
	return container.shift();
}

// * Obter a margem esquerda do quadro pois ela pode variar


// Gera um valor pseudo-randomico de X dentro do quadro
const randX = () => Math.floor(Math.random()*960)+255

// Gera um valor pseudo-randomico de X dentro do quadro
const randY = () => Math.floor(Math.random()*510)+116

// Calcula a posição em X que o pop up devera ser renderizado com relação a aresta
const popUpPositionX = (v1, v2) => (v1.x + v2.x)/2

// Calcula a posição em Y que o pop up devera ser renderizado com relação a aresta
const popUpPositionY = (v1, v2) => ((v1.y + v2.y)/2)-40

// A função gera um vertice aleatório
function createVertex() {
    return {
        x: randX(),
        y: randY(),
        selected: false,
        neighbors: [],
        element: document.createElement("div")
    }
}

// A função cria uma aresta ponderada
function createEdge(v1, v2) {
    return {
        vertex1: v1,
        vertex2: v2,
        popUp: createPopUp(v1, v2)
    }
}

// A função gera o pop up que sera mostrado ao lado do vertice criado
function createPopUp(v1, v2) {
    return {
        x: popUpPositionX(v1, v2),
        y: popUpPositionY(v1, v2),
        box: document.createElement("div"),
        field: document.createElement("input"),
        button: document.createElement("div"),
    }   
}

// # #    ESSA É A FUNÇÃO CHAMADA AO CLICAR NA TELA    # #
// Cria um vertice, configura-o e renderiza
function renderVertex() {

    let vertex = createVertex()
    vertex.id = graph.length

    graph.push(vertex)

    vertex.element.setAttribute("class", "ball")
    vertex.element.setAttribute("style", "top:" + (vertex.y) + "px;left:" + (vertex.x) + "px")
    vertex.element.setAttribute("onclick", "drawEdge("+ vertex.id +")")
    vertex.element.innerHTML = vertex.id+1

    document.body.appendChild(vertex.element)
}

// Desenha a aresta na tela
function drawEdge(id) {
    // graph[id].element.setAttribute("style", "backgroundColor: red;")

    let thereIsSelected = false
    let catchSelected = null

    // Verifica se há vertice selecionado
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].selected) {
            thereIsSelected = true
            catchSelected = graph[i]
        }
    }

// CASO 1: Se ja existir um vertice selecionado
    if (thereIsSelected) {

        catchSelected.neighbors.push(graph[id])
        graph[id].neighbors.push(catchSelected)

        // A função lineTo() e a moveTo() não usam proporções 
        // baseadas em pixels. Por isso é necessario converter...
        let proporcaoTop = 550/150
        let proporcaoLeft = 1000/300
        let top = 100
        let left = 235

		// Desenhando a aresta
		ctx.beginPath()
        ctx.moveTo(((catchSelected.x-left)/proporcaoLeft), ((catchSelected.y-top)/proporcaoTop))
        ctx.lineTo(((graph[id].x-left)/proporcaoLeft), ((graph[id].y-top)/proporcaoTop))
        ctx.stroke()

        // Salva a aresta no vetor de arestas e renderiza a pop up
        let edge = createEdge(catchSelected, graph[id])
        edge.id = edges.length
        edge.popUp.field.setAttribute("id", edge.id.toString())
        edges.push(edge)
        renderPopUp(edge)

        // Deseleciona todos os vertices
        for (let i = 0; i < graph.length; i++) {
            graph[i].selected = false
        } 
    
// CASO 2: Se não holver nenhum vertice selecionado 
    } else {
        graph[id].selected = true
    }
}

// Renderiza o pop up referente a aresta que acabou de ser criada
function renderPopUp(edge) {

    // Configura o corpo do pop up
    edge.popUp.box.setAttribute("class", "popUp")
    edge.popUp.box.setAttribute("style", "top:" + (edge.popUp.y) + "px;left:" + (edge.popUp.x) + "px")

    // Configura o campo de texto
    edge.popUp.field.setAttribute("type", "text")
    edge.popUp.field.setAttribute("class", "field")
	edge.popUp.field.setAttribute("style", "top:" + (edge.popUp.y) + "px;left:" + (edge.popUp.x) + "px")
	edge.popUp.field.setAttribute("autufocus", "")

    // Configura o botão
    edge.popUp.button.setAttribute("class", "popUp-button")
    edge.popUp.button.setAttribute("style", "top:" + (edge.popUp.y+35) + "px;left:" + (edge.popUp.x+28) + "px")
    edge.popUp.button.innerHTML = "OK"
    edge.popUp.button.setAttribute("onclick", "hidePopUp("+ edge.id +")")

    // Renderiza o pop up inteiro na tela 
    document.body.appendChild(edge.popUp.box)
    document.body.appendChild(edge.popUp.field)
    document.body.appendChild(edge.popUp.button)
}

// Oculta o pop up
function hidePopUp(id) {

    if(document.getElementById(id).value !== "") {
         
        // Salva o peso da aresta
		edges[id].weight = Number(document.getElementById(id).value)
		console.log("edges[id].weight: ", typeof(edges[id].weight))

        // Substitui a pop up por um balãozinho com o peso perto da aresta
        edges[id].popUp.box.setAttribute("class", "popUp2")
        edges[id].popUp.box.innerHTML = edges[id].weight

        // Oculta o botao e a caixa de texto da pop up
        edges[id].popUp.field.setAttribute("style", "display:none")
        edges[id].popUp.button.setAttribute("style", "display:none")
    }
}

function m_s_t() {
    // Algoritmo da Árvore Geradora Mínima
	// Criando a Árvore Geradora Mínima
	let MSTvertex = []
	let MSTedge = []
	graph.forEach(vertex => MSTvertex.push(vertex))
	if (graph.length === 0){
		return MSTvertex
	}
	
	// Criando uma fila de prioridade das arestas
	let edgeQueue = newPriorityQueue(edges.length)
	console.log(edgeQueue.maxSize)
	
	// Adicionando as arestas a fila de prioridade
	for(let i in edges){
		enqueue([edges[i].vertex1,edges[i].vertex2],edges[i].weight,edgeQueue.container)
	}
	//Criando objeto para verificar se o vetor e cíclico
	let subsets = createSubsets(graph)
	for(let i = 0; i < graph.length; i++){
		subsets.parents[i] = -1
	}	
	//Aqui retira da fila ordenada as arestas e verifica se são cíclicos	
	while(!isEmpty(edgeQueue.container)){
		let nextEdge = dequeue(edgeQueue.container)
		let nodes = nextEdge.data
		let weight = nextEdge.priority
		//Aqui estou vendo qual a proxima aresta a ser retirada da fila,com seus vertices e peso
		console.log(nextEdge.data)
		console.log(nodes[0])
		console.log(nodes[1])
		console.log("Aresta de Peso:")
		console.log(weight)
		//Aqui verifico se os vertices estão conectados
		if (!connected(nodes[0],nodes[1],subsets.graph,subsets.parents)){
			let edge = createEdge(nodes[0],nodes[1],weight)
			MSTedge.push(edge)
			//Se não estiver conectados, aqui eu uno os dois
			union(nodes[0],nodes[1],subsets.graph,subsets.parents)
		}
	}
	
	// Aqui deve retornar as arestas e pesos da arvore gerada
	console.log(MSTedge)

	renderMST(MSTedge)
	return MSTedge
}

// Rederiza arvore geradora Mínima
function renderMST(MSTedge) {
	// ctx.clearRect(0, 0, 1000, 550)

	let proporcaoTop = 550/150
	let proporcaoLeft = 1000/300
	let top = 100
	let left = 235
		
	ctx.beginPath()
	for (let i = 0; i < MSTedge.length; i++) {
		ctx.strokeStyle = 'red'

		ctx.moveTo(((MSTedge[i].vertex1.x-left)/proporcaoLeft), ((MSTedge[i].vertex1.y-top)/proporcaoTop))
        ctx.lineTo(((MSTedge[i].vertex2.x-left)/proporcaoLeft), ((MSTedge[i].vertex2.y-top)/proporcaoTop))
		ctx.stroke()
		ctx.restore()	
	}
	
}

