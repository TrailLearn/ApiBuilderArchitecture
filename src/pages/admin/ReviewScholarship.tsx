import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getScholarshipById, updateScholarship, Scholarship } from '../../features/scholarships/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReviewScholarship = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<Scholarship>();

  useEffect(() => {
    if (id) {
      loadScholarship(id);
    }
  }, [id]);

  const loadScholarship = async (scholarshipId: string) => {
    try {
      const data = await getScholarshipById(scholarshipId);
      reset(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData: Scholarship, newStatus?: 'PUBLISHED' | 'REJECTED') => {
    if (!id) return;
    setSubmitting(true);
    try {
      await updateScholarship(id, {
        title: formData.title,
        amount: formData.amount,
        description: formData.description,
        ...(newStatus && { status: newStatus })
      });
      
      let successMessage = t('draftSuccess');
      if (newStatus === 'PUBLISHED') successMessage = t('publishSuccess');
      if (newStatus === 'REJECTED') successMessage = t('rejectSuccess');

      toast({ title: 'Success', description: successMessage });
      navigate('/admin');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <h1 className="text-2xl font-bold">{t('reviewTitle')}</h1>
      
      <form onSubmit={handleSubmit((data) => handleUpdate(data))} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">{t('tableTitle')}</Label>
          <Input id="title" {...register('title', { required: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">{t('tableAmount')}</Label>
          <Input id="amount" {...register('amount')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} />
        </div>

        <div className="space-y-2">
          <Label>{t('sourceUrlLabel')}</Label>
          <Input {...register('source_url')} disabled className="bg-slate-100" />
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              {t('cancel')}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={submitting}>
                  {t('reject')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirmRejectTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('confirmRejectDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleSubmit((data) => handleUpdate(data, 'REJECTED'))}
                  >
                    {t('reject')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="flex gap-4">
            <Button type="submit" variant="secondary" disabled={submitting}>
              {t('saveDraft')}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="bg-green-600 hover:bg-green-700" disabled={submitting}>
                  {t('approvePublish')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirmPublishTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('confirmPublishDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit((data) => handleUpdate(data, 'PUBLISHED'))}>
                    Publish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewScholarship;