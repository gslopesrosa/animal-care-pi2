
import React, { useCallback, useEffect, useState } from 'react';
import {
  BellRing,
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Circle,
  CalendarClock,
  X,
  ClipboardList,
} from 'lucide-react';

import { reminderService } from '../../services/reminderService';

function formatDate(date) {
  if (!date) return '—';

  return new Date(date).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function ReminderFormModal({
  pets,
  reminder,
  onClose,
  onSave,
}) {
  const [petId, setPetId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Outro');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reminder) {
      setPetId(String(reminder.petId));
      setTitle(reminder.title || '');
      setDescription(reminder.description || '');
      setType(reminder.type || 'Outro');

      if (reminder.date) {
        const d = new Date(reminder.date);
        const local = new Date(
          d.getTime() - d.getTimezoneOffset() * 60000
        );
        setDate(local.toISOString().slice(0, 16));
      }
    } else {
      setPetId(String(pets[0]?.id || ''));
      setTitle('');
      setDescription('');
      setDate('');
      setType('Outro');
    }
  }, [reminder, pets]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!petId || !date || !title.trim()) {
      setError('Informe o pet, o título, a data e o horário.');
      return;
    }

    setSaving(true);

    try {
      await onSave({
        petId,
        title: title.trim(),
        description: description.trim(),
        date: new Date(date).toISOString(),
        type,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Não foi possível salvar o lembrete.'
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
        aria-labelledby="reminder-modal-title"
        className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 id="reminder-modal-title" className="font-bold text-lg text-slate-900">
                {reminder ? 'Editar lembrete' : 'Novo lembrete'}
              </h2>
              <p className="text-xs text-slate-500">
                Organize os cuidados do seu pet.
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
            <label htmlFor="reminder-pet" className="block text-sm font-semibold mb-1">
              Pet *
            </label>
            <select
              id="reminder-pet"
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
            <label htmlFor="reminder-title" className="block text-sm font-semibold mb-1">
              Título *
            </label>
            <input
              id="reminder-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={2}
              maxLength={150}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              placeholder="Ex.: Administrar medicamento"
            />
          </div>

          <div>
            <label htmlFor="reminder-type" className="block text-sm font-semibold mb-1">
              Tipo de cuidado *
            </label>
            <select
              id="reminder-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
            >
              <option value="Medicamento">Medicamento</option>
              <option value="Vacinação">Vacinação</option>
              <option value="Consulta">Consulta veterinária</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Higiene">Higiene</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label htmlFor="reminder-date" className="block text-sm font-semibold mb-1">
              Data e horário *
            </label>
            <input
              id="reminder-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
            />
          </div>

          <div>
            <label htmlFor="reminder-description" className="block text-sm font-semibold mb-1">
              Descrição / observações
            </label>
            <textarea
              id="reminder-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              placeholder="Detalhes adicionais sobre o cuidado..."
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
              {saving ? 'Salvando...' : 'Salvar lembrete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RemindersPage({ pets = [], addToast }) {
  const [reminders, setReminders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const notify = useCallback((message, type = 'info') => {
    if (addToast) {
      addToast(message, type);
    } else {
      console.log(message);
    }
  }, [addToast]);

  const loadReminders = useCallback(async () => {
    setIsLoading(true);

    try {
      const results = await Promise.all(
        pets.map(async (pet) => {
          const response = await reminderService.getAll(pet.id);
          const records = Array.isArray(response)
            ? response
            : Array.isArray(response?.reminders)
              ? response.reminders
              : Array.isArray(response?.data)
                ? response.data
                : [];

          return records.map((item) => ({
            ...item,
            petId: item.petId ?? pet.id,
            title: item.title || '',
            description: item.description || '',
            type: item.type || 'Outro',
          }));
        })
      );

      setReminders(results.flat());
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
      notify(
        error.response?.data?.message ||
          'Não foi possível carregar os lembretes.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [pets, notify]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const filteredReminders = reminders.filter((reminder) => {
    const term = searchTerm.trim().toLowerCase();
    const pet = pets.find(
      (item) => String(item.id) === String(reminder.petId)
    );

    const matchesPet =
      selectedPet === 'all' ||
      String(reminder.petId) === selectedPet;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'pending' && !reminder.completed) ||
      (selectedStatus === 'completed' && reminder.completed);

    const matchesSearch =
      !term ||
      (pet?.name || '').toLowerCase().includes(term) ||
      reminder.title.toLowerCase().includes(term) ||
      reminder.description.toLowerCase().includes(term) ||
      reminder.type.toLowerCase().includes(term);

    return matchesPet && matchesStatus && matchesSearch;
  });

  async function handleSave(formData) {
    const { petId, ...fields } = formData;

    const payload = {
      title: fields.title,
      description: fields.description,
      date: fields.date,
      type: fields.type,
    };

    if (editingReminder) {
      await reminderService.update(
        editingReminder.petId,
        editingReminder.id,
        payload
      );
      notify('Lembrete atualizado com sucesso!', 'success');
    } else {
      await reminderService.create(petId, payload);
      notify('Lembrete cadastrado com sucesso!', 'success');
    }

    setIsModalOpen(false);
    setEditingReminder(null);
    await loadReminders();
  }

  async function toggleCompleted(reminder) {
    try {
      await reminderService.update(
        reminder.petId,
        reminder.id,
        { completed: !reminder.completed }
      );

      setReminders((current) =>
        current.map((item) =>
          String(item.id) === String(reminder.id) &&
          String(item.petId) === String(reminder.petId)
            ? { ...item, completed: !item.completed }
            : item
        )
      );

      notify(
        reminder.completed
          ? 'Lembrete reaberto.'
          : 'Lembrete marcado como concluído!',
        'success'
      );
    } catch (error) {
      notify(
        error.response?.data?.message ||
          'Não foi possível atualizar o lembrete.',
        'error'
      );
    }
  }

  async function handleDelete() {
    if (!reminderToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      await reminderService.delete(
        reminderToDelete.petId,
        reminderToDelete.id
      );

      setReminders((current) =>
        current.filter(
          (item) =>
            !(
              String(item.id) === String(reminderToDelete.id) &&
              String(item.petId) === String(reminderToDelete.petId)
            )
        )
      );

      notify('Lembrete excluído com sucesso!', 'success');
      setReminderToDelete(null);
    } catch (error) {
      notify(
        error.response?.data?.message ||
          'Não foi possível excluir o lembrete.',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function openCreateModal() {
    setEditingReminder(null);
    setIsModalOpen(true);
  }

  function openEditModal(reminder) {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  }

  function getPetName(petId) {
    return pets.find(
      (pet) => String(pet.id) === String(petId)
    )?.name || 'Pet não encontrado';
  }

  const pendingCount = reminders.filter((item) => !item.completed).length;
  const completedCount = reminders.filter((item) => item.completed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Lembretes de Cuidados
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize os compromissos e a rotina de cuidados dos seus pets.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          disabled={pets.length === 0}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Novo lembrete
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total de lembretes</p>
              <p className="text-2xl font-black text-slate-900">{reminders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-700">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pendentes</p>
              <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Concluídos</p>
              <p className="text-2xl font-black text-slate-900">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar lembretes ou pets..."
              aria-label="Buscar lembretes"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={selectedPet}
            onChange={(event) => setSelectedPet(event.target.value)}
            aria-label="Filtrar lembretes por pet"
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
          >
            <option value="all">Todos os pets</option>
            {pets.map((pet) => (
              <option key={pet.id} value={String(pet.id)}>
                {pet.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            aria-label="Filtrar lembretes por situação"
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
          >
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídos</option>
            <option value="all">Todas as situações</option>
          </select>

          <button
            type="button"
            onClick={loadReminders}
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
            Carregando lembretes...
          </div>
        ) : pets.length === 0 ? (
          <div className="p-12 text-center">
            <BellRing className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-800">Nenhum pet cadastrado</h3>
            <p className="text-sm text-slate-500 mt-1">
              Cadastre um pet antes de registrar lembretes.
            </p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-800">Nenhum lembrete encontrado</h3>
            <p className="text-sm text-slate-500 mt-1">
              Ajuste os filtros ou cadastre um novo lembrete.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-4 font-bold">Situação</th>
                  <th className="px-5 py-4 font-bold">Pet</th>
                  <th className="px-5 py-4 font-bold">Lembrete</th>
                  <th className="px-5 py-4 font-bold">Data e horário</th>
                  <th className="px-5 py-4 font-bold">Tipo</th>
                  <th className="px-5 py-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReminders.map((reminder) => (
                  <tr
                    key={`${reminder.petId}-${reminder.id}`}
                    className={`hover:bg-slate-50/70 ${reminder.completed ? 'opacity-70' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => toggleCompleted(reminder)}
                        aria-label={reminder.completed ? 'Reabrir lembrete' : 'Marcar como concluído'}
                        title={reminder.completed ? 'Reabrir lembrete' : 'Concluir lembrete'}
                        className={`inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-2 ${
                          reminder.completed
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {reminder.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        {reminder.completed ? 'Concluído' : 'Pendente'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {getPetName(reminder.petId)}
                    </td>
                    <td className="px-5 py-4">
                      <p className={`text-sm font-semibold text-slate-800 ${reminder.completed ? 'line-through' : ''}`}>
                        {reminder.title}
                      </p>
                      {reminder.description && (
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">
                          {reminder.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {formatDate(reminder.date)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {reminder.type}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(reminder)}
                        aria-label={`Editar lembrete ${reminder.title}`}
                        title="Editar"
                        className="p-2 rounded-lg text-sky-700 hover:bg-sky-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setReminderToDelete(reminder)}
                        aria-label={`Excluir lembrete ${reminder.title}`}
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
        <ReminderFormModal
          pets={pets}
          reminder={editingReminder}
          onClose={() => {
            setIsModalOpen(false);
            setEditingReminder(null);
          }}
          onSave={handleSave}
        />
      )}

      {reminderToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-reminder-title"
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 id="delete-reminder-title" className="font-bold text-lg text-slate-900">
                Excluir lembrete?
              </h3>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Deseja excluir o lembrete "{reminderToDelete.title}"? Esta ação não poderá ser desfeita.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReminderToDelete(null)}
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
                {isDeleting ? 'Excluindo...' : 'Excluir lembrete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
