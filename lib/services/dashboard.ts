import { type DashboardData, dashboardSchema} from '../../schema/dashboard';
import { fetchApi } from '../api';


export async function getDashboardData(): Promise<DashboardData> {
    return await fetchApi( '/api/dashboard', 'GET').then((data) => dashboardSchema.parse(data))
}