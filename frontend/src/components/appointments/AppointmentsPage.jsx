
import React, { useCallback, useEffect, useState } from 'react';
import {
  CalendarClock,
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  X,
  MapPin,
  UserRound,
  ClipboardList,
} from 'lucide-react';

import { appointmentService } from '../../services/appointmentService';
import AppointmentFormModal from './AppointmentFormModal';

function mapAppointmentToUi(appointment, petId) {
  return {
    ...appointment,
    petId: appointment.petId ?? petId,
    date: appointment.date || '',
    clinic: appointment.clinic || '',
    veterinarian: appointment.veterinarian || '',
    diagnosis: appointment.diagnosis || '',
    notes: appointment.notes || '',
  };
}

function formatDate(date) {
  if (!date) return '—';

  return new Date(date).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function AppointmentsPage({ pets = [], addToast }) {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const notify = (message, type = 'info') => {
    if (addToast) {
      addToast(message, type);
    } else {
      console.log(message);
    }
  };

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);

    try {
      const results = await Promise.all(
        pets.map(async (pet) => {
          const response = await appointmentService.getAll(pet.id);

          const records = Array.isArray(response)
            ? response
            : Array.isArray(response?.appointments)
              ? response.appointments
              : Array.isArray(response?.data)
                ? response.data
                : [];

          return records.map((item) =>
            mapAppointmentToUi(item, pet.id)
          );
        })
      );

      setAppointments(results.flat());
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      notify(
        error.response?.data?.message ||
          'Não foi possível carregar as consultas.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [pets, addToast]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filteredAppointments = appointments.filter((appointment) => {
    const pet = pets.find(
      (item) => String(item.id) === String(appointment.petId)
    );

    const matchesPet =
      selectedPet === 'all' ||
      String(appointment.petId) === selectedPet;

    const term = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !term ||
      (pet?.name || '').toLowerCase().includes(term) ||
      appointment.clinic.toLowerCase().includes(term) ||
      appointment.veterinarian.toLowerCase().includes(term) ||
      appointment.diagnosis.toLowerCase().includes(term) ||
      appointment.notes.toLowerCase().includes(term);

    return matchesPet && matchesSearch;
  });

  function openCreateModal() {
    setEditingAppointment(null);
    setIsModalOpen(true);
  }

  function openEditModal(appointment) {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  }

  async function handleSave(formData) {
    const { petId, ...fields } = formData;

    const payload = {
      date: fields.date,
      ...(fields.clinic ? { clinic: fields.clinic } : {}),
      ...(fields.veterinarian
        ? { veterinarian: fields.veterinarian }
        : {}),
      ...(fields.diagnosis ? { diagnosis: fields.diagnosis } : {}),
      ...(fields.notes ? { notes: fields.notes } : {}),
    };

    if (editingAppointment) {
      await appointmentService.update(
        editingAppointment.petId,
        editingAppointment.id,
        payload
      );

      notify('Consulta atualizada com sucesso!', 'success');
    } else {
      await appointmentService.create(petId, payload);
      notify('Consulta cadastrada com sucesso!', 'success');
    }

    setIsModalOpen(false);
    setEditingAppointment(null);
    await loadAppointments();
  }

  async function handleDelete() {
    if (!appointmentToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      await appointmentService.delete(
        appointmentToDelete.petId,
        appointmentToDelete.id
      );

      setAppointments((current) =>
        current.filter(
          (item) =>
            !(
              String(item.id) === String(appointmentToDelete.id) &&
              String(item.petId) === String(appointmentToDelete.petId)
            )
        )
      );

      notify('Consulta excluída com sucesso!', 'success');
      setAppointmentToDelete(null);
    } catch (error) {
      notify(
        error.response?.data?.message ||
          'Não foi possível excluir a consulta.',
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
            Consultas Veterinárias
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize os atendimentos, horários e informações veterinárias dos seus pets.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          disabled={pets.length === 0}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Nova consulta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-700">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Consultas cadastradas</p>
              <p className="text-2xl font-black text-slate-900">
                {appointments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pets com consultas</p>
              <p className="text-2xl font-black text-slate-900">
                {new Set(appointments.map((item) => String(item.petId))).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-50 text-violet-700">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Exibidas no filtro</p>
              <p className="text-2xl font-black text-slate-900">
                {filteredAppointments.length}
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
              placeholder="Buscar pet, clínica, veterinário ou diagnóstico..."
              aria-label="Buscar consultas"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={selectedPet}
            onChange={(event) => setSelectedPet(event.target.value)}
            aria-label="Filtrar consultas por pet"
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
            onClick={loadAppointments}
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
            Carregando consultas...
          </div>
        ) : pets.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarClock className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-800">Nenhum pet cadastrado</h3>
            <p className="text-sm text-slate-500 mt-1">
              Cadastre um pet antes de registrar consultas.
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-800">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Ajuste a pesquisa ou cadastre uma nova consulta.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-4 font-bold">Pet</th>
                  <th className="px-5 py-4 font-bold">Data e horário</th>
                  <th className="px-5 py-4 font-bold">Clínica</th>
                  <th className="px-5 py-4 font-bold">Veterinário</th>
                  <th className="px-5 py-4 font-bold">Diagnóstico / observações</th>
                  <th className="px-5 py-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={`${appointment.petId}-${appointment.id}`}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {getPetName(appointment.petId)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        {appointment.clinic || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {appointment.veterinarian || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 max-w-xs">
                      {appointment.diagnosis || appointment.notes || '—'}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(appointment)}
                        aria-label={`Editar consulta de ${getPetName(appointment.petId)}`}
                        title="Editar"
                        className="p-2 rounded-lg text-sky-700 hover:bg-sky-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppointmentToDelete(appointment)}
                        aria-label={`Excluir consulta de ${getPetName(appointment.petId)}`}
                        title="Excluir"
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AppointmentFormModal
          pets={pets}
          appointment={editingAppointment}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAppointment(null);
          }}
          onSave={handleSave}
        />
      )}

      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-appointment-title"
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3
                id="delete-appointment-title"
                className="font-bold text-lg text-slate-900"
              >
                Excluir consulta?
              </h3>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Esta ação não poderá ser desfeita. Deseja excluir esta consulta?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir consulta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
