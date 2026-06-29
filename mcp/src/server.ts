import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod'
import Vacation from './models/Vacation'

const app = express()
app.use(express.json())

const server = new McpServer({
    name: 'vacations-mcp',
    version: '1.0.0'
})

server.tool(
    'list_vacations',
    'Get all available vacation packages with their full details',
    {},
    async () => {
        const vacations = await Vacation.find({}).lean()
        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify(vacations, null, 2)
            }]
        }
    }
)

server.tool(
    'search_vacations',
    'Search vacation packages by destination name',
    { destination: z.string().describe('Destination name to search for') },
    async ({ destination }) => {
        const vacations = await Vacation.find({
            destination: { $regex: destination, $options: 'i' }
        }).lean()
        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify(vacations, null, 2)
            }]
        }
    }
)

// Stateless MCP endpoint — new transport per request
app.post('/mcp', async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    res.on('close', () => transport.close())
    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
})

async function start() {
    const uri = process.env.VACATIONS_MONGO_URI || 'mongodb://localhost:27017/vacations'
    await mongoose.connect(uri)
    console.log('MCP server connected to MongoDB')

    app.listen(3002, () => {
        console.log('MCP server running on port 3002')
    })
}

start().catch(err => {
    console.error('MCP server failed to start:', err)
    process.exit(1)
})
