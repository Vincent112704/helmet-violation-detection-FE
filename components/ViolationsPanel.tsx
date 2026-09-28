import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useUpdateViolation,
  useDeleteViolation,
} from '../app/hooks/useTicket';
import { TicketStatusSchema, type Ticket, type TicketStatus } from '../schema/violations'

// Single source of truth: the zod enum ("pending" | "issued" | "false_alarm")
const STATUS_OPTIONS = TicketStatusSchema.options;

const formatStatus = (s: string) => s.replace(/_/g, ' ');

interface Props {
  ticket: Ticket;
  onClose: () => void;
  /** Called after a successful PATCH with the merged ticket (parent should update selection + refetch). */
  onUpdated: (updated: Ticket) => void;
  /** Called after a successful DELETE (parent should clear selection + refetch). */
  onDeleted: () => void;
}

export function ViolationDetailPanel({ ticket, onClose, onUpdated, onDeleted }: Props) {
  const { update, isPending: isSaving, error: updateError, reset: resetUpdate } = useUpdateViolation();
  const { remove, isPending: isDeleting, error: deleteError, reset: resetDelete } = useDeleteViolation();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const initialForm: { plate_number: string; status: TicketStatus; location: string } = {
    plate_number: ticket.plate_number ?? '',
    status: ticket.status ?? STATUS_OPTIONS[0],
    location: ticket.location ?? '',
  };
  const [form, setForm] = useState(initialForm);

  const busy = isSaving || isDeleting;
  const error = updateError ?? deleteError;

  // Reset local state whenever a different ticket is selected
  useEffect(() => {
    setForm(initialForm);
    setIsEditing(false);
    setConfirmingDelete(false);
    resetUpdate();
    resetDelete();
  }, [ticket.ticket_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    const fields = {
      plate_number: form.plate_number.trim().toUpperCase(),
      status: form.status,
      location: form.location.trim(),
    };

    const unchanged =
      fields.plate_number === initialForm.plate_number &&
      fields.status === initialForm.status &&
      fields.location === initialForm.location;
    if (unchanged) {
      setIsEditing(false);
      return;
    }

    const ok = await update(ticket.ticket_id, fields);
    if (ok) {
      onUpdated({ ...ticket, ...fields });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const ok = await remove(ticket.ticket_id);
    if (ok) {
      onDeleted();
    } else {
      setConfirmingDelete(false);
    }
  };

  const cancelEdit = () => {
    setForm(initialForm);
    setIsEditing(false);
    resetUpdate();
  };

  return (
    <Card className="border-0 shadow bg-blue-50 border-l-4 border-blue-600">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-gray-600">Selected for review</p>
          <Button variant="outline" size="sm" onClick={onClose} disabled={busy}>
            Close
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Video */}
          <div>
            {ticket.url ? (
              <video
                key={ticket.url}
                src={ticket.url}
                controls
                preload="metadata"
                className="w-full aspect-video rounded-md bg-black"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-md bg-gray-100 text-sm text-gray-500">
                No video available for this detection
              </div>
            )}
          </div>

          {/* Details / edit form */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label htmlFor="plate" className="mb-1 block text-sm font-medium text-gray-700">
                    Plate number
                  </label>
                  <Input
                    id="plate"
                    value={form.plate_number}
                    onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
                    className="uppercase"
                    disabled={busy}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as TicketStatus })}
                    disabled={busy}
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {formatStatus(s)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    disabled={busy}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-gray-900">{ticket.plate_number ?? '—'}</p>
                {ticket.status && (
                  <p className="mt-1 text-sm font-medium capitalize text-blue-700">{formatStatus(ticket.status)}</p>
                )}
                <p className="mt-1 text-sm text-gray-600">{ticket.location}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(ticket.timestamp).toLocaleString()}
                </p>
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} disabled={busy}>
                    {isSaving ? 'Saving…' : 'Save changes'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelEdit} disabled={busy}>
                    Cancel
                  </Button>
                </>
              ) : confirmingDelete ? (
                <>
                  <span className="text-sm text-gray-700">Delete this detection?</span>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={busy}>
                    {isDeleting ? 'Deleting…' : 'Yes, delete'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={busy}
                  >
                    Keep it
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    Edit details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    Delete detection
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
