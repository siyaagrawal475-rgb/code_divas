// Screen 3: New Incident Wizard
// Memorable element: The single quadrant-filling progress ring.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TimeSigil } from '../components/TimeSigil';
import { UploadDropzone } from '../components/UploadDropzone';
import type { UploadedFileItem } from '../components/UploadDropzone';
import type { IncidentType, Platform } from '../types';

export const NewIncidentPage: React.FC = () => {
  const navigate = useNavigate();
  const { createIncident } = useIncidents();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form State
  const [selectedType, setSelectedType] = useState<IncidentType>('Impersonation');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Instagram');
  const [accountHandle, setAccountHandle] = useState<string>('@fake_profile_clone');
  const [contentUrl, setContentUrl] = useState<string>('https://instagram.com/fake_profile_clone');
  const [discoveryDateTime, setDiscoveryDateTime] = useState<string>(() => {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
  });
  const [details, setDetails] = useState<string>('');
  const [files, setFiles] = useState<UploadedFileItem[]>([]);

  const steps = [
    { num: 1, label: 'What happened' },
    { num: 2, label: 'Where you found it' },
    { num: 3, label: 'What you know' },
    { num: 4, label: 'Preserve evidence' },
  ];

  const incidentOptions: {
    type: IncidentType;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'Impersonation',
      desc: 'Someone is pretending to be you.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      type: 'Deepfake or manipulation',
      desc: 'A fake image, video or audio of you.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20M12 2v20" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      ),
    },
    {
      type: 'Image misuse',
      desc: 'Your photos shared or edited without your consent.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
    },
    {
      type: 'Harassment',
      desc: 'Threats or targeted abuse.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      type: 'Fake link or scam',
      desc: 'A fraudulent link or account using your name.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      type: 'Other',
      desc: "Anything that doesn't fit above.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
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
    await new Promise((r) => setTimeout(r, 1500));

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

  // 64px Progress Ring Arc Calculations
  const radius = 26;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (currentStep / 4) * circumference;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '64px', alignItems: 'start' }}>
      {/* LEFT COLUMN: 280px Progress Indicator & Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Small 64px Sigil-style Progress Ring */}
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="var(--hair)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="var(--green)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset .4s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: 'var(--text)' }}>
            0{currentStep}
          </div>
        </div>

        {/* Step Names List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((s) => {
            const isCurrent = currentStep === s.num;
            const isDone = currentStep > s.num;

            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingLeft: isCurrent ? '10px' : '12px',
                  borderLeft: isCurrent ? '2px solid var(--green)' : 'none',
                  color: isCurrent ? 'var(--text)' : isDone ? 'var(--soft)' : 'var(--muted)',
                  fontSize: '15px',
                  fontWeight: isCurrent ? 500 : 400,
                  transition: 'color .18s',
                }}
              >
                {isDone ? (
                  <span style={{ color: 'var(--green)', fontSize: '14px', lineHeight: 1 }}>✓</span>
                ) : (
                  <span style={{ color: isCurrent ? 'var(--green)' : 'var(--muted)', fontSize: '13px', fontFamily: '"JetBrains Mono", monospace' }}>
                    0{s.num}
                  </span>
                )}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Question & Ruled Form (max 640px) */}
      <div style={{ maxWidth: '640px', width: '100%' }}>
        {/* Processing Sealing State */}
        {isProcessing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: '24px', textAlign: 'center' }}>
            <TimeSigil size={64} state="scanning" showClock={false} />
            <div>
              <h2 className="heading-2">Preserving incident</h2>
              <p className="muted-text" style={{ marginTop: '8px' }}>
                Computing cryptographic hashes and sealing evidence in local memory...
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* STEP 1: What happened? */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h1 className="heading-1">What happened?</h1>
                  <p className="muted-text" style={{ marginTop: '6px' }}>
                    Choose the closest match. You can add detail later.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--hair)' }}>
                  {incidentOptions.map((opt) => {
                    const isSelected = selectedType === opt.type;

                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setSelectedType(opt.type)}
                        style={{
                          height: '72px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '0 16px',
                          background: isSelected ? 'var(--panel)' : 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--hair)',
                          borderLeft: isSelected ? '2px solid var(--green)' : 'none',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background .18s',
                        }}
                      >
                        <span style={{ color: isSelected ? 'var(--green)' : 'var(--muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          {opt.icon}
                        </span>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '15px', color: isSelected ? 'var(--text)' : 'var(--text)' }}>
                            {opt.type}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Where did you find it? */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h1 className="heading-1">Where did you find it?</h1>
                  <p className="muted-text" style={{ marginTop: '6px' }}>
                    Select the platform where the incident occurred.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--hair)' }}>
                  {platforms.map((plat) => {
                    const isSelected = selectedPlatform === plat;

                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setSelectedPlatform(plat)}
                        style={{
                          height: '56px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 16px',
                          background: isSelected ? 'var(--panel)' : 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--hair)',
                          borderLeft: isSelected ? '2px solid var(--green)' : 'none',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          fontSize: '15px',
                          transition: 'background .18s',
                        }}
                      >
                        <span>{plat}</span>
                        {isSelected && <span style={{ color: 'var(--green)' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: What do you know? */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <h1 className="heading-1">What do you know?</h1>
                  <p className="muted-text" style={{ marginTop: '6px' }}>
                    Add any specific identifiers you have right now.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>
                      Account handle or username
                    </label>
                    <input
                      type="text"
                      value={accountHandle}
                      onChange={(e) => setAccountHandle(e.target.value)}
                      placeholder="@username"
                      className="input-underline input-underline-mono"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>
                      Content URL (if available)
                    </label>
                    <input
                      type="url"
                      value={contentUrl}
                      onChange={(e) => setContentUrl(e.target.value)}
                      placeholder="https://..."
                      className="input-underline input-underline-mono"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>
                      When you found it
                    </label>
                    <input
                      type="text"
                      value={discoveryDateTime}
                      onChange={(e) => setDiscoveryDateTime(e.target.value)}
                      className="input-underline input-underline-mono"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>
                      Additional details (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="What occurred, how you noticed it..."
                      className="input-underline"
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Preserve evidence */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h1 className="heading-1">Preserve evidence</h1>
                  <p className="muted-text" style={{ marginTop: '6px' }}>
                    Upload images, videos, logs or documents to create a cryptographic record.
                  </p>
                </div>

                <UploadDropzone files={files} onFilesChange={setFiles} />
              </div>
            )}

            {/* Actions Bar: Continue and Back */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '40px' }}>
              {currentStep < 4 ? (
                <button type="button" className="app-btn" onClick={handleNext}>
                  Continue
                </button>
              ) : (
                <button type="button" className="app-btn" onClick={handleSubmit}>
                  Preserve incident
                </button>
              )}

              {currentStep > 1 ? (
                <button type="button" className="app-link" onClick={handleBack}>
                  Back
                </button>
              ) : (
                <button type="button" className="app-link" onClick={() => navigate('/chronicle')}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
