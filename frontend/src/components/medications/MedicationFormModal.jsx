
import React, { useEffect, useState } from 'react';
import { X, Pill } from 'lucide-react';

export default function MedicationFormModal({
  pets,
  medication,
  onClose,
  onSave,
}) {
  const [petId, setPetId] = useState('');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (medication) {
      setPetId(String(medication.petId || ''));
      setName(medication.name || '');
      setDosage(medication.dosage || '');
      setFrequency(medication.frequency || '');
      setStartDate(medication.startDate || '');
      setEndDate(medication.endDate || '');
      setNotes(medication.notes || '');
    } else {
      setPetId(pets.length ? String(pets[0].id) : '');
    }
  }, [medication, pets]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!petId || !name.trim() || !dosage.trim() ||
        !frequency.trim() || !startDate) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (endDate && endDate < startDate) {
      setError('A data final não pode ser anterior à data inicial.');
      return;
    }

    setSaving(true);

    try {
      await onSave({
        petId,
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        startDate,
        endDate: endDate || null,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Não foi possível salvar o medicamento.'
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
        aria-labelledby="medication-modal-title"
        className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 id="medication-modal-title" className="font-bold text-lg text-slate-900">
                {medication ? 'Editar medicamento' : 'Novo medicamento'}
              </h2>
              <p className="text-xs text-slate-500">
                Registre os dados do tratamento do pet.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário"
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="med-pet" className="block text-sm font-semibold mb-1">
              Pet *
            </label>
            <select
              id="med-pet"
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
            <label htmlFor="med-name" className="block text-sm font-semibold mb-1">
              Nome do medicamento *
            </label>
            <input
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              placeholder="Ex.: medicamento prescrito"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="med-dosage" className="block text-sm font-semibold mb-1">
                Dosagem *
              </label>
              <input
                id="med-dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                placeholder="Ex.: conforme prescrição"
              />
            </div>

            <div>
              <label htmlFor="med-frequency" className="block text-sm font-semibold mb-1">
                Frequência *
              </label>
              <input
                id="med-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                placeholder="Ex.: conforme orientação"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="med-start" className="block text-sm font-semibold mb-1">
                Data inicial *
              </label>
              <input
                id="med-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              />
            </div>

            <div>
              <label htmlFor="med-end" className="block text-sm font-semibold mb-1">
                Data final
              </label>
              <input
                id="med-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="med-notes" className="block text-sm font-semibold mb-1">
              Observações
            </label>
            <textarea
              id="med-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              placeholder="Orientações adicionais..."
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
              {saving ? 'Salvando...' : 'Salvar medicamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
