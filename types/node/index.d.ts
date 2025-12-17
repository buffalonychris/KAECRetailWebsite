declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY?: string;
    MAIL_FROM?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
  }

  interface Process {
    env: ProcessEnv;
  }
}

declare var process: NodeJS.Process;

declare module 'node:process' {
  const process: NodeJS.Process;
  export = process;
}
