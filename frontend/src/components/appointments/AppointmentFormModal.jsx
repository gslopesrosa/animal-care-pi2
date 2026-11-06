
import React, { useEffect, useState } from 'react';
import { X, CalendarClock } from 'lucide-react';

export default function AppointmentFormModal({
  pets = [],
  appointment,
  initialPetId,
  onClose,
  onSave,
}) {
  const [petId, setPetId] = useState('');
  const [date, setDate] = useState('');
  const [clinic, setClinic] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment) {
      setPetId(String(appointment.petId || ''));
      setDate(
        appointment.date
          ? (() => {
              const d = new Date(appointment.date);
              const local = new Date(
                d.getTime() - d.getTimezoneOffset() * 60000
              );
              return local.toISOString().slice(0, 16);
            })()
          : ''
      );
      setClinic(appointment.clinic || '');
      setVeterinarian(appointment.veterinarian || '');
      setDiagnosis(appointment.diagnosis || '');
      setNotes(appointment.notes || '');
    } else {
      setPetId(
        String(initialPetId || pets[0]?.id || '')
      );
      setDate('');
      setClinic('');
      setVeterinarian('');
      setDiagnosis('');
      setNotes('');
    }
  }, [appointment, pets, initialPetId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!petId || !date) {
      setError('Selecione o pet e informe a data e o horário.');
      return;
    }

    setSaving(true);

    try {
      await onSave({
        petId,
        date: new Date(date).toISOString(),
        clinic: clinic.trim(),
        veterinarian: veterinarian.trim(),
        diagnosis: diagnosis.trim(),
        notes: notes.trim(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Não foi possível salvar a consulta.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="appointment-modal-title"
                className="font-bold text-lg text-slate-900"
              >
                {appointment ? 'Editar consulta' : 'Nova consulta'}
              </h2>
              <p className="text-xs text-slate-500">
                Registre o atendimento veterinário do pet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar formulário"
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="appointment-pet"
              className="block text-sm font-semibold mb-1"
            >
              Pet *
            </label>
            <select
              id="appointment-pet"
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
            >
              <option value="">Selecione um pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={String(pet.id)}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="appointment-date"
              className="block text-sm font-semibold mb-1"
            >
              Data e horário *
            </label>
            <input
              id="appointment-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="appointment-clinic"
                className="block text-sm font-semibold mb-1"
              >
                Clínica
              </label>
              <input
                id="appointment-clinic"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                maxLength={150}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                placeholder="Nome da clínica"
              />
            </div>

            <div>
              <label
                htmlFor="appointment-veterinarian"
                className="block text-sm font-semibold mb-1"
              >
                Veterinário
              </label>
              <input
                id="appointment-veterinarian"
                value={veterinarian}
                onChange={(e) => setVeterinarian(e.target.value)}
                maxLength={150}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                placeholder="Nome do profissional"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="appointment-diagnosis"
              className="block text-sm font-semibold mb-1"
            >
              Diagnóstico
            </label>
            <textarea
              id="appointment-diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              placeholder="Diagnóstico ou avaliação, se disponível"
            />
          </div>

          <div>
            <label
              htmlFor="appointment-notes"
              className="block text-sm font-semibold mb-1"
            >
              Observações
            </label>
            <textarea
              id="appointment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              placeholder="Orientações e informações adicionais"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || pets.length === 0}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar consulta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
