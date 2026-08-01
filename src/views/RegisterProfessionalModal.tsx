import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '@/i18n/useTranslation';
import { T } from '@/components/ui/Typography';
import { toast } from '@/components/ui/Toast';
import { MOCK_PROFESSIONALS } from '@/services/mocks/professionals.mock';
import type { Professional, ProfRole } from '@/types';
import {
  IconSparkles,
  IconUser,
  IconAward,
  IconId,
  IconBriefcase,
  IconTrash,
  IconUpload,
  IconCheck
} from '@tabler/icons-react';

interface RegisterProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TrajectoryItem {
  titulo: string;
  org: string;
  inicio: string;
  fin: string;
  desc: string;
}

export interface Certification {
  nombre: string;
  org: string;
  año: string;
  venc: string;
  id: string;
}

export interface RegistrationState {
  nombre: string;
  email: string;
  tel: string;
  contrasena: string;
  confirmarContrasena: string;
  idiomas: string;

  especialidad: string;
  experiencia: string;
  ciudad: string;
  bio: string;
  linkedin: string;
  web: string;

  docTipo: string;
  docNumero: string;
  docDelantero: File | null;
  docTrasero: File | null;

  trayectos: TrajectoryItem[];
  certificados: Certification[];
}

const initialState: RegistrationState = {
  nombre: '',
  email: '',
  tel: '',
  contrasena: '',
  confirmarContrasena: '',
  idiomas: '',
  especialidad: '',
  experiencia: '',
  ciudad: '',
  bio: '',
  linkedin: '',
  web: '',
  docTipo: 'Cédula de Ciudadanía',
  docNumero: '',
  docDelantero: null,
  docTrasero: null,
  trayectos: [],
  certificados: [],
};

