import { type TicketTableResponse, TicketTableResponseSchema, type UUID } from '../../schema/violations';
import { fetchApi } from '../api';


const DEV_MODE = 'http://localhost:8000'
const PROD_MODE = 'https://traffic-shield-api.sirenscan.online'


export async function getViolationsTable(
  page: number = 0,
  pageSize: number = 10
): Promise<TicketTableResponse> {
  const params = new URLSearchParams({
    page_number: String(page),
    page_size: String(pageSize),
  });

  const response = await fetchApi(
    `${PROD_MODE}/api/table/tickets?${params.toString()}`,
    'GET'
  );
  return TicketTableResponseSchema.parse(response);
}


export async function patchViolation(
  location: string,
  status: string,
  plate_number: string,
  ticket_id: UUID
): Promise<void> {
  const params = new URLSearchParams({
    ticket_id: String(ticket_id)
  });

  await fetchApi(
    `${PROD_MODE}/api/table/tickets/violation?${params.toString()}`,
    'PATCH',
    {location: location,
      status: status,
      plate_number: plate_number
    } 
  )

  return 
}


export async function deleteViolation(
  ticket_id: UUID
): Promise<void>{
  const params = new URLSearchParams({
    ticket_id: String(ticket_id)
  })

  await fetchApi(
    `${PROD_MODE}/api/table/tickets/violation?${params.toString()}`,
    'DELETE'
    )

  return 
}