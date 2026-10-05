import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TimeSigil } from '../components/TimeSigil';
import { Button } from '../components/Button';
import { UploadDropzone } from '../components/UploadDropzone';
import type { UploadedFileItem } from '../components/UploadDropzone';
import type { IncidentType, Platform } from '../types';
import {
  UserX,
  Sparkles,
  Image as ImageIcon,
  MessageSquareWarning,
  Link2,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Save,
} from 'lucide-react';

export const NewIncidentPage: React.FC = () => {
  const navigate = useNavigate();
  const { createIncident } = useIncidents();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form State
  const [selectedType, setSelectedType] = useState<IncidentType>('Impersonation');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Instagram');
  const [accountHandle, setAccountHandle] = useState<string>('@fake_profile_clone');
  const [contentUrl, setContentUrl] = useState<string>('https://instagram.com/fake_profile_clone_981');
  const [discoveryDateTime, setDiscoveryDateTime] = useState<string>(() => {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
  });
  const [details, setDetails] = useState<string>('');
  const [files, setFiles] = useState<UploadedFileItem[]>([]);

  const steps = [
    { num: 1, label: 'Incident Classification' },
    { num: 2, label: 'Platform & Location' },
    { num: 3, label: 'Identity & Details' },
    { num: 4, label: 'Evidence & Hashing' },
  ];

  const incidentOptions: {
    type: IncidentType;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'Impersonation',
      desc: 'Cloned account pretending to be you or using your profile information.',
      icon: <UserX size={20} className="text-[var(--accent)]" />,
    },
    {
      type: 'Deepfake or manipulation',
      desc: 'Synthetically generated or edited photo, voice, or video clip.',
      icon: <Sparkles size={20} className="text-[var(--accent)]" />,
    },
    {
      type: 'Image misuse',
      desc: 'Private photography shared without your consent or in unauthorized contexts.',
      icon: <ImageIcon size={20} className="text-[var(--accent)]" />,
    },
    {
      type: 'Harassment',
      desc: 'Coordinated threats, intimidation, or abusive communications.',
      icon: <MessageSquareWarning size={20} className="text-[var(--accent)]" />,
    },
    {
      type: 'Fake link or scam',
      desc: 'Phishing domain or fraudulent URL distributing your identity.',
      icon: <Link2 size={20} className="text-[var(--accent)]" />,
    },
    {
      type: 'Other',
      desc: 'Any emerging abuse pattern not categorized above.',
      icon: <HelpCircle size={20} className="text-[var(--accent)]" />,
    },
  ];

  const platforms: Platform[] = [
    'Instagram',
    'Facebook',
    'WhatsApp',
    'Telegram',
    'X',
    'Website',
    'Other',
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    await createIncident({
      type: selectedType,
      platform: selectedPlatform,
      accountHandle,
      contentUrl,
      details,
      files,
    });

    setIsProcessing(false);
    navigate(`/archive`);
  };

  return (
    <div className="space-y-8">
      {/* Reassurance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)]">
        <div className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <ShieldCheck size={16} className="text-[var(--accent)] shrink-0" />
          <span>
            <strong>You can stop and come back anytime.</strong> All data is stored locally in your browser sandbox.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted)] shrink-0">
          <Save size={12} className="text-[var(--accent)]" />
          <span>Draft Auto-Saved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Stepper Progress Rail (4 cols on lg) */}
        <div className="lg:col-span-4 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--hair)] pb-4">
            <TimeSigil size={36} speed="slow" showClock={false} />
            <div>
              <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">
                Intake Protocol
              </div>
              <div className="font-display text-base font-light text-[var(--text)]">
                STEP 0{currentStep} OF 04
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((s) => {
              const isCurrent = currentStep === s.num;
              const isDone = currentStep > s.num;

              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-3 p-3 rounded-[var(--radius-xs)] transition-all ${
                    isCurrent
                      ? 'bg-[var(--raised)] border-l-2 border-[var(--accent)] text-[var(--text)] shadow-[0_0_8px_var(--accent-glow)]'
                      : isDone
                      ? 'text-[var(--accent)] bg-[var(--bg)]/40'
                      : 'text-[var(--muted)] opacity-60'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold border border-current">
                    {isDone ? '✓' : `0${s.num}`}
                  </span>
                  <span className="text-[13px] font-medium">{s.label}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[var(--hair)] text-[12px] text-[var(--muted)] leading-relaxed">
            Need immediate reporting? You can also file directly on{' '}
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline">
              cybercrime.gov.in
            </a>
            .
          </div>
        </div>

        {/* RIGHT COLUMN: Form Questions (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[var(--panel)] border border-[var(--hair)] rounded-[var(--radius-sm)] p-6 sm:p-8 space-y-8">
          {isProcessing ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <TimeSigil size={80} state="scanning" speed="fast" ghostTrail />
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-light text-[var(--text)]">
                  SEALING EVIDENCE VAULT
                </h2>
                <p className="font-mono text-[13px] text-[var(--accent)]">
                  Computing NIST SHA-256 cryptographic digests and locking audit coordinates...
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* STEP 1: Classification */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-light text-[var(--text)]">
                      WHAT OCCURRED?
                    </h2>
                    <p className="text-[14px] text-[var(--muted)] mt-1">
                      Choose the closest incident match. You can refine this classification later.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {incidentOptions.map((opt) => {
                      const isSelected = selectedType === opt.type;

                      return (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => setSelectedType(opt.type)}
                          className={`p-4 rounded-[var(--radius-sm)] border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 min-h-[96px] ${
                            isSelected
                              ? 'bg-[var(--raised)] border-[var(--accent)] shadow-[var(--spill-glow)]'
                              : 'bg-[var(--bg)] border-[var(--hair)] hover:border-[var(--muted)]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="p-2 rounded-[var(--radius-xs)] bg-[var(--panel)] border border-[var(--hair)]">
                              {opt.icon}
                            </span>
                            {isSelected && (
                              <CheckCircle2 size={16} className="text-[var(--accent)]" />
                            )}
                          </div>
                          <div>
                            <div className="text-[14px] font-semibold text-[var(--text)]">
                              {opt.type}
                            </div>
                            <div className="text-[12px] text-[var(--muted)] mt-1 leading-snug">
                              {opt.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Platform */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-light text-[var(--text)]">
                      WHERE WAS IT ENCOUNTERED?
                    </h2>
                    <p className="text-[14px] text-[var(--muted)] mt-1">
                      Select the online platform or service where the malicious activity originated.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {platforms.map((plat) => {
                      const isSelected = selectedPlatform === plat;

                      return (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => setSelectedPlatform(plat)}
                          className={`p-4 rounded-[var(--radius-sm)] border text-center transition-all cursor-pointer min-h-[56px] flex items-center justify-center font-medium text-[14px] ${
                            isSelected
                              ? 'bg-[var(--raised)] border-[var(--accent)] text-[var(--accent)] shadow-[var(--spill-glow)]'
                              : 'bg-[var(--bg)] border-[var(--hair)] text-[var(--text)] hover:border-[var(--muted)]'
                          }`}
                        >
                          <span>{plat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Identifiers */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-light text-[var(--text)]">
                      INCIDENT IDENTIFIERS
                    </h2>
                    <p className="text-[14px] text-[var(--muted)] mt-1">
                      Provide handles, links, or timestamps to establish cryptographic provenance.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-mono text-[var(--muted)] uppercase mb-1.5">
                        Suspect Handle / Username / Phone
                      </label>
                      <input
                        type="text"
                        value={accountHandle}
                        onChange={(e) => setAccountHandle(e.target.value)}
                        placeholder="@username or phone number"
                        className="w-full p-3 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] font-mono text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-mono text-[var(--muted)] uppercase mb-1.5">
                        Post / Profile URL (if active)
                      </label>
                      <input
                        type="url"
                        value={contentUrl}
                        onChange={(e) => setContentUrl(e.target.value)}
                        placeholder="https://platform.com/profile"
                        className="w-full p-3 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] font-mono text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-mono text-[var(--muted)] uppercase mb-1.5">
                        Date & Time Discovered (UTC)
                      </label>
                      <input
                        type="text"
                        value={discoveryDateTime}
                        onChange={(e) => setDiscoveryDateTime(e.target.value)}
                        className="w-full p-3 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] font-mono text-[14px] text-[var(--accent-bright)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-mono text-[var(--muted)] uppercase mb-1.5">
                        Summary of Occurrence (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Describe what occurred, any messages received, or actions taken..."
                        className="w-full p-3 bg-[var(--bg)] border border-[var(--hair)] rounded-[var(--radius-xs)] text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Evidence Upload */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-light text-[var(--text)]">
                      PRESERVE EVIDENCE
                    </h2>
                    <p className="text-[14px] text-[var(--muted)] mt-1">
                      Drop screenshots, recordings, exported chats, or headers. Hashes are computed client-side immediately.
                    </p>
                  </div>

                  <UploadDropzone files={files} onFilesChange={setFiles} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-8 border-t border-[var(--hair)]">
                {currentStep > 1 ? (
                  <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={handleBack}>
                    Back
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => navigate('/chronicle')}>
                    Cancel
                  </Button>
                )}

                {currentStep < 4 ? (
                  <Button variant="primary" icon={<ArrowRight size={16} />} onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button variant="primary" icon={<ShieldCheck size={16} />} onClick={handleSubmit}>
                    Preserve & Seal Case
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
