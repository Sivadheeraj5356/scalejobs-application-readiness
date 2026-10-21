const REQUIRED_PARTS = ['resume', 'roleKeywords', 'projectLinks', 'submissionChecks'];

export function validatePacket(packet) {
  const errors = [];
  if (!packet || typeof packet !== 'object') return ['packet must be an object'];
  if (!packet.candidateName) errors.push('candidateName is required');
  if (!packet.role) errors.push('role is required');
  for (const part of REQUIRED_PARTS) {
    if (!packet[part]) errors.push(`${part} is required`);
  }
  if (packet.roleKeywords && (!Array.isArray(packet.roleKeywords) || packet.roleKeywords.length === 0)) errors.push('roleKeywords must be a non-empty array');
  if (packet.projectLinks && (!Array.isArray(packet.projectLinks) || packet.projectLinks.length === 0)) errors.push('projectLinks must be a non-empty array');
  return errors;
}

export function scorePacket(packet) {
  const errors = validatePacket(packet);
  const keywords = packet.roleKeywords || [];
  const resumeText = `${packet.resume || ''}`.toLowerCase();
  const matched = keywords.filter((keyword) => resumeText.includes(String(keyword).toLowerCase()));
  const coverage = keywords.length ? matched.length / keywords.length : 0;
  return {
    ready: errors.length === 0 && coverage >= 0.6,
    errors,
    metrics: { keywordCount: keywords.length, matchedCount: matched.length, coverage: Number(coverage.toFixed(2)) }
  };
}
