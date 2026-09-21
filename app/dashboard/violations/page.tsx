'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '../../../schema/violations';
import {
  AlertTriangle,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useTickets } from '../../hooks/useTicket';
import { Spinner } from '../../../components/ui/spinner';
import { ErrorMessage } from '../../../components/ui/errorMessage';

type SortField = 'timestamp' | 'status' | 'plate_number';
type SortOrder = 'asc' | 'desc';

export default function ViolationsPage() {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const { status, data, error, refetch } = useTickets(page, pageSize);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedViolation, setSelectedViolation] = useState<Ticket | null>(null);

  const tickets = data?.data.items ?? [];



  // Filter and sort tickets
  const filteredViolations = useMemo(() => {
    let result = tickets;

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          (v.plate_number ?? '').toLowerCase().includes(term) ||
          v.location.toLowerCase().includes(term)
        // officer is a UUID here, not a name — see note below on search-by-officer
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((v) => v.status === filterStatus);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let aVal: string | number, bVal: string | number;

      if (sortField === 'timestamp') {
        aVal = new Date(a.timestamp).getTime();
        bVal = new Date(b.timestamp).getTime();
      } else if (sortField === 'plate_number') {
        aVal = a.plate_number ?? '';
        bVal = b.plate_number ?? '';
      } else {
        aVal = a.status;
        bVal = b.status;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [tickets, searchTerm, filterStatus, sortField, sortOrder]);

  // NOTE: these status values are placeholders (see message below) —
  // swap in your real TicketStatus enum values here
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'RESOLVED':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'FALSE_ALARM':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'RESOLVED':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Resolved</Badge>;
      case 'FALSE_ALARM':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">False Alarm</Badge>;
      default:
        return null;
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Caught Violators</h1>
        <p className="text-gray-600">Review and manage helmet violation cases</p>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by plate number or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'PENDING' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('PENDING')}
                className={filterStatus === 'PENDING' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'CONFIRMED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('CONFIRMED')}
                className={filterStatus === 'CONFIRMED' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Confirmed
              </Button>
              <Button
                variant={filterStatus === 'RESOLVED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('RESOLVED')}
                className={filterStatus === 'RESOLVED' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Resolved
              </Button>
              <Button
                variant={filterStatus === 'FALSE_ALARM' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('FALSE_ALARM')}
                className={filterStatus === 'FALSE_ALARM' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                False Alarm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredViolations.length} of {data?.count} violations
      </div>

      {/* Table */}
      <Card className="border-0 shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort('plate_number')}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 uppercase tracking-wider flex items-center gap-1"
                  >
                    Plate Number
                    {sortField === 'plate_number' && (
                      <span className="text-orange-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort('timestamp')}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 uppercase tracking-wider flex items-center gap-1"
                  >
                    Time
                    {sortField === 'timestamp' && (
                      <span className="text-orange-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Officer
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort('status')}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 uppercase tracking-wider flex items-center gap-1"
                  >
                    Status
                    {sortField === 'status' && (
                      <span className="text-orange-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredViolations.map((violation) => (
                <tr key={violation.ticket_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-gray-900">
                      {violation.plate_number ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(violation.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{violation.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono text-xs">
                    {violation.officer}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(violation.status)}
                      {getStatusBadge(violation.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedViolation(violation)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {(data?.data.page ?? 0) + 1} · {data?.data.page_size ?? pageSize} per page
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={tickets.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Empty State */}
      {filteredViolations.length === 0 && (
        <Card className="border-0 shadow">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No violations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Detail panel */}
      {selectedViolation && (
        <Card className="border-0 shadow bg-blue-50 border-l-4 border-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Selected for review:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedViolation.plate_number ?? '—'}
                </p>
                <p className="text-sm text-gray-600 mt-1">{selectedViolation.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(selectedViolation.timestamp).toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedViolation(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
