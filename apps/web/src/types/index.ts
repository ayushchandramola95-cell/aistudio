export interface Model {
  id: string;
  display_name: string;
  provider: string;
  family: string;
  version: string;
  backend_type: "hosted_api" | "gpu_worker";
  supported_tasks: string[];
  parameter_schema: Record<string, any>;
  base_credit_cost: number;
  status: "active" | "maintenance" | "disabled";
  commercial_license: string;
  is_approved_for_paid: boolean;
}

export interface CreditAccount {
  user_id: string;
  balance: number;
  reserved: number;
  available: number;
  lifetime_spent: number;
}

export interface CreditTransaction {
  id: string;
  type: "PURCHASE" | "RESERVE" | "SETTLE" | "REFUND" | "ADJUSTMENT";
  amount: number;
  balance_after: number;
  reason: string | null;
  created_at: string;
  job_id: string | null;
}

export interface JobOutput {
  id: string;
  file_key: string;
  storage_provider: string;
  mime_type: string;
  width?: number;
  height?: number;
  download_url?: string;
  thumbnail_key?: string;
}

export interface GenerationJob {
  id: string;
  model_id: string;
  task_type: string;
  raw_prompt: string;
  enhanced_prompt: string | null;
  parameters: Record<string, any>;
  status: "PENDING" | "RESERVED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  progress: number;
  error_message: string | null;
  credits_reserved: number;
  credits_charged: number;
  created_at: string;
  completed_at: string | null;
  outputs: JobOutput[];
}

