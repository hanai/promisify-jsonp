export type CrossOrigin = 'anonymous' | 'use-credentials' | '';

export interface PJSONPOptions {
    timeout?: number;
    params?: Record<string, any>;
    callbackNamePrefix?: string;
    callbackName?: string;
    callbackParamName?: string;
    encode?: boolean;
    crossOrigin?: CrossOrigin;
}

declare const pjsonp: <T>(url: string, opts?: PJSONPOptions) => Promise<T>;

export default pjsonp;
