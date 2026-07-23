import express, { Request, Response } from 'express'
import { Sequelize } from 'sequelize'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
    ListToolsRequestSchema,
    CallToolRequestSchema
} from '@modelcontextprotocol/sdk/types.js'
import Vacation, { initVacationModel } from './models/Vacation'

const app = express()
app.use(express.json())

const server = new Server(
    { name: 'vacations-mcp', version: '1.0.0' },
    { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'list_vacations',
            description: 'Get all available vacation packages with their full details',
            inputSchema: { type: 'object' as const, properties: {} }
        },
        {
            name: 'search_vacations',
            description: 'Search vacation packages by destination name',
            inputSchema: {
                type: 'object' as const,
                properties: { destination: { type: 'string', description: 'Destination name to search for' } },
                required: ['destination']
            }
        }
    ]
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params

    if (name === 'list_vacations') {
        const vacations = await Vacation.findAll()
        return { content: [{ type: 'text' as const, text: JSON.stringify(vacations, null, 2) }] }
    }

    if (name === 'search_vacations') {
        const { destination } = args as { destination: string }
        const vacations = await Vacation.findByDestination(destination)
        return { content: [{ type: 'text' as const, text: JSON.stringify(vacations, null, 2) }] }
    }

    throw new Error(`Unknown tool: ${name}`)
})

// Stateless MCP endpoint — new transport per request
app.post('/mcp', async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    res.on('close', () => transport.close())
    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
})

async function start() {
    const uri = process.env.VACATIONS_MYSQL_URI || 'mysql://root:root@localhost:3306/vacations'
    const sequelize = new Sequelize(uri, { dialect: 'mysql', logging: false })
    await sequelize.authenticate()
    initVacationModel(sequelize)
    console.log('MCP server connected to MySQL')

    app.listen(3002, () => {
        console.log('MCP server running on port 3002')
    })
}

start().catch(err => {
    console.error('MCP server failed to start:', err)
    process.exit(1)
})
