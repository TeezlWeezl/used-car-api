import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // data: data passed to the decorator
  // context: this is esentially the incomming request.
  //This can also be used to abstract other protocols like websocket.
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
