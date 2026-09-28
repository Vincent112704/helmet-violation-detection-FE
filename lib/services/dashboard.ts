import { type DashboardData, dashboardSchema} from '../../schema/dashboard';
import { fetchApi } from '../api';

const DEV_MODE = 'http://localhost:8000'
const PROD_MODE = 'https://traffic-shield-api.sirenscan.online'

export async function getDashboardData(): Promise<DashboardData> {
    const response = await fetchApi( `${PROD_MODE}/api/dashboard/metrics`, 'GET')
    return dashboardSchema.parse(response)
}