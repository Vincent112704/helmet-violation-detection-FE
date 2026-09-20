import { type TicketTableResponse, TicketTableResponseSchema } from '../../schema/violations';
import { fetchApi } from '../api';


const DEV_MODE = 'http://localhost:8000'

export async function getViolationsTable(): Promise<TicketTableResponse> {
    const response = await fetchApi( `${DEV_MODE}/api/tickets`, 'GET')
    return TicketTableResponseSchema.parse(response)
}