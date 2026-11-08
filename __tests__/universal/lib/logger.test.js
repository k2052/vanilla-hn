import { describe, expect, it, vi } from 'vitest'
import logger from '../../../src/universal/lib/logger'

describe('logger', () => {
  it('provides log, warn, and error methods', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    logger.error('test error')
    expect(errorSpy).toHaveBeenCalledWith('test error')

    logger.warn('test warn')
    expect(warnSpy).toHaveBeenCalledWith('test warn')

    logger.log('test log')

    errorSpy.mockRestore()
    warnSpy.mockRestore()
  })
})
