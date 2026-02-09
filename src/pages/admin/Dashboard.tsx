import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Scholarship } from '../../features/scholarships/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { t } = useTranslation('admin');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [promoting, setPromoting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingScholarships();
  }, []);

  const fetchPendingScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('status', 'PENDING_REVIEW');
    
    if (error) {
      toast({ title: 'Error', description: t('errorFetching'), variant: 'destructive' });
    } else {
      setScholarships(data || []);
    }
    setLoading(false);
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // UUID Validation (regex)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(targetUserId)) {
      toast({ title: 'Invalid ID', description: 'Please enter a valid UUID.', variant: 'destructive' });
      return;
    }

    setPromoting(true);
    try {
      const { error } = await supabase.rpc('set_admin_role', { user_id: targetUserId });
      if (error) throw error;

      toast({ title: 'Success', description: t('promotionSuccess') });
      setTargetUserId('');
    } catch (error: any) {
      toast({ title: t('promotionError'), description: error.message, variant: 'destructive' });
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      {/* User Management Section */}
      <section className="p-6 bg-slate-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">{t('userManagement')}</h2>
        <form onSubmit={handlePromote} className="flex gap-4 max-w-lg">
          <Input 
            placeholder={t('promotePlaceholder')} 
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
          />
          <Button type="submit" disabled={promoting}>
            {promoting ? t('promoting') : t('makeAdmin')}
          </Button>
        </form>
      </section>

      {/* Pending Review Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('pendingTitle')} ({scholarships.length})</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableTitle')}</TableHead>
              <TableHead>{t('tableAmount')}</TableHead>
              <TableHead>{t('tableDate')}</TableHead>
              <TableHead className="text-right">{t('tableActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : scholarships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {t('noPending')}
                </TableCell>
              </TableRow>
            ) : (
              scholarships.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell>{s.amount}</TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/review/${s.id}`}>{t('review')}</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default AdminDashboard;