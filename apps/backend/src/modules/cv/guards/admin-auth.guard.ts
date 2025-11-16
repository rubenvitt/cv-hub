/**
 * TODO Epic 5: Replace with real AdminAuthGuard using session validation
 * Current implementation is a placeholder that bypasses all requests (EPIC_2_ADMIN_PLACEHOLDER_MODE=bypass)
 * Epic 5 will implement:
 * - Session-based authentication
 * - Admin role verification
 * - CSRF protection
 * - Rate limiting
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
 * AdminAuthGuard - Placeholder Admin Authentication Guard for Epic 2
 *
 * This is a placeholder implementation that will be replaced in Epic 5
 * with real session-based authentication logic. Current behavior:
 * - Bypass mode (EPIC_2_ADMIN_PLACEHOLDER_MODE=bypass): Allows all requests
 * - Strict mode (EPIC_2_ADMIN_PLACEHOLDER_MODE=strict): Returns 501 Not Implemented
 *
 * Forward Compatibility:
 * - Guard interface remains identical for Epic 5
 * - Epic 5 will add session validation and admin role checks
 * - No breaking changes for controller or tests
 *
 * Epic 2: CV Data Foundation
 * Story 2.8: Admin CV Endpoints (Placeholder Admin Guard)
 *
 * @see docs/stories/2-8-admin-cv-endpoints.md
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  private readonly logger = new Logger(AdminAuthGuard.name);

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
   * Epic 5 Behavior (Future):
   * - Extract session from request cookies
   * - Validate session in database/cache
   * - Verify admin role/permissions
   * - Check CSRF token
   * - Return true if valid admin, false if invalid
   *
   * @param _context - ExecutionContext from NestJS (unused in placeholder)
   * @returns true (bypass mode) or throws NotImplementedException (strict mode)
   *
   * @throws {NotImplementedException} When EPIC_2_ADMIN_PLACEHOLDER_MODE=strict
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(_context: ExecutionContext): boolean {
    // Get placeholder mode from environment (default: bypass)
    const mode = this.configService.get<string>('EPIC_2_ADMIN_PLACEHOLDER_MODE', 'bypass');

    // Validate mode is a known value - FAIL CLOSED on invalid config
    if (mode !== 'bypass' && mode !== 'strict') {
      this.logger.error(
        `Invalid EPIC_2_ADMIN_PLACEHOLDER_MODE: ${mode}. Must be 'bypass' or 'strict'. Failing closed.`,
      );
      throw new NotImplementedException('Invalid guard configuration. See logs.');
    }

    // Log warning to indicate placeholder nature
    this.logger.warn(
      '⚠️  Placeholder AdminAuthGuard active - Epic 5 implements real admin authentication',
    );

    // Bypass mode: Allow all requests
    if (mode === 'bypass') {
      return true;
    }

    // Strict mode: Throw 501 Not Implemented
    throw new NotImplementedException('Admin authentication not yet implemented. See Epic 5.');
  }
}
