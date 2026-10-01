import { ProviderMode, ProviderStatus, ProviderVerificationResult } from '../types';
export const createProvider=(providerId:string,providerName:string,defaultMode:ProviderMode='MOCK')=>({
  providerId,providerName,
  verify(submittedValue:string,sourceValue=submittedValue,mode:ProviderMode=defaultMode,status:ProviderStatus=mode==='UNAVAILABLE'?'unavailable':'verified'):ProviderVerificationResult{
    return {providerId,providerName,mode,status,queriedAt:new Date().toISOString(),referenceId:`${providerId.toUpperCase()}-SYN-2026`,submittedValue,sourceValue,normalizedValue:sourceValue.trim().toUpperCase(),confidence:status==='unavailable'?0:97,evidenceId:`EV-26041-${providerId.toUpperCase()}-001`,rawSnapshot:{synthetic:true,mode,notice:'Prototype response; no live government connectivity is claimed.'}};
  }
});
