'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageLoader, SkeletonTable } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/Modal';
import { Download, Trash2, Filter, Calendar, AlertTriangle } from 'lucide-react';
import { formatDateTime, getRiskColor, getRiskBgColor, downloadBlob } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ riskLevel: 'all' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['predictions', page, filters],
    queryFn: () => api.getPredictionHistory({ page, limit: 10, riskLevel: filters.riskLevel as "low" | "medium" | "high" | "all" | undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePrediction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Prediction deleted', {
        style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
      });
      setDeleteId(null);
    },
  });

  const handleExport = async () => {
    try {
      const blob = await api.exportHistory('csv');
      downloadBlob(blob, `predictions-${new Date().toISOString()}.csv`);
      toast.success('Export successful', {
        style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
      });
    } catch {
      toast.error('Export failed', {
        style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
      });
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Prediction History</h1>
          <p className="text-text-muted mt-1">View and manage past risk assessments</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Download className="h-4 w-4" />} 
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </div>

      {/* Main Card */}
      <Card padding="none">
        {/* Filters Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-background-card to-background-hover">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-text-muted">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            <select
              className="px-4 py-2 bg-background rounded-xl border border-slate-600 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              value={filters.riskLevel}
              onChange={(e) => setFilters({ riskLevel: e.target.value })}
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
            <div className="flex-1" />
            <span className="text-sm text-text-muted">
              {data?.total || 0} total records
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {data?.data && data.data.length > 0 ? (
            <table className="w-full">
              <thead className="border-b border-slate-700/50 bg-background">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Level
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {data.data.map((prediction, index) => (
                  <tr 
                    key={prediction.id} 
                    className="hover:bg-background-hover transition-colors animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                      {formatDateTime(prediction.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary">
                        {prediction.input.age}y, {prediction.input.gender}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        BP: {prediction.input.bloodPressureSystolic}/{prediction.input.bloodPressureDiastolic}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-accent">{prediction.riskScore}%</span>
                        <div className="w-16 h-1.5 bg-background-hover rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              prediction.riskLevel === 'low' ? 'bg-risk-low' :
                              prediction.riskLevel === 'medium' ? 'bg-risk-medium' : 'bg-risk-high'
                            }`}
                            style={{ width: `${prediction.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold ${getRiskBgColor(prediction.riskLevel)} ${getRiskColor(prediction.riskLevel)}`}>
                        {prediction.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDeleteId(prediction.id)}
                        className="text-text-muted hover:text-risk-high"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex p-4 bg-background-hover rounded-2xl mb-4">
                <Calendar className="h-10 w-10 text-text-muted" />
              </div>
              <p className="text-text-secondary font-medium mb-1">No predictions found</p>
              <p className="text-sm text-text-muted">
                {filters.riskLevel !== 'all' 
                  ? 'Try changing your filters' 
                  : 'Complete a risk assessment to see history'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.hasMore && (
          <div className="flex justify-center p-4 border-t border-slate-700/50">
            <Button variant="secondary" onClick={() => setPage(page + 1)}>
              Load More
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Prediction"
        description="Are you sure you want to delete this prediction? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}