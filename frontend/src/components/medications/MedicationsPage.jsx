
import React, { useCallback, useEffect, useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  Calendar,
  AlertTriangle,
  X,
} from 'lucide-react';

import { medicationService } from '../../services/medicationService';
import MedicationFormModal from './MedicationFormModal';

function mapApiMedicationToUi(medication, petId) {
  return {
    ...medication,
    id: medication.id,
    petId: medication.petId ?? petId,
    name: medication.name || '',
    dosage: medication.dosage || '',
    frequency: medication.frequency || '',
    startDate: medication.startDate
      ? String(medication.startDate).slice(0, 10)
      : '',
    endDate: medication.endDate
      ? String(medication.endDate).slice(0, 10)
      : '',
    notes: medication.notes || '',
  };
}

function toApiDate(date) {
  return date ? new Date(`${date}T12:00:00.000Z`).toISOString() : null;
}

export default function MedicationsPage({ pets = [], addToast }) {
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [medicationToDelete, setMedicationToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const notify = (message, type = 'info') => {
    if (addToast) {
      addToast(message, type);
    } else {
      console.log(message);
    }
  };

  const loadMedications = useCallback(async () => {
    setIsLoading(true);

    try {
      const results = await Promise.all(
        pets.map(async (pet) => {
          try {
            const response = await medicationService.getAll(pet.id);

            const records = Array.isArray(response)
              ? response
              : Array.isArray(response?.medications)
                ? response.medications
                : Array.isArray(response?.data)
                  ? response.data
                  : [];

            return records.map((item) =>
              mapApiMedicationToUi(item, pet.id)
            );
          } catch (error) {
            console.error(
              `Erro ao carregar medicamentos do pet ${pet.name}:`,
              error
            );
            throw error;
          }
        })
      );

      setMedications(results.flat());
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      notify(
        error.response?.data?.message ||
          'Não foi possível carregar os medicamentos.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [pets, addToast]);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  const filteredMedications = medications.filter((medication) => {
    const pet = pets.find(
      (item) => String(item.id) === String(medication.petId)
    );

    const matchesPet =
      selectedPet === 'all' ||
      String(medication.petId) === selectedPet;

    const term = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !term ||
      medication.name.toLowerCase().includes(term) ||
      medication.dosage.toLowerCase().includes(term) ||
      medication.frequency.toLowerCase().includes(term) ||
      (pet?.name || '').toLowerCase().includes(term);

    return matchesPet && matchesSearch;
  });

  function openCreateModal() {
    setEditingMedication(null);
    setIsModalOpen(true);
  }

  function openEditModal(medication) {
    setEditingMedication(medication);
    setIsModalOpen(true);
  }

  async function handleSave(formData) {
    const { petId, ...fields } = formData;

    const payload = {
      name: fields.name,
      dosage: fields.dosage,
      frequency: fields.frequency,
      startDate: toApiDate(fields.startDate),
      ...(fields.endDate ? { endDate: toApiDate(fields.endDate) } : {}),
      ...(fields.notes?.trim() ? { notes: fields.notes.trim() } : {}),
    };

    if (editingMedication) {
      await medicationService.update(
        editingMedication.petId,
        editingMedication.id,
        payload
      );

      notify('Medicamento atualizado com sucesso!', 'success');
    } else {
      await medicationService.create(petId, payload);

      notify('Medicamento cadastrado com sucesso!', 'success');
    }

    setIsModalOpen(false);
    setEditingMedication(null);
    await loadMedications();
  }

  async function handleDelete() {
    if (!medicationToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      await medicationService.delete(
        medicationToDelete.petId,
        medicationToDelete.id
      );

      setMedications((current) =>
        current.filter(
          (item) => item.id !== medicationToDelete.id
        )
      );

      notify('Medicamento excluído com sucesso!', 'success');
      setMedicationToDelete(null);
    } catch (error) {
      notify(
        error.response?.data?.message ||
          'Não foi possível excluir o medicamento.',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function getPetName(petId) {
    return pets.find(
      (pet) => String(pet.id) === String(petId)
    )?.name || 'Pet não encontrado';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Medicamentos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize os medicamentos e os períodos de tratamento dos seus pets.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          disabled={pets.length === 0}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Novo medicamento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Medicamentos cadastrados</p>
              <p className="text-2xl font-black text-slate-900">
                {medications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pets com cadastro</p>
              <p className="text-2xl font-black text-slate-900">
                {new Set(medications.map((item) => String(item.petId))).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-50 text-violet-700">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Exibidos no filtro</p>
              <p className="text-2xl font-black text-slate-900">
                {filteredMedications.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar medicamento, dosagem ou pet..."
              aria-label="Buscar medicamentos"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={selectedPet}
            onChange={(event) => setSelectedPet(event.target.value)}
            aria-label="Filtrar medicamentos por pet"
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
          >
            <option value="all">Todos os pets</option>
            {pets.map((pet) => (
              <option key={pet.id} value={String(pet.id)}>
                {pet.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadMedications}
            disabled={isLoading}
            aria-label="Atualizar lista"
            className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Carregando medicamentos...
          </div>
        ) : pets.length === 0 ? (
          <div className="p-12 text-center">
            <Pill className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-800">Nenhum pet cadastrado</h3>
            <p className="text-sm text-slate-500 mt-1">
              Cadastre um pet antes de registrar medicamentos.
            </p>
          </div>
        ) : filteredMedications.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-800">
              Nenhum medicamento encontrado
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Tente mudar a pesquisa ou cadastre um medicamento.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-4 font-bold">Pet</th>
                  <th className="px-5 py-4 font-bold">Medicamento</th>
                  <th className="px-5 py-4 font-bold">Dosagem</th>
                  <th className="px-5 py-4 font-bold">Frequência</th>
                  <th className="px-5 py-4 font-bold">Início</th>
                  <th className="px-5 py-4 font-bold">Término</th>
                  <th className="px-5 py-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedications.map((medication) => (
                  <tr key={`${medication.petId}-${medication.id}`} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {getPetName(medication.petId)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-900">
                        {medication.name}
                      </p>
                      {medication.notes && (
                        <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">
                          {medication.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {medication.dosage}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {medication.frequency}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {medication.startDate || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {medication.endDate || 'Sem data final'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(medication)}
                          aria-label={`Editar ${medication.name}`}
                          title="Editar"
                          className="p-2 rounded-lg text-sky-700 hover:bg-sky-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMedicationToDelete(medication)}
                          aria-label={`Excluir ${medication.name}`}
                          title="Excluir"
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <MedicationFormModal
          pets={pets}
          medication={editingMedication}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMedication(null);
          }}
          onSave={handleSave}
        />
      )}

      {medicationToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-medication-title"
            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 id="delete-medication-title" className="font-bold text-lg text-slate-900">
                Excluir medicamento?
              </h3>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Deseja excluir <strong>{medicationToDelete.name}</strong>?
              Essa ação não poderá ser desfeita.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setMedicationToDelete(null)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMedicationToDelete(null)}
              aria-label="Fechar confirmação"
              className="absolute"
              hidden
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
