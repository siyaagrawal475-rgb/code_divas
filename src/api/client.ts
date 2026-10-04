import type { Incident, EvidenceItem, IncidentType, Platform } from '../types';

export interface CreateIncidentInput {
  type: IncidentType;
  platform: Platform;
  accountHandle: string;
  contentUrl: string;
  details: string;
  files?: File[];
}

export const api = {
  async getIncidents(): Promise<Incident[]> {
    const res = await fetch('/api/incidents');
    if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.statusText}`);
    return res.json();
  },

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch incident ${id}: ${res.statusText}`);
    return res.json();
  },

  async createIncident(input: CreateIncidentInput): Promise<Incident> {
    const formData = new FormData();
    formData.append('type', input.type);
    formData.append('platform', input.platform);
    formData.append('accountHandle', input.accountHandle);
    formData.append('contentUrl', input.contentUrl);
    formData.append('details', input.details);

    if (input.files && input.files.length > 0) {
      for (const file of input.files) {
        formData.append('files', file);
      }
    }

    const res = await fetch('/api/incidents', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create incident: ${res.statusText}`);
    }

    return res.json();
  },

  async uploadEvidence(incidentId: string, files: File[]): Promise<{ evidence: EvidenceItem[]; incident: Incident }> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    const res = await fetch(`/api/incidents/${incidentId}/evidence`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error(`Failed to upload evidence: ${res.statusText}`);
    return res.json();
  },

  async sealIncident(incidentId: string): Promise<{ success: boolean; sealedAt: string; sealHash: string }> {
    const res = await fetch(`/api/incidents/${incidentId}/seal`, {
      method: 'POST',
    });

    if (!res.ok) throw new Error(`Failed to seal incident: ${res.statusText}`);
    return res.json();
  },

  async reanalyzeIncident(incidentId: string): Promise<{ success: boolean; aiAnalysis: any; graphNodes: any[]; graphEdges: any[] }> {
    const res = await fetch(`/api/incidents/${incidentId}/reanalyze`, {
      method: 'POST',
    });

    if (!res.ok) throw new Error(`Failed to reanalyze incident: ${res.statusText}`);
    return res.json();
  },

  async getReportText(incidentId: string): Promise<{ incidentId: string; reportText: string; sealed: boolean; sealHash?: string }> {
    const res = await fetch(`/api/incidents/${incidentId}/report`);
    if (!res.ok) throw new Error(`Failed to get report: ${res.statusText}`);
    return res.json();
  },

  getReportDownloadUrl(incidentId: string): string {
    return `/api/incidents/${incidentId}/report?download=true`;
  },

  async deleteIncident(incidentId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/incidents/${incidentId}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(`Failed to delete incident: ${res.statusText}`);
    return res.json();
  },

  async getStats(): Promise<{ totalIncidents: number; totalEvidence: number; sealedIncidents: number; highRiskIncidents: number }> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.statusText}`);
    return res.json();
  },
};
