export interface FirstChildProcessEvent {
  readonly type: number
  readonly event: any
  readonly stdout: string
  readonly stderr: string
}
