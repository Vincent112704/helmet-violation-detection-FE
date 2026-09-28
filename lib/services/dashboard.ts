import { type DashboardData, dashboardSchema} from '../../schema/dashboard';
import { fetchApi } from '../api';

const DEV_MODE = 'http://localhost:8000'
const PROD_MODE = 'http://146.190.106.162'

export async function getDashboardData(): Promise<DashboardData> {
    const response = await fetchApi( `${PROD_MODE}/api/dashboard/metrics`, 'GET')
    return dashboardSchema.parse(response)
}