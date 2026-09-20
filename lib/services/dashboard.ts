import { type DashboardData, dashboardSchema} from '../../schema/dashboard';
import { fetchApi } from '../api';

const DEV_MODE = 'http://localhost:8000'

export async function getDashboardData(): Promise<DashboardData> {
    const response = await fetchApi( `${DEV_MODE}/api/dashboard`, 'GET')
    return dashboardSchema.parse(response)
}