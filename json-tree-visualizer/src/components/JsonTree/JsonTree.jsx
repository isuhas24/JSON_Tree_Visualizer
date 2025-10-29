import { useEffect, useMemo } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './JsonTree.scss'

// Custom node component with handles
const CustomNode = ({ data }) => {
  return (
    <div className={`json-node json-node--${data.nodeType}`}>
      <Handle type="target" position={Position.Top} />
      <div className="json-node__label">{data.label}</div>
      {data.value && <div className="json-node__value">{data.value}</div>}
      <div className="json-node__path">{data.path}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

const JsonTree = ({ jsonData, searchTerm }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Process JSON data into nodes and edges
  useEffect(() => {
    if (!jsonData) {
      setNodes([])
      setEdges([])
      return
    }

    const newNodes = []
    const newEdges = []
    let nodeCounter = 0

    const processData = (data, parentId = null, path = '$', x = 0, y = 0, level = 0) => {
      const currentNodeId = `node-${nodeCounter++}`
      const isArray = Array.isArray(data)
      const isObject = typeof data === 'object' && data !== null && !isArray
      
      // Determine node type and content
      let nodeType, label, value;
      
      if (data === null) {
        nodeType = 'primitive'
        label = 'null'
        value = 'null'
      } else if (data === undefined) {
        nodeType = 'primitive'
        label = 'undefined'
        value = 'undefined'
      } else if (typeof data !== 'object') {
        nodeType = 'primitive'
        label = String(data)
        value = typeof data
      } else if (isArray) {
        nodeType = 'array'
        label = `Array[${data.length}]`
        value = `${data.length} items`
      } else {
        nodeType = 'object'
        label = 'Object'
        value = `${Object.keys(data).length} properties`
      }

      // Create current node
      newNodes.push({
        id: currentNodeId,
        type: 'custom',
        position: { x, y },
        data: {
          label,
          value,
          path,
          isHighlighted: path === searchTerm,
          nodeType
        }
      })

      // Add edge to parent if exists
      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${currentNodeId}`,
          source: parentId,
          target: currentNodeId,
          type: 'smoothstep',
        })
      }

      // Process children for objects and arrays
      if ((isArray || isObject) && data !== null) {
        const entries = isArray ? data.entries() : Object.entries(data)
        let childIndex = 0
        
        for (const [key, value] of entries) {
          const childPath = isArray ? `${path}[${key}]` : `${path}.${key}`
          const childX = x + (childIndex * 250)
          const childY = y + 150
          
          processData(value, currentNodeId, childPath, childX, childY, level + 1)
          childIndex++
        }
      }
    }

    // Start processing from root
    processData(jsonData)
    
    setNodes(newNodes)
    setEdges(newEdges)
  }, [jsonData, searchTerm])

  const nodeTypes = useMemo(() => ({
    custom: CustomNode
  }), [])

  if (!jsonData) {
    return (
      <div className="json-tree-empty">
        <p>Enter JSON data and click "Visualize JSON" to see the tree</p>
      </div>
    )
  }

  return (
    <div className="json-tree">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export default JsonTree