/**
 * TODO Epic 4: Implement real InviteGuard with database token validation
 * Current implementation is a placeholder that bypasses all requests (EPIC_2_PLACEHOLDER_MODE=bypass)
 * Epic 4 will implement:
 * - Database lookup for token existence
 * - Validation: isActive, expiresAt
 * - Visit tracking (visitCount, lastVisitAt)
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * InviteGuard - Placeholder Token Guard for Epic 2
 *
 * This is a placeholder implementation that will be replaced in Epic 4
 * with real token validation logic. Current behavior:
 * - Bypass mode (EPIC_2_PLACEHOLDER_MODE=bypass): Allows all requests
 * - Strict mode (EPIC_2_PLACEHOLDER_MODE=strict): Returns 501 Not Implemented
 *
 * Forward Compatibility:
 * - Guard interface remains identical for Epic 4
 * - Epic 4 will add database token validation
 * - No breaking changes for controller or tests
 *
 * Epic 2: CV Data Foundation
 * Story 2.7: GET /api/cv/private/:token Endpoint (Placeholder Guard)
 *
 * @see docs/stories/2-7-get-api-cv-private-token-endpoint-placeholder-guard.md
 */
@Injectable()
export class InviteGuard implements CanActivate {
  private readonly logger = new Logger(InviteGuard.name);

  /**
   * Constructor with Dependency Injection
   *
   * @param configService - NestJS ConfigService for environment variables
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Determines if the request should be allowed to proceed.
   *
   * Placeholder Behavior:
   * - Bypass mode: Always returns true (allows all requests)
   * - Strict mode: Throws NotImplementedException (HTTP 501)
   *
   * Epic 4 Behavior (Future):
   * - Extract token from route parameters
   * - Look up token in database
   * - Validate: exists, isActive, expiresAt
   * - Track visit: increment visitCount, update lastVisitAt
   * - Return true if valid, false if invalid
   *
   * @param _context - ExecutionContext from NestJS (unused in placeholder)
   * @returns true (bypass mode) or throws NotImplementedException (strict mode)
   *
   * @throws {NotImplementedException} When EPIC_2_PLACEHOLDER_MODE=strict
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(_context: ExecutionContext): boolean {
    // Get placeholder mode from environment (default: strict for fail-closed security)
    const mode = this.configService.get<string>('EPIC_2_PLACEHOLDER_MODE', 'strict');

    // Validate mode is a known value - FAIL CLOSED on invalid config
    if (mode !== 'bypass' && mode !== 'strict') {
      this.logger.error(
        `Invalid EPIC_2_PLACEHOLDER_MODE: ${mode}. Must be 'bypass' or 'strict'. Failing closed.`,
      );
      throw new NotImplementedException('Invalid guard configuration. See logs.');
    }

    // Log warning to indicate placeholder nature
    this.logger.warn('⚠️ Placeholder Guard active - Epic 4 implements real validation');

    // Bypass mode: Allow all requests
    if (mode === 'bypass') {
      return true; // Allow all requests (testing mode)
    }

    // strict mode: Not yet implemented
    throw new NotImplementedException('Token-based access not yet implemented. See Epic 4.');
  }
}
