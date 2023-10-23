import { CanActivateFn } from '@angular/router';

export const supervisorGuard: CanActivateFn = (route, state) => {
  return true;
};
