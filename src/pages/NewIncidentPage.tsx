import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TopBar } from '../components/TopBar';
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
  ArrowRight,
  ArrowLeft,
  Clock,
  Globe,
  AtSign,
} from 'lucide-react';
import {
  LockIcon,
  RegistrationMark,
  SealIcon,
} from '../components/CustomIcons';
import { BgSigilField } from '../components/BgSigilField';

export const NewIncidentPage: React.FC = () => {
  const navigate = useNavigate();
  const { createIncident } = useIncidents();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  // Form State
  const [selectedType, setSelectedType] = useState<IncidentType>('Impersonation');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Instagram');
  const [accountHandle, setAccountHandle] = useState<string>('@fake_profile_clone');
  const [contentUrl, setContentUrl] = useState<string>('https://instagram.com/fake_profile_clone');
  const [discoveryDateTime, setDiscoveryDateTime] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  });
  const [details, setDetails] = useState<string>('');
  const [files, setFiles] = useState<UploadedFileItem[]>([]);

  const incidentOptions: {
    type: IncidentType;
    icon: React.ReactNode;
    desc: string;
    sigilMark: string;
  }[] = [
    {
      type: 'Impersonation',
      icon: <UserX size={16} strokeWidth={1.5} />,
      desc: 'Cloned profiles, fake bio, identity hijacking.',
      sigilMark: '⌖ IMPERSONATION',
    },
    {
      type: 'Deepfake or manipulation',
      icon: <Sparkles size={16} strokeWidth={1.5} />,
      desc: 'AI-generated face swap, voice clone, synthetic media.',
      sigilMark: '⌖ SYNTHETIC MEDIA',
    },
    {
      type: 'Image misuse',
      icon: <ImageIcon size={16} strokeWidth={1.5} />,
      desc: 'Non-consensual sharing, altered photos, unauthorized reposts.',
      sigilMark: '⌖ MEDIA MISUSE',
    },
    {
      type: 'Harassment',
      icon: <MessageSquareWarning size={16} strokeWidth={1.5} />,
      desc: 'Targeted abuse, coordinated trolling, threat messages.',
      sigilMark: '⌖ TARGETED ABUSE',
    },
    {
      type: 'Fake link or scam',
      icon: <Link2 size={16} strokeWidth={1.5} />,
      desc: 'Phishing links, fake donation requests, fraudulent ads.',
      sigilMark: '⌖ PHISHING DECEPTION',
    },
    {
      type: 'Other',
      icon: <HelpCircle size={16} strokeWidth={1.5} />,
      desc: 'General privacy violation or unlisted digital incident.',
      sigilMark: '⌖ UNLISTED TRACE',
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

    // Cryptographic sealing steps
    setProcessingStage('Generating Eye-of-Agamotto temporal anchor...');
    await new Promise((r) => setTimeout(r, 400));

    setProcessingStage('Computing NIST SHA-256 integrity digest...');
    await new Promise((r) => setTimeout(r, 450));

    setProcessingStage('Binding incident to immutable local chronicle...');
    await new Promise((r) => setTimeout(r, 500));

    await createIncident({
      type: selectedType,
      platform: selectedPlatform,
      accountHandle,
      contentUrl,
      details,
      files,
    });

    setIsProcessing(false);
    navigate('/archive');
  };

  // Arc calculations for the Single Ring Progress Indicator
  const radius = 28;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (currentStep / 4) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#070908] relative overflow-hidden grain-overlay">
      <BgSigilField size={600} opacity={0.06} className="top-10 right-10" />

      <TopBar
        title="Intake Incident"
        subtitle="Forensic evidence preservation protocol."
        breadcrumbs={[
          { label: 'Chronicle', href: '/chronicle' },
          { label: 'Intake Incident' },
        ]}
      />

      <div className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6 relative z-10">
        {/* Asymmetric Header with Single Ring Arc Progress Indicator */}
        <div className="p-5 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] flex flex-col sm:flex-row sm:items-center justify-between gap-4 clip-tag-tr">
          <div>
            <div className="flex items-center gap-2">
              <span className="label-tracked text-[#C9A24B]">TIME STONE INTAKE WIZARD</span>
              <span className="text-[#1F2B25]">|</span>
              <span className="font-mono text-[10px] text-[#45E08A]">STEP 0{currentStep} / 04</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#E8F0EB] mt-1">
              {currentStep === 1 && 'Incident Classification'}
              {currentStep === 2 && 'Origin Platform & Endpoint'}
              {currentStep === 3 && 'Account & Temporal Parameters'}
              {currentStep === 4 && 'Evidence Ingestion & Hashing'}
            </h2>
            <p className="font-mono text-xs text-[#7F8D85] mt-0.5">
              {currentStep === 1 && 'Select the primary violation category.'}
              {currentStep === 2 && 'Identify platform provenance rules.'}
              {currentStep === 3 && 'Provide targeted handle and discovery time.'}
              {currentStep === 4 && 'Drop files for instant client-side SHA-256 sealing.'}
            </p>
          </div>

          {/* Time Sigil Arc Progress Indicator */}
          <div className="flex items-center gap-4 shrink-0 bg-[#070908] p-3 rounded-[2px] border border-[#1F2B25]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg]">
                {/* Background Ring */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  fill="none"
                  stroke="#1F2B25"
                  strokeWidth={strokeWidth}
                />
                {/* Gold Bezel Track */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius - 4}
                  fill="none"
                  stroke="#C9A24B"
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                  opacity="0.6"
                />
                {/* Active Arc Progress */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  fill="none"
                  stroke="#45E08A"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              {/* Center Step Number & Time Stone dot */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono text-xs font-bold text-[#E8F0EB]">
                  0{currentStep}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#45E08A] gem-glow-sm" />
              </div>
            </div>

            <div className="font-mono text-[10px] space-y-0.5 leading-tight">
              <span className="text-[#C9A24B] block font-bold">ARC FILL: {progressPercent}%</span>
              <span className="text-[#7F8D85] block">
                {currentStep === 4 ? 'FINAL SEAL' : `NEXT: STEP 0${currentStep + 1}`}
              </span>
            </div>
          </div>
        </div>

        {/* Wizard Form Body Panel */}
        <div className="p-6 md:p-8 rounded-[2px] bg-[#0D1210] border border-[#1F2B25] space-y-6">
          {/* STEP 1: What happened? */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F2B25]">
                <span className="label-tracked">Select violation taxonomy</span>
                <RegistrationMark size={10} className="text-[#7F8D85]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {incidentOptions.map((opt) => {
                  const isSelected = selectedType === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => setSelectedType(opt.type)}
                      className={`relative p-4 rounded-[2px] border transition-all duration-150 cursor-pointer text-left flex flex-col justify-between select-none ${
                        isSelected
                          ? 'bg-[#121A16] border-[#45E08A] shadow-[0_0_12px_rgba(69,224,138,0.15)]'
                          : 'bg-[#070908] border-[#1F2B25] hover:border-[#2E3E36] hover:bg-[#0A0E0C]'
                      }`}
                    >
                      {/* Sigil corner mark when selected */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-[#45E08A]">
                          <span className="absolute -top-[17px] right-[2px] text-[8px] font-mono text-[#070908] font-bold">
                            ✓
                          </span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-7 h-7 rounded-[2px] border flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#0E3B27] border-[#45E08A] text-[#45E08A]'
                                : 'bg-[#0D1210] border-[#1F2B25] text-[#7F8D85]'
                            }`}
                          >
                            {opt.icon}
                          </div>
                          <span className="font-mono text-[9px] text-[#C9A24B]">
                            {isSelected ? 'ACTIVE SELECTION' : ''}
                          </span>
                        </div>

                        <div className="font-mono text-xs font-semibold text-[#E8F0EB]">
                          {opt.type}
                        </div>
                        <div className="text-[11px] text-[#7F8D85] mt-1 font-mono leading-relaxed">
                          {opt.desc}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#1F2B25]/60 font-mono text-[9px] text-[#7F8D85]">
                        {opt.sigilMark}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Where did you find it? */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F2B25]">
                <span className="label-tracked">Select target platform</span>
                <RegistrationMark size={10} className="text-[#7F8D85]" />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2.5">
                  {platforms.map((plat) => {
                    const isSelected = selectedPlatform === plat;
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setSelectedPlatform(plat)}
                        className={`px-4 py-2.5 rounded-[2px] font-mono text-xs font-medium border transition-all cursor-pointer select-none clip-tag-tr ${
                          isSelected
                            ? 'bg-[#121A16] border-[#45E08A] text-[#45E08A] shadow-[0_0_8px_rgba(69,224,138,0.2)]'
                            : 'bg-[#070908] border-[#1F2B25] text-[#7F8D85] hover:text-[#E8F0EB] hover:border-[#2E3E36]'
                        }`}
                      >
                        <span className="mr-1.5 opacity-60">⌖</span>
                        <span>{plat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-[#070908] border border-[#1F2B25] rounded-[2px] flex items-center gap-3 font-mono text-xs text-[#7F8D85]">
                <Globe size={16} className="text-[#45E08A] shrink-0" />
                <span>
                  Parser rules will prioritize{' '}
                  <strong className="text-[#E8F0EB]">{selectedPlatform}</strong> DOM preservation and timestamp calibration.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Account handle and timestamp */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F2B25]">
                <span className="label-tracked">Temporal & identity coordinates</span>
                <RegistrationMark size={10} className="text-[#7F8D85]" />
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Account Handle */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-medium text-[#E8F0EB] flex items-center gap-1.5">
                    <AtSign size={12} className="text-[#45E08A]" />
                    <span>TARGET ACCOUNT HANDLE / PROFILE</span>
                  </label>
                  <input
                    type="text"
                    value={accountHandle}
                    onChange={(e) => setAccountHandle(e.target.value)}
                    placeholder="@impersonator_handle"
                    className="w-full h-8.5 px-3 rounded-[2px] bg-[#070908] border border-[#1F2B25] text-xs text-[#E8F0EB] focus-visible:border-[#45E08A] focus-visible:outline-none"
                  />
                </div>

                {/* Content URL */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-medium text-[#E8F0EB] flex items-center gap-1.5">
                    <Link2 size={12} className="text-[#45E08A]" />
                    <span>ENDPOINT CONTENT URL (OPTIONAL)</span>
                  </label>
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="https://platform.com/profile"
                    className="w-full h-8.5 px-3 rounded-[2px] bg-[#070908] border border-[#1F2B25] text-xs text-[#E8F0EB] focus-visible:border-[#45E08A] focus-visible:outline-none"
                  />
                </div>

                {/* Discovery Date/Time */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-medium text-[#E8F0EB] flex items-center gap-1.5">
                    <Clock size={12} className="text-[#C9A24B]" />
                    <span>DISCOVERY TIMESTAMP (UTC)</span>
                  </label>
                  <input
                    type="text"
                    value={discoveryDateTime}
                    onChange={(e) => setDiscoveryDateTime(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-[2px] bg-[#070908] border border-[#1F2B25] text-xs text-[#E8F0EB] focus-visible:border-[#45E08A] focus-visible:outline-none"
                  />
                </div>

                {/* Additional Details Textarea */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-medium text-[#E8F0EB]">
                    FORENSIC NARRATIVE & CONTEXT NOTES
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe specific timelines, unauthorized interactions, or suspicious indicators observed..."
                    className="w-full p-3 rounded-[2px] bg-[#070908] border border-[#1F2B25] text-xs text-[#E8F0EB] placeholder:text-[#7F8D85] focus-visible:border-[#45E08A] focus-visible:outline-none resize-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preserve evidence */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F2B25]">
                <span className="label-tracked">Evidence payload ingestion</span>
                <RegistrationMark size={10} className="text-[#7F8D85]" />
              </div>

              {/* Upload Dropzone */}
              <UploadDropzone files={files} onFilesChange={setFiles} />

              <div className="p-3 bg-[#070908] border border-[#1F2B25] rounded-[2px] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2 text-[#7F8D85]">
                  <LockIcon size={13} className="text-[#45E08A]" />
                  <span>Files will be assigned immutable SHA-256 seals</span>
                </div>
                <span className="text-[11px] text-[#45E08A]">
                  {files.length > 0 ? `${files.length} PAYLOADS READY` : 'DEFAULT RECON VAULT'}
                </span>
              </div>
            </div>
          )}

          {/* Cryptographic Processing Modal */}
          {isProcessing && (
            <div className="p-8 rounded-[2px] bg-[#070908] border border-[#45E08A] space-y-4 text-center select-none clip-tag-both shadow-[0_0_20px_rgba(69,224,138,0.2)]">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#45E08A] border-t-transparent animate-spin" />
                <div className="absolute w-2 h-2 rounded-full bg-[#45E08A] gem-glow-sm" />
              </div>
              <div>
                <div className="font-display text-base font-semibold text-[#E8F0EB]">
                  Sealing Incident Into Temporal Vault
                </div>
                <div className="text-xs font-mono text-[#45E08A] mt-1">{processingStage}</div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          {!isProcessing && (
            <div className="pt-4 border-t border-[#1F2B25] flex items-center justify-between">
              {currentStep > 1 ? (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<ArrowLeft size={13} />}
                  onClick={handleBack}
                >
                  Previous Step
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/chronicle')}
                >
                  Cancel Intake
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight size={13} />}
                  iconPosition="right"
                  onClick={handleNext}
                >
                  Continue [Step 0{currentStep + 1}]
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  icon={<SealIcon size={14} />}
                  onClick={handleSubmit}
                >
                  Cryptographically Seal Case
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