export function RegisterProfessionalModal({ isOpen, onClose }: RegisterProfessionalModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Trajectory temporary state
  const [tempTray, setTempTray] = useState<TrajectoryItem>({
    titulo: '',
    org: '',
    inicio: '',
    fin: '',
    desc: ''
  });

  // Certification temporary state
  const [tempCert, setTempCert] = useState<Certification>({
    nombre: '',
    org: '',
    año: '',
    venc: '',
    id: ''
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleFieldChange = (field: keyof RegistrationState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field as keyof RegistrationState);
  };

  const validateField = (field: keyof RegistrationState): string => {
    let errorMsg = '';

    // Step 1 validation
    if (field === 'nombre') {
      if (!formData.nombre.trim()) errorMsg = t('registerCoach.errors.required');
    }
    if (field === 'email') {
      if (!formData.email.trim()) {
        errorMsg = t('registerCoach.errors.required');
      } else if (!validateEmail(formData.email)) {
        errorMsg = t('registerCoach.errors.emailInvalid');
      }
    }
    if (field === 'tel') {
      if (!formData.tel.trim()) errorMsg = t('registerCoach.errors.required');
    }
    if (field === 'contrasena') {
      if (!formData.contrasena) {
        errorMsg = t('registerCoach.errors.required');
      } else if (formData.contrasena.length < 6) {
        errorMsg = t('registerCoach.errors.passwordShort');
      }
    }
    if (field === 'confirmarContrasena') {
      if (!formData.confirmarContrasena) {
        errorMsg = t('registerCoach.errors.required');
      } else if (formData.contrasena !== formData.confirmarContrasena) {
        errorMsg = t('registerCoach.errors.passwordMismatch');
      }
    }
    if (field === 'idiomas') {
      if (!formData.idiomas.trim()) errorMsg = t('registerCoach.errors.required');
    }

    // Step 2 validation
    if (field === 'especialidad') {
      if (!formData.especialidad.trim()) errorMsg = t('registerCoach.errors.required');
    }
    if (field === 'experiencia') {
      const expNum = parseInt(formData.experiencia, 10);
      if (!formData.experiencia.trim()) {
        errorMsg = t('registerCoach.errors.required');
      } else if (isNaN(expNum) || expNum < 0) {
        errorMsg = t('registerCoach.errors.experiencePositive');
      }
    }
    if (field === 'ciudad') {
      if (!formData.ciudad.trim()) errorMsg = t('registerCoach.errors.required');
    }
    if (field === 'bio') {
      if (!formData.bio.trim()) errorMsg = t('registerCoach.errors.required');
    }

    // Step 3 validation
    if (field === 'docNumero') {
      if (!formData.docNumero.trim()) errorMsg = t('registerCoach.errors.required');
    }

    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }

    return errorMsg;
  };

  const isStep1Valid = () => {
    const e1 = validateField('nombre');
    const e2 = validateField('email');
    const e3 = validateField('tel');
    const e4 = validateField('contrasena');
    const e5 = validateField('confirmarContrasena');
    const e6 = validateField('idiomas');
    return !e1 && !e2 && !e3 && !e4 && !e5 && !e6;
  };

  const isStep2Valid = () => {
    const e1 = validateField('especialidad');
    const e2 = validateField('experiencia');
    const e3 = validateField('ciudad');
    const e4 = validateField('bio');
    return !e1 && !e2 && !e3 && !e4;
  };

  const isStep3Valid = () => {
    const e1 = validateField('docNumero');
    const e2 = formData.docDelantero !== null;
    const e3 = formData.docTrasero !== null;

    if (!e2 || !e3) {
      toast.show(t('registerCoach.errors.filesRequired'), 'error');
      return false;
    }
    return !e1;
  };

  const handleNext = () => {
    if (step === 1) {
      if (isStep1Valid()) {
        setStep(2);
      } else {
        toast.show(t('registerCoach.errors.required'), 'error');
      }
    } else if (step === 2) {
      if (isStep2Valid()) {
        setStep(3);
      } else {
        toast.show(t('registerCoach.errors.required'), 'error');
      }
    } else if (step === 3) {
      if (isStep3Valid()) {
        setStep(4);
      } else {
        toast.show(t('registerCoach.errors.required'), 'error');
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddTrajectory = () => {
    if (!tempTray.titulo.trim() || !tempTray.org.trim() || !tempTray.inicio.trim()) {
      toast.show(t('registerCoach.errors.required'), 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      trayectos: [...prev.trayectos, tempTray]
    }));
    setTempTray({ titulo: '', org: '', inicio: '', fin: '', desc: '' });
  };

  const handleRemoveTrajectory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      trayectos: prev.trayectos.filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    if (!tempCert.nombre.trim() || !tempCert.org.trim() || !tempCert.año.trim()) {
      toast.show(t('registerCoach.errors.required'), 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      certificados: [...prev.certificados, tempCert]
    }));
    setTempCert({ nombre: '', org: '', año: '', venc: '', id: '' });
  };

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certificados: prev.certificados.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const newProfessional: Professional = {
      id: `pro-${Date.now()}`,
      nombre: formData.nombre,
      initials: `${formData.nombre.split(' ')[0]?.[0] || ''}${formData.nombre.split(' ')[1]?.[0] || ''}`.toUpperCase(),
      color: ['#9B59B6', '#4CAF82', '#4A7CC7', '#E8622A', '#E24B4A'][Math.floor(Math.random() * 5)],
      email: formData.email,
      tel: formData.tel,
      ciudad: formData.ciudad,
      rol: 'Entrenador' as ProfRole,
      especialidad: formData.especialidad,
      regPro: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      inst: formData.trayectos[0]?.org || 'Fitnflai',
      idiomas: formData.idiomas,
      ingreso: 'Jul 2026',
      experiencia: parseInt(formData.experiencia, 10) || 0,
      linkedin: formData.linkedin,
      web: formData.web,
      wa: formData.tel,
      bio: formData.bio,
      areas: formData.especialidad.split(', '),
      pacientes: 0,
      accesoNivel: 'Sin acceso',
      accesoDesc: 'Cuenta pendiente de activación',
      ultimoAcceso: 'Nunca',
      estado: 'Pendiente',
      docTipo: formData.docTipo,
      docNumero: formData.docNumero,
      docDelantero: formData.docDelantero?.name || '',
      docTrasero: formData.docTrasero?.name || '',
      certs: formData.certificados.map(cert => ({
        ...cert,
        venc: cert.venc === '' ? 'Sin vencimiento' : cert.venc
      })),
      tray: formData.trayectos.map(tray => ({
        ...tray,
        fin: tray.fin === '' ? 'Actualidad' : tray.fin
      })),
      pacAsi: [],
    };

    MOCK_PROFESSIONALS.push(newProfessional);
    toast.show(t('registerCoach.modal.successTitle'), 'success');
    setSubmissionSuccess(true);
  };

  const renderStepIndicators = () => {
    const steps = [
      { num: 1, label: t('registerCoach.modal.steps.step1'), icon: <IconUser size={14} /> },
      { num: 2, label: t('registerCoach.modal.steps.step2'), icon: <IconBriefcase size={14} /> },
      { num: 3, label: t('registerCoach.modal.steps.step3'), icon: <IconId size={14} /> },
      { num: 4, label: t('registerCoach.modal.steps.step4'), icon: <IconAward size={14} /> },
    ];

    return (
      <div className="flex items-center justify-between w-full mb-6 border-b border-surface-border pb-4 select-none">
        {steps.map((s) => (
          <div key={s.num} className="flex flex-col items-center flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                step === s.num
                  ? 'bg-brand-orange text-white ring-4 ring-brand-orange/20'
                  : step > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-surface-card text-surface-muted border border-surface-border'
              }`}
            >
              {step > s.num ? <IconCheck size={14} /> : s.icon}
            </div>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider mt-1.5 transition-colors duration-300 ${
                step === s.num ? 'text-brand-orange' : 'text-surface-muted'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-fadeIn">
      <T.P className="text-xs text-surface-muted mb-4">
        {t('registerCoach.modal.step1.title')}
      </T.P>
      <Input
        label={t('registerCoach.modal.step1.name')}
        placeholder={t('registerCoach.modal.step1.name')}
        value={formData.nombre}
        onChange={(e) => handleFieldChange('nombre', e.target.value)}
        onBlur={() => handleBlur('nombre')}
        error={touched.nombre ? errors.nombre : ''}
        required
      />
      <Input
        label={t('registerCoach.modal.step1.email')}
        placeholder="ejemplo@fitnflai.com"
        type="email"
        value={formData.email}
        onChange={(e) => handleFieldChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        error={touched.email ? errors.email : ''}
        required
      />
      <Input
        label={t('registerCoach.modal.step1.tel')}
        placeholder="+57 300 123 4567"
        type="tel"
        value={formData.tel}
        onChange={(e) => handleFieldChange('tel', e.target.value)}
        onBlur={() => handleBlur('tel')}
        error={touched.tel ? errors.tel : ''}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('registerCoach.modal.step1.password')}
          placeholder="••••••"
          type="password"
          value={formData.contrasena}
          onChange={(e) => handleFieldChange('contrasena', e.target.value)}
          onBlur={() => handleBlur('contrasena')}
          error={touched.contrasena ? errors.contrasena : ''}
          required
        />
        <Input
          label={t('registerCoach.modal.step1.confirmPassword')}
          placeholder="••••••"
          type="password"
          value={formData.confirmarContrasena}
          onChange={(e) => handleFieldChange('confirmarContrasena', e.target.value)}
          onBlur={() => handleBlur('confirmarContrasena')}
          error={touched.confirmarContrasena ? errors.confirmarContrasena : ''}
          required
        />
      </div>
      <Input
        label={t('registerCoach.modal.step1.languages')}
        placeholder="Español, Inglés, Portugués"
        value={formData.idiomas}
        onChange={(e) => handleFieldChange('idiomas', e.target.value)}
        onBlur={() => handleBlur('idiomas')}
        error={touched.idiomas ? errors.idiomas : ''}
        required
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fadeIn">
      <T.P className="text-xs text-surface-muted mb-4">
        {t('registerCoach.modal.step2.title')}
      </T.P>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('registerCoach.modal.step2.specialty')}
          placeholder="Trail running, Fisioterapia"
          value={formData.especialidad}
          onChange={(e) => handleFieldChange('especialidad', e.target.value)}
          onBlur={() => handleBlur('especialidad')}
          error={touched.especialidad ? errors.especialidad : ''}
          required
        />
        <Input
          label={t('registerCoach.modal.step2.experience')}
          placeholder="5"
          type="number"
          min="0"
          value={formData.experiencia}
          onChange={(e) => handleFieldChange('experiencia', e.target.value)}
          onBlur={() => handleBlur('experiencia')}
          error={touched.experiencia ? errors.experiencia : ''}
          required
        />
      </div>
      <Input
        label={t('registerCoach.modal.step2.city')}
        placeholder="Medellín, Colombia"
        value={formData.ciudad}
        onChange={(e) => handleFieldChange('ciudad', e.target.value)}
        onBlur={() => handleBlur('ciudad')}
        error={touched.ciudad ? errors.ciudad : ''}
        required
      />
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
          {t('registerCoach.modal.step2.bio')}
        </label>
        <textarea
          className="w-full text-[12px] bg-surface-card border border-surface-border rounded-lg p-2.5 min-h-[80px] focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange text-white"
          placeholder="Contanos un poco de vos, tu recorrido y enfoque..."
          value={formData.bio}
          onChange={(e) => handleFieldChange('bio', e.target.value)}
          onBlur={() => handleBlur('bio')}
        />
        {touched.bio && errors.bio && (
          <span className="text-[10px] font-semibold text-brand-red pl-1">{errors.bio}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="LinkedIn (Opcional)"
          placeholder="linkedin.com/in/usuario"
          value={formData.linkedin}
          onChange={(e) => handleFieldChange('linkedin', e.target.value)}
        />
        <Input
          label="Sitio Web (Opcional)"
          placeholder="misitioweb.com"
          value={formData.web}
          onChange={(e) => handleFieldChange('web', e.target.value)}
        />
      </div>
    </div>
  );

  const FileUploadCard = ({
    label,
    file,
    onSelect
  }: {
    label: string;
    file: File | null;
    onSelect: (file: File) => void;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
      <div className="flex flex-col items-center justify-center p-5 bg-surface-card/50 border border-dashed border-gray-800 rounded-xl relative hover:border-brand-orange/50 transition">
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
        />
        <IconUpload className="w-8 h-8 text-surface-muted mb-2" />
        <T.P className="text-xs font-semibold text-white mb-1">
          {file ? file.name : label}
        </T.P>
        <T.P className="text-[10px] text-surface-muted text-center max-w-[180px]">
          {file ? 'Archivo cargado con éxito' : 'Arrastrá tu archivo aquí o hacé clic para buscar'}
        </T.P>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 bg-surface-panel hover:bg-surface-card border border-surface-border"
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? 'Cambiar Archivo' : 'Seleccionar'}
        </Button>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-4 animate-fadeIn">
      <T.P className="text-xs text-surface-muted mb-4">
        {t('registerCoach.modal.step3.title')}
      </T.P>
      <Select
        label={t('registerCoach.modal.step3.docTipo')}
        value={formData.docTipo}
        onChange={(val) => handleFieldChange('docTipo', val)}
        options={[
          { label: 'Cédula de Ciudadanía', value: 'Cédula de Ciudadanía' },
          { label: 'Pasaporte', value: 'Pasaporte' },
          { label: 'Cédula de Extranjería', value: 'Cédula de Extranjería' },
          { label: 'DNI', value: 'DNI' },
        ]}
      />
      <Input
        label={t('registerCoach.modal.step3.docNumero')}
        placeholder="10204921"
        value={formData.docNumero}
        onChange={(e) => handleFieldChange('docNumero', e.target.value)}
        onBlur={() => handleBlur('docNumero')}
        error={touched.docNumero ? errors.docNumero : ''}
        required
      />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <FileUploadCard
          label={t('registerCoach.modal.step3.docDelantero')}
          file={formData.docDelantero}
          onSelect={(file) => handleFieldChange('docDelantero', file)}
        />
        <FileUploadCard
          label={t('registerCoach.modal.step3.docTrasero')}
          file={formData.docTrasero}
          onSelect={(file) => handleFieldChange('docTrasero', file)}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5 animate-fadeIn">
      <T.P className="text-xs text-surface-muted">
        {t('registerCoach.modal.step4.title')}
      </T.P>

      {/* Trajectory Form Section */}
      <div className="p-4 bg-surface-card/40 border border-surface-border rounded-xl space-y-3">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-1">
          {t('registerCoach.modal.step4.trajectoryTitle')}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label={t('registerCoach.modal.step4.jobTitle')}
            placeholder="Deportólogo"
            value={tempTray.titulo}
            onChange={(e) => setTempTray((prev) => ({ ...prev, titulo: e.target.value }))}
          />
          <Input
            label={t('registerCoach.modal.step4.institution')}
            placeholder="Clínica del Deporte"
            value={tempTray.org}
            onChange={(e) => setTempTray((prev) => ({ ...prev, org: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label={t('registerCoach.modal.step4.start')}
            placeholder="2020"
            value={tempTray.inicio}
            onChange={(e) => setTempTray((prev) => ({ ...prev, inicio: e.target.value }))}
          />
          <Input
            label={t('registerCoach.modal.step4.end')}
            placeholder="2024 / Actualidad"
            value={tempTray.fin}
            onChange={(e) => setTempTray((prev) => ({ ...prev, fin: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] font-bold text-surface-muted uppercase">
            {t('registerCoach.modal.step4.description')}
          </label>
          <textarea
            className="w-full text-[12px] bg-surface-card border border-surface-border rounded-lg p-2 min-h-[50px] focus:outline-none focus:ring-1 focus:ring-brand-orange text-white"
            placeholder="Logros y rol..."
            value={tempTray.desc}
            onChange={(e) => setTempTray((prev) => ({ ...prev, desc: e.target.value }))}
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-2"
          onClick={handleAddTrajectory}
        >
          {t('registerCoach.modal.step4.addTrajectory')}
        </Button>
      </div>

      {/* Trajectories Display */}
      {formData.trayectos.length > 0 && (
        <div className="space-y-2">
          {formData.trayectos.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-card/40 border border-surface-border rounded-xl">
              <div>
                <T.P className="text-xs font-bold text-white">{item.titulo}</T.P>
                <T.P className="text-[10px] text-surface-muted">
                  {item.org} • {item.inicio} - {item.fin || 'Actualidad'}
                </T.P>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTrajectory(index)}
                className="text-surface-muted hover:text-brand-red transition p-1 cursor-pointer"
              >
                <IconTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Certifications Form Section */}
      <div className="p-4 bg-surface-card/40 border border-surface-border rounded-xl space-y-3">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-1">
          {t('registerCoach.modal.step4.certificationTitle')}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label={t('registerCoach.modal.step4.certName')}
            placeholder="IAAF Level 1 Coach"
            value={tempCert.nombre}
            onChange={(e) => setTempCert((prev) => ({ ...prev, nombre: e.target.value }))}
          />
          <Input
            label={t('registerCoach.modal.step4.org')}
            placeholder="World Athletics"
            value={tempCert.org}
            onChange={(e) => setTempCert((prev) => ({ ...prev, org: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label={t('registerCoach.modal.step4.year')}
            placeholder="2022"
            value={tempCert.año}
            onChange={(e) => setTempCert((prev) => ({ ...prev, año: e.target.value }))}
          />
          <Input
            label={t('registerCoach.modal.step4.venc')}
            placeholder="2028"
            value={tempCert.venc}
            onChange={(e) => setTempCert((prev) => ({ ...prev, venc: e.target.value }))}
          />
        </div>
        <Input
          label={t('registerCoach.modal.step4.certId')}
          placeholder="ID-83204 (opcional)"
          value={tempCert.id}
          onChange={(e) => setTempCert((prev) => ({ ...prev, id: e.target.value }))}
        />
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-2"
          onClick={handleAddCertification}
        >
          {t('registerCoach.modal.step4.addCertification')}
        </Button>
      </div>

      {/* Certifications Display */}
      {formData.certificados.length > 0 && (
        <div className="space-y-2">
          {formData.certificados.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-card/40 border border-surface-border rounded-xl">
              <div>
                <T.P className="text-xs font-bold text-white">{item.nombre}</T.P>
                <T.P className="text-[10px] text-surface-muted">
                  {item.org} • {item.año} {item.venc ? `(Vence: ${item.venc})` : ''}
                </T.P>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCertification(index)}
                className="text-surface-muted hover:text-brand-red transition p-1 cursor-pointer"
              >
                <IconTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSuccessView = () => (
    <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
        <IconCheck size={32} />
      </div>
      <T.H3 className="text-lg font-bold text-white mb-2">
        {t('registerCoach.modal.successTitle')}
      </T.H3>
      <T.P className="text-xs text-surface-muted text-center max-w-sm leading-relaxed px-4">
        {t('registerCoach.modal.successSubtitle')}
      </T.P>
      <Button
        variant="primary"
        onClick={() => {
          setFormData(initialState);
          setErrors({});
          setTouched({});
          setStep(1);
          setSubmissionSuccess(false);
          onClose();
        }}
        className="mt-8 px-8"
      >
        {t('registerCoach.modal.buttons.finish')}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('registerCoach.modal.title')}
      className="max-w-lg"
    >
      {submissionSuccess ? (
        renderSuccessView()
      ) : (
        <div className="flex flex-col h-full text-white">
          {renderStepIndicators()}

          <div className="flex-1 overflow-y-auto max-h-[55vh] pr-1 scrollbar-thin">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>

          {/* Modal Actions */}
          <div className="mt-8 pt-4 border-t border-surface-border flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={step === 1}
              className="text-surface-muted hover:text-white"
            >
              {t('registerCoach.modal.buttons.prev')}
            </Button>

            <Button
              variant="primary"
              onClick={step === 4 ? handleSubmit : handleNext}
            >
              {step === 4 ? t('registerCoach.modal.buttons.submit') : t('registerCoach.modal.buttons.next')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}