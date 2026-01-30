import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, Phone, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useLeads, useUpdateLeadStatus, useDeleteLead } from '@/hooks/useLeads';
import { statusLabels, statusColors, type LeadStatus } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function AdminLeadsPage() {
  const { data: leads, isLoading, error } = useLeads();
  const updateStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');

  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch = !search || 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({ title: 'Статус обновлён' });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;
    
    try {
      await deleteLead.mutateAsync(id);
      toast({ title: 'Заявка удалена' });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    if (!filteredLeads?.length) return;

    const headers = ['Дата', 'Имя', 'Телефон', 'Дом', 'Источник', 'Статус', 'Комментарий'];
    const rows = filteredLeads.map((lead) => [
      format(new Date(lead.created_at), 'dd.MM.yyyy HH:mm'),
      lead.name,
      lead.phone,
      lead.house?.name || '-',
      lead.source || '-',
      statusLabels[lead.status],
      lead.comment || '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl font-semibold">Заявки</h1>
              <p className="text-muted-foreground text-sm">
                Всего: {leads?.length || 0} заявок
              </p>
            </div>
            <Button onClick={exportToCSV} disabled={!filteredLeads?.length}>
              <Download className="w-4 h-4 mr-2" />
              Экспорт CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по имени или телефону..."
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | '')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все статусы</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Ошибка загрузки заявок
            </div>
          ) : filteredLeads?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Заявки не найдены
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads?.map((lead) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-4 md:p-6 border border-border"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{lead.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[lead.status]}`}>
                          {statusLabels[lead.status]}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${lead.phone}`} className="hover:text-foreground">
                            {lead.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(lead.created_at), 'dd MMM yyyy, HH:mm', { locale: ru })}
                        </div>
                        {lead.house && (
                          <span className="text-primary">{lead.house.name}</span>
                        )}
                      </div>
                      
                      {lead.comment && (
                        <div className="flex items-start gap-1 mt-2 text-sm">
                          <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span>{lead.comment}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={lead.status}
                        onValueChange={(v) => handleStatusChange(lead.id, v as LeadStatus)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(lead.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
