import { type TicketTableResponse, TicketTableResponseSchema } from '../../schema/violations';
import { fetchApi } from '../api';


const DEV_MODE = 'http://localhost:8000'



export async function getViolationsTable(
  page: number = 0,
  pageSize: number = 10
): Promise<TicketTableResponse> {
  const params = new URLSearchParams({
    page_number: String(page),
    page_size: String(pageSize),
  });

  const response = await fetchApi(
    `${DEV_MODE}/api/table/tickets?${params.toString()}`,
    'GET'
  );
  return TicketTableResponseSchema.parse(response);
}