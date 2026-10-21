import test from 'node:test';
import assert from 'node:assert/strict';
import { scorePacket, validatePacket } from '../src/application_readiness.js';

const packet = {
  candidateName: 'Siva Dheeraj',
  role: 'Full Stack Developer Intern',
  resume: 'React Node.js TypeScript REST PostgreSQL MongoDB Git',
  roleKeywords: ['React', 'Node.js', 'REST', 'MongoDB', 'Git'],
  projectLinks: ['https://github.com/Sivadheeraj5356/scalejobs-application-readiness'],
  submissionChecks: ['pdf-under-5mb', 'links-checked']
};

test('accepts a complete tailored application packet', () => {
  const result = scorePacket(packet);
  assert.equal(result.ready, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.metrics.coverage, 1);
});

test('rejects missing packet sections', () => {
  const incomplete = { candidateName: 'Siva Dheeraj', role: 'Full Stack Developer Intern' };
  assert.deepEqual(validatePacket(incomplete), ['resume is required', 'roleKeywords is required', 'projectLinks is required', 'submissionChecks is required']);
});

test('low keyword coverage blocks submission', () => {
  const weak = { ...packet, resume: 'Python FastAPI' };
  const result = scorePacket(weak);
  assert.equal(result.ready, false);
  assert.equal(result.metrics.matchedCount, 0);
});
